import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HerramientasComponent } from './herramientas.component';

describe('HerramientasComponent', () => {
  let component: HerramientasComponent;
  let fixture: ComponentFixture<HerramientasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HerramientasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HerramientasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
