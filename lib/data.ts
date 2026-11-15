export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced'
export type MissionContext = 'Social' | 'Café' | 'Street' | 'Shop' | 'Restaurant'
export type AccentId = 'american' | 'british' | 'australian' | 'singaporean'
export type MissionIconKey = 'hand' | 'coffee' | 'map-pin' | 'shopping-bag' | 'utensils' | 'receipt'
export type Rating = 'great' | 'good' | 'basic'
export type Lines = string | Record<AccentId, string>

export type PracticeOption = {
  text: string
  rating: Rating
  feedback: string
}

export type PracticeTurn = {
  ai: Lines
  goal: string
  keywords: string[]
  tip: string
  options: PracticeOption[]
}

export type Mission = {
  id: string
  levelId: number
  title: string
  summary: string
  context: MissionContext
  place: string
  difficulty: Difficulty
  xp: number
  minutes: number
  icon: MissionIconKey
  persona: { name: string; role: string }
  objectives: string[]
  phrases: { text: string; note: string }[]
  dialogue: { speaker: 'them' | 'you'; text: string }[]
  practice: PracticeTurn[]
  closing: Lines
}

export type Level = {
  id: number
  name: string
  tagline: string
  xpRequired: number
  badge: string
}

export const USER = {
  name: 'Alex',
  language: 'English',
}

export const BASE_XP = 85
export const PRACTICE_XP = 15

export const DIFFICULTIES: Difficulty[] = ['Beginner', 'Intermediate', 'Advanced']
export const CONTEXTS: MissionContext[] = ['Café', 'Street', 'Shop', 'Restaurant', 'Social']

export const ACCENTS: { id: AccentId; label: string; lang: string; filler: string }[] = [
  { id: 'american', label: 'American', lang: 'en-US', filler: 'Awesome.' },
  { id: 'british', label: 'British', lang: 'en-GB', filler: 'Lovely.' },
  { id: 'australian', label: 'Australian', lang: 'en-AU', filler: 'Too easy.' },
  { id: 'singaporean', label: 'Singaporean', lang: 'en-SG', filler: 'Okay, can.' },
]

export const LEVELS: Level[] = [
  { id: 1, name: 'First Words', tagline: 'Everyday basics', xpRequired: 0, badge: 'First Steps' },
  { id: 2, name: 'Out and About', tagline: 'Getting what you need', xpRequired: 250, badge: 'Ice Breaker' },
  { id: 3, name: 'Smooth Talker', tagline: 'Handling tricky moments', xpRequired: 420, badge: 'City Navigator' },
  { id: 4, name: 'Local Legend', tagline: 'More missions coming soon', xpRequired: 570, badge: 'Local Legend' },
]

