import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.scss'
})
export class ThemeToggleComponent implements OnInit {
  isDarkModeOn: boolean = false;

  ngOnInit(): void {
    // Check if user already came on app and has a favorite color mode
    const storedValue = localStorage.getItem('isDarkModeOn');
    if (storedValue !== null) {
      this.isDarkModeOn = JSON.parse(storedValue);
    }
    this.applyTheme();
  }

  /**
   * Save new color mode in localStorage and apply it
   */
  switchTheme() {
    this.isDarkModeOn = !this.isDarkModeOn;
    localStorage.setItem('isDarkModeOn', JSON.stringify(this.isDarkModeOn));
    this.applyTheme();
  }

  /**
   * Apply selected theme by changing the value of the "theme" attribute that angular material is listening to
   * @private
   */
  private applyTheme() {
    if (this.isDarkModeOn) {
      document.documentElement.setAttribute('theme', 'dark');
    } else {
      document.documentElement.setAttribute('theme', 'light');
    }
  }

}
