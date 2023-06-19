import { WTFList } from 'libs/types'
import Link from 'next/link'
import { botInfo } from '@microcosms/bot/botinfo'

const auditUrl = 'https://github.com/daokitchen/nouns-stream/tree/main/audit'

export const wtfList: WTFList[] = [
  {
    title: 'How does this work?',
    text: `@${botInfo.username} can manage members of your group after you invite it to your private group. Members must verify their wallet through https://www.microcosmbot.xyz in order to a join a group.`,
  },
  {
    title: 'How do I setup a token gated telegram chat?',
    text: `First create a private telegram group and configure "Chat history for new members" to visible. Now invite @${botInfo.username} to your group as an admin. You can use this link https://t.me/microcosmbotdotxyz_bot?startgroup=true`,
  },
  {
    title: 'Who has built MicroCosmBot?',
    text: `skymagic, a genesis stargaze artist and creator of https://publicworks.art.`,
  },
]
