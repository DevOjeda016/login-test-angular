import { ChangeDetectionStrategy, Component, computed, input, isDevMode, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideHandCoins } from '@ng-icons/lucide';
import { HeroBento } from './heroes/hero-bento';
import { HeroEditorial } from './heroes/hero-editorial';
import { HeroFoto } from './heroes/hero-foto';
import { type Fondo, HeroIlustrado } from './heroes/hero-ilustrado';
import { HeroOrbita } from './heroes/hero-orbita';
import { HeroProducto } from './heroes/hero-producto';
import { matchMediaSignal } from './heroes/hero-shared';
import { HeroTarjetas } from './heroes/hero-tarjetas';
import { LoginForm } from './login-form';

/** Variantes del panel visual (solo la parte de la imagen). El layout del bloque es el de Spartan. */
const VARIANTS = ['foto', 'producto', 'ilustrado', 'tarjetas', 'orbita', 'bento', 'editorial'] as const;
type HeroVariant = (typeof VARIANTS)[number];
const FONDOS: readonly Fondo[] = ['sobrio', 'aurora', 'claro'];

@Component({
	selector: 'spartan-login-two-column',
	imports: [
		RouterLink,
		LoginForm,
		NgIcon,
		HeroFoto,
		HeroProducto,
		HeroIlustrado,
		HeroTarjetas,
		HeroOrbita,
		HeroBento,
		HeroEditorial,
	],
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
			<div class="bg-muted relative hidden lg:block">
				@if (desktop()) {
					@switch (variant()) {
						@case ('foto') {
							<app-hero-foto />
						}
						@case ('producto') {
							<app-hero-producto />
						}
						@case ('ilustrado') {
							<app-hero-ilustrado [fondo]="fondo()" />
						}
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
			<nav
				class="fixed right-4 bottom-4 z-50 hidden max-w-[calc(100vw-2rem)] flex-wrap justify-end gap-1 rounded-3xl bg-black/80 p-1 text-xs text-white shadow-lg backdrop-blur lg:flex"
				aria-label="Variantes del panel visual (solo desarrollo)"
			>
				@if (variant() === 'ilustrado') {
					@for (f of fondos; track f) {
						<a
							routerLink="."
							[queryParams]="{ hero: 'ilustrado', fondo: f }"
							class="rounded-full px-3 py-1.5 text-violet-200 capitalize hover:bg-white/15"
							[class.bg-violet-500]="fondo() === f"
							[class.text-white]="fondo() === f"
						>{{ f }}</a>
					}
					<span class="mx-1 w-px self-stretch bg-white/20"></span>
				}
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
	public readonly hero = input<string>('foto');
	/** Fondo de la variante ilustrado, vía ?fondo=. */
	public readonly fondoParam = input<string>('sobrio', { alias: 'fondo' });
	protected readonly fondos = FONDOS;
	protected readonly fondo = computed<Fondo>(() => FONDOS.find((f) => f === this.fondoParam()) ?? 'sobrio');
	protected readonly variants = VARIANTS;
	protected readonly variant = computed<HeroVariant>(() => VARIANTS.find((v) => v === this.hero()) ?? 'foto');
	protected readonly desktop = matchMediaSignal('(min-width: 1024px)');
	protected readonly devMode = isDevMode();
}
