import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingMap: Map<string, boolean> = new Map<string, boolean>();
  public loading$: BehaviorSubject<Map<string, boolean>> = new BehaviorSubject<Map<string, boolean>>(this.loadingMap);

  constructor() {}

  setLoading(key: string, loading: boolean) {
    this.loadingMap.set(key, loading);
    this.loading$.next(this.loadingMap);
  }

  isLoading(key: string) {
    return this.loadingMap.get(key) || false;
  }

  hasLoading() {
    return Array.from(this.loadingMap.values()).some(value => value);
  }
}
