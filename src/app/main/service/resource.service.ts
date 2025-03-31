import {Injectable, signal, WritableSignal} from '@angular/core';
import {Router} from '@angular/router';
import {ApiResource} from '../../api/apiResource';
import {ApiResponseFileTree, Resources} from '../../Model/apiResponseFileTree';
import {ApiResponseResource} from '../../Model/apiResponseResource';
import {ToastrService} from 'ngx-toastr';
import {AuthService} from './authService';
import {executeBrowserBuilder} from '@angular-devkit/build-angular';

/**
 * service for apiResource
 */
@Injectable({
  providedIn: 'root'
})

export class ResourceService {
  /**
   * constructor
   * @param router
   * @param apiResource
   * @param toastr
   * @param authService
   */
  constructor(
    private router: Router,
    private apiResource: ApiResource,
    private toastr: ToastrService,
    private authService: AuthService) {
  }

  fileTree = signal<ApiResponseFileTree | null>(null); //Die Repos und Files in einer Struktur
  selectedFile = signal<Resources | null>(null); //Das derzeit ausgewählte File
  editingFile = signal<Resources | null>(null)
  searchResults = signal<ApiResponseResource | null>(null);
  private _fileContent = signal<string>("");
  fileContentBeforeChanges = "";
  allTags: string[] | undefined;
  allRepoTagIds = signal<string[]>([]);
  allResourceTagIds = signal<string[]>([]);

  /**
   * @param file
   * gets called when click on resource in filetree
   * checks for changes
   * calls selectResource
   */
  onSelectResource(file: any) {
    if (this.checkForFileChanges()) {
      if (window.confirm("Save changes?")) {
        this.updateResource();
        this.selectResource(file);
      }
    } else {
      this.selectResource(file);
    }
  }

  /**
   * @param file
   * gets the resource clicked with data
   * sets selected file
   * sets data navigates to view
   * handles error
   */
  selectResource(file: any) {
    this.getResourceTags(null, file.path, file.repoId, this.authService.username(), [], [])
    this.apiResource.getResource(null, file.path, file.repoId, null, [], [], true, 1).subscribe(
      data => {
        const resources: Resources[] | undefined = data.content[file.repoId];
        if (resources && resources.length > 0) {
          const resource = resources.find(r => r.path === file.path);
          if (resource) {
            this.selectedFile.set(resource);
            this._fileContent.set(resource.data);
            this.fileContentBeforeChanges = resource.data;
            this.router.navigate(['/main/view'])

          } else {
            this.toastr.error("Resource not found")
          }
        } else {
          this.toastr.error("Resource not found")
        }
      },
      _ => {
        this.toastr.error("Resource not found")
      }
    );
  }

  /**
   * removes a file being edited
   * handles error
   */
  removeFileEditing() {
    this.apiResource.removesResourceBeingEdited(this.editingFile()?.repoId, this.editingFile()?.path).subscribe(
      data => {
        console.log(data)
      },
      error => {
        console.error(error.error.error)
      }
    )
  }

  /**
   * @param repoId
   * @param path
   * as admin, you can remove a file from being edited
   */
  removeFileEditingAdmin(repoId: string | undefined, path: string | undefined){
    if (window.confirm("Remove resouce being edited?")){
      this.apiResource.removesResourceBeingEdited(repoId, path).subscribe(
        _ => {
          this.toastr.success("File is not being edited anymore")
        },
        error => {
          this.toastr.error(error.error.error)
        }
      )
    }
  }

  /**
   * checks for file changes
   * compares data when loaded with current data
   */
  checkForFileChanges() {
    return this._fileContent() != this.fileContentBeforeChanges;
  }

  /**
   * getter for file content
   */
  get fileContent(): WritableSignal<string> {
    return this._fileContent;
  }

  /**
   * @param value
   * setter for file content
   */
  set fileContent(value: WritableSignal<string>) {
    this._fileContent = value;
  }

  /**
   * updates resource data
   * saves data
   * handles error
   */
  updateResource() {
    this.removeFileEditing();
    this.apiResource.updateResource(this.editingFile()?.repoId, this.editingFile()?.path, this.authService.username(), null, null, null, null, this.fileContent(), false).subscribe(
      _ => {
        this.loadFileTree();
        this.fileContentBeforeChanges = this._fileContent();
        this.toastr.success('Resource saved!')
      },
      error => {
        this.toastr.error(error.error.error, "Save failed: ")
      }
    )
  }

  /**
   * @param repoId
   * @param path
   * @param createdBy
   * @param category
   * @param tagIds
   * @param data
   * adds a new resource
   * loads file tree
   * handles error
   */
  addResource(repoId: string, path: string, createdBy: string, category: string | null, tagIds: string[] | null, data: string) {
    this.apiResource.addResource(repoId, path, createdBy, category, tagIds, data).subscribe(
      _ => {
        this.loadFileTree();
        this.toastr.success("Resource added")
      },
      error => {
        this.toastr.error(error.error.error, "Resource could not be added: ")
      }
    )
  }

  /**
   * @param repoId
   * @param path
   * @param tagsToAdd
   * @param tagsToRemove
   * adds a tag to a resource
   * removes a tag from resource
   * handles error
   */
  editResourceTags(repoId: string, path: string, tagsToAdd: string[], tagsToRemove: string[]) {
    this.apiResource.updateResource(repoId, path, null, tagsToAdd, tagsToRemove, null, null, null, false).subscribe(
      _ => {
        this.loadFileTree();
        this.toastr.success("Tags updated")

      },
      error => {
        this.toastr.error(error.error.error, "Tag updated failed: ")

      }
    )
  }

