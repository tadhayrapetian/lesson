/* Название сайта. name также стоит подписью учителя в письмах ученикам */
window.SITE = {
  name: 'Tad Hayrapetian',
  tagline: 'English lessons'
};

/* Список уроков. Чтобы добавить урок:
   1. Положи HTML-файл в папку private/lessons. Имя файла = slug + .html
      (например, small-joys.html для slug 'small-joys')
   2. Скопируй блок ниже, поставь запятую и заполни поля
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
    minutes: 90,
    color: 'forest',
    theme: { bg: '#F4EFE6', card: '#FEFCF6', ink: '#162A2C', muted: '#686867', accent: '#5E6C5B', onAccent: '#FEFCF6', soft: '#ECE6DA' }
  },
  {
    slug: 'underconsumption-core',
    title: 'Underconsumption Core',
    topic: 'What pushes us to buy, who profits from it, and why people are cutting back',
    tag: 'Speaking',
    minutes: 60,
    color: ['#B8410F', '#FBF8F2'],
    theme: { bg: '#E8E1D5', card: '#FBF8F2', ink: '#1A1712', muted: '#6A6156', accent: '#B8410F', onAccent: '#FBF8F2', soft: '#EFDFCF' }
  },
  {
    slug: 'people-who-shaped-us',
    title: 'The people who shaped us',
    topic: 'A grandmother, a teacher, a stranger at a train station: who changed the way you see the world?',
    tag: 'Speaking',
    minutes: 60,
    color: ['#2B211C', '#F3EDE2'],
    theme: { bg: '#F6EFE4', card: '#FFFBF4', ink: '#1F2433', muted: '#646A78', accent: '#2B211C', onAccent: '#F2C572', soft: '#F4DCCF' }
  }
];
