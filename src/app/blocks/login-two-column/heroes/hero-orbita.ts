import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideHandCoins } from '@ng-icons/lucide';
import { LottieComponent } from 'ngx-lottie';
import { freezeIfReduced, HERO_MODULES, type HeroModule, lottieOptions } from './hero-shared';

interface OrbitNode {
  module: HeroModule;
  left: string;
  top: string;
}

interface Ring {
  inset: string;
  seconds: number;
  reverse: boolean;
  nodes: OrbitNode[];
}

const byFile = (file: string) => HERO_MODULES.find((m) => m.file === file)!;

function ring(files: string[], offsetDeg: number, inset: string, seconds: number, reverse: boolean): Ring {
  return {
    inset,
    seconds,
    reverse,
    nodes: files.map((file, i) => {
      const a = ((offsetDeg + (360 / files.length) * i) * Math.PI) / 180;
      return { module: byFile(file), left: `${50 + 50 * Math.sin(a)}%`, top: `${50 - 50 * Math.cos(a)}%` };
    }),
  };
}

/** Variante "órbita": el portal al centro y los 7 módulos girando a su alrededor. */
@Component({
  selector: 'app-hero-orbita',
  imports: [LottieComponent, NgIcon],
  providers: [provideIcons({ lucideHandCoins })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'absolute inset-0 block overflow-hidden' },
  styles: `
    @keyframes orbit-spin {
      to {
        transform: rotate(360deg);
      }
    }
    @keyframes hub-pulse {
      0% {
        transform: scale(1);
        opacity: 0.45;
      }
      100% {
        transform: scale(2.4);
        opacity: 0;
      }
    }
    .orbit-spin {
      animation: orbit-spin var(--s) linear infinite;
    }
    .orbit-reverse {
      animation: orbit-spin var(--s) linear infinite reverse;
    }
    .hub-pulse {
      animation: hub-pulse 3.6s ease-out infinite;
    }
    @media (prefers-reduced-motion: reduce) {
      .orbit-spin,
      .orbit-reverse,
      .hub-pulse {
        animation: none;
      }
    }
  `,
  template: `
    <div class="absolute inset-0 bg-violet-950"></div>
    <div class="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_42%,--theme(--color-violet-600/55%),transparent_70%)]"></div>
    <div class="absolute inset-0 bg-[radial-gradient(40%_35%_at_100%_100%,--theme(--color-fuchsia-600/35%),transparent_70%)]"></div>
    <div class="absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.09)_1px,transparent_1px)] bg-size-[26px_26px] mask-[radial-gradient(70%_60%_at_50%_42%,black,transparent)]"></div>

    <div class="relative flex h-full flex-col p-10 xl:p-14">
      <div class="relative flex flex-1 items-center justify-center" aria-hidden="true">
        <div class="relative aspect-square h-[min(32rem,56svh)]">
          @for (r of rings; track r.inset) {
            <div
              class="absolute rounded-full border border-dashed border-white/20"
              [class]="r.reverse ? 'orbit-reverse' : 'orbit-spin'"
              [style.inset]="r.inset"
              [style.--s]="r.seconds + 's'"
            >
              @for (n of r.nodes; track n.module.file) {
                <div class="absolute -translate-x-1/2 -translate-y-1/2" [style.left]="n.left" [style.top]="n.top">
                  <div [class]="r.reverse ? 'orbit-spin' : 'orbit-reverse'" [style.--s]="r.seconds + 's'">
                    <div
                      class="flex size-14 items-center justify-center rounded-full border-2 border-white/80 shadow-lg shadow-violet-950/50"
                      [style.background]="'var(' + n.module.color + ')'"
                      [style.box-shadow]="'0 0 28px color-mix(in oklab, var(' + n.module.color + ') 70%, transparent)'"
                    >
                      <ng-lottie width="34px" height="34px" [options]="options(n.module.file)" (animationCreated)="freeze($event, n.module.still)" />
                    </div>
                    <span class="absolute top-full left-1/2 mt-1.5 -translate-x-1/2 rounded-full bg-violet-950/70 px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap text-white backdrop-blur-sm">
                      {{ n.module.label }}
                    </span>
                  </div>
                </div>
              }
            </div>
          }

          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <span class="hub-pulse absolute inset-0 rounded-full border border-white/40"></span>
            <span class="hub-pulse absolute inset-0 rounded-full border border-white/40 [animation-delay:1.8s]"></span>
            <div class="relative flex size-24 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white shadow-2xl shadow-violet-950/60 backdrop-blur-md">
              <ng-icon name="lucideHandCoins" class="text-4xl" />
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-md text-white">
        <h2 class="text-3xl font-semibold text-balance xl:text-4xl">Todo lo tuyo, a tu alrededor</h2>
        <p class="mt-3 text-base text-violet-100/90 text-balance">
          Un solo portal para tus solicitudes, tu tiempo y tus beneficios como colaborador.
        </p>
      </div>
    </div>
  `,
})
export class HeroOrbita {
  protected readonly options = lottieOptions;
  protected readonly freeze = freezeIfReduced;

  protected readonly rings: Ring[] = [
    ring(['prestamos', 'nomina', 'ahorro'], 0, '24%', 70, false),
    ring(['prima', 'horas', 'convenios', 'beneficios'], 45, '0%', 110, true),
  ];
}
