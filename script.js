
//  ДАННЫЕ СБОРОК (BUILDS)
//  Массив объектов. Каждый объект — одна сборка ПК со всеми её параметрами.
//
//  Структура одного объекта:
//    id       — уникальный идентификатор (строка). Используется как ключ
//               для привязки цвета из COLORS.
//    name     — название сборки (выводится в заголовке карточки и в легенде
//               графиков).
//    desc     — краткое описание сборки.
//    price    — цена в виде строки с символом валюты.
//    specs    — массив характеристик: каждая запись — объект { label, value }.
//               label — название характеристики (например "CPU"),
//               value — её значение (например "Intel Core i3 14100F").
//               Характеристики выводятся списком на карточке, а label "GPU"
//               используется для подписи на графике с играми.
//    images   — массив путей к изображениям сборки. Из них строится галерея
//               с переключением по ◀ ▶.
//    fps      — массив чисел FPS для 5 игр (порядок важен, соответствует
//               массиву labels в графике Игры).
//    bench    — массив чисел для 4 бенчмарков (порядок соответствует массиву
//               labels в графике Бенчмарки).


// МАССИВ СБОРОК

const BUILDS = [

  // Сборка №1: Not-For-Study
  {
    id: 'nfs',
    name: 'Not-For-Study',
    desc: 'Выходец из вершины бюджетного сегмента, тот самый случай, когда нужно сказать папе, что для учёбы и по цене видно.',
    price: '70 000 ₽',
    specs: [
      { label: 'CPU', value: 'Intel Core i3 14100F' },
      { label: 'GPU', value: 'RTX 4050 8GB' },
      { label: 'RAM', value: '16GB DDR4 3200MHz' },
      { label: 'SSD', value: '512GB NVMe M.2' },
      { label: 'Материнская плата', value: 'B760M' },
      { label: 'Блок питания', value: '550W 80+ Bronze' },
      { label: 'Корпус', value: 'DeepCool Matrexx 30' },
    ],
    images: [
      '.\\Images\\NotForStudy1.png',
      '.\\Images\\NotForStudy2.png',
      '.\\Images\\NotForStudy3.jpeg',
    ],
    fps: [55, 75, 120, 50, 90],
    bench: [8200, 18, 2100, 8200],
  },

  // Сборка №2: Mighty Knight
  {
    id: 'mk',
    name: 'Mighty Knight',
    desc: 'Серьёзная сборка для серьёзных людей с заделом под апгрейд на платформе AM5.',
    price: '105 000 ₽',
    specs: [
      { label: 'CPU', value: 'AMD Ryzen 5 7500F' },
      { label: 'GPU', value: 'RTX 4070 12GB' },
      { label: 'RAM', value: '16GB DDR5 5600MHz' },
      { label: 'SSD', value: '1TB NVMe M.2 Gen4' },
      { label: 'Материнская плата', value: 'B650' },
      { label: 'Блок питания', value: '750W 80+ Gold' },
      { label: 'Корпус', value: 'Fractal Design Pop Air' },
    ],
    images: [
      '.\\Images\\MightyKnight1.jpg',
      '.\\Images\\MightyKnight2.jpg',
      '.\\Images\\MightyKnight3.jpg',
    ],
    fps: [90, 130, 200, 85, 165],
    bench: [15200, 9, 2400, 11500],
  },

];

//  цвета для графиков
const COLORS = {
  nfs: '#00d4aa',   // бирюзовый — для Not-For-Study
  mk: '#7c5cfc',    // фиолетовый — для Mighty Knight
};


