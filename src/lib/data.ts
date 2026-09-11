export interface PaceGroup {
  id: string;
  name: string;
  targetPace: string;
  pacerName: string;
  description: string;
  recommendedFor: string;
  icon?: string;
}

export interface RunningEvent {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  type: "campus_social" | "track_interval" | "city_long" | "trail_nature" | "race_competition";
  typeLabel: string;
  date: string; // ISO string
  displayDate: string;
  time: string;
  meetingPoint: string;
  meetingCoordinates?: { lat: number; lng: number };
  googleMapsUrl: string;
  distanceKm: number;
  elevationGainM: number;
  estimatedDurationMin: number;
  targetPace: string;
  maxParticipants: number;
  registeredCount: number;
  coverImage: string;
  routeMapImage: string;
  description: string;
  schedule: { time: string; activity: string }[];
  paceGroups: { name: string; pacer: string; pace: string; slotsRemaining: number }[];
  isFeatured?: boolean;
}

export interface Discipline {
  id: string;
  number: string;
  title: string;
  shortDescription: string;
  details: string;
  scheduleDay: string;
  location: string;
  distanceRange: string;
  image: string;
  badge: string;
}

export interface Recap {
  id: string;
  title: string;
  date: string;
  eventName: string;
  totalRunners: number;
  totalKm: number;
  avgPace: string;
  coverImage: string;
  gallery: string[];
  quote: {
    text: string;
    author: string;
    role: string;
  };
  stravaClubLink: string;
}

export interface Partner {
  id: string;
  name: string;
  tier: "Title Partner" | "Gear Sponsor" | "Nutrition & Hydration" | "University Directorate";
  logoText: string;
  websiteUrl: string;
  perkDescription: string;
  discountCode?: string;
}

export const CLUB_STATS = {
  activeMembers: "340+",
  weeklyRuns: "3 Regular Sessions",
  kmLoggedThisSeason: "18,420 KM",
  campusElevation: "4,850 M",
};

export const NEXT_RUN_TICKER = [
  "NEXT RUN: THURSDAY 07:30 — ÇEKMEKÖY SUNRISE CAMPUS LOOP (5.2 KM)",
  "TUESDAY 18:30 — OVAL TRACK INTERVALS (ATHLETIC CENTER)",
  "SATURDAY 08:30 — CADDEBOSTAN SEASIDE 10K SOCIAL",
  "PACE GROUPS A (4:30), B (5:15), C (6:00), D (COUCH TO 5K)",
  "ALL PACE GROUPS WELCOME — NO RUNNER LEFT BEHIND",
];

