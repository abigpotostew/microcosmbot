import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  Initialized,
  OwnerCanceled,
  OwnerPending,
  OwnerUpdated,
  StreamCreated,
  UpgradeRegistered,
  UpgradeRemoved,
  Upgraded
} from "../generated/Manager/Manager"

export function createInitializedEvent(version: BigInt): Initialized {
  let initializedEvent = changetype<Initialized>(newMockEvent())

  initializedEvent.parameters = new Array()

  initializedEvent.parameters.push(
    new ethereum.EventParam(
      "version",
      ethereum.Value.fromUnsignedBigInt(version)
    )
  )

  return initializedEvent
}

export function createOwnerCanceledEvent(
  owner: Address,
  canceledOwner: Address
): OwnerCanceled {
  let ownerCanceledEvent = changetype<OwnerCanceled>(newMockEvent())

  ownerCanceledEvent.parameters = new Array()

  ownerCanceledEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  ownerCanceledEvent.parameters.push(
    new ethereum.EventParam(
      "canceledOwner",
      ethereum.Value.fromAddress(canceledOwner)
    )
  )

  return ownerCanceledEvent
}

export function createOwnerPendingEvent(
  owner: Address,
  pendingOwner: Address
): OwnerPending {
  let ownerPendingEvent = changetype<OwnerPending>(newMockEvent())

  ownerPendingEvent.parameters = new Array()

  ownerPendingEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  ownerPendingEvent.parameters.push(
    new ethereum.EventParam(
      "pendingOwner",
      ethereum.Value.fromAddress(pendingOwner)
    )
  )

  return ownerPendingEvent
}

export function createOwnerUpdatedEvent(
  prevOwner: Address,
  newOwner: Address
): OwnerUpdated {
  let ownerUpdatedEvent = changetype<OwnerUpdated>(newMockEvent())

  ownerUpdatedEvent.parameters = new Array()

  ownerUpdatedEvent.parameters.push(
    new ethereum.EventParam("prevOwner", ethereum.Value.fromAddress(prevOwner))
  )
  ownerUpdatedEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownerUpdatedEvent
}

export function createStreamCreatedEvent(
  streamId: Address,
  streamType: string
): StreamCreated {
  let streamCreatedEvent = changetype<StreamCreated>(newMockEvent())

  streamCreatedEvent.parameters = new Array()

  streamCreatedEvent.parameters.push(
    new ethereum.EventParam("streamId", ethereum.Value.fromAddress(streamId))
  )
  streamCreatedEvent.parameters.push(
    new ethereum.EventParam("streamType", ethereum.Value.fromString(streamType))
  )

  return streamCreatedEvent
}

export function createUpgradeRegisteredEvent(
  baseImpl: Address,
  upgradeImpl: Address
): UpgradeRegistered {
  let upgradeRegisteredEvent = changetype<UpgradeRegistered>(newMockEvent())

  upgradeRegisteredEvent.parameters = new Array()

  upgradeRegisteredEvent.parameters.push(
    new ethereum.EventParam("baseImpl", ethereum.Value.fromAddress(baseImpl))
  )
  upgradeRegisteredEvent.parameters.push(
    new ethereum.EventParam(
      "upgradeImpl",
      ethereum.Value.fromAddress(upgradeImpl)
    )
  )

  return upgradeRegisteredEvent
}

export function createUpgradeRemovedEvent(
  baseImpl: Address,
  upgradeImpl: Address
): UpgradeRemoved {
  let upgradeRemovedEvent = changetype<UpgradeRemoved>(newMockEvent())

  upgradeRemovedEvent.parameters = new Array()

  upgradeRemovedEvent.parameters.push(
    new ethereum.EventParam("baseImpl", ethereum.Value.fromAddress(baseImpl))
  )
  upgradeRemovedEvent.parameters.push(
    new ethereum.EventParam(
      "upgradeImpl",
      ethereum.Value.fromAddress(upgradeImpl)
    )
  )

  return upgradeRemovedEvent
}

export function createUpgradedEvent(impl: Address): Upgraded {
  let upgradedEvent = changetype<Upgraded>(newMockEvent())

  upgradedEvent.parameters = new Array()

  upgradedEvent.parameters.push(
    new ethereum.EventParam("impl", ethereum.Value.fromAddress(impl))
  )

  return upgradedEvent
}
