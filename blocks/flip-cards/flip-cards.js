import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const section = block.closest('.section');

  // ✅ Apply section-level animation if defined via metadata
  const animationMeta = section?.dataset?.animation;
  if (animationMeta) {
    section.setAttribute('data-aos', animationMeta);
  }

  const wrapper = document.createElement('div');
  wrapper.className = 'flip-cards-wrapper';

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const card = document.createElement('div');
    card.className = 'flip-card';

    const cardInner = document.createElement('div');
    cardInner.className = 'flip-card-inner';

    // ✅ Front of card
    const front = document.createElement('div');
    front.className = 'flip-card-front';

    const frontContent = document.createElement('div');
    frontContent.className = 'flip-card-front-content';

    const picture = cells[0]?.querySelector('picture');
    const frontText = cells[1]?.innerHTML.trim();

    if (picture) {
      const optimized = createOptimizedPicture(
        picture.querySelector('img')?.src || '',
        picture.querySelector('img')?.alt || '',
        false,
        [{ width: '750' }]
      );
      frontContent.append(optimized);
    }

    if (frontText) {
      frontContent.innerHTML = frontText;
    }

    // ✅ Back of card
    const back = document.createElement('div');
    back.className = 'flip-card-back';

    const backContent = document.createElement('div');
    backContent.className = 'flip-card-back-content';

    const backText = cells[2]?.innerHTML.trim();
    if (backText) {
      backContent.innerHTML = backText;
    }

    cardInner.append(front);
    front.append(frontContent);
    cardInner.append(back);
    back.append(backContent);
    card.append(cardInner);
    wrapper.append(card);
  });

  block.textContent = '';
  block.append(wrapper);
}