import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, of, Subject, takeUntil, tap} from "rxjs";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {DialogDeleteComponent} from "../../shared/dialog-delete/dialog-delete.component";
import {Topic} from "../../../models/topic.model";
import {TopicsComponent} from "../topics.component";
import {TopicAPIService} from "../../../services/API/topicAPI.service";
import {TopicEditComponent} from "../topic-edit/topic-edit.component";
import {SelectedItemsService} from "../../../services/selectedItems.service";

@Component({
  selector: 'app-topic-detail',
  templateUrl: './topic-detail.component.html',
  styleUrl: './topic-detail.component.scss'
})
export class TopicDetailComponent implements OnInit, OnDestroy {
  topic$!: Observable<Topic>;
  topicId!: number;
  private unsubscribe$ = new Subject<void>();

  constructor(private topicAPIService: TopicAPIService,
              private route: ActivatedRoute,
              private router: Router,
              private dialog: MatDialog,
              private selectedItemsService: SelectedItemsService) {
  }

  ngOnInit() {
    this.route.params
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (params: Params) => {
          // Recover topic's id in the route
          this.topicId = +params['id'];

          // Recover observable of topic and check if it's needed to change the selected list of the Topics component
          this.topic$ = this.topicAPIService.getItem(this.topicId).pipe(
            tap(topic => {
              this.checkIfNeededToChangeSelectedList(topic);
            })
          );
        }
      );
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * Delete topic from database and redirect user to "/topics"
   */
  deleteTopic() {
    this.topicAPIService.deleteItem(this.topicId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.router.navigate(['/topics']));
  }

  /**
   * First, configure MatDialog settings for DialogDelete component.
   * Second, open DialogDelete component.
   * Finally, listen for response and cancel/confirm deleting action.
   * @param enterAnimationDuration
   * @param exitAnimationDuration
   */
  openDeleteDialog(enterAnimationDuration: string, exitAnimationDuration: string) {
    const dialogConfig = new MatDialogConfig();
    let dataType = 'topic';
    let dataNote = ''; // Handled with json files of ngx-translate
    dialogConfig.data = {dataType, dataNote};
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    // Check if returned value by DialogDelete component is true. If it is the case, execute @deleteTopic()
    const dialogRef = this.dialog.open(DialogDeleteComponent, dialogConfig);
    dialogRef.afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        data => data ? this.deleteTopic() : null
      );
  }

  /**
   * First, configure MatDialog settings for Topic-edit component.
   * Second, open Topic-edit component.
   * Finally, listen for response. If any, it's the updated topic, transform it in observables.
   * @param topicToEdit
   * @param enterAnimationDuration
   * @param exitAnimationDuration
   */
  openEditDialog(topicToEdit: Topic, enterAnimationDuration: string, exitAnimationDuration: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {topicToEdit};
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = "dialog-small";

    // If response isn't null, recover topic and transform it in observable type.
    let dialogRef = this.dialog.open(TopicEditComponent, dialogConfig);
    dialogRef.afterClosed()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(response => {
        if (response) {
          this.topic$ = of(response.updatedTopic);
        }
      });
  }

  /**
   * Check if the selected list (of Topics component) has the same value as topic.archived.
   * If it's the same, don't do anything.
   * If it's not, change selected list (of Topics component) value.
   * @param topic
   */
  checkIfNeededToChangeSelectedList(topic: Topic) {
    let subj = this.selectedItemsService.isArchivedTopicsListSelected;
    if (subj.getValue() != topic.archived) {
      subj.next(topic.archived);
    }
  }

  /**
   * Check the value of topic.archived, change it to the opposite and update DB
   * @param topic
   */
  onChangeArchivedValue(topic: Topic) {
    this.topicAPIService.changeItemArchivedValue(topic)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(topic => this.topic$ = of(topic));
  }
}
