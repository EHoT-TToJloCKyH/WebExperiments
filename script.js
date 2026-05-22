document.addEventListener('DOMContentLoaded', () => {
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
});
