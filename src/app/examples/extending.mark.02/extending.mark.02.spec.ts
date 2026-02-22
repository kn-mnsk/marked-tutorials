import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendingMark02 } from './extending.mark.02';

describe('ExtendingMark02', () => {
  let component: ExtendingMark02;
  let fixture: ComponentFixture<ExtendingMark02>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExtendingMark02]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtendingMark02);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
