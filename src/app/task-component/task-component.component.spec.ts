import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskComponentComponent } from './task-component.component';

describe('TaskComponentComponent', () => {
  let component: TaskComponentComponent;
  let fixture: ComponentFixture<TaskComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
