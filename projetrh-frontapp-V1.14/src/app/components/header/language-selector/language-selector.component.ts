import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {LanguageService} from "../../../services/language.service";
import {Subject, takeUntil} from "rxjs";
import {NotificationService} from "../../../services/notification.service";

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.scss'
})
export class LanguageSelectorComponent implements OnInit, OnDestroy {
  private languageService = inject(LanguageService);
  private notificationService = inject(NotificationService);

  private unsubscribe$ = new Subject<void>();
  languages: any = []
  selectedLanguage!: string;

  ngOnInit(): void {
    // Fill languages variable to fill the language list on user interface
    this.languages = this.languageService.languages;
    // Apply a language (depending on whether the user has already visited)
    this.selectedLanguage = this.languageService.initializeLanguage();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * Executed when user select a language using the languages' list.
   * First apply and store selected language, then notify user of this change
   * @param languageCode
   */
  public onSwitchLanguage(languageCode: string) {
    this.selectedLanguage = languageCode;
    this.languageService.applyAndStoreLanguage(languageCode)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
          next: () => {
            this.notificationService.showInfo('Language applied successfully.' + languageCode);
          },
          error: () => {
            this.notificationService.showError('Error applying language.' + languageCode);
          }
        }
      );
  }


}
