import {Component, OnInit} from '@angular/core';
import {MarkdownComponent} from "ngx-markdown";
import {NgIf} from "@angular/common";
import {ResourceService} from '../service/resource.service';
import {NavigationService} from '../service/navigation.service';

/**
 * when resource selected, shows data preview
 * shows resource information
 */
@Component({
  selector: 'app-view',
  imports: [
    MarkdownComponent,
    NgIf
  ],
  templateUrl: './view.component.html',
  styleUrl: './view.component.css'
})

export class ViewComponent {
  /**
   * constructor
   * @param resourceService
   * @param navigationService
   */
  constructor(protected resourceService: ResourceService,
              protected navigationService: NavigationService) {

  }
}
