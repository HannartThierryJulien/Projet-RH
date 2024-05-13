import {Component, OnInit} from '@angular/core';
import {QuestionAPIService} from "../../../services/API/questionAPI.service";
import {Router} from "@angular/router";
import {QuestionListComponent} from "../question-list/question-list.component";
import {QuestionsComponent} from "../questions.component";
import {Question} from "../../../models/question.model";
import {SelectedItemsService} from "../../../services/selectedItems.service";

@Component({
  selector: 'app-question-start',
  templateUrl: './question-start.component.html',
  styleUrl: './question-start.component.scss'
})
export class QuestionStartComponent implements OnInit {
  private questions!: Question[];

  constructor(private questionAPIService: QuestionAPIService,
              private selectedItemsService: SelectedItemsService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.questionAPIService.getItems(false).subscribe(
      (questions: Question[]) => {
        this.questions = questions;

        //Once there is at least one question in the array, mark it as selected and redirect user to theses question's details
        if (this.questions.length > 0) {
          this.selectedItemsService.idQuestionSelected.next(this.questions[0].id);
          this.router.navigate(['/questions', this.questions[0].id]);
        }

      });
  }

}
