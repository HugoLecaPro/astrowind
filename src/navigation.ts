import { getPermalink } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Prelude',
      href: getPermalink('/#top'),
    },
    {
      text: 'Story',
      href: getPermalink('/#story'),
    },
    {
      text: 'Atmosphere',
      href: getPermalink('/#atmosphere'),
    },
    {
      text: 'Finale',
      href: getPermalink('/#finale'),
    },
  ],
  actions: [{ text: 'Enter The Scroll', href: getPermalink('/#story') }],
};

export const footerData = {
  links: [
    {
      title: 'Project',
      links: [
        { text: 'Prelude', href: getPermalink('/#top') },
        { text: 'Story', href: getPermalink('/#story') },
        { text: 'Atmosphere', href: getPermalink('/#atmosphere') },
      ],
    },
    {
      title: 'Pages',
      links: [
        { text: 'Finale', href: getPermalink('/#finale') },
        { text: 'Terms', href: getPermalink('/terms') },
        { text: 'Privacy', href: getPermalink('/privacy') },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Terms', href: getPermalink('/terms') },
    { text: 'Privacy Policy', href: getPermalink('/privacy') },
  ],
  socialLinks: [],
  footNote: `
    Narrative prototype shell for Clinician Vision.
  `,
};
