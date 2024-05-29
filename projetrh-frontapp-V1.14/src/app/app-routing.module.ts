import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {QuestionsComponent} from "./components/questions/questions.component";
import {TestsComponent} from "./components/tests/tests.component";
import {AuthComponent} from "./components/auth/auth.component";
import {QuestionDetailComponent} from "./components/questions/question-detail/question-detail.component";
import {QuestionnairesComponent} from "./components/questionnaires/questionnaires.component";
import {
  QuestionnaireDetailComponent
} from "./components/questionnaires/questionnaire-detail/questionnaire-detail.component";
import {TopicsComponent} from "./components/topics/topics.component";
import {TopicDetailComponent} from "./components/topics/topic-detail/topic-detail.component";
import {QuestionStartComponent} from "./components/questions/question-start/question-start.component";
import {
  QuestionnaireStartComponent
} from "./components/questionnaires/questionnaire-start/questionnaire-start.component";
import {TopicStartComponent} from "./components/topics/topic-start/topic-start.component";
import {TestDetailComponent} from "./components/tests/test-detail/test-detail.component";
import {CheckRoleGuard} from "./guards/checkRole.guard";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {TestTakeComponent} from "./components/tests/test-take/test-take.component";
import {ResultsCandidateComponent} from "./components/results/results-candidate/results-candidate.component";

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [CheckRoleGuard],
    data: {allowedRoles: ['hrManager', 'candidate']}
  },
  {
    path: 'questions',
    component: QuestionsComponent,
    canActivate: [CheckRoleGuard],
    data: {allowedRoles: ['hrManager']},
    children: [
      {path: '', component: QuestionStartComponent},
      {path: ':id', component: QuestionDetailComponent}
    ]
  },
  {
    path: 'questionnaires',
    component: QuestionnairesComponent,
    canActivate: [CheckRoleGuard],
    data: {allowedRoles: ['hrManager']},
    children: [
      {path: '', component: QuestionnaireStartComponent},
      {path: ':id', component: QuestionnaireDetailComponent}
    ]
  },
  {
    path: 'topics',
    component: TopicsComponent,
    canActivate: [CheckRoleGuard],
    data: {allowedRoles: ['hrManager']},
    children: [
      {path: '', component: TopicStartComponent},
      {path: ':id', component: TopicDetailComponent}
    ]
  },
  {
    path: 'tests',
    children: [
      {path: '', component: TestsComponent, canActivate: [CheckRoleGuard], data: {allowedRoles: ['hrManager']}},
      {path: ':id', component: TestDetailComponent, canActivate: [CheckRoleGuard], data: {allowedRoles: ['hrManager']}},
      {
        path: ':id/take',
        component: TestTakeComponent,
        canActivate: [CheckRoleGuard],
        data: {allowedRoles: ['candidate']}
      }
    ]
  },
  {
    path: 'results/:id',
    component: ResultsCandidateComponent,
    canActivate: [CheckRoleGuard],
    data: {allowedRoles: ['hrManager', 'candidate']}
  },
  {path: 'auth', component: AuthComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
