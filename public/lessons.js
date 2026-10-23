/* Всё, что написано на сайте. Меняй текст между кавычками.
   Если в тексте нужен апостроф ('), ставь перед ним \ : 'I\'m Tad' */

window.SITE = {
  // Имя стоит на главной и подписью учителя в письмах ученикам
  name: 'Tad Hayrapetian',
  tagline: 'English lessons',
  // Короткая фраза под именем на главной
  intro: 'One-to-one English lessons for adults who want to speak with confidence: at work, when travelling and in everyday conversations.',

  // О себе на двух языках. На сайте есть переключатель EN / ՀԱՅ
  about: {
    en: {
      title: 'About me',
      // Каждая строка — отдельный абзац
      text: [
        'I\'m Tadevos, an English language tutor with 10 years of teaching experience. I hold a Bachelor\'s degree in Fundamental and Applied Linguistics and a Master\'s degree from Volgograd State University.',
        'I teach general and conversational English, Business English, and exam preparation, tailoring my lessons to each student\'s goals and needs.'
      ],
      // Короткие факты рядом с текстом
      facts: ['10 years of teaching', 'BA and MA in Linguistics', 'General, Business English and exams']
    },
    hy: {
      title: 'Իմ մասին',
      text: [
        'Ես Թադն եմ՝ անգլերենի մասնագետ՝ 10 տարվա փորձով։ Ավարտել եմ Վոլգոգրադի պետական համալսարանի հիմնարար և կիրառական լեզվաբանության բակալավրիատն ու մագիստրատուրան։',
        'Դասավանդում եմ ընդհանուր, խոսակցական ու բիզնես անգլերեն, ինչպես նաև պատրաստում եմ քննությունների՝ ծրագիրը հարմարեցնելով յուրաքանչյուր ուսանողի նպատակներին ու կարիքներին։'
      ],
      facts: ['10 տարվա փորձ', 'Լեզվաբանության բակալավր և մագիստրոս', 'Ընդհանուր, բիզնես անգլերեն և քննություններ']
    }
  },

  // Соцсети. Пустой url — кнопка не показывается
  socials: [
    { label: 'Instagram', url: 'https://www.instagram.com/tadhayrapetian' },
    { label: 'Telegram', url: '' },
    { label: 'WhatsApp', url: '' },
    { label: 'YouTube', url: '' }
  ],

  // Абонементы. featured: true — выделенный тариф, trial: true — пробный урок
  plans: [
    { name: 'Trial lesson', price: 'Free', period: '30 minutes', features: ['Meet your teacher', 'Level check', 'A plan for your goals'], trial: true },
    { name: '4 lessons', price: '55,000 AMD', period: '4 lessons a month', features: ['One lesson a week', 'Homework with feedback', 'All lessons on this site', '13,750 AMD per lesson'] },
    { name: '8 lessons', price: '75,000 AMD', period: '8 lessons a month', features: ['Everything in 4 lessons', 'Two lessons a week', 'Personal study plan', 'Monthly progress review', '9,375 AMD per lesson (save 32%)'], featured: true },
    { name: 'Intensive', price: '199,900 AMD', period: '5 lessons a week, monthly', features: ['Everything in 8 lessons', 'A lesson every weekday', 'Fastest progress', 'Priority time slots', 'Chat support any day'] }
  ]
};

/* Список уроков. Чтобы добавить урок:
   1. Положи HTML-файл в папку private/lessons. Имя файла = slug + .html
      (например, small-joys.html для slug 'small-joys')
   2. Скопируй блок ниже, поставь запятую и заполни поля
   vocab: тема лексики, grammar: грамматика (пусто '', если грамматики в уроке нет)
   tag: что в уроке, 'Speaking' или несколько ['Speaking', 'Grammar']
   level: уровень для фильтра, 'B1' или несколько ['B2', 'C1']
   color: цвет блока на главной. forest, midnight, sky, storm, cream
          или свои цвета ['фон', 'текст'], например ['#B8410F', '#FBF8F2']
   theme: цвета письма, которое получает ученик (можно не указывать)
          bg фон письма, card карточка, ink текст, muted серый текст,
          accent главный цвет урока, onAccent текст на нём, soft светлая плашка */
