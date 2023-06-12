// SPDX-License-Identifier: GPL-3.0-or-later

import { PAGE_SIZE, payoutsFields } from 'constants/index'
import { useRouter } from 'next/router'
import { IPayoutItem } from 'libs/types/payout'
import { useCallback, useEffect, useRef, useState } from 'react'
import PayoutItem from 'components/PayoutItem'
import { getStreamsQueryWithParams, searchStream } from 'services/payoutsApi'
import useSWR from 'swr'
import { fetcher } from 'services/api'
import { PrimaryButton, Loader, Input } from '@nouns-stream/ui'
import SearchIcon from 'public/icons/explorer-icon.svg'

const PayoutSection: React.FC = () => {
  const router = useRouter()
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [searchField, setSearchField] = useState('')
  const [skip, setSkip] = useState(0)
  const [showSearchPayouts, setShowSearchPayouts] = useState(false)
  const [loadedPayouts, setLoadedPayouts] = useState<IPayoutItem[]>([])
  const [filteredPayouts, setFilteredPayouts] = useState<IPayoutItem[]>([])

  const searchString = searchField
    ? `
    {
      or:
      [
        { address: "${searchField}", recipient: "${searchField}", controller: "${searchField}" }
      ]
    }`
    : '{}'

  const { data, error, isLoading, isValidating, mutate } = useSWR(
    getStreamsQueryWithParams(PAGE_SIZE, skip, searchString),
    fetcher,
    {
      initialData: [],
      revalidateOnMount: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  const streamsLoadedData = data as unknown as
    | Record<'streams', IPayoutItem[]>
    | undefined
  const hasMoreItems =
    streamsLoadedData === undefined ||
    (streamsLoadedData && streamsLoadedData?.streams.length >= PAGE_SIZE)

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      searchInputRef.current?.focus()
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress)

    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [handleKeyPress])

  useEffect(() => {
    if (!streamsLoadedData) {
      return
    }

    setLoadedPayouts([...loadedPayouts, ...streamsLoadedData.streams] || [])
  }, [streamsLoadedData]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearchInputChange = async (
    ev: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (ev.currentTarget?.value && ev.currentTarget?.value.length > 0) {
      setShowSearchPayouts(true)
      const streams = (await searchStream(
        ev.currentTarget.value || ''
      )) as Record<'streamSearch', IPayoutItem[]>
      if (streams) {
        setFilteredPayouts(streams.streamSearch || [])
      }
    } else {
      setFilteredPayouts([])
      setShowSearchPayouts(false)
    }

    setSearchField(ev.currentTarget?.value)
  }

  const handlePayoutItemClick = (payout: IPayoutItem) => {
    const url = `/explorer/${payout.address}`
    router.push(url)
  }

  return (
    <section className="relative pb-20">
      <div className="container flex flex-col items-start px-6 pt-12 gap-6 lg:gap-7">
        <Input
          ref={searchInputRef}
          name="search"
          placeholder="Cmd + K"
          onChange={handleSearchInputChange}
          classes="w-full lg:w-95"
          endAdornment={
            <SearchIcon className="w-5 h-5 absolute top-3 right-4" />
          }
        />
        <div className="border-gray-900 flex flex-col w-full gap-4 mb-8 rounded-lx lg:mb-0 lg:py-6 lg:border relative min-h-[650px]">
          <div className="hidden lg:grid grid-cols-6 mx-6 pb-5 border-b border-gray-200">
            {payoutsFields.map((f: string) => (
              <h5 key={`key-${f}`} className="col-span-1">
                {f}
              </h5>
            ))}
          </div>
          {isLoading ? (
            <Loader />
          ) : null}
          <div className="flex flex-col lg:gap-4">
            {!showSearchPayouts
              ? loadedPayouts.map((payout, i) => (
                  <PayoutItem
                    key={`key-${i}`}
                    onClick={() => handlePayoutItemClick(payout)}
                    {...payout}
                  />
                ))
              : filteredPayouts.map((payout, i) => (
                  <PayoutItem
                    key={`key-${i}`}
                    onClick={() => handlePayoutItemClick(payout)}
                    {...payout}
                  />
                ))}
          </div>
        </div>
        {hasMoreItems ? (
          <PrimaryButton
            classes="w-50 mx-auto"
            disabled={isValidating}
            loading={isLoading}
            onClick={() => setSkip(skip + PAGE_SIZE)}
          >
            Load more
          </PrimaryButton>
        ) : null}
      </div>
    </section>
  )
}

export default PayoutSection
