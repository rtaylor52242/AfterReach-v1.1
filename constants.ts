import { Professional, LegalTask, DocumentItem, CalendarEvent, UserProfile, FamilyMember, PersonalTask } from './types';

export const INITIAL_ROLES = [
  'Funeral Director',
  'Elder Attorney',
  'Grief Counselor',
  'Estate Planner',
  'Cemetery Counselor',
  'Financial Planner'
];

export const INITIAL_USER: UserProfile = {
  firstName: 'Alex',
  lastName: 'Doe',
  email: 'alex.doe@example.com',
  role: 'Premium Member',
  profileImage: undefined
};

export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  { id: '1', date: '2023-11-08', title: 'Clean guest room', type: 'personal' },
  { id: '2', date: '2023-11-10', title: 'Funeral Service', type: 'legal' },
  { id: '3', date: '2023-11-15', title: 'Death Certs Due', type: 'legal' },
  { id: '4', date: '2023-11-28', title: 'Meet Attorney', type: 'legal' },
  { id: '5', date: '2023-12-05', title: 'Pick up Urn', type: 'personal' },
  { id: '6', date: '2023-12-12', title: 'Estate Tax Filing', type: 'legal' },
];

export const INITIAL_PERSONAL_TASKS: PersonalTask[] = [
    { id: '1', title: 'Order flowers for service', assignee: 'Sarah', category: 'Personal', completed: false, date: '2023-11-10' },
    { id: '2', title: 'Clean guest room', assignee: 'Mark', category: 'Household', completed: true, date: '2023-11-08' },
    { id: '3', title: 'Find pet sitter for Buster', assignee: 'Alex', category: 'Pet', completed: false, date: '2023-11-12' },
];

export const MOCK_FAMILY_MEMBERS: FamilyMember[] = [
  {
    id: '1',
    fullName: 'Sarah Doe',
    relationship: 'Sister',
    profileImage: 'https://ui-avatars.com/api/?name=Sarah+Doe&background=ffddd2&color=5e3023',
    phone: '(555) 111-2233',
    email: 'sarah.doe@example.com',
    address: '45 Maple Ave, Springfield',
    bio: 'Can help with grocery shopping and picking up relatives from the airport.',
    skills: ['Shopping', 'Driving', 'Hosting'],
    availability: 'Weekends and Evenings'
  },
  {
    id: '2',
    fullName: 'Uncle Bob',
    relationship: 'Uncle',
    profileImage: 'https://ui-avatars.com/api/?name=Uncle+Bob&background=d4c5b9&color=2d3748',
    phone: '(555) 444-5566',
    email: 'bob.smith@example.com',
    address: '88 Oak Lane, Springfield',
    bio: 'Retired. Available during weekdays to wait for contractors or movers.',
    skills: ['Home Maintenance', 'Logistics', 'Pet Care'],
    availability: 'Mon-Fri 9am-3pm'
  },
  {
    id: '3',
    fullName: 'Jennifer Lee',
    relationship: 'Best Friend',
    profileImage: 'https://ui-avatars.com/api/?name=Jennifer+Lee&background=e2e8f0&color=4a5568',
    phone: '(555) 777-8899',
    email: 'jen.lee@example.com',
    address: '123 Pine St, Metro City',
    bio: 'Here for emotional support and organizing the memorial reception.',
    skills: ['Event Planning', 'Emotional Support', 'Cooking'],
    availability: 'Evenings'
  }
];

