import {Component, computed, HostListener, OnInit} from '@angular/core';
import {NavigationService} from '../service/navigation.service';
import {ResourceService} from '../service/resource.service';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {TreeChildComponent} from './tree-child/tree-child.component';
import * as Mammoth from 'mammoth';
import TurndownService from 'turndown';
import {ToastrService} from 'ngx-toastr';
import {AuthService} from '../service/authService';
import {KeyValuePipe, NgClass, NgForOf} from '@angular/common';
import {Resources} from '../../Model/apiResponseFileTree';
import {ResizableDirective} from './service/resizable.directive';

/**
 * Holds the filetree,
 * upload buttons and admin navigation
 */
@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLink,
    RouterLinkActive,
    TreeChildComponent,
    KeyValuePipe,
    NgForOf,
    NgClass,
    ResizableDirective
  ],
  templateUrl: './sidebar.component.html',
  standalone: true,
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  openRepos: Set<string> = new Set();

  /**
   * constructor
   * @param navigationService
   * @param authService
   * @param resourceService
   * @param toastr
   */
  constructor(protected navigationService: NavigationService,
              protected authService: AuthService,
              protected resourceService: ResourceService,
              private toastr: ToastrService) {
  }

  path: string = ""
  data: string = "";

  hoveredRepo: any;
  selectedRepo: string | null = null;
  selectedResource: Resources | null = null;
  hoveredResource: any;
  menuPosition = {x: 0, y: 0};
  isOpen: Record<string, boolean> = {};

  /**
   * @param event cursor position
   * @param resource selected resource
   * sets the resource edit pop up window position and opens it
   */
  openResourceMenu(event: MouseEvent, resource: Resources) {
    event.stopPropagation();
    this.selectedResource = resource;
    this.menuPosition = {x: this.popUpInWindow(event.clientX - 110), y: event.clientY + 10};
  }

  /**
   * @param resource
   * deletes a resource
   */
  deleteResource(resource: Resources) {
    if (window.confirm("Do you really want to delete '" + resource.path + "' in Repo: '" + resource.repoId + "'?")) {
      this.resourceService.removeResource(resource.repoId, resource.path);
      setTimeout(() => {
        this.resourceService.loadFileTree();
      }, 2000)
    }
  }

  /**
   * @param posX
   * sets window position
   * max x position 30
   */
  popUpInWindow(posX: number) {
    if (posX < 30) {
      return 30
    }
    return posX
  }

  /**
   * @param event
   * @param repoId
   * sets the repo edit pop up window position and opens it
   */
  openRepoMenu(event: MouseEvent, repoId: string) {
    event.stopPropagation();
    this.selectedRepo = repoId;
    this.menuPosition = {x: this.popUpInWindow(event.clientX - 110), y: event.clientY + 10};
  }

  /**
   * @param repoPath
   * toggles on click the children
   */
  toggleRepo(repoPath: string) {
    this.isOpen[repoPath] = !this.isOpen[repoPath]; // Öffnen/Schließen der Unter-Repositories
  }

  /**
   * @param event
   * checks for file changes
   * call upload method
   */
  onUpload(event: any) {
    if (this.resourceService.checkForFileChanges()) {
      if (window.confirm("Save changes?")) {
        this.resourceService.updateResource();
        this.upload(event);
      }
    } else {
      this.upload(event);
    }
    event.target.value = "";
  }

  /**
   * @param event
   * opens explorer to upload a .docx or .md file
   * handles the file upload for file type
   */
  upload(event: any) {
    const fileInput = event.target as HTMLInputElement;

    if (!fileInput.files || fileInput.files.length === 0) {
      console.warn("No resource selected.");
      return;
    }

    const file = fileInput.files[0];

    if (file.type === "text/markdown" || file.name.endsWith(".md")) {
      this.readMarkdownFile(file);
    } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.name.endsWith(".docx")) {
      this.convertDocxToMarkdown(file);
    } else {
      console.error("Only .md and .docx files are allowed!");
    }
  }


  /**
   * @param file
   * @private
   * file upload for .md file
   * reads file data
   */
  private readMarkdownFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.processFileContent(reader.result as string, file.name);
    };
    reader.readAsText(file);
  }

  /**
   * @param file
   * @private
   * file upload for .docx files
   * converts word data to html - ignores picture
   * converts html to markdown
   */
  private convertDocxToMarkdown(file: File) {
    const reader = new FileReader();
    reader.onload = async (event: any) => {
      const arrayBuffer = event.target.result;

      // Ignoriere Bilder und konvertiere nur den Text
      const options = {
        convertImage: Mammoth.images.imgElement(() => Promise.resolve({src: ""}))
      };

      Mammoth.convertToHtml({arrayBuffer}, options)
        .then((result) => {
          // HTML zu Markdown konvertieren
          const turndownService = new TurndownService();
          const markdown = turndownService.turndown(result.value);
          this.processFileContent(markdown, file.name.replace(".docx", ".md"));
        })
        .catch((error) => this.toastr.error("Error converting .docx: " + error.message));
    };
    reader.readAsArrayBuffer(file);
  }

  /**
   * @param content
   * @param fileName
   * @private
   * processes file content and opens pop up
   * for filename
   */
  private processFileContent(content: string, fileName: string) {
    this.data = content;
    this.path = fileName;

    this.navigationService.uploadNewResource(this.data, this.path);
  }

  /**
   * watches for clicks outside pup up
   * and closes it
   */
  @HostListener('document:click', ['$event'])
  closeMenu(_: Event) {
    this.selectedRepo = null
    this.selectedResource = null
  }

}
