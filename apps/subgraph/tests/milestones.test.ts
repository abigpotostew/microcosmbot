import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { MilestonesFundsDisbursed } from "../generated/schema"
import { MilestonesFundsDisbursed as MilestonesFundsDisbursedEvent } from "../generated/Milestones/Milestones"
import { handleMilestonesFundsDisbursed } from "../src/milestones"
import { createMilestonesFundsDisbursedEvent } from "./milestones-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let streamId = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let amount = BigInt.fromI32(234)
    let streamType = "Example string value"
    let newMilestonesFundsDisbursedEvent = createMilestonesFundsDisbursedEvent(
      streamId,
      amount,
      streamType
    )
    handleMilestonesFundsDisbursed(newMilestonesFundsDisbursedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("MilestonesFundsDisbursed created and stored", () => {
    assert.entityCount("MilestonesFundsDisbursed", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "MilestonesFundsDisbursed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "streamId",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "MilestonesFundsDisbursed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "amount",
      "234"
    )
    assert.fieldEquals(
      "MilestonesFundsDisbursed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "streamType",
      "Example string value"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
