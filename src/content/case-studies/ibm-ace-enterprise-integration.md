---
title: "Enterprise Integration on IBM App Connect Enterprise"
subtitle: "Two real integrations, start to finish. One REST API that brings customer records into the master data hub, and one flow that pushes them back out to SAP."
role: "Application Developer Analyst, then Senior Application Developer"
period: "May 2021 to Jul 2024"
readingTime: "8 min read"
stack: ["IBM ACE v11/v12", "IBM MQ", "ESQL", "REST / JSON", "OAuth + Basic Auth", "TLS", "AWS"]
excerpt: "How an inbound REST API and an outbound SAP sync were designed, secured and run on IBM App Connect Enterprise. Built as diagrams first."
cover: "⚙️"
---

<!--chapter:Overview-->

> System names, hostnames, URLs, ports and credentials on this page are placeholders. The flow design, the code patterns and the commands are my own work from a real enterprise engagement.

## What I built

I was an integration developer on a large customer data platform.

At the centre of the platform sits a **Master Data Management (MDM) hub**. It holds the one true copy of every customer record. Around it sit the systems that create, read or need a copy of that data: a sales portal, an ERP (SAP S/4HANA), a billing system and a reporting stack.

None of these systems talk to each other directly. **IBM App Connect Enterprise (ACE)** sits in the middle. It receives the message, checks it, changes its shape, sends it to the right place and sends an answer back.

I built and ran around 50 of these integrations over three years.

```mermaid
flowchart LR
  subgraph SRC ["Systems that send data in"]
    P["Sales portal"]
    B["Billing system"]
  end

  ACE{{"IBM ACE<br/>integration layer"}}
  MDM[("MDM hub<br/>golden record")]

  subgraph TGT ["Systems that receive data out"]
    S4["SAP S/4HANA"]
    RPT["Reporting / data lake"]
  end

  P -->|"REST + JSON"| ACE
  B -->|"REST + JSON"| ACE
  ACE <-->|"IBM MQ"| MDM
  ACE -->|"REST + JSON"| S4
  ACE -->|"files over SFTP"| RPT

  style ACE fill:#e6fcfd,stroke:#33d9e4,stroke-width:2px
  style MDM fill:#fff4e6,stroke:#f0a500,stroke-width:2px
```

## This page shows two of them

| | Flow | What it does |
| --- | --- | --- |
| 1 | **Inbound** | The sales portal calls my REST API with a customer in JSON. ACE checks it and hands it to the MDM hub. |
| 2 | **Outbound** | MDM has a new or updated record. ACE picks it up, logs in to SAP, and posts it there. |

Use the tabs above to move between them. Every diagram on this page opens full screen when you click it.

## The vocabulary, in one minute

If you have not used ACE before, this is the whole model.

An **integration node** is the running process. Inside it are **integration servers**, which are isolated containers for your work. You deploy an **application** into a server, and an application holds one or more **message flows**.

A message flow is a chain of small boxes called **nodes**. A message enters at one end and travels along the wires.

```mermaid
flowchart LR
  IN["Input node<br/>HTTP, MQ, File, Timer"] --> C["Compute node<br/>checks and reshapes<br/>the message (ESQL)"]
  C --> R{"Route node<br/>which way?"}
  R -->|"good"| OUT["Output node<br/>MQ, HTTP reply, File"]
  R -->|"bad"| SUB[["Error sub-flow<br/>shared by every flow"]]

  style IN fill:#e6fcfd,stroke:#33d9e4
  style OUT fill:#e6fcfd,stroke:#33d9e4
  style SUB fill:#ffe9e9,stroke:#e06c6c
```

A **sub-flow** is a small piece you build once and drop into many flows. I built the error handling as a sub-flow. That is why 50 flows fail in exactly the same way instead of 50 different ways.

<!--chapter:Inbound flow-->

## Inbound: portal calls my REST API

**The job.** A user creates or updates a customer in the sales portal. MDM needs its own copy so it stays the golden record.

The portal does not talk to MDM. It calls a REST API that I built and hosted on ACE. ACE checks the JSON, stamps a transaction ID on it, drops it on a queue for MDM, and answers the portal straight away.