export const MISSIONS: Mission[] = [
  {
    id: 'introduce-yourself',
    levelId: 1,
    title: 'Introduce Yourself',
    summary: 'Meet a classmate and keep a short, friendly chat going.',
    context: 'Social',
    place: 'your class or dorm',
    difficulty: 'Beginner',
    xp: 40,
    minutes: 5,
    icon: 'hand',
    persona: { name: 'Sam', role: 'classmate' },
    objectives: [
      'Say your name and where you are from',
      'Ask one question back',
      'End the chat politely',
    ],
    phrases: [
      { text: "Hi, I'm Alex. Nice to meet you.", note: 'A simple, friendly opener' },
      { text: "I'm from Brazil. How about you?", note: 'Returns the question' },
      { text: 'What are you studying?', note: 'Keeps the chat going' },
      { text: 'It was nice talking to you.', note: 'A polite way to finish' },
    ],
    dialogue: [
      { speaker: 'them', text: "Hey, I don't think we've met. I'm Sam." },
      { speaker: 'you', text: "Hi Sam, I'm Alex. Nice to meet you." },
      { speaker: 'them', text: 'Where are you from?' },
      { speaker: 'you', text: "I'm from São Paulo. How about you?" },
    ],
    practice: [
      {
        ai: "Hey! I don't think we've met yet. I'm Sam.",
        goal: 'Introduce yourself',
        keywords: ["i'm", 'my name', 'nice to meet'],
        tip: 'Add "Nice to meet you" to make a short intro feel warm.',
        options: [
          { text: "Hi Sam, I'm Alex. Nice to meet you!", rating: 'great', feedback: 'Your name plus a warm closer. Exactly right.' },
          { text: "I'm Alex.", rating: 'good', feedback: 'Clear. Add "Nice to meet you" to sound friendlier.' },
          { text: 'Hello.', rating: 'basic', feedback: 'Share your name so Sam can keep the chat going.' },
        ],
      },
      {
        ai: 'Nice to meet you too! Where are you from?',
        goal: 'Say where you are from and ask back',
        keywords: ['from', 'how about you', 'and you'],
        tip: 'Return the question with "How about you?" to keep it flowing.',
        options: [
          { text: "I'm from São Paulo, in Brazil. How about you?", rating: 'great', feedback: 'You answered and handed the question back.' },
          { text: "I'm from Brazil.", rating: 'good', feedback: 'Good answer. Ask a question back to keep it going.' },
          { text: 'Brazil.', rating: 'basic', feedback: 'A full sentence sounds more confident.' },
        ],
      },
      {
        ai: 'I grew up around here. Anyway, I should head to class!',
        goal: 'End the chat politely',
        keywords: ['nice', 'see you', 'talking'],
        tip: '"It was nice talking to you" is a safe, polite ending.',
        options: [
          { text: 'It was nice talking to you. See you around!', rating: 'great', feedback: 'Warm and natural. A great ending.' },
          { text: 'See you!', rating: 'good', feedback: 'Friendly. Adding "Nice talking to you" makes it warmer.' },
          { text: 'Okay, bye.', rating: 'basic', feedback: 'It works, but it can sound abrupt.' },
        ],
      },
    ],
    closing: 'See you around, Alex!',
  },
  {
    id: 'order-coffee',
    levelId: 1,
    title: 'Order a Coffee',
    summary: 'Order a drink and ask for one small change.',
    context: 'Café',
    place: 'any café',
    difficulty: 'Beginner',
    xp: 50,
    minutes: 10,
    icon: 'coffee',
    persona: { name: 'Maya', role: 'barista' },
    objectives: [
      'Order a drink by name and size',
      'Ask for one change, like oat milk',
      'Confirm the price or your order',
    ],
    phrases: [
      { text: 'Could I get a medium latte, please?', note: 'Polite ordering' },
      { text: 'Could you make that with oat milk?', note: 'Requesting a change' },
      { text: 'Is there an extra charge?', note: 'Checking the price' },
      { text: "That's everything, thank you.", note: 'Finishing your order' },
    ],
    dialogue: [
      { speaker: 'them', text: 'Hi! What can I get for you?' },
      { speaker: 'you', text: 'Could I get a medium latte, please?' },
      { speaker: 'them', text: 'Sure. Is regular milk okay?' },
      { speaker: 'you', text: 'Could you make that with oat milk?' },
      { speaker: 'them', text: 'Oat milk is 75 cents extra. Is that okay?' },
      { speaker: 'you', text: "That's fine, thank you." },
    ],
    practice: [
      {
        ai: {
          american: 'Hey there! What can I get started for you?',
          british: 'Hiya! What can I get you?',
          australian: "G'day! What are you after today?",
          singaporean: 'Hello! What would you like to order?',
        },
        goal: 'Order a drink with a size',
        keywords: ['latte', 'coffee', 'medium', 'small', 'large', 'please'],
        tip: 'Start with "Could I get…" because it is polite and works in any café.',
        options: [
          { text: 'Could I get a medium latte, please?', rating: 'great', feedback: 'Polite, clear, and you gave the size.' },
          { text: 'I want a latte.', rating: 'good', feedback: 'Understood, but "Could I get…" sounds friendlier.' },
          { text: 'Latte.', rating: 'basic', feedback: 'It works. Add a size and "please" to sound confident.' },
        ],
      },
      {
        ai: {
          american: 'You got it. Is regular milk okay?',
          british: 'Lovely. Is normal milk all right?',
          australian: 'Too easy. Full cream milk okay?',
          singaporean: 'Sure, can. Fresh milk okay?',
        },
        goal: 'Ask for oat milk and check the price',
        keywords: ['oat', 'milk', 'extra', 'charge', 'cost'],
        tip: 'Pair the request with a question: "Is there an extra charge?"',
        options: [
          { text: 'Could you make that with oat milk instead? Is there an extra charge?', rating: 'great', feedback: 'You asked for the change and checked the price in one go.' },
          { text: 'Oat milk, please.', rating: 'good', feedback: 'Clear. Try asking about the extra cost too.' },
          { text: 'No.', rating: 'basic', feedback: 'Say what you would like instead so the barista can help.' },
        ],
      },
      {
        ai: {
          american: 'Oat milk is 75 cents extra. For here or to go?',
          british: "Oat milk's 50p extra. Is that to have in or take away?",
          australian: "Oat's 80 cents extra. Having here or takeaway?",
          singaporean: 'Oat milk is 90 cents more. Having here or takeaway?',
        },
        goal: 'Confirm and finish your order',
        keywords: ['to go', 'takeaway', 'take away', 'here', 'fine', 'thank'],
        tip: '"To go" and "takeaway" mean the same thing, so listen for the local one.',
        options: [
          { text: "That's fine. To go, please. That's everything, thank you.", rating: 'great', feedback: 'You confirmed the price, answered, and closed politely.' },
          { text: 'To go, please.', rating: 'good', feedback: 'Good answer. Confirming the extra charge shows you understood.' },
          { text: 'Yes.', rating: 'basic', feedback: 'Which one? Answer with "For here" or "To go".' },
        ],
      },
    ],
    closing: {
      american: 'Awesome. One medium oat latte coming right up!',
      british: "Brilliant. One medium oat latte, won't be a minute!",
      australian: 'Beauty. One medium oat latte, coming up!',
      singaporean: 'Okay, one medium oat latte. Ready in a while!',
    },
  },
  {
    id: 'ask-directions',
    levelId: 1,
    title: 'Ask for Directions',
    summary: 'Stop someone politely and find your way to the library.',
    context: 'Street',
    place: 'a busy street or campus',
    difficulty: 'Beginner',
    xp: 60,
    minutes: 10,
    icon: 'map-pin',
    persona: { name: 'Jordan', role: 'passer-by' },
    objectives: [
      "Get someone's attention politely",
      'Ask how to get to a specific place',
      'Repeat the directions back to confirm',
    ],
    phrases: [
      { text: 'Excuse me, could you help me?', note: 'Getting attention politely' },
      { text: 'How do I get to the library?', note: 'Asking the way' },
      { text: 'Is it far from here?', note: 'Checking the distance' },
      { text: 'So I turn left at the lights, right?', note: 'Confirming what you heard' },
    ],
    dialogue: [
      { speaker: 'you', text: 'Excuse me, how do I get to the library?' },
      { speaker: 'them', text: 'Go straight and turn left at the lights.' },
      { speaker: 'you', text: 'Is it far from here?' },
      { speaker: 'them', text: 'About five minutes on foot.' },
      { speaker: 'you', text: 'So straight, then left at the lights. Thank you!' },
    ],
    practice: [
      {
        ai: 'Oh, hi! Are you looking for something?',
        goal: 'Ask how to get to the library',
        keywords: ['excuse', 'library', 'how do i', 'could you'],
        tip: 'Open with "Excuse me" before your question to soften the interruption.',
        options: [
          { text: 'Excuse me, could you tell me how to get to the library?', rating: 'great', feedback: 'Polite opener and a clear question.' },
          { text: 'Where is the library?', rating: 'good', feedback: 'Clear. "Could you tell me…" sounds more polite to a stranger.' },
          { text: 'Library?', rating: 'basic', feedback: 'Use a full question so they know what you need.' },
        ],
      },
      {
        ai: 'Sure! Go straight for two blocks, then turn left at the traffic lights.',
        goal: 'Check the distance',
        keywords: ['far', 'how long', 'minutes', 'walk'],
        tip: '"Is it far from here?" is the quickest way to check walking distance.',
        options: [
          { text: 'Thanks! Is it far from here?', rating: 'great', feedback: 'A natural follow-up that gets useful detail.' },
          { text: 'How many minutes?', rating: 'good', feedback: 'Understood. "How long does it take to walk?" is more natural.' },
          { text: 'Okay.', rating: 'basic', feedback: 'Ask a follow-up so you do not get lost halfway.' },
        ],
      },
      {
        ai: 'Not at all. About five minutes on foot.',
        goal: 'Repeat the directions back',
        keywords: ['straight', 'left', 'lights', 'thank'],
        tip: 'Repeating directions back catches mistakes before you start walking.',
        options: [
          { text: 'So straight for two blocks, then left at the lights. Thank you so much!', rating: 'great', feedback: 'You confirmed every step and thanked them.' },
          { text: 'Straight, then left. Thanks!', rating: 'good', feedback: 'Nice confirmation. Adding "two blocks" makes it complete.' },
          { text: 'Thank you.', rating: 'basic', feedback: 'Polite! Try repeating the directions to confirm them.' },
        ],
      },
    ],
    closing: "That's it. You can't miss it!",
  },
  {
    id: 'find-product',
    levelId: 2,
    title: 'Find a Product at a Store',
    summary: 'Ask a store associate to help you find a phone charger.',
    context: 'Shop',
    place: 'any shop or supermarket',
    difficulty: 'Intermediate',
    xp: 80,
    minutes: 15,
    icon: 'shopping-bag',
    persona: { name: 'Priya', role: 'store associate' },
    objectives: [
      'Ask where a product is',
      'Describe what you need without the exact word',
      'Ask about the price or an alternative',
    ],
    phrases: [
      { text: 'Excuse me, do you sell phone chargers?', note: 'Checking they stock it' },
      { text: 'Which aisle is it in?', note: 'Finding the location' },
      { text: "I'm looking for something like…", note: 'Describing without the word' },
      { text: 'Do you have a cheaper one?', note: 'Asking for an alternative' },
    ],
    dialogue: [
      { speaker: 'you', text: 'Excuse me, do you sell phone chargers?' },
      { speaker: 'them', text: 'We do. Aisle seven, near the electronics.' },
      { speaker: 'you', text: 'I need one with a long cable. Do you have that?' },
      { speaker: 'them', text: "Yes, there's a two-metre one for fifteen dollars." },
      { speaker: 'you', text: 'Do you have a cheaper one?' },
    ],
    practice: [
      {
        ai: 'Hi there! Can I help you find anything?',
        goal: 'Say what you are looking for',
        keywords: ['charger', 'looking for', 'do you sell', 'do you have'],
        tip: '"I\'m looking for…" is the most natural way to start in a shop.',
        options: [
          { text: "Yes, please. I'm looking for a phone charger.", rating: 'great', feedback: 'Polite and specific. Easy to help.' },
          { text: 'Phone charger?', rating: 'good', feedback: 'It works. A full sentence sounds more confident.' },
          { text: 'No, thanks.', rating: 'basic', feedback: 'Staff are happy to help. Tell them what you need.' },
        ],
      },
      {
        ai: "Sure, they're in aisle seven. Which type do you need?",
        goal: 'Describe it without the exact word',
        keywords: ['long', 'cable', 'the one with', 'like', 'for my'],
        tip: 'Missing the word? Describe it: "the one with…" or "something like…".',
        options: [
          { text: 'I need the one with a long cable, for an iPhone.', rating: 'great', feedback: 'Two clear details. That is all they need.' },
          { text: 'A long one.', rating: 'good', feedback: 'Add what it is for so they can pick the right one.' },
          { text: "I don't know.", rating: 'basic', feedback: 'Describe what you do know: length, colour, or what it is for.' },
        ],
      },
      {
        ai: 'Got it. We have a two-metre one for fifteen dollars.',
        goal: 'Ask about the price or an alternative',
        keywords: ['cheaper', 'another', 'price', 'only option', 'less'],
        tip: '"Do you have a cheaper one?" is direct but perfectly polite.',
        options: [
          { text: 'Thanks. Do you have a cheaper one, or is that the only option?', rating: 'great', feedback: 'Polite, direct, and it invites alternatives.' },
          { text: 'Too expensive.', rating: 'good', feedback: 'Honest! Follow up by asking for another option.' },
          { text: 'Okay.', rating: 'basic', feedback: 'If the price does not suit you, it is fine to ask for alternatives.' },
        ],
      },
    ],
    closing: "There's a one-metre one for nine dollars. I'll show you where it is.",
  },
  {
    id: 'restaurant-recommendation',
    levelId: 2,
    title: 'Ask for a Restaurant Recommendation',
    summary: 'Ask a local where to eat and get details you can act on.',
    context: 'Restaurant',
    place: 'your neighborhood',
    difficulty: 'Intermediate',
    xp: 90,
    minutes: 15,
    icon: 'utensils',
    persona: { name: 'Leo', role: 'local' },
    objectives: [
      'Ask for a recommendation nearby',
      'Share a preference or budget',
      'Ask a follow-up, like what to order',
    ],
    phrases: [
      { text: 'Could you recommend a good place to eat around here?', note: 'Asking for a recommendation' },
      { text: "I'm looking for something not too expensive.", note: 'Sharing your budget' },
      { text: 'What would you order there?', note: 'A natural follow-up' },
      { text: 'Do I need a reservation?', note: 'Checking before you go' },
    ],
    dialogue: [
      { speaker: 'you', text: 'Could you recommend a good place to eat around here?' },
      { speaker: 'them', text: 'What kind of food do you like?' },
      { speaker: 'you', text: 'Something casual and not too expensive.' },
      { speaker: 'them', text: 'Try Noodle House on the corner.' },
      { speaker: 'you', text: 'What would you order there?' },
    ],
    practice: [
      {
        ai: 'You look a bit lost. Can I help with something?',
        goal: 'Ask for a recommendation',
        keywords: ['recommend', 'place to eat', 'restaurant', 'around here'],
        tip: '"Could you recommend…" invites a personal answer, not just directions.',
        options: [
          { text: 'Yes, please! Could you recommend a good place to eat around here?', rating: 'great', feedback: 'Friendly and clear about what you want.' },
          { text: 'Where is a restaurant?', rating: 'good', feedback: 'Clear. Asking for a recommendation gets you a better answer.' },
          { text: "I'm hungry.", rating: 'basic', feedback: 'Turn it into a question so they know how to help.' },
        ],
      },
      {
        ai: 'Of course! What kind of food are you in the mood for?',
        goal: 'Share a preference or budget',
        keywords: ['casual', 'expensive', 'cheap', 'budget', 'something', 'noodles'],
        tip: 'Give one preference and one limit, like a cuisine plus a budget.',
        options: [
          { text: 'Something casual and not too expensive. Maybe noodles.', rating: 'great', feedback: 'A style, a budget, and a cuisine. Very easy to answer.' },
          { text: 'Anything is fine.', rating: 'good', feedback: 'Friendly, but a preference helps them choose for you.' },
          { text: 'Food.', rating: 'basic', feedback: 'Share a type of food or a budget to get a useful answer.' },
        ],
      },
      {
        ai: "Then try Noodle House on the corner. It's my favourite.",
        goal: 'Ask a follow-up question',
        keywords: ['order', 'reservation', 'what would', 'busy', 'far'],
        tip: 'A follow-up like "What would you order?" turns a tip into a real conversation.',
        options: [
          { text: 'That sounds great. What would you order there?', rating: 'great', feedback: 'You showed interest and kept the chat going.' },
          { text: 'Is it far?', rating: 'good', feedback: 'Useful question. Asking what to order keeps the chat going.' },
          { text: 'Thanks, bye.', rating: 'basic', feedback: 'Before you go, ask one follow-up to get the most from the tip.' },
        ],
      },
    ],
    closing: "Get the beef noodle soup. You won't regret it!",
  },
  {
    id: 'billing-mixup',
    levelId: 3,
    title: 'Resolve a Billing Mix-Up',
    summary: 'Politely point out a mistake on your bill and get it fixed.',
    context: 'Restaurant',
    place: 'a café or restaurant',
    difficulty: 'Advanced',
    xp: 150,
    minutes: 20,
    icon: 'receipt',
    persona: { name: 'Dana', role: 'cashier' },
    objectives: [
      'Point out the mistake without blaming',
      'Explain what you actually ordered',
      'Agree on a fix and thank them',
    ],
    phrases: [
      { text: 'Sorry, I think there might be a mistake on my bill.', note: 'Raising it gently' },
      { text: 'I only ordered one, but I was charged for two.', note: 'Stating the facts' },
      { text: 'Could you take that off, please?', note: 'Asking for the fix' },
      { text: 'Thanks for sorting that out.', note: 'Ending on good terms' },
    ],
    dialogue: [
      { speaker: 'them', text: 'That comes to twenty-four fifty.' },
      { speaker: 'you', text: 'Sorry, I think there might be a mistake on my bill.' },
      { speaker: 'them', text: 'Let me take a look. What seems to be wrong?' },
      { speaker: 'you', text: 'I only ordered one sandwich, but I was charged for two.' },
      { speaker: 'them', text: "You're right, sorry about that. I'll take one off." },
      { speaker: 'you', text: 'Thanks for sorting that out.' },
    ],
    practice: [
      {
        ai: "Here's your bill. That comes to twenty-four fifty.",
        goal: 'Point out the mistake politely',
        keywords: ['mistake', 'i think', 'sorry', 'bill', 'charged'],
        tip: 'Soften it with "I think there might be…" to keep things friendly.',
        options: [
          { text: 'Sorry, I think there might be a mistake on my bill.', rating: 'great', feedback: 'Gentle and clear. No blame, just the issue.' },
          { text: 'This is wrong.', rating: 'good', feedback: 'Direct. Softening it gets a more helpful response.' },
          { text: 'Okay.', rating: 'basic', feedback: 'It is fine to question a bill. Say you have spotted a mistake.' },
        ],
      },
      {
        ai: 'Oh, let me take a look. What seems to be wrong?',
        goal: 'Explain what you ordered',
        keywords: ['only ordered', 'one', 'two', 'charged', 'twice'],
        tip: 'State the facts: what you ordered, then what you were charged.',
        options: [
          { text: 'I only ordered one sandwich, but I was charged for two.', rating: 'great', feedback: 'Facts first. Easy to check and fix.' },
          { text: 'Two sandwiches is wrong.', rating: 'good', feedback: 'Understood. "I only ordered…" makes it clearer.' },
          { text: "I don't know.", rating: 'basic', feedback: 'Point to the line on the bill and say what you ordered.' },
        ],
      },
      {
        ai: "You're right, I'm so sorry about that. I can take one off for you.",
        goal: 'Agree on the fix and thank them',
        keywords: ['thank', 'please', 'sorting', 'appreciate', 'no problem'],
        tip: 'Finish warmly. "Thanks for sorting that out" ends it on good terms.',
        options: [
          { text: 'Yes, please. Thanks for sorting that out!', rating: 'great', feedback: 'You accepted the fix and ended warmly.' },
          { text: 'Okay, good.', rating: 'good', feedback: 'Fine. A thank-you leaves a better impression.' },
          { text: 'Finally.', rating: 'basic', feedback: 'Stay friendly. A quick thanks goes a long way.' },
        ],
      },
    ],
    closing: 'No problem at all. Your new total is sixteen fifty.',
  },
]

