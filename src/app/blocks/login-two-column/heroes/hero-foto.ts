import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideHandCoins } from '@ng-icons/lucide';
import { LottieComponent } from 'ngx-lottie';
import { createCarousel, freezeIfReduced, lottieOptions, moduleByFile } from './hero-shared';

const SLIDES = [
  {
    photo: 'images/carrusel-1.jpg',
    position: '50% 28%',
    title: 'Tus préstamos y anticipos, sin filas',
    text: 'Solicítalos desde cualquier lugar y da seguimiento a tu trámite.',
    module: moduleByFile('prestamos'),
  },
  {
    photo: 'images/carrusel-2.jpg',
    position: '44% 50%',
    title: 'Tu tiempo extra, bien registrado',
    text: 'Registra tus horas extraordinarias en un par de pasos.',
    module: moduleByFile('horas'),
  },
  {
    photo: 'images/login-hero.jpg',
    position: '72% 50%',
    title: 'Lo que ganas por ser parte del equipo',
    text: 'Consulta tus convenios y beneficios en un solo lugar.',
    module: moduleByFile('beneficios'),
  },
];

/**
 * Variante "foto" (ref. editorial): fotografía en blanco y negro a pantalla completa,
 * titular grande y carrusel con barras de progreso. Créditos en public/images/CREDITS.md.
 */
@Component({
  selector: 'app-hero-foto',
  imports: [NgOptimizedImage, LottieComponent, NgIcon],
  providers: [provideIcons({ lucideHandCoins })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'absolute inset-0 block overflow-hidden bg-black' },
  styles: `
    @keyframes bar-fill {
      from {
        transform: scaleX(0);
      }
      to {
        transform: scaleX(1);
      }
    }
    .bar-fill {
      transform-origin: left;
      animation: bar-fill var(--ms) linear forwards;
    }
    @media (prefers-reduced-motion: reduce) {
      .bar-fill {
        animation: none;
        transform: scaleX(1);
      }
    }
  `,
  template: `
    @for (s of slides; track s.photo; let i = $index) {
      <img
        [ngSrc]="s.photo"
        alt=""
        fill
        [priority]="i === 0"
        class="object-cover grayscale contrast-110 transition-[opacity,transform] duration-1000 ease-out"
        [class]="index() === i ? 'scale-100 opacity-100' : 'scale-110 opacity-0'"
        [style.object-position]="s.position"
      />
    }
    <div class="absolute inset-0 bg-linear-to-t from-black/90 via-black/25 to-black/45"></div>
    <div class="absolute inset-0 bg-linear-to-t from-violet-950/50 via-transparent to-transparent"></div>

    <div class="relative flex h-full flex-col justify-between p-8 text-white xl:p-12">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2.5 font-medium">
          <ng-icon name="lucideHandCoins" class="text-2xl" />
          Portal del Colaborador
        </div>
        <div class="flex items-center gap-2.5 rounded-full border border-white/25 bg-white/10 py-1.5 pr-4 pl-1.5 backdrop-blur-md" aria-hidden="true">
          <span class="flex size-9 items-center justify-center rounded-full transition-colors duration-700" [style.background]="'var(' + slides[index()].module.color + ')'">
            @for (s of [slides[index()]]; track s.module.file) {
              <ng-lottie width="24px" height="24px" [options]="options(s.module.file)" (animationCreated)="freeze($event, s.module.still)" />
            }
          </span>
          <span class="text-sm font-medium">{{ slides[index()].module.label }}</span>
        </div>
      </div>

      <div>
        <div class="grid max-w-lg">
          @for (s of slides; track s.photo; let i = $index) {
            <div
              class="transition-all duration-700 [grid-area:1/1]"
              [class]="index() === i ? 'translate-y-0 opacity-100 delay-300' : 'pointer-events-none translate-y-3 opacity-0'"
              [attr.aria-hidden]="index() !== i"
            >
              <h2 class="text-4xl leading-tight font-light text-balance xl:text-5xl">{{ s.title }}</h2>
              <p class="mt-4 text-base text-white/70">{{ s.text }}</p>
            </div>
          }
        </div>

        <div class="mt-10 flex gap-3" role="tablist" aria-label="Mensajes del portal" [style.--ms]="ms + 'ms'">
          @for (s of slides; track s.photo; let i = $index) {
            <button type="button" role="tab" class="group py-2" [attr.aria-selected]="index() === i" [attr.aria-label]="'Mensaje ' + (i + 1)" (click)="select(i)">
              <span class="relative block h-0.5 w-10 overflow-hidden rounded-full bg-white/30">
                @if (index() === i) {
                  <span class="bar-fill absolute inset-0 bg-white"></span>
                } @else if (i < index()) {
                  <span class="absolute inset-0 bg-white/80"></span>
                }
              </span>
            </button>
          }
        </div>
      </div>
    </div>
  `,
})
export class HeroFoto {
  protected readonly slides = SLIDES;
  protected readonly options = lottieOptions;
  protected readonly freeze = freezeIfReduced;
  private readonly carousel = createCarousel(SLIDES.length);
  protected readonly index = this.carousel.index;
  protected readonly ms = this.carousel.ms;
  protected readonly select = this.carousel.select;
}
