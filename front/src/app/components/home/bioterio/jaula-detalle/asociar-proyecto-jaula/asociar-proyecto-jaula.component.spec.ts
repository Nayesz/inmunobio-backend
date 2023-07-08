import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AsociarProyectoJaulaComponent } from './asociar-proyecto-jaula.component';

describe('AsociarProyectoJaulaComponent', () => {
  let component: AsociarProyectoJaulaComponent;
  let fixture: ComponentFixture<AsociarProyectoJaulaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AsociarProyectoJaulaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsociarProyectoJaulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
