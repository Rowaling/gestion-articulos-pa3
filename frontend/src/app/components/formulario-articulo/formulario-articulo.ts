import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Articulo } from '../../models/articulo.model';
import { ArticuloService } from '../../services/articulo.service';

@Component({
  selector: 'app-formulario-articulo',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './formulario-articulo.html',
  styleUrl: './formulario-articulo.css'
})
export class FormularioArticulo implements OnInit {
  private fb = inject(FormBuilder);
  private articuloService = inject(ArticuloService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  categorias: string[] = ['Electrónica', 'Oficina', 'Hogar', 'Deportes', 'Otros'];
  idArticulo: string | null = null;

  cargando = signal(false);
  guardando = signal(false);
  mensaje = signal('');
  errores = signal<string[]>([]);

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    categoria: ['', [Validators.required]],
    precio: [null as number | null, [Validators.required, Validators.min(0.01)]],
    descripcion: ['', [Validators.required, Validators.maxLength(300)]]
  });

  ngOnInit(): void {
    this.idArticulo = this.route.snapshot.paramMap.get('id');
    if (this.idArticulo) {
      this.cargarArticulo(this.idArticulo);
    }
  }

  get esEdicion(): boolean {
    return this.idArticulo !== null;
  }

  private cargarArticulo(id: string): void {
    this.cargando.set(true);
    this.articuloService.obtenerPorId(id).subscribe({
      next: (articulo) => {
        this.form.patchValue({
          nombre: articulo.nombre,
          categoria: articulo.categoria,
          precio: articulo.precio,
          descripcion: articulo.descripcion
        });
        this.cargando.set(false);
      },
      error: () => {
        this.errores.set(['No se pudo cargar el artículo. Verifica que el backend esté corriendo.']);
        this.cargando.set(false);
      }
    });
  }

  invalido(campo: string): boolean {
    const control = this.form.get(campo);
    return !!control && control.invalid && control.touched;
  }

  guardar(): void {
    this.errores.set([]);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const valores = this.form.getRawValue();
    const articulo: Articulo = {
      nombre: (valores.nombre ?? '').trim(),
      categoria: valores.categoria ?? '',
      precio: Number(valores.precio),
      descripcion: (valores.descripcion ?? '').trim()
    };

    this.guardando.set(true);

    const peticion = this.idArticulo
      ? this.articuloService.actualizar(this.idArticulo, articulo)
      : this.articuloService.crear(articulo);

    peticion.subscribe({
      next: () => {
        this.mensaje.set(
          this.esEdicion
            ? 'Artículo actualizado correctamente.'
            : 'Artículo registrado correctamente.'
        );
        this.guardando.set(false);
        setTimeout(() => this.router.navigate(['/articulos']), 1200);
      },
      error: (err) => {
        this.guardando.set(false);
        const lista = err?.error?.errores;
        this.errores.set(
          Array.isArray(lista)
            ? lista
            : [err?.error?.mensaje ?? 'No se pudo guardar el artículo. Verifica que el backend esté corriendo.']
        );
      }
    });
  }
}