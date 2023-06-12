import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  MilestonesFundsDisbursed,
  MilestonesInitialized,
  MilestonesOwnerCanceled,
  MilestonesOwnerPending,
  MilestonesOwnerUpdated,
  MilestonesPaused,
  MilestonesStreamCreated,
  MilestonesStreamPaused,
  MilestonesUnpaused
} from "../generated/Milestones/Milestones"

export function createMilestonesFundsDisbursedEvent(
  streamId: Address,
  amount: BigInt,
  streamType: string
): MilestonesFundsDisbursed {
  let milestonesFundsDisbursedEvent = changetype<MilestonesFundsDisbursed>(
    newMockEvent()
  )

  milestonesFundsDisbursedEvent.parameters = new Array()

  milestonesFundsDisbursedEvent.parameters.push(
    new ethereum.EventParam("streamId", ethereum.Value.fromAddress(streamId))
  )
  milestonesFundsDisbursedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  milestonesFundsDisbursedEvent.parameters.push(
    new ethereum.EventParam("streamType", ethereum.Value.fromString(streamType))
  )

  return milestonesFundsDisbursedEvent
}

export function createMilestonesInitializedEvent(
  version: BigInt
): MilestonesInitialized {
  let milestonesInitializedEvent = changetype<MilestonesInitialized>(
    newMockEvent()
  )

  milestonesInitializedEvent.parameters = new Array()

  milestonesInitializedEvent.parameters.push(
    new ethereum.EventParam(
      "version",
      ethereum.Value.fromUnsignedBigInt(version)
    )
  )

  return milestonesInitializedEvent
}

export function createMilestonesOwnerCanceledEvent(
  owner: Address,
  canceledOwner: Address
): MilestonesOwnerCanceled {
  let milestonesOwnerCanceledEvent = changetype<MilestonesOwnerCanceled>(
    newMockEvent()
  )

  milestonesOwnerCanceledEvent.parameters = new Array()

  milestonesOwnerCanceledEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  milestonesOwnerCanceledEvent.parameters.push(
    new ethereum.EventParam(
      "canceledOwner",
      ethereum.Value.fromAddress(canceledOwner)
    )
  )

  return milestonesOwnerCanceledEvent
}

export function createMilestonesOwnerPendingEvent(
  owner: Address,
  pendingOwner: Address
): MilestonesOwnerPending {
  let milestonesOwnerPendingEvent = changetype<MilestonesOwnerPending>(
    newMockEvent()
  )

  milestonesOwnerPendingEvent.parameters = new Array()

  milestonesOwnerPendingEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  milestonesOwnerPendingEvent.parameters.push(
    new ethereum.EventParam(
      "pendingOwner",
      ethereum.Value.fromAddress(pendingOwner)
    )
  )

  return milestonesOwnerPendingEvent
}

export function createMilestonesOwnerUpdatedEvent(
  prevOwner: Address,
  newOwner: Address
): MilestonesOwnerUpdated {
  let milestonesOwnerUpdatedEvent = changetype<MilestonesOwnerUpdated>(
    newMockEvent()
  )

  milestonesOwnerUpdatedEvent.parameters = new Array()

  milestonesOwnerUpdatedEvent.parameters.push(
    new ethereum.EventParam("prevOwner", ethereum.Value.fromAddress(prevOwner))
  )
  milestonesOwnerUpdatedEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return milestonesOwnerUpdatedEvent
}

export function createMilestonesPausedEvent(user: Address): MilestonesPaused {
  let milestonesPausedEvent = changetype<MilestonesPaused>(newMockEvent())

  milestonesPausedEvent.parameters = new Array()

  milestonesPausedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )

  return milestonesPausedEvent
}

export function createMilestonesStreamCreatedEvent(
  streamId: Address,
  streamType: string
): MilestonesStreamCreated {
  let milestonesStreamCreatedEvent = changetype<MilestonesStreamCreated>(
    newMockEvent()
  )

  milestonesStreamCreatedEvent.parameters = new Array()

  milestonesStreamCreatedEvent.parameters.push(
    new ethereum.EventParam("streamId", ethereum.Value.fromAddress(streamId))
  )
  milestonesStreamCreatedEvent.parameters.push(
    new ethereum.EventParam("streamType", ethereum.Value.fromString(streamType))
  )

  return milestonesStreamCreatedEvent
}

export function createMilestonesStreamPausedEvent(
  streamId: Address,
  paused: boolean
): MilestonesStreamPaused {
  let milestonesStreamPausedEvent = changetype<MilestonesStreamPaused>(
    newMockEvent()
  )

  milestonesStreamPausedEvent.parameters = new Array()

  milestonesStreamPausedEvent.parameters.push(
    new ethereum.EventParam("streamId", ethereum.Value.fromAddress(streamId))
  )
  milestonesStreamPausedEvent.parameters.push(
    new ethereum.EventParam("paused", ethereum.Value.fromBoolean(paused))
  )

  return milestonesStreamPausedEvent
}

export function createMilestonesUnpausedEvent(
  user: Address
): MilestonesUnpaused {
  let milestonesUnpausedEvent = changetype<MilestonesUnpaused>(newMockEvent())

  milestonesUnpausedEvent.parameters = new Array()

  milestonesUnpausedEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )

  return milestonesUnpausedEvent
}
