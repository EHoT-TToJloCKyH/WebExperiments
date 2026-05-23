const BUILDS = [
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

const COLORS = {
  nfs: '#00d4aa',
  mk: '#7c5cfc',
};

document.addEventListener('DOMContentLoaded', () => {
  // ЧАСЫ
  const clock = document.getElementById('clock');
  function updateClock() {
    const now = new Date();
    clock.textContent = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
  updateClock();
  setInterval(updateClock, 1000);

  // подсветка активного раздела в NavBar
  const sections = document.querySelectorAll('.section');
  const navBtns = document.querySelectorAll('.nav-btn');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navBtns.forEach(btn => btn.classList.toggle('active', btn.getAttribute('href') === `#${entry.target.id}`));
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));

  // рендер карточек сборок
  renderBuilds();

  // переключение изображений
  document.querySelectorAll('.image-gallery').forEach(gallery => {
    const images = gallery.querySelectorAll('.gallery-img');
    const counter = gallery.querySelector('.img-counter');
    const prevBtn = gallery.querySelector('.prev');
    const nextBtn = gallery.querySelector('.next');

    function update(index) {
      images.forEach((img, i) => {
        img.classList.toggle('active', i === index);
      });
      counter.textContent = `${index + 1}/${images.length}`;
    }

    let current = 0;

    prevBtn.addEventListener('click', () => {
      current = (current - 1 + images.length) % images.length;
      update(current);
    });

    nextBtn.addEventListener('click', () => {
      current = (current + 1) % images.length;
      update(current);
    });
  });

  // графики CHART.JS
  const isMobile = window.innerWidth < 768;
  const baseFontSize = isMobile ? 9 : 12;
  const legendFontSize = isMobile ? 8 : 11;

  const cfg = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        labels: { color: '#ccc', font: { family: 'Inter, sans-serif', size: legendFontSize } },
      },
    },
    scales: {
      x: {
        ticks: { color: '#aaa', font: { family: 'Inter, sans-serif', size: baseFontSize } },
        grid: { color: '#222' },
      },
      y: {
        ticks: { color: '#aaa', font: { family: 'Inter, sans-serif', size: baseFontSize } },
        grid: { color: '#222' },
      },
    },
  };

  function buildDatasets(field, labelFn) {
    return BUILDS.map(b => ({
      label: labelFn(b),
      data: b[field],
      backgroundColor: COLORS[b.id],
      borderRadius: 4,
    }));
  }

  // График 1: Игры (FPS)
  new Chart(document.getElementById('gamesChart'), {
    type: 'bar',
    data: {
      labels: ['Cyberpunk 2077', 'Fortnite', 'CS2', 'Baldur\'s Gate 3', 'Apex Legends'],
      datasets: buildDatasets('fps', b => {
        const gpu = b.specs.find(s => s.label === 'GPU').value;
        return `${b.name} (${gpu})`;
      }),
    },
    options: {
      ...cfg,
      plugins: {
        ...cfg.plugins,
        tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: ${ctx.raw} FPS` } },
      },
    },
  });

  // График 2: Бенчмарки
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
        tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: ${ctx.raw}` } },
      },
    },
  });
});

function renderBuilds() {
  const grid = document.querySelector('.builds-grid');
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
