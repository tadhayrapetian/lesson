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
    tag: 'Speaking',
    level: 'B1',
    minutes: 90,
    color: 'forest',
    theme: { bg: '#F4EFE6', card: '#FEFCF6', ink: '#162A2C', muted: '#686867', accent: '#5E6C5B', onAccent: '#FEFCF6', soft: '#ECE6DA' }
  },
  {
    slug: 'underconsumption-core',
    title: 'Underconsumption Core',
    topic: 'What pushes us to buy, who profits from it, and why people are cutting back',
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
    tag: 'Speaking',
    level: 'B2',
    minutes: 60,
    color: ['#2B211C', '#F3EDE2'],
    theme: { bg: '#F6EFE4', card: '#FFFBF4', ink: '#1F2433', muted: '#646A78', accent: '#2B211C', onAccent: '#F2C572', soft: '#F4DCCF' }
  },
  {
    slug: 'alone-among-millions',
    title: 'Alone among millions',
    topic: 'Why do people feel lonely in a city full of people, and what small steps help them feel at home?',
    tag: 'Speaking',
    level: 'B2',
    minutes: 60,
    color: ['#252D48', '#F3EDE2'],
    theme: { bg: '#F6EFE4', card: '#FFFBF4', ink: '#1F2433', muted: '#646A78', accent: '#252D48', onAccent: '#F2C572', soft: '#F4DCCF' }
  }
];
