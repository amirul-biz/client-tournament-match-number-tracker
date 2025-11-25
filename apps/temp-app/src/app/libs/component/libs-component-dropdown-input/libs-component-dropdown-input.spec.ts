import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibsComponentDropdownInput } from './libs-component-dropdown-input';

describe('LibsComponentDropdownInput', () => {
  let component: LibsComponentDropdownInput;
  let fixture: ComponentFixture<LibsComponentDropdownInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibsComponentDropdownInput],
    }).compileComponents();

    fixture = TestBed.createComponent(LibsComponentDropdownInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
