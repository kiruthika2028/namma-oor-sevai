import { Injectable, signal, computed } from '@angular/core';
import { AppLanguage, AvailabilityType, SkillType } from '../models/provider.model';

export interface Translations {
  appName: string;
  appSubtitle: string;
  tagline: string;
  home: string;
  findServices: string;
  registerProvider: string;
  adminPanel: string;
  language: string;
  
  // Hero
  heroTitle: string;
  heroHighlight: string;
  heroDescription: string;
  searchPlaceholder: string;
  searchBtn: string;
  browseAll: string;
  
  // Stats
  statProviders: string;
  statVillages: string;
  statCategories: string;
  statConnections: string;
  
  // Quick categories
  popularServices: string;
  popularServicesDesc: string;
  allCategories: string;
  
  // Directory & Filters
  directoryTitle: string;
  directoryDesc: string;
  filterBySkill: string;
  filterByLocation: string;
  filterByAvailability: string;
  sortBy: string;
  sortHighestRated: string;
  sortMostReviews: string;
  sortNewest: string;
  allSkills: string;
  allLocations: string;
  allAvailabilities: string;
  resultsCount: string;
  resetFilters: string;
  noResultsTitle: string;
  noResultsDesc: string;
  registerCtaTitle: string;
  registerCtaDesc: string;
  
  // Provider Card & Detail
  callNow: string;
  whatsapp: string;
  showContact: string;
  hideContact: string;
  viewReviews: string;
  writeReview: string;
  reviewsCount: string;
  noReviewsYet: string;
  experienceLabel: string;
  locationLabel: string;
  availabilityLabel: string;
  verifiedLocal: string;
  
  // Registration Form
  regTitle: string;
  regSubtitle: string;
  fullName: string;
  fullNamePlaceholder: string;
  photoUpload: string;
  photoUploadHint: string;
  changePhoto: string;
  phoneNumber: string;
  phonePlaceholder: string;
  phoneHint: string;
  skillLabel: string;
  selectSkill: string;
  otherSkillLabel: string;
  otherSkillPlaceholder: string;
  villageLocation: string;
  villagePlaceholder: string;
  availabilityOption: string;
  experienceYears: string;
  experiencePlaceholder: string;
  bioLabel: string;
  bioPlaceholder: string;
  submitReg: string;
  submitting: string;
  regSuccessTitle: string;
  regSuccessDesc: string;
  regDuplicatePhone: string;
  regRequiredFields: string;
  captchaLabel: string;
  captchaPrompt: string;
  captchaPlaceholder: string;
  captchaError: string;
  captchaRefresh: string;
  
  // Review Modal
  rateProvider: string;
  yourRating: string;
  reviewerName: string;
  reviewerNamePlaceholder: string;
  reviewerVillage: string;
  reviewerVillagePlaceholder: string;
  reviewComment: string;
  reviewCommentPlaceholder: string;
  submitReview: string;
  reviewSuccess: string;
  cancel: string;
  close: string;
  
  // Admin Panel
  adminTitle: string;
  adminSubtitle: string;
  adminPinPrompt: string;
  adminPinPlaceholder: string;
  loginBtn: string;
  invalidPin: string;
  logout: string;
  pendingApprovals: string;
  approvedProviders: string;
  approveBtn: string;
  rejectBtn: string;
  deleteBtn: string;
  noPending: string;
  noPendingDesc: string;
  resetSeedData: string;
  resetSeedConfirm: string;
  resetSuccess: string;
  approvedStatus: string;
  pendingStatus: string;
  rejectedStatus: string;
  adminDemoHint: string;

  // Worker Login & OTP Flow
  workerLogin: string;
  workerDashboard: string;
  workerLoginTitle: string;
  workerLoginSubtitle: string;
  enterPhonePrompt: string;
  phoneInputPlaceholder: string;
  sendOtpBtn: string;
  sendingOtp: string;
  phoneNotFound: string;
  otpSentBanner: string;
  enterOtpPrompt: string;
  otpPlaceholder: string;
  verifyAndLoginBtn: string;
  verifying: string;
  invalidOtp: string;
  resendOtp: string;
  changePhone: string;
  notRegisteredYet: string;
  workerLogout: string;
  demoWorkerHint: string;

