import {Injectable, signal} from '@angular/core';

/**
 * service that holds signal with sidebar width
 */
@Injectable({
  providedIn: 'root'
})
export class ResizeService {
  /**
   * signal with sidebar with
   */
  sidebarWidth = signal(200); // Standardwert 200px

  /**
   * @param width
   * sets with
   */
  setSidebarWidth(width: number) {
    this.sidebarWidth.set(width);
  }
}
