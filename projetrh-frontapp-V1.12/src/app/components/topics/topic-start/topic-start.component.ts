import {Component, OnInit} from '@angular/core';
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
  private topics!: Topic[];

  constructor(private topicAPIService: TopicAPIService,
              private selectedItemsService: SelectedItemsService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.topicAPIService.getItems(false).subscribe(
      (topics: Topic[]) => {
        this.topics = topics;

        //Once there is at least one topic in the array, mark it as selected and redirect user to theses topic's details
        if (this.topics.length > 0) {
          this.selectedItemsService.idTopicSelected.next(this.topics[0].id);
          this.router.navigate(['/topics', this.topics[0].id]);
        }

      });
  }

}
