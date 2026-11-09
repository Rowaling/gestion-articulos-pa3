import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { ErrorApi } from '../../models/usuario.model';

// Validador personalizado: las dos contraseñas deben coincidir
function contrasenasIguales(grupo: AbstractControl): ValidationErrors | null {
  const password = grupo.get('password')?.value;
  const confirmar = grupo.get('confirmar')?.value;
  return password === confirmar ? null : { noCoinciden: true };
}

@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: '../auth.css'
})
export class Registro {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private auth = inject(AuthService);

  enviando = signal(false);
  errores = signal<string[]>([]);

  form = this.fb.group(
    {
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmar: ['', [Validators.required]]
    },
    { validators: contrasenasIguales }
  );

  invalido(campo: string): boolean {
    const control = this.form.get(campo);
    return !!control && control.invalid && control.touched;
  }

  get noCoinciden(): boolean {
    return !!this.form.errors?.['noCoinciden'] && !!this.form.get('confirmar')?.touched;
  }

  enviar(): void {
    this.errores.set([]);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { nombre, email, password } = this.form.getRawValue();
    this.enviando.set(true);
    this.auth
      .registrar({ nombre: (nombre ?? '').trim(), email: (email ?? '').trim(), password: password ?? '' })
      .subscribe({
        next: () => {
          this.enviando.set(false);
          this.router.navigate(['/dashboard']);
        },
        error: (err: HttpErrorResponse) => {
          this.enviando.set(false);
          const cuerpo = err.error as ErrorApi | null;
          this.errores.set(
            cuerpo?.errores?.length
              ? cuerpo.errores
              : [cuerpo?.mensaje ?? 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.']
          );
        }
      });
  }
}
