import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { LanguageService } from '../../services/language';
import { StorageService } from '../../services/storage';
import { SkillType, ProviderWithRating } from '../../models/provider.model';
import { ProviderDetailModalComponent } from '../provider-detail-modal/provider-detail-modal';

interface CategoryItem {
  key: SkillType;
  icon: string;
  colorClass: string;
  bgClass: string;
}

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MatIconModule, ProviderDetailModalComponent],
  template: `
    <div class="space-y-12 sm:space-y-16 pb-16">
      
      <!-- Hero Section -->
      <section class="relative pt-6 sm:pt-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div class="relative rounded-3xl bg-gradient-to-b from-amber-100/90 via-amber-50 to-white border border-amber-200/90 shadow-sm p-6 sm:p-10 md:p-14 overflow-hidden text-center">
          
          <!-- Subtle Decorative Background Pattern -->
          <div class="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 rounded-full bg-amber-300/20 blur-2xl pointer-events-none"></div>
          <div class="absolute bottom-0 left-0 -mb-8 -ml-8 w-48 h-48 rounded-full bg-orange-300/20 blur-2xl pointer-events-none"></div>
          
          <!-- Trust Pill -->
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-amber-300 text-amber-900 text-xs sm:text-sm font-bold shadow-2xs mb-4">
            <mat-icon class="text-base text-amber-600">verified_user</mat-icon>
            <span>100% Free & Local • {{ lang.t().tagline }}</span>
          </div>

          <!-- Hero Headline -->
          <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight leading-tight max-w-4xl mx-auto">
            {{ lang.t().heroTitle }}
            <span class="text-amber-700 underline decoration-amber-400 decoration-wavy decoration-2">{{ lang.t().heroHighlight }}</span>
          </h1>

          <!-- Hero Description (1-2 lines clearly explaining the mission) -->
          <p class="mt-4 sm:mt-5 text-base sm:text-lg md:text-xl text-stone-700 max-w-3xl mx-auto font-normal leading-relaxed">
            {{ lang.t().heroDescription }}
          </p>

          <!-- Quick Search Bar -->
          <div class="mt-8 max-w-2xl mx-auto">
            <form (submit)="onSearchSubmit($event)" class="flex flex-col sm:flex-row items-stretch gap-2 bg-white p-2 rounded-2xl shadow-md border border-amber-300">
              <div class="flex-1 flex items-center px-3 gap-2">
                <mat-icon class="text-stone-400">search</mat-icon>
                <input 
                  type="text" 
                  [value]="searchQuery()" 
                  (input)="searchQuery.set($any($event.target).value)"
                  [placeholder]="lang.t().searchPlaceholder"
                  id="home-search-input"
                  class="w-full py-2.5 text-stone-900 text-sm sm:text-base focus:outline-none placeholder:text-stone-400"
                />
              </div>
              <button 
                type="submit" 
                id="home-search-submit-btn"
                class="px-6 py-3 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-sm sm:text-base">
                <mat-icon class="text-lg">search</mat-icon>
                <span>{{ lang.t().searchBtn }}</span>
              </button>
            </form>
          </div>

          <!-- Two Main Action CTAs -->
          <div class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <a 
              routerLink="/services" 
              id="hero-find-services-btn"
              class="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-amber-700 hover:bg-amber-800 text-white font-bold text-base sm:text-lg rounded-xl shadow-md hover:shadow-lg transition-all active:scale-98">
              <mat-icon class="text-2xl">search</mat-icon>
              <span>{{ lang.t().findServices }}</span>
            </a>

            <a 
              routerLink="/register" 
              id="hero-register-provider-btn"
              class="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-white hover:bg-amber-50 text-amber-900 font-bold text-base sm:text-lg rounded-xl border-2 border-amber-600/40 shadow-xs hover:shadow-md transition-all active:scale-98">
              <mat-icon class="text-2xl text-amber-700">person_add</mat-icon>
              <span>{{ lang.t().registerProvider }}</span>
            </a>
          </div>

        </div>
      </section>

      <!-- Trust Stats Banner -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          
          <div class="bg-white p-4 sm:p-5 rounded-2xl border border-amber-200/80 shadow-2xs text-center flex flex-col items-center">
            <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-2">
              <mat-icon>engineering</mat-icon>
            </div>
            <span class="text-2xl sm:text-3xl font-extrabold text-stone-900">{{ storage.totalApprovedCount() }}</span>
            <span class="text-xs sm:text-sm text-stone-600 font-medium mt-0.5">{{ lang.t().statProviders }}</span>
          </div>

          <div class="bg-white p-4 sm:p-5 rounded-2xl border border-amber-200/80 shadow-2xs text-center flex flex-col items-center">
            <div class="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center mb-2">
              <mat-icon>location_city</mat-icon>
            </div>
            <span class="text-2xl sm:text-3xl font-extrabold text-stone-900">{{ storage.distinctLocations().length }}</span>
            <span class="text-xs sm:text-sm text-stone-600 font-medium mt-0.5">{{ lang.t().statVillages }}</span>
          </div>

          <div class="bg-white p-4 sm:p-5 rounded-2xl border border-amber-200/80 shadow-2xs text-center flex flex-col items-center">
            <div class="w-10 h-10 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center mb-2">
              <mat-icon>category</mat-icon>
            </div>
            <span class="text-2xl sm:text-3xl font-extrabold text-stone-900">9+</span>
            <span class="text-xs sm:text-sm text-stone-600 font-medium mt-0.5">{{ lang.t().statCategories }}</span>
          </div>

          <div class="bg-white p-4 sm:p-5 rounded-2xl border border-amber-200/80 shadow-2xs text-center flex flex-col items-center">
            <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2">
              <mat-icon>phone_in_talk</mat-icon>
            </div>
            <span class="text-2xl sm:text-3xl font-extrabold text-stone-900">{{ storage.totalDirectContacts() }}</span>
            <span class="text-xs sm:text-sm text-stone-600 font-medium mt-0.5">{{ lang.t().statConnections }}</span>
          </div>

        </div>
      </section>

      <!-- Essential Service Categories Grid -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-end justify-between mb-6 flex-wrap gap-2">
          <div>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              {{ lang.t().popularServices }}
            </h2>
            <p class="text-stone-600 text-sm sm:text-base mt-1">
              {{ lang.t().popularServicesDesc }}
            </p>
          </div>

          <a routerLink="/services" class="text-sm font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1">
            <span>{{ lang.t().allCategories }}</span>
            <mat-icon class="text-base">arrow_forward</mat-icon>
          </a>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          @for (cat of categories; track cat.key) {
            <button 
              type="button"
              (click)="goToSkill(cat.key)"
              class="bg-white hover:bg-amber-50/60 p-4 rounded-2xl border border-amber-200/70 shadow-2xs hover:shadow-md hover:border-amber-400 transition-all text-left flex flex-col items-start group cursor-pointer">
              
              <div class="w-12 h-12 rounded-xl {{ cat.bgClass }} {{ cat.colorClass }} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <mat-icon class="text-2xl">{{ cat.icon }}</mat-icon>
              </div>

              <span class="font-bold text-stone-900 text-sm sm:text-base leading-snug group-hover:text-amber-800 transition-colors">
                {{ lang.getSkillLabel(cat.key) }}
              </span>

              <span class="text-xs text-stone-500 mt-1 flex items-center gap-0.5">
                <span>{{ getSkillCount(cat.key) }} {{ lang.isTamil() ? 'நபர்கள்' : 'listed' }}</span>
              </span>
            </button>
          }
        </div>
      </section>

      <!-- Featured Providers Section -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-6 flex-wrap gap-2">
          <div>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Top Rated Local Service Providers
            </h2>
            <p class="text-stone-600 text-sm sm:text-base mt-1">
              Verified handymen & specialists trusted by fellow villagers
            </p>
          </div>

          <a routerLink="/services" class="text-sm font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1">
            <span>{{ lang.t().browseAll }}</span>
            <mat-icon class="text-base">arrow_forward</mat-icon>
          </a>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          @for (provider of topProviders(); track provider.id) {
            <div class="bg-white rounded-2xl border border-amber-200/80 shadow-xs hover:shadow-md transition-shadow p-5 flex flex-col justify-between">
              
              <div>
                <!-- Card Header -->
                <div class="flex items-start gap-3.5 mb-3.5">
                  <img 
                    [src]="provider.photoUrl" 
                    [alt]="provider.name" 
                    class="w-14 h-14 rounded-2xl object-cover border border-amber-200 shadow-2xs bg-amber-800 flex-shrink-0"
                    referrerpolicy="no-referrer"
                  />
                  <div class="flex-1 min-w-0">
                    <h3 class="font-bold text-stone-900 text-base leading-tight truncate">
                      {{ provider.name }}
                    </h3>
                    <div class="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md inline-block mt-1">
                      {{ lang.getSkillLabel(provider.skill, provider.customSkill) }}
                    </div>
                    <div class="flex items-center gap-1 text-xs text-stone-500 mt-1 truncate">
                      <mat-icon class="text-xs text-stone-400">location_on</mat-icon>
                      <span class="truncate">{{ provider.location }}</span>
                    </div>
                  </div>
                </div>

                <!-- Rating and Availability -->
                <div class="flex items-center justify-between py-2 border-t border-b border-stone-100 text-xs mb-3">
                  <div class="flex items-center gap-1 font-bold text-stone-800">
                    <mat-icon class="text-amber-500 text-base">star</mat-icon>
                    <span>{{ provider.averageRating > 0 ? provider.averageRating : 'New' }}</span>
                    <span class="text-stone-400 font-normal">({{ provider.totalReviews }})</span>
                  </div>

                  <div class="flex items-center gap-1 font-semibold text-stone-700">
                    <span class="w-2 h-2 rounded-full"
                      [class.bg-emerald-500]="provider.availability === 'now'"
                      [class.bg-amber-500]="provider.availability === 'today'"
                      [class.bg-blue-500]="provider.availability === 'this_week'">
                    </span>
                    <span>{{ lang.getAvailabilityLabel(provider.availability) }}</span>
                  </div>
                </div>

                <!-- Short Bio -->
                @if (provider.bio) {
                  <p class="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-4">
                    {{ provider.bio }}
                  </p>
                }
              </div>

              <!-- Card Action Buttons -->
              <div class="flex items-center gap-2 pt-2">
                <button 
                  type="button" 
                  (click)="selectedModalProvider.set(provider)"
                  class="flex-1 py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs sm:text-sm border border-amber-300 transition-colors text-center cursor-pointer">
                  {{ lang.t().viewReviews }}
                </button>

                <a 
                  [href]="'tel:' + provider.phone"
                  (click)="storage.logContact(provider.id)"
                  class="py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1 shadow-2xs transition-colors">
                  <mat-icon class="text-base">call</mat-icon>
                  <span>{{ lang.t().callNow }}</span>
                </a>
              </div>

            </div>
          }
        </div>
      </section>

      <!-- Provider Registration Callout Banner -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 rounded-3xl p-6 sm:p-10 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="space-y-2 text-center md:text-left max-w-2xl">
            <h3 class="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {{ lang.t().registerCtaTitle }}
            </h3>
            <p class="text-amber-100 text-sm sm:text-base leading-relaxed">
              {{ lang.t().registerCtaDesc }}
            </p>
          </div>

          <div class="flex flex-col sm:flex-row items-center gap-3 flex-shrink-0">
            <a 
              routerLink="/worker-login"
              id="home-banner-worker-login-btn"
              class="w-full sm:w-auto px-5 py-3.5 bg-amber-950/70 hover:bg-amber-950 text-amber-100 font-bold text-sm sm:text-base rounded-xl border border-amber-500/40 shadow-sm transition-transform active:scale-98 flex items-center justify-center gap-2">
              <mat-icon class="text-amber-300">badge</mat-icon>
              <span>{{ lang.t().workerLogin }}</span>
            </a>

            <a 
              routerLink="/register"
              id="home-banner-register-btn"
              class="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-amber-50 text-amber-900 font-bold text-base rounded-xl shadow-md transition-transform active:scale-98 flex items-center justify-center gap-2">
              <mat-icon class="text-amber-700">how_to_reg</mat-icon>
              <span>{{ lang.t().registerProvider }}</span>
            </a>
          </div>
        </div>
      </section>

    </div>

    <!-- Provider Detail & Review Modal -->
    @if (selectedModalProvider()) {
      <app-provider-detail-modal 
        [provider]="selectedModalProvider()" 
        (closeModal)="selectedModalProvider.set(null)">
      </app-provider-detail-modal>
    }
  `
})
export class HomeComponent {
  readonly lang = inject(LanguageService);
  readonly storage = inject(StorageService);
  private readonly router = inject(Router);

