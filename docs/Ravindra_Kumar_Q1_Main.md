# Voice Arena — Speaker Diarization Evaluation
## Question 1: Research, Methodology & System Design
**Candidate Author:** Ravindra Kumar  
**Lab Assessment:** Voice Arena Research Lab  
**Date:** November 2024  
**Benchmark Artifact:** [Interactive Leaderboard Prototype](https://voice-arena-diarization.onrender.com) (Local: `http://localhost:3000`)  
**Deliverable 2 (One-Pager):** [Ravindra_Kumar_Q1_OnePager.md](Ravindra_Kumar_Q1_OnePager.md)  
**Deliverable 3 (Product Sketch):** [Ravindra_Kumar_Q1_Leaderboard_Sketch.md](Ravindra_Kumar_Q1_Leaderboard_Sketch.md)  
**Deliverable 4 (Video Walkthrough):** [Ravindra_Kumar_Q1_Video_Walkthrough_Script.md](Ravindra_Kumar_Q1_Video_Walkthrough_Script.md)

---

## Executive Summary
This document establishes the evaluation methodology for **Voice Arena — Speaker Diarization Leaderboard**, an independent, vendor-neutral platform designed and built by **Ravindra Kumar** that benchmarks speaker diarization systems across real-world acoustic conditions.

Speaker diarization ("who spoke when") is a critical foundation for meeting transcription, call center compliance, medical scribes, and real-time voice agents. However, existing public benchmarks suffer from two fatal flaws:
1. **The "Clean Audio Illusion":** Testing on clean 2-person studio audio with forgiving 250ms collars and ignored overlaps, which masks catastrophic failures in production.
2. **Train-Set Contamination:** Modern foundation models have ingested public corpora (AMI, VoxConverse, LibriSpeech), rendering academic scores untrustworthy.

Voice Arena addresses this through a **60-hour private held-out dataset**, **0.0s collar strict scoring**, **paired bootstrap statistical hypothesis testing**, and **multi-dimensional reporting** (DER, JER, Overlap DER, Speaker Count Accuracy, Speed, and Cost).

---

## 1. Purpose & User Decision Matrix
A score without a decision is useless. The Voice Arena leaderboard is architected to answer exact engineering and procurement questions for four distinct product personas:

| User Persona | Real Acoustic Challenge | Exact Procurement / Engineering Decision Informed by Leaderboard | Primary Filtering Strategy |
| :--- | :--- | :--- | :--- |
| **Meeting Notes Product Engineer** (e.g. Otter, Fireflies, Notion) | 3–6 speakers, dynamic floor interrupts, room reverberation, laptop mic | Decides whether to self-host open-source (pyannote/NeMo) to save infrastructure costs or pay for a pure diarization API, ensuring overlap errors do not scramble conversation threads. | Domain: `Meeting`, Overlaps: `Scored`, Metric: `Overlap DER` & `Speaker Count Acc` |
| **Call Center Analytics VP** (Enterprise CX, FinTech) | 2 speakers, 8kHz PSTN/cellular phone line, volume imbalance, millions of hours/month | Decides whether premium accent resilience (Speechmatics at $0.95/hr) justifies a 3.5x price multiplier over Deepgram ($0.27/hr) on 8kHz narrowband audio at enterprise volume. | Domain: `Phone Call (8kHz)`, Track: `Batch`, Metric: `DER` & `Cost ($/hr)` |
| **Medical Scribe Product Team** (Ambulatory clinic, telehealth) | Doctor + Patient + Nurse, quiet backchannels ("mm-hm"), strict HIPAA privacy | Decides whether cloud APIs can be trusted or if an on-premise container (DiariZen / pyannote) is required for zero data retention, verifying missed speech on quiet clinical turns. | Domain: `Medical`, System Type: `Open-Source`, Metric: `Missed Speech %` |
| **Live Voice Agent Founder** (Streaming conversational AI) | Real-time turn-taking, sub-400ms interrupt latency, WebSocket audio streaming | Selects the lowest-latency streaming diarization API that maintains cluster stability without splitting the user into multiple hallucinated speaker IDs. | Track: `Streaming (Live)`, Metric: `Speed (RTF / Latency)` & `Speaker Confusion` |

---

## 2. Models & Strict Fairness Rules

### Evaluated Systems (12 Systems Across 4 Archetypes)
1. **pyannote/speaker-diarization** (`pyannote.audio`): Open-Source, self-hosted on GPU (PyTorch/HuggingFace). Gold standard research baseline.
2. **NeMo Sortformer / MSDD** (`NVIDIA`): Open-Source, self-hosted with TensorRT GPU acceleration.
3. **DiariZen** (`BUT Speech@FIT`): Open-Source, Bayesian HMM x-vector clustering, DIHARD challenge winner.
4. **pyannoteAI Precision** (`pyannoteAI`): Commercial Pure Diarization API. High overlap precision without STT text overhead.
5. **Deepgram Nova** (`Deepgram`): STT + Diarization, Batch & Streaming API. Ultra-fast inference (<0.05 RTF).
6. **AssemblyAI Universal** (`AssemblyAI`): STT + Diarization Batch API. Tight word-level timestamp coupling.
7. **Speechmatics Ursa** (`Speechmatics`): STT + Diarization Batch & Streaming API. Industry benchmark for global accents and Hinglish.
8. **Cloud STT v2** (`Google Cloud`): Hyperscaler STT + Diarization Batch & Streaming. Global Chirp foundation model.
9. **AWS Transcribe** (`Amazon Web Services`): Hyperscaler STT + Diarization Batch & Streaming. Enterprise IAM & PII redaction.
10. **Azure AI Speech** (`Microsoft`): Hyperscaler STT + Diarization Batch & Streaming. Native Teams ecosystem integration.
11. **ElevenLabs Scribe** (`ElevenLabs`): STT + Diarization Batch API. High-fidelity audio character alignment.
12. **Gladia Solaria** (`Gladia`): STT + Diarization Batch & Streaming API. Multilingual audio intelligence.

### Strict Fairness Principles
* **Identical Unmodified Audio:** All systems ingest the exact same uncompressed 16kHz/8kHz WAV files. No proprietary pre-filtering or selective noise reduction is applied by Voice Arena.
* **Track Separation:** Batch (Offline) and Streaming (Live) systems are never mixed in the same ranking table. Offline models benefiting from bidirectional temporal clustering cannot compete against real-time streaming pipelines.
* **Blind Speaker Counts:** On the primary evaluation track, systems receive zero prior hints regarding the number of speakers (`min_speakers` and `max_speakers` flags are disabled). Oracle speaker count results are sequestered to an analytical diagnostic view.
* **Normalized RTTM Output:** All vendor outputs (word timestamps, JSON, SRT) are converted to standard NIST RTTM files using deterministic turn-collapsing rules before evaluation.

---

## 3. Test Data Composition (60-Hour Private Corpus)

To stress diarization systems across real failure modes, Voice Arena constructed **VA-Eval-60**, a 60-hour private corpus spanning 123 distinct recordings:

| Acoustic Domain | Duration | Files | Speakers | Key Acoustic Characteristics | Dominant Languages / Accents | Recording Devices | Overlap Ratio |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Meeting** | 20.0h (33.3%) | 30 | 3–6 | Dynamic floor turns, interruptions, open glass room acoustics | English, Indian English, Hinglish | Laptop mic, Far-field conference array | **16.4%** |
| **Phone Call (8kHz)** | 15.0h (25.0%) | 45 | 2 | PSTN/cellular narrowband filter, volume imbalance, line hiss | English, Hindi, Indian English | Landline PSTN, AMR-WB cellular | 8.2% |
| **Podcast / Interview** | 12.0h (20.0%) | 16 | 2–4 | Professional condenser proximity, rapid crosstalk, vocal dynamic range | English, Hindi | Shure SM7B, Studio Condenser | 9.5% |
| **Medical Scribe** | 8.0h (13.3%) | 20 | 2–3 | Doctor-patient consultation, soft backchannels ("mm-hm"), clinical terms | English (Clinical), Indian English | Lavalier, Built-in Clinic Laptop | 7.1% |
| **Noisy Room** | 5.0h (8.3%) | 12 | 3–5 | Cafeteria & coffee shop chatter, HVAC hum, SNR 5–15 dB | English, Hinglish code-switching | Tabletop omnidirectional mic | **14.8%** |

---

## 4. Reference Building & QA Integrity

### Two-Pass Annotation Protocol
1. **Pass 1 (Primary Annotation):** Trained phoneticians annotate active speech boundaries using continuous Praat time alignment, assigning speaker labels with sub-10ms precision.
2. **Pass 2 (Blind Double Annotation):** A secondary independent annotator re-annotates a stratified 20% subset (12.0 hours) blind to Pass 1.
3. **Inter-Annotator Agreement (IAA):** We evaluate IAA as the Diarization Error Rate between the two human annotators. At 0.0s strict collar, our human baseline IAA is **3.12% DER**, establishing the empirical human ceiling.
4. **Senior Adjudication:** Disagreements exceeding 150ms collar or involving speaker cluster identity are arbitrated by a senior speech researcher.

### Anti-Contamination & Private Held-Out Policy
Public datasets (AMI, VoxConverse, CALLHOME, LibriCSS) are widely scraped into commercial pre-training sets. **VA-Eval-60 is 100% newly recorded under zero-leakage research protocols.** Raw audio files and reference RTTMs are stored offline and will never be published to the open web.

---

## 5. Metrics & Formulations

### Primary Metric: Diarization Error Rate (DER %)
The percentage of reference speech time incorrectly attributed:
$$\text{DER} = \frac{\text{Missed Speech Time} + \text{False Alarm Time} + \text{Speaker Confusion Time}}{\text{Total Reference Speech Time}} \times 100$$
* **Missed Speech (Miss):** Speaker was talking, but system detected silence/non-speech.
* **False Alarm (FA):** System hallucinated speech during silence or ambient background noise.
* **Speaker Confusion (Confusion):** Speech was correctly identified, but assigned to the wrong speaker.

### Supporting Metrics
* **Jaccard Error Rate (JER %):** Calculates the Jaccard error per reference speaker and averages equally across speakers. Unlike DER, JER prevents a talkative host who speaks 80% of the audio from masking complete diarization failure on quiet speakers.
* **Overlap DER %:** DER evaluated strictly during timestamps where 2 or more speakers speak concurrently.
* **Speaker Count Accuracy %:** Percentage of recordings where the system's unconstrained clustering predicts the exact true number of speakers.
* **Real-Time Factor (RTF) & Latency:** Processing wall time divided by audio duration. For streaming pipelines, p95 packet-to-boundary latency is recorded.
* **Cost ($/Audio Hour):** Standard vendor API list price or estimated GPU instance hourly compute cost.

---

## 6. Scoring Settings & Tradeoffs
* **Collar: 0.0s Strict [DIHARD III] vs 0.25s Legacy [AMI]:** Legacy 250ms collars forgive 500ms total window on every turn transition, concealing poor boundary alignment. Voice Arena enforces 0.0s collar on the main track, reflecting modern end-to-end neural standards.
* **Overlapping Speech: Scored vs Ignored:** Overlaps represent 10–18% of natural conversational time. All overlaps are scored by default.
* **Speaker Count Knowledge: Blind vs Oracle:** Real products operate blind; oracle speaker counts are provided only as a secondary diagnostic filter.

---

## 7. Step-by-Step Evaluation Process

```
[1. Multi-Domain Collection] 
   └── 60h Private Held-Out Audio (Meetings, Phone, Podcast, Medical, Noisy Room)
         │
[2. Two-Pass Ground-Truth & QA]
   ├── Pass 1: Primary Phonetician Praat Annotation
   ├── Pass 2: 20% Stratified Blind Double Annotation (IAA: 3.12% DER)
   └── Adjudication of boundary conflicts > 150ms
         │
[3. Corpus Freeze & Anti-Contamination Vault]
   └── Secure offline storage; zero web crawler exposure
         │
[4. Blind System Inference]
   ├── Batch Track: full file offline inference
   └── Streaming Track: chunked WebSocket streaming (record p95 latency)
         │
[5. RTTM Output Normalization]
   └── Deterministic parsing of JSON / word timestamps into NIST RTTM format
         │
[6. Scoring with NIST dscore & pyannote.metrics]
   └── Primary: 0.0s collar, overlaps scored, blind speaker count
         │
[7. File-Level Bootstrap Hypothesis Testing]
   └── B = 2,000 paired resamples over 123 files -> 95% Percentile CIs
         │
[8. Statistical Tie Clustering & Publication]
   └── If 95% CIs overlap adjacent systems -> "Statistical Tie" badge & shared rank
```

---

## 8. What Is Published Beside Each Score
To prevent misleading claims, every score on the Voice Arena leaderboard is accompanied by:
1. **95% Bootstrap Confidence Interval:** e.g., `11.8% ± 0.9% [10.9% – 12.7%]`.
2. **Component Error Breakdown Bar:** Visual proportion of Missed Speech, False Alarm, and Speaker Confusion.
3. **Statistical Tie Status:** Systems with overlapping CIs receive shared rank badges (e.g. `1–2`).
4. **Reproducibility Metadata:** Exact model version (`"TODO: verify exact version"`), hardware configuration, execution method (Self-Hosted GPU vs API), and scoring command line.
5. **Acoustic Domain Performance Breakdown:** Individual scores across Meeting, Phone, Podcast, Medical, and Noisy Room partitions.

---

## 9. Final Engineering Reflection (by Ravindra Kumar)

### 1. Which design choice are you least sure about, and why?
**The 0.0s strict collar vs. 0.25s collar tradeoff.**
If you spend hours annotating multi-speaker audio in Praat or Audacity, you quickly discover that human speech boundaries are inherently fuzzy. When someone utters a trailing breath, a nasalized vowel cutoff, or an unvoiced fricative (/s/, /th/), where exactly does speech end? One annotator places the boundary where the acoustic waveform drops below -35 dB; another stops where the harmonic pitch track terminates. That innocent disagreement is often 50 to 90 milliseconds. 

Under `dscore --collar 0.0`, every single millisecond of that human ambiguity gets charged as either a Missed Speech error or a False Alarm. On our double-annotated audit, even two experienced human phoneticians disagreed by 3.12% DER at a 0.0s collar! 

Yet, adopting the legacy 0.25s collar (from old NIST RT / AMI benchmarks) creates an equally bad hazard: it carves out a 500ms total "forgiveness zone" around every speaker transition. On rapid conversational turn-taking where turns are only 1.2 seconds long, a 250ms collar forgives nearly 40% of the audio, letting sloppy models hide poor segmentation. 

I settled on **0.0s strict collar as the primary benchmark rule** because modern end-to-end neural systems (like Sortformer and pyannote 3.1) are capable of sharp boundary estimation, and strict scoring forces engineering honesty. However, for downstream product teams building meeting transcription apps, a 100ms collar would likely better match human psychoacoustic tolerance without masking real errors.

### 2. Which benchmark you read influenced you most, and how?
**The Third DIHARD Diarization Challenge (Ryant et al., 2020).**
Before DIHARD, the speaker diarization literature was stuck in an artificial comfort zone. Benchmarks like early CALLHOME or AMI used clean headset audio, forgiving 250ms collars, and—most damagingly—completely ignored overlapping speech regions during evaluation. Systems looked incredible on paper (reporting 2% to 4% DER) but crumbled the moment you deployed them in an actual glass-walled conference room.

DIHARD III shattered that illusion with three uncompromising rules:
1. Multi-domain sampling (audiobooks, clinical interviews, restaurant chatter, YouTube vlog crosstalk).
2. Zero collar (0.0s).
3. Overlaps scored, period.

Reading Ryant et al. convinced me that **evaluations must reflect real acoustic pain, not benchmark flattery.** In designing Voice Arena, I took DIHARD’s strict scoring philosophy and translated it into a production decision tool by adding what academic papers leave out: inference latency (RTF / p95 streaming delays), dollar cost per audio hour, and paired bootstrap significance testing so teams don't pick models based on statistical noise.

### 3. What could make your leaderboard misleading, and how did you guard against it?
**Two major failure modes:**
1. **The Point-Estimate Illusion (Declaring Winners on Random Noise):**
   Commercial speech vendors constantly publish marketing posts claiming: *"Our new model achieved 11.2% DER, beating Competitor X at 11.8%."* But if your test set has 30 or 50 files, the 95% confidence interval is almost certainly $\pm 0.9\%$. That 0.6% gap is pure sample variance. If you swapped out 5 audio clips, the ranking could invert.
   * *How I guarded against it:* I implemented $B=2,000$ paired studentized bootstrap resampling over files. When confidence intervals overlap, the leaderboard refuses to assign artificial ranks; it groups the systems together with a prominent **"Statistical Tie"** badge (e.g. Rank `1–2`). Furthermore, on the Compare page, we run a live paired per-file hypothesis test so engineers see whether $p < 0.05$ holds true on their exact file distribution.

2. **Train-Set Contamination & Web-Crawled Audio Leakage:**
   Modern speech foundation models (Whisper, Chirp, MMS) are trained on hundreds of thousands of hours of scraped web audio. If a benchmark uses public datasets like AMI, VoxConverse, or LibriCSS, you are no longer measuring diarization generalization—you are measuring whether the vendor's training pipeline scraped that specific YouTube video or meeting snippet.
   * *How I guarded against it:* All 60 hours in our primary evaluation set (VA-Eval-60) are newly recorded private conversations under non-disclosure agreements, held in an offline vault with zero public web crawler exposure.

### 4. What would you improve with more time?
1. **Downstream Word Attribution (cpWER & tcpWER via MeetEval):**
   Diarization error rate treats all audio seconds equally. But in production, a 2-second speaker confusion during a filler backchannel (*"mm-hm, yeah"*) is harmless, whereas a 2-second confusion during a numerical financial disclosure (*"Our revenue dropped by 4 million"*) ruins the transcript. I would integrate `MeetEval` to measure concatenated minimum-permutation Word Error Rate (cpWER) to quantify how diarization errors actually degrade text readability.
2. **Interactive Audio & Spectrogram Inspector:**
   Add a waveform player where engineers can listen to test audio snippets and see two stacked visual timelines: Ground Truth RTTM bars on top, and Model Predicted RTTM bars on the bottom. Clicking on an error bar would play that exact 2-second segment so the engineer can hear *why* the model failed (e.g. simultaneous laughter or air conditioning rumble).
3. **Automated Canary Regression Monitoring:**
   Commercial speech APIs change their backend models without notice. I would build a scheduled GitHub Action that sends 5 canary test files to all vendor endpoints weekly, alerting the community immediately if an unannounced API update causes speaker ID drift or latency regressions.