  // Worker Dashboard
  myDashboard: string;
  profileSummary: string;
  visibilityStatus: string;
  statusAvailable: string;
  statusNotAvailable: string;
  visibilityHelp: string;
  statsOverview: string;
  totalReviewsReceived: string;
  averageRating: string;
  profileStatus: string;
  directInquiries: string;
  myReviewsTitle: string;
  noReviewsForWorker: string;
  editProfileTitle: string;
  editProfileSubtitle: string;
  saveChanges: string;
  savingChanges: string;
  savedSuccessfully: string;
  pendingNotice: string;
  rejectedNotice: string;
  switchAccount: string;
  viewPublicCard: string;
  visibleInDirectory: string;
  hiddenFromDirectory: string;

  // Skills
  skills: Record<SkillType, string>;
  
  // Availabilities
  availabilities: Record<AvailabilityType, string>;
}

const EN_TRANSLATIONS: Translations = {
  appName: 'LocalConnect',
  appSubtitle: 'namma ஊர் சேவைகள்',
  tagline: 'Trusted local service providers right in your village & neighborhood',
  home: 'Home',
  findServices: 'Find Services',
  registerProvider: 'Join as Provider',
  adminPanel: 'Admin',
  language: 'Language',
  
  heroTitle: 'Find Trusted Skilled Hands in',
  heroHighlight: 'Your Village & Town',
  heroDescription: 'Replacing word-of-mouth with instant, verified local contacts. Connect directly with trusted electricians, plumbers, carpenters, tutors, tailors, and drivers in your area.',
  searchPlaceholder: 'Search service, village name, or provider name...',
  searchBtn: 'Search',
  browseAll: 'Browse All Providers',
  
  statProviders: 'Active Providers',
  statVillages: 'Villages & Towns',
  statCategories: 'Skill Categories',
  statConnections: 'Direct Calls Made',
  
  popularServices: 'Browse by Essential Services',
  popularServicesDesc: 'Find reliable, verified neighborhood experts ready to help today.',
  allCategories: 'All Categories',
  
  directoryTitle: 'Village Service Directory',
  directoryDesc: 'Search, filter, and contact verified local technicians and helpers directly.',
  filterBySkill: 'Filter by Skill',
  filterByLocation: 'Village / Location',
  filterByAvailability: 'Availability',
  sortBy: 'Sort By',
  sortHighestRated: 'Highest Rated',
  sortMostReviews: 'Most Reviewed',
  sortNewest: 'Recently Added',
  allSkills: 'All Skills',
  allLocations: 'All Locations',
  allAvailabilities: 'Any Availability',
  resultsCount: 'providers found',
  resetFilters: 'Reset Filters',
  noResultsTitle: 'No providers found matching your search',
  noResultsDesc: 'Try adjusting your search terms, changing the location filter, or registering as the first provider in this area!',
  registerCtaTitle: 'Are you a local service provider?',
  registerCtaDesc: 'Reach hundreds of residents looking for your skills in your village. Free registration, fast approval.',
  
  callNow: 'Call Now',
  whatsapp: 'WhatsApp',
  showContact: 'Contact Number',
  hideContact: 'Hide Contact',
  viewReviews: 'Reviews & Details',
  writeReview: 'Rate & Review',
  reviewsCount: 'reviews',
  noReviewsYet: 'No reviews yet. Be the first to leave feedback!',
  experienceLabel: 'Experience',
  locationLabel: 'Location',
  availabilityLabel: 'Availability',
  verifiedLocal: 'Verified Local',
  
  regTitle: 'Register as a Service Provider',
  regSubtitle: 'List your skills and get direct service requests from residents in your town or village.',
  fullName: 'Full Name',
  fullNamePlaceholder: 'e.g. K. Murugan / செல்வி மணிமேகலை',
  photoUpload: 'Profile Photo',
  photoUploadHint: 'Upload a clear passport photo or take a photo (JPEG, PNG)',
  changePhoto: 'Change Photo',
  phoneNumber: 'Mobile / WhatsApp Number',
  phonePlaceholder: '10-digit mobile number (e.g. 9876543210)',
  phoneHint: 'Residents will call or WhatsApp you directly at this number',
  skillLabel: 'Primary Skill / Service',
  selectSkill: '-- Select your primary skill --',
  otherSkillLabel: 'Specify Your Skill',
  otherSkillPlaceholder: 'e.g. Well Cleaning, Coconut Tree Climber, Blacksmith',
  villageLocation: 'Village / Town Name',
  villagePlaceholder: 'e.g. Pollachi, Tenkasi, Thiruvannamalai, Melur',
  availabilityOption: 'Current Availability',
  experienceYears: 'Years of Experience (Optional)',
  experiencePlaceholder: 'e.g. 5',
  bioLabel: 'Short Description / Specialties (Optional)',
  bioPlaceholder: 'Mention your working hours, tools owned, or key specialties...',
  submitReg: 'Submit Registration for Approval',
  submitting: 'Saving...',
  regSuccessTitle: 'Registration Submitted Successfully!',
  regSuccessDesc: 'Thank you! Your profile has been sent for admin verification. Once approved, you will appear in the public village directory.',
  regDuplicatePhone: 'This phone number is already registered. Please check or use another number.',
  regRequiredFields: 'Please fill in all mandatory fields (Name, Phone, Skill, Village, and Security Check).',
  captchaLabel: 'Security Verification / CAPTCHA',
  captchaPrompt: 'Enter the shown code or calculate the math challenge:',
  captchaPlaceholder: 'Enter verification answer',
  captchaError: 'Incorrect verification answer. Please enter the exact code shown.',
  captchaRefresh: 'New Code',
  
  rateProvider: 'Rate & Review Provider',
  yourRating: 'Your Star Rating',
  reviewerName: 'Your Name',
  reviewerNamePlaceholder: 'e.g. S. Ramanathan',
  reviewerVillage: 'Your Village / Town',
  reviewerVillagePlaceholder: 'e.g. Pollachi',
  reviewComment: 'Your Feedback (Optional)',
  reviewCommentPlaceholder: 'Describe the quality of work, punctuality, and behavior...',
  submitReview: 'Submit Review',
  reviewSuccess: 'Thank you! Your review has been recorded.',
  cancel: 'Cancel',
  close: 'Close',
  
  adminTitle: 'Admin Portal',
  adminSubtitle: 'Review, verify and manage local provider registrations',
  adminPinPrompt: 'Enter Admin Passcode to Access',
  adminPinPlaceholder: 'Admin Passcode (demo: admin123)',
  loginBtn: 'Unlock Portal',
  invalidPin: 'Incorrect passcode. Please try again.',
  logout: 'Lock / Exit',
  pendingApprovals: 'Pending Approvals',
  approvedProviders: 'Approved Directory',
  approveBtn: 'Approve & Publish',
  rejectBtn: 'Reject / Remove',
  deleteBtn: 'Delete Listing',
  noPending: 'No Pending Applications',
  noPendingDesc: 'All provider applications have been reviewed. New signups will appear here instantly.',
  resetSeedData: 'Reset Demo Data',
  resetSeedConfirm: 'Are you sure you want to restore the sample database? This will refresh demo providers.',
  resetSuccess: 'Sample database reset successfully!',
  approvedStatus: 'Approved',
  pendingStatus: 'Pending Verification',
  rejectedStatus: 'Rejected',
  adminDemoHint: 'Demo Passcode: admin123',

  // Worker Login & OTP Flow
  workerLogin: 'Worker Login',
  workerDashboard: 'Worker Dashboard',
  workerLoginTitle: 'Service Worker Portal',
  workerLoginSubtitle: 'Login to manage your public profile, update live availability, and view customer reviews.',
  enterPhonePrompt: 'Enter Registered Mobile Number',
  phoneInputPlaceholder: '10-digit mobile number (e.g. 9842156780)',
  sendOtpBtn: 'Get 4-Digit OTP',
  sendingOtp: 'Generating OTP...',
  phoneNotFound: 'This mobile number is not registered. Please double-check the digits or join as a new service provider below.',
  otpSentBanner: 'Your OTP is {otp} — for demo purposes, this is shown here instead of sent via SMS',
  enterOtpPrompt: 'Enter 4-Digit OTP Code',
  otpPlaceholder: '4-digit OTP (e.g. 1234)',
  verifyAndLoginBtn: 'Verify OTP & Open Dashboard',
  verifying: 'Verifying OTP...',
  invalidOtp: 'Invalid OTP code. Please enter the 4-digit code displayed in the demo notification above.',
  resendOtp: 'Request New OTP',
  changePhone: 'Change Phone Number',
  notRegisteredYet: 'Are you a new service provider in town?',
  workerLogout: 'Worker Logout',
  demoWorkerHint: 'Demo numbers: 9842156780 (Electrician), 9443218765 (Plumber), 9789456123 (Tailor), 9944123890 (Auto Driver)',

  // Worker Dashboard
  myDashboard: 'Worker Dashboard',
  profileSummary: 'Worker Profile',
  visibilityStatus: 'Public Search Visibility',
  statusAvailable: 'Available Right Now',
  statusNotAvailable: 'Not Available Right Now',
  visibilityHelp: 'When toggled off, your profile is hidden from the public directory so you will not receive call inquiries.',
  statsOverview: 'Performance & Inquiries',
  totalReviewsReceived: 'Total Reviews',
  averageRating: 'Average Rating',
  profileStatus: 'Profile Status',
  directInquiries: 'Direct Contacts',
  myReviewsTitle: 'Customer Feedback & Reviews',
  noReviewsForWorker: 'No customer reviews received yet. When village residents leave feedback on your work, they will appear here.',
  editProfileTitle: 'Edit Worker Profile',
  editProfileSubtitle: 'Updates to your contact, experience, and location save instantly without needing admin re-approval.',
  saveChanges: 'Save Profile Details',
  savingChanges: 'Saving...',
  savedSuccessfully: 'Profile updated and saved successfully!',
  pendingNotice: 'Your registration is currently under review by the village admin team. You can still customize your profile details below.',
  rejectedNotice: 'Your registration was not approved. Please review your details or contact the community administrator.',
  switchAccount: 'Switch Worker Account',
  viewPublicCard: 'View in Public Directory',
  visibleInDirectory: 'Active & Visible in Directory',
  hiddenFromDirectory: 'Hidden from Directory (Paused)',

  skills: {
    'Electrician': 'Electrician',
    'Plumber': 'Plumber',
    'Tailor': 'Tailor',
    'Tutor': 'Tutor',
    'Carpenter': 'Carpenter',
    'Auto Driver': 'Auto Driver',
    'Mason': 'Mason (கொத்தனார்)',
    'Painter': 'Painter',
    'Appliance Repair': 'Appliance Repair',
    'Other': 'Other Skilled Service'
  },
  
  availabilities: {
    'now': 'Available Now',
    'today': 'Available Today',
    'this_week': 'Available This Week'
  }
};

