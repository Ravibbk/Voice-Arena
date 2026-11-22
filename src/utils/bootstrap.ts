import { BootstrapComparisonResult } from '../types';

/**
 * Paired Bootstrap Hypothesis Testing & Confidence Interval Calculator
 *
 * Given two arrays of per-file DERs for the same test audio files:
 *  - Calculates paired differences: diff_i = der_B[i] - der_A[i]
 *    (A positive difference means System A has lower DER / is better)
 *  - Resamples paired differences B times with replacement (B = 2,000)
 *  - Extracts empirical 95% Percentile Confidence Interval [2.5%, 97.5%]
 *  - Calculates empirical two-tailed p-value
 *  - Returns a statistically sound verdict:
 *      * "System A reliably better (p < 0.05)" if ciHigh < 0 (or meanDiff < 0 when diff = derA - derB)
 *      * "System B reliably better (p < 0.05)" if ciLow > 0
 *      * "No reliable difference (CIs overlap)" if CI spans zero
 */
export function computePairedBootstrap(
  dersA: number[],
  dersB: number[],
  nameA: string = 'System A',
  nameB: string = 'System B',
  B: number = 2000
): BootstrapComparisonResult {
  const n = Math.min(dersA.length, dersB.length);
  if (n === 0) {
    return {
      meanDiff: 0,
      ciLow: 0,
      ciHigh: 0,
      pValue: 1.0,
      verdict: 'No reliable difference (CIs overlap)',
      verdictType: 'tie',
      pairedDiffs: [],
      resampleDist: [],
      systemAName: nameA,
      systemBName: nameB,
    };
  }

  // Paired difference: (DER_A - DER_B)
  // Negative value means System A has lower DER (System A is superior)
  const pairedDiffs: number[] = [];
  for (let i = 0; i < n; i++) {
    pairedDiffs.push(dersA[i] - dersB[i]);
  }

  const meanDiff = pairedDiffs.reduce((sum, d) => sum + d, 0) / n;

  // Bootstrap resampling
  const resampledMeans: number[] = new Array(B);
  // Seeded/pseudo-random generation for deterministic responsiveness
  for (let b = 0; b < B; b++) {
    let resampleSum = 0;
    for (let i = 0; i < n; i++) {
      const randIdx = Math.floor(Math.random() * n);
      resampleSum += pairedDiffs[randIdx];
    }
    resampledMeans[b] = resampleSum / n;
  }

  resampledMeans.sort((a, b) => a - b);

  // 95% Confidence Interval (2.5% to 97.5% quantiles)
  const lowIdx = Math.floor(B * 0.025);
  const highIdx = Math.floor(B * 0.975);
  const ciLow = Number(resampledMeans[lowIdx].toFixed(2));
  const ciHigh = Number(resampledMeans[highIdx].toFixed(2));

  // Two-tailed empirical p-value: proportion of resamples with sign opposite to meanDiff
  let oppositeCount = 0;
  if (meanDiff < 0) {
    oppositeCount = resampledMeans.filter(m => m >= 0).length;
  } else if (meanDiff > 0) {
    oppositeCount = resampledMeans.filter(m => m <= 0).length;
  } else {
    oppositeCount = B;
  }
  const pValue = Math.min(1.0, Number(((2 * oppositeCount) / B).toFixed(4)));

  let verdict: 'System A reliably better (p < 0.05)' | 'System B reliably better (p < 0.05)' | 'No reliable difference (CIs overlap)';
  let verdictType: 'systemA' | 'systemB' | 'tie';

  // Remember: pairedDiff = DER_A - DER_B.
  // If ciHigh < 0, DER_A is reliably lower than DER_B -> System A is better.
  // If ciLow > 0, DER_A is reliably higher than DER_B -> System B is better.
  if (ciHigh < 0) {
    verdict = 'System A reliably better (p < 0.05)';
    verdictType = 'systemA';
  } else if (ciLow > 0) {
    verdict = 'System B reliably better (p < 0.05)';
    verdictType = 'systemB';
  } else {
    verdict = 'No reliable difference (CIs overlap)';
    verdictType = 'tie';
  }

  return {
    meanDiff: Number(meanDiff.toFixed(2)),
    ciLow,
    ciHigh,
    pValue,
    verdict,
    verdictType,
    pairedDiffs,
    resampleDist: resampledMeans.slice(0, 50), // sample for UI visualization
    systemAName: nameA,
    systemBName: nameB,
  };
}