  readonly searchQuery = signal<string>('');
  readonly selectedModalProvider = signal<ProviderWithRating | null>(null);

  readonly categories: CategoryItem[] = [
    { key: 'Electrician', icon: 'electrical_services', colorClass: 'text-amber-700', bgClass: 'bg-amber-100' },
    { key: 'Plumber', icon: 'plumbing', colorClass: 'text-teal-700', bgClass: 'bg-teal-100' },
    { key: 'Tailor', icon: 'checkroom', colorClass: 'text-pink-700', bgClass: 'bg-pink-100' },
    { key: 'Tutor', icon: 'menu_book', colorClass: 'text-purple-700', bgClass: 'bg-purple-100' },
    { key: 'Carpenter', icon: 'carpenter', colorClass: 'text-yellow-800', bgClass: 'bg-yellow-100' },
    { key: 'Auto Driver', icon: 'local_taxi', colorClass: 'text-orange-700', bgClass: 'bg-orange-100' },
    { key: 'Mason', icon: 'foundation', colorClass: 'text-stone-700', bgClass: 'bg-stone-200' },
    { key: 'Painter', icon: 'format_paint', colorClass: 'text-emerald-700', bgClass: 'bg-emerald-100' },
    { key: 'Appliance Repair', icon: 'home_repair_service', colorClass: 'text-indigo-700', bgClass: 'bg-indigo-100' },
    { key: 'Other', icon: 'more_horiz', colorClass: 'text-blue-700', bgClass: 'bg-blue-100' },
  ];

  getSkillCount(skill: SkillType): number {
    return this.storage.approvedProvidersWithRatings().filter(p => p.skill === skill).length;
  }

  topProviders(): ProviderWithRating[] {
    return this.storage.approvedProvidersWithRatings().slice(0, 6);
  }

  onSearchSubmit(event: Event) {
    event.preventDefault();
    const query = this.searchQuery().trim();
    if (query) {
      this.router.navigate(['/services'], { queryParams: { q: query } });
    } else {
      this.router.navigate(['/services']);
    }
  }

  goToSkill(skill: SkillType) {
    this.router.navigate(['/services'], { queryParams: { skill } });
  }
}
