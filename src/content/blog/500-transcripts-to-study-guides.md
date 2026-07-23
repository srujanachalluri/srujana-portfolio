---
title: "From 500 Podcast Transcripts to a Paid Study-Guide Platform"
date: "2026-07-10"
readingTime: "6 min read"
tags: ["Full-Stack", "Next.js", "Supabase", "OpenAI"]
excerpt: "Automating transcript processing cut manual effort by 89% — then I turned the output into a real product with gated PDFs, signed URLs, and server-to-server payment confirmation."
cover: "📚"
---

The Concordia Bible Institute had **500+ podcast videos** and a bottleneck: turning them into study guides was slow, manual, and inconsistent. I got to solve it end to end — from the automation pipeline to a full-stack platform people actually pay for.

## The automation that started it

The first win was unglamorous but huge. I built a **Python + OpenAI pipeline** that ingests a transcript and emits a structured study guide — summary, key points, discussion questions — in a consistent format.

The result: **manual effort dropped by 89%**, and **500+ study guides** got generated at a quality and consistency no human could sustain across that volume. A macro-automation layer standardized formatting so every guide was publish-ready without hand-tuning.

The lesson I keep relearning: **the value isn't the AI call, it's the pipeline around it** — ingestion, formatting, error handling, and making the output *consistent* enough to ship unattended.

## Turning output into a product

Generating content is step one. Making it a *platform* is where the engineering got interesting. I built and deployed it on **Next.js, Supabase, and Vercel** with three things that matter for any paid content site:

**1. Auth-gated premium content.** Free guides are open; premium ones sit behind authentication.

**2. Short-lived signed URLs.** Premium PDFs are never served from a public path. After an entitlement check, the server mints a **signed URL that expires**, so a shared link is worthless minutes later.

**3. Real payments, done safely.** I integrated **CashNet** with **server-to-server confirmation** — the client never gets to *tell* the server a payment succeeded. The backend confirms with the payment provider directly before granting access.

```
User clicks buy
  → redirect to CashNet
  → payment completes
  → CashNet → our server (server-to-server confirm)  ✅ trusted
  → entitlement written to Supabase
  → signed URL issued on download
```

That server-to-server step is the whole security model. If you trust a client-side "payment succeeded" callback, you're one `curl` away from giving your product away.

## The growth side

The platform doesn't exist in a vacuum. On the content side I drove **55% audience growth** across YouTube and other channels using AI-assisted design and thumbnail optimization, and turned performance analysis into a **40% engagement lift**. Building the product and understanding what makes it *get used* turned out to be the same job.

## What I took away

- **Automation compounds.** An 89% effort reduction on one task freed the time to build the platform around it.
- **Never trust the client on money or entitlements.** Confirm server-to-server; issue access with expiring URLs.
- **Shipping is a full-stack skill.** Pipeline, auth, payments, and DevOps (DNS, deploy) are one continuous problem, not separate ones.

This is the kind of work I love — a messy real-world bottleneck, solved with automation, then hardened into something people rely on.
