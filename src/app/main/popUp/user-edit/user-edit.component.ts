import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {User} from '../../../Model/apiResponseUser';
import {ApiGroup} from '../../../api/apiGroup';
import {GroupService} from '../../service/groupService';
import {Permission} from '../../../Model/permission';
import {UserService} from '../../service/userService';
import {ApiUser} from '../../../api/apiUser';
import {ApiResource} from '../../../api/apiResource';
import {Resources} from '../../../Model/apiResponseFileTree';

@Component({
  selector: 'app-user-edit',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css'
})
export class UserEditComponent implements OnInit {
  constructor(private dialogRef: MatDialogRef<UserEditComponent>,
              private apiGroup: ApiGroup,
              private apiUser: ApiUser,
              private apiResource: ApiResource,
              private groupService: GroupService,
              private userService: UserService,
              @Inject(MAT_DIALOG_DATA) public dialogData: { repoId: string, user: User }) {
  }

  editUserForm!: FormGroup;

  allGroupsToAdd: string[] = [];
  allGroupsToRemove: string[] = [];

  ngOnInit() {
    this.editUserForm = new FormGroup({
      groupsToAdd: new FormControl('', []),
      groupsToRemove: new FormControl('', [])});

    this.editUserForm.valueChanges.subscribe(() => {
      this.isFormEmpty();
    });

    this.apiGroup.getGroup(null).subscribe(
      data => {
        if (data && data.content) {
          this.allGroupsToAdd = data.content.map(group => group.groupId)
        }
      }
    )
    this.apiUser.getUser(this.dialogData.user.userId).subscribe(
      data => {
        if (data && data.content) {
          this.allGroupsToRemove = data.content.flatMap(group => group.groups)
        }
      }
    )
  }

  updateUser() {
    const formValue = this.editUserForm.value;

    if (formValue.groupsToAdd) {
      this.groupService.addUserToGroup(this.dialogData.user.userId, formValue.groupsToAdd)
    }

    if (formValue.groupsToRemove) {
      this.groupService.removeUserFromGroup(this.dialogData.user.userId, formValue.groupsToRemove)
    }

    if (formValue.permissionToAdd) {
      this.userService.addPermissionToUser(this.dialogData.repoId, this.dialogData.user.userId, formValue.permissionToAdd, formValue.pathToAdd)
    }

    if (formValue.permissionToRemove) {
      this.userService.removePermissionFromUser(this.dialogData.repoId, this.dialogData.user.userId, formValue.permissionToRemove)
    }
    this.closeDialog();
  }

  onSelectGroupsToAdd(groupId: string) {
    this.editUserForm.controls['groupsToAdd'].setValue(groupId);
  }

  onSelectGroupsToRemove(groupId: string) {
    this.editUserForm.controls['groupsToRemove'].setValue(groupId);
  }

  getPermissionName(permission: Permission): string {
    return Permission[permission];
  }

  isFormEmpty(): boolean {
    const formValue = this.editUserForm.value;
    return !formValue.groupsToAdd &&
      !formValue.groupsToRemove &&
      !formValue.permissionToAdd &&
      !formValue.pathToAdd &&
      !formValue.permissionToRemove;
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
