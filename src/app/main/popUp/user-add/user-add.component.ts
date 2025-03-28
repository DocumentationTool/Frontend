import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {MatDialogRef} from '@angular/material/dialog';
import {UserService} from '../../service/userService';
import {ApiGroup} from '../../../api/apiGroup';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-user-add',
  imports: [
    FormsModule
  ],
  templateUrl: './user-add.component.html',
  styleUrl: './user-add.component.css'
})
export class UserAddComponent implements OnInit {
  constructor(private dialogRef: MatDialogRef<UserAddComponent>,
              private userService: UserService,
              private apiGroup: ApiGroup,
              private toastr: ToastrService) {
  }

  userId: string = "";
  password: string = "";
  role: string = "";
  groupIds: string = "";
  repeatPassword: string = "";
  allRoles: string[] = ["ADMIN", "USER"];
  allGroups: string[] = [];

  isRoleActive = false;
  isGroupsActive = false;

  ngOnInit() {
    this.apiGroup.getGroup(null).subscribe(
      data => {
        if (data && data.content) {
          this.allGroups = data.content.map(group => group.groupId)
        }
      }
    )
  }

  createNewUser() {
    if (this.password === this.repeatPassword) {
      this.userService.createUser(this.userId, this.password,this.role, this.splitGroups(this.groupIds))
      this.closeDialog();
    } else {
      this.toastr.error("password dont match")
    }
  }


  onGroups() {
    this.isRoleActive = false
    this.isGroupsActive = true
  }

  onRole() {
    this.isGroupsActive = false
    this.isRoleActive = true
  }

  onSelectGroup(group: string) {
    this.groupIds += (this.groupIds ? ';' : '') + group;
    this.isGroupsActive = false;
  }

  onSelectRole(role: string) {
    this.role = role;
    this.isGroupsActive = false;
  }

  splitGroups(group: string) {
    return group.split(";").map(group => group.trim()).filter(group => group.length > 0);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('input.groupId')) {
      this.isGroupsActive = false;
    }
    if (!target.closest('input.role')) {
      this.isRoleActive = false;
    }
  }

  @HostListener('document:keydown.tab', ['$event'])
  onEscapePress(event: KeyboardEvent) {
    this.isGroupsActive = false;
    this.isRoleActive = false;
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
