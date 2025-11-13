import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchInfoDetailComponent } from './match-detail-component';

describe('MatchInfoDetailComponent', () => {
  let component: MatchInfoDetailComponent;
  let fixture: ComponentFixture<MatchInfoDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchInfoDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchInfoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
