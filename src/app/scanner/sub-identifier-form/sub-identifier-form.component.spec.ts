import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubIdentifierFormComponent } from './sub-identifier-form.component';

describe('SubIdentifierFormComponent', () => {
  let component: SubIdentifierFormComponent;
  let fixture: ComponentFixture<SubIdentifierFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubIdentifierFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubIdentifierFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
