import { Pipe, PipeTransform } from '@angular/core';
import {CountdownService} from "../services/countdown.service";

@Pipe({
  name: 'secondsToTimeString'
})
export class SecondsToTimeStringPipe implements PipeTransform {

  constructor(private countdownService: CountdownService) {}

  transform(seconds: number, reduceString: boolean = true): string {
    let convertedTime = this.countdownService.convertSecondsToTime(seconds);

    if (reduceString) {
      return this.countdownService.reduceTimeString(convertedTime);
    } else {
      return convertedTime;
    }
  }

}
