import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {GroupService} from '../../service/groupService';
import {ApiUser} from '../../../api/apiUser';

@Component({
  selector: 'app-group-add',
  imports: [
    FormsModule
  ],
  templateUrl: './group-add.component.html',
  styleUrl: './group-add.component.css'
})
export class GroupAddComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<GroupAddComponent>,
              protected groupService: GroupService,
              private apiUser: ApiUser) {
  }

  groupIdToAdd: string = "";
  groupNameToAdd: string = "";
  userToAdd: string = "";

  allUsers: string[] = [];

  ngOnInit() {
    this.apiUser.getUser(null).subscribe(
      data => {
        if (data && data.content) {
          this.allUsers = data.content.map(user => user.userId)
        }
      }
    )
  }

  onEditGroup() {
    if (this.groupIdToAdd) {
      this.groupService.addGroup(this.groupIdToAdd, this.groupNameToAdd);
      if (this.userToAdd) {

        setTimeout(() => {
          this.groupService.addUserToGroup(this.userToAdd, this.groupIdToAdd);

        }, 2000)
      }
    }

    this.closeDialog();
  }

  onSelectUser(user: string) {
    this.userToAdd = user;
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