```mermaid
flowchart TB
  U(["Portal user creates<br/>or updates a customer"])
  U --> P["Sales portal"]

  subgraph ACEBOX ["IBM ACE"]
    API["REST API<br/>POST /v1/customer"]
    VAL["Validate JSON"]
    TXN["Add unique<br/>transaction ID"]
    ACK["Build<br/>acknowledgement"]
  end

  Q1[("MQ queue<br/>PORTAL.MDM.CUST.REQ")]
  MDM["MDM hub"]
  DB[("MDM database")]
  S4["SAP S/4HANA"]

  P -->|"1. POST JSON<br/>basic auth over HTTPS"| API
  API --> VAL
  VAL --> TXN
  TXN -->|"2. put message"| Q1
  TXN --> ACK
  ACK -->|"3. 200 OK with txn ID"| P
  Q1 -->|"4. read message"| MDM
  MDM -->|"5. create or update"| DB
  MDM -->|"6. onward sync"| S4

  style API fill:#e6fcfd,stroke:#33d9e4,stroke-width:2px
  style ACEBOX fill:#f5fdfe,stroke:#c9e7ea
  style Q1 fill:#fff4e6,stroke:#f0a500
```

The portal gets its answer in step 3. It does not wait for MDM or SAP. That keeps the portal fast and means a slow database never blocks a user.

### Inside the message flow

This is what the flow looks like in the ACE toolkit, box by box.

```mermaid
flowchart LR
  HI["HTTP Input<br/>/v1/customer"] --> LOG["Compute<br/>log request"]
  LOG --> VAL{"Validate<br/>JSON"}
  VAL -->|"valid"| MAP["Compute<br/>add txn ID<br/>map to MDM shape"]
  VAL -->|"invalid"| ERR[["Error sub-flow"]]
  MAP --> MQO["MQ Output<br/>PORTAL.MDM.CUST.REQ"]
  MQO --> ACK["Compute<br/>build ACK JSON"]
  ACK --> HR["HTTP Reply"]
  ERR --> HR

  style HI fill:#e6fcfd,stroke:#33d9e4,stroke-width:2px
  style HR fill:#e6fcfd,stroke:#33d9e4,stroke-width:2px
  style ERR fill:#ffe9e9,stroke:#e06c6c
```

| Step | What happens |
| --- | --- |
| 1 | Portal posts JSON to the ACE URL over HTTPS with basic auth |
| 2 | ACE logs the raw request |
| 3 | ACE checks the JSON is well formed and the required fields are present |
| 4 | ACE adds a unique transaction ID, used as the MQ correlation ID |
| 5 | ACE puts the message on the MDM input queue |
| 6 | ACE builds an acknowledgement and replies to the portal |
| 7 | If anything fails, the error sub-flow builds an error response and the portal still gets a reply |

Step 7 is the one that matters most. **Every call gets an answer.** A silent failure is the worst outcome, because the portal sits waiting for a response that never arrives.

### What the portal sends

```json
{
  "customer": {
    "transactionId": "",
    "hubCustomerId": "",
    "customerName": "Northline Traders Pvt Ltd",
    "customerType": "Company",
    "taxId": "TIN-4471829",
    "email": "accounts@northline.example",
    "mobile": "9000000000",
    "address": {
      "line1": "Unit 4, Ring Road",
      "city": "Bengaluru",
      "postCode": "560001",
      "countryCode": "IN"
    },
    "taxRegistrations": [
      {
        "hubCustomerId": "",
        "taxNumber": "TR-KA-4471829",
        "state": "Karnataka",
        "billingCodes": [
          { "hubCustomerId": "", "billCode": "BC-1001", "isActive": "Y" }
        ]
      }
    ]
  }
}
```

`hubCustomerId` is the field that decides everything. Empty means create a new record. Filled in means update the one that already exists. The same three levels repeat down the structure, so one API handles create, update and extend.

### What ACE sends back

```json
{
  "status": "SUCCESS",
  "httpCode": 200,
  "transactionId": "PRT-20240118-000451",
  "message": "Customer request accepted and queued for MDM",
  "receivedAt": "2024-01-18T09:14:22.481Z"
}
```

### The mapping code

This is the Compute node in the middle. The patterns here are the ones I used in every flow: a reference variable so long paths are not repeated, `LocalEnvironment` to carry the transaction ID, and an explicit check before anything else runs.

