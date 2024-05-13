import {Component} from '@angular/core';
import {AuthAPIService} from "./services/API/authAPI.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'projetrh-frontapp-V1.12';

  constructor(private authAPIService: AuthAPIService) {
  }

  ngOnInit() {
    this.authAPIService.autoLogin();
  }
}
