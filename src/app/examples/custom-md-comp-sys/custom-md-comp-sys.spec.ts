import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomMdCompSys } from './custom-md-comp-sys';

describe('CustomMdCompSys', () => {
  let component: CustomMdCompSys;
  let fixture: ComponentFixture<CustomMdCompSys>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomMdCompSys]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomMdCompSys);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
