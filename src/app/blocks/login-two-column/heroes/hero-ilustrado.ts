import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideHandCoins } from '@ng-icons/lucide';
import { LottieComponent } from 'ngx-lottie';
import { createCarousel, freezeIfReduced, lottieOptions, moduleByFile } from './hero-shared';

const SLIDES = [
  {
    headline: 'Solicitudes más ágiles',
    text: 'Anticipos y préstamos desde un solo lugar.',
    module: moduleByFile('nomina'),
    title: 'Adelanta tu pago en pocos pasos',
    steps: ['Elige el monto', 'Confirma tus datos', 'Recibe la respuesta'],
  },
  {
    headline: 'Vacaciones con tranquilidad',
    text: 'Solicita el anticipo de tu prima vacacional.',
    module: moduleByFile('prima'),
    title: 'Planea tu descanso con anticipo',
    steps: ['Indica tus fechas', 'Solicita el anticipo', 'Disfruta tu descanso'],
  },
  {
    headline: 'Tu ahorro, a la mano',
    text: 'Consulta y solicita tu fondo de ahorro.',
    module: moduleByFile('ahorro'),
    title: 'Consulta y solicita tu fondo',
    steps: ['Revisa tu saldo', 'Haz tu solicitud', 'Da seguimiento'],
  },
];

/** Manchas de confeti en colores de módulo: posición, tamaño, forma orgánica y desfase. */
const CONFETTI = [
  { color: '--module-beneficios', x: 14, y: 12, w: 26, h: 20, r: '60% 40% 55% 45%', rot: 20, delay: 0 },
  { color: '--module-horas', x: 82, y: 9, w: 14, h: 14, r: '50%', rot: 0, delay: 1.4 },
  { color: '--module-ahorro', x: 90, y: 38, w: 22, h: 30, r: '55% 45% 40% 60%', rot: -30, delay: 2.2 },
  { color: '--module-nomina', x: 8, y: 44, w: 12, h: 12, r: '50%', rot: 0, delay: 0.8 },
  { color: '--module-convenios', x: 11, y: 70, w: 34, h: 12, r: '999px', rot: -35, delay: 3 },
  { color: '--module-prima', x: 88, y: 72, w: 16, h: 16, r: '50%', rot: 0, delay: 1.8 },
  { color: '--module-horas', x: 74, y: 56, w: 12, h: 24, r: '60% 40% 60% 40%', rot: 40, delay: 2.6 },
  { color: '--module-beneficios', x: 30, y: 4, w: 10, h: 10, r: '50%', rot: 0, delay: 3.4 },
];

/**
 * Variante "ilustrado" (ref. SaaS): panel de color de marca, confeti orgánico, tarjetas que
 * ilustran el producto y carrusel con puntos. Textos de las tarjetas: ejemplo.
 */
