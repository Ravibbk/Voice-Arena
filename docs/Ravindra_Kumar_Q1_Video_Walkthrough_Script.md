# Voice Arena — Speaker Diarization Evaluation
## 2-Minute Video Walkthrough Script
**Presenter:** Ravindra Kumar  
**Target Duration:** Exactly 1 minute 50 seconds – 2 minutes  
**Format:** Screen recording with voiceover (Loom / YouTube Unlisted / Google Drive)  
**Submission Video URL:** `[PASTE YOUR LOOM / YOUTUBE UNLISTED / DRIVE LINK HERE]`

---

### Visual & Audio Timeline

#### [0:00 – 0:25] The Problem & The Non-Negotiable Honesty Rule
* **Visual:** Browser showing the Voice Arena Home page (`/`). Hover over the top persistent amber banner: *"Design mockup with illustrative benchmark data. Only the 'Real Mini-Run' page contains measured results."*
* **Speaker Script:**
  > "Hi everyone, I'm Ravindra Kumar. Welcome to Voice Arena — Speaker Diarization Leaderboard.
  > 
  > As an evaluation engineer, my first priority is intellectual honesty: across all pages, we maintain a persistent banner distinguishing between our illustrative benchmark model and our measured real mini-run.
  > 
  > Current diarization evaluations are broken. Companies publish impressive single-number claims like '3% DER', but when teams deploy them to messy meetings or 8kHz phone lines, error rates quadruple. Voice Arena is built from scratch to solve that."

---

#### [0:25 – 0:55] Choice 1: Statistical Honesty & Statistical Tie Badges
* **Visual:** Point to the main Leaderboard table. Highlight the `#1–2` rank badge and the indigo **"Stat Tie"** pill. Toggle the collar filter from `0.0s Strict [DIHARD]` to `0.25s Legacy [AMI]`. Watch the ranks and CI bars dynamically recompute.
* **Speaker Script:**
  > "The first design choice that matters most is **Statistical Honesty**.
  > 
  > In traditional leaderboards, if System A has 11.2% DER and System B has 11.8%, System A is crowned champion—even if that difference is pure random noise. 
  > 
  > In Voice Arena, we compute 95% bootstrap confidence intervals over test files. If confidence intervals overlap, our rank engine automatically groups them into a **Statistical Tie**—here displaying rank '1 to 2'. No false precision."

---

#### [0:55 – 1:25] Choice 2: The Paired Difference Bootstrap Engine
* **Visual:** Click over to the **Compare Page (`/compare`)**. Select `pyannote/speaker-diarization` as System A and `Deepgram Nova` as System B. Highlight the live verdict badge: *"System A reliably better (p < 0.05)"*, the mean difference `-3.8%`, and the 95% CI.
* **Speaker Script:**
  > "The second key choice is our **Paired Per-File Difference Engine** on the Compare page.
  > 
  > Rather than comparing systems independently, we evaluate paired differences on identical audio files using 2,000 bootstrap resamples calculated live in JavaScript. 
  > 
  > This gives product teams a clear, statistically sound verdict: whether System A is reliably better with p < 0.05, or whether there is no statistically reliable difference."

---

#### [1:25 – 1:45] Choice 3 & Benchmark Influences: DIHARD III & Multi-Domain Partitions
* **Visual:** Navigate to **Test Data (`/test-data`)** and hover over the Recharts donut chart showing 60 hours across Meeting, 8kHz Phone, Podcast, Medical, and Noisy Room. Then click **Real Mini-Run (`/real-run`)** showing measured CLI commands for `dscore` and `pyannote.metrics`.
* **Speaker Script:**
  > "The benchmark that influenced me most was **DIHARD III**. Like DIHARD, we enforce **0.0s strict collar** and **score all overlapping speech**, which represents 16% of natural conversation. 
  > 
  > We test across 60 hours in 5 distinct acoustic domains, backed by a two-pass human annotation protocol with a 3.12% human agreement ceiling. 
  > 
  > On our Real Mini-Run page, we provide verified local runs on public AMI and VoxConverse clips using standard dscore commands with documented acoustic failure modes."

---

#### [1:45 – 2:00] Conclusion & Roadmap
* **Visual:** Return to **Leaderboard (`/`)**, click **Clean Snapshot**, showing the clean presentation mode for screenshotting and executive review.
* **Speaker Script:**
  > "With more time, I would expand downstream transcript word attribution via MeetEval cpWER and add continuous automated API drift regression testing.
  > 
  > Voice Arena turns speech evaluation into actionable product decision science. Thank you!"

---

### Tips for Recording
1. **Resolution:** 1080p, 16:9 fullscreen.
2. **Audio:** Good external microphone, minimal room echo.
3. **Pacing:** Keep mouse movements smooth and intentional. Use browser zoom at 100% or 110%.
