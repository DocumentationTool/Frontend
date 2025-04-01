import {Injectable, signal} from '@angular/core';
import {Router} from '@angular/router';
import {ApiResource} from '../../api/apiResource';
import {ResourceService} from './resource.service';
import {ApiResponseModelResourceBeingEdited} from '../../Model/apiResponseModelResourceBeingEdited';
import {ResourceCreateNewComponent} from '../popUp/resource-createNew/resource-createNew.component';
import {MatDialog} from '@angular/material/dialog';
import {ResourceUploadComponent} from '../popUp/resource-upload/resource-upload.component';
import {ResourceEditTagsComponent} from '../popUp/resource-edit-tags/resource-edit-tags.component';
import {ResourceMoveComponent} from '../popUp/resource-move/resource-move.component';
import {RepoEditTagsComponent} from '../popUp/repo-edit-tags/repo-edit-tags.component';
import {UserAddComponent} from '../popUp/user-add/user-add.component';
import {User} from '../../Model/apiResponseUser';
import {UserEditComponent} from '../popUp/user-edit/user-edit.component';
import {GroupAddComponent} from '../popUp/group-add/group-add.component';
import {GroupEditComponent} from '../popUp/group-edit/group-edit.component';
import {ToastrService} from 'ngx-toastr';
import {AuthService} from './authService';
import {UserPermissionAddComponent} from '../popUp/user-permission-add/user-permission-add.component';
import {UserPermissionUpdateComponent} from '../popUp/user-permission-update/user-permission-update.component';
import {GroupPermissionAddComponent} from '../popUp/group-permission-add/group-permission-add.component';
import {GroupPermissionUpdateComponent} from '../popUp/group-permission-update/group-permission-update.component';

/**
 * service for navigation through the app
 */
@Injectable({
  providedIn: 'root'
})

export class NavigationService {
  /**
   * constructor
   * @param router
   * @param apiResource
   * @param resourceService
   * @param dialog
   * @param authService
   * @param toastr
   */
  constructor(private router: Router,
              private apiResource: ApiResource,
              private resourceService: ResourceService,
              private dialog: MatDialog,
              private authService: AuthService,
              private toastr: ToastrService) {
  }

  toggle = signal<boolean>(true);
  mode = signal<string>("editor");

  /**
   * toggles the sidebar
   */
  toggleSidebar() {
    this.toggle.update(current => !current);
  }

  /**
   * checks if allowed to edit file
   * opens editor
   */
  onEditor() {
    if (!this.isEditorActive()) { //wenn nur zwischen editor und preview hin und her gesrpungen wird, keine abfrage ob file editiert wird
      this.apiResource.checksResourceBeingEdited(this.resourceService.selectedFile()?.repoId, this.resourceService.selectedFile()?.path).subscribe(
        data => {
          console.log("data ", data)
          this.editedResourceCheck(data)
        },
        error => {
          console.error(error)
        }
      )
    } else {
      this.mode.set("editor")
    }
  }

  /**
   * @param data
   * checks if a file is currently being edited
   * handles navigation
   * handles error
   */
  editedResourceCheck(data: ApiResponseModelResourceBeingEdited) {
    if (!data.content.isBeingEdited) { //Abfrage ob file editiert wird
      console.log("File Editing")
      this.apiResource.setResourceBeingEdited(this.resourceService.selectedFile()?.repoId, this.resourceService.selectedFile()?.path, this.authService.username()).subscribe(
        data => {
          console.log("data ", data)
        },
        error => {
          console.error(error.error.error)
        }
      )
      this.router.navigate(['/editor'])
      this.mode.set("editor")
      this.resourceService.editingFile.set(this.resourceService.selectedFile());
    } else {
      this.toastr.error("File is being edited")
    }
  }

  /**
   * navigates to preview
   */
  onPreview() {
    this.mode.set("preview")
  }

  /**
   * opens popUp ResourceCreateNewComponent
   */
  createNewResource() {
    this.dialog.open(ResourceCreateNewComponent);
  }

