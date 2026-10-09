import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideHandCoins } from '@ng-icons/lucide';
import { LoginForm } from './login-form';
import { LoginHero } from './login-hero';

@Component({
	selector: 'spartan-login-two-column',
	imports: [RouterLink, LoginForm, LoginHero, NgIcon],
	providers: [provideIcons({ lucideHandCoins })],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'block',
	},
	template: `
		<div class="grid min-h-svh lg:grid-cols-2">
			<div class="flex flex-col gap-4 p-6 md:p-10">
				<div class="flex justify-center gap-2 md:justify-start">
					<a routerLink="." class="flex items-center gap-2 font-medium">
						<div class="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
							<ng-icon name="lucideHandCoins" class="text-base" />
						</div>
						Portal del Colaborador
					</a>
				</div>
				<div class="flex flex-1 items-center justify-center">
					<div class="w-full max-w-xs">
						<spartan-two-column-login-form />
					</div>
				</div>
			</div>
			<div class="relative hidden bg-violet-950 lg:block">
				<app-login-hero />
			</div>
		</div>
	`,
})
export default class LoginTwoColumnPage {}
