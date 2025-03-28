import {Component, computed, OnInit} from '@angular/core';
import {NavbarComponent} from './navbar/navbar.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {ResourceService} from './service/resource.service';
import {MarkdownModule} from 'ngx-markdown';
import {RouterOutlet} from '@angular/router';
import {NgClass, NgStyle} from '@angular/common';
import {NavigationService} from './service/navigation.service';
import {ResizeService} from './sidebar/service/resize.service';

/**
 * Main class
 * implements navbar, sidebar and router outlet
 */
@Component({
  selector: 'app-main',
  imports: [
    NavbarComponent,
    SidebarComponent,
    MarkdownModule,
    RouterOutlet,
    NgClass,
    NgStyle
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})

export class MainComponent implements OnInit {
  /**
   * constructor
   * @param resourceService
   * @param navigationService
   * @param resizeService
   */
  constructor(public resourceService: ResourceService,
              public navigationService: NavigationService,
              protected resizeService: ResizeService) {

  }

  /**
   * Signal for dynamic page width
   */
  sidebarWidth = computed(() => this.resizeService.sidebarWidth());


  /**
   * loads filetree on init
   */
  ngOnInit(): void {
    this.resourceService.loadFileTree();
  }


  /**
   * gives dynamic width
   * differentiates between editor active and sidebar toggled
   */
  width() {
    if (this.navigationService.isEditorActive() && this.navigationService.toggle())
      return this.sidebarWidth();
    if (this.navigationService.isEditorActive() && !this.navigationService.toggle())
    return 0;
    if (!this.navigationService.isEditorActive() && this.navigationService.toggle())
      return this.sidebarWidth() + 20
    if (!this.navigationService.isEditorActive() && !this.navigationService.toggle())
      return 20
    return 0
  }
}
