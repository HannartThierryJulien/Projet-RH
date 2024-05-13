import {Injectable} from "@angular/core";
import {interval, Subscription} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class CountdownService {
  private countdownSubscription: Subscription | undefined;
  private timeLimitMilliseconds: number = 0;
  private timeRemainingMilliseconds: number = 0;

  constructor() {
  }

  startCountdown(timeLimitString: string, onTick: (timeRemaining: string) => void, onFinish: () => void) {
    this.timeLimitMilliseconds = this.convertTimeToMilliseconds(timeLimitString);
    this.timeRemainingMilliseconds = this.timeLimitMilliseconds;

    this.countdownSubscription = interval(1000).subscribe(() => {
      this.timeRemainingMilliseconds -= 1000;
      onTick(this.convertMillisecondsToTimeString(this.timeRemainingMilliseconds));

      if (this.timeLimitMilliseconds <= 0) {
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

  private convertTimeToMilliseconds(timeString: string): number {
    const parts = timeString.split(':');
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const seconds = parseInt(parts[2], 10);
    return (hours * 3600 + minutes * 60 + seconds) * 1000;
  }

  private convertMillisecondsToTimeString(milliseconds: number): string {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    return `${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(seconds)}`;
  }

  private padZero(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  calculateElapsedTime(): string {
    const elapsedTimeMilliseconds = this.timeLimitMilliseconds - this.timeRemainingMilliseconds;
    return this.convertMillisecondsToTimeString(elapsedTimeMilliseconds);
  }

  calculateTotalTimeLimit(times: string[]): string {
    let totalTimes: number = 0;
    times.forEach(time => {
      totalTimes += this.convertTimeToMilliseconds(time);
    });
    return this.convertMillisecondsToTimeString(totalTimes);
  }
}
