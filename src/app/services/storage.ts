import { Injectable, signal, computed } from '@angular/core';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where, 
  increment,
  writeBatch,
  Unsubscribe 
} from 'firebase/firestore';
import { db } from './firebase.config';
import { 
  Provider, 
  Review, 
  ProviderWithRating, 
  SkillType, 
  AvailabilityType, 
  ProviderStatus,
  OtpSession 
} from '../models/provider.model';

const STORAGE_KEY_ADMIN_AUTH = 'localconnect_admin_logged_in';
const STORAGE_KEY_WORKER_AUTH = 'loggedInProviderId';

// High-quality SVG avatars for sample providers
const createSvgAvatar = (bg: string, text: string, iconBg: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
    <rect width="160" height="160" rx="32" fill="${bg}"/>
    <circle cx="80" cy="58" r="30" fill="${iconBg}"/>
    <path d="M30 142 C30 102 50 92 80 92 C110 92 130 102 130 142 Z" fill="${iconBg}"/>
    <text x="80" y="66" font-family="sans-serif" font-size="22" font-weight="bold" fill="#ffffff" text-anchor="middle">${text}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const SEED_PROVIDERS: Provider[] = [
  {
    id: 'prov-1',
    name: 'K. Murugesan (முருகேசன்)',
    photoUrl: createSvgAvatar('#0284c7', 'KM', '#0369a1'),
    phone: '9842156780',
    skill: 'Electrician',
    location: 'Pollachi (பொள்ளாச்சி)',
    availability: 'now',
    isVisible: true,
    isAvailableRightNow: true,
    experienceYears: 12,
    bio: 'House wiring, motor rewinding, inverter installation, and 3-phase agricultural pump maintenance.',
    status: 'approved',
    createdAt: '2026-08-10T09:00:00Z',
    approvedAt: '2026-08-10T10:00:00Z',
    contactCount: 48
  },
  {
    id: 'prov-2',
    name: 'S. Selvakumar (செல்வக்குமார்)',
    photoUrl: createSvgAvatar('#0d9488', 'SS', '#0f766e'),
    phone: '9443218765',
    skill: 'Plumber',
    location: 'Tenkasi (தென்காசி)',
    availability: 'today',
    isVisible: true,
    isAvailableRightNow: true,
    experienceYears: 9,
    bio: 'Pipeline fitting, borewell motor connection, bathroom sanitary works, and leak repairs.',
    status: 'approved',
    createdAt: '2026-08-12T11:30:00Z',
    approvedAt: '2026-08-12T12:00:00Z',
    contactCount: 34
  },
  {
    id: 'prov-3',
    name: 'M. Manimegalai (மணிமேகலை)',
    photoUrl: createSvgAvatar('#db2777', 'MM', '#be185d'),
    phone: '9789456123',
    skill: 'Tailor',
    location: 'Thiruvannamalai (திருவண்ணாமலை)',
    availability: 'now',
    isVisible: true,
    isAvailableRightNow: true,
    experienceYears: 15,
    bio: 'Blouse Aari embroidery, churidar, school uniforms, and gents clothing alteration specialist.',
    status: 'approved',
    createdAt: '2026-08-14T08:15:00Z',
    approvedAt: '2026-08-14T09:00:00Z',
    contactCount: 52
  },
  {
    id: 'prov-4',
    name: 'P. Anand Raj, M.Sc (ஆனந்த் ராஜ்)',
    photoUrl: createSvgAvatar('#7c3aed', 'AR', '#6d28d9'),
    phone: '9865321478',
    skill: 'Tutor',
    location: 'Kumbakonam (கும்பகோணம்)',
    availability: 'this_week',
    isVisible: true,
    isAvailableRightNow: true,
    experienceYears: 7,
    bio: 'Maths and Science tuition for 6th to 12th standard (State Board & CBSE). Special care for slow learners.',
    status: 'approved',
    createdAt: '2026-08-15T14:20:00Z',
    approvedAt: '2026-08-15T15:00:00Z',
    contactCount: 29
  },
  {
    id: 'prov-5',
    name: 'V. Palanichamy (பழனிச்சாமி)',
    photoUrl: createSvgAvatar('#d97706', 'VP', '#b45309'),
    phone: '9488765432',
    skill: 'Carpenter',
    location: 'Gobichettipalayam (கோபி)',
    availability: 'today',
    isVisible: true,
    isAvailableRightNow: true,
    experienceYears: 20,
    bio: 'Teakwood pooja doors, modular kitchen cabinets, wooden cot, and window frame repairs.',
    status: 'approved',
    createdAt: '2026-08-16T10:00:00Z',
    approvedAt: '2026-08-16T11:00:00Z',
    contactCount: 41
  },
  {
    id: 'prov-6',
    name: 'G. Vignesh (விக்னேஷ்)',
    photoUrl: createSvgAvatar('#ea580c', 'GV', '#c2410c'),
    phone: '9944123890',
    skill: 'Auto Driver',
    location: 'Sivakasi (சிவகாசி)',
    availability: 'now',
    isVisible: true,
    isAvailableRightNow: true,
    experienceYears: 6,
    bio: '24x7 local passenger auto, hospital emergency trips, and village goods parcel delivery.',
    status: 'approved',
    createdAt: '2026-08-18T07:45:00Z',
    approvedAt: '2026-08-18T08:30:00Z',
    contactCount: 65
  },
  {
    id: 'prov-7',
    name: 'R. Muthuvel Mesthri (முத்துவேல் மேஸ்திரி)',
    photoUrl: createSvgAvatar('#475569', 'RM', '#334155'),
    phone: '9629874512',
    skill: 'Mason',
    location: 'Ambasamudram (அம்பாசமுத்திரம்)',
    availability: 'this_week',
    isVisible: true,
    isAvailableRightNow: true,
    experienceYears: 25,
    bio: 'Building construction, compound wall, tile & granite laying, and plastering work.',
    status: 'approved',
    createdAt: '2026-08-20T16:00:00Z',
    approvedAt: '2026-08-20T17:00:00Z',
    contactCount: 38
  },
  {
    id: 'prov-8',
    name: 'C. Karthikeyan (கார்த்திகேயன்)',
    photoUrl: createSvgAvatar('#059669', 'CK', '#047857'),
    phone: '9751234890',
    skill: 'Painter',
    location: 'Dindigul (திண்டுக்கல்)',
    availability: 'today',
    isVisible: true,
    isAvailableRightNow: true,
    experienceYears: 8,
    bio: 'Interior & exterior emulsion painting, wood polish, and wall putty finish with own spraying gear.',
    status: 'approved',
    createdAt: '2026-08-22T13:10:00Z',
    approvedAt: '2026-08-22T14:00:00Z',
    contactCount: 22
  },
  {
    id: 'prov-9',
    name: 'A. Subbiah (சுப்பையா)',
    photoUrl: createSvgAvatar('#4f46e5', 'AS', '#4338ca'),
    phone: '9843678129',
    skill: 'Appliance Repair',
    location: 'Melur (மேலூர்)',
    availability: 'now',
    isVisible: true,
    isAvailableRightNow: true,
    experienceYears: 11,
    bio: 'Washing machine, refrigerator, grinder, mixer, and fan repair on-site in surrounding villages.',
    status: 'approved',
    createdAt: '2026-08-24T09:40:00Z',
    approvedAt: '2026-08-24T10:30:00Z',
    contactCount: 57
  },
  {
    id: 'prov-10',
    name: 'D. Kasthuri (கஸ்தூரி)',
    photoUrl: createSvgAvatar('#ec4899', 'DK', '#db2777'),
    phone: '9442198765',
    skill: 'Tailor',
    location: 'Sankarankovil (சங்கரன்கோவில்)',
    availability: 'today',
    isVisible: true,
    isAvailableRightNow: true,
    experienceYears: 14,
    bio: 'Traditional silk saree blouse stitching, designer cuts, wedding party wear, and quick alterations.',
    status: 'approved',
    createdAt: '2026-08-25T11:00:00Z',
    approvedAt: '2026-08-25T12:00:00Z',
    contactCount: 31
  }
];

const SEED_REVIEWS: Review[] = [
  // Provider 1 (Electrician - Pollachi) - 3 reviews
  {
    id: 'rev-1',
    providerId: 'prov-1',
    reviewerName: 'V. Sundaram',
    reviewerLocation: 'Pollachi North',
    rating: 5,
    comment: 'Quick response for farm motor wiring. Arrived within 30 minutes and resolved the issue neatly.',
    createdAt: '2026-08-15T10:00:00Z'
  },
  {
    id: 'rev-2',
    providerId: 'prov-1',
    reviewerName: 'K. Lakshmi',
    reviewerLocation: 'Anaimalai',
    rating: 5,
    comment: 'Very polite and fair pricing for house electrical fitting.',
    createdAt: '2026-08-18T14:30:00Z'
  },
  {
    id: 'rev-3',
    providerId: 'prov-1',
    reviewerName: 'R. Balasubramanian',
    reviewerLocation: 'Kinathukadavu',
    rating: 5,
    comment: 'Installed our solar inverter setup with safety earthing. Excellent work and advice.',
    createdAt: '2026-08-21T09:15:00Z'
  },

  // Provider 2 (Plumber - Tenkasi) - 3 reviews
  {
    id: 'rev-4',
    providerId: 'prov-2',
    reviewerName: 'Thiru. Muthu',
    reviewerLocation: 'Tenkasi Town',
    rating: 4,
    comment: 'Fixed overhead tank pipeline leak without damaging tiles. Excellent plumbing knowledge.',
    createdAt: '2026-08-19T11:20:00Z'
  },
  {
    id: 'rev-5',
    providerId: 'prov-2',
    reviewerName: 'G. Meenakshi',
    reviewerLocation: 'Courtrallam Road',
    rating: 5,
    comment: 'Bathroom sanitary fittings and tap replacements done with high cleanliness. Highly recommended.',
    createdAt: '2026-08-22T15:45:00Z'
  },
  {
    id: 'rev-6',
    providerId: 'prov-2',
    reviewerName: 'M. Senthil Nathan',
    reviewerLocation: 'Surandai',
    rating: 5,
    comment: 'Borewell connection was completed in 2 hours. Very punctual worker.',
    createdAt: '2026-08-24T18:10:00Z'
  },

  // Provider 3 (Tailor - Thiruvannamalai) - 3 reviews
  {
    id: 'rev-7',
    providerId: 'prov-3',
    reviewerName: 'S. Revathi',
    reviewerLocation: 'Thiruvannamalai',
    rating: 5,
    comment: 'Aari work embroidery was tailored with perfect finishing in time for our family function.',
    createdAt: '2026-08-21T16:00:00Z'
  },
  {
    id: 'rev-8',
    providerId: 'prov-3',
    reviewerName: 'K. Devi',
    reviewerLocation: 'Chengam',
    rating: 5,
    comment: 'Stitched school uniform sets for my children with neat double-stitching. Very durable work.',
    createdAt: '2026-08-23T11:30:00Z'
  },
  {
    id: 'rev-9',
    providerId: 'prov-3',
    reviewerName: 'P. Uma Maheswari',
    reviewerLocation: 'Polur Road',
    rating: 4,
    comment: 'Perfect fitting for designer blouse. Delivers exactly on the promised date.',
    createdAt: '2026-08-25T14:00:00Z'
  },

  // Provider 4 (Tutor - Kumbakonam) - 2 reviews
  {
    id: 'rev-10',
    providerId: 'prov-4',
    reviewerName: 'B. Senthil Kumar',
    reviewerLocation: 'Kumbakonam',
    rating: 5,
    comment: 'My son scored 92% in 10th Maths after Anand master coaching. Very patient and clear.',
    createdAt: '2026-08-22T18:00:00Z'
  },
  {
    id: 'rev-11',
    providerId: 'prov-4',
    reviewerName: 'N. Radhika',
    reviewerLocation: 'Papanasam',
    rating: 5,
    comment: 'Explains complex physics formulas in simple Tamil terms. Wonderful teaching dedication.',
    createdAt: '2026-08-25T17:20:00Z'
  },

  // Provider 5 (Carpenter - Gobichettipalayam) - 3 reviews
  {
    id: 'rev-12',
    providerId: 'prov-5',
    reviewerName: 'T. Karuppasamy',
    reviewerLocation: 'Gobi Bus Stand',
    rating: 5,
    comment: 'Made a custom teakwood pooja cupboard. Beautiful carving and sturdy finish.',
    createdAt: '2026-08-20T12:00:00Z'
  },
  {
    id: 'rev-13',
    providerId: 'prov-5',
    reviewerName: 'S. Loganathan',
    reviewerLocation: 'Anthiyur',
    rating: 5,
    comment: 'Fixed broken wooden window frames and door hinges effortlessly. Honest pricing for wood.',
    createdAt: '2026-08-23T14:15:00Z'
  },
  {
    id: 'rev-14',
    providerId: 'prov-5',
    reviewerName: 'V. Jayanthi',
    reviewerLocation: 'Kavindapadi',
    rating: 5,
    comment: 'Modern kitchen cabinet shelves fitted with smooth soft-close channels. Very neat work.',
    createdAt: '2026-08-26T10:40:00Z'
  },

  // Provider 6 (Auto Driver - Sivakasi) - 3 reviews
  {
    id: 'rev-15',
    providerId: 'prov-6',
    reviewerName: 'M. Pandian',
    reviewerLocation: 'Sivakasi Bypass',
    rating: 5,
    comment: 'Very helpful night auto service for emergency hospital drop. Highly dependable brother.',
    createdAt: '2026-08-23T22:15:00Z'
  },
  {
    id: 'rev-16',
    providerId: 'prov-6',
    reviewerName: 'R. Kalaiyarasan',
    reviewerLocation: 'Thiruthangal',
    rating: 5,
    comment: 'Safe driving and fair meter charges without demanding extra fare. Respectful person.',
    createdAt: '2026-08-25T08:30:00Z'
  },
  {
    id: 'rev-17',
    providerId: 'prov-6',
    reviewerName: 'C. Valli',
    reviewerLocation: 'Satchiyapuram',
    rating: 4,
    comment: 'Helped load heavy rice bags and groceries straight to our doorstep. Thank you Vignesh!',
    createdAt: '2026-08-26T16:00:00Z'
  },

  // Provider 7 (Mason - Ambasamudram) - 2 reviews
  {
    id: 'rev-18',
    providerId: 'prov-7',
    reviewerName: 'E. Dharmaraj',
    reviewerLocation: 'Ambasamudram Market',
    rating: 5,
    comment: 'Supervised our house front portico and compound wall construction with zero material wastage.',
    createdAt: '2026-08-24T17:00:00Z'
  },
  {
    id: 'rev-19',
    providerId: 'prov-7',
    reviewerName: 'A. Joseph',
    reviewerLocation: 'Kallidaikurichi',
    rating: 5,
    comment: '25 years of real field experience shows in his flawless floor tile leveling and plastering.',
    createdAt: '2026-08-26T11:20:00Z'
  },

  // Provider 8 (Painter - Dindigul) - 2 reviews
  {
    id: 'rev-20',
    providerId: 'prov-8',
    reviewerName: 'S. Vijayan',
    reviewerLocation: 'Dindigul West',
    rating: 5,
    comment: 'Painted our entire 2-story home before Pongal. Exterior weather-coat painting was done sharply.',
    createdAt: '2026-08-25T13:45:00Z'
  },
  {
    id: 'rev-21',
    providerId: 'prov-8',
    reviewerName: 'M. Gomathi',
    reviewerLocation: 'Natham Road',
    rating: 4,
    comment: 'Smooth wall putty application and wooden door varnishing. Completed within the estimated budget.',
    createdAt: '2026-08-27T09:10:00Z'
  },

  // Provider 9 (Appliance Repair - Melur) - 3 reviews
  {
    id: 'rev-22',
    providerId: 'prov-9',
    reviewerName: 'A. Chitra',
    reviewerLocation: 'Melur Bazaar',
    rating: 5,
    comment: 'Repaired our refrigerator cooling problem in 1 hour on the same day. Saved our groceries!',
    createdAt: '2026-08-25T15:40:00Z'
  },
  {
    id: 'rev-23',
    providerId: 'prov-9',
    reviewerName: 'K. Rajendran',
    reviewerLocation: 'Kottampatti',
    rating: 5,
    comment: 'Fixed our semi-automatic washing machine spin motor issue with genuine spare parts.',
    createdAt: '2026-08-26T14:30:00Z'
  },
  {
    id: 'rev-24',
    providerId: 'prov-9',
    reviewerName: 'N. Saravanan',
    reviewerLocation: 'Alagarkoil Road',
    rating: 5,
    comment: 'Mixie coupler and coil repair done at very nominal service charge. Very honest craftsman.',
    createdAt: '2026-08-27T16:50:00Z'
  },

  // Provider 10 (Tailor - Sankarankovil) - 2 reviews
  {
    id: 'rev-25',
    providerId: 'prov-10',
    reviewerName: 'T. Karpagavalli',
    reviewerLocation: 'Sankarankovil East',
    rating: 5,
    comment: 'Stitched bridal saree blouses with matching pipings and stone borders. Gorgeous fit!',
    createdAt: '2026-08-26T18:15:00Z'
  },
  {
    id: 'rev-26',
    providerId: 'prov-10',
    reviewerName: 'B. Shenbagam',
    reviewerLocation: 'Kalugumalai',
    rating: 5,
    comment: 'Prompt delivery and very comfortable neck design cutting. Highly recommended for ladies.',
    createdAt: '2026-08-27T12:30:00Z'
  }
];

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly providersSignal = signal<Provider[]>(SEED_PROVIDERS);
  private readonly reviewsSignal = signal<Review[]>(SEED_REVIEWS);
  readonly isConnectedToFirestore = signal<boolean>(false);
  readonly isLoading = signal<boolean>(true);
  readonly errorMessage = signal<string | null>(null);

  readonly isAdminLoggedIn = signal<boolean>(this.loadAdminAuth());
  readonly loggedInProviderId = signal<string | null>(this.loadWorkerAuth());

  // Public readonly signals
  readonly providers = this.providersSignal.asReadonly();
  readonly reviews = this.reviewsSignal.asReadonly();

  // Logged-in worker computed state
  readonly isWorkerLoggedIn = computed<boolean>(() => !!this.loggedInProviderId());

  readonly loggedInProvider = computed<ProviderWithRating | null>(() => {
    const id = this.loggedInProviderId();
    if (!id) return null;
    return this.getProviderWithRatingById(id) || null;
  });

  // Filtered/Computed lists
  // Visibility Toggle: When isVisible or isAvailableRightNow is false, hide from public search
  readonly approvedProvidersWithRatings = computed<ProviderWithRating[]>(() => {
    const allProviders = this.providersSignal();
    const allReviews = this.reviewsSignal();

    return allProviders
      .filter(p => p.status === 'approved' && (p.isVisible !== false) && (p.isAvailableRightNow !== false))
      .map(provider => {
        const providerReviews = allReviews.filter(r => r.providerId === provider.id);
        const totalReviews = providerReviews.length;
        const averageRating = totalReviews > 0 
          ? Number((providerReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1))
          : 0;

        // Sort reviews descending by date
        const sortedReviews = [...providerReviews].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        return {
          ...provider,
          averageRating,
          totalReviews,
          latestReviews: sortedReviews
        };
      });
  });

  readonly pendingProviders = computed<Provider[]>(() => {
    return this.providersSignal()
      .filter(p => p.status === 'pending')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  });

  readonly pendingCount = computed<number>(() => {
    return this.pendingProviders().length;
  });

  readonly totalApprovedCount = computed<number>(() => {
    return this.approvedProvidersWithRatings().length;
  });

  readonly distinctLocations = computed<string[]>(() => {
    const locations = this.approvedProvidersWithRatings().map(p => p.location.trim());
    return Array.from(new Set(locations)).sort();
  });

  readonly distinctSkills = computed<SkillType[]>(() => {
    const skills = this.approvedProvidersWithRatings().map(p => p.skill);
    return Array.from(new Set(skills));
  });

  readonly totalDirectContacts = computed<number>(() => {
    return this.providersSignal().reduce((acc, p) => acc + (p.contactCount || 0), 0);
  });

  private unsubscribeProviders: Unsubscribe | null = null;
  private unsubscribeReviews: Unsubscribe | null = null;
  private isSeeding = false;

  constructor() {
    this.initFirestoreListeners();
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  private loadAdminAuth(): boolean {
    if (this.isBrowser()) {
      return localStorage.getItem(STORAGE_KEY_ADMIN_AUTH) === 'true';
    }
    return false;
  }

  private loadWorkerAuth(): string | null {
    if (this.isBrowser()) {
      return localStorage.getItem(STORAGE_KEY_WORKER_AUTH) || null;
    }
    return null;
  }

  /**
   * Initializes real-time Firestore listeners for 'providers' and 'reviews' collections.
   * If Firestore is connected and empty, automatically populates seed data into Firestore.
   */
  private initFirestoreListeners(): void {
    if (!this.isBrowser()) return;

    try {
      // 1. Subscribe to "providers" collection in real-time
      const providersCol = collection(db, 'providers');
      this.unsubscribeProviders = onSnapshot(
        providersCol,
        (snapshot) => {
          this.isConnectedToFirestore.set(true);
          this.isLoading.set(false);
          this.errorMessage.set(null);

          if (snapshot.empty) {
            // First time setup: initialize Firestore with initial seed providers
            this.seedFirestoreIfEmpty();
          } else {
            const list: Provider[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data();
              list.push({
                id: docSnap.id,
                name: data['name'] || '',
                photoUrl: data['photoUrl'] || '',
                phone: data['phone'] || '',
                skill: data['skill'] || 'Other',
                customSkill: data['customSkill'],
                location: data['location'] || '',
                availability: data['availability'] || 'now',
                isVisible: data['isVisible'] !== false,
                isAvailableRightNow: data['isAvailableRightNow'] !== false && data['isVisible'] !== false,
                experienceYears: data['experienceYears'],
                bio: data['bio'],
                status: data['status'] || 'approved',
                createdAt: data['createdAt'] || new Date().toISOString(),
                approvedAt: data['approvedAt'],
                contactCount: Number(data['contactCount'] || 0)
              });
            });

            // Sort by createdAt descending
            list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            this.providersSignal.set(list);
          }
        },
        (error) => {
          console.warn('Firestore providers onSnapshot error, operating in resilient offline mode:', error);
          this.isConnectedToFirestore.set(false);
          this.isLoading.set(false);
          this.errorMessage.set('Connecting to live database... Using cached offline data.');
        }
      );

      // 2. Subscribe to "reviews" collection in real-time
      const reviewsCol = collection(db, 'reviews');
      this.unsubscribeReviews = onSnapshot(
        reviewsCol,
        (snapshot) => {
          if (!snapshot.empty) {
            const list: Review[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data();
              list.push({
                id: docSnap.id,
                providerId: data['providerId'] || '',
                reviewerName: data['reviewerName'] || 'Resident',
                reviewerLocation: data['reviewerLocation'],
                rating: Number(data['rating'] || 5),
                comment: data['comment'] || '',
                createdAt: data['createdAt'] || new Date().toISOString()
              });
            });

            // Sort by createdAt descending
            list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            this.reviewsSignal.set(list);
          }
        },
        (error) => {
          console.warn('Firestore reviews onSnapshot error:', error);
        }
      );
    } catch (e) {
      console.warn('Could not establish Firestore listener:', e);
      this.isLoading.set(false);
    }
  }

  /**
   * Seeds initial providers & reviews to Firestore when first initialized.
   */
  private async seedFirestoreIfEmpty(): Promise<void> {
    if (this.isSeeding) return;
    this.isSeeding = true;

    try {
      // Double check providers collection directly
      const providersSnap = await getDocs(collection(db, 'providers'));
      if (!providersSnap.empty) {
        this.isSeeding = false;
        return;
      }

      const batch = writeBatch(db);

      for (const p of SEED_PROVIDERS) {
        const pRef = doc(db, 'providers', p.id);
        batch.set(pRef, {
          name: p.name,
          photoUrl: p.photoUrl,
          phone: p.phone,
          skill: p.skill,
          customSkill: p.customSkill || '',
          location: p.location,
          availability: p.availability,
          status: 'approved',
          isVisible: true,
          isAvailableRightNow: true,
          experienceYears: p.experienceYears ?? null,
          bio: p.bio || '',
          createdAt: p.createdAt,
          approvedAt: p.approvedAt || p.createdAt,
          contactCount: p.contactCount || 0
        });
      }

      for (const r of SEED_REVIEWS) {
        const rRef = doc(db, 'reviews', r.id);
        batch.set(rRef, {
          providerId: r.providerId,
          reviewerName: r.reviewerName,
          reviewerLocation: r.reviewerLocation || '',
          rating: r.rating,
          comment: r.comment,
          createdAt: r.createdAt
        });
      }

      await batch.commit();
      console.log('Successfully seeded initial sample providers and reviews into Firestore database!');
    } catch (e) {
      console.warn('Seed population to Firestore skipped/failed:', e);
    } finally {
      this.isSeeding = false;
    }
  }

  getProviderWithRatingById(id: string): ProviderWithRating | undefined {
    const provider = this.providersSignal().find(p => p.id === id);
    if (!provider) return undefined;

    const providerReviews = this.reviewsSignal().filter(r => r.providerId === id);
    const totalReviews = providerReviews.length;
    const averageRating = totalReviews > 0 
      ? Number((providerReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1))
      : 0;

    const sortedReviews = [...providerReviews].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return {
      ...provider,
      averageRating,
      totalReviews,
      latestReviews: sortedReviews
    };
  }

  findProviderByPhone(phone: string): Provider | undefined {
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    if (!cleanPhone || cleanPhone.length < 6) return undefined;
    return this.providersSignal().find(p => {
      const pClean = p.phone.replace(/\D/g, '').slice(-10);
      return pClean === cleanPhone;
    });
  }

  getReviewsForProvider(providerId: string): Review[] {
    return this.reviewsSignal()
      .filter(r => r.providerId === providerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  loginWorker(providerId: string): void {
    this.loggedInProviderId.set(providerId);
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEY_WORKER_AUTH, providerId);
    }
  }

  logoutWorker(): void {
    this.loggedInProviderId.set(null);
    if (this.isBrowser()) {
      localStorage.removeItem(STORAGE_KEY_WORKER_AUTH);
    }
  }

  // --- CRUD Operations connected to Firestore ---

  isPhoneRegistered(phone: string, excludeId?: string): boolean {
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    return this.providersSignal().some(p => {
      if (excludeId && p.id === excludeId) return false;
      const existingClean = p.phone.replace(/\D/g, '').slice(-10);
      return existingClean === cleanPhone;
    });
  }

  /**
   * 1. Register new provider into Firestore "providers" collection
   */
  async addProvider(data: {
    name: string;
    photoUrl?: string;
    phone: string;
    skill: SkillType;
    customSkill?: string;
    location: string;
    availability: AvailabilityType;
    experienceYears?: number;
    bio?: string;
  }): Promise<{ success: boolean; error?: string; provider?: Provider }> {
    const cleanPhone = data.phone.trim();
    if (this.isPhoneRegistered(cleanPhone)) {
      return { success: false, error: 'duplicate_phone' };
    }

    const defaultAvatar = createSvgAvatar('#0284c7', data.name.slice(0, 2).toUpperCase(), '#0369a1');
    const newId = 'prov-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);

    const newProvider: Provider = {
      id: newId,
      name: data.name.trim(),
      photoUrl: data.photoUrl && data.photoUrl.length > 20 ? data.photoUrl : defaultAvatar,
      phone: cleanPhone,
      skill: data.skill,
      customSkill: data.customSkill?.trim() || undefined,
      location: data.location.trim(),
      availability: data.availability,
      experienceYears: data.experienceYears,
      bio: data.bio?.trim() || undefined,
      status: 'pending', // Pending admin approval
      isVisible: true,
      isAvailableRightNow: true,
      createdAt: new Date().toISOString(),
      contactCount: 0
    };

    // Optimistic local update
    this.providersSignal.update(current => [newProvider, ...current]);

    // Persist to Firestore
    try {
      const docRef = doc(db, 'providers', newId);
      await setDoc(docRef, {
        name: newProvider.name,
        photoUrl: newProvider.photoUrl,
        phone: newProvider.phone,
        skill: newProvider.skill,
        customSkill: newProvider.customSkill || '',
        location: newProvider.location,
        availability: newProvider.availability,
        status: newProvider.status,
        isVisible: true,
        isAvailableRightNow: true,
        experienceYears: newProvider.experienceYears ?? null,
        bio: newProvider.bio || '',
        createdAt: newProvider.createdAt,
        contactCount: 0
      });
      return { success: true, provider: newProvider };
    } catch (e: unknown) {
      console.warn('Firestore addProvider write failed, preserved in local memory:', e);
      return { success: true, provider: newProvider };
    }
  }

  /**
   * 2. Approve provider in Firestore
   */
  async approveProvider(providerId: string): Promise<void> {
    const approvedAt = new Date().toISOString();
    // Optimistic update
    this.providersSignal.update(list => 
      list.map(p => p.id === providerId ? { ...p, status: 'approved' as ProviderStatus, approvedAt } : p)
    );

    try {
      const docRef = doc(db, 'providers', providerId);
      await updateDoc(docRef, {
        status: 'approved',
        approvedAt
      });
    } catch (e) {
      console.warn('Firestore approveProvider error:', e);
    }
  }

  /**
   * 3. Reject provider in Firestore
   */
  async rejectProvider(providerId: string): Promise<void> {
    // Optimistic update
    this.providersSignal.update(list => list.filter(p => p.id !== providerId));

    try {
      const docRef = doc(db, 'providers', providerId);
      await deleteDoc(docRef);
    } catch (e) {
      console.warn('Firestore rejectProvider error:', e);
    }
  }

  /**
   * 4. Delete provider and associated reviews in Firestore
   */
  async deleteProvider(providerId: string): Promise<void> {
    // Optimistic update
    this.providersSignal.update(list => list.filter(p => p.id !== providerId));
    this.reviewsSignal.update(list => list.filter(r => r.providerId !== providerId));

    try {
      const docRef = doc(db, 'providers', providerId);
      await deleteDoc(docRef);

      // Clean up reviews for this provider
      const reviewsQuery = query(collection(db, 'reviews'), where('providerId', '==', providerId));
      const querySnap = await getDocs(reviewsQuery);
      const batch = writeBatch(db);
      querySnap.forEach((docSnap) => {
        batch.delete(docSnap.ref);
      });
      await batch.commit();
    } catch (e) {
      console.warn('Firestore deleteProvider error:', e);
    }
  }

  /**
   * 5. Update provider profile in Firestore (Worker Dashboard edits)
   */
  async updateProviderProfile(providerId: string, updates: Partial<Provider>): Promise<boolean> {
    const current = this.providersSignal();
    const index = current.findIndex(p => p.id === providerId);
    if (index === -1) return false;

    const existing = current[index];
    const updatedProvider: Provider = {
      ...existing,
      ...updates,
      id: existing.id,
      status: existing.status,
      createdAt: existing.createdAt
    };

    // Optimistic update
    const updatedList = [...current];
    updatedList[index] = updatedProvider;
    this.providersSignal.set(updatedList);

    try {
      const docRef = doc(db, 'providers', providerId);
      const firestorePayload: Record<string, unknown> = {};
      if (updates.name !== undefined) firestorePayload['name'] = updates.name;
      if (updates.phone !== undefined) firestorePayload['phone'] = updates.phone;
      if (updates.location !== undefined) firestorePayload['location'] = updates.location;
      if (updates.skill !== undefined) firestorePayload['skill'] = updates.skill;
      if (updates.customSkill !== undefined) firestorePayload['customSkill'] = updates.customSkill;
      if (updates.availability !== undefined) firestorePayload['availability'] = updates.availability;
      if (updates.experienceYears !== undefined) firestorePayload['experienceYears'] = updates.experienceYears;
      if (updates.bio !== undefined) firestorePayload['bio'] = updates.bio;
      if (updates.isVisible !== undefined) firestorePayload['isVisible'] = updates.isVisible;
      if (updates.isAvailableRightNow !== undefined) firestorePayload['isAvailableRightNow'] = updates.isAvailableRightNow;

      await updateDoc(docRef, firestorePayload);
      return true;
    } catch (e) {
      console.warn('Firestore updateProviderProfile error:', e);
      return true;
    }
  }

  /**
   * 6. Toggle provider visibility in Firestore
   */
  async toggleProviderVisibility(providerId: string, isAvailableRightNow: boolean): Promise<void> {
    await this.updateProviderProfile(providerId, {
      isVisible: isAvailableRightNow,
      isAvailableRightNow
    });
  }

  /**
   * 7. Add review into Firestore "reviews" collection
   */
  async addReview(data: {
    providerId: string;
    reviewerName: string;
    reviewerLocation?: string;
    rating: number;
    comment?: string;
  }): Promise<Review> {
    const newId = 'rev-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    const newReview: Review = {
      id: newId,
      providerId: data.providerId,
      reviewerName: data.reviewerName.trim() || 'Village Resident',
      reviewerLocation: data.reviewerLocation?.trim(),
      rating: Math.max(1, Math.min(5, data.rating)),
      comment: data.comment?.trim() || '',
      createdAt: new Date().toISOString()
    };

    // Optimistic update
    this.reviewsSignal.update(list => [newReview, ...list]);

    try {
      const docRef = doc(db, 'reviews', newId);
      await setDoc(docRef, {
        providerId: newReview.providerId,
        reviewerName: newReview.reviewerName,
        reviewerLocation: newReview.reviewerLocation || '',
        rating: newReview.rating,
        comment: newReview.comment,
        createdAt: newReview.createdAt
      });
    } catch (e) {
      console.warn('Firestore addReview error:', e);
    }

    return newReview;
  }

  /**
   * 8. Increment contact count in Firestore
   */
  async logContact(providerId: string): Promise<void> {
    // Optimistic update
    this.providersSignal.update(list =>
      list.map(p => p.id === providerId ? { ...p, contactCount: (p.contactCount || 0) + 1 } : p)
    );

    try {
      const docRef = doc(db, 'providers', providerId);
      await updateDoc(docRef, {
        contactCount: increment(1)
      });
    } catch (e) {
      console.warn('Firestore logContact error:', e);
    }
  }

  /**
   * 9. Temporary OTP session management in Firestore "otpSessions" collection
   */
  async createOtpSession(phone: string, otp: string): Promise<OtpSession> {
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 10 * 60 * 1000).toISOString(); // 10 minutes expiry

    const session: OtpSession = {
      id: cleanPhone,
      phone: cleanPhone,
      otp,
      createdAt: now.toISOString(),
      expiresAt
    };

    try {
      const docRef = doc(db, 'otpSessions', cleanPhone);
      await setDoc(docRef, {
        phone: cleanPhone,
        otp,
        createdAt: session.createdAt,
        expiresAt: session.expiresAt
      });
    } catch (e) {
      console.warn('Firestore createOtpSession write error:', e);
    }

    return session;
  }

  /**
   * 10. Verify OTP Session from Firestore
   */
  async verifyOtpSession(phone: string, enteredOtp: string): Promise<boolean> {
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);

    try {
      const docRef = doc(db, 'otpSessions', cleanPhone);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const expectedOtp = data['otp'];
        const expiresAt = new Date(data['expiresAt']).getTime();
        const now = Date.now();

        if (now <= expiresAt && expectedOtp === enteredOtp) {
          // Remove session on successful verification
          try {
            await deleteDoc(docRef);
          } catch {
            // ignore
          }
          return true;
        }
      }
    } catch (e) {
      console.warn('Firestore verifyOtpSession error:', e);
    }

    return false;
  }

  // --- Admin Auth ---
  loginAdmin(passcode: string): boolean {
    if (passcode.trim() === 'admin123' || passcode.trim() === 'namma2026') {
      this.isAdminLoggedIn.set(true);
      if (this.isBrowser()) {
        localStorage.setItem(STORAGE_KEY_ADMIN_AUTH, 'true');
      }
      return true;
    }
    return false;
  }

  logoutAdmin(): void {
    this.isAdminLoggedIn.set(false);
    if (this.isBrowser()) {
      localStorage.removeItem(STORAGE_KEY_ADMIN_AUTH);
    }
  }

  // --- Reset seed data into Firestore ---
  async resetSeedData(): Promise<void> {
    this.providersSignal.set(SEED_PROVIDERS);
    this.reviewsSignal.set(SEED_REVIEWS);

    try {
      const batch = writeBatch(db);

      for (const p of SEED_PROVIDERS) {
        const pRef = doc(db, 'providers', p.id);
        batch.set(pRef, {
          name: p.name,
          photoUrl: p.photoUrl,
          phone: p.phone,
          skill: p.skill,
          customSkill: p.customSkill || '',
          location: p.location,
          availability: p.availability,
          status: 'approved',
          isVisible: true,
          isAvailableRightNow: true,
          experienceYears: p.experienceYears ?? null,
          bio: p.bio || '',
          createdAt: p.createdAt,
          approvedAt: p.approvedAt || p.createdAt,
          contactCount: p.contactCount || 0
        });
      }

      for (const r of SEED_REVIEWS) {
        const rRef = doc(db, 'reviews', r.id);
        batch.set(rRef, {
          providerId: r.providerId,
          reviewerName: r.reviewerName,
          reviewerLocation: r.reviewerLocation || '',
          rating: r.rating,
          comment: r.comment,
          createdAt: r.createdAt
        });
      }

      await batch.commit();
    } catch (e) {
      console.warn('Reset seed data to Firestore error:', e);
    }
  }
}
