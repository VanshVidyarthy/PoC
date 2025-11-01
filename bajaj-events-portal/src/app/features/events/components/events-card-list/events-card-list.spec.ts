import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsCardList } from './events-card-list';

describe('EventsCardList', () => {
  let component: EventsCardList;
  let fixture: ComponentFixture<EventsCardList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsCardList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventsCardList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
