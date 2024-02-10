import { WTFList } from 'libs/types'
import { botInfo } from '@microcosms/bot/botinfo'

export const wtfList: WTFList[] = [
  {
    title: 'How does this work?',
    text: (
      <>
        <p>
          {`@${botInfo.username} can manage members of your group after you invite it to your private group. Members must verify their wallet through `}
          <a
            href={'https://www.microcosmbot.xyz'}
            className="text-blue-500 underline"
          >
            microcosmbot.xyz
          </a>
          {` in order to a join a group.`}
        </p>
        <br />
        <p>
          To learn more, read our{' '}
          <a
            className="text-blue-500 underline"
            href={
              'https://microcosmbotxyz.notion.site/Microcosmbot-xyz-Documentation-3fd13d93ad714e3682216e7a79d535c3'
            }
            target="_blank"
            rel="noreferrer"
          >
            Documentation
          </a>
        </p>
      </>
    ),
  },
  {
    title: 'How do I setup a token gated telegram chat?',
    text: (
      <>
        <p>{`First create a private telegram group and configure "Chat history for new members" to visible. Now invite @${botInfo.username} to your group as an admin by following this link https://t.me/microcosmbotdotxyz_bot?startgroup=true`}</p>
        <br />
        <p>
          <p>
            To learn more, read our{' '}
            <a
              className="text-blue-500 underline"
              href={
                'https://microcosmbotxyz.notion.site/Microcosmbot-xyz-Documentation-3fd13d93ad714e3682216e7a79d535c3'
              }
              target="_blank"
              rel="noreferrer"
            >
              Documentation
            </a>
          </p>
        </p>
      </>
    ),
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
    text: (
      <>
        <p>
          {`skymagic, a genesis stargaze artist and creator of `}
          <a
            href={'https://publicworks.art'}
            className="text-blue-500 underline"
          >
            publicworks.art
          </a>
          {`. MicroCosmBot is endorsed by stargaze.zone and was built as part of a stargaze.zone dev bounty.`}
        </p>
      </>
    ),
  },
]
