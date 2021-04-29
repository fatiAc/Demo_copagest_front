import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArretMachineComponent } from './arret-machine.component';

describe('ArretMachineComponent', () => {
  let component: ArretMachineComponent;
  let fixture: ComponentFixture<ArretMachineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArretMachineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArretMachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
