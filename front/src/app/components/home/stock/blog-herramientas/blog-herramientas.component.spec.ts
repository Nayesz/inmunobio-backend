import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BlogHerramientasComponent } from './blog-herramientas.component';

describe('BlogHerramientasComponent', () => {
  let component: BlogHerramientasComponent;
  let fixture: ComponentFixture<BlogHerramientasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BlogHerramientasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogHerramientasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
