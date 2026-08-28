import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ProviderWithRating } from '../../models/provider.model';
import { LanguageService } from '../../services/language';
import { StorageService } from '../../services/storage';

@Component({
  selector: 'app-provider-detail-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, DatePipe, MatIconModule],
  template: `
    @if (provider()) {
      <div 
        class="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
        
        <div 
          id="provider-modal-content"
          class="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-amber-200 overflow-hidden flex flex-col max-h-[92vh]">
          
          <!-- Modal Header -->
          <div class="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 text-white p-4 sm:p-5 flex items-start justify-between relative">
            <div class="flex items-center gap-3 sm:gap-4">
              <img 
                [src]="provider()!.photoUrl" 
                [alt]="provider()!.name" 
                class="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover border-2 border-white/80 shadow-md bg-amber-800"
                referrerpolicy="no-referrer"
              />
              <div>
                <div class="flex items-center gap-2 flex-wrap">
                  <h3 class="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
                    {{ provider()!.name }}
                  </h3>
                  <span class="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/90 text-white">
                    <mat-icon class="text-xs">verified</mat-icon>
                    {{ lang.t().verifiedLocal }}
                  </span>
                </div>

                <div class="flex items-center gap-2 mt-1 text-amber-100 text-sm font-medium flex-wrap">
                  <span class="px-2.5 py-0.5 rounded-lg bg-white/20 backdrop-blur-xs text-white text-xs font-bold">
                    {{ lang.getSkillLabel(provider()!.skill, provider()!.customSkill) }}
                  </span>
                  <span class="flex items-center gap-1 text-xs sm:text-sm">
                    <mat-icon class="text-sm">location_on</mat-icon>
                    {{ provider()!.location }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Close Button -->
            <button 
              type="button" 
              (click)="closeModal.emit()"
              id="close-modal-btn"
              class="rounded-full p-1.5 text-amber-100 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
              aria-label="Close dialog">
              <mat-icon class="text-2xl">close</mat-icon>
            </button>
          </div>

          <!-- Modal Body (Scrollable) -->
          <div class="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
            
            <!-- Quick Info Badges -->
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 text-stone-800">
              
              <!-- Availability Badge -->
              <div class="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 flex flex-col justify-center">
                <span class="text-xs text-stone-500 font-medium">{{ lang.t().availabilityLabel }}</span>
                <div class="flex items-center gap-1.5 mt-0.5 font-bold text-xs sm:text-sm text-amber-950">
                  <span class="w-2.5 h-2.5 rounded-full"
                    [class.bg-emerald-500]="provider()!.availability === 'now'"
                    [class.bg-amber-500]="provider()!.availability === 'today'"
                    [class.bg-blue-500]="provider()!.availability === 'this_week'">
                  </span>
                  {{ lang.getAvailabilityLabel(provider()!.availability) }}
                </div>
              </div>

              <!-- Rating Badge -->
              <div class="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 flex flex-col justify-center">
                <span class="text-xs text-stone-500 font-medium">Rating & Reviews</span>
                <div class="flex items-center gap-1 mt-0.5 font-bold text-xs sm:text-sm text-stone-900">
                  <mat-icon class="text-amber-500 text-base">star</mat-icon>
                  <span>{{ provider()!.averageRating > 0 ? provider()!.averageRating : 'New' }}</span>
                  <span class="text-stone-500 font-normal text-xs">({{ provider()!.totalReviews }} {{ lang.t().reviewsCount }})</span>
                </div>
              </div>

              <!-- Experience Badge -->
              <div class="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 flex flex-col justify-center col-span-2 sm:col-span-1">
                <span class="text-xs text-stone-500 font-medium">{{ lang.t().experienceLabel }}</span>
                <div class="font-bold text-xs sm:text-sm text-stone-900 mt-0.5">
                  {{ provider()!.experienceYears ? provider()!.experienceYears + ' Years' : 'Local Expert' }}
                </div>
              </div>
            </div>

            <!-- About / Bio Section -->
            @if (provider()!.bio) {
              <div class="bg-stone-50 rounded-xl p-3.5 sm:p-4 border border-stone-200/70">
                <h4 class="text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5 flex items-center gap-1">
                  <mat-icon class="text-sm text-amber-700">info</mat-icon>
                  Specialties & Experience
                </h4>
                <p class="text-stone-800 text-sm leading-relaxed whitespace-pre-line font-medium">
                  {{ provider()!.bio }}
                </p>
              </div>
            }

            <!-- Direct Contact Actions Bar -->
            <div class="bg-gradient-to-br from-amber-50 to-orange-50/60 p-4 rounded-xl border border-amber-300/80 space-y-3">
              <div class="flex items-center justify-between flex-wrap gap-2">
                <span class="text-xs font-bold uppercase tracking-wider text-amber-900">
                  Direct Village Contact
                </span>
                <span class="text-xs text-stone-600 bg-white/80 px-2 py-0.5 rounded-full border border-amber-200">
                  Direct phone call • No commission
                </span>
              </div>

              <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <!-- Call button -->
                <a 
                  [href]="'tel:' + provider()!.phone"
                  (click)="handleContactClick()"
                  id="modal-call-btn"
                  class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs transition-transform active:scale-98 text-sm sm:text-base">
                  <mat-icon class="text-xl">call</mat-icon>
                  <span>{{ lang.t().callNow }}: {{ provider()!.phone }}</span>
                </a>

                <!-- WhatsApp button -->
                <a 
                  [href]="'https://wa.me/91' + cleanPhone(provider()!.phone) + '?text=' + getWhatsAppMessage()"
                  target="_blank"
                  rel="noopener noreferrer"
                  (click)="handleContactClick()"
                  id="modal-whatsapp-btn"
                  class="inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-xl shadow-xs transition-transform active:scale-98 text-sm sm:text-base">
                  <mat-icon class="text-xl">chat</mat-icon>
                  <span>{{ lang.t().whatsapp }}</span>
                </a>
              </div>
            </div>

            <!-- Reviews & Rating Section -->
            <div class="space-y-4 pt-2 border-t border-stone-200">
              <div class="flex items-center justify-between flex-wrap gap-2">
                <h4 class="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-1.5">
                  <mat-icon class="text-amber-600">rate_review</mat-icon>
                  <span>Resident Reviews ({{ provider()!.totalReviews }})</span>
                </h4>

                <button 
                  type="button" 
                  (click)="showReviewForm.set(!showReviewForm())"
                  id="toggle-review-form-btn"
                  class="text-xs sm:text-sm font-bold text-amber-800 hover:text-amber-900 bg-amber-100/70 hover:bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-300 transition-colors flex items-center gap-1">
                  <mat-icon class="text-base">{{ showReviewForm() ? 'close' : 'add_comment' }}</mat-icon>
                  <span>{{ showReviewForm() ? lang.t().cancel : lang.t().writeReview }}</span>
                </button>
              </div>

              <!-- Write Review Form -->
              @if (showReviewForm()) {
                <form 
                  [formGroup]="reviewForm" 
                  (ngSubmit)="submitReview()" 
                  id="review-submission-form"
                  class="bg-amber-50/70 p-4 rounded-xl border border-amber-200 space-y-3.5 animate-in fade-in duration-150">
                  
                  <h5 class="font-bold text-sm text-stone-900">{{ lang.t().rateProvider }}</h5>

                  <!-- Interactive Star Picker -->
                  <div>
                    <span class="block text-xs font-semibold text-stone-700 mb-1">
                      {{ lang.t().yourRating }} *
                    </span>
                    <div class="flex items-center gap-1.5">
                      @for (star of [1, 2, 3, 4, 5]; track star) {
                        <button 
                          type="button" 
                          (click)="setRating(star)"
                          (mouseenter)="hoverRating.set(star)"
                          (mouseleave)="hoverRating.set(0)"
                          class="text-3xl transition-transform hover:scale-120 focus:outline-none cursor-pointer"
                          [class.text-amber-500]="(hoverRating() || selectedRating()) >= star"
                          [class.text-stone-300]="(hoverRating() || selectedRating()) < star"
                          [attr.aria-label]="star + ' stars'">
                          ★
                        </button>
                      }
                      <span class="text-xs font-bold text-stone-600 ml-2">
                        {{ selectedRating() }} / 5 Stars
                      </span>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label for="rev-name-input" class="block text-xs font-semibold text-stone-700 mb-1">
                        {{ lang.t().reviewerName }} *
                      </label>
                      <input 
                        id="rev-name-input"
                        type="text" 
                        formControlName="reviewerName"
                        [placeholder]="lang.t().reviewerNamePlaceholder"
                        class="w-full px-3 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm bg-white text-stone-900"
                      />
                    </div>

                    <div>
                      <label for="rev-village-input" class="block text-xs font-semibold text-stone-700 mb-1">
                        {{ lang.t().reviewerVillage }}
                      </label>
                      <input 
                        id="rev-village-input"
                        type="text" 
                        formControlName="reviewerLocation"
                        [placeholder]="lang.t().reviewerVillagePlaceholder"
                        class="w-full px-3 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm bg-white text-stone-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label for="rev-comment-input" class="block text-xs font-semibold text-stone-700 mb-1">
                      {{ lang.t().reviewComment }}
                    </label>
                    <textarea 
                      id="rev-comment-input"
                      formControlName="comment" 
                      rows="2" 
                      [placeholder]="lang.t().reviewCommentPlaceholder"
                      class="w-full px-3 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm bg-white text-stone-900 resize-none">
                    </textarea>
                  </div>

                  @if (reviewError()) {
                    <p class="text-xs font-bold text-rose-600 flex items-center gap-1">
                      <mat-icon class="text-sm">error</mat-icon>
                      {{ reviewError() }}
                    </p>
                  }

                  <div class="flex justify-end gap-2 pt-1">
                    <button 
                      type="button" 
                      (click)="showReviewForm.set(false)"
                      class="px-3 py-1.5 text-xs font-semibold text-stone-600 hover:text-stone-800 bg-white border border-stone-300 rounded-lg">
                      {{ lang.t().cancel }}
                    </button>
                    
                    <button 
                      type="submit" 
                      id="submit-review-btn"
                      class="px-4 py-1.5 text-xs sm:text-sm font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-lg shadow-xs transition-colors cursor-pointer">
                      {{ lang.t().submitReview }}
                    </button>
                  </div>
                </form>
              }

              <!-- Review Success Banner -->
              @if (reviewSuccess()) {
                <div class="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <mat-icon class="text-emerald-600 text-base">check_circle</mat-icon>
                  <span>{{ lang.t().reviewSuccess }}</span>
                </div>
              }

              <!-- Existing Reviews List -->
              <div class="space-y-3 pt-1">
                @if (provider()!.latestReviews && provider()!.latestReviews!.length > 0) {
                  @for (rev of provider()!.latestReviews; track rev.id) {
                    <div class="p-3.5 bg-white rounded-xl border border-stone-200/80 shadow-2xs space-y-1.5">
                      <div class="flex items-center justify-between flex-wrap gap-1">
                        <div class="flex items-center gap-2">
                          <span class="font-bold text-xs sm:text-sm text-stone-900">{{ rev.reviewerName }}</span>
                          @if (rev.reviewerLocation) {
                            <span class="text-xs text-stone-500 font-medium">• {{ rev.reviewerLocation }}</span>
                          }
                        </div>
                        <span class="text-[11px] text-stone-400">{{ rev.createdAt | date:'mediumDate' }}</span>
                      </div>

                      <div class="flex items-center gap-0.5 text-amber-500 text-xs">
                        @for (s of [1, 2, 3, 4, 5]; track s) {
                          <span [class.text-amber-500]="rev.rating >= s" [class.text-stone-200]="rev.rating < s">★</span>
                        }
                        <span class="text-xs font-bold text-stone-700 ml-1.5">{{ rev.rating }}.0</span>
                      </div>

                      @if (rev.comment) {
                        <p class="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                          "{{ rev.comment }}"
                        </p>
                      }
                    </div>
                  }
                } @else {
                  <div class="text-center py-6 px-4 bg-stone-50 rounded-xl border border-dashed border-stone-200 text-stone-500 text-xs sm:text-sm">
                    {{ lang.t().noReviewsYet }}
                  </div>
                }
              </div>
            </div>

          </div>

          <!-- Modal Footer -->
          <div class="bg-stone-50 px-4 sm:px-6 py-3 border-t border-stone-200 flex items-center justify-end">
            <button 
              type="button" 
              (click)="closeModal.emit()"
              id="footer-close-btn"
              class="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer">
              {{ lang.t().close }}
            </button>
          </div>

        </div>
      </div>
    }
  `
})
export class ProviderDetailModalComponent {
  readonly lang = inject(LanguageService);
  readonly storage = inject(StorageService);
  private readonly fb = inject(FormBuilder);