export const RUNNING_EVENTS: RunningEvent[] = [
  {
    id: "run-01",
    slug: "sunrise-cekmekoy-campus-loop",
    title: "Sunrise Çekmeköy Campus Loop",
    subtitle: "Crisp morning air, rolling campus hills, and post-run espresso at Student Center.",
    type: "campus_social",
    typeLabel: "Campus Social",
    date: "2026-09-10T07:30:00.000Z",
    displayDate: "Thursday, Sep 10",
    time: "07:30 AM",
    meetingPoint: "ÖzÜ Athletic Center Steps",
    googleMapsUrl: "https://maps.google.com/?q=Ozyegin+University+Athletic+Center",
    distanceKm: 5.2,
    elevationGainM: 95,
    estimatedDurationMin: 35,
    targetPace: "5:45 - 6:30 /km",
    maxParticipants: 45,
    registeredCount: 32,
    coverImage: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1200&q=80",
    routeMapImage: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80",
    description:
      "Kick off your Thursday with our flagship social campus loop. Starting from the Athletic Center steps, we wind through the dorm loop, campus perimeter trail, and finish with a collective stretch and post-run coffee. Tailored with two distinct pace packs.",
    schedule: [
      { time: "07:25 AM", activity: "Check-in & Dynamic Mobility Warmup" },
      { time: "07:35 AM", activity: "Pace Pack Departure" },
      { time: "08:10 AM", activity: "Cool-down, Strides & Stretching" },
      { time: "08:20 AM", activity: "Post-Run Coffee at Student Center" },
    ],
    paceGroups: [
      { name: "Group B (Tempo Stride)", pacer: "Caner Y.", pace: "5:20 - 5:40 /km", slotsRemaining: 5 },
      { name: "Group C (Conversational)", pacer: "Zeynep K.", pace: "6:00 - 6:30 /km", slotsRemaining: 8 },
    ],
    isFeatured: true,
  },
  {
    id: "run-02",
    slug: "track-intervals-400m-repeats",
    title: "Track Intervals: 400m Repeats",
    subtitle: "Build VO2 max, cadence control, and speed endurance on the university oval.",
    type: "track_interval",
    typeLabel: "Track & Speed",
    date: "2026-09-15T18:30:00.000Z",
    displayDate: "Tuesday, Sep 15",
    time: "06:30 PM",
    meetingPoint: "Campus Athletic Oval Lane 1",
    googleMapsUrl: "https://maps.google.com/?q=Ozyegin+University+Track",
    distanceKm: 7.0,
    elevationGainM: 10,
    estimatedDurationMin: 50,
    targetPace: "Varied / Structured",
    maxParticipants: 35,
    registeredCount: 28,
    coverImage: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80",
    routeMapImage: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80",
    description:
      "Structured track workouts open to all fitness levels. Workout structure: 1.5 km warmup jog + running drills + 8 x 400m at 5K effort with 90s jog recovery + 1.5 km cool-down. Pacers will keep steady lane pacing.",
    schedule: [
      { time: "06:30 PM", activity: "Warmup Laps & A/B/C Drills" },
      { time: "06:45 PM", activity: "Main Workout: 8x400m Repeats" },
      { time: "07:15 PM", activity: "Cool-down Jog & Hip Mobility" },
    ],
    paceGroups: [
      { name: "Lane 1 (Sub 4:15 pace)", pacer: "Emir A.", pace: "1:25 - 1:30 /lap", slotsRemaining: 3 },
      { name: "Lane 2 (4:45 - 5:15 pace)", pacer: "Derin T.", pace: "1:40 - 1:50 /lap", slotsRemaining: 4 },
      { name: "Lane 3 (5:30+ pace)", pacer: "Mert S.", pace: "2:00 - 2:15 /lap", slotsRemaining: 0 },
    ],
    isFeatured: true,
  },
  {
    id: "run-03",
    slug: "caddebostan-seaside-10k-social",
    title: "Caddebostan Seaside 10K Social",
    subtitle: "Flat seaside breeze along the Marmara shoreline with sunset finish.",
    type: "city_long",
    typeLabel: "City Social",
    date: "2026-09-19T08:30:00.000Z",
    displayDate: "Saturday, Sep 19",
    time: "08:30 AM",
    meetingPoint: "Caddebostan Beltur Cafe",
    googleMapsUrl: "https://maps.google.com/?q=Caddebostan+Beltur+Istanbul",
    distanceKm: 10.0,
    elevationGainM: 15,
    estimatedDurationMin: 60,
    targetPace: "5:15 - 6:00 /km",
    maxParticipants: 60,
    registeredCount: 48,
    coverImage: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1200&q=80",
    routeMapImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    description:
      "Our signature weekend city outing. We meet at Caddebostan Beltur, run out towards Bostancı Pier and back. Flat, breezy, and followed by brunch with the whole club. Shuttle departing from Çekmeköy campus at 07:30 AM.",
    schedule: [
      { time: "07:30 AM", activity: "Campus Shuttle Departure (Main Gate)" },
      { time: "08:20 AM", activity: "Caddebostan Gathering & Gear Check" },
      { time: "08:30 AM", activity: "10K Run Start" },
      { time: "09:40 AM", activity: "Club Breakfast & Social" },
    ],
    paceGroups: [
      { name: "Fast Pack (Pace A)", pacer: "Kerem D.", pace: "5:00 /km", slotsRemaining: 4 },
      { name: "Cruise Pack (Pace B)", pacer: "Elif B.", pace: "5:30 /km", slotsRemaining: 5 },
      { name: "Social 6K Turnaround", pacer: "Onur C.", pace: "6:15 /km", slotsRemaining: 3 },
    ],
    isFeatured: true,
  },
  {
    id: "run-04",
    slug: "belgrad-forest-trail-long-run",
    title: "Belgrad Forest Trail & Long Run",
    subtitle: "Soft dirt paths, clean oxygen, and natural elevation inside Istanbul's green heart.",
    type: "trail_nature",
    typeLabel: "Trail & Nature",
    date: "2026-09-27T08:00:00.000Z",
    displayDate: "Sunday, Sep 27",
    time: "08:00 AM",
    meetingPoint: "Neşet Suyu Trailhead, Belgrad Forest",
    googleMapsUrl: "https://maps.google.com/?q=Neset+Suyu+Belgrad+Ormani",
    distanceKm: 14.5,
    elevationGainM: 210,
    estimatedDurationMin: 90,
    targetPace: "5:45 - 6:30 /km",
    maxParticipants: 40,
    registeredCount: 31,
    coverImage: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80",
    routeMapImage: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
    description:
      "Escape the city concrete for pure nature. Neşet Suyu loop features soft shaded trails, rolling inclines, and pure runner zen. Hydration pack or handheld flask strongly recommended.",
    schedule: [
      { time: "07:15 AM", activity: "Campus Shuttle Pickup" },
      { time: "07:55 AM", activity: "Trailhead Briefing & Hydration Check" },
      { time: "08:00 AM", activity: "Trail Launch" },
      { time: "09:35 AM", activity: "Natural Springs Cool-down" },
    ],
    paceGroups: [
      { name: "14.5K Full Loop", pacer: "Bora M.", pace: "5:45 /km", slotsRemaining: 6 },
      { name: "8K Half Loop", pacer: "Seda R.", pace: "6:30 /km", slotsRemaining: 3 },
    ],
  },
  {
    id: "run-05",
    slug: "istanbul-marathon-prep-half",
    title: "Istanbul Marathon Prep: 21K Half",
    subtitle: "Official simulation session for runners targeting the 2026 Istanbul Marathon.",
    type: "race_competition",
    typeLabel: "Race Simulation",
    date: "2026-10-11T07:00:00.000Z",
    displayDate: "Sunday, Oct 11",
    time: "07:00 AM",
    meetingPoint: "Yenikapı Event Area",
    googleMapsUrl: "https://maps.google.com/?q=Yenikapi+Marmaray+Istanbul",
    distanceKm: 21.1,
    elevationGainM: 80,
    estimatedDurationMin: 120,
    targetPace: "4:45 - 5:30 /km",
    maxParticipants: 50,
    registeredCount: 39,
    coverImage: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=80",
    routeMapImage: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=800&q=80",
    description:
      "Simulating race-day nutrition, hydration, and pace discipline across a certified 21.1 km course. Supported with mobile water stations, pacing bibs, and Runaway Zone electrolyte recovery.",
    schedule: [
      { time: "06:45 AM", activity: "Gear Drop & Gel Distribution" },
      { time: "07:00 AM", activity: "Pacing Group Start" },
      { time: "09:10 AM", activity: "Finisher Recovery & Electrolyte Station" },
    ],
    paceGroups: [
      { name: "Sub-1:45 Goal (Pace 4:55)", pacer: "Caner Y.", pace: "4:55 /km", slotsRemaining: 4 },
      { name: "Sub-2:00 Goal (Pace 5:40)", pacer: "Zeynep K.", pace: "5:40 /km", slotsRemaining: 7 },
    ],
  },
];