const TA_TRANSLATIONS: Translations = {
  appName: 'லோக்கல் கனெக்ட்',
  appSubtitle: 'நம்ம ஊர் சேவைகள்',
  tagline: 'உங்கள் கிராமம் மற்றும் நகரின் நம்பகமான உள்ளூர் சேவை வழங்குநர்கள்',
  home: 'முகப்பு',
  findServices: 'சேவைகளை தேடுங்கள்',
  registerProvider: 'சேவை வழங்குநராக இணையுங்கள்',
  adminPanel: 'நிர்வாகம்',
  language: 'மொழி',
  
  heroTitle: 'உங்கள் ஊரின் சிறந்த திறமைசாலிகளை',
  heroHighlight: 'விரைவில் கண்டறியுங்கள்',
  heroDescription: 'வாய்மொழி தேடலை மாற்றி, நேரடி மற்றும் சரிபார்க்கப்பட்ட உள்ளூர் மின்சார பணியாளர்கள், பிளம்பர்கள், தச்சர்கள், ஆசிரியர்கள், தையல்காரர்கள் மற்றும் ஓட்டுநர்களை உடனடியாக தொடர்பு கொள்ளுங்கள்.',
  searchPlaceholder: 'சேவை, ஊர் பெயர் அல்லது நபர் பெயர் தேடவும்...',
  searchBtn: 'தேடுக',
  browseAll: 'அனைத்து சேவைகளையும் பார்க்க',
  
  statProviders: 'பதிவுசெய்த கைவினைஞர்கள்',
  statVillages: 'ஊர்கள் & பகுதிகள்',
  statCategories: 'சேவைப் பிரிவுகள்',
  statConnections: 'நேரடி தொடர்புகள்',
  
  popularServices: 'முக்கிய சேவைகள் வாரியாக தேடவும்',
  popularServicesDesc: 'இன்று உதவி செய்ய தயாராக உள்ள சரிபார்க்கப்பட்ட அக்கம் பக்கத்து நிபுணர்கள்.',
  allCategories: 'அனைத்து பிரிவுகளும்',
  
  directoryTitle: 'ஊர் சேவைகள் பட்டியல்',
  directoryDesc: 'சரிபார்க்கப்பட்ட உள்ளூர் தொழில்நுட்ப வல்லுநர்களை எளிதாக தேடி, நேரடியாக தொடர்பு கொள்ளுங்கள்.',
  filterBySkill: 'தொழில் வாரியாக',
  filterByLocation: 'கிராமம் / ஊர்',
  filterByAvailability: 'கிடைக்கும் நேரம்',
  sortBy: 'வரிசைப்படுத்து',
  sortHighestRated: 'அதிக மதிப்பீடு',
  sortMostReviews: 'அதிக விமர்சனங்கள்',
  sortNewest: 'புதியதாக இணைந்தவர்கள்',
  allSkills: 'அனைத்து தொழில்கள்',
  allLocations: 'அனைத்து ஊர்கள்',
  allAvailabilities: 'எந்த நேரமும்',
  resultsCount: 'சேவை வழங்குநர்கள் உள்ளனர்',
  resetFilters: 'வடிகட்டிகளை மீட்டமை',
  noResultsTitle: 'தேடலுக்கு ஏற்ற சேவை வழங்குநர்கள் இல்லை',
  noResultsDesc: 'வேறு தேடல் சொல்லை முயற்சிக்கவும், ஊர் தேர்வை மாற்றவும் அல்லது உங்கள் ஊரின் முதல் சேவை வழங்குநராக நீங்கள் இணையுங்கள்!',
  registerCtaTitle: 'நீங்கள் ஒரு திறமையான கைவினைஞரா?',
  registerCtaDesc: 'உங்கள் கிராமத்தில் உள்ள வாடிக்கையாளர்களை எளிதாக சென்றடையுங்கள். இலவச பதிவு, உடனடி சரிபார்ப்பு.',
  
  callNow: 'அழைக்கவும்',
  whatsapp: 'வாட்ஸ்அப்',
  showContact: 'தொடர்பு எண்',
  hideContact: 'மறைக்க',
  viewReviews: 'விமர்சனங்கள் & விவரம்',
  writeReview: 'மதிப்பீடு செய்க',
  reviewsCount: 'விமர்சனங்கள்',
  noReviewsYet: 'இன்னும் விமர்சனங்கள் இல்லை. முதல் கருத்தை பதிவிடுங்கள்!',
  experienceLabel: 'அனுபவம்',
  locationLabel: 'ஊர் / இருப்பிடம்',
  availabilityLabel: 'கிடைக்கும் நேரம்',
  verifiedLocal: 'சரிபார்க்கப்பட்டது',
  
  regTitle: 'சேவை வழங்குநர் பதிவு படிவம்',
  regSubtitle: 'உங்கள் திறமைகளை பதிவு செய்து ஊர் மக்களிடமிருந்து நேரடி வேலை வாய்ப்புகளைப் பெறுங்கள்.',
  fullName: 'முழுப் பெயர்',
  fullNamePlaceholder: 'எ.கா: கே. முருகன் / செல்வி மணிமேகலை',
  photoUpload: 'சுயவிவர புகைப்படம்',
  photoUploadHint: 'தெளிவான பாஸ்போர்ட் புகைப்படம் அல்லது செல்ஃபி பதிவேற்றவும் (JPEG, PNG)',
  changePhoto: 'புகைப்படத்தை மாற்றுக',
  phoneNumber: 'கைபேசி / வாட்ஸ்அப் எண்',
  phonePlaceholder: '10 இலக்க மொபைல் எண் (எ.கா: 9876543210)',
  phoneHint: 'வாடிக்கையாளர்கள் இந்த எண்ணில் உங்களை நேரடியாக அழைப்பார்கள்',
  skillLabel: 'முக்கிய தொழில் / சேவை',
  selectSkill: '-- உங்கள் முதன்மை தொழிலைத் தேர்ந்தெடுக்கவும் --',
  otherSkillLabel: 'தொழிலைக் குறிப்பிடவும்',
  otherSkillPlaceholder: 'எ.கா: கிணறு தூர்வாருதல், தென்னை மரம் ஏறுதல், கொல்லர்',
  villageLocation: 'கிராமம் / ஊர் பெயர்',
  villagePlaceholder: 'எ.கா: பொள்ளாச்சி, தென்காசி, திருவண்ணாமலை, மேலூர்',
  availabilityOption: 'கிடைக்கும் நிலை',
  experienceYears: 'அனுபவம் (ஆண்டுகள் - விருப்பத்தேர்வு)',
  experiencePlaceholder: 'எ.கா: 5',
  bioLabel: 'விவரம் / சிறப்புத் தகுதி (விருப்பத்தேர்வு)',
  bioPlaceholder: 'வேலை நேரம், உங்களிடம் உள்ள கருவிகள் அல்லது அனுபவத்தை குறிப்பிடவும்...',
  submitReg: 'சரிபார்ப்பிற்கு சமர்ப்பிக்கவும்',
  submitting: 'சேமிக்கப்படுகிறது...',
  regSuccessTitle: 'விண்ணப்பம் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!',
  regSuccessDesc: 'நன்றி! உங்கள் விவரங்கள் நிர்வாக சரிபார்ப்புக்கு அனுப்பப்பட்டுள்ளன. ஒப்புதல் கிடைத்ததும் பொதுப் பட்டியலில் தோன்றும்.',
  regDuplicatePhone: 'இந்த தொலைபேசி எண் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது. சரிபார்க்கவும்.',
  regRequiredFields: 'பெயர், தொலைபேசி எண், தொழில், ஊர் மற்றும் பாதுகாப்பு சரிபார்ப்புக் குறியீட்டை நிரப்பவும்.',
  captchaLabel: 'பாதுகாப்பு சரிபார்ப்பு (CAPTCHA)',
  captchaPrompt: 'திரையில் காட்டப்பட்டுள்ள குறியீடு அல்லது கணித விடையை உள்ளிடவும்:',
  captchaPlaceholder: 'சரிபார்ப்புக் குறியீட்டை உள்ளிடவும்',
  captchaError: 'தவறான சரிபார்ப்புக் குறியீடு. சரியான விடையை உள்ளிடவும்.',
  captchaRefresh: 'புதிய குறியீடு',
  
  rateProvider: 'மதிப்பீடு மற்றும் கருத்து',
  yourRating: 'உங்கள் நட்சத்திர மதிப்பீடு',
  reviewerName: 'உங்கள் பெயர்',
  reviewerNamePlaceholder: 'எ.கா: எஸ். ராமநாதன்',
  reviewerVillage: 'உங்கள் ஊர்',
  reviewerVillagePlaceholder: 'எ.கா: பொள்ளாச்சி',
  reviewComment: 'உங்கள் கருத்து (விருப்பத்தேர்வு)',
  reviewCommentPlaceholder: 'வேலையின் தரம், நேரம் தவறாமை மற்றும் அணுகுமுறையை விவரிக்கவும்...',
  submitReview: 'கருத்தை சமர்ப்பிக்கவும்',
  reviewSuccess: 'நன்றி! உங்கள் மதிப்பீடு பதிவு செய்யப்பட்டது.',
  cancel: 'ரத்து செய்',
  close: 'மூடுக',
  
  adminTitle: 'நிர்வாக தளம் (Admin)',
  adminSubtitle: 'சேவை வழங்குநர் விண்ணப்பங்களை சரிபார்த்து நிர்வகிக்கவும்',
  adminPinPrompt: 'நிர்வாக கடவுச்சொல்லை உள்ளிடவும்',
  adminPinPlaceholder: 'கடவுச்சொல் (டெமோ: admin123)',
  loginBtn: 'உள்நுழைக',
  invalidPin: 'தவறான கடவுச்சொல். மீண்டும் முயற்சிக்கவும்.',
  logout: 'வெளியேறு',
  pendingApprovals: 'ஒப்புதலுக்காக காத்திருப்பவை',
  approvedProviders: 'ஒப்புதல் பெற்ற பட்டியல்',
  approveBtn: 'ஒப்புதல் அளித்து வெளியிடு',
  rejectBtn: 'நிராகரி / நீக்கு',
  deleteBtn: 'பட்டியலில் இருந்து நீக்கு',
  noPending: 'காத்திருக்கும் விண்ணப்பங்கள் இல்லை',
  noPendingDesc: 'அனைத்து விண்ணப்பங்களும் மதிப்பாய்வு செய்யப்பட்டன. புதிய பதிவுகள் உடனுக்குடன் இங்கு தோன்றும்.',
  resetSeedData: 'டெமோ தரவை மீட்டமை',
  resetSeedConfirm: 'மாதிரி தரவுத்தளத்தை மீட்டமைக்க விரும்புகிறீர்களா? இது மாதிரி தரவுகளை புதுப்பிக்கும்.',
  resetSuccess: 'மாதிரி தரவுத்தளம் வெற்றிகரமாக மீட்டமைக்கப்பட்டது!',
  approvedStatus: 'ஒப்புதல் பெற்றது',
  pendingStatus: 'சரிபார்ப்பில் உள்ளது',
  rejectedStatus: 'நிராகரிக்கப்பட்டது',
  adminDemoHint: 'டெமோ கடவுச்சொல்: admin123',

  // Worker Login & OTP Flow
  workerLogin: 'பணியாளர் உள்நுழைவு',
  workerDashboard: 'பணியாளர் தளம்',
  workerLoginTitle: 'பணியாளர் உள்நுழைவு தளம்',
  workerLoginSubtitle: 'உங்கள் சுயவிவரம், வேலை கிடைக்கும் நிலை மற்றும் வாடிக்கையாளர் கருத்துக்களை நிர்வகிக்க உள்நுழையவும்.',
  enterPhonePrompt: 'பதிவுசெய்த மொபைல் எண்ணை உள்ளிடவும்',
  phoneInputPlaceholder: '10 இலக்க மொபைல் எண் (எ.கா: 9842156780)',
  sendOtpBtn: '4 இலக்க OTP பெறுக',
  sendingOtp: 'OTP உருவாக்கப்படுகிறது...',
  phoneNotFound: 'இந்த மொபைல் எண் பதிவு செய்யப்படவில்லை. எண்ணை சரிபார்க்கவும் அல்லது புதிய சேவை வழங்குநராக கீழே இணையவும்.',
  otpSentBanner: 'உங்கள் OTP எண் {otp} — டெமோ நோக்கத்திற்காக, இது SMS-க்கு பதிலாக இங்கு திரையில் காட்டப்படுகிறது',
  enterOtpPrompt: '4 இலக்க OTP எண்ணை உள்ளிடவும்',
  otpPlaceholder: '4 இலக்க OTP (எ.கா: 1234)',
  verifyAndLoginBtn: 'சரிபார்த்து தளத்திற்குள் செல்க',
  verifying: 'சரிபார்க்கப்படுகிறது...',
  invalidOtp: 'தவறான OTP. மேலே உள்ள அறிவிப்பில் காட்டப்பட்டுள்ள 4 இலக்க குறியீட்டை உள்ளிடவும்.',
  resendOtp: 'புதிய OTP பெறுக',
  changePhone: 'மொபைல் எண்ணை மாற்றுக',
  notRegisteredYet: 'நீங்கள் புதிய சேவை வழங்குநரா?',
  workerLogout: 'பணியாளர் வெளியேறு',
  demoWorkerHint: 'டெமோ எண்கள்: 9842156780 (எலக்ட்ரீசியன்), 9443218765 (பிளம்பர்), 9789456123 (தையல்காரர்), 9944123890 (ஆட்டோ)',

  // Worker Dashboard
  myDashboard: 'பணியாளர் தளம்',
  profileSummary: 'சுயவிவர சுருக்கம்',
  visibilityStatus: 'பொதுத் தேடல் காட்சி நிலை',
  statusAvailable: 'இப்போதே வேலைக்கு தயார்',
  statusNotAvailable: 'தற்போது கிடைக்கவில்லை (விடுப்பு)',
  visibilityHelp: 'இதை முடக்கினால், பொதுமக்கள் தேடும் போது உங்கள் பெயர் மறைக்கப்படும், அழைப்புகள் வராது.',
  statsOverview: 'மதிப்பீடுகள் & தொடர்புகள்',
  totalReviewsReceived: 'மொத்த விமர்சனங்கள்',
  averageRating: 'சராசரி மதிப்பீடு',
  profileStatus: 'சுயவிவர நிலை',
  directInquiries: 'நேரடி தொடர்புகள்',
  myReviewsTitle: 'வாடிக்கையாளர் கருத்துக்கள் & மதிப்பீடுகள்',
  noReviewsForWorker: 'உங்களுக்கு இதுவரை எந்த வாடிக்கையாளர் விமர்சனங்களும் வரவில்லை. ஊர் மக்கள் கருத்து தெரிவிக்கும் போது இங்கு தோன்றும்.',
  editProfileTitle: 'சுயவிவர விவரங்களை திருத்துக',
  editProfileSubtitle: 'தொடர்பு எண், அனுபவம் மற்றும் ஊர் திருத்தங்கள் உடனடியாக சேமிக்கப்படும் (நிர்வாக மறு ஒப்புதல் தேவையில்லை).',
  saveChanges: 'விவரங்களை சேமிக்க',
  savingChanges: 'சேமிக்கப்படுகிறது...',
  savedSuccessfully: 'சுயவிவர விவரங்கள் வெற்றிகரமாக சேமிக்கப்பட்டன!',
  pendingNotice: 'உங்கள் பதிவு தற்போது கிராம நிர்வாகக் குழுவின் சரிபார்ப்பில் உள்ளது. ஆயினும் உங்கள் விவரங்களை இங்கேயே திருத்தலாம்.',
  rejectedNotice: 'உங்கள் பதிவு ஒப்புதல் பெறவில்லை. விவரங்களை சரிபார்க்கவும் அல்லது நிர்வாகியை தொடர்பு கொள்ளவும்.',
  switchAccount: 'வேறு கணக்கில் உள்நுழைக',
  viewPublicCard: 'பொதுப் பட்டியலில் பார்க்க',
  visibleInDirectory: 'பட்டியலில் நேரலையில் உள்ளது',
  hiddenFromDirectory: 'பட்டியலில் இருந்து தற்காலிகமாக மறைக்கப்பட்டுள்ளது',

  skills: {
    'Electrician': 'மின்சார பணியாளர் (Electrician)',
    'Plumber': 'குழாய் பணியாளர் (Plumber)',
    'Tailor': 'தையல்காரர் (Tailor)',
    'Tutor': 'ஆசிரியர் / டியூஷன் (Tutor)',
    'Carpenter': 'தச்சர் (Carpenter)',
    'Auto Driver': 'ஆட்டோ ஓட்டுநர் (Auto Driver)',
    'Mason': 'கொத்தனார் / மேஸ்திரி (Mason)',
    'Painter': 'வண்ணப்பூசுபவர் (Painter)',
    'Appliance Repair': 'வீட்டு உபகரண பழுதுநீக்குநர்',
    'Other': 'பிற கைவினைத் தொழில்'
  },
  
  availabilities: {
    'now': 'இப்போதே கிடைக்கும் (Available Now)',
    'today': 'இன்று கிடைக்கும் (Available Today)',
    'this_week': 'இந்த வாரம் கிடைக்கும் (This Week)'
  }
};

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly STORAGE_KEY = 'localconnect_lang_preference';
  
  readonly currentLang = signal<AppLanguage>(this.getInitialLanguage());
  
  readonly t = computed<Translations>(() => {
    return this.currentLang() === 'ta' ? TA_TRANSLATIONS : EN_TRANSLATIONS;
  });

  readonly isTamil = computed<boolean>(() => this.currentLang() === 'ta');

  private getInitialLanguage(): AppLanguage {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem(this.STORAGE_KEY) as AppLanguage;
      if (saved === 'ta' || saved === 'en') {
        return saved;
      }
    }
    return 'ta'; // Default to Tamil / Namma Oor friendly default
  }

  setLanguage(lang: AppLanguage) {
    this.currentLang.set(lang);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.STORAGE_KEY, lang);
    }
  }

  toggleLanguage() {
    const next = this.currentLang() === 'ta' ? 'en' : 'ta';
    this.setLanguage(next);
  }

  getSkillLabel(skill: SkillType, customSkill?: string): string {
    if (skill === 'Other' && customSkill) {
      return customSkill;
    }
    return this.t().skills[skill] || skill;
  }

  getAvailabilityLabel(avail: AvailabilityType): string {
    return this.t().availabilities[avail] || avail;
  }
}
