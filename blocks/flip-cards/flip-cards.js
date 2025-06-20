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

    const picture = cells[0]?.querySelector('picture');
    const frontText = cells[1]?.innerHTML.trim();

    if (picture) {
      const optimized = createOptimizedPicture(
        picture.querySelector('img')?.src || '',
        picture.querySelector('img')?.alt || '',
        false,
        [{ width: '750' }]
      );
      front.append(optimized);
    }

    if (frontText) {
      const p = document.createElement('p');
      p.innerHTML = frontText;
      front.append(p);
    }

    // ✅ Back of card
    const back = document.createElement('div');
    back.className = 'flip-card-back';
    const backText = cells[2]?.innerHTML.trim();
    if (backText) {
      back.innerHTML = backText;
    }

    cardInner.append(front);
    cardInner.append(back);
    card.append(cardInner);
    wrapper.append(card);
  });

  block.textContent = '';
  block.append(wrapper);
}