const COLORS = {
  nfs: '#00d4aa',
  mk: '#7c5cfc',
};

document.addEventListener('DOMContentLoaded', () => {
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

  new Chart(document.getElementById('gamesChart'), {
    type: 'bar',
    data: {
      labels: ['Cyberpunk 2077', 'Fortnite', 'CS2', 'Baldur\'s Gate 3', 'Apex Legends'],
      datasets: [
        {
          label: 'Not-For-Study (RTX 4050)',
          data: [55, 75, 120, 50, 90],
          backgroundColor: COLORS.nfs,
          borderRadius: 4,
        },
        {
          label: 'Mighty Knight (RTX 4070)',
          data: [90, 130, 200, 85, 165],
          backgroundColor: COLORS.mk,
          borderRadius: 4,
        },
      ],
    },
    options: {
      ...cfg,
      plugins: {
        ...cfg.plugins,
        tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: ${ctx.raw} FPS` } },
      },
    },
  });

  new Chart(document.getElementById('workChart'), {
    type: 'bar',
    data: {
      labels: ['Cinebench R23\n(многоядерный)', 'Blender\nClassroom (мин)', 'Geekbench 6\nSingle', 'Geekbench 6\nMulti'],
      datasets: [
        {
          label: 'Not-For-Study',
          data: [8200, 18, 2100, 8200],
          backgroundColor: COLORS.nfs,
          borderRadius: 4,
        },
        {
          label: 'Mighty Knight',
          data: [15200, 9, 2400, 11500],
          backgroundColor: COLORS.mk,
          borderRadius: 4,
        },
      ],
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
