/*
 * Accordion Block
 * Recreate an accordion
 * https://www.hlx.live/developer/block-collection/accordion
 */
import { createOptimizedPicture } from '../../scripts/aem.js';
export default function decorate(block) {
  [...block.children].forEach((row) => {
    const label = row.children[0];
    const summary = document.createElement('summary');
    summary.className = 'accordion-item-label';
    summary.append(...label.childNodes);

    const body = row.children[1];
    body.className = 'accordion-item-body';

    const details = document.createElement('details');
    details.className = 'accordion-item';

    details.append(summary, body);
    row.replaceWith(details);

    // Animation handlers
    let animation = null;

    summary.addEventListener('click', async (e) => {
      e.preventDefault();

      if (details.hasAttribute('open')) {
        // Collapse
        animation?.cancel();
        const startHeight = details.offsetHeight;
        details.style.height = `${startHeight}px`;

        await requestAnimationFrame(() => {
          details.removeAttribute('open');
          const endHeight = details.offsetHeight;
          details.style.height = `${startHeight}px`;

          requestAnimationFrame(() => {
            details.style.height = `${endHeight}px`;
          });
        });

        animation = details.animate([
          { height: `${startHeight}px` },
          { height: `${summary.offsetHeight}px` }
        ], {
          duration: 500,
          easing: 'ease'
        });

        animation.onfinish = () => {
          details.style.height = '';
          animation = null;
        };
      } else {
        // Expand
        details.setAttribute('open', 'true');
        const startHeight = summary.offsetHeight;
        const endHeight = summary.offsetHeight + body.scrollHeight;
        details.style.height = `${startHeight}px`;

        requestAnimationFrame(() => {
          details.style.height = `${endHeight}px`;

          animation = details.animate([
            { height: `${startHeight}px` },
            { height: `${endHeight}px` }
          ], {
            duration: 1000,
            easing: 'ease'
          });

          animation.onfinish = () => {
            details.style.height = '';
            animation = null;
          };
        });
      }
    });
  });
}