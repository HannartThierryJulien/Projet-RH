import {Component, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {LanguageService} from "../../../services/language.service";

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.scss'
})
export class LanguageSelectorComponent implements OnInit {
  languages: any = []
  selectedLanguage!: string;

  constructor(private languageService: LanguageService) {
  }

  ngOnInit(): void {
    this.languages = this.languageService.languages;
    this.selectedLanguage = this.languageService.initializeLanguage();
  }

  public onSwitchLanguage(languageCode: string) {
    this.selectedLanguage = languageCode;
    this.languageService.applyAndStoreLanguage(languageCode);
  }


}
