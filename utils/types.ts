import { RouterOutputs } from 'utils/trpc'

export type GetGroup = RouterOutputs['manageGroup']['getGroup']
export type GetRuleOutput = RouterOutputs['manageGroup']['getRule']
export type GetOtpOutput = RouterOutputs['verify']['getOtp']
