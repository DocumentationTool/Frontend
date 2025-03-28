import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeChildComponent } from './tree-child.component';
import {HttpClientModule} from '@angular/common/http';
import {ToastrModule, ToastrService} from 'ngx-toastr';

describe('TreeChildComponent', () => {
  let component: TreeChildComponent;
  let fixture: ComponentFixture<TreeChildComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreeChildComponent, HttpClientModule, ToastrModule.forRoot()
      ],
      providers: [
        ToastrService
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TreeChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
