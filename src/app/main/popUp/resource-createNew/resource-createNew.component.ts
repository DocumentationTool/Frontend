import {Component, HostListener, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ResourceService} from '../../service/resource.service';
import {NavigationService} from '../../service/navigation.service';
import { MatDialogRef } from '@angular/material/dialog';
import {ApiRepo} from '../../../api/apiRepo';
import {AuthService} from '../../service/authService';
import {ToastrService} from 'ngx-toastr';
import {ApiResource} from '../../../api/apiResource';


@Component({
  selector: 'app-resource-upload',
  imports: [
    FormsModule,
  ],
  templateUrl: './resource-createNew.component.html',
  styleUrl: './resource-createNew.component.css'
})
export class ResourceCreateNewComponent implements OnInit{
  constructor(private dialogRef: MatDialogRef<ResourceCreateNewComponent>,
              public resourceService: ResourceService,
              private authService: AuthService,
              private apiResource: ApiResource,
              private apiRepo: ApiRepo) {}

  repoId: string = "";
  path: string = "";
  category: string = "";
  tagsToAdd: string = "";
  allRepos: string[] = [];
  allTags: string[] = [];
  customTags: string = ""

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
    this.resourceService.addResource(this.repoId,this.path + ".md",this.authService.username(),this.category,this.splitTags(this.tagsToAdd),"# New Resource")
    this.closeDialog();
  }

  onRepos() {
    this.isReposActive = true;
  }

  onSelectRepo(repo:string){
    this.repoId = repo
    this.getTag(repo)
  }

  onSelectTag(tagId: string) {
    this.tagsToAdd = tagId;
  }

  splitTags(tags: string) {
    if (tags.includes(";")){
      return tags.split(";").map(tag => tag.trim()).filter(tag => tag.length > 0);
    }
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
