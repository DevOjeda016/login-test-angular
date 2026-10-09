import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LottieComponent } from 'ngx-lottie';
import { freezeIfReduced, HERO_MODULES, lottieOptions, prefersReducedMotion } from './hero-shared';

/**
 * Variante "editorial": la foto manda (en tono morado, sin tapar caras) y los módulos
 * corren en una cinta inferior dentro de una tarjeta de vidrio.
 * Foto: Vitaly Gariev en Unsplash (Unsplash License).
 */
@Component({
  selector: 'app-hero-editorial',
  imports: [NgOptimizedImage, LottieComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'absolute inset-0 block overflow-hidden' },
  styles: `
    @keyframes marquee {
      to {
        transform: translateX(-50%);
      }
    }
    .marquee {
      animation: marquee 38s linear infinite;
    }
    .marquee-mask:hover .marquee {
      animation-play-state: paused;
    }
    @media (prefers-reduced-motion: reduce) {
      .marquee {
        animation: none;
      }
    }
  `,
  template: `
    <img ngSrc="images/login-hero.jpg" alt="" fill priority class="object-cover object-[72%_center] grayscale contrast-105" />
    <div class="absolute inset-0 bg-violet-700/65 mix-blend-multiply"></div>
    <div class="absolute inset-0 bg-linear-to-b from-fuchsia-500/20 via-transparent to-violet-950/70"></div>

    <ng-lottie class="pointer-events-none absolute inset-0 block" width="100%" height="100%" [options]="sparkles" aria-hidden="true" />

    <div class="relative flex h-full flex-col justify-end p-6 xl:p-10">
      <div class="rounded-3xl border border-white/20 bg-violet-950/65 p-7 text-white shadow-2xl shadow-violet-950/50 backdrop-blur-xl xl:p-9">
        <p class="text-xs font-semibold tracking-widest text-violet-300 uppercase">Portal del Colaborador</p>
        <h2 class="mt-2 text-3xl font-semibold text-balance xl:text-4xl">Tus trámites, en un solo lugar</h2>
        <p class="mt-3 max-w-md text-base text-violet-100/90 text-balance">
          Solicita, registra y consulta desde cualquier lugar, sin papeleo.
        </p>

        <div class="marquee-mask mt-6 -mr-7 -ml-7 overflow-hidden mask-[linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] xl:-mr-9 xl:-ml-9" aria-hidden="true">
          <div class="marquee flex w-max gap-3 py-1">
            @for (copy of copies; track copy) {
              @for (m of modules; track m.file) {
                <div class="flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 py-1.5 pr-4 pl-1.5">
                  <span class="flex size-9 items-center justify-center rounded-full" [style.background]="'var(' + m.color + ')'">
                    <ng-lottie width="24px" height="24px" [options]="options(m.file)" (animationCreated)="freeze($event, m.still)" />
                  </span>
                  <span class="text-sm font-medium whitespace-nowrap">{{ m.label }}</span>
                </div>
              }
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class HeroEditorial {
  protected readonly modules = HERO_MODULES;
  /** Dos copias para que el desplazamiento de -50% cierre el ciclo sin saltos. */
  protected readonly copies = [0, 1];
  protected readonly options = lottieOptions;
  protected readonly freeze = freezeIfReduced;

  protected readonly sparkles = {
    path: 'lottie/destellos.json',
    loop: !prefersReducedMotion(),
    autoplay: !prefersReducedMotion(),
    rendererSettings: { preserveAspectRatio: 'xMidYMid slice' as const },
  };
}
