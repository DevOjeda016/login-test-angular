import { ChangeDetectionStrategy, Component, computed, input, isDevMode, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideHandCoins } from '@ng-icons/lucide';
import { HeroBento } from './heroes/hero-bento';
import { HeroEditorial } from './heroes/hero-editorial';
import { HeroOrbita } from './heroes/hero-orbita';
import { matchMediaSignal } from './heroes/hero-shared';
import { HeroTarjetas } from './heroes/hero-tarjetas';
import { LoginForm } from './login-form';

const VARIANTS = ['tarjetas', 'orbita', 'bento', 'editorial'] as const;
type HeroVariant = (typeof VARIANTS)[number];

@Component({
	selector: 'spartan-login-two-column',
	imports: [RouterLink, LoginForm, NgIcon, HeroTarjetas, HeroOrbita, HeroBento, HeroEditorial],
	providers: [provideIcons({ lucideHandCoins })],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'block',
	},
	template: `
		<div class="grid min-h-svh lg:grid-cols-2">
			<div class="flex flex-col gap-4 p-6 md:p-10">
				<div class="flex justify-center gap-2 md:justify-start">
					<a routerLink="." class="flex items-center gap-2 font-medium">
						<div class="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
							<ng-icon name="lucideHandCoins" class="text-base" />
						</div>
						Portal del Colaborador
					</a>
				</div>
				<div class="flex flex-1 items-center justify-center">
					<div class="w-full max-w-xs">
						<spartan-two-column-login-form />
					</div>
				</div>
			</div>
			<div class="relative hidden bg-violet-950 lg:block">
				@if (desktop()) {
					@switch (variant()) {
						@case ('orbita') {
							<app-hero-orbita />
						}
						@case ('bento') {
							<app-hero-bento />
						}
						@case ('editorial') {
							<app-hero-editorial />
						}
						@default {
							<app-hero-tarjetas />
						}
					}
				}
			</div>
		</div>
		@if (devMode) {
			<nav class="fixed right-4 bottom-4 z-50 hidden gap-1 rounded-full bg-black/75 p-1 text-xs text-white shadow-lg backdrop-blur lg:flex" aria-label="Variantes del hero (solo desarrollo)">
				@for (v of variants; track v) {
					<a
						routerLink="."
						[queryParams]="{ hero: v }"
						class="rounded-full px-3 py-1.5 capitalize hover:bg-white/15"
						[class.bg-white]="variant() === v"
						[class.text-black]="variant() === v"
					>{{ v }}</a>
				}
			</nav>
		}
	`,
})
export default class LoginTwoColumnPage {
	/** Variante del panel visual, vía ?hero=. Sirve para comparar propuestas de diseño. */
	public readonly hero = input<string>('tarjetas');
	protected readonly variants = VARIANTS;
	protected readonly variant = computed<HeroVariant>(() => VARIANTS.find((v) => v === this.hero()) ?? 'tarjetas');
	protected readonly desktop = matchMediaSignal('(min-width: 1024px)');
	protected readonly devMode = isDevMode();
}
