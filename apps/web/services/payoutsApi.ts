import { gql } from 'graphql-request'
import { IPayoutItem } from 'libs/types'
import { graphQLClient } from './api'

// $filter: String!
// where: {
//   address_contains: $filter
//   controller_contains: $filter
//   recipient_contains: $filter
//   type_contains: $filter
// }

export const streamsQuery = gql`
  query streams($first: Int, $skip: Int) {
    streams(
      skip: $skip
      first: $first
      subgraphError: deny
    ) {
      id
      address
      data
      type
      recipient
      controller
      nextPayment
      balance
      paused
      blockNumber
      blockTimestamp
      transactionHash
      token
    }
  }
`

export const streamsSearchQuery = gql`
  query streamSearch($text: String) {
    streamSearch(
      text: $text
      orderDirection: desc
      orderBy: blockTimestamp
    ) {
      id
      address
      type
      recipient
      controller
      nextPayment
      balance
      paused
      blockNumber
      blockTimestamp
      transactionHash
      data
      token
    }
  }
`

export const getStreamsQueryWithParams = (first: number, skip: number, where: string) => gql`
  query streams($first: Int = ${first}, $skip: Int = ${skip}, $where: Stream_filter = ${where}) {
    streams(
      skip: $skip
      first: $first
      subgraphError: deny
      orderDirection: desc
      orderBy: blockTimestamp
      where: $where
    ) {
      id
      address
      data
      type
      recipient
      controller
      nextPayment
      balance
      paused
      blockNumber
      blockTimestamp
      transactionHash
      token
    }
  }
`

export const streamQuery = gql`
  query streams($id: String) {
    stream(id: $id, subgraphError: deny) {
      id
      address
      data
      type
      recipient
      controller
      nextPayment
      balance
      paused
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`

export const getStreamQueryWithParams = (id: string) => gql`
  query streams($id: String = "${id}") {
    stream(id: $id, subgraphError: deny) {
      id
      address
      data
      type
      recipient
      controller
      nextPayment
      balance
      paused
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`

  // activities(where: { address: "0xd642906d934802c6432ad1d45156374283689673" }) {
export const activities = (address: string) => gql`
  query activities($address: String = "${address}"){
    activities(
      orderDirection: asc
      orderBy: blockTimestamp
      where: { address: $address}
    ) {
      address
      type
      message
      event
      blockNumber
      transactionHash
      blockTimestamp
    }
  }
`

export const getPayouts = async (first?: number, skip?: number): Promise<Record<'streams', IPayoutItem[]> | undefined> => {
  try {
    const result = await graphQLClient.request(streamsQuery, { first: first ?? null, skip: skip ?? null }) as Record<'streams', IPayoutItem[]>

    return result
  } catch (error) {
    console.error("Cannot get payouts", error)
  }
}

export const getStream = async (id: string): Promise<Record<'stream', IPayoutItem> | undefined> => {
  try {
    const result = await graphQLClient.request(streamQuery, { id }) as Record<'stream', IPayoutItem>

    return result
  } catch (error) {
    console.error("Cannot get stream", error)
  }
}

export const searchStream = async (text: string): Promise<any> => {
  try {
    const result = await graphQLClient.request(streamsSearchQuery, { text })

    return result
  } catch (error) {
    console.error("Cannot get stream", error)
  }
}

export const searchStreams = async (first: number, skip: number, where: string = ''): Promise<any> => {
  try {
    const query = getStreamsQueryWithParams(first, skip, where)
    const result = await graphQLClient.request(query)

    return result
  } catch (error) {
    console.error("Cannot get stream", error)
  }
}