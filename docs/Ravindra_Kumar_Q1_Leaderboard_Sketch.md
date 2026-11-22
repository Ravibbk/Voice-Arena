# Voice Arena — Speaker Diarization Leaderboard
## Deliverable 3: Leaderboard Product Sketch & UI Architecture
**Candidate Author:** Ravindra Kumar  
**Lab Assessment:** Voice Arena Research Lab  
**Live Interactive Prototype:** Run `npm run dev` (`http://localhost:3000`) | Production Build: `dist/`

---

## 1. Product Design Overview

The Voice Arena Leaderboard is designed with a **high-craft research-lab aesthetic** (inspired by *Artificial Analysis*, *LMSYS Chatbot Arena*, and *Stripe Docs*). It avoids generic dashboards by prioritizing:
1. **Statistical Honesty:** Showing 95% bootstrap confidence intervals and automatic **Statistical Tie** badges rather than false-precision point estimates.
2. **Component Error Diagnostics:** Showing what sits directly next to each DER score: a visual stacked error bar decomposing Missed Speech, False Alarms, and Speaker Confusion.
3. **Multi-Faceted Workflows:** Use-case presets that configure realistic acoustic slices (Meeting, Call Center, Medical, Live Agent) in one click.
4. **Reproducibility Audit Drawer:** Every row expands to reveal exact model version metadata, run dates, test file counts, and CLI recipes.

---

## 2. Complete Visual UI Wireframe / Product Sketch

