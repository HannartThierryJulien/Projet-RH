import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {QuestionAPIService} from "../../services/API/questionAPI.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {QuestionAddComponent} from "./question-add/question-add.component";
import {LoadingService} from "../../services/loading.service";
import {Subject, takeUntil} from "rxjs";
import {SelectedItemsService} from "../../services/selectedItems.service";

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrl: './questions.component.scss'
})
export class QuestionsComponent implements OnInit, OnDestroy {
  listFilters: { value: string; viewValue: string; }[] = [
    {value: 'unarchived', viewValue: 'Unarchived'},
    {value: 'archived', viewValue: 'Archived'}
  ];
  isArchivedListSelected!: boolean;
  isSearching: boolean = false;
  isLoading: boolean = false;
  private unsubscribe$ = new Subject<void>();

  constructor(public questionAPIService: QuestionAPIService,
              private selectedItemsService: SelectedItemsService,
              public dialog: MatDialog,
              public loadingService: LoadingService,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    // Allow to know if there is at least one element loading
    this.loadingService.loading$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(loadingMap => {
        this.isLoading = Array.from(loadingMap.values()).some(value => value);
        this.changeDetectorRef.detectChanges(); // Force change detection
      });

    this.selectedItemsService.isArchivedQuestionsListSelected
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
   * First, configure MatDialog settings for Question-add component.
   * Then, open Question-add component.
   * @param enterAnimationDuration
   * @param exitAnimationDuration
   */
  openAddDialog(enterAnimationDuration: string, exitAnimationDuration: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    this.dialog.open(QuestionAddComponent, dialogConfig);
  }

  /**
   * Refresh questions list by making new API call
   */
  refreshQuestionsList() {
    this.questionAPIService.refreshItems(this.isArchivedListSelected);
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
      this.selectedItemsService.isArchivedQuestionsListSelected.next(selectedValue);
    }
  }
}
