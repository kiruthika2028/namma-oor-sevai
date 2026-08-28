import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { LanguageService } from '../../services/language';
import { StorageService } from '../../services/storage';
import { SkillType, AvailabilityType } from '../../models/provider.model';

@Component({
  selector: 'app-register',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, MatIconModule],
  template: `
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
      
      <!-- Header Banner -->
      <div class="bg-gradient-to-br from-amber-700 via-amber-800 to-amber-900 rounded-3xl p-6 sm:p-8 text-white shadow-md space-y-2 text-center sm:text-left relative overflow-hidden">
        <div class="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10 blur-xl pointer-events-none"></div>
        
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-600/60 text-amber-100 text-xs font-bold border border-amber-400/40">
          <mat-icon class="text-sm">verified</mat-icon>
          <span>100% Free Community Registration</span>
        </div>

        <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {{ lang.t().regTitle }}
        </h1>
        <p class="text-amber-100 text-sm sm:text-base max-w-xl font-normal leading-relaxed">
          {{ lang.t().regSubtitle }}
        </p>
      </div>

      <!-- Registration Success Card -->
      @if (submissionSuccess()) {
        <div class="bg-white rounded-3xl border-2 border-emerald-500/80 p-6 sm:p-10 shadow-lg text-center space-y-5 animate-in zoom-in-95 duration-200">
          <div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <mat-icon class="text-4xl">check_circle</mat-icon>
          </div>

          <div class="space-y-2 max-w-lg mx-auto">
            <h2 class="text-2xl font-extrabold text-stone-900">
              {{ lang.t().regSuccessTitle }}
            </h2>
            <p class="text-stone-600 text-sm sm:text-base leading-relaxed">
              {{ lang.t().regSuccessDesc }}
            </p>
          </div>

          <div class="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 max-w-md mx-auto flex items-center gap-2 text-left">
            <mat-icon class="text-amber-700 text-xl flex-shrink-0">info</mat-icon>
            <span>
              Status: <strong class="text-amber-900 font-extrabold">Pending Verification</strong>.
              You can test the Admin approval instantly via the Admin panel.
            </span>
          </div>

          <div class="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a 
              routerLink="/worker-login" 
              class="w-full sm:w-auto px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-sm transition-colors text-center flex items-center justify-center gap-1.5">
              <mat-icon class="text-base">badge</mat-icon>
              <span>{{ lang.t().workerLogin }}</span>
            </a>

            <button 
              type="button" 
              (click)="resetForm()"
              class="w-full sm:w-auto px-6 py-3 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer">
              Register Another Provider
            </button>
            
            <a 
              routerLink="/admin" 
              class="w-full sm:w-auto px-6 py-3 bg-white hover:bg-amber-50 text-amber-900 font-bold rounded-xl border border-amber-300 text-sm transition-colors text-center">
              Go to Admin Panel to Review
            </a>
          </div>
        </div>
      } @else {

        <!-- Registration Form -->
        <form 
          [formGroup]="regForm" 
          (ngSubmit)="onSubmit()" 
          id="provider-registration-form"
          class="bg-white rounded-3xl border border-amber-200/90 shadow-sm p-6 sm:p-8 space-y-6">
          
          <!-- General Validation Error Alert -->
          @if (errorMessage()) {
            <div class="p-4 bg-rose-50 border border-rose-300 rounded-2xl text-rose-900 text-sm font-bold flex items-start gap-2.5 animate-in fade-in">
              <mat-icon class="text-rose-600 text-xl flex-shrink-0 mt-0.5">error_outline</mat-icon>
              <div>
                <p>{{ errorMessage() }}</p>
              </div>
            </div>
          }

          <!-- SECTION 1: Personal Details -->
          <div class="space-y-4">
            <h3 class="text-base font-extrabold text-stone-900 flex items-center gap-2 border-b border-stone-200 pb-2">
              <mat-icon class="text-amber-700">person</mat-icon>
              <span>1. {{ lang.t().fullName }} &amp; {{ lang.t().photoUpload }}</span>
            </h3>

            <!-- Full Name -->
            <div>
              <label class="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5" for="fullNameInput">
                {{ lang.t().fullName }} <span class="text-rose-600">*</span>
              </label>
              <input 
                id="fullNameInput"
                type="text" 
                formControlName="name"
                [placeholder]="lang.t().fullNamePlaceholder"
                class="w-full px-4 py-3 rounded-xl border border-stone-300 bg-stone-50/40 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-stone-900 text-sm sm:text-base font-medium"
                [class.border-rose-400]="isFieldInvalid('name')"
              />
              @if (isFieldInvalid('name')) {
                <p class="text-xs text-rose-600 font-semibold mt-1">Please enter your full name.</p>
              }
            </div>

            <!-- Profile Photo Upload -->
            <div>
              <span class="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                {{ lang.t().photoUpload }}
              </span>
              
              <div class="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl border-2 border-dashed border-amber-300/80 bg-amber-50/30">
                <!-- Photo Preview -->
                <div class="relative flex-shrink-0">
                  <img 
                    [src]="photoPreview() || defaultAvatar" 
                    alt="Provider Preview" 
                    class="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md bg-amber-800"
                    referrerpolicy="no-referrer"
                  />
                  @if (photoPreview()) {
                    <button 
                      type="button" 
                      (click)="clearPhoto()"
                      title="Remove photo"
                      class="absolute -top-2 -right-2 p-1 bg-rose-600 text-white rounded-full hover:bg-rose-700 shadow-xs">
                      <mat-icon class="text-sm leading-none">close</mat-icon>
                    </button>
                  }
                </div>

                <div class="flex-1 text-center sm:text-left space-y-2">
                  <div class="flex flex-wrap gap-2 justify-center sm:justify-start">
                    <label class="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs sm:text-sm rounded-xl cursor-pointer transition-colors border border-amber-300">
                      <mat-icon class="text-base text-amber-800">cloud_upload</mat-icon>
                      <span>Upload Photo</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        (change)="onFileSelected($event)" 
                        class="hidden"
                        id="provider-photo-file-input"
                      />
                    </label>

                    <button 
                      type="button" 
                      (click)="setPresetAvatar('blue')"
                      class="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-xl border border-stone-300">
                      Preset 1
                    </button>
                    <button 
                      type="button" 
                      (click)="setPresetAvatar('teal')"
                      class="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-xl border border-stone-300">
                      Preset 2
                    </button>
                    <button 
                      type="button" 
                      (click)="setPresetAvatar('orange')"
                      class="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-xl border border-stone-300">
                      Preset 3
                    </button>
                  </div>
                  <p class="text-xs text-stone-500 font-normal">
                    {{ lang.t().photoUploadHint }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Phone Number -->
            <div>
              <label class="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5" for="phoneInput">
                {{ lang.t().phoneNumber }} <span class="text-rose-600">*</span>
              </label>
              <div class="relative">
                <div class="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500 font-bold text-sm flex items-center gap-1 border-r border-stone-300 pr-2">
                  <span>🇮🇳 +91</span>
                </div>
                <input 
                  id="phoneInput"
                  type="tel" 
                  formControlName="phone"
                  [placeholder]="lang.t().phonePlaceholder"
                  maxlength="14"
                  class="w-full pl-22 pr-4 py-3 rounded-xl border border-stone-300 bg-stone-50/40 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-stone-900 text-sm sm:text-base font-mono font-medium"
                  [class.border-rose-400]="isFieldInvalid('phone')"
                />
              </div>
              <p class="text-xs text-stone-500 mt-1">
                {{ lang.t().phoneHint }}
              </p>
              @if (isFieldInvalid('phone')) {
                <p class="text-xs text-rose-600 font-semibold mt-1">Please enter a valid 10-digit mobile number.</p>
              }
            </div>
          </div>

          <!-- SECTION 2: Skill & Village Details -->
          <div class="space-y-4 pt-2">
            <h3 class="text-base font-extrabold text-stone-900 flex items-center gap-2 border-b border-stone-200 pb-2">
              <mat-icon class="text-amber-700">handyman</mat-icon>
              <span>2. {{ lang.t().skillLabel }} &amp; {{ lang.t().villageLocation }}</span>
            </h3>

            <!-- Skill Selector -->
            <div>
              <label class="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5" for="skillSelect">
                {{ lang.t().skillLabel }} <span class="text-rose-600">*</span>
              </label>
              <select 
                id="skillSelect"
                formControlName="skill"
                class="w-full px-4 py-3 rounded-xl border border-stone-300 bg-stone-50/40 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-stone-900 text-sm sm:text-base font-medium"
                [class.border-rose-400]="isFieldInvalid('skill')">
                <option value="" disabled>{{ lang.t().selectSkill }}</option>
                @for (sk of skillsList; track sk) {
                  <option [value]="sk">{{ lang.getSkillLabel(sk) }}</option>
                }
              </select>
              @if (isFieldInvalid('skill')) {
                <p class="text-xs text-rose-600 font-semibold mt-1">Please select your primary skill.</p>
              }
            </div>

            <!-- Other Skill Free Text (Only if "Other" is chosen) -->
            @if (regForm.get('skill')?.value === 'Other') {
              <div class="animate-in fade-in duration-150">
                <label class="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5" for="customSkillInput">
                  {{ lang.t().otherSkillLabel }} <span class="text-rose-600">*</span>
                </label>
                <input 
                  id="customSkillInput"
                  type="text" 
                  formControlName="customSkill"
                  [placeholder]="lang.t().otherSkillPlaceholder"
                  class="w-full px-4 py-3 rounded-xl border border-amber-300 bg-amber-50/30 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-stone-900 text-sm sm:text-base font-medium"
                />
              </div>
            }

            <!-- Village / Town Location -->
            <div>
              <label class="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5" for="locationInput">
                {{ lang.t().villageLocation }} <span class="text-rose-600">*</span>
              </label>
              <input 
                id="locationInput"
                type="text" 
                formControlName="location"
                [placeholder]="lang.t().villagePlaceholder"
                class="w-full px-4 py-3 rounded-xl border border-stone-300 bg-stone-50/40 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-stone-900 text-sm sm:text-base font-medium"
                [class.border-rose-400]="isFieldInvalid('location')"
              />
              @if (isFieldInvalid('location')) {
                <p class="text-xs text-rose-600 font-semibold mt-1">Please enter your village or town name.</p>
              }
            </div>

            <!-- Availability -->
            <div>
              <label class="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5" for="availabilitySelect">
                {{ lang.t().availabilityOption }} <span class="text-rose-600">*</span>
              </label>
              <select 
                id="availabilitySelect"
                formControlName="availability"
                class="w-full px-4 py-3 rounded-xl border border-stone-300 bg-stone-50/40 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-stone-900 text-sm sm:text-base font-medium">
                <option value="now">⚡ {{ lang.getAvailabilityLabel('now') }}</option>
                <option value="today">📅 {{ lang.getAvailabilityLabel('today') }}</option>
                <option value="this_week">🗓️ {{ lang.getAvailabilityLabel('this_week') }}</option>
              </select>
            </div>
          </div>

          <!-- SECTION 3: Experience & Bio -->
          <div class="space-y-4 pt-2">
            <h3 class="text-base font-extrabold text-stone-900 flex items-center gap-2 border-b border-stone-200 pb-2">
              <mat-icon class="text-amber-700">stars</mat-icon>
              <span>3. {{ lang.t().experienceYears }} &amp; Description</span>
            </h3>

            <!-- Years of Experience -->
            <div>
              <label class="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5" for="experienceInput">
                {{ lang.t().experienceYears }}
              </label>
              <input 
                id="experienceInput"
                type="number" 
                min="0"
                max="60"
                formControlName="experienceYears"
                [placeholder]="lang.t().experiencePlaceholder"
                class="w-full px-4 py-3 rounded-xl border border-stone-300 bg-stone-50/40 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-stone-900 text-sm sm:text-base font-medium"
              />
            </div>

            <!-- Short Bio -->
            <div>
              <label class="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5" for="bioInput">
                {{ lang.t().bioLabel }}
              </label>
              <textarea 
                id="bioInput"
                formControlName="bio" 
                rows="3" 
                [placeholder]="lang.t().bioPlaceholder"
                class="w-full px-4 py-3 rounded-xl border border-stone-300 bg-stone-50/40 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-stone-900 text-sm sm:text-base font-medium resize-none">
              </textarea>
            </div>
          </div>

          <!-- SECTION 4: Security Verification (CAPTCHA) -->
          <div class="space-y-4 pt-2 border-t border-stone-200" id="captcha-verification-section">
            <div class="flex items-center justify-between border-b border-stone-200 pb-2">
              <h3 class="text-base font-extrabold text-stone-900 flex items-center gap-2">
                <mat-icon class="text-amber-700">security</mat-icon>
                <span>4. {{ lang.t().captchaLabel }}</span>
              </h3>
              
              <div class="inline-flex rounded-lg border border-amber-300 p-0.5 bg-amber-50/80 text-2xs font-bold text-amber-900">
                <button 
                  type="button" 
                  (click)="setCaptchaMode('text')"
                  class="px-2 py-0.5 rounded cursor-pointer transition-colors"
                  [class.bg-amber-700]="captchaMode() === 'text'"
                  [class.text-white]="captchaMode() === 'text'">
                  Text Caption
                </button>
                <button 
                  type="button" 
                  (click)="setCaptchaMode('math')"
                  class="px-2 py-0.5 rounded cursor-pointer transition-colors"
                  [class.bg-amber-700]="captchaMode() === 'math'"
                  [class.text-white]="captchaMode() === 'math'">
                  Maths
                </button>
              </div>
            </div>

            <p class="text-xs text-stone-600 font-normal">
              {{ lang.t().captchaPrompt }}
            </p>

            <div class="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/90 space-y-3">
              <!-- Visual Captcha Display Box -->
              <div class="flex flex-col sm:flex-row items-center gap-3">
                <div 
                  id="captcha-display-box"
                  class="w-full sm:w-60 h-14 bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 rounded-xl flex items-center justify-center relative overflow-hidden border border-amber-700/60 shadow-inner select-none">
                  <!-- Distorted background grid & lines -->
                  <div class="absolute inset-0 opacity-25 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:8px_8px] pointer-events-none"></div>
                  <div class="absolute w-full h-0.5 bg-amber-500/40 rotate-6 pointer-events-none"></div>
                  <div class="absolute w-full h-0.5 bg-amber-400/30 -rotate-3 pointer-events-none"></div>

                  <!-- Captcha Text Display -->
                  <span class="font-mono text-xl sm:text-2xl font-black tracking-widest text-amber-300 transform -rotate-1 drop-shadow-md">
                    {{ captchaDisplay() }}
                  </span>
                </div>

                <!-- Regenerate Button -->
                <button 
                  type="button" 
                  (click)="generateCaptcha()"
                  id="refresh-captcha-btn"
                  title="Generate new verification challenge"
                  class="px-3.5 py-2.5 bg-white hover:bg-stone-100 border border-stone-300 rounded-xl text-stone-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors shrink-0">
                  <mat-icon class="text-base text-amber-700">refresh</mat-icon>
                  <span>{{ lang.t().captchaRefresh }}</span>
                </button>
              </div>

              <!-- Captcha Input Field -->
              <div>
                <label class="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1" for="captchaInput">
                  Enter Shown Verification Answer <span class="text-rose-600">*</span>
                </label>
                <input 
                  id="captchaInput"
                  type="text" 
                  formControlName="captchaAnswer"
                  [placeholder]="lang.t().captchaPlaceholder"
                  autocomplete="off"
                  class="w-full sm:w-60 px-4 py-2.5 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-stone-900 font-mono text-base font-bold tracking-wider"
                  [class.border-rose-400]="isFieldInvalid('captchaAnswer')"
                />
                @if (isFieldInvalid('captchaAnswer')) {
                  <p class="text-xs text-rose-600 font-semibold mt-1">Please enter the security verification answer.</p>
                }
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="pt-4 border-t border-stone-200">
            <button 
              type="submit" 
              id="submit-provider-reg-btn"
              [disabled]="isSubmitting()"
              class="w-full py-4 px-6 bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-white font-extrabold text-base sm:text-lg rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50">
              <mat-icon class="text-2xl">{{ isSubmitting() ? 'hourglass_top' : 'how_to_reg' }}</mat-icon>
              <span>{{ isSubmitting() ? lang.t().submitting : lang.t().submitReg }}</span>
            </button>
            <p class="text-xs text-stone-500 text-center mt-2.5 font-normal">
              By submitting, your profile will be safely reviewed and published to the village directory.
            </p>
          </div>

        </form>
      }

    </div>
  `
})
export class RegisterComponent {
  readonly lang = inject(LanguageService);
  readonly storage = inject(StorageService);
  private readonly fb = inject(FormBuilder);

