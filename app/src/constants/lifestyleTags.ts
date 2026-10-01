export interface TagCategory {
  id: string;
  name: string;
  icon: string;
  tags: { id: string; label: string; emoji: string }[];
}

export const COMMUNICATION_STYLES = [
  { id: 'chat_fast', label: 'Big Texter & Fast Replies', emoji: '💬' },
  { id: 'call_lover', label: 'Phone Call Lover', emoji: '📞' },
  { id: 'in_person', label: 'Better in Person', emoji: '☕' },
  { id: 'video_chat', label: 'FaceTime & Video Calls', emoji: '📹' },
  { id: 'slow_texter', label: 'Slow Texter / Busy Schedule', emoji: '🐢' },
];

export const IDEAL_DATES = [
  { id: 'coffee_bookstore', label: 'Coffee & Bookstore Stroll', emoji: '☕' },
  { id: 'netflix_chill', label: 'Netflix & Chill Cozy Night', emoji: '🍿' },
  { id: 'street_food', label: 'Street Food & Late Night Chai', emoji: '🍕' },
  { id: 'dinner_drinks', label: 'Dinner & Cute Cocktails', emoji: '🍽️' },
  { id: 'live_gig', label: 'Live Concert & Indie Gigs', emoji: '🎸' },
  { id: 'art_museum', label: 'Museum & Art Gallery Walk', emoji: '🎨' },
  { id: 'park_picnic', label: 'Sunset Picnic in the Park', emoji: '🌲' },
  { id: 'arcade_bowling', label: 'Arcade Games & Bowling', emoji: '🕹️' },
  { id: 'cooking_together', label: 'Cooking Together at Home', emoji: '🍳' },
  { id: 'late_drive', label: 'Late Night Long Drive', emoji: '🚗' },
];

export const LIFESTYLE_VIBES = [
  { id: 'staying_in', label: 'Staying In & Cozy Vibes', emoji: '🛋️' },
  { id: 'going_out', label: 'Going Out & Campus Parties', emoji: '🪩' },
  { id: 'balanced', label: 'Healthy Balance of Both', emoji: '⚖️' },
  { id: 'early_bird', label: 'Early Bird & Morning Gym', emoji: '🌅' },
  { id: 'night_owl', label: 'Night Owl & 3 AM Deep Talks', emoji: '🌙' },
];

export const TAG_CATEGORIES: TagCategory[] = [
  {
    id: 'culture',
    name: 'Creativity & Culture',
    icon: 'book-outline',
    tags: [
      { id: 'literature', label: 'Literature & Poetry', emoji: '📚' },
      { id: 'art_painting', label: 'Painting & Fine Art', emoji: '🎨' },
      { id: 'photography', label: 'Photography', emoji: '📸' },
      { id: 'creative_writing', label: 'Creative Writing', emoji: '✍️' },
      { id: 'philosophy', label: 'Philosophy & Ethics', emoji: '🧠' },
      { id: 'history', label: 'History & Documentaries', emoji: '🏛️' },
      { id: 'theatre', label: 'Theatre & Performing Arts', emoji: '🎭' },
      { id: 'architecture', label: 'Design & Architecture', emoji: '🏛️' },
    ],
  },
  {
    id: 'entertainment',
    name: 'Entertainment & Media',
    icon: 'film-outline',
    tags: [
      { id: 'netflix', label: 'Netflix & Binge-Watching', emoji: '📺' },
      { id: 'anime', label: 'Anime & Manga', emoji: '🎌' },
      { id: 'indie_cinema', label: 'Indie & Classic Cinema', emoji: '🍿' },
      { id: 'podcasts', label: 'Podcasts & Discussions', emoji: '🎙️' },
      { id: 'standup', label: 'Stand-up Comedy', emoji: '🎤' },
      { id: 'videogames', label: 'Video Games & Esports', emoji: '🎮' },
      { id: 'boardgames', label: 'Board Games & Trivia', emoji: '🎲' },
      { id: 'kdrama', label: 'K-Drama & K-Pop', emoji: '🇰🇷' },
    ],
  },
  {
    id: 'food_nightlife',
    name: 'Food & Nightlife',
    icon: 'restaurant-outline',
    tags: [
      { id: 'specialty_coffee', label: 'Specialty Coffee & Cafes', emoji: '☕' },
      { id: 'boba_chai', label: 'Boba & Chai Addict', emoji: '🧋' },
      { id: 'street_food_crawl', label: 'Street Food Crawls', emoji: '🍕' },
      { id: 'cooking_baking', label: 'Cooking & Baking', emoji: '🍳' },
      { id: 'cocktails_wine', label: 'Cocktails & Wine Bars', emoji: '🍷' },
      { id: 'vegan_plant', label: 'Plant-Based & Healthy Food', emoji: '🥗' },
      { id: 'clubbing_raves', label: 'Clubbing & Techno Raves', emoji: '🪩' },
      { id: 'live_concerts', label: 'Live Concerts & Gigs', emoji: '🎶' },
    ],
  },
  {
    id: 'fitness_active',
    name: 'Fitness & Outdoors',
    icon: 'fitness-outline',
    tags: [
      { id: 'gym_lifting', label: 'Gym & Heavy Lifting', emoji: '🏋️' },
      { id: 'yoga_mindful', label: 'Yoga & Mindfulness', emoji: '🧘' },
      { id: 'hiking_trekking', label: 'Hiking & Camping', emoji: '🏔️' },
      { id: 'running', label: 'Running & Cardio', emoji: '🏃' },
      { id: 'football', label: 'Football & Sports', emoji: '⚽' },
      { id: 'cricket', label: 'Cricket Fan', emoji: '🏏' },
      { id: 'badminton', label: 'Badminton & Tennis', emoji: '🏸' },
      { id: 'swimming', label: 'Swimming & Water Sports', emoji: '🏊' },
    ],
  },
  {
    id: 'campus_ambition',
    name: 'Campus & Ambition',
    icon: 'rocket-outline',
    tags: [
      { id: 'coding_hackathons', label: 'Coding & Hackathons', emoji: '💻' },
      { id: 'startups_founders', label: 'Startups & Building Things', emoji: '🚀' },
      { id: 'crypto_markets', label: 'Finance & Investing', emoji: '📈' },
      { id: 'debate_mun', label: 'Debate & Public Speaking', emoji: '🗣️' },
      { id: 'social_work', label: 'Volunteering & Community', emoji: '🌍' },
      { id: 'spontaneous_trips', label: 'Spontaneous Weekend Trips', emoji: '✈️' },
    ],
  },
];

export const MAX_ALLOWED_TAGS = 12;
