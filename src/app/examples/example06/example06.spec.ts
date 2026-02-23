import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Example06 } from './example06';

describe('Example06', () => {
  let component: Example06;
  let fixture: ComponentFixture<Example06>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Example06]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Example06);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
