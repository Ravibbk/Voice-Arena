import { System, BenchmarkResult, FilterState, RankedItem } from '../types';

/**
 * Computes dynamic leaderboard rankings based on active filters,
 * adjusting scores for condition, collar, overlap, and speaker count settings.
 *
 * CRITICAL LOGIC:
 * If a system's 95% Confidence Interval overlaps with the system directly above it,
 * display a "Statistical Tie" badge and share the same rank group (e.g. "1–2").
 */
export function computeRankings(
  systems: System[],
  batchResults: BenchmarkResult[],
  streamingResults: BenchmarkResult[],
  filters: FilterState
): RankedItem[] {
  // Select track pool
  const resultsPool = filters.track === 'Streaming (Live)' ? streamingResults : batchResults;
  const systemMap = new Map<string, System>(systems.map(s => [s.id, s]));

  // Filter items
  const candidates: { system: System; result: BenchmarkResult }[] = [];

  for (const res of resultsPool) {
    const sys = systemMap.get(res.systemId);
    if (!sys) continue;

    // Filter by System Type
    if (filters.systemType !== 'All' && sys.systemType !== filters.systemType) {
      continue;
    }

    candidates.push({ system: sys, result: res });
  }

  // Calculate adjusted scores based on active filters
  const scoredItems = candidates.map(({ system, result }) => {
    let der = result.der;
    let ciHalf = result.ciHalfWidth;
    let jer = result.jer;
    let overlapDer = result.overlapDer;
    let spkAcc = result.speakerCountAccuracy;

    // Adjust for Audio Domain filter
    if (filters.domain !== 'All' && result.perConditionDer[filters.domain] !== undefined) {
      const condDer = result.perConditionDer[filters.domain];
      const ratio = condDer / result.der;
      der = condDer;
      ciHalf = Number((ciHalf * Math.sqrt(ratio)).toFixed(2));
      jer = Number((jer * ratio).toFixed(1));
      overlapDer = Number((overlapDer * ratio).toFixed(1));
    }

    // Adjust for Speaker Count filter
    if (filters.speakerCount !== 'All') {
      const key = filters.speakerCount === '2' ? '2' : filters.speakerCount === '3–5' ? '3-5' : '6+';
      if (result.perSpeakerCountDer[key] !== undefined) {
        const scDer = result.perSpeakerCountDer[key];
        const scRatio = scDer / result.der;
        der = Number(((der + scDer) / 2).toFixed(1));
        ciHalf = Number((ciHalf * Math.sqrt(scRatio)).toFixed(2));
      }
    }

    // Adjust for Language filter
    if (filters.language !== 'All' && result.perLanguageDer[filters.language] !== undefined) {
      const langDer = result.perLanguageDer[filters.language];
      const langRatio = langDer / result.der;
      der = Number(((der + langDer) / 2).toFixed(1));
      ciHalf = Number((ciHalf * Math.sqrt(langRatio)).toFixed(2));
    }

    // Adjust for Device filter
    if (filters.device !== 'All' && result.perDeviceDer[filters.device] !== undefined) {
      const devDer = result.perDeviceDer[filters.device];
      const devRatio = devDer / result.der;
      der = Number(((der + devDer) / 2).toFixed(1));
      ciHalf = Number((ciHalf * Math.sqrt(devRatio)).toFixed(2));
    }

    // Adjust for Collar setting: 0.25s legacy collar reduces DER substantially (approx ~35-40% lower)
    if (filters.collar === '0.25s Legacy [AMI]') {
      der = Number((der * 0.62).toFixed(1));
      ciHalf = Number((ciHalf * 0.75).toFixed(2));
      jer = Number((jer * 0.70).toFixed(1));
    }

    // Adjust for Overlaps setting: Ignored overlaps reduces DER significantly
    if (filters.overlaps === 'Ignored') {
      der = Number((der * 0.72).toFixed(1));
      ciHalf = Number((ciHalf * 0.8).toFixed(2));
      overlapDer = 0.0;
    }

    // Adjust for Speaker Count Knowledge: Told [Oracle] lowers confusion error
    if (filters.speakerCountKnowledge === 'Told [Oracle]') {
      der = Number((der * 0.84).toFixed(1));
      spkAcc = 100.0;
      ciHalf = Number((ciHalf * 0.85).toFixed(2));
    }

    const effectiveCi: [number, number] = [
      Math.max(0, Number((der - ciHalf).toFixed(1))),
      Number((der + ciHalf).toFixed(1))
    ];

    const speedStr = result.latencyP95 ? result.latencyP95 : `${result.speedRtf}x RTF`;

    return {
      system,
      result,
      effectiveDer: Number(der.toFixed(1)),
      effectiveCi,
      effectiveJer: jer,
      effectiveOverlapDer: overlapDer,
      effectiveSpeakerCountAcc: spkAcc,
      effectiveSpeed: speedStr,
      effectiveCost: result.costPerHour,
    };
  });

  // Sort ascending by effective DER (lower DER is better)
  scoredItems.sort((a, b) => a.effectiveDer - b.effectiveDer);

  // Group into ranks with Statistical Tie detection:
  // If system i's CI overlaps with system i-1's CI: [low_i, high_i] intersects [low_prev, high_prev]
  const rankedItems: RankedItem[] = [];

  for (let i = 0; i < scoredItems.length; i++) {
    const current = scoredItems[i];
    let isTie = false;
    let rankGroup = `${i + 1}`;

    if (i > 0) {
      const prev = scoredItems[i - 1];
      // Check 95% CI overlap between adjacent systems:
      // Overlap condition: max(low_prev, low_curr) <= min(high_prev, high_curr)
      const maxLow = Math.max(prev.effectiveCi[0], current.effectiveCi[0]);
      const minHigh = Math.min(prev.effectiveCi[1], current.effectiveCi[1]);

      if (maxLow <= minHigh) {
        isTie = true;
        // Mark previous item as tied if not already
        if (rankedItems[i - 1]) {
          rankedItems[i - 1].isStatisticalTie = true;
        }
      }
    }

    // Check forward overlap with i+1
    if (i < scoredItems.length - 1) {
      const next = scoredItems[i + 1];
      const maxLow = Math.max(current.effectiveCi[0], next.effectiveCi[0]);
      const minHigh = Math.min(current.effectiveCi[1], next.effectiveCi[1]);
      if (maxLow <= minHigh) {
        isTie = true;
      }
    }

    rankedItems.push({
      rank: i + 1,
      rankGroup,
      isStatisticalTie: isTie,
      ...current,
    });
  }

  // Refine rank groups for consecutive tied chains (e.g. "1–2" or "3–4")
  let startIdx = 0;
  while (startIdx < rankedItems.length) {
    if (!rankedItems[startIdx].isStatisticalTie) {
      rankedItems[startIdx].rankGroup = `${startIdx + 1}`;
      startIdx++;
      continue;
    }

    // Find the end of this tie cluster
    let endIdx = startIdx;
    while (
      endIdx + 1 < rankedItems.length &&
      rankedItems[endIdx + 1].isStatisticalTie &&
      Math.max(rankedItems[endIdx].effectiveCi[0], rankedItems[endIdx + 1].effectiveCi[0]) <=
      Math.min(rankedItems[endIdx].effectiveCi[1], rankedItems[endIdx + 1].effectiveCi[1])
    ) {
      endIdx++;
    }

    const groupLabel = startIdx === endIdx ? `${startIdx + 1}` : `${startIdx + 1}–${endIdx + 1}`;
    for (let k = startIdx; k <= endIdx; k++) {
      rankedItems[k].rankGroup = groupLabel;
      rankedItems[k].isStatisticalTie = true;
    }
    startIdx = endIdx + 1;
  }

  return rankedItems;
}