//  Запускается ТОЛЬКО ПОСЛЕ ТОГО, как браузер полностью загрузил и разобрал HTML-документ.
//  Это гарантирует, что все DOM-элементы, к которым мы обращаемся
//  (clock, .builds-grid, canvas), уже существуют на странице. 
//  Null не будет
document.addEventListener('DOMContentLoaded', () => {

  //  Часы
  //  Берём элемент <div id="clock"> и каждую секунду обновляем его текст.
  //  toLocaleTimeString('ru-RU') форматирует время по-русски: ЧЧ:ММ:СС.
  //  setInterval(callback, 1000) вызывает callback каждые 1000 миллисекунд

  const clock = document.getElementById('clock');

  function updateClock() {
    const now = new Date();                                          // текущее время
    clock.textContent = now.toLocaleTimeString('ru-RU', {            // форматируем в ЧЧ:ММ:СС
      hour: '2-digit',                                              
      minute: '2-digit',                                            
      second: '2-digit',                                            
    });
  }

  updateClock();

  // Запускаем таймер, который будет вызывать updateClock каждые 1000 мс.
  // setInterval возвращает идентификатор таймера — его можно передать
  setInterval(updateClock, 1000);

  // ===========================================================================
  //  подсветка активного пункта
  //
  //  IntersectionObserver — встроенный API браузера,
  //  Следит, какие элементы сейчас видны в окне (пересекаются
  //  с областью просмотра).

  // все секции страницы с классом "section".
  // document.querySelectorAll() возвращает NodeList (похож на массив).
  // В нашем случае: #home, #builds, #benchmarks, #reviews.
  const sections = document.querySelectorAll('.section');

  // все кнопки навигации с классом "nav-btn".
  const navBtns = document.querySelectorAll('.nav-btn');

  // Конструктор IntersectionObserver принимает два аргумента:
  //   сallback — функция, которая вызывается при изменении видимости.
  //      Она получает массив entries — по одному объекту на каждую секцию,
  //      чья видимость изменилась.
  //   options — объект настроек (здесь только rootMargin).
  const observer = new IntersectionObserver(entries => {

    // проходимся по всем секциям, которые изменили свою видимость
    entries.forEach(entry => {

      // Если секция пересеклась с зоной наблюдения (стала видна)
      if (entry.isIntersecting) {

        // Проходим по каждой кнопке навигации
        navBtns.forEach(btn => {

          // btn.getAttribute('href') вернёт, например, "#builds"
          // entry.target.id вернёт, например, "builds"
          // Сравниваем: если href === "#builds", то класс .active = true,
          // иначе — false (класс .active убирается).
          // classList.toggle(className, condition) добавляет класс,
          // если condition === true, и удаляет, если false.
          btn.classList.toggle(
            'active',
            btn.getAttribute('href') === `#${entry.target.id}`
          );

        });
      }
    });
  }, {
    // rootMargin задаёт область срабатывания observer вокруг экрана.
    rootMargin: '-40% 0px -55% 0px',
  });

  // Теперь observer будет отслеживать видимость всех .section-элементов.
  sections.forEach(s => observer.observe(s));

  //  ОТРИСОВКА КАРТОЧЕК СБОРОК
  //  Вызываем функцию renderBuilds(), которая строит HTML-карточки
  //  на основе данных из массива BUILDS и вставляет их в контейнер
  //  <div class="builds-grid">

  renderBuilds();

  // переключение картинок
  // Находим все галереи на странице (каждая сборка содержит одну галерею).
  document.querySelectorAll('.image-gallery').forEach(gallery => {

    // Внутри конкретной галереи находим:
    const images = gallery.querySelectorAll('.gallery-img');    // все изображения (дочерние img)
    const counter = gallery.querySelector('.img-counter');      // элемент-счётчик ("1/3")
    const prevBtn = gallery.querySelector('.prev');             // кнопка ◀ (назад)
    const nextBtn = gallery.querySelector('.next');             // кнопка ▶ (вперёд)

    // Функция update(index) — переключает картинку на кадр index
    //   index — индекс изображения, которое нужно показать (0, 1, 2...)
    function update(index) {
      images.forEach((img, i) => {
        img.classList.toggle('active', i === index);
      });
      counter.textContent = `${index + 1}/${images.length}`;
    }

    // Текущий активный индекс. Начинаем с 0 (первое изображение).
    let current = 0;

    // обработчик клика на НАЗАД
    prevBtn.addEventListener('click', () => {
      current = (current - 1 + images.length) % images.length;
      update(current);
    });

    // обработчик клика на ВПЕРЁД
    nextBtn.addEventListener('click', () => {
      current = (current + 1) % images.length;
      update(current);
    });

  });

  //  графики CHART.JS
  //
  //  Chart.js — это сторонняя библиотека, подключённая через CDN в HTML
  //
  //  У нас два холста (canvas):
  //    #gamesChart — столбчатая диаграмма FPS
  //    #workChart  — столбчатая диаграмма бенчмарков
  //
  //  Каждый график показывает данные для двух сборок одновременно.
  //  Данные берутся из массива BUILDS: для gamesChart используется
  //  каждая сборка из BUILDS и её поле fps, для workChart — поле bench.
  // ===========================================================================

  // Адаптив под мобильные устройства
  // window.innerWidth — ширина окна браузера в пикселях.
  // Если меньше 768px (точка перелома из CSS), уменьшаем шрифты
  // подписей на графиках, чтобы они не налезали друг на друга.
  const isMobile = window.innerWidth < 768;           // true, если экран маленький
  const baseFontSize = isMobile ? 9 : 12;             // шрифт подписей осей: 9px на мобилке, 12px на десктопе
  const legendFontSize = isMobile ? 8 : 11;           // шрифт легенды: 8px на мобилке, 11px на десктопе

  // Общие настройки для обоих графиков (cfg)
  // Это объект, который разворачиваем через ...cfg
  // в options каждого графика. Так не приходится дублировать
  // одни и те же настройки дважды.
  const cfg = {
    responsive: true,             // график подстраивается под размер контейнера
    maintainAspectRatio: true,    // сохраняет пропорции (ширина/высота)
    plugins: {
      legend: {
        labels: {
          color: '#ccc',                                               // цвет текста подписей
          font: { family: 'Inter, sans-serif', size: legendFontSize }, // шрифт и размер
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#aaa', font: { family: 'Inter, sans-serif', size: baseFontSize } },
        grid: { color: '#222' },                                       // цвет линий сетки по оси X
      },
      y: {
        ticks: { color: '#aaa', font: { family: 'Inter, sans-serif', size: baseFontSize } },
        grid: { color: '#222' },                                       // цвет линий сетки по оси Y
      },
    },
  };


  // Функция buildDatasets(field, labelFn)
  // Крутая функция, которая строит массив dataset'ов для Chart.js
  // на основе массива BUILDS.
  //
  // Параметры:
  //   field   — имя поля в объекте сборки, откуда брать данные
  //             ('fps' для игр, 'bench' для бенчмарков)
  //   labelFn — функция, которая получает объект сборки и возвращает
  //             строку-подпись для легенды графика.
  //             
  // Что делает:
  //   Проходит по всем сборкам из BUILDS (через .map()) и для каждой
  //   создаёт объект с полями, которые ожидает Chart.js:
  //     label           — отображается в легенде
  //     data            — массив чисел (значения столбцов)
  //     backgroundColor — цвет столбцов (берётся из COLORS по id сборки)
  //     borderRadius    — скругление уголков столбцов
  //
  // Возвращает:  массив таких объектов — он вставляется в datasets графика.
  function buildDatasets(field, labelFn) {
    return BUILDS.map(b => ({
      label: labelFn(b),           // подпись: например "Not-For-Study (RTX 4050)"
      data: b[field],              // данные: b['fps'] или b['bench']
      backgroundColor: COLORS[b.id], // цвет из COLORS по id (nfs → '#00d4aa')
      borderRadius: 4,             // скругление углов столбцов
    }));
  }


  // График №1 — Игры (FPS, 1080p)

  // new Chart(canvasElement, config) создаёт и отрисовывает график
  // в указанном canvas-элементе.
  //
  // config состоит из:
  //   type    — тип диаграммы ('bar' = столбчатая)
  //   data    — данные: labels (подписи по оси X) и datasets (наборы столбцов)
  //   options — настройки внешнего вида
  //
  // labels: названия игр (пять штук). Порядок важен — первый элемент
  //         соответствует первому значению в каждом массиве data.
  //
  // datasets: строим через buildDatasets('fps', ...), где labelFn
  //           формирует подпись вида "Not-For-Study (RTX 4050)".
  //           GPU берётся из specs каждой сборки.
  //
  // tooltip: при наведении на столбец показывается всплывающая подсказка
  //          с названием сборки и числом FPS. ctx.raw — это значение
  //          столбца (например 55, 90 и т.д.).
  // ---------------------------------------------------------------
  new Chart(document.getElementById('gamesChart'), {
    type: 'bar',                                              // столбчатая диаграмма
    data: {
      labels: ['Cyberpunk 2077', 'Fortnite', 'CS2', 'Baldur\'s Gate 3', 'Apex Legends'], 
      datasets: buildDatasets('fps', b => {
        // Ищем в характеристиках сборки запись с label === 'GPU'
        const gpu = b.specs.find(s => s.label === 'GPU').value;
        // Формируем: "Not-For-Study (RTX 4050)"
        return `${b.name} (${gpu})`;
      }),
    },
    options: {
      ...cfg,                                                 // вставляем общие настройки
      plugins: {
        ...cfg.plugins,                                       // вставляем настройки плагинов из cfg
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.dataset.label}: ${ctx.raw} FPS`,
          },
        },
      },
    },
  });


  // График №2 Бенчмарки

  // Аналогично тестам, но:
  //   • labels — названия бенчмарков (4 штуки)
  //   • field = 'bench' (используем поле bench из BUILDS)
  //   • labelFn = b => b.name (просто название сборки, без GPU)
  //   • tooltip — без суффикса FPS (у бенчмарков разные единицы:
  //     баллы, минуты и т.д.)

  new Chart(document.getElementById('workChart'), {
    type: 'bar',
    data: {
      labels: ['Cinebench R23\n(многоядерный)', 'Blender\nClassroom (мин)', 'Geekbench 6\nSingle', 'Geekbench 6\nMulti'],
      datasets: buildDatasets('bench', b => b.name),
    },
    options: {
      ...cfg,
      plugins: {
        ...cfg.plugins,
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.dataset.label}: ${ctx.raw}`,
          },
        },
      },
    },
  });

});


