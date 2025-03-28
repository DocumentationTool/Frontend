import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ResourceService} from '../../service/resource.service';
import {NavigationService} from '../../service/navigation.service';
import {ApiRepo} from '../../../api/apiRepo';
import {AuthService} from '../../service/authService';
import {Resources} from '../../../Model/apiResponseFileTree';
import {ApiResource} from '../../../api/apiResource';

@Component({
  selector: 'app-resource-move',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './resource-move.component.html',
  styleUrl: './resource-move.component.css'
})
export class ResourceMoveComponent implements OnInit {
  constructor(private dialogRef: MatDialogRef<ResourceMoveComponent>,
              protected resourceService: ResourceService,
              private authService: AuthService,
              private apiRepo: ApiRepo,
              private apiResource: ApiResource,
              @Inject(MAT_DIALOG_DATA) public dialogData: { repoId: string, path: string }) {
  }


  allRepos: string[] = [];
  allPaths: string[] = [];
  repoTo: string = "";
  pathTo: string = "";
  repoFrom: string = "";
  pathFrom: string = "";
  customPath: string = "";


  ngOnInit() {
    this.apiRepo.getRepos().subscribe(
      data => {
        if (data && data.content) {
          this.allRepos = data.content.map(repo => repo.id);
        }
      }
    )

    this.repoFrom = this.dialogData.repoId;
    this.pathFrom = this.dialogData.path;
  }

  moveResource() {
    this.resourceService.moveResource(this.authService.username(), this.dialogData.repoId, this.dialogData.path, this.repoTo, this.pathTo)
    this.closeDialog();
  }

  onSelectRepo(repoId: string) {
    this.repoTo = repoId;
    this.getAllResource(repoId);
  }

  onSelectPath(path: string) {
    this.pathTo = path;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  getAllResource(repoId: string) {
    this.apiResource.getResource(null, null, repoId, null, [], [], false, 10000).subscribe(
      data => {
        if (data && data.content) {
          this.allPaths = Object.values(data.content).flat()
            .map((resource: Resources) => resource.path);
        } else {
          this.allPaths = [];
        }
      });
  }

}
