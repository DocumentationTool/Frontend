import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';
import {ResizeService} from './resize.service';

/**
 * directive to resize the sidebar
 */
@Directive({
  selector: '[appResizable]',
})
export class ResizableDirective {
  private isResizing = false;
  private startX = 0;
  private startWidth = 0;
  private minWidth = 200;
  private maxWidth = 500;

  /**
   * constructor
   * @param elementRef
   * @param renderer
   * @param sidebarService
   */
  constructor(private elementRef: ElementRef, private renderer: Renderer2, private sidebarService: ResizeService) {
    const resizeHandle = this.renderer.createElement('div');
    this.renderer.setStyle(resizeHandle, 'width', '10px');
    this.renderer.setStyle(resizeHandle, 'height', '100%');
    this.renderer.setStyle(resizeHandle, 'position', 'absolute');
    this.renderer.setStyle(resizeHandle, 'top', '0');
    this.renderer.setStyle(resizeHandle, 'right', '0');
    this.renderer.setStyle(resizeHandle, 'cursor', 'ew-resize');
    this.renderer.setStyle(resizeHandle, 'background', 'rgba(0, 0, 0, 0.1)');

    this.renderer.appendChild(this.elementRef.nativeElement, resizeHandle);

    resizeHandle.addEventListener('mousedown', (event: MouseEvent) => this.onMouseDown(event));
  }


  /**
   * @param event
   * @private
   * gets cursor position on mouse click on draggable sidebar
   */
  private onMouseDown(event: MouseEvent) {
    this.isResizing = true;
    this.startX = event.clientX;
    this.startWidth = this.elementRef.nativeElement.offsetWidth;

    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  /**
   * @param event
   * saves the mouse movement coordinates while drag
   */
  private onMouseMove = (event: MouseEvent) => {
    if (!this.isResizing) return;

    let newWidth = this.startWidth + (event.clientX - this.startX);
    newWidth = Math.max(this.minWidth, Math.min(this.maxWidth, newWidth));

    this.renderer.setStyle(this.elementRef.nativeElement, 'width', `${newWidth}px`);
    this.sidebarService.setSidebarWidth(newWidth); // Sidebar-Breite aktualisieren
  };

  /**
   * release drag sidebar
   */
  private onMouseUp = () => {
    this.isResizing = false;
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  };
}
