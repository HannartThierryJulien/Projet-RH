import {Component, OnInit} from '@angular/core';
import {SelectedItemsService} from "../../../services/selectedItems.service";
import {Router} from "@angular/router";
import {QuestionnaireAPIService} from "../../../services/API/questionnaireAPI.service";
import {Questionnaire} from "../../../models/questionnaire.model";

@Component({
  selector: 'app-questionnaire-start',
  templateUrl: './questionnaire-start.component.html',
  styleUrl: './questionnaire-start.component.scss'
})
export class QuestionnaireStartComponent implements OnInit {
  private questionnaires!: Questionnaire[];

  constructor(private questionnaireAPIService: QuestionnaireAPIService,
              private selectedItemsService: SelectedItemsService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.questionnaireAPIService.getItems(false).subscribe(
      (questionnaires: Questionnaire[]) => {
        this.questionnaires = questionnaires;

        //Once there is at least one questionnaire in the array, mark it as selected and redirect user to theses questionnaire's details
        if (this.questionnaires.length > 0) {
          this.selectedItemsService.idQuestionnaireSelected.next(this.questionnaires[0].id);
          this.router.navigate(['/questionnaires', this.questionnaires[0].id]);
        }

      });
  }

}
