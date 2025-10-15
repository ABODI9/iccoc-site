import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatWeDo } from './what-we-do';

describe('WhatWeDo', () => {
  let component: WhatWeDo;
  let fixture: ComponentFixture<WhatWeDo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhatWeDo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhatWeDo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
