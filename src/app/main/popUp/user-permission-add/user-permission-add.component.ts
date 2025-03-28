import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Permission} from '../../../Model/permission';
import {ApiUser} from '../../../api/apiUser';
import {Resources} from '../../../Model/apiResponseFileTree';
import {ApiResource} from '../../../api/apiResource';
import {UserService} from '../../service/userService';

@Component({
  selector: 'app-user-permission-add',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './user-permission-add.component.html',
  styleUrl: './user-permission-add.component.css'
})
export class UserPermissionAddComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<UserPermissionAddComponent>,
              private apiUser: ApiUser,
              private userService: UserService,
              private apiResource: ApiResource,
              @Inject(MAT_DIALOG_DATA) public dialogData: { repo: string }) {
  }

  addUserPermissionForm!: FormGroup;

  customPath: string = "";

  allUsersToAdd: string[] = []
  allPermissions: Permission[] = [Permission.EDIT, Permission.DENY, Permission.ADMIN, Permission.VIEW];
  allPaths: string[] = []


  ngOnInit() {
    this.addUserPermissionForm = new FormGroup({
      userToAdd: new FormControl('', []),
      pathToAdd: new FormControl('', []),
      permissionToAdd: new FormControl('', []),
    });

    this.addUserPermissionForm.valueChanges.subscribe(() => {
      this.isFormEmpty();
    });

    this.apiUser.getUser(null).subscribe(
      data => {
        if (data && data.content) {
          this.allUsersToAdd = data.content.map(user => user.userId)
        }
      }
    )

    this.apiResource.getResource(null, null, this.dialogData.repo, null, [], [], false, 10000).subscribe(
      data => {
        if (data && data.content) {
          this.allPaths = Object.values(data.content).flat()
            .map((resource: Resources) => resource.path);
        } else {
          this.allPaths = [];
        }
      });
  }

  addUserPermission() {
    const formValue = this.addUserPermissionForm.value;
    this.userService.addPermissionToUser(this.dialogData.repo, formValue.userToAdd, formValue.permissionToAdd, formValue.pathToAdd)
    this.closeDialog();
    setTimeout(() => {
      this.userService.loadPermission(this.dialogData.repo, formValue.userToAdd)
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
