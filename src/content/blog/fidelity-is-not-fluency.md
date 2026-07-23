---
title: "Fidelity ≠ Fluency: Testing Whether LLMs Actually Reason"
date: "2026-06-28"
readingTime: "7 min read"
tags: ["LLMs", "Evaluation", "Medical AI", "Research"]
excerpt: "Small models sound confident while quietly breaking logic. I designed distractor, transitive-chain, and fake-entity probes to separate reasoning from eloquence — across ChatGPT, Claude, Gemini, and a local Llama 3.2."
cover: "🔬"
---

The most dangerous LLM failure isn't the one that sounds wrong. It's the one that sounds *right*. A fluent, confident answer that's logically broken will slip past a human reviewer every time — and in medical AI, that's not a hypothetical.

My research question was simple to state and hard to test: **is the model reasoning, or just being eloquent?**

## Building a taxonomy first

Before writing a single probe, I mapped the landscape into a **taxonomy of fidelity / faithfulness benchmarks across five categories**, from black-box behavioral tests all the way to internal hidden-state probing. Existing benchmarks — FaithDial, TruthfulQA, StrategyQA, ROSCOE, ProcessBench — each measure a *slice* of faithfulness. Knowing which slice matters when you interpret a score.

## Three probes that separate reasoning from fluency

Standard benchmarks are contaminated (models have seen them). So I designed **original reasoning probes** the models couldn't have memorized:

**1. Distractor probes.** Insert a plausible-but-irrelevant fact into the prompt. A reasoning model ignores it; a pattern-matcher gets pulled off course.

**2. Transitive-chain probes.** *A > B, B > C — is A > C?* Chain the length. Fluent models often assert the conclusion without tracking the chain, and they break at surprisingly short lengths.

**3. Fake-entity probes.** Ask about entities that don't exist. The honest answer is "I don't know." A hallucination-prone model confidently invents a biography.

## What the probes revealed

Running these across **ChatGPT, Claude, Gemini, and a locally-hosted Llama 3.2** produced the headline finding:

> **Fidelity ≠ fluency.** Small models sounded confident and articulate while breaking transitive logic or fabricating facts. Eloquence was not evidence of reasoning.

The gap was widest exactly where it's most dangerous — the model *most* likely to state a wrong medical inference was often the one that stated it most smoothly.

## Judging at scale with LLM-as-a-judge

For the clinical piece, I evaluated **962 MedQA questions** using **BioMistral-7B** as an LLM-judge, then measured **evaluator agreement with Cohen's kappa**. Kappa matters here: raw accuracy can look fine while the judge and ground truth agree no better than chance on the hard cases.

I ran the open-weight models locally — **LM Studio, GPT4All, Ollama** — on constrained hardware, which forces you to care about quantization and throughput, not just accuracy.

## Why this matters beyond research

If you're shipping an LLM feature, the lesson transfers directly:

- **Don't trust demos.** Fluent answers are the easy 90%; faithfulness lives in the 10%.
- **Build probes your model hasn't seen.** Public benchmarks are contaminated.
- **Measure agreement, not just accuracy.** Cohen's kappa surfaces the failures a single number hides.

Confidence is cheap. Correctness is what we should be grading.
