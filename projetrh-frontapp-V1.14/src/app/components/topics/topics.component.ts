import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {TopicAddComponent} from "./topic-add/topic-add.component";
import {TopicAPIService} from "../../services/API/topicAPI.service";
import {SelectedItemsService} from "../../services/selectedItems.service";

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrl: './topics.component.scss'
})
export class TopicsComponent implements OnInit, OnDestroy {
  public topicAPIService = inject(TopicAPIService);
  private selectedItemsService = inject(SelectedItemsService);
  public dialog = inject(MatDialog);

  listFilters: { value: string; viewValue: string; }[] = [
    {value: 'unarchived', viewValue: 'Unarchived'},
    {value: 'archived', viewValue: 'Archived'}
  ];
  isArchivedListSelected!: boolean;
  isSearching: boolean = false;
  private unsubscribe$ = new Subject<void>();

  ngOnInit() {
    // Listen for selection of archived/unarchived list
    this.selectedItemsService.isArchivedTopicsListSelected
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(isArchivedListSelected => {
        this.isArchivedListSelected = isArchivedListSelected;
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * First, configure MatDialog settings for Topic-add component.
   * Then, open Topic-add component.
   * @param enterAnimationDuration
   * @param exitAnimationDuration
   */
  openAddDialog(enterAnimationDuration: string, exitAnimationDuration: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass = "dialog-small";

    this.dialog.open(TopicAddComponent, dialogConfig);
  }

  /**
   * Refresh topics list by making new API call
   */
  refreshTopicsList() {
    this.topicAPIService.refreshItems(this.isArchivedListSelected);
  }

  /**
   * Change de value of @isSearching.
   * If value true, it will display a search bar
   */
  onSearch() {
    this.isSearching = !this.isSearching;
  }

  /**
   * Executed when user change list type (unarchived/archived).
   * Change value of the BehaviorSubject @isArchivedListSelected
   * @param selectedValue
   */
  onSelectListFilter(selectedValue: boolean) {
    if (this.isArchivedListSelected != selectedValue) {
      this.selectedItemsService.isArchivedTopicsListSelected.next(selectedValue);
    }
  }

}
