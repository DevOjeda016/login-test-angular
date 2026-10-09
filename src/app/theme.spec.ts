import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme';

function stubSystemPrefersDark(dark: boolean): void {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: dark && query.includes('dark'),
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  }));
}

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('sigue la preferencia del sistema cuando no hay elección guardada', () => {
    stubSystemPrefersDark(true);
    const service = TestBed.inject(ThemeService);

    expect(service.mode()).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('usa modo claro si el sistema no pide oscuro', () => {
    stubSystemPrefersDark(false);
    const service = TestBed.inject(ThemeService);

    expect(service.mode()).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('alterna, aplica la clase dark y recuerda la elección', () => {
    stubSystemPrefersDark(false);
    const service = TestBed.inject(ThemeService);

    service.toggle();
    expect(service.mode()).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');

    service.toggle();
    expect(service.mode()).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('la elección guardada gana sobre la preferencia del sistema', () => {
    stubSystemPrefersDark(true);
    localStorage.setItem('theme', 'light');
    const service = TestBed.inject(ThemeService);

    expect(service.mode()).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