  /**
   * @param repoId
   * @param tagIdsToAdd
   * @param tagNamesToAdd
   * @param tagIdsToRemove
   * adds a tag to a repo
   * removes a tog from a repo
   * handles error
   */
  editRepoTags(repoId: string, tagIdsToAdd: string[], tagNamesToAdd: string[], tagIdsToRemove: string[]) {
    if (tagIdsToAdd && tagNamesToAdd && tagIdsToAdd.length === tagNamesToAdd.length) {
      for (let i = 0; i < tagIdsToAdd.length; i++) {
        this.apiResource.addTag(repoId, tagIdsToAdd[i], tagNamesToAdd[i]).subscribe(
          _ => {
            this.toastr.success("Tag added")
          },
          error => {
            this.toastr.error(error.error.error, "Tag add failed: ")
          }
        );
      }
    }

    if (tagIdsToRemove) {
      for (let i = 0; i < tagIdsToRemove.length; i++) {
        this.apiResource.removeTag(repoId, tagIdsToRemove[i]).subscribe(
          _ => {
            this.toastr.success("Tag removed")
          },
          error => {
            this.toastr.error(error.error.error, "Tag remove failed: ")
          }
        );
      }
    }
  }

  /**
   * @param repoId
   * gets all tags from a repo
   * saves them in signal
   * handles error
   */
  getTag(repoId: string) {
    this.apiResource.getTag(repoId).subscribe(
      data => {
        this.allTags = [];
        if (data.content) {
          this.allRepoTagIds.set(Object.entries(data.content).map(([id]) => id));
        }
      },
      error => {
        this.toastr.error(error.error.error, "Load tags failed: ")
      }
    );
  }

  /**
   * gets all available tags
   * handles error
   */
  getAllTags() {
    this.apiResource.getTag(null).subscribe(
      data => {
        this.allTags = Object.entries(data.content).map(([id]) => id);
      },
      error => {
        this.toastr.error(error.error.error, "Load tags failed: ")
      }
    )
    return this.allTags;
  }

  /**
   * @param repoId
   * @param path
   * removes a resource
   * handles error
   */
  removeResource(repoId: string, path: string) {
    this.apiResource.removeResource(repoId, path).subscribe(
      _ => {
        this.toastr.success("Resource removed!")
        this.loadFileTree();
      },
      error => {
        this.toastr.error(error.error.error, "Remove resource failed: ")
      }
    )
  }

  /**
   * @param userId
   * @param repoFrom
   * @param pathFrom
   * @param repoTo
   * @param pathTo
   * moves a resource to another path
   * handles error
   */
  moveResource(userId: string, repoFrom: string, pathFrom: string, repoTo: string, pathTo: string) {
    this.apiResource.moveResource(userId, repoFrom, pathFrom, repoTo, pathTo).subscribe(
      _ => {
        this.toastr.success("Resource moved: ")
      },
      error => {
        this.toastr.error(error.error.error, "Resource move failed: ")
      }
    )
  }

  /**
   * @param searchTerm
   * @param path
   * @param repoId
   * @param userId
   * @param whiteListTags
   * @param blacklistListTags
   * searches all resources
   * handles error
   */
  getResource(searchTerm: string | null, path: string | null, repoId: string | null, userId: string | null,
              whiteListTags: string[], blacklistListTags: string[]) {
    this.apiResource.getResource(searchTerm, path, repoId, userId, whiteListTags, blacklistListTags, false, 1073741824).subscribe(
      data => {
        this.searchResults.set(data);
      },
      error => {

        this.toastr.error(error.error.error, "Search failed: ")
      }
    )
  }

  /**
   * @param searchTerm
   * @param path
   * @param repoId
   * @param userId
   * @param whiteListTags
   * @param blacklistListTags
   * gets all tags from a resource
   * handles error
   */
  getResourceTags(searchTerm: string | null, path: string | null, repoId: string | null, userId: string | null,
                  whiteListTags: string[], blacklistListTags: string[]) {
    this.apiResource.getResource(searchTerm, path, repoId, userId, whiteListTags, blacklistListTags, false, 1).subscribe(
      data => { // Alle Tags einer Resource in signal speichern
        let tagsFound = false; // Flag, um zu prüfen, ob Tags vorhanden sind
        Object.values(data.content).forEach((resourcesArray) => {
          resourcesArray.forEach((resource) => {
            if (resource.tags && resource.tags.length > 0) { // Überprüfen, ob Tags vorhanden sind
              tagsFound = true; // Tags gefunden
              resource.tags.forEach((tagId) => { // Direkt durch das tags-Array iterieren
                this.allResourceTagIds.update((tags) => {
                  if (!tags.includes(tagId)) {
                    return [...tags, tagId]; // Neues Array mit dem neuen Tag zurückgeben
                  }
                  return tags;
                });
              });
            }
          });
        });

        // Wenn keine Tags gefunden wurden, allResourceTagIds auf [] setzen
        if (!tagsFound) {
          this.allResourceTagIds.set([]);
        }
      },
      error => {
        this.toastr.error(error.error.error, "Load tags failed: ")
      }
    );
  }

  /**
   * loads the file tree
   */
  loadFileTree() {
    this.apiResource.loadFileTree(null, null, null, this.authService.username(), [], [], false, 1073741824).subscribe(
      data => {
        this.fileTree.set(data);
        this.selectedFile.set(null)
      },
      error => {
        this.toastr.error(error.error.error, "Load fileTree failed: ")
      }
    );
  }

  /**
   * getter for file tree
   */
  get content() {
    return this.fileTree();
  }

  /**
   * @param path
   * splits the resource path \\
   */
  splitResourcePath(path: string) {
    return path.split("\\").pop() || '';
  }
}
