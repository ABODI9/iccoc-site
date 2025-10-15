import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Initiative } from './initiative';

describe('Initiative', () => {
  let component: Initiative;
  let fixture: ComponentFixture<Initiative>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Initiative]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Initiative);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