@Component({
  selector: 'app-hero-ilustrado',
  imports: [LottieComponent, NgIcon],
  providers: [provideIcons({ lucideCheck, lucideHandCoins })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'absolute inset-0 block overflow-hidden bg-violet-700' },
  styles: `
    @keyframes drift {
      0%,
      100% {
        transform: translate(0, 0) rotate(var(--rot));
      }
      50% {
        transform: translate(6px, -12px) rotate(calc(var(--rot) + 14deg));
      }
    }
    @keyframes bob {
      50% {
        transform: translateY(-8px);
      }
    }
    .drift {
      animation: drift 9s ease-in-out infinite;
    }
    .bob {
      animation: bob 6s ease-in-out infinite;
    }
    @media (prefers-reduced-motion: reduce) {
      .drift,
      .bob {
        animation: none;
      }
    }
  `,
  template: `
    <div class="absolute inset-0 bg-linear-to-br from-violet-600 via-violet-700 to-violet-900"></div>
    <div class="absolute -top-32 -left-32 size-96 rounded-full bg-white/[0.06]"></div>
    <div class="absolute -right-40 -bottom-40 size-[34rem] rounded-full bg-fuchsia-500/20"></div>

    @for (c of confetti; track $index) {
      <span
        class="drift absolute opacity-90"
        aria-hidden="true"
        [style.left.%]="c.x"
        [style.top.%]="c.y"
        [style.width.px]="c.w"
        [style.height.px]="c.h"
        [style.border-radius]="c.r"
        [style.background]="'color-mix(in oklab, var(' + c.color + '), white 30%)'"
        [style.--rot]="c.rot + 'deg'"
        [style.animation-delay.s]="-c.delay"
      ></span>
    }

    <div class="relative flex h-full flex-col items-center justify-center gap-10 p-6">
      <div class="relative h-[24rem] w-[28rem] max-w-full scale-[0.85] xl:scale-100" aria-hidden="true">
        <!-- Tarjeta principal (cambia con el carrusel) -->
        @for (s of [slide()]; track s.module.file) {
          <div class="bob motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-6 absolute top-0 left-0 w-72 overflow-hidden rounded-3xl bg-white shadow-2xl shadow-violet-950/40 duration-700">
            <div class="flex h-28 items-center justify-center" [style.background]="'var(' + s.module.color + ')'">
              <ng-lottie width="76px" height="76px" [options]="options(s.module.file)" (animationCreated)="freeze($event, s.module.still)" />
            </div>
            <div class="-mt-3 rounded-t-3xl bg-white p-5">
              <p class="text-[11px] font-semibold tracking-widest uppercase" [style.color]="'var(' + s.module.color + ')'">{{ s.module.label }}</p>
              <p class="mt-1 text-base leading-snug font-semibold text-zinc-900">{{ s.title }}</p>
              <ol class="mt-4 space-y-2.5">
                @for (step of s.steps; track step; let n = $index) {
                  <li class="flex items-center gap-2.5 text-sm text-zinc-600">
                    <span class="flex size-5 items-center justify-center rounded-full bg-violet-100 text-[11px] font-semibold text-violet-700">{{ n + 1 }}</span>
                    {{ step }}
                  </li>
                }
              </ol>
            </div>
          </div>
        }

        <!-- Icono de la app -->
        <div class="bob absolute top-14 right-6 flex size-16 items-center justify-center rounded-2xl bg-white text-violet-700 shadow-xl [animation-delay:-3s]">
          <ng-icon name="lucideHandCoins" class="text-3xl" />
        </div>

        <!-- Lista de módulos -->
        <div class="bob absolute right-0 bottom-4 w-52 rounded-2xl bg-white p-4 shadow-2xl shadow-violet-950/40 [animation-delay:-1.5s]">
          @for (m of listed; track m.file) {
            <div class="flex items-center gap-3 py-1.5">
              <span class="flex size-9 shrink-0 items-center justify-center rounded-xl" [style.background]="'var(' + m.color + ')'">
                <ng-lottie width="22px" height="22px" [options]="options(m.file)" (animationCreated)="freeze($event, m.still)" />
              </span>
              <div class="min-w-0">
                <p class="text-sm leading-tight font-semibold text-zinc-900">{{ m.label }}</p>
                <p class="text-xs text-zinc-500">{{ m.hint }}</p>
              </div>
            </div>
          }
        </div>

        <!-- Aviso de solicitud -->
        <div class="bob absolute bottom-0 left-0 flex items-center gap-3 rounded-xl bg-white py-2.5 pr-5 pl-2.5 shadow-xl [animation-delay:-4.5s]">
          <span class="flex size-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700"><ng-icon name="lucideCheck" class="text-lg" /></span>
          <div>
            <p class="text-xs font-semibold text-zinc-900">Solicitud enviada</p>
            <p class="text-[11px] text-zinc-500">hace 2 minutos</p>
          </div>
        </div>
      </div>

      <div class="text-center text-white">
        <h2 class="text-2xl font-semibold xl:text-3xl">{{ slide().headline }}</h2>
        <p class="mx-auto mt-2 max-w-xs text-base text-violet-100/90 text-balance">{{ slide().text }}</p>
        <div class="mt-5 flex justify-center gap-2" role="tablist" aria-label="Mensajes del portal">
          @for (s of slides; track s.module.file; let i = $index) {
            <button
              type="button"
              role="tab"
              class="h-2 rounded-full transition-all duration-500"
              [class]="index() === i ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'"
              [attr.aria-selected]="index() === i"
              [attr.aria-label]="'Mensaje ' + (i + 1)"
              (click)="select(i)"
            ></button>
          }
        </div>
      </div>
    </div>
  `,
})
export class HeroIlustrado {
  protected readonly slides = SLIDES;
  protected readonly confetti = CONFETTI;
  protected readonly options = lottieOptions;
  protected readonly freeze = freezeIfReduced;
  protected readonly listed = [moduleByFile('ahorro'), moduleByFile('convenios'), moduleByFile('beneficios')];

  private readonly carousel = createCarousel(SLIDES.length, 5500);
  protected readonly index = this.carousel.index;
  protected readonly select = this.carousel.select;
  protected readonly slide = computed(() => SLIDES[this.index()]);
}
