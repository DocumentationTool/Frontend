import {Component, OnInit} from '@angular/core';

import {NavigationService} from '../service/navigation.service';
import {UserService} from '../service/userService';
import {User} from '../../Model/apiResponseUser';
import {GroupService} from '../service/groupService';
import {ApiRepo} from '../../api/apiRepo';
import {Repos} from '../../Model/apiResponseModelRepos';
import {NgForOf, NgIf} from '@angular/common';
import {ApiUser} from '../../api/apiUser';
import {ApiGroup} from '../../api/apiGroup';



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
              private apiGroup: ApiGroup,
              protected groupService: GroupService) {
  }

  editUserActive: boolean = true;
  editGroupActive: boolean = false;
  editPermissionActive: boolean = false;
  permissionOption: string = "";
  allRepos: Repos[] = [];
  allGroupPermissions: string[] = [];
  allUsers: string[] = [];
  allGroups: string[] = [];
  selectedRepo: string = "";
  selectedUser: string = "";
  selectedGroup: string = "";


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

    this.apiGroup.getGroup(null).subscribe(
      data => {
        if (data && data.content) {
          this.allGroups = data.content.map(group => group.groupId)
        }
      }
    )
  }

  toggleManagement(edit: string) {

    if (edit == 'user') {
      this.editGroupActive = false;
      this.editPermissionActive = false;
      this.editUserActive = true;
      this.permissionOption = "";
      this.editPermissionActive = false;
      return
    }
    if (edit == 'group') {
      this.editUserActive = false;
      this.editPermissionActive = false;
      this.editGroupActive = true;
      this.permissionOption = "";
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
    if (this.selectedUser) {
      this.userService.loadPermission(repo, this.selectedUser);
    }
  }

  onUser(user: string) {
    this.selectedUser = user
    if (this.selectedRepo) {
      this.userService.loadPermission(this.selectedRepo, user)
    }
  }

  onGroup(group: string) {
    this.selectedGroup = group
    if (this.selectedRepo) {
      this.groupService.loadPermission(this.selectedRepo, group)
    }
  }

  editUserPermission(repoId: string, path: string, type: string) {
    this.navigationService.updateUserPermission(repoId, this.selectedUser, path, type)
  }

  removeUserPermission(repoId: string, userId: string, path: string) {
    if (window.confirm("Delete user permission?")) {
      this.userService.removePermissionFromUser(repoId, userId, path);
      setTimeout(() => {
        this.userService.loadPermission(repoId, userId)
      }, 1500)
    }
  }

  editGroupPermission(repoId: string, path: string, type: string) {
    this.navigationService.updateGroupPermission(repoId, this.selectedGroup, path,type)
  }

  removeGroupPermission(repoId: string, group: string, path: string) {
    if (window.confirm("Delete user permission?")) {
      this.userService.removePermissionFromUser(repoId, group, path);
      setTimeout(() => {
        this.groupService.loadPermission(repoId, group)
      }, 1500)
    }
  }

}
