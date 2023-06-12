import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { FundsDisbursed } from "../generated/schema"
import { FundsDisbursed as FundsDisbursedEvent } from "../generated/Intervals/Intervals"
import { handleFundsDisbursed } from "../src/intervals"
import { createFundsDisbursedEvent } from "./intervals-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let streamId = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let amount = BigInt.fromI32(234)
    let streamType = "Example string value"
    let newFundsDisbursedEvent = createFundsDisbursedEvent(
      streamId,
      amount,
      streamType
    )
    handleFundsDisbursed(newFundsDisbursedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("FundsDisbursed created and stored", () => {
    assert.entityCount("FundsDisbursed", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "FundsDisbursed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "streamId",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "FundsDisbursed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "amount",
      "234"
    )
    assert.fieldEquals(
      "FundsDisbursed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "streamType",
      "Example string value"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
