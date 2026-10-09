import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { type AnimationOptions, LottieComponent } from 'ngx-lottie';
import { freezeIfReduced, HERO_MODULES, lottieOptions, prefersReducedMotion } from './hero-shared';

/** Posición y desfase de cada tarjeta (por archivo de módulo). */
const LAYOUT: Record<string, { left: string; top: string; delay: number }> = {
  prestamos: { left: '8%', top: '4%', delay: 0 },
  nomina: { left: '48%', top: '14%', delay: 0.6 },
  prima: { left: '12%', top: '27%', delay: 1.2 },
  ahorro: { left: '50%', top: '38%', delay: 1.8 },
  horas: { left: '6%', top: '50%', delay: 2.4 },
  convenios: { left: '46%', top: '62%', delay: 3 },
  beneficios: { left: '14%', top: '74%', delay: 3.6 },
};

/**
 * Variante "tarjetas" (v1): foto + degradado de marca + tarjetas de vidrio flotantes.
 * Foto: Vitaly Gariev en Unsplash (Unsplash License). Íconos: scripts/generate-lottie.mjs.
 */
@Component({
  selector: 'app-hero-tarjetas',
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
    <img ngSrc="images/login-hero.jpg" alt="" fill priority class="object-cover object-[72%_center]" />
    <div class="absolute inset-0 bg-linear-to-br from-violet-950/75 via-violet-800/50 to-fuchsia-700/30"></div>
    <div class="absolute inset-0 bg-linear-to-t from-violet-950/90 via-violet-950/20 to-transparent"></div>

    <ng-lottie class="pointer-events-none absolute inset-0 block" width="100%" height="100%" [options]="sparkles" aria-hidden="true" />

    <div class="relative flex h-full flex-col p-10 xl:p-14">
      <div class="relative flex-1" aria-hidden="true">
        @for (m of modules; track m.file) {
          <div
            class="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 absolute fill-mode-backwards duration-700"
            [style.left]="layout[m.file].left"
            [style.top]="layout[m.file].top"
            [style.animation-delay.s]="layout[m.file].delay / 4"
          >
            <div
              class="hero-float flex items-center gap-3 rounded-2xl border border-white/25 bg-white/10 py-2.5 pr-5 pl-2.5 text-white shadow-xl shadow-violet-950/30 backdrop-blur-md"
              [style.animation-delay.s]="layout[m.file].delay"
            >
              <span class="flex size-12 shrink-0 items-center justify-center rounded-xl shadow-inner" [style.background]="'var(' + m.color + ')'">
                <ng-lottie width="36px" height="36px" [options]="options(m.file)" (animationCreated)="freeze($event, m.still)" />
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
  `,
})
export class HeroTarjetas {
  protected readonly modules = HERO_MODULES;
  protected readonly layout = LAYOUT;
  protected readonly options = lottieOptions;
  protected readonly freeze = freezeIfReduced;

  protected readonly sparkles: AnimationOptions = {
    path: 'lottie/destellos.json',
    loop: !prefersReducedMotion(),
    autoplay: !prefersReducedMotion(),
    rendererSettings: { preserveAspectRatio: 'xMidYMid slice' },
  };
}
