import {Component} from '@angular/core';
import {AuthAPIService} from "./services/API/authAPI.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'projetrh-frontapp-V1.14';

  constructor(private authAPIService: AuthAPIService) {
  }

  /**
   * When app starts, check if user can be auto logged
   */
  ngOnInit() {
    this.authAPIService.autoLogin();
  }

}
