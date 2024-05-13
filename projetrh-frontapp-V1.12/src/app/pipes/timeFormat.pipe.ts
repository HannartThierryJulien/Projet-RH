import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'timeFormat'
})
export class TimeFormatPipe implements PipeTransform {
  transform(timeString: string): string {
    const [hours, minutes, seconds] = timeString.split(':');
    let formattedTime = '';

    if (parseInt(hours) > 0) {
      formattedTime += `${hours}h `;
    }

    if (parseInt(minutes) > 0) {
      formattedTime += `${minutes}min `;
    }

    if (parseInt(seconds) > 0) {
      formattedTime += `${seconds}sec`;
    }

    return formattedTime.trim();
  }
}