```
+-----------------------------------------------------------------------------------------------------------------------+
| [!] Evaluation Transparency: Design mockup with illustrative benchmark data. Only 'Real Mini-Run' has measured results. |
+-----------------------------------------------------------------------------------------------------------------------+
|  [Voice Arena Logo] DIARIZATION   Leaderboard | Compare | Methodology | Test Data | Real Mini-Run [●]   [Camera: Clean Snapshot] [☼/☽] |
+-----------------------------------------------------------------------------------------------------------------------+
|                                                                                                                       |
|   [Voice Arena Benchmark Suite • Fall 2024 Release]                                                                   |
|   WHICH SPEAKER DIARIZATION SYSTEM WORKS BEST FOR YOUR AUDIO?                                                         |
|   Independent, reproducible evaluation across 60 hours of unconstrained real-world multi-speaker audio.               |
|                                                                                                                       |
|   [ 60h Private Held-Out ]  [ Overlaps Scored ]  [ 95% Bootstrap CI ]  [ Blind Speaker Count ]  [ 3.12% Human IAA ]   |
|                                                                                                                       |
+-----------------------------------------------------------------------------------------------------------------------+
|   ONE-CLICK USE-CASE PRESETS                                                                                          |
|   +-----------------------+ +-----------------------+ +-----------------------+ +-----------------------+             |
|   | [Users] Meeting Notes | | [Phone] Call Centre   | | [Cross] Medical Scribe| | [Radio] Live Agent    |             |
|   | 3–5+ spk • Overlaps   | | 2 spk • 8kHz Phone    | | 2–3 spk • Privacy     | | Streaming • Low RTF   |             |
|   | "Optimizes for multi- | | "Optimizes for 8kHz   | | "Optimizes for quiet  | | "Optimizes for live   |             |
|   |  speaker overlap &    | |  telephony audio &    | |  backchannels & self- | |  streaming & low RTF" |             |
|   |  speaker count."  ->  | |  cost per hour."  ->  | |  hosted privacy." ->  | |                   ->  |             |
|   +-----------------------+ +-----------------------+ +-----------------------+ +-----------------------+             |
+-----------------------------------------------------------------------------------------------------------------------+
|   INTERACTIVE FILTER BAR                                                                                              |
|   Track: [ Batch (Offline) | Streaming (Live) ]       Collar: [0.0s Strict ▼]   Overlaps: [Scored ▼]   Speaker Count: [Blind ▼] |
|                                                                                                                       |
|   Audio Domain        Speaker Count         Language / Accent       Device Mic            System Type                 |
|   [ All Domains ▼ ]   [ All Speakers ▼ ]    [ All Languages ▼ ]     [ All Devices ▼ ]     [ All Architectures ▼ ]     |
+-----------------------------------------------------------------------------------------------------------------------+
|   Current Leader: pyannoteAI Precision (11.2% DER)  •  Median DER: 15.6%  •  Corpus: 60.0h / 123 Files  [Compare A vs B ->]   |
+-----------------------------------------------------------------------------------------------------------------------+
|                                                                                                                       |
|   MAIN BENCHMARK RANKING TABLE                                                                                        |
|                                                                                                                       |
|   Rank    System & Provider         DER % (95% CI)    Error Breakdown       JER %    Overlap DER   Spk Acc   Speed   Cost/hr  Audit  |
|   ==================================================================================================================  |
|   #1–2    pyannoteAI Precision      11.2%             [===|==|====]         18.4%    21.8%         88.5%     0.12x   $0.60    [v]   |
|   [Stat]  pyannoteAI • API          ±0.8% [10.4–12.0] 4.1m | 2.2fa | 4.9cf                                                    |
|   ------------------------------------------------------------------------------------------------------------------  |
|   #1–2    pyannote/speaker-diar...  11.8%             [===|==|====]         19.2%    22.9%         86.2%     0.22x   $0.06    [^]   |
|   [Stat]  pyannote.audio • OpenSrc  ±0.9% [10.9–12.7] 4.6m | 2.5fa | 4.7cf                                                    |
|                                                                                                                       |
|       +--- [EXPANDED AUDIT DRAWER] -------------------------------------------------------------------------------+   |
|       |  Version Integrity:             Run Settings:             Corpus Scope:            Action:                 |   |
|       |  TODO: verify exact version     Track: Batch (Offline)    Audio: 60.0 hours        [View Full Profile ->]  |   |
|       |  Execution: Self-Hosted GPU     Collar: 0.0s Strict       Files: 123 files                                 |   |
|       +-----------------------------------------------------------------------------------------------------------+   |
|   ------------------------------------------------------------------------------------------------------------------  |
|   #3      NeMo Sortformer / MSDD    12.5%             [===|===|====]        20.1%    24.1%         84.8%     0.15x   $0.08    [v]   |
|           NVIDIA • Open-Source      ±0.9% [11.6–13.4] 4.9m | 2.8fa | 4.8cf                                                    |
|   ------------------------------------------------------------------------------------------------------------------  |
|   #4      DiariZen                  13.1%             [====|==|=====]       20.8%    25.3%         83.5%     0.35x   $0.05    [v]   |
|           BUT Speech@FIT • OpenSrc  ±1.0% [12.1–14.1] 5.2m | 2.4fa | 5.5cf                                                    |
|   ------------------------------------------------------------------------------------------------------------------  |
|   #5      Speechmatics Ursa         13.8%             [====|===|====]       21.6%    26.0%         82.8%     0.08x   $0.95    [v]   |
|           Speechmatics • STT+Diar   ±0.9% [12.9–14.7] 5.5m | 2.9fa | 5.4cf                                                    |
|   ------------------------------------------------------------------------------------------------------------------  |
|   #6      AssemblyAI Universal      14.9%             [====|===|=====]      22.8%    27.5%         81.0%     0.07x   $0.37    [v]   |
|           AssemblyAI • STT+Diar     ±1.0% [13.9–15.9] 5.8m | 3.2fa | 5.9cf                                                    |
|   ------------------------------------------------------------------------------------------------------------------  |
|   #7      Deepgram Nova             15.6%             [=====|===|=====]     23.6%    28.6%         79.5%     0.03x   $0.27    [v]   |
|           Deepgram • STT+Diar       ±1.0% [14.6–16.6] 6.1m | 3.4fa | 6.1cf                                                    |
|   ------------------------------------------------------------------------------------------------------------------  |
|   #8      Gladia Solaria            16.2%             [=====|====|====]     24.4%    29.5%         78.4%     0.05x   $0.38    [v]   |
|           Gladia • STT+Diar         ±1.0% [15.2–17.2] 6.4m | 3.6fa | 6.2cf                                                    |
|   ==================================================================================================================  |
+-----------------------------------------------------------------------------------------------------------------------+
```

