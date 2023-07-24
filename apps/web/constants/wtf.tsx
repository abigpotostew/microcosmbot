import { WTFList } from 'libs/types'
import { botInfo } from '@microcosms/bot/botinfo'

export const wtfList: WTFList[] = [
  {
    title: 'How does this work?',
    text: `@${botInfo.username} can manage members of your group after you invite it to your private group. Members must verify their wallet through https://www.microcosmbot.xyz in order to a join a group.`,
  },
  {
    title: 'How do I setup a token gated telegram chat?',
    text: `First create a private telegram group and configure "Chat history for new members" to visible. Now invite @${botInfo.username} to your group as an admin by following this link https://t.me/microcosmbotdotxyz_bot?startgroup=true`,
    video: (
      <div style={{ position: 'relative', paddingBottom: '62.5%', height: 0 }}>
        <iframe
          src="https://www.loom.com/embed/2d6266e5fb734be19c32d1a92b2f366e?sid=e42ba131-199a-443c-a708-fe477c99282a"
          frameBorder="0"
          allowFullScreen
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        ></iframe>
      </div>
    ),
  },
  {
    title: 'Who built MicroCosmBot?',
    text: `skymagic, a genesis stargaze artist and creator of https://publicworks.art. MicroCosmBot is endorsed by the stargaze.zone creators and was built as part of a stargaze.zone dev bounty.`,
  },
]
