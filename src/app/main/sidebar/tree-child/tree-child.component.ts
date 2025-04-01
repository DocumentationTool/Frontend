import {Component, HostListener, Input} from '@angular/core';
import {ContentGroup, Resources} from '../../../Model/apiResponseFileTree';
import {KeyValuePipe, NgClass, NgForOf} from '@angular/common';
import {ResourceService} from '../../service/resource.service';
import {NavigationService} from '../../service/navigation.service';

/**
 * recursive tree component
 */
@Component({
  selector: 'app-tree-child',
  imports: [
    KeyValuePipe,
    NgForOf,
    NgClass
  ],
  templateUrl: './tree-child.component.html',
  styleUrl: './tree-child.component.css'
})
export class TreeChildComponent {
  /**
   * constructor
   * @param resourceService
   * @param navigationService
   */
  constructor(public resourceService: ResourceService,
              public navigationService: NavigationService) {
  }

  /**
   * gives children for recursive usage
   */
  @Input() children: Record<string, ContentGroup> = {};
  /**
   * gives parent repoId
   */
  @Input() parentRepoId: string | null = null;
  /**
   * gives parentPath
   */
  @Input() parentPath: string | undefined = '';
  isOpen: Record<string, boolean> = {};
  protected readonly Object = Object;

  menuPosition = {x: 0, y: 0};
  selectedResource: Resources | null = null;
  selectedPath: string | null = null;
  hoveredResource: any;
  hoveredRepo: any;

  /**
   * @param event
   * @param resource
   * opens resource popUp on mouse cursor
   */
  openResourceMenu(event: MouseEvent, resource: Resources) {
    event.stopPropagation();
    this.selectedResource = resource;
    this.menuPosition = {x: this.popUpInWindow(event.clientX - 110), y: event.clientY + 10};
  }

  /**
   * @param childKey
   * builds full path with parentPath and childKey
   */
  buildFullPath(childKey: string): string {
    return this.parentPath ? `${this.parentPath}\\${childKey}` : childKey;
  }

  /**
   * @param posX
   * checks that pupUp is not over 30px on X coordinate
   */
  popUpInWindow(posX: number) {
    if (posX < 30) {
      return 30
    }
    return posX
  }

  /**
   * @param repoId
   * toggles children
   */
  toggleChildren(repoId: string) {
    this.isOpen[repoId] = !this.isOpen[repoId];
  }

  /**
   * @param _
   * closes popUp when click
   */
  @ HostListener('document:click', ['$event'])
  closeMenu(_: Event) {
    this.selectedResource = null;
    this.selectedPath = null
  }

  /**
   * @param resource
   * deletes a resource with full path
   */
  deleteResource(resource: Resources) {
    if (window.confirm("Do you really want to delete '" + resource.path + "' in Repo: '" + resource.repoId + "'?")) {
      this.resourceService.removeResource(resource.repoId, resource.path);
      setTimeout(() => {
        this.resourceService.loadFileTree();
      }, 300)
    }
  }

}
