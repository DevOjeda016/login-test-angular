import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import type { AnimationItem } from 'lottie-web';
import { type AnimationOptions, LottieComponent } from 'ngx-lottie';

interface HeroModule {
  label: string;
  file: string;
  /** Token CSS definido en styles.css. */
  color: string;
  /** Fotograma a mostrar cuando el usuario prefiere menos movimiento. */
  still: number;
  left: string;
  top: string;
  /** Desfase de la animación de flotación y de la entrada (s). */
  delay: number;
}

const MODULES: readonly HeroModule[] = [
  { label: 'Préstamos', file: 'prestamos', color: '--module-prestamos', still: 36, left: '8%', top: '4%', delay: 0 },
  { label: 'Anticipo de nómina', file: 'nomina', color: '--module-nomina', still: 0, left: '48%', top: '14%', delay: 0.6 },
  { label: 'Prima vacacional', file: 'prima', color: '--module-prima', still: 0, left: '12%', top: '27%', delay: 1.2 },
  { label: 'Fondo de ahorro', file: 'ahorro', color: '--module-ahorro', still: 8, left: '50%', top: '38%', delay: 1.8 },
  { label: 'Horas extraordinarias', file: 'horas', color: '--module-horas', still: 0, left: '6%', top: '50%', delay: 2.4 },
  { label: 'Convenios', file: 'convenios', color: '--module-convenios', still: 60, left: '46%', top: '62%', delay: 3 },
  { label: 'Beneficios', file: 'beneficios', color: '--module-beneficios', still: 0, left: '14%', top: '74%', delay: 3.6 },
];

const DESKTOP_QUERY = '(min-width: 1024px)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Panel visual del login: foto + degradado de marca + tarjetas por módulo con íconos Lottie.
 * Solo se monta en escritorio (lg+) para no descargar imagen ni animaciones en móvil.
 *
 * Foto: Vitaly Gariev en Unsplash (Unsplash License). Íconos: scripts/generate-lottie.mjs.
 */
@Component({
  selector: 'app-login-hero',
  imports: [NgOptimizedImage, LottieComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'absolute inset-0 block overflow-hidden' },
  styles: `
    @keyframes hero-float {
      0%,
      100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-8px);
      }
    }
    .hero-float {
      animation: hero-float 6s ease-in-out infinite;
    }
    @media (prefers-reduced-motion: reduce) {
      .hero-float {
        animation: none;
      }
    }
  `,
  template: `
    @if (desktop()) {
      <img ngSrc="images/login-hero.jpg" alt="" fill priority class="object-cover object-[72%_center]" />
      <div class="absolute inset-0 bg-linear-to-br from-violet-950/75 via-violet-800/50 to-fuchsia-700/30"></div>
      <div class="absolute inset-0 bg-linear-to-t from-violet-950/90 via-violet-950/20 to-transparent"></div>

      <ng-lottie
        class="pointer-events-none absolute inset-0 block"
        width="100%"
        height="100%"
        [options]="sparkleOptions"
        aria-hidden="true"
      />

      <div class="relative flex h-full flex-col p-10 xl:p-14">
        <div class="relative flex-1" aria-hidden="true">
          @for (m of modules; track m.file) {
            <div
              class="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 absolute fill-mode-backwards duration-700"
              [style.left]="m.left"
              [style.top]="m.top"
              [style.animation-delay.s]="m.delay / 4"
            >
              <div
                class="hero-float flex items-center gap-3 rounded-2xl border border-white/25 bg-white/10 py-2.5 pr-5 pl-2.5 text-white shadow-xl shadow-violet-950/30 backdrop-blur-md"
                [style.animation-delay.s]="m.delay"
              >
                <span
                  class="flex size-12 shrink-0 items-center justify-center rounded-xl shadow-inner"
                  [style.background]="'var(' + m.color + ')'"
                >
                  <ng-lottie
                    width="36px"
                    height="36px"
                    [options]="optionsFor(m)"
                    (animationCreated)="onCreated($event, m)"
                  />
                </span>
                <span class="text-sm font-medium whitespace-nowrap">{{ m.label }}</span>
              </div>
            </div>
          }
        </div>

        <div class="max-w-md text-white">
          <h2 class="text-3xl font-semibold text-balance xl:text-4xl">Tus trámites, en un solo lugar</h2>
          <p class="mt-3 text-base text-violet-100/90 text-balance">
            Solicita préstamos y anticipos, registra horas extraordinarias y consulta tus convenios y beneficios.
          </p>
        </div>
      </div>
    }
  `,
})
export class LoginHero {
  protected readonly modules = MODULES;

  private readonly reducedMotion = typeof matchMedia === 'function' && matchMedia(REDUCED_MOTION_QUERY).matches;
  protected readonly desktop = signal(typeof matchMedia === 'function' && matchMedia(DESKTOP_QUERY).matches);

  protected readonly sparkleOptions: AnimationOptions = {
    path: 'lottie/destellos.json',
    loop: !this.reducedMotion,
    autoplay: !this.reducedMotion,
    rendererSettings: { preserveAspectRatio: 'xMidYMid slice' },
  };

  private readonly options = new Map(
    MODULES.map((m) => [
      m.file,
      {
        path: `lottie/${m.file}.json`,
        loop: !this.reducedMotion,
        autoplay: !this.reducedMotion,
      } satisfies AnimationOptions,
    ]),
  );

  constructor() {
    if (typeof matchMedia !== 'function') return;
    const query = matchMedia(DESKTOP_QUERY);
    const onChange = (e: MediaQueryListEvent) => this.desktop.set(e.matches);
    query.addEventListener('change', onChange);
    inject(DestroyRef).onDestroy(() => query.removeEventListener('change', onChange));
  }

  protected optionsFor(m: HeroModule): AnimationOptions {
    return this.options.get(m.file)!;
  }

  /** Con movimiento reducido, congela cada ícono en un fotograma representativo. */
  protected onCreated(animation: AnimationItem, m: HeroModule): void {
    if (!this.reducedMotion) return;
    animation.addEventListener('DOMLoaded', () => animation.goToAndStop(m.still, true));
  }
}
