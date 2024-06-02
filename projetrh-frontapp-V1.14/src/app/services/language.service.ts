import {inject, Injectable} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";

/**
 * Service used to manage app's translation.
 * It's based on the ngx-translate library.
 */
@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private translateService = inject(TranslateService);

  public readonly languages = [
    {code: 'en', label: 'English'},
    {code: 'fr', label: 'French'},
    {code: 'es', label: 'Spanish'},
  ];
  private readonly defaultLanguage: string = 'en';
  private appliedLanguage!: string;

  /**
   * Initializes the app language.
   *
   * Checks if the user has visited before; if not, applies the browser's supported language
   * or defaults to the app's language.
   */
  public initializeLanguage(): string {
    if (!this.hasVisitedSiteBefore()) {
      if (!this.isBrowserLanguageSupported()) {
        this.setDefaultLanguage();
      }
    }
    return this.appliedLanguage;
  }

  /**
   * Determines if the user has previously visited the app by checking localStorage.
   * If it has, retrieve the language and use it for the app translation.
   * @private
   */
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

  /**
   * Determines if the browser's language is supported.
   * If it has, use it for the app translation.
   * @private
   */
  private isBrowserLanguageSupported(): boolean {
    const browserLang = this.translateService.getBrowserLang();

    if (!browserLang || !this.isLanguageSupported(browserLang)) {
      return false;
    }

    this.applyAndStoreLanguage(browserLang);
    return true;
  }

  /**
   * Used to set the default language.
   * @private
   */
  private setDefaultLanguage() {
    this.applyAndStoreLanguage(this.defaultLanguage);
  }

  /**
   * Check if a given language code is part of the languages supported by the app.
   * @param langCode
   * @private
   */
  private isLanguageSupported(langCode: string): boolean {
    return this.languages.some(lang => lang.code === langCode);
  }

  /**
   * Store the chosen in the localStorage and apply it.
   * @param langCode
   */
  public applyAndStoreLanguage(langCode: string) {
    this.appliedLanguage = langCode;
    localStorage.setItem('language', JSON.stringify(langCode));
    return this.translateService.use(langCode);
  }

}
