import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, Subject, takeUntil} from "rxjs";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {LoadingService} from "../../services/loading.service";
import {TestAPIService} from "../../services/API/testAPI.service";
import {SelectedItemsService} from "../../services/selectedItems.service";
import {TestAddComponent} from "./test-add/test-add.component";

@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrl: './tests.component.scss'
})
export class TestsComponent implements OnInit, OnDestroy {
  listFilters: { value: string; viewValue: string; }[] = [
    {value: 'unarchived', viewValue: 'Unarchived'},
    {value: 'archived', viewValue: 'Archived'}
  ];
  isArchivedListSelected!: boolean;
  isSearching: boolean = false;
  searchText: string = '';
  isLoading: boolean = false;
  private unsubscribe$ = new Subject<void>();

  constructor(public testAPIService: TestAPIService,
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

    this.selectedItemsService.isArchivedTestsListSelected
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
   * First, configure MatDialog settings for Test-add component.
   * Then, open Test-add component.
   * @param enterAnimationDuration
   * @param exitAnimationDuration
   */
  openAddDialog(enterAnimationDuration: string, exitAnimationDuration: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.panelClass= "dialog-small"

    this.dialog.open(TestAddComponent, dialogConfig);
  }

  /**
   * Refresh tests list by making new API call
   */
  refreshTestsList() {
    this.testAPIService.refreshItems(this.isArchivedListSelected);
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
      this.selectedItemsService.isArchivedTestsListSelected.next(selectedValue);
    }
  }

}
