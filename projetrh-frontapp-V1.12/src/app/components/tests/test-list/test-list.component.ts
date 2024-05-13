import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subject, switchMap, takeUntil} from "rxjs";
import {Test} from "../../../models/test.model";
import {TestAPIService} from "../../../services/API/testAPI.service";
import {SelectedItemsService} from "../../../services/selectedItems.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-test-list',
  templateUrl: './test-list.component.html',
  styleUrl: './test-list.component.scss'
})
export class TestListComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() isSearching!: boolean;
  searchInput: string = '';
  tests: Test[] = [];
  private unsubscribe$ = new Subject<void>();
  displayedColumns: string[] = ['id', 'label', 'creationDate', 'pointsSum', 'timeLimit', 'actions'];
  dataSource: MatTableDataSource<Test> = new MatTableDataSource<Test>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public testAPIService: TestAPIService,
              private selectedItemsService: SelectedItemsService) {
  }

  ngOnInit() {
    // Recover the appropriate list of tests (unarchived/archived) based on @isArchivedListSelected from SelectedItemsService
    this.selectedItemsService.isArchivedTestsListSelected.pipe(
      switchMap(isArchivedListSelected =>
        this.testAPIService.getItems(isArchivedListSelected).pipe(
          takeUntil(this.unsubscribe$)
        )
      )
    ).subscribe(tests => {
      this.tests = tests;
      this.dataSource.data = this.tests;
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
