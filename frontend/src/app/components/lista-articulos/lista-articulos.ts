import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { Articulo } from '../../models/articulo.model';
import { ArticuloService } from '../../services/articulo.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-lista-articulos',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './lista-articulos.html',
  styleUrl: './lista-articulos.css'
})
export class ListaArticulos implements OnInit {
  articulos = signal<Articulo[]>([]);
  cargando = signal(true);
  mensaje = signal('');
  error = signal('');

  constructor(private articuloService: ArticuloService, public auth: AuthService) {}

  ngOnInit(): void {
    this.cargarArticulos();
  }

  cargarArticulos(): void {
    this.cargando.set(true);
    this.articuloService.obtenerTodos().subscribe({
      next: (datos) => {
        this.articulos.set(datos);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo conectar con el servidor. Verifica que el backend esté corriendo.');
        this.cargando.set(false);
      }
    });
  }

  eliminar(articulo: Articulo): void {
    const confirmado = confirm(`¿Seguro que deseas eliminar "${articulo.nombre}"?`);
    if (!confirmado || !articulo._id) {
      return;
    }

    this.articuloService.eliminar(articulo._id).subscribe({
      next: () => {
        this.mostrarMensaje(`Artículo "${articulo.nombre}" eliminado correctamente.`);
        this.cargarArticulos();
      },
      error: (err) => {
        this.error.set(err?.error?.mensaje ?? 'No se pudo eliminar el artículo.');
      }
    });
  }

  private mostrarMensaje(texto: string): void {
    this.error.set('');
    this.mensaje.set(texto);
    setTimeout(() => this.mensaje.set(''), 3000);
  }
}