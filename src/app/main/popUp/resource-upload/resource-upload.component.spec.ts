import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceUploadComponent } from './resource-upload.component'; // Importiere Standalone-Komponente
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of } from 'rxjs';
import { ResourceService } from '../../service/resource.service';
import { ApiRepo } from '../../../api/apiRepo';

describe('ResourceUploadComponent', () => {
  let component: ResourceUploadComponent;
  let fixture: ComponentFixture<ResourceUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceUploadComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: { close: jasmine.createSpy('close') }
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { data: 'some data', path: '/path' }
        },
        {
          provide: ResourceService,
          useValue: { addResource: jasmine.createSpy('addResource') }
        },
        {
          provide: ApiRepo,
          useValue: { getRepos: jasmine.createSpy('getRepos').and.returnValue(of({ content: [{ id: 'repo1' }, { id: 'repo2' }] })) }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call getRepos on ngOnInit', () => {
    component.ngOnInit();
    expect(component.allRepos.length).toBe(2);
    expect(component.allRepos).toEqual(['repo1', 'repo2']);
  });

  it('should call uploadResource', () => {
    component.uploadResource();
    expect(component.resourceService.addResource).toHaveBeenCalled();
  });

  it('should close the dialog', () => {
    component.closeDialog();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });
});
