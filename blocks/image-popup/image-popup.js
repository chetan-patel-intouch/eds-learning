import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const container = document.createElement('div');
  container.className = 'image-popup-gallery';

  [...block.children].forEach((row) => {
    const cell = row.children[0];
    const picture = cell.querySelector('picture');
    const caption = cell.textContent?.trim();

    if (picture) {
      const img = picture.querySelector('img');
      const optimized = createOptimizedPicture(img.src, img.alt || '', false, [{ width: '800' }]);

      const wrapper = document.createElement('div');
      wrapper.className = 'popup-image-item';
      wrapper.append(optimized);
      container.append(wrapper);

      // Open modal on click
      wrapper.addEventListener('click', () => openModal(img.src, caption || img.alt || ''));
    }
  });

  block.textContent = '';
  block.append(container);

  // ✅ Add modal to page (once)
  if (!document.querySelector('.image-popup-modal')) {
    const modal = document.createElement('div');
    modal.className = 'image-popup-modal';
    modal.innerHTML = `
      <div class="image-popup-overlay"></div>
      <div class="image-popup-content">
        <span class="image-popup-close">&times;</span>
        <img class="image-popup-img" src="" alt="">
        <p class="image-popup-caption"></p>
      </div>
    `;
    document.body.append(modal);

    modal.querySelector('.image-popup-close').addEventListener('click', closeModal);
    modal.querySelector('.image-popup-overlay').addEventListener('click', closeModal);
  }

  function openModal(src, caption) {
    const modal = document.querySelector('.image-popup-modal');
    modal.querySelector('.image-popup-img').src = src;
    modal.querySelector('.image-popup-caption').textContent = caption;
    modal.classList.add('active');
  }

  function closeModal() {
    document.querySelector('.image-popup-modal').classList.remove('active');
  }
}
