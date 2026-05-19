const heroStage = document.querySelector<HTMLElement>('[data-hero-stage]');

if (heroStage && window.matchMedia('(pointer: fine)').matches) {
  const layers = Array.from(heroStage.querySelectorAll<HTMLElement>('[data-parallax]'));

  const resetLayers = () => {
    layers.forEach((layer) => {
      layer.style.transform = 'translate3d(0, 0, 0)';
    });
  };

  heroStage.addEventListener('pointermove', (event: PointerEvent) => {
    const rect = heroStage.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    layers.forEach((layer) => {
      const depth = Number(layer.dataset.parallax ?? '0');
      layer.style.transform = `translate3d(${x * depth}px, ${y * depth}px, 0)`;
    });
  });

  heroStage.addEventListener('pointerleave', resetLayers);
}

const stageRoot = document.querySelector<HTMLElement>('[data-story-visual]');
const chapterCards = Array.from(document.querySelectorAll<HTMLElement>('[data-stage-card]'));

if (stageRoot && chapterCards.length > 0) {
  const setStage = (id: string) => {
    stageRoot.dataset.activeStage = id;
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((entryA, entryB) => entryB.intersectionRatio - entryA.intersectionRatio)[0];

      if (visible?.target instanceof HTMLElement) {
        setStage(visible.target.dataset.stageCard ?? '01');
      }
    },
    {
      threshold: [0.35, 0.5, 0.75],
      rootMargin: '-20% 0px -28% 0px',
    }
  );

  chapterCards.forEach((card) => {
    observer.observe(card);
    card.addEventListener('mouseenter', () => {
      setStage(card.dataset.stageCard ?? '01');
    });
  });
}
