import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { ErrorApi } from '../../models/usuario.model';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: '../auth.css'
})
export class Login {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  auth = inject(AuthService);

  enviando = signal(false);
  error = signal('');

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  invalido(campo: string): boolean {
    const control = this.form.get(campo);
    return !!control && control.invalid && control.touched;
  }

  enviar(): void {
    this.error.set('');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.getRawValue();
    this.enviando.set(true);
    this.auth.login({ email: (email ?? '').trim(), password: password ?? '' }).subscribe({
      next: () => {
        this.enviando.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err: HttpErrorResponse) => {
        this.enviando.set(false);
        const cuerpo = err.error as ErrorApi | null;
        this.error.set(
          cuerpo?.mensaje ?? 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.'
        );
      }
    });
  }
}
