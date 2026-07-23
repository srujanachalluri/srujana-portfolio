---
title: "Predicting Opioid Potency with a Stacking Ensemble"
date: "2026-06-12"
readingTime: "8 min read"
tags: ["Machine Learning", "Drug Discovery", "QSAR", "RDKit"]
excerpt: "How I curated 917 bioactive compounds from ChEMBL, engineered 3,600+ molecular features, and built a stacking ensemble to predict pIC50 against the Delta-Opioid Receptor — without fooling myself with data leakage."
cover: "🧬"
---

Drug discovery is expensive because most molecules fail. If a model can rank *which* molecules are worth synthesizing, it saves months of lab work. That's the promise of **QSAR** — Quantitative Structure–Activity Relationship modeling — and it's what I spent a semester building for the **Delta-Opioid Receptor (CHEMBL236)**.

Here's how the pipeline came together, and the mistakes I made sure to avoid.

## Starting with honest data

I pulled **917 bioactive compounds** from ChEMBL, each with a measured IC50 against the receptor. Raw IC50 values span many orders of magnitude, so the first step was converting them to **pIC50** (`−log10(IC50)`), which gives a well-behaved, roughly normal target for regression.

```python
import numpy as np

def to_pic50(ic50_nanomolar):
    # convert nM → M, then take −log10
    return -np.log10(ic50_nanomolar * 1e-9)
```

The unglamorous truth of ML for science: **80% of the work is deciding what data you trust.** I dropped duplicates, standardized units, and removed compounds with ambiguous activity labels before a single model was trained.

## Engineering 3,600+ features

Molecules aren't tables — they're graphs. To feed them to a model, I generated two complementary feature families with RDKit:

- **Mordred descriptors** — thousands of computed physicochemical properties (molecular weight, topology, electronic descriptors).
- **Morgan fingerprints** — binary vectors encoding which substructures are present.

Together that's **3,600+ features** per molecule. Far more features than samples, which means feature selection and regularization aren't optional — they're the whole game.

## Why a stacking ensemble

No single model was clearly best. Tree ensembles each captured slightly different structure, so I combined them:

- **XGBoost**, **LightGBM**, **Random Forest**, and **Extra Trees** as base learners
- A meta-learner trained on their out-of-fold predictions
- **Optuna** for hyperparameter search on each base model

Stacking gave a meaningful bump over any individual model because the base learners made *different* errors — exactly the condition under which ensembling helps.

## The part nobody sees: not fooling yourself

The easiest way to get a great R² in QSAR is to accidentally leak information from test into train. I was strict about it:

- **5-fold cross-validation**, with feature selection done *inside* each fold
- No scaling or selection fit on the full dataset before splitting
- **Honest R² reporting** — the number you'd actually get on new molecules, not the flattering one

That discipline is the difference between a model that looks good in a notebook and one that actually predicts potency for **unseen molecules**, which is what the deployed model now does.

## What I'd tell my past self

1. **Spend more time on the data than the model.** The ensemble was a weekend; cleaning ChEMBL was weeks.
2. **Leakage is the default, not the exception.** Assume you have it until you've proven you don't.
3. **Report the honest number.** A believable R² beats an impressive one.

The full pipeline is on my GitHub, and I'm happy to talk through the feature-engineering choices with anyone working in cheminformatics.
