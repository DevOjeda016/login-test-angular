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

/**
 * Panel visual del login: tarjetas que ilustran el portal y un carrusel de mensajes sobre un
 * fondo lavanda con patrón de cubos. Sigue el tema (clase `dark` en <html>): colores vía tokens
 * de Spartan y variantes `dark:`. Los textos de las tarjetas son de ejemplo.
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
    .bob {
      animation: bob 6s ease-in-out infinite;
    }
    @media (prefers-reduced-motion: reduce) {
      .bob {
        animation: none;
      }
    }
  `,
  template: `
    <div class="absolute inset-0 bg-violet-50 dark:bg-zinc-950"></div>
    <div class="absolute inset-0 bg-[url('/images/pattern-cubos.svg')] opacity-80 dark:hidden"></div>
    <div class="absolute inset-0 hidden bg-[url('/images/pattern-cubos-dark.svg')] dark:block"></div>
    <div
      class="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_40%,--theme(--color-violet-200/70%),transparent_75%)] dark:bg-[radial-gradient(60%_50%_at_50%_40%,--theme(--color-violet-600/25%),transparent_75%)]"
    ></div>

    <div class="relative flex h-full flex-col items-center justify-center gap-10 p-6">
      <div class="relative h-[24rem] w-[28rem] max-w-full scale-[0.85] xl:scale-100" aria-hidden="true">
        <!-- Tarjeta principal (cambia con el carrusel) -->
        @for (s of [slide()]; track s.module.file) {
          <div
            class="bob bg-card text-card-foreground motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-6 absolute top-0 left-0 w-72 overflow-hidden rounded-3xl shadow-2xl shadow-violet-950/25 duration-700 dark:shadow-black/50 dark:ring-1 dark:ring-white/10"
          >
            <div class="flex h-28 items-center justify-center" [style.background]="'var(' + s.module.color + ')'">
              <ng-lottie width="76px" height="76px" [options]="options(s.module.file)" (animationCreated)="freeze($event, s.module.still)" />
            </div>
            <div class="bg-card -mt-3 rounded-t-3xl p-5" [style.--c]="'var(' + s.module.color + ')'">
              <p class="text-(--c) text-[11px] font-semibold tracking-widest uppercase dark:text-[color-mix(in_oklab,var(--c),white_45%)]">{{ s.module.label }}</p>
              <p class="mt-1 text-base leading-snug font-semibold">{{ s.title }}</p>
              <ol class="mt-4 space-y-2.5">
                @for (step of s.steps; track step; let n = $index) {
                  <li class="text-muted-foreground flex items-center gap-2.5 text-sm">
                    <span
                      class="flex size-5 items-center justify-center rounded-full bg-violet-100 text-[11px] font-semibold text-violet-700 dark:bg-violet-500/20 dark:text-violet-300"
                      >{{ n + 1 }}</span
                    >
                    {{ step }}
                  </li>
                }
              </ol>
            </div>
          </div>
        }

        <!-- Icono de la app -->
        <div
          class="bob bg-card absolute top-14 right-6 flex size-16 items-center justify-center rounded-2xl text-violet-700 shadow-xl shadow-violet-950/15 [animation-delay:-3s] dark:text-violet-300 dark:shadow-black/40 dark:ring-1 dark:ring-white/10"
        >
          <ng-icon name="lucideHandCoins" class="text-3xl" />
        </div>

        <!-- Lista de módulos -->
        <div
          class="bob bg-card text-card-foreground absolute right-0 bottom-4 w-52 rounded-2xl p-4 shadow-2xl shadow-violet-950/25 [animation-delay:-1.5s] dark:shadow-black/50 dark:ring-1 dark:ring-white/10"
        >
          @for (m of listed; track m.file) {
            <div class="flex items-center gap-3 py-1.5">
              <span class="flex size-9 shrink-0 items-center justify-center rounded-xl" [style.background]="'var(' + m.color + ')'">
                <ng-lottie width="22px" height="22px" [options]="options(m.file)" (animationCreated)="freeze($event, m.still)" />
              </span>
              <div class="min-w-0">
                <p class="text-sm leading-tight font-semibold">{{ m.label }}</p>
                <p class="text-muted-foreground text-xs">{{ m.hint }}</p>
              </div>
            </div>
          }
        </div>

        <!-- Aviso de solicitud -->
        <div
          class="bob bg-card text-card-foreground absolute bottom-0 left-0 flex items-center gap-3 rounded-xl py-2.5 pr-5 pl-2.5 shadow-xl shadow-violet-950/15 [animation-delay:-4.5s] dark:shadow-black/40 dark:ring-1 dark:ring-white/10"
        >
          <span class="flex size-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
            ><ng-icon name="lucideCheck" class="text-lg"
          /></span>
          <div>
            <p class="text-xs font-semibold">Solicitud enviada</p>
            <p class="text-muted-foreground text-[11px]">hace 2 minutos</p>
          </div>
        </div>
      </div>

      <div class="text-center">
        <h2 class="text-foreground text-2xl font-semibold xl:text-3xl">{{ slide().headline }}</h2>
        <p class="text-muted-foreground mx-auto mt-2 max-w-xs text-base text-balance">{{ slide().text }}</p>
        <div class="mt-5 flex justify-center gap-2" role="tablist" aria-label="Mensajes del portal">
          @for (s of slides; track s.module.file; let i = $index) {
            <button
              type="button"
              role="tab"
              class="h-2 rounded-full transition-all duration-500"
              [class]="
                index() === i
                  ? 'w-6 bg-violet-600 dark:bg-violet-400'
                  : 'w-2 bg-violet-600/30 hover:bg-violet-600/60 dark:bg-violet-300/30 dark:hover:bg-violet-300/60'
              "
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
  protected readonly options = lottieOptions;
  protected readonly freeze = freezeIfReduced;
  protected readonly listed = [moduleByFile('ahorro'), moduleByFile('convenios'), moduleByFile('beneficios')];

  private readonly carousel = createCarousel(SLIDES.length, 5500);
  protected readonly index = this.carousel.index;
  protected readonly select = this.carousel.select;
  protected readonly slide = computed(() => SLIDES[this.index()]);
}