export const PACE_GROUPS: PaceGroup[] = [
  {
    id: "pace-a",
    name: "Fast Pack",
    targetPace: "4:15 - 4:45 /km",
    pacerName: "Caner & Emir",
    description: "Geared towards competitive students targeting sub-40 10Ks and half-marathon podiums.",
    recommendedFor: "Experienced runners with solid weekly mileage (40+ km/week).",
  },
  {
    id: "pace-b",
    name: "Tempo Stride",
    targetPace: "5:00 - 5:30 /km",
    pacerName: "Zeynep & Derin",
    description: "The heartbeat of our club. High rhythm, great aerobic development, and sustained speed.",
    recommendedFor: "Regular runners comfortable running 8-12 km without stopping.",
  },
  {
    id: "pace-c",
    name: "Social Flow",
    targetPace: "5:45 - 6:30 /km",
    pacerName: "Elif & Mert",
    description: "Conversational, uplifting, and pure community joy. No watches needed; run by feel.",
    recommendedFor: "Campus runners, beginners stepping up from 5K, and recovery days.",
  },
  {
    id: "pace-d",
    name: "Couch to 5K",
    targetPace: "Run / Walk Intervals",
    pacerName: "Onur & Club Coaches",
    description: "Zero intimidation. We alternate 2 min jog and 1 min walk until you conquer your first 5K.",
    recommendedFor: "Complete beginners who want to build cardiovascular health with friends.",
  },
];

