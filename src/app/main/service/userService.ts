import {Injectable, signal} from '@angular/core';
import {ApiUser} from '../../api/apiUser';
import {Repos} from '../../Model/apiResponseModelRepos';
import {User} from '../../Model/apiResponseUser';
import {ToastrService} from 'ngx-toastr';
import {UserPermission} from '../../Model/apiResponseGetPermission';

/**
 * service for apiAuth Rest endpoint
 */
@Injectable({
  providedIn: 'root'
})

export class UserService {
  /**
   * constructor
   * @param apiUser
   * @param toastr
   */
  constructor(
    private apiUser: ApiUser,
    private toastr: ToastrService) {
  }

  selectedRepo = signal<Repos | null>(null);
  allUsers = signal<User[] | null>(null)
  allUserPermissions = signal<UserPermission[] | null>(null)

  /**
   * @param userId
   * @param password
   * @param role
   * @param groupIds
   * calls create user, handles response and error
   */
  createUser(userId: string, password: string,role: string, groupIds: string[] | null) {
    this.apiUser.addUser(userId, password, role, groupIds).subscribe(
      _ => {
        this.getUser(null)
        this.toastr.success("User Created")
      },
      error => {
        this.toastr.error(error.error.error, "User creation failed: ")
      }
    )
  }

  /**
   * @param userId
   * calls remove user, handles response and error
   */
  removeUser(userId: string) {
    this.apiUser.removeUser(userId).subscribe(
      _ => {
        this.getUser(null)
        this.toastr.success("User removed")
      },
      error => {
        this.toastr.error(error.error.error, "User remove failed: ")
      }
    )
  }

  /**
   * @param UserId
   * gets all users and saves in signal
   */
  getUser(UserId: string | null) {
    this.apiUser.getUser(UserId).subscribe(
      data => {
        this.allUsers.set(data.content)
      },
      error => {
        this.toastr.error(error.error.error, "Load user failed: ")
      }
    )
  }

  /**
   * @param repoId
   * @param userId
   * @param permissionType
   * @param path
   * calls add permission to user
   * handles error
   */
  addPermissionToUser(repoId: string, userId: string, permissionType: string, path: string) {
    this.apiUser.addPermissionToUser(repoId,userId,permissionType,path).subscribe(
      _ => {
        this.toastr.success("User permission added")
      },
      error => {
        this.toastr.error(error.error.error, "Add user permission failed: ")
      }
    )
  }

  /**
   * @param repoId
   * @param userId
   * @param path
   * calls remove user permission
   * handles error
   */
  removePermissionFromUser(repoId: string, userId: string, path: string) {
    this.apiUser.removePermissionFromUser(repoId,userId,path).subscribe(
      _ => {
        this.toastr.success("User permission removed")
      },
      error => {
        this.toastr.error(error.error.error, "remove user permission failed: ")
      }
    )
  }

  /**
   * @param repoId
   * @param userId
   * @param permissionType
   * @param path
   * calls update user
   * handles error
   */
  updatePermissionOnUser(repoId: string, userId: string, permissionType: string, path: string) {
    this.apiUser.updatePermissionOnUser(repoId,userId,permissionType,path).subscribe(
      _ => {
        this.toastr.success("User permission updated")
      },
      error => {
        this.toastr.error(error.error.error, "Update user permission failed: ")

      }
    )
  }

  /**
   * @param repo
   * @param user
   * calls get user permission
   * saves all permissions on user
   */
  loadPermission(repo: string, user: string) {
    this.apiUser.getUserPermission(repo, user).subscribe(
      data => {
        this.allUserPermissions.set(data.content);
      }
    )
  }
}

