import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectComponentComponent } from './project-component.component';

describe('ProjectComponentComponent', () => {
  let component: ProjectComponentComponent;
  let fixture: ComponentFixture<ProjectComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
