import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AuthComponent} from './components/auth/auth.component';
import {HeaderComponent} from './components/header/header.component';
import {QuestionnairesComponent} from './components/questionnaires/questionnaires.component';
import {
  QuestionnaireDetailComponent
} from './components/questionnaires/questionnaire-detail/questionnaire-detail.component';
import {QuestionnaireListComponent} from './components/questionnaires/questionnaire-list/questionnaire-list.component';
import {QuestionsComponent} from './components/questions/questions.component';
import {QuestionAddComponent} from './components/questions/question-add/question-add.component';
import {QuestionDetailComponent} from './components/questions/question-detail/question-detail.component';
import {QuestionListComponent} from './components/questions/question-list/question-list.component';
import {TopicsComponent} from './components/topics/topics.component';
import {TopicDetailComponent} from './components/topics/topic-detail/topic-detail.component';
import {TopicListComponent} from './components/topics/topic-list/topic-list.component';
import {TestsComponent} from './components/tests/tests.component';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {MatCardModule} from "@angular/material/card";
import {MatFormField, MatHint, MatLabel} from "@angular/material/form-field";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {MatAnchor, MatButton, MatIconButton} from "@angular/material/button";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {AuthInterceptorService} from "./services/authInterceptor.service";
import {MatProgressSpinner, MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatButtonToggle, MatButtonToggleGroup, MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatIcon} from "@angular/material/icon";
import {ThemeToggleComponent} from './components/header/theme-toggle/theme-toggle.component';
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {FilterByPropertyPipe} from "./pipes/filterByProperty.pipe";
import {MatChip, MatChipGrid, MatChipListbox, MatChipOption, MatChipSet} from "@angular/material/chips";
import {MatOption, MatSelect, MatSelectModule} from "@angular/material/select";
import {MatList, MatListItem} from "@angular/material/list";
import {DialogDeleteComponent} from './components/shared/dialog-delete/dialog-delete.component';
import {MatDialogActions, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {MatCheckbox} from "@angular/material/checkbox";
import {QuestionEditComponent} from './components/questions/question-edit/question-edit.component';
import {MatTooltip} from "@angular/material/tooltip";
import {MatTabsModule} from "@angular/material/tabs";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatTableModule} from "@angular/material/table";
import { QuestionStartComponent } from './components/questions/question-start/question-start.component';
import { LanguageSelectorComponent } from './components/header/language-selector/language-selector.component';
import { LoaderComponent } from './components/shared/loader/loader.component';
import { QuestionnaireStartComponent } from './components/questionnaires/questionnaire-start/questionnaire-start.component';
import { QuestionnaireEditComponent } from './components/questionnaires/questionnaire-edit/questionnaire-edit.component';
import { QuestionnaireAddComponent } from './components/questionnaires/questionnaire-add/questionnaire-add.component';
import { TopicAddComponent } from './components/topics/topic-add/topic-add.component';
import { TopicEditComponent } from './components/topics/topic-edit/topic-edit.component';
import { TopicStartComponent } from './components/topics/topic-start/topic-start.component';
import { TestListComponent } from './components/tests/test-list/test-list.component';
import {MatPaginator} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import { TestDetailComponent } from './components/tests/test-detail/test-detail.component';
import { TestDetailsComponent } from './components/tests/test-detail/test-details/test-details.component';
import { TestAssignationComponent } from './components/tests/test-detail/test-assignation/test-assignation.component';
import { TestAssignComponent } from './components/tests/test-detail/test-assignation/test-assign/test-assign.component';
import { QuestionTestManageComponent } from './components/tests/test-detail/test-details/question-test-manage/question-test-manage.component';
import { HasRoleDirective } from './directives/has-role.directive';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardCandidateComponent } from './components/dashboard/dashboard-candidate/dashboard-candidate.component';
import { DashboardHrManagerComponent } from './components/dashboard/dashboard-hr-manager/dashboard-hr-manager.component';
import { TestTakeComponent } from './components/tests/test-take/test-take.component';
import { TestTakeConfirmationComponent } from './components/dashboard/dashboard-candidate/test-take-confirmation/test-take-confirmation.component';
import { TestEditComponent } from './components/tests/test-edit/test-edit.component';
import {ClipboardModule} from "@angular/cdk/clipboard";
import { TestAddComponent } from './components/tests/test-add/test-add.component';
import { CandidateEditComponent } from './components/dashboard/dashboard-candidate/candidate-edit/candidate-edit.component';
import { ResultsCandidateComponent } from './components/results/results-candidate/results-candidate.component';
import { SecondsToTimeStringPipe } from './pipes/secondsToTimeString.pipe';
import { ChartTestsStatusComponent } from './components/charts/chart-tests-status/chart-tests-status.component';
import { ChartAverageQuestionsResultsComponent } from './components/charts/chart-average-questions-results/chart-average-questions-results.component';
import {MatDivider} from "@angular/material/divider";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule} from "@angular/material/core";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    HeaderComponent,
    QuestionnairesComponent,
    QuestionnaireDetailComponent,
    QuestionnaireListComponent,
    QuestionsComponent,
    QuestionAddComponent,
    QuestionDetailComponent,
    QuestionListComponent,
    TopicsComponent,
    TopicDetailComponent,
    TopicListComponent,
    TestsComponent,
    ThemeToggleComponent,
    FilterByPropertyPipe,
    DialogDeleteComponent,
    QuestionEditComponent,
    QuestionStartComponent,
    LanguageSelectorComponent,
    LoaderComponent,
    QuestionnaireStartComponent,
    QuestionnaireEditComponent,
    QuestionnaireAddComponent,
    TopicAddComponent,
    TopicEditComponent,
    TopicStartComponent,
    TestListComponent,
    TestDetailComponent,
    TestDetailsComponent,
    TestAssignationComponent,
    TestAssignComponent,
    QuestionTestManageComponent,
    DashboardComponent,
    DashboardCandidateComponent,
    DashboardHrManagerComponent,
    TestTakeComponent,
    TestTakeConfirmationComponent,
    TestEditComponent,
    TestAddComponent,
    CandidateEditComponent,
    ResultsCandidateComponent,
    SecondsToTimeStringPipe,
    ChartTestsStatusComponent,
    ChartAverageQuestionsResultsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatLabel,
    MatFormField,
    MatButton,
    MatInput,
    MatSlideToggle,
    MatProgressSpinner,
    MatButtonToggleGroup,
    MatButtonToggle,
    MatHint,
    MatIcon,
    MatIconButton,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem,
    MatChipListbox,
    MatChipOption,
    MatSelect,
    MatOption,
    MatChip,
    MatChipSet,
    MatChipGrid,
    MatList,
    MatListItem,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatCheckbox,
    MatTooltip,
    MatButtonToggleModule,
    MatTabsModule,
    MatSelectModule,
    TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        }
      }
    ),
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTableModule,
    MatPaginator,
    MatSortModule,
    HasRoleDirective,
    MatAnchor,
    ClipboardModule,
    MatDivider,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    provideAnimationsAsync(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