```sql
CREATE COMPUTE MODULE MapInboundCustomerToHub
  CREATE FUNCTION Main() RETURNS BOOLEAN
  BEGIN
    CALL CopyMessageHeaders();

    DECLARE inCust REFERENCE TO InputRoot.JSON.Data.customer;

    -- One ID follows this record everywhere: MQ correlation, logs, error records
    DECLARE txnId CHARACTER
      'PRT-' || CAST(CURRENT_DATE AS CHARACTER FORMAT 'yyyyMMdd')
             || '-' || SUBSTRING(CAST(UUIDASCHAR AS CHARACTER) FROM 1 FOR 6);

    SET OutputLocalEnvironment.Variables.TxnId  = txnId;
    SET OutputLocalEnvironment.Variables.Source = 'PORTAL';

    IF inCust.customerName IS NULL OR TRIM(inCust.customerName) = '' THEN
      THROW USER EXCEPTION MESSAGE 2951
        VALUES ('customerName is mandatory and was not supplied');
    END IF;

    CREATE LASTCHILD OF OutputRoot DOMAIN('JSON');

    SET OutputRoot.JSON.Data.transactionId = txnId;
    SET OutputRoot.JSON.Data.sourceSystem  = 'PORTAL';
    SET OutputRoot.JSON.Data.customer      = inCust;
    SET OutputRoot.JSON.Data.customer.hubCustomerId =
        COALESCE(inCust.hubCustomerId, '');

    -- Correlation ID so MDM and ACE can be matched in the logs later
    SET OutputRoot.MQMD.CorrelId = CAST(txnId AS BLOB CCSID 1208);

    RETURN TRUE;
  END;

  CREATE PROCEDURE CopyMessageHeaders() BEGIN
    DECLARE i INTEGER 1;
    DECLARE c INTEGER CARDINALITY(InputRoot.*[]);
    WHILE i < c DO
      SET OutputRoot.*[i] = InputRoot.*[i];
      SET i = i + 1;
    END WHILE;
  END;
END MODULE;
```

`CopyMessageHeaders` is the first thing every ACE developer learns and the first thing they forget. Leave it out and the transformation still works, but the headers disappear and reply routing breaks under load.

### Error handling sub-flow

Errors do not get handled inside the main flow. They are thrown, caught by the failure terminal, and passed to one shared sub-flow.

```mermaid
flowchart LR
  MAIN["Main flow<br/>failure terminal"] --> EX["Compute<br/>read ExceptionList"]
  EX --> BUILD["Compute<br/>build error record<br/>txn ID, code, reason, payload"]
  BUILD --> FQ[("Failure queue")]
  BUILD --> LOGF["File Output<br/>error log"]
  BUILD --> RESP["Compute<br/>build error JSON"]
  RESP --> REPLY["HTTP Reply<br/>back to portal"]

  style MAIN fill:#ffe9e9,stroke:#e06c6c,stroke-width:2px
  style REPLY fill:#e6fcfd,stroke:#33d9e4,stroke-width:2px
```

ACE nests exceptions from the outside in, so the useful message is the deepest one. This walks down to it.

```sql
CREATE COMPUTE MODULE ErrorHandler_Extract
  CREATE FUNCTION Main() RETURNS BOOLEAN
  BEGIN
    DECLARE ex REFERENCE TO InputExceptionList.*[1];
    DECLARE errNum INTEGER;
    DECLARE errTxt CHARACTER;

    -- Walk to the innermost exception, which is the real cause
    WHILE ex.*[>] IS NOT NULL DO
      IF ex.Number IS NOT NULL THEN
        SET errNum = ex.Number;
        SET errTxt = ex.Text;
      END IF;
      MOVE ex LASTCHILD;
    END WHILE;

    SET OutputRoot.JSON.Data.status      = 'FAILURE';
    SET OutputRoot.JSON.Data.flow        = 'CustomerInbound';
    SET OutputRoot.JSON.Data.transactionId =
        InputLocalEnvironment.Variables.TxnId;
    SET OutputRoot.JSON.Data.errorCode   = errNum;
    SET OutputRoot.JSON.Data.errorReason = errTxt;
    SET OutputRoot.JSON.Data.retryNeeded = 'Y';
    SET OutputRoot.JSON.Data.timestamp   = CURRENT_TIMESTAMP;

    RETURN TRUE;
  END;
END MODULE;
```

