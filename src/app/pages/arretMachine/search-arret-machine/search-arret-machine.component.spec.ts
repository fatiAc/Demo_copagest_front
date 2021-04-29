import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchArretMachineComponent } from './search-arret-machine.component';

describe('SearchArretMachineComponent', () => {
  let component: SearchArretMachineComponent;
  let fixture: ComponentFixture<SearchArretMachineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchArretMachineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchArretMachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
