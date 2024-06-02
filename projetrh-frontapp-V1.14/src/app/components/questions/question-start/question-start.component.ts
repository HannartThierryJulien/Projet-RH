import {Component, inject, OnInit} from '@angular/core';
import {QuestionAPIService} from "../../../services/API/questionAPI.service";
import {Router} from "@angular/router";
import {Question} from "../../../models/question.model";
import {SelectedItemsService} from "../../../services/selectedItems.service";

@Component({
  selector: 'app-question-start',
  templateUrl: './question-start.component.html',
  styleUrl: './question-start.component.scss'
})
export class QuestionStartComponent implements OnInit {
  private questionAPIService = inject(QuestionAPIService);
  private selectedItemsService = inject(SelectedItemsService);
  private router = inject(Router);

  ngOnInit(): void {
    this.questionAPIService.getItems(false).subscribe(
      (questions: Question[]) => {
        // Once there is at least one question in the array, mark it as selected and redirect user to these question's details
        if (questions.length > 0) {
          this.selectedItemsService.idQuestionSelected.next(questions[0].id);
          this.router.navigate(['/questions', questions[0].id]);
        }

      });
  }

}
