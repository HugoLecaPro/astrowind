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

const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-section-id]'));
const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-nav-link]'));

if (sections.length > 0 && navLinks.length > 0) {
  const setActiveSection = (id: string) => {
    navLinks.forEach((link) => {
      link.dataset.active = String(link.dataset.navLink === id);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((entryA, entryB) => entryB.intersectionRatio - entryA.intersectionRatio)[0];

      if (visible?.target instanceof HTMLElement) {
        setActiveSection(visible.target.dataset.sectionId ?? 'top');
      }
    },
    {
      threshold: [0.2, 0.35, 0.6],
      rootMargin: '-14% 0px -50% 0px',
    }
  );

  sections.forEach((section) => observer.observe(section));
}
