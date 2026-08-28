import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { LanguageService } from '../../services/language';
import { StorageService } from '../../services/storage';
import { SkillType, ProviderWithRating } from '../../models/provider.model';
import { ProviderDetailModalComponent } from '../provider-detail-modal/provider-detail-modal';

@Component({
  selector: 'app-directory',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MatIconModule, ProviderDetailModalComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      
      <!-- Page Header -->
      <div class="space-y-1.5">
        <h1 class="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          {{ lang.t().directoryTitle }}
        </h1>
        <p class="text-sm sm:text-base text-stone-600">
          {{ lang.t().directoryDesc }}
        </p>
      </div>

      <!-- Search & Filters Container -->
      <div class="bg-white p-4 sm:p-5 rounded-2xl border border-amber-200/90 shadow-sm space-y-4">
        
        <!-- Search Input Bar -->
        <div class="relative">
          <mat-icon class="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400">search</mat-icon>
          <input 
            type="text" 
            [value]="searchTerm()" 
            (input)="searchTerm.set($any($event.target).value)"
            [placeholder]="lang.t().searchPlaceholder"
            id="directory-search-input"
            class="w-full pl-11 pr-10 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-stone-900 placeholder:text-stone-400 text-sm sm:text-base bg-amber-50/20"
          />
          @if (searchTerm()) {
            <button 
              type="button" 
              (click)="searchTerm.set('')"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1">
              <mat-icon class="text-xl">clear</mat-icon>
            </button>
          }
        </div>

        <!-- Filter Dropdowns & Pills -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          <!-- Skill Filter Dropdown -->
          <div>
            <label for="skill-filter-select" class="block text-xs font-bold text-stone-700 mb-1">
              {{ lang.t().filterBySkill }}
            </label>
            <select 
              id="skill-filter-select"
              [value]="selectedSkill()" 
              (change)="selectedSkill.set($any($event.target).value)"
              class="w-full px-3 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500">
              <option value="">{{ lang.t().allSkills }} ({{ storage.approvedProvidersWithRatings().length }})</option>
              @for (sk of allSkillKeys; track sk) {
                <option [value]="sk">{{ lang.getSkillLabel(sk) }}</option>
              }
            </select>
          </div>

          <!-- Location Filter Dropdown -->
          <div>
            <label for="location-filter-select" class="block text-xs font-bold text-stone-700 mb-1">
              {{ lang.t().filterByLocation }}
            </label>
            <select 
              id="location-filter-select"
              [value]="selectedLocation()" 
              (change)="selectedLocation.set($any($event.target).value)"
              class="w-full px-3 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500">
              <option value="">{{ lang.t().allLocations }}</option>
              @for (loc of storage.distinctLocations(); track loc) {
                <option [value]="loc">{{ loc }}</option>
              }
            </select>
          </div>

          <!-- Availability Filter Dropdown -->
          <div>
            <label for="availability-filter-select" class="block text-xs font-bold text-stone-700 mb-1">
              {{ lang.t().filterByAvailability }}
            </label>
            <select 
              id="availability-filter-select"
              [value]="selectedAvailability()" 
              (change)="selectedAvailability.set($any($event.target).value)"
              class="w-full px-3 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500">
              <option value="">{{ lang.t().allAvailabilities }}</option>
              <option value="now">⚡ {{ lang.getAvailabilityLabel('now') }}</option>
              <option value="today">📅 {{ lang.getAvailabilityLabel('today') }}</option>
              <option value="this_week">🗓️ {{ lang.getAvailabilityLabel('this_week') }}</option>
            </select>
          </div>

          <!-- Sort Order Dropdown -->
          <div>
            <label for="sort-select" class="block text-xs font-bold text-stone-700 mb-1">
              {{ lang.t().sortBy }}
            </label>
            <select 
              id="sort-select"
              [value]="selectedSort()" 
              (change)="selectedSort.set($any($event.target).value)"
              class="w-full px-3 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500">
              <option value="rating">{{ lang.t().sortHighestRated }}</option>
              <option value="reviews">{{ lang.t().sortMostReviews }}</option>
              <option value="newest">{{ lang.t().sortNewest }}</option>
            </select>
          </div>

        </div>

        <!-- Active Filter Pills & Reset Button -->
        @if (hasActiveFilters()) {
          <div class="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-stone-200 text-xs">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="font-semibold text-stone-500">Active filters:</span>
              
              @if (searchTerm()) {
                <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 font-medium">
                  "{{ searchTerm() }}"
                  <button (click)="searchTerm.set('')" class="hover:text-amber-700"><mat-icon class="text-xs">close</mat-icon></button>
                </span>
              }

              @if (selectedSkill()) {
                <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 font-medium">
                  {{ lang.getSkillLabel($any(selectedSkill())) }}
                  <button (click)="selectedSkill.set('')" class="hover:text-amber-700"><mat-icon class="text-xs">close</mat-icon></button>
                </span>
              }

              @if (selectedLocation()) {
                <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 font-medium">
                  {{ selectedLocation() }}
                  <button (click)="selectedLocation.set('')" class="hover:text-amber-700"><mat-icon class="text-xs">close</mat-icon></button>
                </span>
              }

              @if (selectedAvailability()) {
                <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 font-medium">
                  {{ lang.getAvailabilityLabel($any(selectedAvailability())) }}
                  <button (click)="selectedAvailability.set('')" class="hover:text-amber-700"><mat-icon class="text-xs">close</mat-icon></button>
                </span>
              }
            </div>

            <button 
              type="button" 
              (click)="resetAllFilters()"
              id="reset-filters-btn"
              class="text-amber-800 hover:text-amber-900 font-bold flex items-center gap-1 underline cursor-pointer">
              <mat-icon class="text-sm">restart_alt</mat-icon>
              <span>{{ lang.t().resetFilters }}</span>
            </button>
          </div>
        }

      </div>

      <!-- Results Count & Status Header -->
      <div class="flex items-center justify-between text-sm font-semibold text-stone-700 px-1">
        <div>
          <span class="text-amber-900 font-extrabold text-base">{{ filteredProviders().length }}</span> {{ lang.t().resultsCount }}
        </div>
      </div>

      <!-- Providers Cards Grid -->
      @if (filteredProviders().length > 0) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          @for (provider of filteredProviders(); track provider.id) {
            <div 
              class="bg-white rounded-2xl border border-amber-200/90 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between"
              [id]="'provider-card-' + provider.id">
              
              <div class="space-y-3.5">
                
                <!-- Provider Top Meta -->
                <div class="flex items-start gap-3.5">
                  <img 
                    [src]="provider.photoUrl" 
                    [alt]="provider.name" 
                    class="w-16 h-16 rounded-2xl object-cover border-2 border-amber-200 shadow-xs bg-amber-800 flex-shrink-0"
                    referrerpolicy="no-referrer"
                  />
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-1.5 flex-wrap">
                      <h3 class="font-bold text-stone-900 text-lg leading-tight truncate">
                        {{ provider.name }}
                      </h3>
                    </div>

                    <!-- Skill Tag -->
                    <div class="mt-1">
                      <span class="inline-block px-2.5 py-0.5 rounded-lg bg-amber-100/90 text-amber-950 text-xs font-bold border border-amber-300/60">
                        {{ lang.getSkillLabel(provider.skill, provider.customSkill) }}
                      </span>
                    </div>

                    <!-- Location with pin icon -->
                    <div class="flex items-center gap-1 text-xs text-stone-600 font-medium mt-1">
                      <mat-icon class="text-xs text-amber-700">location_on</mat-icon>
                      <span class="truncate">{{ provider.location }}</span>
                    </div>
                  </div>
                </div>

                <!-- Rating & Availability Badges Row -->
                <div class="flex items-center justify-between py-2.5 px-3 bg-amber-50/50 rounded-xl border border-amber-200/50 text-xs">
                  
                  <!-- Star Rating -->
                  <div class="flex items-center gap-1 font-bold text-stone-900">
                    <mat-icon class="text-amber-500 text-base">star</mat-icon>
                    <span>{{ provider.averageRating > 0 ? provider.averageRating : 'New' }}</span>
                    <span class="text-stone-400 font-normal text-[11px]">({{ provider.totalReviews }} {{ lang.t().reviewsCount }})</span>
                  </div>

                  <!-- Availability Badge -->
                  <div class="flex items-center gap-1.5 font-bold text-stone-800">
                    <span class="w-2.5 h-2.5 rounded-full"
                      [class.bg-emerald-500]="provider.availability === 'now'"
                      [class.bg-amber-500]="provider.availability === 'today'"
                      [class.bg-blue-500]="provider.availability === 'this_week'">
                    </span>
                    <span>{{ lang.getAvailabilityLabel(provider.availability) }}</span>
                  </div>
                </div>

                <!-- Bio or Experience summary -->
                @if (provider.bio) {
                  <p class="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {{ provider.bio }}
                  </p>
                }
              </div>

              <!-- Contact Revelation & Action Buttons -->
              <div class="mt-4 pt-3 border-t border-stone-100 space-y-2.5">
                
                <!-- Contact Number Box (Toggled on click) -->
                @if (isContactRevealed(provider.id)) {
                  <div class="bg-emerald-50 border border-emerald-300 rounded-xl p-3 space-y-2 animate-in fade-in duration-150">
                    <div class="flex items-center justify-between text-xs text-emerald-900 font-bold">
                      <span>Phone / WhatsApp:</span>
                      <button 
                        type="button" 
                        (click)="toggleContact(provider.id)"
                        class="text-stone-500 hover:text-stone-700 text-[11px] underline">
                        {{ lang.t().hideContact }}
                      </button>
                    </div>

                    <div class="flex items-center justify-between gap-2">
                      <span class="text-base font-extrabold text-stone-900 tracking-wide font-mono">
                        {{ provider.phone }}
                      </span>
                    </div>

                    <div class="grid grid-cols-2 gap-2 pt-1">
                      <a 
                        [href]="'tel:' + provider.phone"
                        (click)="storage.logContact(provider.id)"
                        class="inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow-2xs">
                        <mat-icon class="text-base">call</mat-icon>
                        <span>{{ lang.t().callNow }}</span>
                      </a>

                      <a 
                        [href]="'https://wa.me/91' + cleanPhone(provider.phone) + '?text=' + getWhatsAppMessage(provider)"
                        target="_blank"
                        rel="noopener noreferrer"
                        (click)="storage.logContact(provider.id)"
                        class="inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs rounded-lg shadow-2xs">
                        <mat-icon class="text-base">chat</mat-icon>
                        <span>{{ lang.t().whatsapp }}</span>
                      </a>
                    </div>
                  </div>
                } @else {
                  <!-- Reveal Contact Button -->
                  <button 
                    type="button" 
                    (click)="toggleContact(provider.id)"
                    [id]="'reveal-contact-btn-' + provider.id"
                    class="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-98">
                    <mat-icon class="text-lg">call</mat-icon>
                    <span>{{ lang.t().showContact }}</span>
                  </button>
                }

                <!-- View Reviews & Details Button -->
                <button 
                  type="button" 
                  (click)="selectedModalProvider.set(provider)"
                  [id]="'view-details-btn-' + provider.id"
                  class="w-full py-2 px-4 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs sm:text-sm rounded-xl border border-amber-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                  <mat-icon class="text-base text-amber-700">rate_review</mat-icon>
                  <span>{{ lang.t().viewReviews }} &amp; {{ lang.t().writeReview }}</span>
                </button>

              </div>

            </div>
          }
        </div>
      } @else {
        <!-- Friendly Empty State -->
        <div class="bg-white rounded-3xl border border-amber-200 p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-4 shadow-sm">
          <div class="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
            <mat-icon class="text-3xl">search_off</mat-icon>
          </div>
          
          <h3 class="text-xl sm:text-2xl font-bold text-stone-900">
            {{ lang.t().noResultsTitle }}
          </h3>
          
          <p class="text-stone-600 text-sm sm:text-base leading-relaxed">
            {{ lang.t().noResultsDesc }}
          </p>

          <div class="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button 
              type="button" 
              (click)="resetAllFilters()"
              id="empty-reset-btn"
              class="px-5 py-2.5 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer">
              {{ lang.t().resetFilters }}
            </button>

            <a 
              routerLink="/register" 
              class="px-5 py-2.5 bg-white hover:bg-amber-50 text-amber-900 font-bold rounded-xl border border-amber-300 text-sm transition-colors">
              {{ lang.t().registerProvider }}
            </a>
          </div>
        </div>
      }

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
export class DirectoryComponent implements OnInit {
  readonly lang = inject(LanguageService);
  readonly storage = inject(StorageService);
  private readonly route = inject(ActivatedRoute);

  readonly searchTerm = signal<string>('');
  readonly selectedSkill = signal<string>('');
  readonly selectedLocation = signal<string>('');
  readonly selectedAvailability = signal<string>('');
  readonly selectedSort = signal<string>('rating'); // 'rating' | 'reviews' | 'newest'

  readonly revealedContacts = signal<Record<string, boolean>>({});
  readonly selectedModalProvider = signal<ProviderWithRating | null>(null);

  readonly allSkillKeys: SkillType[] = [
    'Electrician',
    'Plumber',
    'Tailor',
    'Tutor',
    'Carpenter',
    'Auto Driver',
    'Mason',
    'Painter',
    'Appliance Repair',
    'Other'
  ];

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.searchTerm.set(params['q']);
      }
      if (params['skill']) {
        this.selectedSkill.set(params['skill']);
      }
      if (params['location']) {
        this.selectedLocation.set(params['location']);
      }
    });
  }

  hasActiveFilters = computed<boolean>(() => {
    return Boolean(
      this.searchTerm() || 
      this.selectedSkill() || 
      this.selectedLocation() || 
      this.selectedAvailability()
    );
  });

  filteredProviders = computed<ProviderWithRating[]>(() => {
    const list = this.storage.approvedProvidersWithRatings();
    const query = this.searchTerm().trim().toLowerCase();
    const skill = this.selectedSkill();
    const loc = this.selectedLocation();
    const avail = this.selectedAvailability();
    const sort = this.selectedSort();

    let filtered = list.filter(provider => {
      // 1. Skill Match
      if (skill && provider.skill !== skill) {
        return false;
      }

      // 2. Location Match
      if (loc && provider.location.toLowerCase() !== loc.toLowerCase()) {
        return false;
      }

      // 3. Availability Match
      if (avail && provider.availability !== avail) {
        return false;
      }

      // 4. Search query (matches name, skill, location, bio, customSkill)
      if (query) {
        const nameMatch = provider.name.toLowerCase().includes(query);
        const skillMatch = provider.skill.toLowerCase().includes(query) || (provider.customSkill && provider.customSkill.toLowerCase().includes(query));
        const locMatch = provider.location.toLowerCase().includes(query);
        const bioMatch = provider.bio ? provider.bio.toLowerCase().includes(query) : false;
        
        // Also match Tamil translations if present
        const tamilSkill = this.lang.getSkillLabel(provider.skill).toLowerCase();
        const tamilSkillMatch = tamilSkill.includes(query);

        if (!nameMatch && !skillMatch && !locMatch && !bioMatch && !tamilSkillMatch) {
          return false;
        }
      }

      return true;
    });

    // Sort results
    if (sort === 'rating') {
      filtered = [...filtered].sort((a, b) => b.averageRating - a.averageRating || b.totalReviews - a.totalReviews);
    } else if (sort === 'reviews') {
      filtered = [...filtered].sort((a, b) => b.totalReviews - a.totalReviews || b.averageRating - a.averageRating);
    } else if (sort === 'newest') {
      filtered = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return filtered;
  });

  toggleContact(providerId: string) {
    const current = this.revealedContacts();
    const isNowRevealed = !current[providerId];
    this.revealedContacts.set({
      ...current,
      [providerId]: isNowRevealed
    });

    if (isNowRevealed) {
      this.storage.logContact(providerId);
    }
  }

  isContactRevealed(providerId: string): boolean {
    return Boolean(this.revealedContacts()[providerId]);
  }

  resetAllFilters() {
    this.searchTerm.set('');
    this.selectedSkill.set('');
    this.selectedLocation.set('');
    this.selectedAvailability.set('');
    this.selectedSort.set('rating');
  }

  cleanPhone(phone: string): string {
    return phone.replace(/\D/g, '').slice(-10);
  }

  getWhatsAppMessage(prov: ProviderWithRating): string {
    const text = `வணக்கம் ${prov.name}, நான் LocalConnect செயலி மூலம் உங்களை தொடர்பு கொள்கிறேன். உங்கள் ${prov.skill} சேவை எனக்கு தேவைப்படுகிறது.`;
    return encodeURIComponent(text);
  }
}
