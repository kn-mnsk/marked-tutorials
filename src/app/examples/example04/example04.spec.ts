import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Example04 } from './example04';

describe('Example04', () => {
  let component: Example04;
  let fixture: ComponentFixture<Example04>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Example04]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Example04);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
