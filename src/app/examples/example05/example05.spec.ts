import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Example05 } from './example05';

describe('Example05', () => {
  let component: Example05;
  let fixture: ComponentFixture<Example05>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Example05]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Example05);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