//  функция renderBuilds()

//    Нужна, чтобы превратить массив BUILDS в HTML-разметку карточек и вставить
//    эту разметку в элемент <div class="builds-grid">.

function renderBuilds() {

  // контейнер, куда будем вставлять карточки.
  const grid = document.querySelector('.builds-grid');

  // Строим HTML-строку из данных BUILDS и вставляем в контейнер.
  //
  //   BUILDS.map(...)  возвращает массив строк (по одной на сборку). В данном случае массив-html строк
  //   .join('')        склеивает массив в одну строку без разделителей
  //   grid.innerHTML   записывает полученную строку в DOM
  
  // подставляем js-данные в html-структуру
  grid.innerHTML = BUILDS.map((build, idx) => `
    <div class="build-card">
      <div class="image-gallery">
        ${build.images.map((src, i) => `
          <img class="gallery-img${i === 0 ? ' active' : ''}" src="${src}" alt="${build.name} вид ${i + 1}">
        `).join('')}
        <div class="gallery-controls">
          <button class="gallery-btn prev" data-build="${idx}">◀</button>
          <span class="img-counter">1/${build.images.length}</span>
          <button class="gallery-btn next" data-build="${idx}">▶</button>
        </div>
      </div>
      <div class="build-info">
        <h3>${build.name}</h3>
        <p class="build-desc">${build.desc}</p>
        <ul class="specs">
          ${build.specs.map(s => `<li><span>${s.label}:</span> ${s.value}</li>`).join('')}
        </ul>
        <div class="price">${build.price}</div>
      </div>
    </div>
  `).join('');

}

