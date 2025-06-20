import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  // Create modal structure
  const modal = document.createElement('div');
  modal.className = 'popup-modal';
  modal.innerHTML = `
    <div class="popup-overlay"></div>
    <div class="popup-content">
      <span class="popup-close">&times;</span>
      <img src="" alt="Popup Image" class="popup-img">
    </div>
  `;
  document.body.appendChild(modal);

  const modalImg = modal.querySelector('.popup-img');
  const closeBtn = modal.querySelector('.popup-close');
  const overlay = modal.querySelector('.popup-overlay');

  // Activate image click
  [...block.querySelectorAll('img')].forEach((img) => {
    img.style.cursor = 'pointer';
    const fullSrc = img.getAttribute('data-full') || img.src;

    img.addEventListener('click', () => {
      modalImg.src = fullSrc;
      modal.classList.add('visible');
    });
  });

  // Close modal
  [closeBtn, overlay].forEach((el) => {
    el.addEventListener('click', () => {
      modal.classList.remove('visible');
    });
  });
}