window.LESSONS = [
  {
    slug: 'small-joys',
    title: 'Small joys',
    topic: 'Rituals, habits and the little things that make life better',
    vocab: 'Small pleasures and everyday rituals',
    grammar: 'Present simple vs present continuous',
    tag: ['Speaking', 'Grammar'],
    level: 'B1',
    minutes: 90,
    color: 'forest',
    theme: { bg: '#F4EFE6', card: '#FEFCF6', ink: '#162A2C', muted: '#686867', accent: '#5E6C5B', onAccent: '#FEFCF6', soft: '#ECE6DA' }
  },
  {
    slug: 'underconsumption-core',
    title: 'Underconsumption Core',
    topic: 'What pushes us to buy, who profits from it, and why people are cutting back',
    vocab: 'Consumerism and shopping habits',
    grammar: '',
    tag: 'Speaking',
    level: ['B2', 'C1'],
    minutes: 60,
    color: ['#B8410F', '#FBF8F2'],
    theme: { bg: '#E8E1D5', card: '#FBF8F2', ink: '#1A1712', muted: '#6A6156', accent: '#B8410F', onAccent: '#FBF8F2', soft: '#EFDFCF' }
  },
  {
    slug: 'people-who-shaped-us',
    title: 'The people who shaped us',
    topic: 'A grandmother, a teacher, a stranger at a train station: who changed the way you see the world?',
    vocab: 'Influence and role models',
    grammar: 'Used to and would',
    tag: ['Speaking', 'Grammar'],
    level: 'B2',
    minutes: 60,
    color: ['#2B211C', '#F3EDE2'],
    theme: { bg: '#F6EFE4', card: '#FFFBF4', ink: '#1F2433', muted: '#646A78', accent: '#2B211C', onAccent: '#F2C572', soft: '#F4DCCF' }
  },
  {
    slug: 'alone-among-millions',
    title: 'Alone among millions',
    topic: 'Why do people feel lonely in a city full of people, and what small steps help them feel at home?',
    vocab: 'Loneliness and belonging',
    grammar: 'The more…, the more…',
    tag: ['Speaking', 'Grammar'],
    level: 'B2',
    minutes: 60,
    color: ['#252D48', '#F3EDE2'],
    theme: { bg: '#F6EFE4', card: '#FFFBF4', ink: '#1F2433', muted: '#646A78', accent: '#252D48', onAccent: '#F2C572', soft: '#F4DCCF' }
  },
  {
    slug: 'money-mindset',
    title: 'Money mindset',
    topic: 'Why we buy what we don\'t need, with the second conditional',
    vocab: 'Money and spending',
    grammar: 'Second conditional',
    tag: ['Speaking', 'Grammar'],
    level: 'B2',
    minutes: 60,
    color: ['#0B3D2E', '#FAF6EE'],
    theme: { bg: '#FAF6EE', card: '#FFFDF8', ink: '#241F1A', muted: '#6B6154', accent: '#0B3D2E', onAccent: '#E3C98A', soft: '#F1ECE0' }
  },
  {
    slug: 'ghosting-friendship',
    title: 'Ghosted',
    topic: 'Why adult friendships fade, with reported speech',
    vocab: 'Friendship and drifting apart',
    grammar: 'Reported speech',
    tag: ['Speaking', 'Grammar'],
    level: 'B2',
    minutes: 60,
    color: ['#6B4257', '#F7F1F0'],
    theme: { bg: '#F7F1F0', card: '#FFFDFC', ink: '#2B2530', muted: '#8A7C86', accent: '#6B4257', onAccent: '#FFFDFC', soft: '#F1DEDE' }
  },
  {
    slug: 'hustle-burnout',
    title: 'Hustle culture and burnout',
    topic: 'What we owe our jobs and what we don\'t, with modals of advice and obligation',
    vocab: 'Work, stress and burnout',
    grammar: 'Modals of advice and obligation',
    tag: ['Speaking', 'Grammar'],
    level: 'B2',
    minutes: 60,
    color: ['#C1541E', '#FFF8EE'],
    theme: { bg: '#F5EDE1', card: '#FFF8EE', ink: '#241A12', muted: '#7A6F5C', accent: '#1B2A41', onAccent: '#FFF8EE', soft: '#EFE3D2' }
  },
  {
    slug: 'cancel-culture',
    title: 'Cancel culture',
    topic: 'Public opinion on trial, with the passive voice',
    vocab: 'Public opinion and scandal',
    grammar: 'The passive voice',
    tag: ['Speaking', 'Grammar'],
    level: 'B2',
    minutes: 60,
    color: ['#181818', '#F4F1EA'],
    theme: { bg: '#F4F1EA', card: '#FFFFFF', ink: '#181818', muted: '#6B6B6B', accent: '#C8202F', onAccent: '#FFFFFF', soft: '#EBE6DA' }
  },
  {
    slug: 'nostalgia-generations',
    title: 'Nostalgia and generations',
    topic: 'Were things really better back then? With used to and would',
    vocab: 'Nostalgia and generations',
    grammar: 'Used to, would and present simple',
    tag: ['Speaking', 'Grammar'],
    level: 'B2',
    minutes: 60,
    color: ['#7A5230', '#FAF3E4'],
    theme: { bg: '#F2E8D5', card: '#FAF3E4', ink: '#2E2115', muted: '#8A6F55', accent: '#7A5230', onAccent: '#FAF3E4', soft: '#E9DBC0' }
  },
  {
    slug: 'dumbphone-comeback',
    title: 'The Dumbphone Comeback',
    topic: 'Why some young people are trading their smartphones for simple phones',
    vocab: 'Technology habits',
    grammar: 'Used to for past habits and states',
    tag: ['Speaking', 'Grammar'],
    level: 'B1',
    minutes: 60,
    color: ['#2C5F8A', '#FFFFFF'],
    theme: { bg: '#E9EEF0', card: '#FFFFFF', ink: '#1E2B30', muted: '#5B6B70', accent: '#2C5F8A', onAccent: '#FFFFFF', soft: '#E3EEF7' }
  },
  {
    slug: 'four-day-week',
    title: 'The Four-Day Week',
    topic: 'Three days off every week. Is this the future of work?',
    vocab: 'Work and well-being',
    grammar: 'Second conditional',
    tag: ['Speaking', 'Grammar'],
    level: 'B1',
    minutes: 60,
    color: ['#D9572A', '#FFFFFF'],
    theme: { bg: '#FFFDF6', card: '#FFFFFF', ink: '#23313A', muted: '#56646C', accent: '#D9572A', onAccent: '#FFFFFF', soft: '#FFF0DA' }
  },
  {
    slug: 'micro-trends',
    title: 'Trends That Last Five Minutes',
    topic: 'Social media is changing how fast fashion moves, and how young people shop',
    vocab: 'Fashion and social media',
    grammar: 'Present perfect and past simple',
    tag: ['Speaking', 'Grammar'],
    level: 'B1',
    minutes: 60,
    color: ['#D92F74', '#FFFFFF'],
    theme: { bg: '#FFEFF5', card: '#FFFFFF', ink: '#1E1530', muted: '#67597A', accent: '#D92F74', onAccent: '#FFFFFF', soft: '#FFE0EC' }
  },
  {
    slug: 'solo-travel',
    title: 'Table for One, Please',
    topic: 'Travelling alone is more popular than ever. Is it brave, lonely or the best thing you can do?',
    vocab: 'Travel',
    grammar: 'Modals of obligation, prohibition and advice',
    tag: ['Speaking', 'Grammar'],
    level: 'B1',
    minutes: 60,
    color: ['#0B7480', '#FFFFFF'],
    theme: { bg: '#E7F2F3', card: '#FFFFFF', ink: '#173A3F', muted: '#4F6B6F', accent: '#0B7480', onAccent: '#FFFFFF', soft: '#DDF0F1' }
  },
  {
    slug: 'living-with-parents',
    title: 'Back in My Old Bedroom',
    topic: 'Why more young adults live with their parents, and how families make it work',
    vocab: 'Home and money',
    grammar: 'Verb + -ing and verb + to-infinitive',
    tag: ['Speaking', 'Grammar'],
    level: 'B1',
    minutes: 60,
    color: ['#6D4C9A', '#FFFFFF'],
    theme: { bg: '#FCF1E8', card: '#FFFAF6', ink: '#2E2233', muted: '#6A5B6B', accent: '#6D4C9A', onAccent: '#FFFFFF', soft: '#F6E3D6' }
  },
  {
    slug: 'food-delivery',
    title: 'The Kitchen Nobody Uses',
    topic: 'Food delivery apps have changed how we eat. Are we forgetting how to cook?',
    vocab: 'Food and services',
    grammar: 'Quantifiers with countable and uncountable nouns',
    tag: ['Speaking', 'Grammar'],
    level: 'B1',
    minutes: 60,
    color: ['#2A7449', '#FFFFFF'],
    theme: { bg: '#FFF8EE', card: '#FFFFFF', ink: '#2A2620', muted: '#6A6155', accent: '#2A7449', onAccent: '#FFFFFF', soft: '#E6F2EA' }
  },
  {
    slug: 'booktok',
    title: 'How TikTok Got Teenagers Reading',
    topic: 'Short videos and long novels don’t sound like friends. On BookTok, they are.',
    vocab: 'Books and media',
    grammar: 'Defining relative clauses',
    tag: ['Speaking', 'Grammar'],
    level: 'B1',
    minutes: 60,
    color: ['#8E2C48', '#FFFFFF'],
    theme: { bg: '#FAF6F1', card: '#FFFFFF', ink: '#2B1D22', muted: '#6B575D', accent: '#8E2C48', onAccent: '#FFFFFF', soft: '#F3E6EA' }
  },
  {
    slug: 'sleep-tourism',
    title: 'Holidays for Sleeping',
    topic: 'The newest travel trend isn’t about seeing more. It’s about sleeping better.',
    vocab: 'Rest and travel',
    grammar: 'First conditional and future time clauses',
    tag: ['Speaking', 'Grammar'],
    level: 'B1',
    minutes: 60,
    color: ['#5A55C8', '#FFFFFF'],
    theme: { bg: '#F3F2FB', card: '#FFFFFF', ink: '#24224A', muted: '#5E5B82', accent: '#5A55C8', onAccent: '#FFFFFF', soft: '#E6E4F8' }
  },
  {
    slug: 'ai-companions',
    title: 'My Friend Is a Chatbot',
    topic: 'Millions of people talk to AI companions every day. Is this connection or isolation?',
    vocab: 'Relationships and emotions',
    grammar: 'Modals of speculation in the present',
    tag: ['Speaking', 'Grammar'],
    level: 'B2',
    minutes: 75,
    color: ['#3450D8', '#FFFFFF'],
    theme: { bg: '#F1F5FF', card: '#FFFFFF', ink: '#1B2140', muted: '#576080', accent: '#3450D8', onAccent: '#FFFFFF', soft: '#E2E8FF' }
  },
  {
    slug: 'job-hugging',
    title: 'Holding On Tight',
    topic: 'From quiet quitting to job hugging: what workers want in an uncertain economy',
    vocab: 'Careers and the job market',
    grammar: 'Reporting verbs and their patterns',
    tag: ['Speaking', 'Grammar'],
    level: 'B2',
    minutes: 75,
    color: ['#2F5D4A', '#FFFFFF'],
    theme: { bg: '#F4F3EC', card: '#FFFFFF', ink: '#1F2A24', muted: '#5A665E', accent: '#2F5D4A', onAccent: '#FFFFFF', soft: '#E5EDE6' }
  },
  {
    slug: 'overtourism',
    title: 'Tourists Go Home?',
    topic: 'Some of the world’s most beautiful places are pushing back against mass tourism',
    vocab: 'Tourism and cities',
    grammar: 'The passive, including modal passives',
    tag: ['Speaking', 'Grammar'],
    level: 'B2',
    minutes: 75,
    color: ['#1C64A8', '#FFFFFF'],
    theme: { bg: '#FBF5EA', card: '#FFFFFF', ink: '#1C2C44', muted: '#59677B', accent: '#1C64A8', onAccent: '#FFFFFF', soft: '#E2EDF8' }
  },
  {
    slug: 'run-clubs',
    title: 'Swipe Left, Run Right',
    topic: 'Why young people are lacing up their trainers to find friends, and sometimes love',
    vocab: 'Social life and relationships',
    grammar: 'Used to, be used to and get used to',
    tag: ['Speaking', 'Grammar'],
    level: 'B2',
    minutes: 75,
    color: ['#D2432D', '#FFFFFF'],
    theme: { bg: '#F7FBF8', card: '#FFFFFF', ink: '#1E2A28', muted: '#566561', accent: '#D2432D', onAccent: '#FFFFFF', soft: '#FFE5DF' }
  },
  {
    slug: 'sharenting',
    title: 'Born Online',
    topic: 'Parents share their children’s lives on social media. Who gets to decide?',
    vocab: 'Privacy and the internet',
    grammar: 'Third conditional and should have',
    tag: ['Speaking', 'Grammar'],
    level: 'B2',
    minutes: 75,
    color: ['#A8336A', '#FFFFFF'],
    theme: { bg: '#FFF8F4', card: '#FFFFFF', ink: '#2E2228', muted: '#6A5A62', accent: '#A8336A', onAccent: '#FFFFFF', soft: '#FBE6EE' }
  },
  {
    slug: 'lab-grown-meat',
    title: 'Meat Without the Animal',
    topic: 'Cultivated meat is on a few menus already. Would you eat it?',
    vocab: 'Food, science and the environment',
    grammar: 'Future continuous and future perfect',
    tag: ['Speaking', 'Grammar'],
    level: 'B2',
    minutes: 75,
    color: ['#2E7D32', '#FFFFFF'],
    theme: { bg: '#EFF7EA', card: '#FFFFFF', ink: '#18301B', muted: '#536D57', accent: '#2E7D32', onAccent: '#FFFFFF', soft: '#DDF0D6' }
  },
  {
    slug: 'right-to-repair',
    title: 'Fix It, Don’t Bin It',
    topic: 'Why your phone is so hard to repair, and the new laws trying to change that',
    vocab: 'Technology and consumer rights',
    grammar: 'Causative have / get something done',
    tag: ['Speaking', 'Grammar'],
    level: 'B2',
    minutes: 75,
    color: ['#C2500F', '#FFFFFF'],
    theme: { bg: '#F3F1EC', card: '#FFFFFF', ink: '#14313A', muted: '#52656D', accent: '#C2500F', onAccent: '#FFFFFF', soft: '#FBE2D2' }
  },
  {
    slug: 'phone-bans-in-schools',
    title: 'Phones Away, Heads Up',
    topic: 'Countries around the world are banning phones in schools. Is it working?',
    vocab: 'Education and technology',
    grammar: 'Linkers of contrast',
    tag: ['Speaking', 'Grammar'],
    level: 'B2',
    minutes: 75,
    color: ['#C2372B', '#FFFFFF'],
    theme: { bg: '#EEF2F7', card: '#FFFFFF', ink: '#1E2633', muted: '#586273', accent: '#C2372B', onAccent: '#FFFFFF', soft: '#FBE4E1' }
  },
  {
    slug: 'digital-nomads',
    title: 'Office: Anywhere',
    topic: 'Remote workers are moving abroad with a laptop. Who wins, and who pays?',
    vocab: 'Work, travel and cities',
    grammar: 'Wish and if only',
    tag: ['Speaking', 'Grammar'],
    level: 'B2',
    minutes: 75,
    color: ['#00796D', '#FFFFFF'],
    theme: { bg: '#FFF6E8', card: '#FFFFFF', ink: '#1F2D2B', muted: '#5B6763', accent: '#00796D', onAccent: '#FFFFFF', soft: '#DDF3EF' }
  },
  {
    slug: 'gamification',
    title: 'Don’t Break the Streak',
    topic: 'Apps turn our habits into games. Are we more motivated, or just more hooked?',
    vocab: 'Motivation and habits',
    grammar: 'Verbs that change meaning: remember, stop, try…',
    tag: ['Speaking', 'Grammar'],
    level: 'B2',
    minutes: 75,
    color: ['#6A3DF0', '#FFFFFF'],
    theme: { bg: '#F5F2FF', card: '#FFFFFF', ink: '#221A3D', muted: '#5F5780', accent: '#6A3DF0', onAccent: '#FFFFFF', soft: '#ECE6FF' }
  },
  {
    slug: 'deepfakes',
    title: 'Seeing Is No Longer Believing',
    topic: 'Synthetic media can put words in anyone’s mouth. What happens to trust?',
    vocab: 'Technology, crime and trust',
    grammar: 'Past modals of deduction, including passives',
    tag: ['Speaking', 'Grammar'],
    level: 'C1',
    minutes: 90,
    color: ['#C81D45', '#FFFFFF'],
    theme: { bg: '#F3F3F0', card: '#FFFFFF', ink: '#1A1D21', muted: '#5B5F65', accent: '#C81D45', onAccent: '#FFFFFF', soft: '#F8E1E6' }
  },
  {
    slug: 'brain-rot',
    title: 'Brain Rot',
    topic: 'Oxford’s Word of the Year 2024 gave a name to our anxiety about scrolling. But is it real?',
    vocab: 'Media and cognition',
    grammar: 'Cleft sentences for emphasis',
    tag: ['Speaking', 'Grammar'],
    level: 'C1',
    minutes: 90,
    color: ['#5236F0', '#FFFFFF'],
    theme: { bg: '#FCFBF0', card: '#FFFFFF', ink: '#1E1A33', muted: '#5F5A75', accent: '#5236F0', onAccent: '#FFFFFF', soft: '#ECE9FF' }
  },
  {
    slug: 'de-extinction',
    title: 'Back from the Dead',
    topic: 'Scientists say they can bring back lost species. The harder question is whether they should.',
    vocab: 'Science and conservation',
    grammar: 'Inversion after negative adverbials',
    tag: ['Speaking', 'Grammar'],
    level: 'C1',
    minutes: 90,
    color: ['#7A5426', '#FFFFFF'],
    theme: { bg: '#F4F0E6', card: '#FFFDF8', ink: '#2A2418', muted: '#675D4C', accent: '#7A5426', onAccent: '#FFFFFF', soft: '#EDE4D1' }
  },
  {
    slug: 'longevity',
    title: 'The Race to Live Forever',
    topic: 'Tech millionaires are spending fortunes to slow down ageing. What can the rest of us learn?',
    vocab: 'Health, science and lifestyle',
    grammar: 'Distancing and impersonal reporting',
    tag: ['Speaking', 'Grammar'],
    level: 'C1',
    minutes: 90,
    color: ['#1D7178', '#FFFFFF'],
    theme: { bg: '#F1F7F6', card: '#FFFFFF', ink: '#18302F', muted: '#536D66', accent: '#1D7178', onAccent: '#FFFFFF', soft: '#DFF0EF' }
  },
  {
    slug: 'universal-basic-income',
    title: 'Money for Nothing?',
    topic: 'As automation spreads, universal basic income is back on the agenda. Would it free us or ruin us?',
    vocab: 'Economics and social policy',
    grammar: 'Mixed conditionals and conditional inversion',
    tag: ['Speaking', 'Grammar'],
    level: 'C1',
    minutes: 90,
    color: ['#2A4C85', '#FFFFFF'],
    theme: { bg: '#F6F4EE', card: '#FFFFFF', ink: '#1B2740', muted: '#586276', accent: '#2A4C85', onAccent: '#FFFFFF', soft: '#E3E9F5' }
  },
  {
    slug: 'space-tourism',
    title: 'Tickets to Orbit',
    topic: 'Space travel is no longer only for astronauts. Is it a giant leap, or a billionaire’s joyride?',
    vocab: 'Space, business and the environment',
    grammar: 'Participle clauses',
    tag: ['Speaking', 'Grammar'],
    level: 'C1',
    minutes: 90,
    color: ['#30339A', '#FFFFFF'],
    theme: { bg: '#EDF0F9', card: '#FFFFFF', ink: '#1C1F4A', muted: '#575B83', accent: '#30339A', onAccent: '#FFFFFF', soft: '#E1E5F8' }
  },
  {
    slug: 'dating-app-fatigue',
    title: 'Swipe Fatigue',
    topic: 'Millions of people are deleting their dating apps. Has the algorithm broken romance?',
    vocab: 'Relationships and technology',
    grammar: 'Sentence adverbs for attitude and probability',
    tag: ['Speaking', 'Grammar'],
    level: 'C1',
    minutes: 90,
    color: ['#C93A52', '#FFFFFF'],
    theme: { bg: '#FFF2EF', card: '#FFFFFF', ink: '#2B2433', muted: '#6A5D6C', accent: '#C93A52', onAccent: '#FFFFFF', soft: '#FFE1DC' }
  }
];
