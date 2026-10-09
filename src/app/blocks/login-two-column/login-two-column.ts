import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideHandCoins } from '@ng-icons/lucide';
import { ThemeToggle } from '../../theme-toggle';
import { HeroIlustrado } from './heroes/hero-ilustrado';
import { matchMediaSignal } from './heroes/hero-shared';
import { LoginForm } from './login-form';

@Component({
	selector: 'spartan-login-two-column',
	imports: [RouterLink, LoginForm, NgIcon, HeroIlustrado, ThemeToggle],
	providers: [provideIcons({ lucideHandCoins })],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'block',
	},
	template: `
		<div class="grid min-h-svh lg:grid-cols-2">
			<div class="flex flex-col gap-4 p-6 md:p-10">
				<div class="relative flex justify-center gap-2 md:justify-start">
					<a routerLink="." class="flex items-center gap-2 font-medium">
						<div class="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
							<ng-icon name="lucideHandCoins" class="text-base" />
						</div>
						Portal del Colaborador
					</a>
					<app-theme-toggle class="absolute -top-1.5 right-0" />
				</div>
				<div class="flex flex-1 items-center justify-center">
					<div class="w-full max-w-xs">
						<spartan-two-column-login-form />
					</div>
				</div>
			</div>
			<div class="bg-muted relative hidden lg:block">
				@if (desktop()) {
					<app-hero-ilustrado />
				}
			</div>
		</div>
	`,
})
export default class LoginTwoColumnPage {
	/** El panel visual solo se monta en escritorio: en móvil no se descargan las animaciones. */
	protected readonly desktop = matchMediaSignal('(min-width: 1024px)');
}
