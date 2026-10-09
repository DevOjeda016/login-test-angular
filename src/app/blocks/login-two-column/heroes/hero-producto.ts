import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck } from '@ng-icons/lucide';
import { LottieComponent } from 'ngx-lottie';
import { freezeIfReduced, lottieOptions } from './hero-shared';

const DAYS = [
  { d: 'L', h: 38 },
  { d: 'M', h: 62 },
  { d: 'M', h: 30 },
  { d: 'J', h: 92, active: true },
  { d: 'V', h: 54 },
  { d: 'S', h: 24 },
  { d: 'D', h: 14 },
];

/**
 * Variante "producto" (ref. dashboard): fondo claro con patrón y tarjetas flotantes que
 * muestran el portal en uso. Las cifras y nombres son datos de ejemplo.
 */
@Component({
  selector: 'app-hero-producto',
  imports: [LottieComponent, NgIcon],
  providers: [provideIcons({ lucideCheck })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'absolute inset-0 block overflow-hidden bg-violet-50' },
  styles: `
    @keyframes float {
      0%,
      100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-9px);
      }
    }
    @keyframes bar-grow {
      from {
        transform: scaleY(0.08);
      }
      to {
        transform: scaleY(1);
      }
    }
    @keyframes dot-pulse {
      50% {
        opacity: 0.35;
      }
    }
    .float {
      animation: float 7s ease-in-out infinite;
    }
    .bar {
      transform-origin: bottom;
      animation: bar-grow 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) backwards;
    }
    .dot-pulse {
      animation: dot-pulse 1.6s ease-in-out infinite;
    }
    @media (prefers-reduced-motion: reduce) {
      .float,
      .bar,
      .dot-pulse {
        animation: none;
      }
    }
  `,
  template: `
    <div class="absolute inset-0 bg-[url('/images/pattern-cubos.svg')] opacity-90"></div>
    <div class="absolute inset-0 bg-[radial-gradient(60%_50%_at_55%_45%,--theme(--color-violet-200/70%),transparent_75%)]"></div>

    <div class="relative flex h-full flex-col items-center justify-center gap-8 p-6">
      <div class="relative h-[30rem] w-[34rem] max-w-full scale-[0.82] xl:scale-100" aria-hidden="true">
        <!-- Fondo de ahorro -->
        <div class="float absolute top-20 left-0 w-72 rounded-3xl bg-zinc-900 p-6 text-white shadow-2xl shadow-violet-950/25">
          <div class="flex items-center justify-between">
            <span class="flex size-10 items-center justify-center rounded-xl" [style.background]="'var(--module-ahorro)'">
              <ng-lottie width="26px" height="26px" [options]="options('ahorro')" (animationCreated)="freeze($event, 8)" />
            </span>
            <div class="mr-3 flex">
              <span class="size-7 rounded-full bg-violet-500"></span>
              <span class="-ml-3 size-7 rounded-full bg-amber-400/90"></span>
            </div>
          </div>
          <p class="mt-6 text-3xl font-semibold tracking-tight">$ 48,250.00</p>
          <p class="mt-1 text-sm text-zinc-400">Fondo de ahorro</p>
          <p class="mt-8 text-sm tracking-widest text-zinc-500">•••• •••• 0421</p>
        </div>

        <!-- Solicitud de préstamo -->
        <div class="float absolute top-0 right-0 w-[17rem] rounded-3xl bg-white p-5 shadow-xl shadow-violet-950/15 [animation-delay:-2.5s]">
          <div class="flex items-center gap-3">
            <span class="flex size-10 items-center justify-center rounded-xl" [style.background]="'var(--module-prestamos)'">
              <ng-lottie width="26px" height="26px" [options]="options('prestamos')" (animationCreated)="freeze($event, 36)" />
            </span>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-semibold whitespace-nowrap text-zinc-900">Tu préstamo</p>
              <p class="text-xs text-zinc-500">Folio 2041</p>
            </div>
            <span class="flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-medium text-amber-800">
              <span class="dot-pulse size-1.5 rounded-full bg-amber-600"></span>En revisión
            </span>
          </div>
          <div class="mt-5 flex items-center">
            <span class="flex size-6 items-center justify-center rounded-full bg-violet-600 text-white"><ng-icon name="lucideCheck" class="text-xs" /></span>
            <span class="h-0.5 flex-1 bg-violet-600"></span>
            <span class="flex size-6 items-center justify-center rounded-full border-2 border-violet-600 bg-white"><span class="dot-pulse size-2 rounded-full bg-violet-600"></span></span>
            <span class="h-0.5 flex-1 bg-zinc-200"></span>
            <span class="size-6 rounded-full border-2 border-zinc-200 bg-white"></span>
          </div>
          <div class="mt-1.5 flex justify-between text-[11px] text-zinc-500"><span>Enviada</span><span>Revisión</span><span>Respuesta</span></div>
          <div class="mt-4 flex items-center">
            <span class="flex size-8 items-center justify-center rounded-full border-2 border-white bg-fuchsia-600 text-[11px] font-semibold text-white">RH</span>
            <span class="-ml-2 flex size-8 items-center justify-center rounded-full border-2 border-white bg-sky-700 text-[11px] font-semibold text-white">FN</span>
            <span class="-ml-2 flex size-8 items-center justify-center rounded-full border-2 border-white bg-emerald-700 text-[11px] font-semibold text-white">JA</span>
            <span class="ml-auto flex size-8 items-center justify-center rounded-full bg-violet-600 text-xs font-semibold text-white">+2</span>
          </div>
        </div>

        <!-- Horas extraordinarias -->
        <div class="float absolute bottom-0 left-0 w-56 rounded-3xl bg-white p-5 shadow-xl shadow-violet-950/15 [animation-delay:-4.5s]">
          <div class="flex items-center justify-between">
            <p class="text-sm font-semibold text-zinc-900">Horas extra</p>
            <span class="flex size-8 items-center justify-center rounded-lg" [style.background]="'var(--module-horas)'">
              <ng-lottie width="22px" height="22px" [options]="options('horas')" (animationCreated)="freeze($event, 0)" />
            </span>
          </div>
          <div class="mt-4 flex h-28 items-end justify-between gap-2">
            @for (day of days; track $index) {
              <div class="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
                <div class="flex min-h-0 w-full flex-1 items-end">
                  <div
                    class="bar w-full rounded-md"
                    [class]="day.active ? 'bg-violet-600' : 'bg-zinc-800'"
                    [style.height.%]="day.h"
                    [style.animation-delay.ms]="$index * 80"
                  ></div>
                </div>
                <span class="text-[10px]" [class]="day.active ? 'font-semibold text-zinc-900' : 'text-zinc-400'">{{ day.d }}</span>
              </div>
            }
          </div>
        </div>

        <!-- Chat con RH -->
        <div class="float absolute right-0 bottom-2 w-72 rounded-2xl bg-white p-5 shadow-xl shadow-violet-950/15 [animation-delay:-1s]">
          <div class="flex items-start gap-3">
            <span class="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white">
              RH<span class="absolute top-0 right-0 size-2.5 rounded-full border-2 border-white bg-emerald-500"></span>
            </span>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-semibold whitespace-nowrap text-zinc-900">Recursos Humanos</p>
              <p class="text-[11px] text-zinc-400">hace 2 min</p>
              <p class="mt-1.5 text-sm text-zinc-600">Hola, ¿necesitas ayuda con tu solicitud?</p>
            </div>
          </div>
          <div class="mt-4 flex justify-end">
            <span class="rounded-lg border-2 border-zinc-900 bg-violet-600 px-4 py-1.5 text-xs font-semibold text-white shadow-[3px_3px_0_0_#18181b]">Chatear</span>
          </div>
        </div>
      </div>

      <div class="max-w-sm text-center">
        <h2 class="text-2xl font-semibold text-balance text-zinc-900 xl:text-3xl">Todo tu portal, de un vistazo</h2>
        <p class="mt-2 text-sm text-zinc-600 text-balance">Tus solicitudes, tu tiempo y tus beneficios, siempre actualizados.</p>
      </div>
    </div>
  `,
})
export class HeroProducto {
  protected readonly days = DAYS;
  protected readonly options = lottieOptions;
  protected readonly freeze = freezeIfReduced;
}
