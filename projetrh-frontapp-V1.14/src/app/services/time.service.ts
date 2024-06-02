import {Injectable} from "@angular/core";
import {interval, Subscription} from "rxjs";

/**
 * Service used to manage countdown, calculate time vars and format time vars.
 */
@Injectable({
  providedIn: 'root',
})
export class TimeService {
  private countdownSubscription: Subscription | undefined;
  private maxDurationInSeconds!: number;
  private timeRemainingInSeconds!: number;

  startCountdown(maxDurationInSeconds: number, onTick: (timeRemainingInSeconds: number) => void, onFinish: () => void) {
    this.maxDurationInSeconds = maxDurationInSeconds;
    this.timeRemainingInSeconds = maxDurationInSeconds;

    this.countdownSubscription = interval(1000).subscribe(() => {
      this.timeRemainingInSeconds -= 1;
      onTick(this.timeRemainingInSeconds);

      if (this.timeRemainingInSeconds <= 0) {
        this.stopCountdown();
        onFinish();
      }
    });
  }

  stopCountdown() {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }

  convertTimeToMilliseconds(timeString: string): number {
    const parts = timeString.split(':');
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const seconds = parseInt(parts[2], 10);
    return (hours * 3600 + minutes * 60 + seconds) * 1000;
  }

  convertTimeToSeconds(timeString: string): number {
    const parts = timeString.split(':');
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const seconds = parseInt(parts[2], 10);
    return (hours * 3600 + minutes * 60 + seconds);
  }

  convertMillisecondsToTimeString(milliseconds: number): string {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    return `${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(seconds)}`;
  }

  convertSecondsToTimeBis(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(remainingSeconds)}`;
  }

  convertSecondsToTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${this.padZero(hours)}h ${this.padZero(minutes)}m ${this.padZero(remainingSeconds)}s`;
  }

  reduceTimeString(timeString: string) {
    // remove hours if 0
    if (timeString.slice(0, 2) == "00") {
      timeString = timeString.slice(4);
    }

    // remove minutes if 0
    if (timeString.slice(0, 2) == "00") {
      timeString = timeString.slice(4);
    }

    // remove last 0 if there is one
    if (timeString.slice(0, 1) == "0") {
      timeString = timeString.slice(1);
    }

    return timeString;
  }

  private padZero(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  calculateElapsedTime(): number {
    return this.maxDurationInSeconds - this.timeRemainingInSeconds;
  }

  calculateDurationInSeconds(startedAt: Date | null, endedAt: Date | null): number {
    if (startedAt && endedAt) {
      const durationInMilliSeconds = new Date(endedAt).getTime() - new Date(startedAt).getTime();
      return Math.floor(durationInMilliSeconds / 1000);
    } else {
      return 0;
    }
  }

}