---

## 3. What Sits Next to Each Score (Detailed Column Analysis)

In Voice Arena, a score is never a standalone, uncontextualized number. Here is exactly what accompanies every score in the table:

1. **Rank & Statistical Tie Badge:**
   * If a system's 95% bootstrap confidence interval overlaps with the system above it, the rank displays a shared range (e.g. `#1–2`) and an indigo **`[Stat Tie]`** badge with a scale icon.
   * *Product Purpose:* Prevents misleading claims where a vendor claims "#1 in the world" when the difference is statistically indistinguishable from noise.

2. **System Name & Type Badges:**
   * Model title with company name and color-coded architecture pill:
     * Green: `Open-Source` (self-hosted)
     * Blue: `Commercial API` (pure diarization)
     * Purple: `STT + Diarization` (bundled speech recognition)
   * Direct link to the dedicated `/system/:id` profile page.

3. **DER % with 95% Confidence Interval:**
   * Bold primary percentage (e.g. `11.8%`).
   * Below it: exact margin of error $\pm 0.9\%$ and the full confidence range `[10.9% – 12.7%]`.
   * Evaluated under strict 0.0s collar and scored overlaps.

4. **Component Error Breakdown Stacked Bar:**
   * A mini 100% proportional horizontal bar directly beside the DER number:
     * **Rose:** Missed Speech (reference speaker talking, system silent)
     * **Amber:** False Alarm (system detected speech in silence or noise)
     * **Indigo:** Speaker Confusion (speech detected, but wrong speaker label)
   * Hovering displays exact time percentages (e.g. `4.6% Miss | 2.5% FA | 4.7% Confusion`).

5. **JER % (Jaccard Error Rate):**
   * Speaker-agnostic turn metric that weights all participants equally. Exposes systems that suppress quiet speakers to optimize DER for a dominant talker.

6. **Overlap DER %:**
   * Error rate calculated strictly when 2 or more participants speak simultaneously. Critical for evaluating meeting note systems.

7. **Speaker Count Accuracy %:**
   * The percentage of files where the system’s unconstrained clustering accurately estimated the true number of speakers without oracle hints.

8. **Inference Speed (RTF / Latency):**
   * For Batch: Real-Time Factor (e.g. `0.03x` means a 60-minute file processes in 1.8 minutes).
   * For Streaming: p95 chunk-to-commit packet latency (e.g. `240ms`).

9. **Cost ($/Audio Hour):**
   * Direct vendor list API price or estimated cloud GPU compute cost (e.g. AWS A10G spot instance).

10. **Expandable Audit Drawer `[v]`:**
    * Clicking any row expands an audit drawer showing:
      * **Exact Model Version:** annotated with `"TODO: verify exact version"` per honesty rules.
      * **Execution Method:** Self-Hosted GPU vs. Managed API.
      * **Run Settings:** Track, Collar, and Overlap policy.
      * **Corpus Scope:** Total hours and test file count.
      * **CTA Button:** *"View Full System Profile ->"* leading to `/system/:id`.

---

## 4. How to View & Export This Sketch

You can interact with and capture this sketch directly in the provided web application:

1. **Live Interactive Prototype:**
   Run `npm run dev` and navigate to `http://localhost:3000`. You can click every filter, toggle between Light and Dark mode, and test the use-case presets live.
2. **Clean Snapshot Mode (One-Click Screenshot Tool):**
   In the top-right navbar, click the **"Clean Snapshot"** button (camera icon). This automatically hides the browser banners, navigation chrome, and extraneous controls so you can take a crisp, pixel-perfect screenshot for your presentation slides or PDF submission.
