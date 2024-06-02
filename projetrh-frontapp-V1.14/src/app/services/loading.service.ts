import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";

/**
 * Service used to know if a http request has started and if it has ended.
 */
@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingMap: Map<string, boolean> = new Map<string, boolean>();
  public loading$: BehaviorSubject<Map<string, boolean>> = new BehaviorSubject<Map<string, boolean>>(this.loadingMap);

  /**
   * List each http request with a name and a status (loading or not)
   * @param key
   * @param loading
   */
  setLoading(key: string, loading: boolean) {
    this.loadingMap.set(key, loading);
    this.loading$.next(this.loadingMap);
  }

  /**
   * Method used to know if a specific http request is still loading.
   * @param key
   */
  isLoading(key: string) {
    return this.loadingMap.get(key) || false;
  }

  /**
   * Methode used to know if at least one http request hasn't ended.
   */
  hasLoading() {
    return Array.from(this.loadingMap.values()).some(value => value);
  }
}
