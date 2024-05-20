import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {catchError, map, Observable} from "rxjs";
import {Answer} from "../models/answer.model";
import {TranslateService} from "@ngx-translate/core";

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  public readonly languages = [
    {code: 'en', label: 'English'},
    {code: 'fr', label: 'French'},
    {code: 'es', label: 'Spanish'},
  ];
  private readonly defaultLanguage: string = 'en';
  private appliedLanguage!: string;

  constructor(private translateService: TranslateService) {
  }

  public initializeLanguage(): string {
    if (!this.hasVisitedSiteBefore()) {
      if (!this.isBrowserLanguageSupported()) {
        this.setDefaultLanguage();
      }
    }
    return this.appliedLanguage;
  }

  private hasVisitedSiteBefore(): boolean {
    let storedValue = localStorage.getItem('language');

    if (storedValue == null) {
      return false;
    }

    const storedLangCode = JSON.parse(storedValue)
    if (!this.isLanguageSupported(storedLangCode)) {
      return false;
    }

    this.applyAndStoreLanguage(storedLangCode);
    return true;
  }

  private isBrowserLanguageSupported(): boolean {
    const browserLang = this.translateService.getBrowserLang();

    if (!browserLang || !this.isLanguageSupported(browserLang)) {
      return false;
    }

    this.applyAndStoreLanguage(browserLang);
    return true;
  }

  private setDefaultLanguage() {
    this.applyAndStoreLanguage(this.defaultLanguage);
  }

  private isLanguageSupported(langCode: string): boolean {
    return this.languages.some(lang => lang.code === langCode);
  }

  public applyAndStoreLanguage(langCode: string) {
    this.appliedLanguage = langCode;
    localStorage.setItem('language', JSON.stringify(langCode));
    return this.translateService.use(langCode);
  }

}
