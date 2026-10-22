/* Название сайта */
window.SITE = {
  name: 'Tad Hayrapetian',
  tagline: 'English lessons'
};

/* Список уроков. Чтобы добавить урок:
   1. Положи HTML-файл в папку private/lessons. Имя файла = slug + .html
      (например, small-joys.html для slug 'small-joys')
   2. Скопируй блок ниже, поставь запятую и заполни поля
   color: forest, midnight, sky, storm или cream */
window.LESSONS = [
  {
    slug: 'small-joys',
    title: 'Small joys',
    topic: 'Rituals, habits and the little things that make life better',
    tag: 'Speaking',
    minutes: 90,
    color: 'forest'
  }
];
