import {inject, Injectable} from "@angular/core";
import {BehaviorSubject, catchError, finalize, map, Observable, retry, tap, throwError} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {LoadingService} from "../loading.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NotificationService} from "../notification.service";
import {ErrorHandlerService} from "../errorHandler.service";

@Injectable({
  providedIn: 'root',
})
export class GenericAPIService<T> {
  protected http = inject(HttpClient)
  protected loadingService = inject(LoadingService);
  protected notificationService = inject(NotificationService);
  protected errorHandlerService = inject(ErrorHandlerService);

  protected itemName!: string;
  protected apiUrl!: string;
  public readonly nbRequestRetry: number = 1;
  public unarchivedItemsSubject: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);
  public archivedItemsSubject: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);
  protected errorMsg_loadItems!: string;
  private errorMsg_loadItem!: string;
  private errorMsg_refreshItems!: string;
  public errorMsg_addItem!: string;
  private errorMsg_editItem!: string;
  private errorMsg_deleteItem!: string;
  private successMsg_refreshItems!: string;
  public successMsg_addItem!: string;
  private successMsg_editItem!: string;
  private successMsg_deleteItem!: string;

  initializeMessages(): void {
    this.errorMsg_loadItems = "error_msg_load_items" + "." + this.itemName;
    this.errorMsg_loadItem = "error_msg_load_item" + "." + this.itemName;
    this.errorMsg_refreshItems = "error_msg_refresh_items" + "." + this.itemName;
    this.errorMsg_addItem = "error_msg_add_item" + "." + this.itemName;
    this.errorMsg_editItem = "error_msg_edit_item" + "." + this.itemName;
    this.errorMsg_deleteItem = "error_msg_delete_item" + "." + this.itemName;
    this.successMsg_refreshItems = "success_msg_refresh_items" + "." + this.itemName;
    this.successMsg_addItem = "success_msg_add_item" + "." + this.itemName;
    this.successMsg_editItem = "success_msg_edit_item" + "." + this.itemName;
    this.successMsg_deleteItem = "success_msg_delete_item" + "." + this.itemName;
  }

  loadItems(archived: boolean) {
    const key = archived ? ('load_archived_' + this.itemName + 's') : ('load_unarchived_' + this.itemName + 's');
    this.loadingService.setLoading(key, true);

    this.http.get<{ data: T[], message: string }>(this.apiUrl, {params: {archived: archived.toString()}}).pipe(
      map(response => response.data),
      retry(this.nbRequestRetry),
      catchError(error => this.errorHandlerService.handleError(error, this.errorMsg_loadItems)),
      finalize(() => this.loadingService.setLoading(key, false))
    ).subscribe({
      next: items => {
        if (archived) {
          this.archivedItemsSubject.next(items);
        } else {
          this.unarchivedItemsSubject.next(items);
        }
      }
    });
  }

  refreshItems(archived: boolean, showNotification: boolean = true) {
    const key = archived ? ('refresh_archived_' + this.itemName + 's') : ('refresh_unarchived_' + this.itemName + 's');
    this.loadingService.setLoading(key, true);

    this.http.get<{ data: T[], message: string }>(this.apiUrl, {params: {archived: archived.toString()}}).pipe(
      map(response => response.data),
      retry(this.nbRequestRetry),
      catchError(error => this.errorHandlerService.handleError(error, this.errorMsg_refreshItems)),
      finalize(() => this.loadingService.setLoading(key, false))
    ).subscribe({
      next: items => {
        if (archived) {
          this.archivedItemsSubject.next(items);
        } else {
          this.unarchivedItemsSubject.next(items);
        }
        showNotification ? this.notificationService.showInfo(this.successMsg_refreshItems) : null;
      }
    });
  }

  getItems(archived: boolean): Observable<T[]> {
    let subject;
    if (archived) {
      subject = this.archivedItemsSubject;
    } else {
      subject = this.unarchivedItemsSubject;
    }

    if (subject && subject.getValue().length === 0) {
      this.loadItems(archived);
    }

    return subject.asObservable();
  }

  getItem(id: number): Observable<T> {
    const key = `load_item_${id}`;
    this.loadingService.setLoading(key, true);

    return this.http.get<{ data: T, message: string }>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data),
      retry(this.nbRequestRetry),
      catchError(error => this.errorHandlerService.handleError(error, this.errorMsg_loadItem)),
      finalize(() => this.loadingService.setLoading(key, false))
    );
  }

  addItem(item: T, showNotification: boolean = true): Observable<T> {
    const key = 'add_' + this.itemName;
    this.loadingService.setLoading(key, true);

    return this.http.post<{ data: T, message: string }>(this.apiUrl, item).pipe(
      map(response => response.data),
      retry(this.nbRequestRetry),
      catchError(error => this.errorHandlerService.handleError(error, this.errorMsg_addItem)),
      finalize(() => this.loadingService.setLoading(key, false))
    ).pipe(
      tap((addedItem) => {
        const currentUnarchivedItems = this.unarchivedItemsSubject.getValue();
        this.unarchivedItemsSubject.next([...currentUnarchivedItems, addedItem]);
        showNotification ? this.notificationService.showSuccess(this.successMsg_addItem) : null;
      })
    );
  }

  editItem(item: any, showNotification: boolean = true): Observable<T> {
    const key = 'edit_' + this.itemName;
    this.loadingService.setLoading(key, true);

    return this.http.put<{ data: T, message: string }>(this.apiUrl + '/' + item.id, item).pipe(
      map(response => response.data),
      retry(this.nbRequestRetry),
      catchError(error => this.errorHandlerService.handleError(error, this.errorMsg_editItem)),
      finalize(() => this.loadingService.setLoading(key, false))
    ).pipe(
      tap((updatedItem: any) => {
        if (updatedItem.archived) {
          const currentArchivedItems: any[] = this.archivedItemsSubject.getValue();
          const index = currentArchivedItems.findIndex(item => item.id === updatedItem.id);
          if (index !== -1) {
            currentArchivedItems[index] = updatedItem;
            this.archivedItemsSubject.next([...currentArchivedItems]);
          }
        } else {
          const currentUnarchivedItems: any[] = this.unarchivedItemsSubject.getValue();
          const index = currentUnarchivedItems.findIndex(item => item.id === updatedItem.id);
          if (index !== -1) {
            currentUnarchivedItems[index] = updatedItem;
            this.unarchivedItemsSubject.next([...currentUnarchivedItems]);
          }
        }

        showNotification ? this.notificationService.showSuccess(this.successMsg_editItem) : null;
      })
    );
  }

  deleteItem(itemId: number, showNotification: boolean = true): Observable<{ data: T, message: string }> {
    const key = 'delete_' + this.itemName;
    this.loadingService.setLoading(key, true);

    return this.http.delete<{ data: T, message: string }>(this.apiUrl + '/' + itemId).pipe(
      map(response => response),
      retry(this.nbRequestRetry),
      catchError(error => this.errorHandlerService.handleError(error, this.errorMsg_deleteItem)),
      finalize(() => this.loadingService.setLoading(key, false))
    ).pipe(
      tap(() => {
        const currentUnarchivedItems: any[] = this.unarchivedItemsSubject.getValue();
        const updatedUnarchivedItems = currentUnarchivedItems.filter(item => item.id !== itemId);
        this.unarchivedItemsSubject.next(updatedUnarchivedItems);

        const currentArchivedItems: any[] = this.archivedItemsSubject.getValue();
        const updatedArchivedItems = currentArchivedItems.filter(item => item.id !== itemId);
        this.archivedItemsSubject.next(updatedArchivedItems);

        showNotification ? this.notificationService.showSuccess(this.successMsg_deleteItem) : null;
      })
    );
  }

  changeItemArchivedValue(item: any, showNotification: boolean = true): Observable<T> {
    const key = 'change_archived_value_' + this.itemName;
    this.loadingService.setLoading(key, true);

    item.archived = !item.archived;

    return this.editItem(item).pipe(
      finalize(() => {
        // Update the appropriate list based on the item's "archived" value
        if (item.archived) {
          // Remove the item from the unarchived items list
          const currentUnarchivedItems: any[] = this.unarchivedItemsSubject.getValue();
          const updatedUnarchivedItems = currentUnarchivedItems.filter(i => i.id !== item.id);
          this.unarchivedItemsSubject.next(updatedUnarchivedItems);

          // Add the item to the archived items list
          const currentArchivedItems: any[] = this.archivedItemsSubject.getValue();
          this.archivedItemsSubject.next([...currentArchivedItems, item]);
        } else {
          // Remove the item from the archived items list
          const currentArchivedItems: any[] = this.archivedItemsSubject.getValue();
          const updatedArchivedItems = currentArchivedItems.filter(i => i.id !== item.id);
          this.archivedItemsSubject.next(updatedArchivedItems);

          // Add the item to the unarchived items list
          const currentUnarchivedItems: any[] = this.unarchivedItemsSubject.getValue();
          this.unarchivedItemsSubject.next([...currentUnarchivedItems, item]);
        }

        this.loadingService.setLoading(key, false)
      }),
      catchError(error => this.errorHandlerService.handleError(error, this.errorMsg_editItem))
    );
  }

}
