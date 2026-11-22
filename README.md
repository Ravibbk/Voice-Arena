# Voice Arena — Speaker Diarization Leaderboard

> **An industry-grade, fully static interactive evaluation platform and benchmark prototype for Speaker Diarization systems.**  
> Built by **Ravindra Kumar** as a research engineering take-home assignment for Voice Arena.

[![Built with React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646cff.svg)](https://vitejs.dev/)
[![Render Static Ready](https://img.shields.io/badge/Render-Static%20Site-46E3B7.svg)](https://render.com)

---

## 1. Project Overview & Product Vision

Voice Arena is a research lab building rigorous evaluations and datasets for Voice AI. Speaker diarization answers **"who spoke when"** in an audio recording, returning segment timestamps with speaker labels without prior knowledge of speaker identities or counts.

Most public benchmarks are misleading because they test on clean studio audio with forgiving collars and ignored overlaps. Voice Arena provides:
* **Honest Evaluation Methodology:** 0.0s DIHARD-style strict collar, overlapping speech scored, blind speaker counts, and private held-out data.
* **Statistical Rigor:** 95% bootstrap confidence intervals (B=2,000 resamples) and **Statistical Tie** badges for overlapping intervals.
* **Multi-Dimensional Metrics:** Diarization Error Rate (DER), Jaccard Error Rate (JER), Overlap DER, Speaker Count Accuracy, Inference Speed (RTF/Latency), and Cost ($/hour).
* **Live Paired Hypothesis Testing:** Client-side paired bootstrap comparison engine (`p < 0.05` verdict).
* **Clear Honesty Boundaries:** Persistent top banner clarifying illustrative benchmark data versus measured results on the **Real Mini-Run** page.

---

## 2. Tech Stack & Architecture

* **Framework:** React 18 + TypeScript + Vite 6
* **Styling & Design System:** Tailwind CSS (Dark/Light mode support, Inter typography, `#4F46E5` Indigo accent, `#059669` Emerald real-run badges)
* **Data Visualization:** Recharts (responsive bar charts, donut charts, head-to-head condition comparisons)
* **Icons:** Lucide React
* **Routing:** React Router DOM (v6) with client-side SPA routing
* **Backend:** Zero backend. 100% client-side static compilation (`dist/`). All data lives in structured JSON files in `/src/data/`.

---

## 3. Local Development & Build Commands

### Prerequisites
* Node.js v18+ (tested on Node v22.13.1)
* npm v9+

### Commands

```bash
# 1. Install dependencies
npm install

# 2. Run local development server (port 3000)
npm run dev

# 3. Compile static production build
npm run build

# 4. Preview static production build locally
npm run preview
```

The static build will be generated in `dist/`.

---

## 4. Render Static Site Deployment Guide

This repository is pre-configured for **Render Static Sites**.

### Step-by-Step Render Setup

1. **Push to GitHub / GitLab:**
   Push this repository to your Git provider.

2. **Create New Static Site on Render:**
   - Log in to your [Render Dashboard](https://dashboard.render.com).
   - Click **New +** -> **Static Site**.
   - Connect your repository.

3. **Configure Build & Publish Settings:**
   * **Name:** `voice-arena-diarization` (or your preferred name)
   * **Branch:** `main` (or default branch)
   * **Build Command:** `npm run build`
   * **Publish Directory:** `dist`

4. **SPA Rewrite Rule (Crucial for React Router DOM):**
   Render needs to route all incoming HTTP paths to `/index.html` so client-side React Router functions on page refresh.
   
   * Go to **Redirects/Rewrites** in your Render service settings:
     * **Type:** `Rewrite`
     * **Source:** `/*`
     * **Destination:** `/index.html`
   
   *(Note: This repository also includes `public/_redirects` and `render.yaml` which automatically declares this rewrite rule during Render deployment!)*

5. **Deploy:**
   Click **Create Static Site**. Render will build and deploy the application in under 60 seconds.

---

## 5. Application Pages & Features

| Route | Page | Key Features |
| :--- | :--- | :--- |
| `/` | **Leaderboard** | 4 Use-Case Presets (`Meeting Notes`, `Call Centre`, `Medical Scribe`, `Live Voice Agent`), multi-attribute filter bar (Track, Domain, Language, Device, System Type, Collar, Overlaps, Speaker Count), dynamic re-ranking with **Statistical Tie** badges, error breakdown stacked bars, and expandable row drawers. |
| `/system/:id` | **System Detail** | System profile, exact version (`"TODO: verify exact version"`), Recharts condition bar chart, Best & Worst acoustic condition callouts, concrete failure modes (Overlaps, Short Backchannels, Similar Voices, 8kHz Phone), and reproducibility command. |
| `/compare` | **Compare** | System A vs System B dropdowns, delta stat cards, **Paired Bootstrap Hypothesis Testing Engine** (calculates mean paired difference, 95% CIs, and empirical p-value live in JS), and grouped condition bar chart. |
| `/methodology` | **Methodology** | Research-grade documentation: Persona Decision Matrix, 12 Systems across 4 Types, 4 Fairness Rules, 60h Corpus Specifications, Two-Pass Reference QA (3.12% IAA ceiling), Plain-Word Metric Formulas, 8-Step Pipeline Diagram, and **Final Engineering Reflection** answering all 4 take-home questions. |
| `/test-data` | **Test Data** | Recharts Donut distribution chart across 5 acoustic domains, filterable specifications table with difficulty tags, speaker counts, and microphone types. |
| `/real-run` | **Real Mini-Run** | Highlighted with green `"Real Run — Measured Results"` badge. Verified local runs on public AMI (`ES2004a`) and VoxConverse (`v_001`) clips with exact `dscore` CLI commands, execution hardware, and documented acoustic failure notes. Clearly marked slots ready for additional local evaluation. |

---

## 6. Data Architecture (`/src/data/`)

* **`src/data/systems.json`:** Contains metadata for 12 systems:
  1. `pyannote/speaker-diarization` (Open-Source, pyannote.audio)
  2. `NeMo Sortformer / MSDD` (Open-Source, NVIDIA)
  3. `DiariZen` (Open-Source, BUT Speech@FIT)
  4. `pyannoteAI Precision` (Commercial Pure Diarization API, pyannoteAI)
  5. `Deepgram Nova` (STT + Diarization, Batch & Streaming)
  6. `AssemblyAI Universal` (STT + Diarization, Batch)
  7. `Speechmatics Ursa` (STT + Diarization, Batch & Streaming)
  8. `Cloud STT v2` (STT + Diarization, Google Cloud)
  9. `AWS Transcribe` (STT + Diarization, Amazon)
  10. `Azure AI Speech` (STT + Diarization, Microsoft)
  11. `ElevenLabs Scribe` (STT + Diarization, ElevenLabs)
  12. `Gladia Solaria` (STT + Diarization, Gladia)
  *All model version strings set to `"version": "TODO: verify exact version"` per honesty rules.*

* **`src/data/results.json`:** Detailed benchmark results across batch and streaming tracks, per-condition breakdowns, collar settings, and **15-file synthetic DER arrays** per system powering the live client-side paired bootstrap calculation.
* **`src/data/testDataset.json`:** Comprehensive breakdown of the 60-hour held-out corpus (domains, hours, files, languages, devices, and two-pass annotation QA data).
* **`src/data/realMiniRun.json`:** Public clips (AMI, VoxConverse), measured `dscore` runs, exact CLI commands, and reproducible execution environments.

---

## 7. Submission Deliverables Included in this Repo

In addition to the running interactive application, the complete take-home assessment package is documented inside `/docs/`:

1. **`docs/Ravindra_Kumar_Q1_Main.md`:** The comprehensive research and methodology document covering all 8 required sections and the 4 Final Reflection questions.
2. **`docs/Ravindra_Kumar_Q1_OnePager.md`:** The scannable 2-minute executive report summarizing the eval, core setup, design choices, and main takeaway.
3. **`docs/Ravindra_Kumar_Q1_Leaderboard_Sketch.md`:** The complete Leaderboard product sketch, UI wireframes, what sits next to each score, and interactive export instructions.
4. **`docs/Ravindra_Kumar_Q1_Video_Walkthrough_Script.md`:** The exact 2-minute video walkthrough script with timestamps, visual cues, and key talking points.

---

## 8. License & Standards
Developed for **Voice Arena Research Lab**. Evaluation metrics conform to **NIST RT**, **DIHARD III**, and **CHiME-8** standards using `dscore` and `pyannote.metrics`.