//  ДАННЫЕ ВИКТОРИНЫ
const QUIZ = [
  {
    question: 'Что означает аббревиатура CPU?',
    options: ['Central Processing Unit', 'Computer Personal Unit', 'Central Program Utility', 'Core Processing Unit'],
    correct: 0,
  },
  {
    question: 'Что такое VRAM?',
    options: ['Виртуальная оперативная память', 'Память видеокарты', 'Память процессора', 'Память блока питания'],
    correct: 1,
  },
  {
    question: 'Чем NVME отличается от SATA?',
    options: ['NVME только для HDD', 'NVME медленнее SATA', 'NVME значительно быстрее SATA', 'Разницы нет'],
    correct: 2,
  },
  {
    question: 'Зачем нужна термопаста?',
    options: ['Для охлаждения блока питания', 'Для улучшения контакта CPU с кулером', 'Для смазки вентиляторов', 'Для изоляции контактов'],
    correct: 1,
  },
  {
    question: 'Какая характеристика НЕ влияет на производительность ПК?',
    options: ['Тактовая частота CPU', 'Скорость интернета', 'Тип видеокарты', 'Частота оперативной памяти'],
    correct: 1,
  },
  {
    question: 'Что такое PSU?',
    options: ['Программный блок управления', 'Блок охлаждения процессора', 'Система контроля температуры', 'Блок питания'],
    correct: 3,
  },
  {
    question: 'Какой разъём используется для подключения современных видеокарт?',
    options: ['SATA', 'M.2', 'PCIe x16', 'USB-C'],
    correct: 2,
  },
  {
    question: 'Что такое overclocking (разгон)?',
    options: ['Снижение температуры компонентов', 'Автоматическое обновление драйверов', 'Увеличение скорости работы компонентов', 'Оптимизация энергопотребления'],
    correct: 2,
  },
];

