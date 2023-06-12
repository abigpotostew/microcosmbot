import { BigInt } from '@graphprotocol/graph-ts'
import { Intervals__getCurrentIntervalResult } from '../generated/templates/Intervals/Intervals'
import {
  Milestones,
  Milestones__getCurrentMilestoneResult,
} from '../generated/templates/Milestones/Milestones'

export function getPhasesDynamicData(
  contract: Milestones,
  milMap: Milestones__getCurrentMilestoneResult
): string {
  const lenVals = contract.getMilestoneLength()
  let msDates: string = '['
  let msPayments: string = '['
  let val = BigInt.fromI32(0)

  while (lenVals.value0.gt(val)) {
    const miles = contract.getMilestone(val)
    msDates += miles.value1.toString()
    msPayments += miles.value0.toString()

    val = val.plus(BigInt.fromI32(1))

    if (lenVals.value0.gt(val)) {
      msDates += ','
      msPayments += ','
    }
  }
  msDates += ']'
  msPayments += ']'

  return `{"msDates":${msDates},"msPayments":${msPayments},"tip":"${milMap.value3.toString()}","currentMilestone":"${milMap.value0.toString()}"}`
}
export function getPeriodicDynamicData(
  intMap: Intervals__getCurrentIntervalResult
): string {
  return `{"startDate":"${intMap.value0.toString()}","endDate":"${intMap.value1.toString()}","interval":"${intMap.value2.toString()}","tip":"${intMap.value3.toString()}","owed":"${
    intMap.value4
  }","paid":"${intMap.value5.toString()}"}`
}
