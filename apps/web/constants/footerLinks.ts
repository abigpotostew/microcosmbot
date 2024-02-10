import { FooterLinksRow } from 'libs/types'

export const FOOTER_LINKS: FooterLinksRow[] = [
  {
    type: 'Resources',
    links: [
      {
        name: 'Official Bot',
        url: 'https://t.me/microcosmbotdotxyz_bot',
        external: false,
      },
      {
        name: 'Start a Group',
        url: 'https://t.me/microcosmbotdotxyz_bot?startgroup=true',
        external: false,
      },

      {
        name: 'Documentation',
        url: 'https://microcosmbotxyz.notion.site/Microcosmbot-xyz-Documentation-3fd13d93ad714e3682216e7a79d535c3',
        external: true,
      },

      // {
      //   name: 'Tutorials',
      //   url: 'https://docs.nouns.stream/tutorials/overview',
      //   external: true,
      // },
      // {
      //   name: 'Audit',
      //   url: 'https://github.com/daokitchen/nouns-stream/tree/main/audit/',
      //   external: true,
      // },
    ],
  },
  {
    type: 'Developers',
    links: [
      // {
      //   name: 'Documentation',
      //   url: 'https://docs.nouns.stream/',
      //   external: true,
      // },
      {
        name: 'Github',
        url: 'https://github.com/abigpotostew/microcosmbot',
        external: true,
      },
      {
        name: 'Changelog',
        url: 'https://github.com/abigpotostew/microcosmbot/blob/main/CHANGELOG.md',
        external: true,
      },
      // {
      //   name: 'Natspec',
      //   url: 'https://docs.nouns.stream/smart-contracts',
      //   external: true,
      // },
    ],
  },
  {
    type: 'Community',
    links: [
      // {
      //   name: 'Telegram',
      //   url: 'https://t.me/microcosmbotdotxyz_bot',
      //   external: true,
      // },
      {
        name: 'Twitter',
        url: 'https://twitter.com/stewbracken',
        external: true,
      },
      {
        name: 'Bugs & issues',
        url: 'https://github.com/abigpotostew/microcosmbot/issues/new',
        external: true,
      },
      {
        name: 'Request a feature',
        url: 'https://github.com/abigpotostew/microcosmbot/issues/new',
        external: true,
      },
    ],
  },
]
