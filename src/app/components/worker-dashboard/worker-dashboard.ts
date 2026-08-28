import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { LanguageService } from '../../services/language';
import { StorageService } from '../../services/storage';
import { AvailabilityType, Provider, Review, SkillType } from '../../models/provider.model';

@Component({
  selector: 'app-worker-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, DatePipe, RouterLink, MatIconModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
      
      <!-- Top Navigation & Action Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-amber-200/90 shadow-sm">
        
        <div class="flex items-center gap-3.5">
          <div class="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-xs shadow-amber-600/30">
            <mat-icon class="text-2xl">account_circle</mat-icon>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
                {{ lang.t().myDashboard }}
              </h1>
              <!-- Profile Status Badge -->
              @if (provider()) {
                <span 
                  [class]="getStatusBadgeClass(provider()!.status)"
                  class="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase tracking-wider border">
                  {{ getStatusText(provider()!.status) }}
                </span>
              }
            </div>
            <p class="text-xs sm:text-sm text-stone-600">
              {{ lang.t().workerLoginSubtitle }}
            </p>
          </div>
        </div>

        <!-- Action Buttons: Public Directory Link & Logout -->
        <div class="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-start sm:justify-end">
          <a 
            routerLink="/services"
            id="worker-view-public-btn"
            class="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs rounded-xl border border-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer">
            <mat-icon class="text-base text-amber-700">storefront</mat-icon>
            <span>{{ lang.t().viewPublicCard }}</span>
          </a>

          <button 
            type="button" 
            (click)="logout()"
            id="worker-logout-btn"
            class="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition-colors flex items-center gap-1.5 cursor-pointer">
            <mat-icon class="text-base">logout</mat-icon>
            <span>{{ lang.t().workerLogout }}</span>
          </button>
        </div>

      </div>

      <!-- Action Toast Notification -->
      @if (actionToast()) {
        <div class="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs sm:text-sm font-bold flex items-center gap-2.5 shadow-2xs animate-in fade-in">
          <mat-icon class="text-emerald-600 text-xl shrink-0">check_circle</mat-icon>
          <span>{{ actionToast() }}</span>
        </div>
      }

      @if (provider()) {
        <!-- Status Notices (Pending or Rejected) -->
        @if (provider()!.status === 'pending') {
          <div class="p-4 bg-amber-50 border-2 border-amber-300 rounded-3xl flex items-start gap-3 text-amber-900">
            <mat-icon class="text-amber-700 text-2xl shrink-0 mt-0.5">hourglass_top</mat-icon>
            <div class="text-xs sm:text-sm space-y-1">
              <p class="font-bold">{{ lang.t().pendingStatus }}</p>
              <p class="text-stone-600">{{ lang.t().pendingNotice }}</p>
            </div>
          </div>
        } @else if (provider()!.status === 'rejected') {
          <div class="p-4 bg-rose-50 border-2 border-rose-300 rounded-3xl flex items-start gap-3 text-rose-900">
            <mat-icon class="text-rose-700 text-2xl shrink-0 mt-0.5">block</mat-icon>
            <div class="text-xs sm:text-sm space-y-1">
              <p class="font-bold">{{ lang.t().rejectedStatus }}</p>
              <p class="text-stone-600">{{ lang.t().rejectedNotice }}</p>
            </div>
          </div>
        }

        <!-- 1. STATS ROW (Requested by User) -->
        <!-- Total Reviews Received, Average Rating, Profile Status, Direct Inquiries -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          
          <!-- Stat 1: Total Reviews -->
          <div class="bg-white p-4 sm:p-5 rounded-2xl border border-amber-200/90 shadow-2xs space-y-1">
            <div class="flex items-center justify-between text-amber-800">
              <span class="text-xs font-bold uppercase tracking-wider text-stone-500">{{ lang.t().totalReviewsReceived }}</span>
              <mat-icon class="text-lg">rate_review</mat-icon>
            </div>
            <p class="text-2xl sm:text-3xl font-extrabold text-stone-900">
              {{ provider()!.totalReviews }}
            </p>
            <p class="text-2xs text-stone-500">From local residents</p>
          </div>

          <!-- Stat 2: Average Rating -->
          <div class="bg-white p-4 sm:p-5 rounded-2xl border border-amber-200/90 shadow-2xs space-y-1">
            <div class="flex items-center justify-between text-amber-800">
              <span class="text-xs font-bold uppercase tracking-wider text-stone-500">{{ lang.t().averageRating }}</span>
              <mat-icon class="text-lg text-amber-500">star</mat-icon>
            </div>
            <div class="flex items-baseline gap-1.5">
              <p class="text-2xl sm:text-3xl font-extrabold text-stone-900">
                {{ provider()!.averageRating > 0 ? provider()!.averageRating : '—' }}
              </p>
              <span class="text-xs text-stone-400 font-semibold">/ 5.0</span>
            </div>
            <div class="flex items-center gap-0.5 text-amber-500 text-xs">
              @for (star of [1, 2, 3, 4, 5]; track star) {
                <mat-icon class="text-xs">
                  {{ star <= provider()!.averageRating ? 'star' : (star - 0.5 <= provider()!.averageRating ? 'star_half' : 'star_border') }}
                </mat-icon>
              }
            </div>
          </div>

          <!-- Stat 3: Profile Status & Visibility -->
          <div class="bg-white p-4 sm:p-5 rounded-2xl border border-amber-200/90 shadow-2xs space-y-1">
            <div class="flex items-center justify-between text-amber-800">
              <span class="text-xs font-bold uppercase tracking-wider text-stone-500">{{ lang.t().profileStatus }}</span>
              <mat-icon class="text-lg">verified_user</mat-icon>
            </div>
            <p class="text-base sm:text-lg font-bold text-stone-900 truncate">
              @if (provider()!.status !== 'approved') {
                {{ getStatusText(provider()!.status) }}
              } @else if (provider()!.isAvailableRightNow !== false) {
                <span class="text-emerald-700">Active & Live</span>
              } @else {
                <span class="text-stone-500">Paused / Off</span>
              }
            </p>
            <p class="text-2xs text-stone-500">
              {{ provider()!.isAvailableRightNow !== false ? 'Shown in public search' : 'Hidden from search' }}
            </p>
          </div>

          <!-- Stat 4: Direct Inquiries -->
          <div class="bg-white p-4 sm:p-5 rounded-2xl border border-amber-200/90 shadow-2xs space-y-1">
            <div class="flex items-center justify-between text-amber-800">
              <span class="text-xs font-bold uppercase tracking-wider text-stone-500">{{ lang.t().directInquiries }}</span>
              <mat-icon class="text-lg">phone_in_talk</mat-icon>
            </div>
            <p class="text-2xl sm:text-3xl font-extrabold text-stone-900">
              {{ provider()!.contactCount || 0 }}
            </p>
            <p class="text-2xs text-stone-500">Direct phone/WhatsApp taps</p>
          </div>

        </div>

        <!-- 2. VISIBILITY TOGGLE BANNER (Requested by User) -->
        <!-- Switch between "Available" / "Not Available Right Now" — when off, hide from public search even if approved -->
        <div 
          [class]="provider()!.isAvailableRightNow !== false ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300' : 'bg-gradient-to-r from-stone-100 to-amber-50 border-stone-300'"
          class="p-5 sm:p-6 rounded-3xl border-2 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors">
          
          <div class="flex items-start sm:items-center gap-3.5">
            <div 
              [class]="provider()!.isAvailableRightNow !== false ? 'bg-emerald-600 text-white' : 'bg-stone-400 text-white'"
              class="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs transition-colors">
              <mat-icon class="text-2xl">
                {{ provider()!.isAvailableRightNow !== false ? 'visibility' : 'visibility_off' }}
              </mat-icon>
            </div>
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-xs font-extrabold uppercase tracking-wider text-stone-500">
                  {{ lang.t().visibilityStatus }}
                </span>
                <span 
                  [class]="provider()!.isAvailableRightNow !== false ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-stone-200 text-stone-800 border-stone-300'"
                  class="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase tracking-wider border">
                  {{ provider()!.isAvailableRightNow !== false ? lang.t().statusAvailable : lang.t().statusNotAvailable }}
                </span>
              </div>
              <h2 class="text-lg sm:text-xl font-extrabold text-stone-900 mt-0.5">
                {{ provider()!.isAvailableRightNow !== false ? lang.t().visibleInDirectory : lang.t().hiddenFromDirectory }}
              </h2>
              <p class="text-xs text-stone-600 max-w-xl mt-0.5">
                {{ lang.t().visibilityHelp }}
              </p>
            </div>
          </div>

          <!-- Switch Toggle Button -->
          <div class="flex items-center gap-3 shrink-0 self-end md:self-center">
            <button 
              type="button"
              (click)="onToggleVisibility()"
              id="worker-visibility-toggle-btn"
              [class]="provider()!.isAvailableRightNow !== false ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30' : 'bg-stone-800 hover:bg-stone-900 text-white shadow-stone-800/30'"
              class="px-5 py-3 rounded-2xl font-extrabold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95">
              <mat-icon class="text-lg">
                {{ provider()!.isAvailableRightNow !== false ? 'toggle_on' : 'toggle_off' }}
              </mat-icon>
              <span>
                {{ provider()!.isAvailableRightNow !== false ? lang.t().statusAvailable : lang.t().statusNotAvailable }}
              </span>
            </button>
          </div>

        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <!-- LEFT COLUMN: Profile Summary Card & Profile Edit (8 cols) -->
          <div class="lg:col-span-7 space-y-6">
            
            <!-- 3. PROFILE SUMMARY CARD (Requested by User) -->
            <!-- provider's name, photo, skill, location, approval status badge, average rating with total review count -->
            <div class="bg-white rounded-3xl border border-amber-200/90 shadow-sm p-6 space-y-5">
              
              <div class="flex items-center justify-between pb-3 border-b border-amber-100">
                <div class="flex items-center gap-2">
                  <mat-icon class="text-amber-700">badge</mat-icon>
                  <h2 class="text-lg font-extrabold text-stone-900">{{ lang.t().profileSummary }}</h2>
                </div>
                <span class="text-xs text-stone-400 font-semibold">ID: {{ provider()!.id }}</span>
              </div>

              <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <img 
                  [src]="provider()!.photoUrl" 
                  [alt]="provider()!.name" 
                  class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-amber-200 shadow-sm shrink-0 bg-stone-100"
                  referrerpolicy="no-referrer"
                />
                <div class="space-y-1.5 min-w-0 flex-1">
                  <div class="flex items-center gap-2 flex-wrap">
                    <h3 class="text-lg sm:text-xl font-black text-stone-900 leading-tight">
                      {{ provider()!.name }}
                    </h3>
                    <span 
                      [class]="getStatusBadgeClass(provider()!.status)"
                      class="px-2 py-0.5 rounded-full text-2xs font-extrabold uppercase border">
                      {{ getStatusText(provider()!.status) }}
                    </span>
                  </div>

                  <div class="flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-900 flex-wrap">
                    <span class="px-2.5 py-1 bg-amber-100/80 rounded-lg border border-amber-200 flex items-center gap-1">
                      <mat-icon class="text-xs">build</mat-icon>
                      {{ lang.getSkillLabel(provider()!.skill, provider()!.customSkill) }}
                    </span>
                    <span class="px-2.5 py-1 bg-stone-100 rounded-lg border border-stone-200 text-stone-700 flex items-center gap-1">
                      <mat-icon class="text-xs">place</mat-icon>
                      {{ provider()!.location }}
                    </span>
                  </div>

                  <!-- Phone & Rating summary -->
                  <div class="flex items-center gap-3 pt-1 text-xs text-stone-600 flex-wrap">
                    <span class="flex items-center gap-1 font-mono font-bold text-stone-800">
                      <mat-icon class="text-xs text-amber-700">call</mat-icon>
                      +91 {{ provider()!.phone }}
                    </span>
                    <span>•</span>
                    <span class="flex items-center gap-1 font-bold text-amber-900">
                      <mat-icon class="text-xs text-amber-500">star</mat-icon>
                      {{ provider()!.averageRating > 0 ? provider()!.averageRating + ' (' + provider()!.totalReviews + ' ' + lang.t().reviewsCount + ')' : lang.t().noReviewsYet }}
                    </span>
                  </div>

                  @if (provider()!.bio) {
                    <p class="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-200/70 italic mt-2">
                      "{{ provider()!.bio }}"
                    </p>
                  }
                </div>
              </div>

            </div>

            <!-- 4. PROFILE EDIT FORM (Requested by User) -->
            <!-- update phone number, availability, and location — auto-saves without needing re-approval -->
            <div class="bg-white rounded-3xl border border-amber-200/90 shadow-sm p-6 space-y-5">
              
              <div class="flex items-center justify-between pb-3 border-b border-amber-100">
                <div class="flex items-center gap-2">
                  <mat-icon class="text-amber-700">edit_note</mat-icon>
                  <div>
                    <h2 class="text-lg font-extrabold text-stone-900">{{ lang.t().editProfileTitle }}</h2>
                    <p class="text-2xs sm:text-xs text-stone-500">{{ lang.t().editProfileSubtitle }}</p>
                  </div>
                </div>
              </div>

              <form [formGroup]="editForm" (ngSubmit)="onSaveProfile()" class="space-y-4">
                
                <!-- Full Name & Primary Skill (Display/Editable) -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label for="editNameInput" class="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      {{ lang.t().fullName }} <span class="text-rose-600">*</span>
                    </label>
                    <input 
                      id="editNameInput"
                      type="text" 
                      formControlName="name"
                      class="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-stone-900 text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label for="editPhoneInput" class="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      {{ lang.t().phoneNumber }} <span class="text-rose-600">*</span>
                    </label>
                    <input 
                      id="editPhoneInput"
                      type="tel" 
                      formControlName="phone"
                      placeholder="10-digit mobile number"
                      class="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-stone-900 text-sm font-medium"
                    />
                  </div>
                </div>

                <!-- Location & Availability -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label for="editLocationInput" class="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      {{ lang.t().villageLocation }} <span class="text-rose-600">*</span>
                    </label>
                    <input 
                      id="editLocationInput"
                      type="text" 
                      formControlName="location"
                      placeholder="e.g. Pollachi / Tenkasi"
                      class="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-stone-900 text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label for="editAvailabilitySelect" class="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      {{ lang.t().availabilityOption }} <span class="text-rose-600">*</span>
                    </label>
                    <select 
                      id="editAvailabilitySelect"
                      formControlName="availability"
                      class="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-stone-900 text-sm font-medium bg-white">
                      <option value="now">{{ lang.getAvailabilityLabel('now') }}</option>
                      <option value="today">{{ lang.getAvailabilityLabel('today') }}</option>
                      <option value="this_week">{{ lang.getAvailabilityLabel('this_week') }}</option>
                    </select>
                  </div>
                </div>

                <!-- Experience & Skill Selector -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label for="editSkillSelect" class="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      {{ lang.t().skillLabel }}
                    </label>
                    <select 
                      id="editSkillSelect"
                      formControlName="skill"
                      class="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-stone-900 text-sm font-medium bg-white">
                      @for (s of availableSkills; track s) {
                        <option [value]="s">{{ lang.getSkillLabel(s) }}</option>
                      }
                    </select>
                  </div>

                  <div>
                    <label for="editExperienceInput" class="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      {{ lang.t().experienceYears }}
                    </label>
                    <input 
                      id="editExperienceInput"
                      type="number" 
                      formControlName="experienceYears"
                      min="0"
                      max="60"
                      class="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-stone-900 text-sm font-medium"
                    />
                  </div>
                </div>

                <!-- Bio / Notes -->
                <div>
                  <label for="editBioTextarea" class="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    {{ lang.t().bioLabel }}
                  </label>
                  <textarea 
                    id="editBioTextarea"
                    formControlName="bio"
                    rows="3"
                    [placeholder]="lang.t().bioPlaceholder"
                    class="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-stone-900 text-sm font-medium"
                  ></textarea>
                </div>

                <!-- Save Button -->
                <div class="pt-2 flex items-center justify-between">
                  <span class="text-2xs text-stone-500 font-semibold">
                    * Instant updates saved locally
                  </span>

                  <button 
                    type="submit"
                    id="worker-save-profile-btn"
                    [disabled]="editForm.invalid || isSaving()"
                    class="px-6 py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-stone-200 disabled:text-stone-400 text-white font-extrabold text-sm rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed">
                    @if (isSaving()) {
                      <mat-icon class="animate-spin text-base">autorenew</mat-icon>
                      <span>{{ lang.t().savingChanges }}</span>
                    } @else {
                      <mat-icon class="text-base">save</mat-icon>
                      <span>{{ lang.t().saveChanges }}</span>
                    }
                  </button>
                </div>

              </form>

            </div>

          </div>

          <!-- RIGHT COLUMN: 5. MY REVIEWS SECTION (Requested by User) (5 cols) -->
          <!-- list of all reviews received, star rating + comment + date, most recent first -->
          <div class="lg:col-span-5 space-y-6">
            
            <div class="bg-white rounded-3xl border border-amber-200/90 shadow-sm p-6 space-y-4">
              
              <div class="flex items-center justify-between pb-3 border-b border-amber-100">
                <div class="flex items-center gap-2">
                  <mat-icon class="text-amber-700">reviews</mat-icon>
                  <h2 class="text-lg font-extrabold text-stone-900">{{ lang.t().myReviewsTitle }}</h2>
                </div>
                <span class="px-2.5 py-1 bg-amber-100 text-amber-900 font-extrabold text-xs rounded-full">
                  {{ reviews().length }}
                </span>
              </div>

              @if (reviews().length === 0) {
                <div class="py-10 text-center space-y-3 px-4">
                  <div class="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto border border-amber-200">
                    <mat-icon class="text-2xl">sentiment_satisfied</mat-icon>
                  </div>
                  <p class="text-sm font-bold text-stone-700">
                    {{ lang.t().noReviewsYet }}
                  </p>
                  <p class="text-xs text-stone-500 leading-relaxed max-w-xs mx-auto">
                    {{ lang.t().noReviewsForWorker }}
                  </p>
                </div>
              } @else {
                <div class="space-y-3.5 max-h-[600px] overflow-y-auto pr-1">
                  @for (rev of reviews(); track rev.id) {
                    <div class="p-4 bg-stone-50/80 rounded-2xl border border-stone-200 space-y-2 hover:border-amber-200 transition-colors">
                      
                      <!-- Header: Reviewer name & Date -->
                      <div class="flex items-start justify-between gap-2">
                        <div>
                          <p class="text-xs font-bold text-stone-900">{{ rev.reviewerName }}</p>
                          @if (rev.reviewerLocation) {
                            <p class="text-2xs text-stone-500 flex items-center gap-0.5">
                              <mat-icon class="text-xs text-stone-400">place</mat-icon>
                              {{ rev.reviewerLocation }}
                            </p>
                          }
                        </div>

                        <!-- Star Rating Pill -->
                        <div class="flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-900 rounded-lg text-2xs font-extrabold shrink-0">
                          <mat-icon class="text-xs text-amber-600">star</mat-icon>
                          <span>{{ rev.rating }}.0</span>
                        </div>
                      </div>

                      <!-- Review Comment -->
                      @if (rev.comment) {
                        <p class="text-xs text-stone-700 leading-relaxed">
                          "{{ rev.comment }}"
                        </p>
                      }

                      <!-- Date stamp (most recent first) -->
                      <div class="flex items-center justify-end text-2xs text-stone-400 pt-1 border-t border-stone-200/60">
                        <span>{{ rev.createdAt | date:'mediumDate' }}</span>
                      </div>

                    </div>
                  }
                </div>
              }

            </div>

          </div>

        </div>

      }

    </div>
  `
})
export class WorkerDashboardComponent {
  readonly lang = inject(LanguageService);
  readonly storage = inject(StorageService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly actionToast = signal<string | null>(null);
  readonly isSaving = signal<boolean>(false);

  readonly availableSkills: SkillType[] = [
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

  // Provider and reviews computed
  readonly provider = computed(() => this.storage.loggedInProvider());
  readonly reviews = computed<Review[]>(() => {
    const prov = this.provider();
    if (!prov) return [];
    return this.storage.getReviewsForProvider(prov.id);
  });

  readonly editForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, Validators.minLength(6)]],
    location: ['', [Validators.required]],
    availability: ['now' as AvailabilityType, [Validators.required]],
    skill: ['Electrician' as SkillType, [Validators.required]],
    experienceYears: [null as number | null],
    bio: ['']
  });

  constructor() {
    // If not logged in, redirect to login
    if (!this.storage.isWorkerLoggedIn()) {
      this.router.navigate(['/worker-login']);
      return;
    }

    // Initialize form when provider data is ready
    effect(() => {
      const p = this.provider();
      if (p) {
        this.editForm.patchValue({
          name: p.name,
          phone: p.phone,
          location: p.location,
          availability: p.availability,
          skill: p.skill,
          experienceYears: p.experienceYears ?? null,
          bio: p.bio || ''
        });
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'approved':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'pending':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'rejected':
        return 'bg-rose-100 text-rose-900 border-rose-300';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-300';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'approved':
        return this.lang.t().approvedStatus;
      case 'pending':
        return this.lang.t().pendingStatus;
      case 'rejected':
        return this.lang.t().rejectedStatus;
      default:
        return status;
    }
  }

  async onToggleVisibility(): Promise<void> {
    const current = this.provider();
    if (!current) return;

    const newVisibility = current.isAvailableRightNow === false || current.isVisible === false ? true : false;
    await this.storage.toggleProviderVisibility(current.id, newVisibility);

    const msg = newVisibility
      ? (this.lang.isTamil() ? 'சுயவிவரம் பொதுப் பட்டியலில் செயல்படுத்தப்பட்டது!' : 'Profile is now active and visible in public directory!')
      : (this.lang.isTamil() ? 'சுயவிவரம் பொதுப் பட்டியலில் தற்காலிகமாக மறைக்கப்பட்டது.' : 'Profile is now hidden from public search.');
    
    this.showToast(msg);
  }

  async onSaveProfile(): Promise<void> {
    if (this.editForm.invalid) return;

    const current = this.provider();
    if (!current) return;

    this.isSaving.set(true);

    const values = this.editForm.value;
    const updates: Partial<Provider> = {
      name: values.name?.trim() || current.name,
      phone: values.phone?.trim() || current.phone,
      location: values.location?.trim() || current.location,
      availability: (values.availability as AvailabilityType) || current.availability,
      skill: (values.skill as SkillType) || current.skill,
      experienceYears: values.experienceYears ? Number(values.experienceYears) : undefined,
      bio: values.bio?.trim() || undefined
    };

    try {
      await this.storage.updateProviderProfile(current.id, updates);
      this.isSaving.set(false);
      this.showToast(this.lang.t().savedSuccessfully);
    } catch {
      this.isSaving.set(false);
      this.showToast('Could not save changes to database. Please check your connection.');
    }
  }

  showToast(msg: string): void {
    this.actionToast.set(msg);
    setTimeout(() => {
      if (this.actionToast() === msg) {
        this.actionToast.set(null);
      }
    }, 4000);
  }

  logout(): void {
    this.storage.logoutWorker();
    this.router.navigate(['/worker-login']);
  }
}