Codes the portal team can rely on:

| Code | Meaning | Who retries |
| --- | --- | --- |
| `400` | Bad request. JSON is malformed or a mandatory field is missing | Portal, after fixing the data |
| `401` | Basic auth failed or the credential expired | Portal, with new credentials |
| `408` | Timeout while putting the message on the queue | Portal |
| `500` | Technical exception inside ACE | Support team, then the portal resends |

### The API details I shared with the inbound team

This is the page I gave the portal developers. Nothing else was needed to start integrating.

| Item | Value |
| --- | --- |
| ACE application | `Customer_Inbound_app` |
| Message flow | `Customer_Inbound.msgflow` |
| Integration server | `EG_HTTP` |
| Base URL (DEV) | `https://ace-dev-lb.int.example.com:8443` |
| Base URL (PROD) | `https://ace-prod-lb.int.example.com:8443` |
| Resource | `POST /v1/customer` |
| Content type | `application/json` |
| Authentication | HTTP basic auth over TLS 1.2 |
| Username | `portal_svc` |
| Password | issued per environment, never shared over email |
| MDM input queue | `PORTAL.MDM.CUST.REQ` |
| MDM output queue | `PORTAL.MDM.CUST.RES` |

```bash
curl -X POST \
  'https://ace-dev-lb.int.example.com:8443/v1/customer' \
  -u 'portal_svc:<password>' \
  -H 'Content-Type: application/json' \
  --data @customer-create.json
```

The password never lives in the flow or the deployed BAR file. The HTTP Input node points at a **security profile**, which points at a credential alias, which is resolved at runtime from the ACE vault. That is also why the exact same BAR file can be promoted from DEV to PROD without a rebuild.

```bash
# Create the credential the security profile resolves at runtime
mqsisetdbparms ACENODE -n portal_basicauth -u portal_svc -p '<password>'
mqsireportproperties ACENODE -o BrokerRegistry -r
```

<!--chapter:Outbound flow-->

## Outbound: MDM pushes the record to SAP

**The job.** The record is now in MDM. SAP S/4HANA needs its own copy.

This direction is harder than inbound. The target is an external REST API over TLS that will not accept anything until you have logged in. So ACE has to fetch a token first, then make the real call, then deal with whatever comes back.

```mermaid
flowchart TB
  MDM["MDM hub<br/>record created or updated"]
  Q1[("MQ queue<br/>MDM.SAP.CUST.REQ")]

  subgraph ACEBOX ["IBM ACE"]
    RD["Read message<br/>and log it"]
    TOK["Get token from<br/>SAP auth API"]
    HDR["Set token<br/>in the header"]
    CALL["Post customer<br/>to SAP API"]
    CHK{"HTTP<br/>status"}
    LOGR["Log the<br/>response"]
  end

  SAP["SAP S/4HANA<br/>REST API"]
  Q2[("MQ queue<br/>MDM.SAP.CUST.RES")]
  RETRY[("Retry / failure<br/>queue")]

  MDM -->|"1. put message"| Q1
  Q1 -->|"2. read"| RD
  RD --> TOK
  TOK -->|"3. token back"| HDR
  HDR --> CALL
  CALL -->|"4. POST JSON + bearer token"| SAP
  SAP -->|"5. SAP customer ID"| CHK
  CHK -->|"2xx"| LOGR
  CHK -->|"4xx / 5xx"| RETRY
  LOGR -->|"6. response for MDM"| Q2
  Q2 --> MDM

  style ACEBOX fill:#f5fdfe,stroke:#c9e7ea
  style Q1 fill:#fff4e6,stroke:#f0a500
  style Q2 fill:#fff4e6,stroke:#f0a500
  style RETRY fill:#ffe9e9,stroke:#e06c6c
```

### The login step, in order

```mermaid
sequenceDiagram
  autonumber
  participant M as MDM hub
  participant Q as IBM MQ
  participant A as IBM ACE
  participant S as SAP S/4HANA

  M->>Q: Put customer record on MDM.SAP.CUST.REQ
  Q->>A: MQ Input reads the message
  A->>A: Log request, keep transaction ID
  A->>S: GET /oauth/token (client credentials)
  S-->>A: access_token, expires_in 3600
  A->>A: Set Authorization header on the request
  A->>S: POST /v1/business-partners with the customer JSON
  S-->>A: 201 Created, SAP customer ID
  A->>A: Log the response
  A->>Q: Put the response on MDM.SAP.CUST.RES
  Q->>M: MDM reads the SAP ID and stores it
```

