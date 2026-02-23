import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Example03 } from './example03';

describe('Example03', () => {
  let component: Example03;
  let fixture: ComponentFixture<Example03>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Example03]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Example03);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
