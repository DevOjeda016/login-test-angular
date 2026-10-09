import { DestroyRef, inject, signal, type Signal } from '@angular/core';
import type { AnimationItem } from 'lottie-web';
import type { AnimationOptions } from 'ngx-lottie';

export interface HeroModule {
  label: string;
  /** Nombre del archivo en public/lottie (sin extensión). */
  file: string;
  /** Token CSS definido en styles.css. */
  color: string;
  /** Texto corto de apoyo (sin cifras ni promesas). */
  hint: string;
  /** Fotograma a mostrar cuando el usuario prefiere menos movimiento. */
  still: number;
}

export const HERO_MODULES: readonly HeroModule[] = [
  { label: 'Préstamos', file: 'prestamos', color: '--module-prestamos', hint: 'Solicita y da seguimiento', still: 36 },
  { label: 'Anticipo de nómina', file: 'nomina', color: '--module-nomina', hint: 'Adelanta tu pago', still: 0 },
  { label: 'Prima vacacional', file: 'prima', color: '--module-prima', hint: 'Anticipa tu prima', still: 0 },
  { label: 'Fondo de ahorro', file: 'ahorro', color: '--module-ahorro', hint: 'Solicita y consulta', still: 8 },
  { label: 'Horas extraordinarias', file: 'horas', color: '--module-horas', hint: 'Registra tu tiempo', still: 0 },
  { label: 'Convenios', file: 'convenios', color: '--module-convenios', hint: 'Alianzas para ti', still: 60 },
  { label: 'Beneficios', file: 'beneficios', color: '--module-beneficios', hint: 'Todo lo que tienes', still: 0 },
];

export const prefersReducedMotion = (): boolean =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

const cache = new Map<string, AnimationOptions>();

/** Opciones estables por archivo: ngx-lottie recarga la animación si cambia la referencia. */
export function lottieOptions(file: string): AnimationOptions {
  let options = cache.get(file);
  if (!options) {
    const reduced = prefersReducedMotion();
    options = { path: `lottie/${file}.json`, loop: !reduced, autoplay: !reduced };
    cache.set(file, options);
  }
  return options;
}

/** Con movimiento reducido, congela el ícono en un fotograma representativo. */
export function freezeIfReduced(animation: AnimationItem, still: number): void {
  if (!prefersReducedMotion()) return;
  animation.addEventListener('DOMLoaded', () => animation.goToAndStop(still, true));
}

/** Señal que sigue una media query. Llamar en contexto de inyección. */
export function matchMediaSignal(query: string): Signal<boolean> {
  if (typeof matchMedia !== 'function') return signal(false);
  const mql = matchMedia(query);
  const state = signal(mql.matches);
  const onChange = (e: MediaQueryListEvent) => state.set(e.matches);
  mql.addEventListener('change', onChange);
  inject(DestroyRef).onDestroy(() => mql.removeEventListener('change', onChange));
  return state;
}