### Inside the message flow

```mermaid
flowchart LR
  MQI["MQ Input<br/>MDM.SAP.CUST.REQ"] --> LOG["Compute<br/>log request"]
  LOG --> AUTH["HTTP Request<br/>token endpoint"]
  AUTH --> SET["Compute<br/>set bearer token<br/>build SAP payload"]
  SET --> REQ["HTTP Request<br/>SAP customer API<br/>TLS 1.2"]
  REQ --> CHK{"status<br/>code"}
  CHK -->|"2xx"| OK["Compute<br/>map SAP ID"]
  CHK -->|"4xx / 5xx"| ERR[["Error sub-flow"]]
  OK --> MQO["MQ Output<br/>MDM.SAP.CUST.RES"]
  ERR --> RQ[("Retry queue")]

  style MQI fill:#e6fcfd,stroke:#33d9e4,stroke-width:2px
  style MQO fill:#e6fcfd,stroke:#33d9e4,stroke-width:2px
  style ERR fill:#ffe9e9,stroke:#e06c6c
```

| Step | What happens |
| --- | --- |
| 1 | MDM puts the new or changed customer on the queue |
| 2 | ACE reads it and logs it with the transaction ID |
| 3 | ACE calls the SAP authentication API and gets a token |
| 4 | ACE sets that token in the request header |
| 5 | ACE posts the customer JSON to the SAP customer API |
| 6 | ACE reads the response and logs it |
| 7 | ACE puts the response, including the SAP customer ID, back on the queue for MDM |

### Building the request

```sql
CREATE COMPUTE MODULE BuildSapCustomerRequest
  CREATE FUNCTION Main() RETURNS BOOLEAN
  BEGIN
    CREATE LASTCHILD OF OutputRoot DOMAIN('JSON');

    DECLARE src   REFERENCE TO InputRoot.JSON.Data.customer;
    DECLARE token CHARACTER InputLocalEnvironment.Variables.AccessToken;
    DECLARE txnId CHARACTER InputLocalEnvironment.Variables.TxnId;

    SET OutputRoot.JSON.Data.transactionId          = txnId;
    SET OutputRoot.JSON.Data.customer.hubCustomerId = src.hubCustomerId;
    SET OutputRoot.JSON.Data.customer.name          = src.customerName;
    SET OutputRoot.JSON.Data.customer.country       = UPPER(src.address.countryCode);
    SET OutputRoot.JSON.Data.customer.taxId         = src.taxId;

    -- Repeating tax registration block becomes a JSON array
    DECLARE i INTEGER 1;
    DECLARE n INTEGER CARDINALITY(src.taxRegistrations[]);
    WHILE i <= n DO
      SET OutputRoot.JSON.Data.customer.taxRegistrations.Item[i].taxNumber =
          src.taxRegistrations[i].taxNumber;
      SET OutputRoot.JSON.Data.customer.taxRegistrations.Item[i].state =
          src.taxRegistrations[i].state;
      SET i = i + 1;
    END WHILE;

    -- Headers the HTTP Request node will send
    SET OutputRoot.HTTPRequestHeader."Content-Type"     = 'application/json';
    SET OutputRoot.HTTPRequestHeader."Authorization"    = 'Bearer ' || token;
    SET OutputRoot.HTTPRequestHeader."X-Correlation-Id" = txnId;

    RETURN TRUE;
  END;
END MODULE;
```

### Three things that made this harder than inbound

**Credentials never sit in the flow.** The HTTP Request node points at a **policy**. The policy names a credential alias. The alias is resolved from the encrypted ACE vault when the flow runs. The BAR file that ships to production holds no secrets at all.

**A 4xx is not an exception.** By default the HTTP Request node throws on an error status and the response body is lost. That body is usually the only place SAP explains what was wrong. I turned that off, kept the response, and branched on the status code myself. Now the failure record carries SAP's actual complaint.

