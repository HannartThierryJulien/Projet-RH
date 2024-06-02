import {AfterViewInit, Component, inject, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {TestAssignationComponent} from "../test-assignation.component";
import {Test} from "../../../../../models/test.model";
import {CandidateAPIService} from "../../../../../services/API/candidateAPI.service";
import {MatTableDataSource} from "@angular/material/table";
import {Candidate} from "../../../../../models/candidate.model";
import {SelectionModel} from "@angular/cdk/collections";
import {Subject, takeUntil} from "rxjs";
import {CandidateTest} from "../../../../../models/candidate-test.model";
import {CandidateTestAPIService} from "../../../../../services/API/candidate-testAPI.service";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-test-assign',
  templateUrl: './test-assign.component.html',
  styleUrl: './test-assign.component.scss'
})
export class TestAssignComponent implements OnInit, OnDestroy, AfterViewInit {
  public dialogRef = inject(MatDialogRef<TestAssignationComponent>);
  public data: Test = inject(MAT_DIALOG_DATA);
  private candidateAPIService = inject(CandidateAPIService);
  private candidateTestAPIService = inject(CandidateTestAPIService);


  private unsubscribe$ = new Subject<void>();
  candidates: Candidate[] = [];
  displayedColumns: string[] = ['select', 'lastname', 'firstname'];
  dataSource = new MatTableDataSource<Candidate>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSize = 5;
  pageSizeOptions = [5, 10];
  isSearching: boolean = false;
  searchInput: string = '';
  selection = new SelectionModel<Candidate>(true, []);
  newCandidateTests: CandidateTest[] = [];

  ngOnInit() {
    // Retrieve unarchived candidates and display table
    this.candidateAPIService.getItems(false)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(candidates => {
        this.candidates = candidates;
        this.dataSource.data = candidates;
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  /**
   * Whether the number of selected elements matches the total number of rows.
   */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /**
   * Selects all rows if they are not all selected; otherwise clear selection.
   */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /**
   * The label for the checkbox on the passed row.
   * @param row
   */
  checkboxLabel(row?: Candidate): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    const rowIndex = this.dataSource.data.indexOf(row) + 1;
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${rowIndex}`;
  }

  /**
   * Close the MatDialog of the test-assign component.
   */
  onClose(newCandidaTests?: CandidateTest[]): void {
    this.dialogRef.close(newCandidaTests);
  }

  /**
   * For every selected rows, create a new candidateTest and add it to database.
   */
  onAssign() {
    const selectedRows = this.selection.selected;

    selectedRows.forEach(row => {
      let testToAssign = new CandidateTest(0, new Date(new Date().toISOString()), null, null, null, false, 'assigned', row, this.data);

      this.candidateTestAPIService.addItem(testToAssign)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(candidateTest => this.newCandidateTests.push(candidateTest));
    });

    // this.selection.clear();
    this.onClose(this.newCandidateTests);
  }

  /**
   * Apply filter to table's data based on user input.
   * @param event
   */
  applyFilter(event: Event) {
    // Extract filter value from input event
    const filterValue = (event.target as HTMLInputElement).value;
    // Apply filter to data source
    this.dataSource.filter = filterValue.trim().toLowerCase();

    // If pagination is enabled and data source has a paginator
    if (this.dataSource.paginator) {
      // Reset to the first page after filtering
      this.dataSource.paginator.firstPage();
    }
  }

  onSearch() {
    this.isSearching = !this.isSearching;
  }
}
