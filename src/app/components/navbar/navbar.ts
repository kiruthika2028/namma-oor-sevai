import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { LanguageService } from '../../services/language';
import { StorageService } from '../../services/storage';

@Component({
  selector: 'app-navbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, MatIconModule],
  template: `
    <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/60 shadow-xs">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16 sm:h-18">
          
          <!-- Logo & Brand -->
          <a routerLink="/" id="nav-brand-link" class="flex items-center gap-3 group text-left">
            <div class="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-500 text-white flex items-center justify-center shadow-sm shadow-amber-600/30 group-hover:scale-105 transition-transform duration-200">
              <mat-icon class="text-2xl leading-none">handyman</mat-icon>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="font-extrabold text-lg sm:text-xl text-stone-900 tracking-tight leading-none group-hover:text-amber-700 transition-colors">LocalConnect</span>
                <span class="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-semibold border border-amber-300/60 hidden sm:inline-block">Village Directory</span>
              </div>
              <p class="text-xs sm:text-sm font-semibold text-amber-800 tracking-wide mt-0.5">
                {{ lang.t().appSubtitle }}
              </p>
            </div>
          </a>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex items-center gap-1 sm:gap-2">
            <a 
              routerLink="/" 
              routerLinkActive="bg-amber-100 text-amber-900 font-bold" 
              [routerLinkActiveOptions]="{ exact: true }"
              id="nav-home-btn"
              class="px-3 py-2 rounded-lg text-stone-700 font-medium hover:bg-amber-50 hover:text-stone-900 transition-colors flex items-center gap-1.5 text-sm sm:text-base">
              <mat-icon class="text-lg">home</mat-icon>
              <span>{{ lang.t().home }}</span>
            </a>

            <a 
              routerLink="/services" 
              routerLinkActive="bg-amber-100 text-amber-900 font-bold"
              id="nav-services-btn"
              class="px-3 py-2 rounded-lg text-stone-700 font-medium hover:bg-amber-50 hover:text-stone-900 transition-colors flex items-center gap-1.5 text-sm sm:text-base">
              <mat-icon class="text-lg">search</mat-icon>
              <span>{{ lang.t().findServices }}</span>
            </a>

            <a 
              routerLink="/register" 
              routerLinkActive="bg-amber-100 text-amber-900 font-bold"
              id="nav-register-btn"
              class="px-3 py-2 rounded-lg text-stone-700 font-medium hover:bg-amber-50 hover:text-stone-900 transition-colors flex items-center gap-1.5 text-sm sm:text-base">
              <mat-icon class="text-lg">person_add</mat-icon>
              <span>{{ lang.t().registerProvider }}</span>
            </a>

            @if (storage.isWorkerLoggedIn()) {
              <a 
                routerLink="/worker-dashboard" 
                routerLinkActive="bg-emerald-100 text-emerald-950 font-extrabold border-emerald-300"
                id="nav-worker-dashboard-btn"
                class="px-3 py-2 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1.5 text-sm sm:text-base shadow-2xs">
                <mat-icon class="text-lg text-emerald-700">badge</mat-icon>
                <span>{{ lang.t().workerDashboard }}</span>
              </a>
            } @else {
              <a 
                routerLink="/worker-login" 
                routerLinkActive="bg-amber-100 text-amber-900 font-bold"
                id="nav-worker-login-btn"
                class="px-3 py-2 rounded-lg text-stone-700 font-medium hover:bg-amber-50 hover:text-stone-900 transition-colors flex items-center gap-1.5 text-sm sm:text-base">
                <mat-icon class="text-lg">login</mat-icon>
                <span>{{ lang.t().workerLogin }}</span>
              </a>
            }

            <a 
              routerLink="/admin" 
              routerLinkActive="bg-amber-100 text-amber-900 font-bold"
              id="nav-admin-btn"
              class="relative px-3 py-2 rounded-lg text-stone-700 font-medium hover:bg-amber-50 hover:text-stone-900 transition-colors flex items-center gap-1.5 text-sm sm:text-base">
              <mat-icon class="text-lg">admin_panel_settings</mat-icon>
              <span>{{ lang.t().adminPanel }}</span>
              @if (storage.pendingCount() > 0) {
                <span class="inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-rose-600 rounded-full animate-pulse">
                  {{ storage.pendingCount() }}
                </span>
              }
            </a>
          </nav>

          <!-- Right: Language Toggle & Mobile Menu button -->
          <div class="flex items-center gap-2">
            
            <!-- Language Switcher Pill -->
            <button 
              type="button"
              (click)="lang.toggleLanguage()"
              id="lang-toggle-btn"
              [title]="lang.isTamil() ? 'Switch to English' : 'தமிழுக்கு மாறவும்'"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-amber-600/40 bg-amber-50/80 hover:bg-amber-100 text-amber-900 text-xs sm:text-sm font-bold shadow-xs transition-all active:scale-95 cursor-pointer">
              <mat-icon class="text-base sm:text-lg text-amber-700">translate</mat-icon>
              <span class="font-bold">
                @if (lang.isTamil()) {
                  <span class="text-stone-900">தமிழ்</span> <span class="text-stone-400 font-normal">|</span> <span class="text-amber-800">EN</span>
                } @else {
                  <span class="text-amber-800">தமிழ்</span> <span class="text-stone-400 font-normal">|</span> <span class="text-stone-900 font-extrabold">English</span>
                }
              </span>
            </button>

            <!-- Mobile Menu Toggle Button -->
            <button 
              type="button"
              (click)="mobileMenuOpen.set(!mobileMenuOpen())"
              id="mobile-menu-toggle-btn"
              class="md:hidden p-2 rounded-lg text-stone-700 hover:bg-amber-100 hover:text-stone-900 focus:outline-none"
              aria-label="Toggle navigation menu">
              <mat-icon class="text-2xl leading-none">{{ mobileMenuOpen() ? 'close' : 'menu' }}</mat-icon>
            </button>
          </div>

        </div>
      </div>

      <!-- Mobile Dropdown Nav Menu -->
      @if (mobileMenuOpen()) {
        <div class="md:hidden border-t border-amber-200/80 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
          <a 
            routerLink="/" 
            (click)="mobileMenuOpen.set(false)"
            routerLinkActive="bg-amber-100 text-amber-900 font-bold" 
            [routerLinkActiveOptions]="{ exact: true }"
            id="mobile-nav-home"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-stone-700 font-medium hover:bg-amber-50">
            <mat-icon class="text-amber-700">home</mat-icon>
            <span>{{ lang.t().home }}</span>
          </a>

          <a 
            routerLink="/services" 
            (click)="mobileMenuOpen.set(false)"
            routerLinkActive="bg-amber-100 text-amber-900 font-bold"
            id="mobile-nav-services"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-stone-700 font-medium hover:bg-amber-50">
            <mat-icon class="text-amber-700">search</mat-icon>
            <span>{{ lang.t().findServices }}</span>
          </a>

          <a 
            routerLink="/register" 
            (click)="mobileMenuOpen.set(false)"
            routerLinkActive="bg-amber-100 text-amber-900 font-bold"
            id="mobile-nav-register"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-stone-700 font-medium hover:bg-amber-50">
            <mat-icon class="text-amber-700">person_add</mat-icon>
            <span>{{ lang.t().registerProvider }}</span>
          </a>

          @if (storage.isWorkerLoggedIn()) {
            <a 
              routerLink="/worker-dashboard" 
              (click)="mobileMenuOpen.set(false)"
              routerLinkActive="bg-emerald-100 text-emerald-950 font-bold"
              id="mobile-nav-worker-dashboard"
              class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-emerald-800 bg-emerald-50/60 font-bold hover:bg-emerald-100">
              <mat-icon class="text-emerald-700">badge</mat-icon>
              <span>{{ lang.t().workerDashboard }}</span>
            </a>
          } @else {
            <a 
              routerLink="/worker-login" 
              (click)="mobileMenuOpen.set(false)"
              routerLinkActive="bg-amber-100 text-amber-900 font-bold"
              id="mobile-nav-worker-login"
              class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-stone-700 font-medium hover:bg-amber-50">
              <mat-icon class="text-amber-700">login</mat-icon>
              <span>{{ lang.t().workerLogin }}</span>
            </a>
          }

          <a 
            routerLink="/admin" 
            (click)="mobileMenuOpen.set(false)"
            routerLinkActive="bg-amber-100 text-amber-900 font-bold"
            id="mobile-nav-admin"
            class="flex items-center justify-between px-3 py-2.5 rounded-lg text-stone-700 font-medium hover:bg-amber-50">
            <div class="flex items-center gap-3">
              <mat-icon class="text-amber-700">admin_panel_settings</mat-icon>
              <span>{{ lang.t().adminPanel }}</span>
            </div>
            @if (storage.pendingCount() > 0) {
              <span class="px-2 py-0.5 text-xs font-bold text-white bg-rose-600 rounded-full">
                {{ storage.pendingCount() }}
              </span>
            }
          </a>
        </div>
      }
    </header>
  `
})
export class NavbarComponent {
  readonly lang = inject(LanguageService);
  readonly storage = inject(StorageService);
  readonly mobileMenuOpen = signal<boolean>(false);
}