**Messages can arrive twice.** MQ delivery is at least once, so a redelivered message must not create a second customer in SAP. Every outbound call carries the transaction ID from the MDM event so SAP can spot the duplicate and ignore it.

### Error handling sub-flow

```mermaid
flowchart LR
  F["Failure terminal<br/>or non 2xx branch"] --> EX["Compute<br/>read ExceptionList<br/>and SAP response body"]
  EX --> REC["Compute<br/>build error record<br/>txn ID, app ID, code,<br/>reason, original payload"]
  REC --> FILE["File Output<br/>error log on disk"]
  REC --> Q[("Retry queue")]
  REC --> BACK["MQ Output<br/>error response to MDM"]

  style F fill:#ffe9e9,stroke:#e06c6c,stroke-width:2px
```

MDM owns the retry. It reads the error message, the support team or the data steward corrects the record, and MDM pushes it again through the same queue. ACE does not silently retry bad data, because a record SAP rejected once will be rejected the same way a hundred times.

| Code | Meaning |
| --- | --- |
| `400` | SAP rejected the payload. Validation or data error, body says which field |
| `401` | Token expired or was refused. ACE fetches a new one and the message is retried |
| `404` | Endpoint wrong for that environment. Almost always a policy override problem |
| `500` | Technical exception inside ACE or inside SAP |

### The API and authentication details

| Item | Value |
| --- | --- |
| ACE application | `MDM_To_SAP_Customer_app` |
| Message flow | `MDM_To_SAP_CustomerFlow.msgflow` |
| Integration server | `EG_MQ` |
| Input queue | `MDM.SAP.CUST.REQ` |
| Output queue | `MDM.SAP.CUST.RES` |
| Token URL | `https://auth.sap-int.example.com/oauth/token?grant_type=client_credentials` |
| Token method | `GET` |
| Token lifetime | 3600 seconds, cached in the flow until it expires |
| Target URL | `https://sap-int.example.com/v1/business-partners` |
| Target method | `POST` |
| Transport | HTTPS, TLS 1.2, SAP certificate imported into the ACE truststore |

Fetching the token:

```bash
curl -X GET \
  'https://auth.sap-int.example.com/oauth/token?grant_type=client_credentials' \
  -H 'Content-Type: application/json' \
  -H 'x-csrf-token: fetch' \
  -u 'sap_int_client:<client_secret>'
```

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImRlZmF1bHQt...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

Calling SAP with it:

```bash
curl -X POST \
  'https://sap-int.example.com/v1/business-partners' \
  -H 'Authorization: Bearer eyJhbGciOiJSUzI1NiIs...' \
  -H 'Content-Type: application/json' \
  -H 'X-Correlation-Id: MDM-20240118-000451' \
  --data @sap-customer-create.json
```

What SAP sends back:

```json
{
  "transactionId": "MDM-20240118-000451",
  "status": "SUCCESS",
  "sapCustomerId": "0001004712",
  "message": "Business partner created",
  "processedAt": "2024-01-18T09:14:29.117Z"
}
```

### The commands I ran around this flow

```bash
# Package the application and deploy it to the queue-driven server
mqsicreatebar -data /workspace -b MDM_To_SAP_Customer_app.bar \
              -a MDM_To_SAP_Customer_app -cleanBuild
mqsideploy ACENODE -e EG_MQ -a MDM_To_SAP_Customer_app.bar

# Store the SAP client credential in the vault, not in the BAR
mqsivault ACENODE --create --vault-key <vault-key>
mqsicredentials ACENODE --all-integration-servers --create \
  --vault-key <vault-key> \
  --credential-type local \
  --credential-name S4_CLIENT_ALIAS \
  --username sap_int_client --password '<client_secret>'
mqsistart ACENODE --vault-key <vault-key>

# Trust the SAP certificate so the TLS handshake succeeds
keytool -importcert -alias sap_s4 -file sap_s4.cer \
        -keystore /var/mqsi/ssl/truststore.jks
keytool -list -v -keystore /var/mqsi/ssl/truststore.jks

# Check what is deployed and running
mqsilist ACENODE -e EG_MQ
mqsireportproperties ACENODE -e EG_MQ -o ComIbmJVMManager -a

# When something is wrong, turn on user trace and read it back
mqsichangetrace ACENODE -u -e EG_MQ -l debug -r
mqsireadlog  ACENODE -u -e EG_MQ -f -o trace.xml
mqsiformatlog -i trace.xml -o trace.txt
mqsichangetrace ACENODE -u -e EG_MQ -l none
```

