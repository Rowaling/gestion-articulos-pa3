import { Component, OnInit, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { Articulo } from '../../models/articulo.model';
import { ArticuloService } from '../../services/articulo.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  articulos = signal<Articulo[]>([]);
  error = signal('');

  total = computed(() => this.articulos().length);
  categorias = computed(() => new Set(this.articulos().map((a) => a.categoria)).size);
  precioPromedio = computed(() => {
    const lista = this.articulos();
    return lista.length ? lista.reduce((suma, a) => suma + a.precio, 0) / lista.length : 0;
  });
  recientes = computed(() => this.articulos().slice(0, 3));

  constructor(private articuloService: ArticuloService) {}

  ngOnInit(): void {
    this.articuloService.obtenerTodos().subscribe({
      next: (datos) => this.articulos.set(datos),
      error: () => this.error.set('No se pudo conectar con el servidor. Verifica que el backend esté corriendo.')
    });
  }
}