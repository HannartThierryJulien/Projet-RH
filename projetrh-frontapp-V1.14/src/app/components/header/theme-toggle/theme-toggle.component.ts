import {AfterViewInit, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.scss'
})
export class ThemeToggleComponent implements OnInit {

  isDarkModeOn: boolean = false;

  constructor() { }

  ngOnInit(): void {
    const storedValue = localStorage.getItem('isDarkModeOn');
    if (storedValue !== null) {
      this.isDarkModeOn = JSON.parse(storedValue);
    }
    this.applyTheme();
  }

  switchTheme() {
    this.isDarkModeOn = !this.isDarkModeOn;
    localStorage.setItem('isDarkModeOn', JSON.stringify(this.isDarkModeOn));
    this.applyTheme();
  }

  private applyTheme() {
    if (this.isDarkModeOn) {
      document.documentElement.setAttribute('theme', 'dark');
      console.log('Dark mode activated');
    } else {
      document.documentElement.setAttribute('theme', 'light');
      console.log('Light mode activated');
    }
  }

  // get theme() {
  //   return document.documentElement.getAttribute('theme');
  // }
  //
  // toggle() {
  //   console.log('theme : ', document.documentElement.getAttribute('theme'));
  //
  //   if ('dark') {
  //     document.documentElement.setAttribute('theme', 'light');
  //   }
  //   if ('light') {
  //     document.documentElement.setAttribute('theme', 'dark');
  //   }
  // }
}
