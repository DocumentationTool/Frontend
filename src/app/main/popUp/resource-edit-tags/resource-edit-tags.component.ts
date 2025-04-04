import {Component, ElementRef, HostListener, Inject, OnInit, ViewChild} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ResourceService} from '../../service/resource.service';
import {NavigationService} from '../../service/navigation.service';
import {ApiRepo} from '../../../api/apiRepo';
import {Resources} from '../../../Model/apiResponseFileTree';
import {AuthService} from '../../service/authService';

@Component({
  selector: 'app-resource-edit-tags',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './resource-edit-tags.component.html',
  styleUrl: './resource-edit-tags.component.css'
})
export class ResourceEditTagsComponent implements OnInit {
  constructor(private dialogRef: MatDialogRef<ResourceEditTagsComponent>,
              public resourceService: ResourceService,
              private authService: AuthService,
              @Inject(MAT_DIALOG_DATA) public dialogData: { repoId: string, path: string }) {
  }

  tagsToAdd: string = "";
  tagIdsToRemove: string = "";
  customTags = ""
  customTagsToRemove = ""

  ngOnInit() {
    this.resourceService.getTag(this.dialogData.repoId);
    this.resourceService.getResourceTags(null, this.dialogData.path, this.dialogData.repoId, this.authService.username(), [], [])
  }

  onEditTags() {
    this.resourceService.editResourceTags(this.dialogData.repoId, this.dialogData.path, this.splitTags(this.tagsToAdd), this.splitTags(this.tagIdsToRemove))
    this.closeDialog();
  }

  selectAddTag(tagId: string) {
    this.tagsToAdd = tagId;
  }

  selectRemoveTag(tagId: string) {
    this.tagIdsToRemove = tagId;
  }

  splitTags(tags: string) {
    if (tags.includes(";")) {
      return tags.split(";").map(tag => tag.trim()).filter(tag => tag.length > 0);
    }
    if (tags)
      return [tags];
    return []
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
