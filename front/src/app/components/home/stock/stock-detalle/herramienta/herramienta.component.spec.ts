import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HerramientaComponent } from './herramienta.component';

describe('HerramientaComponent', () => {
  let component: HerramientaComponent;
  let fixture: ComponentFixture<HerramientaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HerramientaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HerramientaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