function renderQuiz() {
  const container = document.getElementById('quizQuestions');
  container.innerHTML = QUIZ.map((q, qi) => `
    <div class="quiz-question" data-question="${qi}">
      <div class="quiz-q-text">${qi + 1}. ${q.question}</div>
      <div class="quiz-options">
        ${q.options.map((opt, oi) => `
          <label class="quiz-option" data-option="${oi}">
            <input type="radio" name="q${qi}" value="${oi}">
            ${opt}
          </label>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function checkQuiz() {
  let correct = 0;
  const total = QUIZ.length;

  QUIZ.forEach((q, qi) => {
    const selected = document.querySelector(`input[name="q${qi}"]:checked`);
    const questionEl = document.querySelector(`[data-question="${qi}"]`);
    const options = questionEl.querySelectorAll('.quiz-option');

    options.forEach((opt, oi) => {
      opt.classList.remove('correct-answer', 'wrong-answer');
    });

    if (selected) {
      const chosen = parseInt(selected.value);
      if (chosen === q.correct) {
        correct++;
        questionEl.classList.remove('incorrect');
        questionEl.classList.add('correct');
      } else {
        questionEl.classList.remove('correct');
        questionEl.classList.add('incorrect');
        options[q.correct].classList.add('correct-answer');
        options[chosen].classList.add('wrong-answer');
      }
    } else {
      questionEl.classList.remove('correct', 'incorrect');
      options[q.correct].classList.add('correct-answer');
    }
  });

  const pct = Math.round((correct / total) * 100);
  const resultEl = document.getElementById('quizResult');
  let label, desc;

  if (pct === 100) {
    label = 'Эксперт';
    desc = 'Ты настоящий гуру ПК-тематики! Поздравляем!';
  } else if (pct >= 75) {
    label = 'Продвинутый пользователь';
    desc = 'Отличный результат! Ты хорошо разбираешься в компьютерах.';
  } else if (pct >= 50) {
    label = 'Уверенный пользователь';
    desc = 'Неплохо! Но есть куда расти. Почитай про железо — это интересно!';
  } else if (pct >= 25) {
    label = 'Начинающий';
    desc = 'База есть, но тебе стоит узнать побольше о комплектующих.';
  } else {
    label = 'Новичок';
    desc = 'Похоже, ты только начинаешь свой путь в мире ПК. Загляни в наши сборки!';
  }

  resultEl.classList.remove('hidden');
  resultEl.innerHTML = `
    <div class="quiz-result-score">${correct}/${total}</div>
    <div class="quiz-result-label">${label}</div>
    <div class="quiz-result-desc">${desc}</div>
  `;

  document.getElementById('quizSubmit').disabled = true;
}

function resetQuiz() {
  document.querySelectorAll('.quiz-question').forEach(el => {
    el.classList.remove('correct', 'incorrect');
  });
  document.querySelectorAll('.quiz-option').forEach(el => {
    el.classList.remove('correct-answer', 'wrong-answer');
  });
  document.querySelectorAll('input[type="radio"]').forEach(el => {
    el.checked = false;
  });
  document.getElementById('quizResult').classList.add('hidden');
  document.getElementById('quizSubmit').disabled = false;
}

document.addEventListener('DOMContentLoaded', () => {
  renderQuiz();

  document.getElementById('quizSubmit').addEventListener('click', checkQuiz);
  document.getElementById('quizReset').addEventListener('click', resetQuiz);
});
