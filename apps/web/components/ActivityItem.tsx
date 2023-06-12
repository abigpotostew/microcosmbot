import { formatDistanceToNow } from "date-fns"
import { ActivitiesShape, IActivity } from "libs/types"
import { Icon } from "./Icon"
import { Token } from "state/TokenList"
import { ethers } from "ethers"
import { useEffect, useState } from "react"

interface ActivityItemProps {
  activity: IActivity
  isRecipient: boolean
  isController: boolean
  token: Partial<Token>
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity, isController, isRecipient, token }) => {
  const { event, blockTimestamp } = activity
  const [amount, setAmount] = useState('1 ETH')

  const regex = /amount:\s(\d+)/
  const match = activity.message.match(regex)

  useEffect(() => {
    if (match) {
      const v = match[1]
      const str = `${ethers.utils.formatUnits(v.toString(), token.decimals || 18)} ${token.symbol}`
      setAmount(str)
    }
  }, [match, token])

  const activitiesShape: ActivitiesShape = {
    StreamCreated: {
      icon: 'star',
      text: 'Stream created',
    },
    FundsDisbursed: {
      icon: 'minus',
      text: `Distributed ${amount}`,
    },
    ControllerUpdated: {
      icon: 'star',
      text: 'Controller updated',
    },
    StreamPaused: {
      icon: 'pause',
      text: `Stream paused by ${isController ? 'controller' : 'recipient'}`,
    },
    StreamUnpaused: {
      icon: 'resume',
      text: `Stream unpaused by ${isController ? 'controller' : 'recipient'}`,
    },
    Withdrawal: {
      icon: 'withdraw',
      text: 'Funds withdrawal',
    },
  }

  return (
    <div className="flex items-center gap-2">
      <Icon icon={activitiesShape[event].icon} classes="w-5 h-5 shrink-0 fill-gray-900" color="inherit" />
      <h6 className="text-title5">{activitiesShape[event].text}</h6>
      {blockTimestamp ? <span className="text-body3">{formatDistanceToNow(new Date(+blockTimestamp * 1000))} ago</span> : null}
    </div>
  )
}

export default ActivityItem