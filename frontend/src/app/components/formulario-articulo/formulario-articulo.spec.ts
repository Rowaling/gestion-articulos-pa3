import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormularioArticulo } from './formulario-articulo';

describe('FormularioArticulo', () => {
  let component: FormularioArticulo;
  let fixture: ComponentFixture<FormularioArticulo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioArticulo],
    }).compileComponents();

    fixture = TestBed.createComponent(FormularioArticulo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
