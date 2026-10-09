import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LottieComponent } from 'ngx-lottie';
import { freezeIfReduced, HERO_MODULES, lottieOptions } from './hero-shared';

/** Columnas (de 6) que ocupa cada módulo en la cuadrícula. */
const SPAN: Record<string, string> = {
  prestamos: 'col-span-3',
  nomina: 'col-span-3',
  prima: 'col-span-3',
  ahorro: 'col-span-3',
  horas: 'col-span-3',
  convenios: 'col-span-3',
  beneficios: 'col-span-6',
};

/** Variante "bento": una baldosa viva por módulo, con el color propio de cada uno. */
@Component({
  selector: 'app-hero-bento',
  imports: [LottieComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'absolute inset-0 block overflow-hidden' },
  template: `
    <div class="absolute inset-0 bg-violet-950"></div>
    <div class="absolute -top-24 -right-24 size-96 rounded-full bg-violet-600/40 blur-3xl"></div>
    <div class="absolute -bottom-32 -left-24 size-96 rounded-full bg-fuchsia-600/25 blur-3xl"></div>

    <div class="relative flex h-full flex-col justify-center gap-6 p-8 xl:p-12">
      <div class="text-white">
        <p class="text-xs font-semibold tracking-widest text-violet-300 uppercase">Portal del Colaborador</p>
        <h2 class="mt-2 text-3xl font-semibold text-balance xl:text-4xl">Tus trámites, en un solo lugar</h2>
      </div>

      <div class="grid grid-cols-6 gap-3">
        @for (m of modules; track m.file; let i = $index) {
          <div
            class="group motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 relative overflow-hidden rounded-3xl bg-[linear-gradient(140deg,color-mix(in_oklab,var(--c),white_16%),var(--c))] p-4 text-white fill-mode-backwards shadow-lg shadow-violet-950/40 duration-500 motion-safe:transition-transform motion-safe:hover:-translate-y-1"
            [class]="span[m.file]"
            [style.--c]="'var(' + m.color + ')'"
            [style.animation-delay.ms]="i * 70"
          >
            <span class="absolute -right-8 -bottom-8 size-28 rounded-full bg-white/10 transition-transform duration-500 group-hover:scale-125"></span>
            <div class="relative flex items-center gap-3">
              <span class="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 ring-1 ring-white/30">
                <ng-lottie width="34px" height="34px" [options]="options(m.file)" (animationCreated)="freeze($event, m.still)" />
              </span>
              <div class="min-w-0">
                <p class="text-sm leading-tight font-semibold">{{ m.label }}</p>
                <p class="mt-0.5 text-xs leading-tight text-white/85">{{ m.hint }}</p>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class HeroBento {
  protected readonly modules = HERO_MODULES;
  protected readonly span = SPAN;
  protected readonly options = lottieOptions;
  protected readonly freeze = freezeIfReduced;
}
