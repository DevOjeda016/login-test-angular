import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
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

export type Fondo = 'sobrio' | 'aurora' | 'claro';

/**
 * Variante "ilustrado" (ref. SaaS): tarjetas que ilustran el producto y carrusel con puntos
 * sobre un fondo sobrio (sin confeti). Textos de las tarjetas: ejemplo.
 * Fondos: `sobrio` (violeta profundo), `aurora` (resplandores suaves) y `claro` (lavanda con patrón).
 */
@Component({
  selector: 'app-hero-ilustrado',
  imports: [LottieComponent, NgIcon],
  providers: [provideIcons({ lucideCheck, lucideHandCoins })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'absolute inset-0 block overflow-hidden' },
  styles: `
    @keyframes bob {
      50% {
        transform: translateY(-8px);
      }
    }
    @keyframes aurora {
      0%,
      100% {
        transform: translate(0, 0) scale(1);
      }
      50% {
        transform: translate(40px, -30px) scale(1.12);
      }
    }
    .aurora {
      animation: aurora 24s ease-in-out infinite;
    }
    .bob {
      animation: bob 6s ease-in-out infinite;
    }
    @media (prefers-reduced-motion: reduce) {
      .aurora,
      .bob {
        animation: none;
      }
    }
  `,
  template: `
    @switch (fondo()) {
      @case ('aurora') {
        <div class="absolute inset-0 bg-slate-950"></div>
        <div class="aurora absolute -top-24 -left-24 size-[30rem] rounded-full bg-violet-600/45 blur-3xl"></div>
        <div class="aurora absolute top-1/3 -right-32 size-[28rem] rounded-full bg-indigo-500/35 blur-3xl [animation-delay:-6s]"></div>
        <div class="aurora absolute -bottom-32 left-1/4 size-[30rem] rounded-full bg-fuchsia-600/25 blur-3xl [animation-delay:-12s]"></div>
        <div class="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-slate-950/60"></div>
      }
      @case ('claro') {
        <div class="absolute inset-0 bg-violet-50"></div>
        <div class="absolute inset-0 bg-[url('/images/pattern-cubos.svg')] opacity-80"></div>
        <div class="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_40%,--theme(--color-violet-200/70%),transparent_75%)]"></div>
      }
      @default {
        <div class="absolute inset-0 bg-violet-950"></div>
        <div class="absolute inset-0 bg-[radial-gradient(70%_55%_at_30%_0%,--theme(--color-violet-600/45%),transparent_70%)]"></div>
        <div class="absolute inset-0 bg-[radial-gradient(55%_45%_at_50%_42%,--theme(--color-violet-500/25%),transparent_75%)]"></div>
        <div class="absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.08)_1px,transparent_1px)] bg-size-[28px_28px] mask-[radial-gradient(75%_65%_at_50%_42%,black,transparent)]"></div>
        <div class="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent"></div>
      }
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

      <div class="text-center" [class]="light() ? 'text-zinc-900' : 'text-white'">
        <h2 class="text-2xl font-semibold xl:text-3xl">{{ slide().headline }}</h2>
        <p class="mx-auto mt-2 max-w-xs text-base text-balance" [class]="light() ? 'text-zinc-600' : 'text-violet-100/90'">{{ slide().text }}</p>
        <div class="mt-5 flex justify-center gap-2" role="tablist" aria-label="Mensajes del portal">
          @for (s of slides; track s.module.file; let i = $index) {
            <button
              type="button"
              role="tab"
              class="h-2 rounded-full transition-all duration-500"
              [class]="index() === i ? (light() ? 'w-6 bg-violet-600' : 'w-6 bg-white') : (light() ? 'w-2 bg-violet-600/30 hover:bg-violet-600/60' : 'w-2 bg-white/40 hover:bg-white/70')"
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
  /** Fondo del panel. */
  public readonly fondo = input<Fondo>('sobrio');
  protected readonly light = computed(() => this.fondo() === 'claro');
  protected readonly slides = SLIDES;
  protected readonly options = lottieOptions;
  protected readonly freeze = freezeIfReduced;
  protected readonly listed = [moduleByFile('ahorro'), moduleByFile('convenios'), moduleByFile('beneficios')];

  private readonly carousel = createCarousel(SLIDES.length, 5500);
  protected readonly index = this.carousel.index;
  protected readonly select = this.carousel.select;
  protected readonly slide = computed(() => SLIDES[this.index()]);
}
