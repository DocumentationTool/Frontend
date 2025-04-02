import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ResourceService} from '../../service/resource.service';
import {ApiRepo} from '../../../api/apiRepo';
import {ApiResource} from '../../../api/apiResource';
import {AuthService} from '../../service/authService';

@Component({
  selector: 'app-resource-upload',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './resource-upload.component.html',
  styleUrl: './resource-upload.component.css'
})
export class ResourceUploadComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<ResourceUploadComponent>,
              public resourceService: ResourceService,
              private apiRepo: ApiRepo,
              private apiResource: ApiResource,
              private authService: AuthService,
              @Inject(MAT_DIALOG_DATA) public dialogData: { data: any; path: string }) {
  }

  repoId: string = "";
  category: string = "";
  tagsToAdd: string = "";
  allRepos: string[] = [];
  allTags: string[] = [];
  customTags = ""

  isReposActive = false;

  ngOnInit() {
    this.apiRepo.getRepos().subscribe(
      data => {
        if (data && data.content) {
          this.allRepos = data.content.map(repo => repo.id);
        }
      }
    )
  }

  uploadResource() {
    this.resourceService.addResource(this.repoId, this.dialogData.path, this.authService.username(), this.category, this.splitTags(this.tagsToAdd), this.dialogData.data)
    this.closeDialog();
  }

  onSelectRepo(repo: string) {
    this.repoId = repo
    this.getTag(repo);
  }

  onSelectTag(tagId: string) {
    this.tagsToAdd = tagId;
  }

  splitTags(tags: string) {
    if (tags.includes(";")){
      return tags.split(";").map(tag => tag.trim()).filter(tag => tag.length > 0);
    }
    if (tags == "")
      return []
    return [tags];
  }

  getTag(repoId: string) {
    this.apiResource.getTag(repoId).subscribe(
      data => {
        this.allTags = [];
        if (data.content) {
          this.allTags = Object.entries(data.content).map(([id]) => id);
        }
      },
      error => {
        console.error(error.error.error)
      }
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
