import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { LanguageService } from '../../services/language';
import { StorageService } from '../../services/storage';
import { Provider } from '../../models/provider.model';

@Component({
  selector: 'app-admin',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, DatePipe, RouterLink, MatIconModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
      
      <!-- Admin Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-amber-200/90 shadow-sm">
        <div class="flex items-center gap-3.5">
          <div class="w-12 h-12 rounded-2xl bg-amber-800 text-amber-100 flex items-center justify-center shadow-xs">
            <mat-icon class="text-2xl">admin_panel_settings</mat-icon>
          </div>
          <div>
            <h1 class="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
              {{ lang.t().adminTitle }}
            </h1>
            <p class="text-xs sm:text-sm text-stone-600">
              {{ lang.t().adminSubtitle }}
            </p>
          </div>
        </div>

        @if (storage.isAdminLoggedIn()) {
          <div class="flex items-center gap-2 flex-wrap">
            <button 
              type="button" 
              (click)="resetDemoData()"
              id="admin-reset-demo-btn"
              class="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl border border-stone-300 transition-colors flex items-center gap-1 cursor-pointer">
              <mat-icon class="text-base">restore</mat-icon>
              <span>{{ lang.t().resetSeedData }}</span>
            </button>

            <button 
              type="button" 
              (click)="logout()"
              id="admin-logout-btn"
              class="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition-colors flex items-center gap-1 cursor-pointer">
              <mat-icon class="text-base">lock</mat-icon>
              <span>{{ lang.t().logout }}</span>
            </button>
          </div>
        }
      </div>

      <!-- Action Toast Message -->
      @if (actionToast()) {
        <div class="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs sm:text-sm font-bold flex items-center gap-2 animate-in fade-in">
          <mat-icon class="text-emerald-600 text-lg">check_circle</mat-icon>
          <span>{{ actionToast() }}</span>
        </div>
      }

      <!-- IF NOT LOGGED IN: Password Gate Card -->
      @if (!storage.isAdminLoggedIn()) {
        <div class="max-w-md mx-auto bg-white rounded-3xl border border-amber-200 p-6 sm:p-8 shadow-md space-y-5 text-center my-8 animate-in zoom-in-95 duration-150">
          <div class="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
            <mat-icon class="text-3xl">lock</mat-icon>
          </div>

          <div class="space-y-1">
            <h2 class="text-xl font-extrabold text-stone-900">
              {{ lang.t().adminPinPrompt }}
            </h2>
            <p class="text-xs text-stone-500">
              Please enter the administrator passcode to review applications.
            </p>
          </div>

          <form [formGroup]="pinForm" (ngSubmit)="login()" class="space-y-4 text-left">
            <div>
              <label class="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5" for="adminPinInput">
                Passcode
              </label>
              <div class="relative">
                <input 
                  id="adminPinInput"
                  type="password" 
                  formControlName="pin"
                  [placeholder]="lang.t().adminPinPlaceholder"
                  class="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-stone-900 text-sm font-medium"
                />
              </div>
            </div>

            @if (loginError()) {
              <p class="text-xs font-bold text-rose-600 flex items-center gap-1">
                <mat-icon class="text-sm">error</mat-icon>
                {{ lang.t().invalidPin }}
              </p>
            }

            <button 
              type="submit" 
              id="admin-login-submit-btn"
              class="w-full py-3 px-4 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer text-sm">
              <mat-icon class="text-lg">vpn_key</mat-icon>
              <span>{{ lang.t().loginBtn }}</span>
            </button>
          </form>

          <div class="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 text-center font-mono">
            {{ lang.t().adminDemoHint }}
          </div>
        </div>
      } @else {

        <!-- IF LOGGED IN: Admin Management Dashboard -->
        <div class="space-y-6">
          
          <!-- Tab Navigation -->
          <div class="flex items-center gap-2 border-b border-amber-200/80 pb-2">
            <button 
              type="button" 
              (click)="activeTab.set('pending')"
              id="tab-pending-btn"
              class="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
              [class.bg-amber-700]="activeTab() === 'pending'"
              [class.text-white]="activeTab() === 'pending'"
              [class.shadow-xs]="activeTab() === 'pending'"
              [class.bg-white]="activeTab() !== 'pending'"
              [class.text-stone-700]="activeTab() !== 'pending'"
              [class.hover:bg-amber-50]="activeTab() !== 'pending'">
              <mat-icon class="text-base">pending_actions</mat-icon>
              <span>{{ lang.t().pendingApprovals }}</span>
              <span 
                class="px-2 py-0.5 rounded-full text-xs font-extrabold"
                [class.bg-white]="activeTab() === 'pending'"
                [class.text-amber-900]="activeTab() === 'pending'"
                [class.bg-rose-600]="activeTab() !== 'pending' && storage.pendingCount() > 0"
                [class.text-white]="activeTab() !== 'pending' && storage.pendingCount() > 0"
                [class.bg-stone-200]="activeTab() !== 'pending' && storage.pendingCount() === 0"
                [class.text-stone-700]="activeTab() !== 'pending' && storage.pendingCount() === 0">
                {{ storage.pendingCount() }}
              </span>
            </button>

            <button 
              type="button" 
              (click)="activeTab.set('approved')"
              id="tab-approved-btn"
              class="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
              [class.bg-amber-700]="activeTab() === 'approved'"
              [class.text-white]="activeTab() === 'approved'"
              [class.shadow-xs]="activeTab() === 'approved'"
              [class.bg-white]="activeTab() !== 'approved'"
              [class.text-stone-700]="activeTab() !== 'approved'"
              [class.hover:bg-amber-50]="activeTab() !== 'approved'">
              <mat-icon class="text-base">check_circle</mat-icon>
              <span>{{ lang.t().approvedProviders }}</span>
              <span 
                class="px-2 py-0.5 rounded-full text-xs font-bold"
                [class.bg-white]="activeTab() === 'approved'"
                [class.text-amber-900]="activeTab() === 'approved'"
                [class.bg-stone-200]="activeTab() !== 'approved'"
                [class.text-stone-700]="activeTab() !== 'approved'">
                {{ storage.totalApprovedCount() }}
              </span>
            </button>
          </div>

          <!-- TAB 1: Pending Approvals -->
          @if (activeTab() === 'pending') {
            @if (storage.pendingProviders().length > 0) {
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                @for (provider of storage.pendingProviders(); track provider.id) {
                  <div 
                    [id]="'pending-card-' + provider.id"
                    class="bg-white rounded-2xl border-2 border-amber-300 p-5 shadow-sm flex flex-col justify-between space-y-4">
                    
                    <div class="space-y-3">
                      
                      <!-- Top row status badge -->
                      <div class="flex items-center justify-between">
                        <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                          <mat-icon class="text-xs">hourglass_empty</mat-icon>
                          {{ lang.t().pendingStatus }}
                        </span>
                        <span class="text-[11px] text-stone-400 font-mono">
                          Applied: {{ provider.createdAt | date:'short' }}
                        </span>
                      </div>

                      <!-- Provider Details -->
                      <div class="flex items-start gap-3.5">
                        <img 
                          [src]="provider.photoUrl" 
                          [alt]="provider.name" 
                          class="w-16 h-16 rounded-2xl object-cover border-2 border-amber-200 shadow-xs bg-amber-800 flex-shrink-0"
                          referrerpolicy="no-referrer"
                        />
                        <div class="flex-1 min-w-0">
                          <h3 class="font-extrabold text-stone-900 text-lg leading-tight">
                            {{ provider.name }}
                          </h3>
                          <div class="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md inline-block mt-1">
                            {{ lang.getSkillLabel(provider.skill, provider.customSkill) }}
                          </div>
                          <div class="flex items-center gap-1 text-xs text-stone-600 font-medium mt-1">
                            <mat-icon class="text-xs text-amber-700">location_on</mat-icon>
                            <span>{{ provider.location }}</span>
                          </div>
                        </div>
                      </div>

                      <!-- Contact & Availability Info -->
                      <div class="p-3 bg-stone-50 rounded-xl text-xs space-y-1.5 border border-stone-200">
                        <div class="flex items-center justify-between">
                          <span class="text-stone-500 font-medium">Mobile Phone:</span>
                          <span class="font-bold font-mono text-stone-900 text-sm">{{ provider.phone }}</span>
                        </div>
                        <div class="flex items-center justify-between">
                          <span class="text-stone-500 font-medium">Availability:</span>
                          <span class="font-bold text-stone-800">{{ lang.getAvailabilityLabel(provider.availability) }}</span>
                        </div>
                        @if (provider.experienceYears) {
                          <div class="flex items-center justify-between">
                            <span class="text-stone-500 font-medium">Experience:</span>
                            <span class="font-bold text-stone-800">{{ provider.experienceYears }} Years</span>
                          </div>
                        }
                      </div>

                      <!-- Bio -->
                      @if (provider.bio) {
                        <p class="text-xs text-stone-600 italic bg-amber-50/40 p-2.5 rounded-lg border border-amber-200/50">
                          "{{ provider.bio }}"
                        </p>
                      }
                    </div>

                    <!-- Approve & Reject Action Buttons -->
                    <div class="flex items-center gap-2 pt-3 border-t border-stone-100">
                      <button 
                        type="button" 
                        (click)="approve(provider)"
                        [id]="'approve-btn-' + provider.id"
                        class="flex-1 py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                        <mat-icon class="text-base">check</mat-icon>
                        <span>{{ lang.t().approveBtn }}</span>
                      </button>

                      <button 
                        type="button" 
                        (click)="reject(provider)"
                        [id]="'reject-btn-' + provider.id"
                        class="py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs sm:text-sm rounded-xl border border-rose-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                        <mat-icon class="text-base">close</mat-icon>
                        <span>{{ lang.t().rejectBtn }}</span>
                      </button>
                    </div>

                  </div>
                }
              </div>
            } @else {
              <!-- No Pending Applications Empty State -->
              <div class="bg-white rounded-3xl border border-amber-200 p-8 sm:p-12 text-center max-w-xl mx-auto space-y-4 shadow-sm">
                <div class="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <mat-icon class="text-3xl">task_alt</mat-icon>
                </div>
                <h3 class="text-xl font-bold text-stone-900">
                  {{ lang.t().noPending }}
                </h3>
                <p class="text-stone-600 text-sm leading-relaxed">
                  {{ lang.t().noPendingDesc }}
                </p>
                <div class="pt-2">
                  <a routerLink="/register" class="inline-flex items-center gap-1.5 px-5 py-2.5 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl text-sm transition-colors">
                    <mat-icon class="text-base">add</mat-icon>
                    <span>Test Submitting a Provider</span>
                  </a>
                </div>
              </div>
            }
          }

          <!-- TAB 2: Approved Providers Directory Management -->
          @if (activeTab() === 'approved') {
            <div class="bg-white rounded-2xl border border-amber-200/90 shadow-sm overflow-hidden">
              
              <!-- Table Controls -->
              <div class="p-4 bg-amber-50/50 border-b border-amber-200/70 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div class="relative flex-1 max-w-md">
                  <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">search</mat-icon>
                  <input 
                    type="text" 
                    [value]="approvedSearch()"
                    (input)="approvedSearch.set($any($event.target).value)"
                    placeholder="Search approved providers by name or village..."
                    class="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-stone-300 text-xs sm:text-sm text-stone-900 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <span class="text-xs text-stone-600 font-bold self-center">
                  Total: {{ filteredApproved().length }} Active Providers
                </span>
              </div>

              <!-- List / Table View -->
              <div class="divide-y divide-stone-100">
                @for (provider of filteredApproved(); track provider.id) {
                  <div class="p-4 hover:bg-amber-50/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    
                    <div class="flex items-center gap-3">
                      <img 
                        [src]="provider.photoUrl" 
                        [alt]="provider.name" 
                        class="w-12 h-12 rounded-xl object-cover border border-amber-200 bg-amber-800 flex-shrink-0"
                        referrerpolicy="no-referrer"
                      />
                      <div>
                        <div class="flex items-center gap-2 flex-wrap">
                          <h4 class="font-bold text-stone-900 text-sm sm:text-base">{{ provider.name }}</h4>
                          <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900">
                            {{ lang.getSkillLabel(provider.skill, provider.customSkill) }}
                          </span>
                        </div>
                        <div class="flex items-center gap-3 text-xs text-stone-500 mt-0.5">
                          <span class="flex items-center gap-0.5">
                            <mat-icon class="text-xs text-amber-700">location_on</mat-icon>
                            {{ provider.location }}
                          </span>
                          <span class="font-mono font-semibold text-stone-700">{{ provider.phone }}</span>
                          <span class="text-amber-700 font-bold">★ {{ provider.averageRating }} ({{ provider.totalReviews }})</span>
                        </div>
                      </div>
                    </div>

                    <div class="flex items-center gap-2 self-end sm:self-center">
                      <a 
                        [routerLink]="['/services']" 
                        [queryParams]="{ q: provider.name }"
                        class="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs rounded-lg border border-amber-300">
                        View in Public Directory
                      </a>

                      <button 
                        type="button" 
                        (click)="deleteProvider(provider)"
                        [id]="'delete-btn-' + provider.id"
                        class="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-lg border border-rose-200 flex items-center gap-1 cursor-pointer">
                        <mat-icon class="text-sm">delete</mat-icon>
                        <span>{{ lang.t().deleteBtn }}</span>
                      </button>
                    </div>

                  </div>
                }
              </div>

            </div>
          }

        </div>
      }

    </div>
  `
})
export class AdminComponent {
  readonly lang = inject(LanguageService);
  readonly storage = inject(StorageService);
  private readonly fb = inject(FormBuilder);

  readonly activeTab = signal<'pending' | 'approved'>('pending');
  readonly loginError = signal<boolean>(false);
  readonly actionToast = signal<string | null>(null);
  readonly approvedSearch = signal<string>('');

  readonly pinForm = this.fb.group({
    pin: ['', Validators.required]
  });

  filteredApproved = computed(() => {
    const list = this.storage.approvedProvidersWithRatings();
    const query = this.approvedSearch().trim().toLowerCase();
    if (!query) return list;
    return list.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.location.toLowerCase().includes(query) ||
      p.skill.toLowerCase().includes(query) ||
      p.phone.includes(query)
    );
  });

  login() {
    this.loginError.set(false);
    const pin = (this.pinForm.value.pin || '').trim();
    if (this.storage.loginAdmin(pin)) {
      this.loginError.set(false);
      this.pinForm.reset();
      this.showToast('Logged in as Administrator.');
    } else {
      this.loginError.set(true);
    }
  }

  logout() {
    this.storage.logoutAdmin();
    this.showToast('Logged out of Admin Portal.');
  }

  async approve(provider: Provider) {
    await this.storage.approveProvider(provider.id);
    this.showToast(`Approved "${provider.name}". Now live in village directory!`);
  }

  async reject(provider: Provider) {
    if (confirm(`Reject and remove application from "${provider.name}"?`)) {
      await this.storage.rejectProvider(provider.id);
      this.showToast(`Application from "${provider.name}" rejected.`);
    }
  }

  async deleteProvider(provider: Provider) {
    if (confirm(`Are you sure you want to permanently delete "${provider.name}" from the directory?`)) {
      await this.storage.deleteProvider(provider.id);
      this.showToast(`Removed "${provider.name}" from directory.`);
    }
  }

  async resetDemoData() {
    if (confirm(this.lang.t().resetSeedConfirm)) {
      await this.storage.resetSeedData();
      this.showToast(this.lang.t().resetSuccess);
    }
  }

  private showToast(msg: string) {
    this.actionToast.set(msg);
    setTimeout(() => {
      this.actionToast.set(null);
    }, 4000);
  }
}
