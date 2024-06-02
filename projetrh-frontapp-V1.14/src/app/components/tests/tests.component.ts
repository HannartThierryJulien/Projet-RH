import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {TestAPIService} from "../../services/API/testAPI.service";
import {SelectedItemsService} from "../../services/selectedItems.service";
import {TestAddComponent} from "./test-add/test-add.component";

@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrl: './tests.component.scss'
})
export class TestsComponent implements OnInit, OnDestroy {
  public testAPIService = inject(TestAPIService);
  private selectedItemsService = inject(SelectedItemsService);
  public dialog = inject(MatDialog);

  listFilters: { value: string; viewValue: string; }[] = [
    {value: 'unarchived', viewValue: 'Unarchived'},
    {value: 'archived', viewValue: 'Archived'}
  ];
  isArchivedListSelected!: boolean;
  isSearching: boolean = false;
  searchText: string = '';
  private unsubscribe$ = new Subject<void>();

  ngOnInit() {
    // Listen for selection of archived/unarchived list
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