  readonly provider = input<ProviderWithRating | null>(null);
  readonly closeModal = output<void>();

  readonly showReviewForm = signal<boolean>(false);
  readonly selectedRating = signal<number>(5);
  readonly hoverRating = signal<number>(0);
  readonly reviewSuccess = signal<boolean>(false);
  readonly reviewError = signal<string | null>(null);

  readonly reviewForm = this.fb.group({
    reviewerName: ['', [Validators.required, Validators.minLength(2)]],
    reviewerLocation: [''],
    comment: ['']
  });

  setRating(rating: number) {
    this.selectedRating.set(rating);
  }

  async submitReview() {
    this.reviewError.set(null);
    if (this.reviewForm.invalid) {
      this.reviewError.set('Please enter your name to submit a review.');
      return;
    }

    const currentProvider = this.provider();
    if (!currentProvider) return;

    const values = this.reviewForm.value;
    try {
      await this.storage.addReview({
        providerId: currentProvider.id,
        reviewerName: values.reviewerName || 'Resident',
        reviewerLocation: values.reviewerLocation || undefined,
        rating: this.selectedRating(),
        comment: values.comment || ''
      });

      this.reviewSuccess.set(true);
      this.showReviewForm.set(false);
      this.reviewForm.reset();
      setTimeout(() => this.reviewSuccess.set(false), 5000);
    } catch {
      this.reviewError.set('Could not submit review. Please check your connection.');
    }
  }

  handleContactClick() {
    const prov = this.provider();
    if (prov) {
      this.storage.logContact(prov.id);
    }
  }

  cleanPhone(phone: string): string {
    return phone.replace(/\D/g, '').slice(-10);
  }

  getWhatsAppMessage(): string {
    const prov = this.provider();
    if (!prov) return '';
    const text = `வணக்கம் ${prov.name}, நான் LocalConnect செயலி மூலம் உங்களை தொடர்பு கொள்கிறேன். உங்கள் ${prov.skill} சேவை எனக்கு தேவைப்படுகிறது.`;
    return encodeURIComponent(text);
  }
}