<!--chapter:Platform & migration-->

## Where all of this ran

Linux VMs inside an AWS VPC, split into a public and a private subnet. Nothing in the private subnet was reachable from the internet. All access went through a jump host.

```mermaid
flowchart TB
  NET(["Internet"]) --> IGW["Internet gateway"]

  subgraph PUB ["Public subnet"]
    JH["Linux jump host"]
    LB["Classic load balancer"]
  end

  subgraph PRIV ["Private subnet"]
    ACE["Product VM<br/>IBM ACE + IBM MQ"]
    TOOLS["Tooling VM<br/>Jenkins · GitLab · Nexus · Sonar"]
  end

  IGW --> JH
  IGW --> LB
  JH -->|"SSH 22"| ACE
  JH -->|"SSH 22"| TOOLS
  TOOLS -->|"deploy BAR"| ACE
  LB -->|"HTTPS 8443"| ACE

  style ACE fill:#e6fcfd,stroke:#33d9e4,stroke-width:2px
  style PRIV fill:#f5fdfe,stroke:#c9e7ea
```

The same shape was repeated in DEV, UAT and Production. Integration servers were split by transport so a busy HTTP flow could never starve the queue-driven ones.

| Integration server | What runs there |
| --- | --- |
| `EG_HTTP` | REST and SOAP services exposed over HTTPS |
| `EG_MQ` | Queue-driven flows, inbound and outbound |
| `EG_BATCH` | Scheduled and batch style flows |

## Security

Every external hop ran over TLS. In ACE that means two files: a **keystore**, which is the identity you present, and a **truststore**, which holds the certificates you are willing to accept. I created and managed both, and imported a partner certificate every time a new system was onboarded.

```bash
# Our own identity
keytool -genkeypair -alias ace_identity -keyalg RSA -keysize 2048 \
        -keystore /var/mqsi/ssl/keystore.jks -storetype JKS \
        -dname "CN=integration.internal, OU=Integration, O=Example, C=IN"

keytool -certreq   -alias ace_identity -file ace.csr \
        -keystore /var/mqsi/ssl/keystore.jks
keytool -importcert -alias ace_identity -file ace_signed.cer \
        -keystore /var/mqsi/ssl/keystore.jks

# Register both stores with the node
mqsichangeproperties ACENODE -o BrokerRegistry \
  -n brokerKeystoreFile   -v /var/mqsi/ssl/keystore.jks
mqsichangeproperties ACENODE -o BrokerRegistry \
  -n brokerTruststoreFile -v /var/mqsi/ssl/truststore.jks

# Passwords go in, never inline in a flow
mqsistop  ACENODE
mqsisetdbparms ACENODE -n brokerKeystore::password   -u <user> -p <password>
mqsisetdbparms ACENODE -n brokerTruststore::password -u <user> -p <password>
mqsistart ACENODE

# HTTPS listener for the inbound REST flows
mqsichangeproperties ACENODE -e EG_HTTP -o HTTPSConnector \
  -n explicitlySetPortNumber -v 8443
```

## Monitoring

Monitoring profiles gave the platform visibility into message traffic without touching a single flow. A profile is an XML file that says which events a flow should emit. You attach it in the BAR file and then activate it with a command.

```bash
# Pull the current profile out of a deployed flow to use as a template
mqsireportflowmonitoring ACENODE -e EG_MQ \
  --application MDM_To_SAP_Customer_app \
  --flow MDM_To_SAP_CustomerFlow \
  --extract-profile /opt/monitoring/S4Cust.monprofile.xml

# Activate it
mqsichangeflowmonitoring ACENODE -e EG_MQ --all-application --all-flows -c active

# Confirm it took
mqsireportflowmonitoring ACENODE -e EG_MQ --all-application --all-flows
```

Deploying the BAR does not switch monitoring on. That caught me out once and cost half a day. The events publish over the built in MQTT broker, so when nothing arrives the first check is always whether publication is enabled at all:

```bash
mqsireportproperties ACENODE -b pubsub -o MQTTServer -r
mqsireportproperties ACENODE -b pubsub -o BusinessEvents/MQTT -n enabled
```