export const DISCIPLINES: Discipline[] = [
  {
    id: "disc-campus",
    number: "01",
    title: "Campus Loops",
    shortDescription: "Morning and twilight runs looping the green perimeter of Çekmeköy campus.",
    details:
      "Take advantage of Özyeğin University's unique forest campus. Clean air, gradual inclines, car-free private campus roads, and the best post-run espresso at the Student Center.",
    scheduleDay: "Every Tuesday & Thursday 07:30 AM",
    location: "ÖzÜ Athletic Center Steps",
    distanceRange: "5.0 - 7.5 KM",
    image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1200&q=80",
    badge: "Campus Core",
  },
  {
    id: "disc-track",
    number: "02",
    title: "Track & Speed Work",
    shortDescription: "Cadence, pacing drills, and interval training on the university 400m oval.",
    details:
      "Speed is built in circles. Coached sessions focusing on sprint form, biomechanics, VO2 max intervals (400m, 800m, 1200m ladders), and hip stability to keep you injury-free.",
    scheduleDay: "Every Tuesday 06:30 PM",
    location: "Campus Athletic Oval",
    distanceRange: "6.0 - 8.0 KM (Intervals)",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80",
    badge: "Form & Cadence",
  },
  {
    id: "disc-social",
    number: "03",
    title: "City Socials",
    shortDescription: "Caddebostan coast, Bosphorus sunrise, and historic peninsula urban runs.",
    details:
      "We venture off-campus twice a month to experience Istanbul's legendary coastlines. Free club shuttle from campus, flat courses, vibrant team singlets, and collective breakfast.",
    scheduleDay: "Alternate Saturdays 08:30 AM",
    location: "Caddebostan & Karaköy",
    distanceRange: "8.0 - 12.0 KM",
    image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1200&q=80",
    badge: "Urban Crew",
  },
  {
    id: "disc-trail",
    number: "04",
    title: "Trail & Nature",
    shortDescription: "Belgrad Forest and Aydos hill climbs for off-road grit and endurance.",
    details:
      "Swap asphalt for pine needles. Trail running trains stabilizing muscles, builds mental resilience against steep grades, and provides pure trail therapy away from city noise.",
    scheduleDay: "Monthly Sundays 08:00 AM",
    location: "Belgrad Forest Neşet Suyu",
    distanceRange: "10.0 - 16.0 KM",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80",
    badge: "Nature & Grit",
  },
  {
    id: "disc-marathon",
    number: "05",
    title: "Marathon Team",
    shortDescription: "Dedicated training cycle for Istanbul Marathon, Izmir Half, and Runkara.",
    details:
      "For student runners preparing for 21.1 km and 42.2 km. Includes periodic lactate testing, fueling strategies with Runaway Zone, weekly long runs, and shared hotel accommodations at races.",
    scheduleDay: "Seasonal Training Cycles",
    location: "Istanbul & Selected Host Cities",
    distanceRange: "18.0 - 32.0 KM",
    image: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=80",
    badge: "Race Prep",
  },
];

export const RECENT_RECAPS: Recap[] = [
  {
    id: "recap-caddebostan-fall",
    title: "Caddebostan 10K Social Run",
    date: "August 28, 2026",
    eventName: "Late Summer Coastline Gathering",
    totalRunners: 54,
    totalKm: 540,
    avgPace: "5:32 /km",
    coverImage: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80",
    ],
    quote: {
      text: "I used to think running was an isolated, lonely grind. Joining ÖzÜ Running Club showed me it is the ultimate social multiplier. 10 kilometers fly by when you're laughing between breaths.",
      author: "Derin K.",
      role: "Industrial Engineering, Class of '27",
    },
    stravaClubLink: "https://www.strava.com/clubs/ozu-running-club",
  },
  {
    id: "recap-sunset-track",
    title: "Twilight 400m Track Shootout",
    date: "August 22, 2026",
    eventName: "Campus Oval Speed Lab",
    totalRunners: 38,
    totalKm: 285,
    avgPace: "4:48 /km",
    coverImage: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=800&q=80",
    ],
    quote: {
      text: "The energy when 30 runners are hammering 400m repeats under the stadium lights is electric. Everyone cheers for everyone, from the 70-second pacers to those doing their first track workout.",
      author: "Caner Y.",
      role: "Club Lead & Track Captain",
    },
    stravaClubLink: "https://www.strava.com/clubs/ozu-running-club",
  },
];

export const PARTNERS: Partner[] = [
  {
    id: "partner-runaway-zone",
    name: "Runaway Zone",
    tier: "Gear Sponsor",
    logoText: "RUNAWAY ZONE",
    websiteUrl: "https://runawayzone.com/tr/etkinlikler",
    perkDescription: "Official running partner. 20% student discount on apparel, footwear, and race singlets with code OZU20.",
    discountCode: "OZU20",
  },
  {
    id: "partner-ozu-sports",
    name: "Özyeğin University Sports Directorate",
    tier: "University Directorate",
    logoText: "ÖZÜ ATHLETICS",
    websiteUrl: "https://www.ozyegin.edu.tr",
    perkDescription: "Exclusive access to the campus athletic oval, changing lockers, strength recovery equipment, and shuttles.",
  },
  {
    id: "partner-cekmekoy-trail",
    name: "Çekmeköy Running Alliance",
    tier: "Title Partner",
    logoText: "ÇEKMEKÖY TRAIL",
    websiteUrl: "https://runawayzone.com",
    perkDescription: "Joint weekend trail loops, route maintenance, and regional trail race discounts.",
  },
];
