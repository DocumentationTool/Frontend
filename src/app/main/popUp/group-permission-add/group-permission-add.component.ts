import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Permission} from '../../../Model/permission';
import {Resources} from '../../../Model/apiResponseFileTree';
import {ApiResource} from '../../../api/apiResource';
import {ApiGroup} from '../../../api/apiGroup';
import {GroupService} from '../../service/groupService';

@Component({
  selector: 'app-group-permission-add',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './group-permission-add.component.html',
  styleUrl: './group-permission-add.component.css'
})
export class GroupPermissionAddComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<GroupPermissionAddComponent>,
              private apiGroup: ApiGroup,
              private groupService: GroupService,
              private apiResource: ApiResource,
              @Inject(MAT_DIALOG_DATA) public dialogData: { repo: string }) {
  }

  addGroupPermissionForm!: FormGroup;

  allGroupsToAdd: string[] = []
  allPermissions: Permission[] = [Permission.EDIT, Permission.DENY, Permission.ADMIN, Permission.VIEW];
  allPaths: string[] = []

  customPath: string = ""


  ngOnInit() {
    this.addGroupPermissionForm = new FormGroup({
      groupToAdd: new FormControl('', []),
      pathToAdd: new FormControl('', []),
      permissionToAdd: new FormControl('', []),
    });

    this.addGroupPermissionForm.valueChanges.subscribe(() => {
      this.isFormEmpty();
    });

    this.apiGroup.getGroup(null).subscribe(
      data => {
        if (data && data.content) {
          this.allGroupsToAdd = data.content.map(group => group.groupId)
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

  addGroupPermission() {
    const formValue = this.addGroupPermissionForm.value;
    this.groupService.addPermissionToGroup(this.dialogData.repo, formValue.groupToAdd, formValue.permissionToAdd, formValue.pathToAdd)
    this.closeDialog();
    setTimeout(() => {
      this.groupService.loadPermission(this.dialogData.repo, formValue.groupToAdd)
    }, 1500)
  }

  onSelectGroupsToAdd(groupId: string) {
    this.addGroupPermissionForm.controls['groupToAdd'].setValue(groupId);
  }

  onSelectPermissionToAdd(permission: string) {
    this.addGroupPermissionForm.controls['permissionToAdd'].setValue(permission);
  }

  onSelectPath(path: string) {
    this.addGroupPermissionForm.controls['pathToAdd'].setValue(path);
  }

  getPermissionName(permission: Permission): string {
    return Permission[permission];
  }

  isFormEmpty(): boolean {
    const formValue = this.addGroupPermissionForm.value;
    return !formValue.groupToAdd ||
      !formValue.permissionToAdd ||
      !formValue.pathToAdd
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
