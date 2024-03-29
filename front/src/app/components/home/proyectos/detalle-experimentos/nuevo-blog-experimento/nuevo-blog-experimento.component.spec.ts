import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NuevoBlogExperimentoComponent } from './nuevo-blog-experimento.component';

describe('NuevoBlogExperimentoComponent', () => {
  let component: NuevoBlogExperimentoComponent;
  let fixture: ComponentFixture<NuevoBlogExperimentoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NuevoBlogExperimentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevoBlogExperimentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
