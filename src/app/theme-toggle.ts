import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMoon, lucideSun } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { ThemeService } from './theme';

/** Botón sol/luna para alternar entre modo claro y oscuro. */
@Component({
  selector: 'app-theme-toggle',
  imports: [HlmButtonImports, NgIcon],
  providers: [provideIcons({ lucideMoon, lucideSun })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button hlmBtn variant="ghost" size="icon" type="button" [attr.aria-label]="label()" [attr.title]="label()" (click)="theme.toggle()">
      <ng-icon [name]="dark() ? 'lucideSun' : 'lucideMoon'" class="text-lg" />
    </button>
  `,
})
export class ThemeToggle {
  protected readonly theme = inject(ThemeService);
  protected readonly dark = computed(() => this.theme.mode() === 'dark');
  protected readonly label = computed(() => (this.dark() ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'));
}
