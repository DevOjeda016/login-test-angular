import { ChangeDetectionStrategy, Component, computed, input, isDevMode, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideHandCoins } from '@ng-icons/lucide';
import { HeroBento } from './heroes/hero-bento';
import { HeroEditorial } from './heroes/hero-editorial';
import { HeroFoto } from './heroes/hero-foto';
import { HeroIlustrado } from './heroes/hero-ilustrado';
import { HeroOrbita } from './heroes/hero-orbita';
import { HeroProducto } from './heroes/hero-producto';
import { matchMediaSignal } from './heroes/hero-shared';
import { HeroTarjetas } from './heroes/hero-tarjetas';
import { LoginForm } from './login-form';

interface VariantConfig {
	/** Lado del panel visual en escritorio. */
	side: 'left' | 'right';
	/** Login dentro de una tarjeta redondeada sobre fondo suave (escritorio). */
	framed: boolean;
	/** Dónde va la marca: en el formulario (izq. o centro) o dentro del panel visual. */
	brand: 'form' | 'center' | 'hero';
	/** Botones e inputs en píldora. */
	pill: boolean;
}

const VARIANTS = {
	foto: { side: 'left', framed: true, brand: 'hero', pill: true },
	producto: { side: 'right', framed: true, brand: 'form', pill: false },
	ilustrado: { side: 'left', framed: true, brand: 'center', pill: false },
	tarjetas: { side: 'right', framed: false, brand: 'form', pill: false },
	orbita: { side: 'right', framed: false, brand: 'form', pill: false },
	bento: { side: 'right', framed: false, brand: 'form', pill: false },
	editorial: { side: 'right', framed: false, brand: 'form', pill: false },
} as const satisfies Record<string, VariantConfig>;

type HeroVariant = keyof typeof VARIANTS;
const VARIANT_NAMES = Object.keys(VARIANTS) as HeroVariant[];

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
		<div class="min-h-svh" [class]="config().framed ? 'lg:bg-slate-100 lg:p-8' : ''">
			<div
				class="grid min-h-svh bg-background lg:grid-cols-2"
				[class]="config().framed ? 'lg:min-h-[calc(100svh-4rem)] lg:overflow-hidden lg:rounded-3xl lg:shadow-xl lg:shadow-slate-300/60' : ''"
			>
				<div class="flex flex-col gap-4 p-6 md:p-10">
					<div
						class="flex gap-2"
						[class]="
							(config().brand === 'center' ? 'justify-center' : 'justify-center md:justify-start') +
							(config().brand === 'hero' ? ' lg:hidden' : '')
						"
					>
						<a routerLink="." class="flex items-center gap-2 font-medium">
							<div class="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
								<ng-icon name="lucideHandCoins" class="text-base" />
							</div>
							Portal del Colaborador
						</a>
					</div>
					<div class="flex flex-1 items-center justify-center">
						<div class="w-full max-w-xs">
							<spartan-two-column-login-form [pill]="config().pill" />
						</div>
					</div>
				</div>
				<div class="relative hidden lg:block" [class]="config().side === 'left' ? 'lg:order-first' : ''">
					@if (desktop()) {
						@switch (variant()) {
							@case ('foto') {
								<app-hero-foto />
							}
							@case ('producto') {
								<app-hero-producto />
							}
							@case ('ilustrado') {
								<app-hero-ilustrado />
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
		</div>
		@if (devMode) {
			<nav
				class="fixed right-4 bottom-4 z-50 hidden max-w-[calc(100vw-2rem)] flex-wrap justify-end gap-1 rounded-3xl bg-black/80 p-1 text-xs text-white shadow-lg backdrop-blur lg:flex"
				aria-label="Variantes del panel visual (solo desarrollo)"
			>
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
	protected readonly variants = VARIANT_NAMES;
	protected readonly variant = computed<HeroVariant>(() => VARIANT_NAMES.find((v) => v === this.hero()) ?? 'foto');
	protected readonly config = computed<VariantConfig>(() => VARIANTS[this.variant()]);
	protected readonly desktop = matchMediaSignal('(min-width: 1024px)');
	protected readonly devMode = isDevMode();
}