Flow logs and transaction counts were shipped to an S3 bucket on a schedule. That fed a Tableau dashboard the support team used to watch throughput and failure rates per interface.

## The v11 to v12 migration

This is the piece I owned from start to finish. Upgrading the platform from **ACE 11.0.0.11 to 12.0.11.3** across DEV, UAT and Production.

```mermaid
flowchart LR
  P1["1. Pre migration<br/>backups, prerequisites,<br/>inventory<br/><b>1 day</b>"]
  P2["2. Installation<br/>v12 runtime alongside v11<br/><b>2 days</b>"]
  P3["3. Migration<br/>in-place, same node name<br/><b>2 days</b>"]
  P4["4. Deployment<br/>BAR files, policies,<br/>security profiles<br/><b>2 days</b>"]
  P5["5. Post migration<br/>connectivity testing<br/>and hypercare<br/><b>5 days</b>"]

  P1 --> P2 --> P3 --> P4 --> P5

  style P1 fill:#e6fcfd,stroke:#33d9e4
  style P5 fill:#e8f8ec,stroke:#4caf7d
```

I chose **in-place migration** out of the three strategies IBM documents. It keeps the integration node name and its configuration, which meant every connected system's settings stayed valid and the change was invisible outside the platform.

```bash
# Back up everything first. This is what makes rollback real.
tar -zcvf ace11_backup_$(date +%Y%m%d).tar.gz /opt/IBM/ace11/
tar -zcvf mqsi_backup_$(date +%Y%m%d).tar.gz  /var/mqsi
tar -ztvf ace11_backup_$(date +%Y%m%d).tar.gz   # verify before going further

mqsistop ACENODE

mqsiextractcomponents \
  --backup-file /tmp/ACENODE.zip \
  --source-integration-node ACENODE \
  --target-integration-node ACENODE \
  --delete-existing-node

mqsistart ACENODE --vault-key <vault-key>
mqsilist  ACENODE
```

**What I planned around, and what bit anyway:**

- Both versions on one machine means **port collisions**. HTTP and HTTPS listener ports have to be reassigned before the v12 node starts, or it starts and immediately fails to bind.
- The queue manager can be reused, but if both versions share queues you cannot predict which runtime takes a message. During cutover only one node runs.
- v11 **configurable services** become v12 **policies**. They had to be recreated as policy projects and referenced from the BAR files, not simply carried across.
- Basic auth credentials had to be recreated in the new vault before the outbound flows would authenticate.
- Permissions on the component directory (`drwxrws---`, setgid on the group) matter. Get them wrong and the node fails to start with an error that gives no hint that permissions are the cause.

I wrote the plan and the runbook first, rehearsed the whole sequence in DEV, repeated it in UAT, then ran Production as a scripted change. It went live with no post deployment issues and no rollback. The runbook was reused by the team for later environments.

## Troubleshooting, in the order I actually checked

| Symptom | First checks |
| --- | --- |
| Flow deployed but nothing moves | `mqsilist` for server state, is the flow started, is the input queue building depth |
| Messages landing on the backout queue | Backout threshold on the queue, then the exception in the failure record |
| TLS handshake fails | Is the partner certificate in the truststore, has it expired, does the hostname match the CN or SAN |
| Works in DEV, fails in PROD | Endpoint override in the policy, or the credential alias resolving to the wrong environment |
| Slow under load | Additional instances, commit interval, whether a Compute node is re-parsing the tree for no reason |
| Monitoring events missing | Is the profile active, is MQTT publication enabled on the node |

The two changes that helped performance most were raising **additional instances** on queue-driven flows so messages processed in parallel, and **cutting repeated tree navigation** in ESQL by replacing long paths with reference variables.

## What I would do differently

The platform ran on VMs with Jenkins deploying over SSH. If I built it again I would run ACE in **containers on Kubernetes or OpenShift**, which IBM now supports with certified images. BAR files get baked into the image at build time, configuration comes in as ConfigMaps and secrets, and integration servers scale on their own instead of being sized up front on a fixed VM.

The design work carries over unchanged: splitting the flow into small nodes, modelling the message properly, one shared error path, idempotency, and keeping credentials out of the artefact. That part is about integration, not about where the runtime happens to sit.
