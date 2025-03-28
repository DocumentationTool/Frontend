import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Permission} from '../../../Model/permission';
import {ApiUser} from '../../../api/apiUser';
import {Resources} from '../../../Model/apiResponseFileTree';
import {ApiResource} from '../../../api/apiResource';
import {UserService} from '../../service/userService';
import {ApiGroup} from '../../../api/apiGroup';

@Component({
  selector: 'app-group-permission-update',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './group-permission-update.component.html',
  styleUrl: './group-permission-update.component.css'
})
export class GroupPermissionUpdateComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<GroupPermissionUpdateComponent>,
              private apiGroup: ApiGroup,
              private userService: UserService,
              private apiResource: ApiResource,
              @Inject(MAT_DIALOG_DATA) public dialogData: { repoId: string, user: string, path: string, type: string }) {
  }

  addUserPermissionForm!: FormGroup;

  allGroupsToAdd: string[] = []
  allPermissions: Permission[] = [Permission.EDIT, Permission.DENY, Permission.ADMIN, Permission.VIEW];
  allPaths: string[] = []


  ngOnInit() {
    this.addUserPermissionForm = new FormGroup({
      userToAdd: new FormControl("", []),
      pathToAdd: new FormControl(this.dialogData.path, []),
      permissionToAdd: new FormControl("", []),
    });

    this.addUserPermissionForm.valueChanges.subscribe(() => {
      this.isFormEmpty();
    });

    this.apiGroup.getGroup(null).subscribe(
      data => {
        if (data && data.content) {
          this.allGroupsToAdd = data.content.map(group => group.groupId)
        }
      }
    )

    this.apiResource.getResource(null, null, null, null, [], [], false, 10000).subscribe(
      data => {
        if (data && data.content) {
          this.allPaths = Object.values(data.content).flat()
            .map((resource: Resources) => resource.path);
        } else {
          this.allPaths = [];
        }
      });
  }

  addUpdatePermission() {
    const formValue = this.addUserPermissionForm.value;
    this.userService.updatePermissionOnUser(this.dialogData.repoId, this.dialogData.user, formValue.permissionToAdd, formValue.pathToAdd)
    this.closeDialog();
    setTimeout(() => {
      this.userService.loadPermission(this.dialogData.repoId, formValue.userToAdd)
    },1500)
  }

  onSelectUsersToAdd(userId: string) {
    this.addUserPermissionForm.controls['userToAdd'].setValue(userId);
  }

  onSelectPermissionToAdd(permission: string) {
    this.addUserPermissionForm.controls['permissionToAdd'].setValue(permission);
  }

  onSelectPath(path: string) {
    this.addUserPermissionForm.controls['pathToAdd'].setValue(path);
  }

  getPermissionName(permission: Permission): string {
    return Permission[permission];
  }

  isFormEmpty(): boolean {
    const formValue = this.addUserPermissionForm.value;
    return !formValue.userToAdd ||
      !formValue.permissionToAdd ||
      !formValue.pathToAdd
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
