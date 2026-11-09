import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaArticulos } from './lista-articulos';

describe('ListaArticulos', () => {
  let component: ListaArticulos;
  let fixture: ComponentFixture<ListaArticulos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaArticulos],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaArticulos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