export const MOCK_PROFESSIONALS: Professional[] = [
  {
    id: '1',
    fullName: 'Eleanor Vance',
    role: 'Funeral Director',
    businessName: 'Everlasting Peace Funeral Home',
    profileImage: 'https://picsum.photos/200/200?random=1',
    phone: '(555) 123-4567',
    email: 'eleanor@everlasting.com',
    address: '123 Serenity Lane, Quietville, CA',
    bio: 'Compassionate funeral director with over 20 years of experience guiding families through difficult times.',
    experienceYears: 22,
    certifications: ['Certified Funeral Service Practitioner'],
    services: ['Traditional Burial', 'Cremation', 'Memorial Services'],
    languages: ['English', 'Spanish'],
    availability: 'Mon-Fri 9am-5pm',
    emergencyAvailability: true,
    rating: 5.0,
    reviewCount: 2,
    reviews: [
      { id: 'r1', author: 'Martha S.', date: '2023-09-15', rating: 5, text: 'Eleanor was incredibly kind and handled everything with grace.' },
      { id: 'r2', author: 'John D.', date: '2023-08-20', rating: 5, text: 'Made a very difficult process much easier to understand.' }
    ]
  },
  {
    id: '2',
    fullName: 'Marcus Thorne',
    role: 'Elder Attorney',
    businessName: 'Thorne Legal Group',
    profileImage: 'https://picsum.photos/200/200?random=2',
    phone: '(555) 987-6543',
    email: 'm.thorne@thornelegal.com',
    address: '450 Justice Blvd, Suite 200, Metro City, CA',
    bio: 'Specializing in probate, estate planning, and elder law to ensure your loved one\'s wishes are honored.',
    experienceYears: 15,
    certifications: ['Bar Association Member', 'Certified Elder Law Attorney'],
    services: ['Probate', 'Will Contests', 'Trust Administration'],
    languages: ['English'],
    availability: 'Mon-Fri 8am-6pm',
    emergencyAvailability: false,
    rating: 4.5,
    reviewCount: 2,
    reviews: [
      { id: 'r3', author: 'Alice P.', date: '2023-10-01', rating: 5, text: 'Very knowledgeable and efficient.' },
      { id: 'r4', author: 'Robert T.', date: '2023-09-10', rating: 4, text: 'Great service, though scheduling was a bit tight.' }
    ]
  },
  {
    id: '3',
    fullName: 'Sarah Jenkins',
    role: 'Grief Counselor',
    businessName: 'Healing Hearts Counseling',
    profileImage: 'https://picsum.photos/200/200?random=3',
    phone: '(555) 321-7654',
    email: 'sarah@healinghearts.com',
    address: '88 Comfort Rd, Wellness Park, CA',
    bio: 'Providing a safe space for processing loss and finding a path forward through grief.',
    experienceYears: 10,
    certifications: ['Licensed Clinical Social Worker', 'Grief Recovery Specialist'],
    services: ['Individual Therapy', 'Group Support', 'Child Grief Support'],
    languages: ['English', 'French'],
    availability: 'Tue-Sat 10am-7pm',
    emergencyAvailability: true,
    rating: 5.0,
    reviewCount: 1,
    reviews: [
      { id: 'r5', author: 'Emily R.', date: '2023-10-12', rating: 5, text: 'Sarah truly helped me find my footing again.' }
    ]
  },
  {
    id: '4',
    fullName: 'David Chen',
    role: 'Estate Planner',
    businessName: 'Legacy Financial',
    profileImage: 'https://picsum.photos/200/200?random=4',
    phone: '(555) 654-0987',
    email: 'david@legacyfin.com',
    address: '900 Market St, Fin District, CA',
    bio: 'Helping families organize assets and navigate the complex financial landscape after loss.',
    experienceYears: 18,
    certifications: ['CFP', 'CPA'],
    services: ['Asset Valuation', 'Tax Planning', 'Inheritance Guidance'],
    languages: ['English', 'Mandarin'],
    availability: 'Mon-Fri 9am-5pm',
    emergencyAvailability: false,
    rating: 0,
    reviewCount: 0,
    reviews: []
  },
  {
    id: '5',
    fullName: 'Rev. Alistair Brooks',
    role: 'Cemetery Counselor',
    businessName: 'Oakwood Memorial Park',
    profileImage: 'https://picsum.photos/200/200?random=5',
    phone: '(555) 111-2222',
    email: 'abrooks@oakwood.com',
    address: '500 Oak Way, Green Hills, CA',
    bio: 'Assisting with interment rights, markers, and creating lasting tributes in our historic grounds.',
    experienceYears: 30,
    certifications: ['Cemetery Administrator'],
    services: ['Plot Selection', 'Monument Design', 'Perpetual Care'],
    languages: ['English'],
    availability: 'Mon-Sun 9am-4pm',
    emergencyAvailability: false,
    rating: 5.0,
    reviewCount: 1,
    reviews: [
      { id: 'r6', author: 'Family of H.W.', date: '2023-07-30', rating: 5, text: 'A beautiful resting place and attentive staff.' }
    ]
  }
];

export const INITIAL_LEGAL_TASKS: LegalTask[] = [
  { id: '1', title: 'Obtain Death Certificates', description: 'Request 10-12 certified copies from the funeral home or vital records office.', completed: false, dueDate: '2023-11-15' },
  { id: '2', title: 'Locate the Will', description: 'Find the original Last Will and Testament.', completed: true, dueDate: '2023-10-28' },
  { id: '3', title: 'Notify Social Security', description: 'Funeral director often handles this, but verify.', completed: false, dueDate: '2023-11-01' },
  { id: '4', title: 'Call Employer', description: 'Notify employer of death and inquire about benefits/pay.', completed: false },
  { id: '5', title: 'Meet with Attorney', description: 'Schedule probate attorney consultation.', completed: false },
  { id: '6', title: 'Secure Property', description: 'Lock up residence, vehicle, and valuables.', completed: true },
  { id: '7', title: 'Forward Mail', description: 'Set up mail forwarding with USPS.', completed: false },
  { id: '8', title: 'Notify Banks', description: 'Contact banks to freeze or close accounts.', completed: false },
  { id: '9', title: 'Life Insurance', description: 'File claims for any life insurance policies.', completed: false },
  { id: '10', title: 'Cancel Subscriptions', description: 'Identify and cancel monthly services (Netflix, Gym, etc).', completed: false },
  { id: '11', title: 'Notify DMV', description: 'Cancel driver’s license to prevent fraud.', completed: false },
  { id: '12', title: 'Contact Credit Bureaus', description: 'Notify Equifax, Experian, TransUnion.', completed: false },
  { id: '13', title: 'File Taxes', description: 'Prepare for final income tax return.', completed: false },
  { id: '14', title: 'Pay Bills', description: 'Ensure mortgage, utilities, and debts are managed.', completed: false },
  { id: '15', title: 'Inventory Assets', description: 'Create a list of all physical and digital assets.', completed: false },
  { id: '16', title: 'Digital Legacy', description: 'Memorialize or close social media accounts.', completed: false },
  { id: '17', title: 'Thank You Notes', description: 'Send acknowledgments for flowers and donations.', completed: false },
];

export const MOCK_DOCUMENTS: DocumentItem[] = [
  { id: '1', name: 'Death Certificate.pdf', type: 'PDF', uploadDate: '2023-10-30', size: '1.2 MB', category: 'Essential' },
  { id: '2', name: 'Last Will.pdf', type: 'PDF', uploadDate: '2023-10-28', size: '2.4 MB', category: 'Essential' },
  { id: '3', name: 'Life Insurance Policy.pdf', type: 'PDF', uploadDate: '2023-11-01', size: '0.8 MB', category: 'Financial' },
  { id: '4', name: 'Family Photo.jpg', type: 'JPG', uploadDate: '2023-11-05', size: '4.1 MB', category: 'Personal' },
];