import {inject, Pipe, PipeTransform} from '@angular/core';
import {TimeService} from "../services/time.service";

/**
 * Convert a variable representing time in seconds to a string.
 */
@Pipe({
  name: 'secondsToTimeString'
})
export class SecondsToTimeStringPipe implements PipeTransform {
  private timeService = inject(TimeService);

  transform(seconds: number, reduceString: boolean = true): string {
    let convertedTime = this.timeService.convertSecondsToTime(seconds);

    if (reduceString) {
      return this.timeService.reduceTimeString(convertedTime);
    } else {
      return convertedTime;
    }
  }

}
