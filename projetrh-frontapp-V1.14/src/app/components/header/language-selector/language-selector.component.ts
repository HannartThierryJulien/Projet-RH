import {Component, OnDestroy, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {LanguageService} from "../../../services/language.service";
import {Subject, takeUntil} from "rxjs";
import {NotificationService} from "../../../services/notification.service";

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.scss'
})
export class LanguageSelectorComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  languages: any = []
  selectedLanguage!: string;

  constructor(private languageService: LanguageService,
              private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.languages = this.languageService.languages;
    this.selectedLanguage = this.languageService.initializeLanguage();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

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