  /**
   * opens popUp UserAddComponent
   */
  createNewUser() {
    this.dialog.open(UserAddComponent);
  }

  /**
   * opens popUp GroupAddComponent
   */
  createNewGroup() {
    this.dialog.open(GroupAddComponent);
  }

  /**
   * @param repo
   * opens popUp UserPermissionAddComponent
   */
  createNewUserPermission(repo: string) {
    this.dialog.open(UserPermissionAddComponent,
      {
        data: {repo}
      }
    )
  }

  /**
   * @param repoId
   * @param user
   * @param path
   * @param type
   * opens popUps UserPermissionUpdateComponent
   */
  updateUserPermission(repoId: string, user: string, path: string, type: string) {
    this.dialog.open(UserPermissionUpdateComponent,
      {
        data: {repoId, user, path, type}
      })
  }

  /**
   * @param repo
   * opens popUp GroupPermissionAddComponent
   */
  createNewGroupPermission(repo: string) {
    this.dialog.open(GroupPermissionAddComponent,
      {
        data: {repo}
      }
    )
  }

  /**
   * @param repoId
   * @param group
   * @param path
   * @param type
   * opens popUp GroupPermissionUpdateComponent
   */
  updateGroupPermission(repoId: string, group: string, path: string, type: string) {
    this.dialog.open(GroupPermissionUpdateComponent,
      {
        data: {repoId, group, path, type}
      })
  }

  /**
   * @param groupId
   * opens popUp GroupEditComponent
   */
  editGroup(groupId: string) {
    this.dialog.open(GroupEditComponent,
      {
        data: {groupId}
      }
    )
  }

  /**
   * @param repoId
   * @param user
   * opens popUp UserEditComponent
   */
  editUser(repoId: string | undefined, user: User) {
    this.dialog.open(UserEditComponent,
      {
        data: {repoId, user}
      });
  }

  /**
   * @param data
   * @param path
   * opens popUp ResourceUploadComponent
   */
  uploadNewResource(data: string, path: string) {
    this.dialog.open(ResourceUploadComponent,
      {
        data: {data, path}
      });
  }

  /**
   * @param repoId
   * @param path
   * opens popUp ResourceEditTagsComponent
   */
  editResourceTags(repoId: string | undefined, path: string | undefined) {
    this.dialog.open(ResourceEditTagsComponent,
      {
        data: {repoId, path}
      });
  }

  /**
   * @param repoId
   * opens popUp RepoEditTagsComponent
   */
  editRepoTags(repoId: string) {
    this.dialog.open(RepoEditTagsComponent,
      {
        data: {repoId}
      });
  }

  /**
   * @param repoId
   * @param path
   * opens popUp ResourceEditTagsComponent
   */
  editUnterRepoTags(repoId: string, path: string) {
    this.dialog.open(ResourceEditTagsComponent,
      {
        data: {repoId, path}
      });
  }

  /**
   * @param repoId
   * @param path
   * opens popUp ResourceMoveComponent
   */
  moveResource(repoId: string, path: string) {
    this.dialog.open(ResourceMoveComponent,
      {
        data: {repoId, path}
      });
  }

  /**
   * checks if editor window is currently active
   */
  isEditorActive(): boolean {
    return this.router.isActive('/main/editor', {
      paths: 'exact',
      queryParams: 'ignored',
      fragment: 'ignored',
      matrixParams: 'ignored',
    });
  }

  /**
   * checks if admin window is currently active
   */
  isAdminActive(): boolean {
    return this.router.isActive('/main/admin', {
      paths: 'exact',
      queryParams: 'ignored',
      fragment: 'ignored',
      matrixParams: 'ignored',
    });
  }

  /**
   * checks if permission window is currently active
   */
  isPermissionActive(): boolean {
    return this.router.isActive('/main/admin/permission', {
      paths: 'exact',
      queryParams: 'ignored',
      fragment: 'ignored',
      matrixParams: 'ignored',
    });
  }
}
