import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {GroupService} from '../../service/groupService';
import {FormsModule} from '@angular/forms';
import {ApiUser} from '../../../api/apiUser';
import {ApiGroup} from '../../../api/apiGroup';
import {Permission} from '../../../Model/permission';
import {Resources} from '../../../Model/apiResponseFileTree';
import {ApiResource} from '../../../api/apiResource';
import {User} from '../../../Model/apiResponseUser';

@Component({
  selector: 'app-group-edit',
  imports: [
    FormsModule
  ],
  templateUrl: './group-edit.component.html',
  styleUrl: './group-edit.component.css'
})
export class GroupEditComponent implements OnInit {
  constructor(private dialogRef: MatDialogRef<GroupEditComponent>,
              private groupService: GroupService,
              private apiUser: ApiUser,
              private apiGroup: ApiGroup,
              @Inject(MAT_DIALOG_DATA) public dialogData: {repoId: string, groupId: string }) {
  }

  allUsersToAdd: string[] = [];
  allUsersToRemove: User[] = [];

  userToAdd: string = "";
  userToRemove: string = "";

  ngOnInit() {
    this.apiUser.getUser(null).subscribe(
      data => {
        if (data && data.content) {
          this.allUsersToAdd = data.content.map(user => user.userId)
        }
      }
    )
    this.apiGroup.getGroup(this.dialogData.groupId).subscribe(
      data => {
        if (data && data.content) {
          this.allUsersToRemove = data.content.flatMap(group => group.users);
        }
      }
    )
  }

  updateUser() {
    if (this.userToAdd) {
      this.groupService.addUserToGroup(this.userToAdd, this.dialogData.groupId)
    }

    if (this.userToRemove) {
      this.groupService.removeUserFromGroup(this.userToRemove, this.dialogData.groupId)
    }

    this.closeDialog();
  }

  onSelectUsersToAdd(userId: string) {
    this.userToAdd = userId;
  }

  onSelectUsersToRemove(userId: string) {
    this.userToRemove = userId;
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
