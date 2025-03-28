import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResizeService {
  sidebarWidth = signal(200); // Standardwert 200px

  setSidebarWidth(width: number) {
    this.sidebarWidth.set(width);
  }
}