  readonly photoPreview = signal<string | null>(null);
  readonly submissionSuccess = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);
  readonly isSubmitting = signal<boolean>(false);

  // Captcha state
  readonly captchaMode = signal<'text' | 'math'>('text');
  readonly captchaDisplay = signal<string>('');
  private expectedCaptchaAnswer = '';

  readonly defaultAvatar = `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
      <rect width="160" height="160" rx="32" fill="#0284c7"/>
      <circle cx="80" cy="58" r="30" fill="#0369a1"/>
      <path d="M30 142 C30 102 50 92 80 92 C110 92 130 102 130 142 Z" fill="#0369a1"/>
    </svg>`
  )}`;

  readonly skillsList: SkillType[] = [
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

  readonly regForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9+ -]{10,14}$/)]],
    skill: ['', [Validators.required]],
    customSkill: [''],
    location: ['', [Validators.required, Validators.minLength(2)]],
    availability: ['now' as AvailabilityType, [Validators.required]],
    experienceYears: [null as number | null],
    bio: [''],
    captchaAnswer: ['', [Validators.required]]
  });

  constructor() {
    this.generateCaptcha();
  }

  setCaptchaMode(mode: 'text' | 'math') {
    this.captchaMode.set(mode);
    this.generateCaptcha();
  }

  generateCaptcha() {
    if (this.captchaMode() === 'math') {
      const a = Math.floor(Math.random() * 15) + 5;
      const b = Math.floor(Math.random() * 10) + 1;
      const isAdd = Math.random() > 0.3;
      if (isAdd) {
        this.captchaDisplay.set(`${a} + ${b} = ?`);
        this.expectedCaptchaAnswer = (a + b).toString();
      } else {
        this.captchaDisplay.set(`${a} - ${b} = ?`);
        this.expectedCaptchaAnswer = (a - b).toString();
      }
    } else {
      // Alphanumeric text caption
      const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
      let code = '';
      for (let i = 0; i < 5; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      this.captchaDisplay.set(code.split('').join(' '));
      this.expectedCaptchaAnswer = code;
    }

    this.regForm.get('captchaAnswer')?.reset();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.regForm.get(fieldName);
    return Boolean(field && field.invalid && (field.dirty || field.touched));
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result as string;
        // Resize and compress via canvas to avoid high base64 storage limits
        this.compressImage(result, (compressed) => {
          this.photoPreview.set(compressed);
        });
      };

      reader.readAsDataURL(file);
    }
  }

  private compressImage(dataUrl: string, callback: (compressed: string) => void) {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const maxDim = 200;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        }
      } else {
        if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);
      callback(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.src = dataUrl;
  }

  setPresetAvatar(color: 'blue' | 'teal' | 'orange') {
    const colors = {
      blue: { bg: '#0284c7', icon: '#0369a1', text: 'NP' },
      teal: { bg: '#0d9488', icon: '#0f766e', text: 'NP' },
      orange: { bg: '#ea580c', icon: '#c2410c', text: 'NP' }
    };
    const c = colors[color];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
      <rect width="160" height="160" rx="32" fill="${c.bg}"/>
      <circle cx="80" cy="58" r="30" fill="${c.icon}"/>
      <path d="M30 142 C30 102 50 92 80 92 C110 92 130 102 130 142 Z" fill="${c.icon}"/>
      <text x="80" y="66" font-family="sans-serif" font-size="20" font-weight="bold" fill="#ffffff" text-anchor="middle">Local</text>
    </svg>`;
    this.photoPreview.set(`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`);
  }

  clearPhoto() {
    this.photoPreview.set(null);
  }

  async onSubmit() {
    this.errorMessage.set(null);

    if (this.regForm.invalid) {
      this.regForm.markAllAsTouched();
      this.errorMessage.set(this.lang.t().regRequiredFields);
      return;
    }

    const formValues = this.regForm.value;
    const phone = (formValues.phone || '').trim();

    // Verify Captcha
    const enteredCaptcha = (formValues.captchaAnswer || '').trim().replace(/\s+/g, '').toUpperCase();
    const expected = this.expectedCaptchaAnswer.trim().replace(/\s+/g, '').toUpperCase();

    if (enteredCaptcha !== expected) {
      this.errorMessage.set(this.lang.t().captchaError);
      this.generateCaptcha();
      return;
    }

    // Check duplicate phone number in storage
    if (this.storage.isPhoneRegistered(phone)) {
      this.errorMessage.set(this.lang.t().regDuplicatePhone);
      return;
    }

    this.isSubmitting.set(true);

    try {
      const result = await this.storage.addProvider({
        name: formValues.name!,
        photoUrl: this.photoPreview() || undefined,
        phone: phone,
        skill: formValues.skill as SkillType,
        customSkill: formValues.customSkill || undefined,
        location: formValues.location!,
        availability: (formValues.availability as AvailabilityType) || 'now',
        experienceYears: formValues.experienceYears ? Number(formValues.experienceYears) : undefined,
        bio: formValues.bio || undefined
      });

      this.isSubmitting.set(false);

      if (result.success) {
        this.submissionSuccess.set(true);
      } else {
        if (result.error === 'duplicate_phone') {
          this.errorMessage.set(this.lang.t().regDuplicatePhone);
        } else {
          this.errorMessage.set('An error occurred while saving to database. Please try again.');
        }
      }
    } catch {
      this.isSubmitting.set(false);
      this.errorMessage.set('Unable to complete registration at this time. Please check your internet connection and try again.');
    }
  }

  resetForm() {
    this.submissionSuccess.set(false);
    this.errorMessage.set(null);
    this.photoPreview.set(null);
    this.generateCaptcha();
    this.regForm.reset({
      availability: 'now'
    });
  }
}
