import {Component, OnInit} from '@angular/core';

import {NavigationService} from '../service/navigation.service';
import {UserService} from '../service/userService';
import {User} from '../../Model/apiResponseUser';
import {GroupService} from '../service/groupService';
import {ApiRepo} from '../../api/apiRepo';
import {Repos} from '../../Model/apiResponseModelRepos';
import {NgForOf, NgIf} from '@angular/common';
import {ApiUser} from '../../api/apiUser';
import {Permission} from '../../Model/permission';
import {UserPermission} from '../../Model/apiResponseGetPermission';

@Component({
  selector: 'app-admin',
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {

  constructor(public navigationService: NavigationService,
              protected userService: UserService,
              private apiRepo: ApiRepo,
              private apiUser: ApiUser,
              protected groupService: GroupService) {
  }

  editUserActive: boolean = true;
  editGroupActive: boolean = false;
  editPermissionActive: boolean = false;
  permissionOption: string = "";
  allRepos: Repos[] = [];
  allUserPermissions: UserPermission[] = [];
  allGroupPermissions: string[] = [];
  allUsers: string[] = [];
  selectedRepo: string = "";
  selectedUser: string = "";


  ngOnInit() {
    this.userService.getUser(null)
    this.groupService.getGroup(null)
    this.allGroupPermissions = ["GroupPerm1", "GroupPerm2"]

    this.apiRepo.getRepos().subscribe(
      data => {
        if (data && data.content) {
          this.allRepos = data.content.map(repo => repo);
        }
      }
    )
    this.apiUser.getUser(null).subscribe(
      data => {
        if (data && data.content) {
          this.allUsers = data.content.map(user => user.userId)
        }
      }
    )
  }

  toggleManagement(edit: string) {
    if (edit == 'user') {
      this.editGroupActive = false;
      this.editPermissionActive = false;
      this.editUserActive = true;
      return
    }
    if (edit == 'group') {
      this.editUserActive = false;
      this.editPermissionActive = false;
      this.editGroupActive = true;
      return;
    }
  }

  removeUser(userId: string) {
    if (window.confirm("Delete user: " + userId)) {
      this.userService.removeUser(userId)
    }
  }

  editUser(repoId: string | undefined, user: User
  ) {
    this.navigationService.editUser(repoId, user);
  }

  removeGroup(groupId: string
  ) {
    if (window.confirm("Delete group: " + groupId)) {
      this.groupService.removeGroup(groupId)
      this.groupService.getGroup(null)
    }
  }

  editGroup(groupId: string) {
    this.navigationService.editGroup(groupId);
  }

  onPermissionOption(option: string) {
    this.permissionOption = option;
    this.editUserActive = false;
    this.editGroupActive = false;
    this.editPermissionActive = true;
  }

  onRepo(repo: string) {
    this.selectedRepo = repo
    if (this.selectedUser){
      this.loadPermission(repo, this.selectedUser);
    }
  }

  onUser(user: string){
    this.selectedUser = user
    if (this.selectedRepo){
      this.loadPermission(this.selectedRepo, user)
    }
  }

  loadPermission(repo: string, user: string) {
    this.apiUser.getUserPermission(repo,user).subscribe(
      data => {
        this.allUserPermissions = data.content;
      }
    )
  }

  editUserPermission(repoId: string | undefined, permission: string) {

  }

  removeUserPermission(repoId: string | undefined, permission: string) {

  }

  editGroupPermission(repoId: string | undefined, permission: string) {

  }

  removeGroupPermission(repoId: string | undefined, permission: string) {

  }

}
