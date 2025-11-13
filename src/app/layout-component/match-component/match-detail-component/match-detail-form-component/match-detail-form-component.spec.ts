import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchInfoDetailFormComponent } from './match-detail-form-component';

describe('MatchInfoDetailFormComponent', () => {
  let component: MatchInfoDetailFormComponent;
  let fixture: ComponentFixture<MatchInfoDetailFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchInfoDetailFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchInfoDetailFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
