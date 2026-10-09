import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { email, form, FormField, FormRoot, minLength, required } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideKeyRound } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';

@Component({
	selector: 'spartan-two-column-login-form',
	imports: [FormRoot, FormField, RouterLink, HlmFieldImports, HlmInputImports, HlmButtonImports, NgIcon],
	providers: [provideIcons({ lucideKeyRound })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<form [formRoot]="form">
			<hlm-field-group>
				<div class="flex flex-col items-center gap-1 text-center">
					<h1 class="text-2xl font-bold">Inicia sesión en tu cuenta</h1>
					<p class="text-muted-foreground text-sm text-balance">Ingresa tu correo para acceder al portal</p>
				</div>
				<hlm-field>
					<label hlmFieldLabel for="email">Correo electrónico</label>
					<input hlmInput type="email" id="email" placeholder="nombre@empresa.com" [formField]="form.email" />
					@for (error of form.email().errors(); track error) {
						<hlm-field-error [validator]="error.kind">{{ error.message }}</hlm-field-error>
					}
				</hlm-field>
				<hlm-field>
					<div class="flex items-center">
						<label hlmFieldLabel for="password">Contraseña</label>
						<a hlmFieldDescription class="ml-auto text-sm underline-offset-4 hover:underline" routerLink=".">
							¿Olvidaste tu contraseña?
						</a>
					</div>
					<input hlmInput type="password" id="password" [formField]="form.password" />
					@for (error of form.password().errors(); track error) {
						<hlm-field-error [validator]="error.kind">{{ error.message }}</hlm-field-error>
					}
				</hlm-field>
				<hlm-field>
					<button hlmBtn type="submit" [disabled]="form().submitting()">Iniciar sesión</button>
				</hlm-field>
				<hlm-field-separator>O continúa con</hlm-field-separator>
				<hlm-field>
					<button hlmBtn variant="outline" type="button">
						<ng-icon name="lucideKeyRound" class="text-xl" />
						Ingresar con SSO corporativo
					</button>
					<p hlmFieldDescription class="text-center">
						¿Necesitas ayuda para acceder?
						<a routerLink=".">Contacta a Recursos Humanos</a>
					</p>
				</hlm-field>
			</hlm-field-group>
		</form>
	`,
})
export class LoginForm {
	protected readonly _model = signal({
		email: '',
		password: '',
	});

	public readonly form = form(
		this._model,
		(schemaPath) => {
			required(schemaPath.email, { message: 'El correo es obligatorio.' });
			email(schemaPath.email, { message: 'Ingresa un correo válido.' });
			required(schemaPath.password, { message: 'La contraseña es obligatoria.' });
			minLength(schemaPath.password, 8, { message: 'La contraseña debe tener al menos 8 caracteres.' });
		},
		{
			submission: {
				action: async () => {
					const model = this._model();
					console.log(model);
				},
			},
		},
	);
}
