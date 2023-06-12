import { FooterLinksRow } from 'libs/types'

export const FOOTER_LINKS: FooterLinksRow[] = [
  {
    type: 'Resources',
    links: [
      {
        name: 'Explorer',
        url: '/explorer',
        external: false,
      },
      {
        name: 'Tutorials',
        url: 'https://docs.nouns.stream/tutorials/overview',
        external: true,
      },
      {
        name: 'Audit',
        url: 'https://github.com/daokitchen/nouns-stream/tree/main/audit/',
        external: true,
      },
    ],
  },
  {
    type: 'Developers',
    links: [
      {
        name: 'Documentation',
        url: 'https://docs.nouns.stream/',
        external: true,
      },
      {
        name: 'Github',
        url: 'https://github.com/daokitchen/nouns-stream',
        external: true,
      },
      {
        name: 'Changelog',
        url: 'https://github.com/daokitchen/nouns-stream/blob/main/CHANGELOG.md',
        external: true,
      },
      {
        name: 'Natspec',
        url: 'https://docs.nouns.stream/smart-contracts',
        external: true,
      },
    ],
  },
  {
    type: 'Community',
    links: [
      {
        name: 'Telegram',
        url: 'https://t.me/+JYIEgLcT9kliYWEx',
        external: true,
      },
      {
        name: 'Twitter',
        url: 'https://twitter.com/nouns_stream',
        external: true,
      },
      {
        name: 'Bugs & issues',
        url: 'https://github.com/daokitchen/nouns-stream/issues/new',
        external: true,
      },
      {
        name: 'Request a feature',
        url: 'mailto:devs@nouns.stream',
        external: true,
      },
    ],
  },
]
