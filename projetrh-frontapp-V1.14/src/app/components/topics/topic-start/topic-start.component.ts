import {Component, inject, OnInit} from '@angular/core';
import {Topic} from "../../../models/topic.model";
import {TopicAPIService} from "../../../services/API/topicAPI.service";
import {SelectedItemsService} from "../../../services/selectedItems.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-topic-start',
  templateUrl: './topic-start.component.html',
  styleUrl: './topic-start.component.scss'
})
export class TopicStartComponent implements OnInit {
  private topicAPIService = inject(TopicAPIService);
  private selectedItemsService = inject(SelectedItemsService);
  private router = inject(Router);

  ngOnInit(): void {
    this.topicAPIService.getItems(false).subscribe(
      (topics: Topic[]) => {
        // Once there is at least one topic in the array, mark it as selected and redirect user to these topic's details
        if (topics.length > 0) {
          this.selectedItemsService.idTopicSelected.next(topics[0].id);
          this.router.navigate(['/topics', topics[0].id]);
        }

      });
  }

}
