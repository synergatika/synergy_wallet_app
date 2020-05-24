import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubEmailFormComponent } from './sub-email-form.component';

describe('SubEmailFormComponent', () => {
  let component: SubEmailFormComponent;
  let fixture: ComponentFixture<SubEmailFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SubEmailFormComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubEmailFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