export const DEFAULT_PRACTICE_MISSION_ID = 'order-coffee'

export function getMission(id: string): Mission | undefined {
  return MISSIONS.find((mission) => mission.id === id)
}

export function getLevel(id: number): Level {
  return LEVELS.find((level) => level.id === id) ?? LEVELS[0]
}

export function getAccent(id: AccentId) {
  return ACCENTS.find((accent) => accent.id === id) ?? ACCENTS[0]
}

export function resolveLine(line: Lines, accent: AccentId): string {
  return typeof line === 'string' ? line : line[accent]
}

export function getClosingLine(mission: Mission, accent: AccentId): string {
  return typeof mission.closing === 'string'
    ? `${getAccent(accent).filler} ${mission.closing}`
    : mission.closing[accent]
}

export function getMissionSteps(mission: Mission): { title: string; detail: string }[] {
  return [
    {
      title: 'Warm up with AI practice',
      detail: `Rehearse with ${mission.persona.name}, your AI ${mission.persona.role}. Optional, but it helps.`,
    },
    {
      title: `Go to ${mission.place}`,
      detail: 'Pick a calm moment so you are not rushed.',
    },
    {
      title: 'Have the conversation',
      detail: 'Put your phone away and use your phrases.',
    },
    {
      title: 'Check off and confirm',
      detail: `Tick your objectives and collect ${mission.xp} XP.`,
    },
  ]
}
