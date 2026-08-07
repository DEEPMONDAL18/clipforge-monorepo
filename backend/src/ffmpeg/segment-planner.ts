export interface SegmentPlan {
  readonly segmentIndex: number;
  readonly startTimeSeconds: number;
  readonly durationSeconds: number;
  readonly title: string;
  readonly outputFileName: string;
}

export class SegmentPlanner {
  /**
   * Plans segment boundaries based on a fixed interval (e.g. 120s = 2m, 180s = 3m, 300s = 5m).
   * Short final segments smaller than 0.5s are merged into the last full segment to avoid orphan clips.
   */
  public static planFixedIntervalSegments(
    totalDurationSeconds: number,
    intervalSeconds: number
  ): SegmentPlan[] {
    if (totalDurationSeconds <= 0) {
      return [];
    }
    if (intervalSeconds <= 0) {
      throw new Error('Interval seconds must be greater than 0');
    }

    const plans: SegmentPlan[] = [];
    const fullCount = Math.floor(totalDurationSeconds / intervalSeconds);
    const rawRemainder = totalDurationSeconds % intervalSeconds;
    const remainder = Math.round(rawRemainder * 1000) / 1000;

    for (let index = 0; index < fullCount; index++) {
      const startTime = Math.round(index * intervalSeconds * 1000) / 1000;
      let duration = intervalSeconds;

      // If this is the last full segment and remainder is negligible (<= 0.5s), merge remainder into this clip
      if (index === fullCount - 1 && remainder > 0 && remainder <= 0.5) {
        duration += remainder;
      }

      duration = Math.round(duration * 1000) / 1000;

      plans.push({
        segmentIndex: index + 1,
        startTimeSeconds: startTime,
        durationSeconds: duration,
        title: `Part ${index + 1}`,
        outputFileName: `clip_${String(index + 1).padStart(3, '0')}.mp4`
      });
    }

    // If remainder is significant (> 0.5s), add as distinct final segment
    if (remainder > 0.5) {
      const lastIndex = fullCount + 1;
      const startTime = Math.round(fullCount * intervalSeconds * 1000) / 1000;
      plans.push({
        segmentIndex: lastIndex,
        startTimeSeconds: startTime,
        durationSeconds: remainder,
        title: `Part ${lastIndex}`,
        outputFileName: `clip_${String(lastIndex).padStart(3, '0')}.mp4`
      });
    }

    return plans;
  }
}
