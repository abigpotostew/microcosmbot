import DocsIcon from 'public/icons/docs-icon.svg'
import GithubIcon from 'public/icons/github-icon.svg'
import ChangelogIcon from 'public/icons/changelog-icon.svg'
import ExplorerIcon from 'public/icons/explorer-icon.svg'

export const NAV_LINKS = [
  {
    name: 'Explorer',
    url: '/explorer',
    icon: <ExplorerIcon className="w-5" />,
  },
  {
    name: 'Documentation',
    url: 'https://docs.nouns.stream/',
    icon: <DocsIcon className="w-5" />,
  },
  {
    name: 'SDK',
    url: 'https://docs.nouns.stream/sdk',
    icon: <ChangelogIcon className="w-5" />,
  },
  {
    name: 'Github',
    url: 'https://github.com/daokitchen/nouns-stream',
    icon: <GithubIcon className="w-5" />,
  },
]
