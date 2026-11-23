# Voice Arena — Speaker Diarization Leaderboard
## Executive One-Pager: 2-Minute Reviewer Summary
**Candidate Author:** Ravindra Kumar    
**Date:** November 2026  

---

### The Core Problem
Most published speaker diarization ("who spoke when") numbers are actively misleading:
1. They evaluate on clean, 2-speaker studio conversations and apply forgiving **0.25s collars** that delete boundary errors.
2. They **ignore overlapping speech** (where real conversations break down).
3. They publish **single-number point estimates** without confidence intervals, declaring "winners" on random variance.
4. They test on public datasets (AMI, VoxConverse) already contaminated in commercial training sets.

---

### The Voice Arena Solution
Voice Arena is an independent, vendor-neutral evaluation platform designed to help product engineers choose the right diarization system for their specific acoustic reality.

```
60h Private Held-Out Set  ──>  0.0s Strict Collar  ──>  Paired Bootstrap CI  ──>  Multi-Metric Tradeoffs
(Zero train-set leakage)       (No boundary cheating)   (Statistical Tie Badges)   (DER, JER, Overlap, RTF, $)
```

---

### Key Evaluation Design Choices

| Design Choice | What We Chose | Why It Matters for Production Teams |
| :--- | :--- | :--- |
| **Test Corpus** | **60 hours / 123 files across 5 domains** (Meeting, 8kHz Phone, Podcast, Medical, Noisy Room) | Diarization errors are domain-specific. A system with 8% DER on clean podcasts often exhibits 22% DER on noisy 8kHz phone lines. |
| **Ground-Truth QA** | **Two-pass human annotation with 20% blind double annotation** | Established an empirical human ceiling of **3.12% DER** (Inter-Annotator Agreement), ensuring we never penalize models for human ambiguity. |
| **Scoring Rigor** | **0.0s strict collar (DIHARD standard) + Overlaps scored** | Enforces exact timestamp accuracy and exposes systems that collapse simultaneous speakers into a single dominant voice. |
| **Statistical Honesty** | **B=2,000 paired file bootstrap resampling + Statistical Tie Badges** | Prevents false precision. If System A (11.2% ± 0.8%) overlaps System B (11.8% ± 0.9%), both share rank group `1–2`. |
| **Multi-Dimensional Metrics** | **DER + JER + Overlap DER + Spk Count Acc + RTF + Cost ($/hr)** | Allows teams to optimize for their exact tradeoff (e.g. Call Centers care about cost/hr on 8kHz; Live Voice Agents care about RTF). |

---

### Interactive Product Prototype
Built as an industry-grade, fully static web application ready for Render Static Sites:
* **Interactive Leaderboard (`/`):** Dynamic multi-faceted filtering (domain, language, device, collar, overlaps) with real-time rank recomputation and statistical tie clustering.
* **Paired Compare Engine (`/compare`):** Live client-side bootstrap engine computing mean paired difference, 95% CIs, and empirical p-value verdicts (`System A reliably better (p < 0.05)` vs `No reliable difference`).
* **System Profiles (`/system/:id`):** Acoustic condition bar charts, best/worst conditions, and failure modes.
* **Test Data (`/test-data`):** Interactive Recharts donut distribution and filterable corpus breakdown.
* **Real Mini-Run (`/real-run`):** Highlighted measured results on public clips with dscore CLI commands and reproducible failure notes.

---

### The Main Takeaway
> **Accuracy is not a single number; it is a distribution conditioned on acoustics, cost, and latency.** Voice Arena replaces vendor marketing claims with verifiable, reproducible, and statistically honest decision science.
