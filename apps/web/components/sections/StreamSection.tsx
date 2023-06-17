// SPDX-License-Identifier: GPL-3.0-or-later

import { useRouter } from 'next/router'
import { getEtherScanLink, getFormattedDate, hideString } from 'utils/index'
import Link from 'next/link'
import {
  useContract,
  useNetwork,
  useSigner,
  useAccount,
  useContractRead,
  useToken,
} from 'wagmi'
import { Icon } from 'components/Icon'
import {
  toasterState as toasterInitState,
  ToasterStateProps,
} from 'state/Toaster'
import useSWR, { mutate as activitiesDataMutate } from 'swr'
import { modalState as modalInitState } from 'state/Modal'
import { loadingState as loadingInitState } from 'state/Loading'
import { useRecoilState } from 'recoil'
import FrameBlock from 'components/FrameBlock'
import DepositBlock from 'components/DepositBlock'
import {
  ERC20__factory,
  Milestones__factory,
  Stream__factory,
} from '@daokitchen/nouns-stream-sdk'
import { useEffect, useState } from 'react'
import { BigNumber, ethers } from 'ethers'
import { activities, getStreamQueryWithParams } from 'services/payoutsApi'
import { fetcher } from 'services/api'
import { tokenAddresses } from 'constants/tokenAddresses'
import { Token, tokenListState } from 'state/TokenList'
import { PrimaryButton, Loader, LoadingIcon } from '@nouns-stream/ui'
import { IActivity, IPayoutItem, StreamData } from 'libs/types'
import CheckIcon from 'public/icons/check-icon.svg'
import ActivityItem from 'components/ActivityItem'

const StreamSection: React.FC = () => {
  const router = useRouter()
  const [toasterState, setToasterState] = useRecoilState(toasterInitState)
  const [modalState, setModalState] = useRecoilState(modalInitState)
  const [loadingState, setLoadingState] = useRecoilState(loadingInitState)
  const [tokensList] = useRecoilState(tokenListState)
  const [token, setToken] = useState<Partial<Token>>({
    address: undefined,
    symbol: undefined,
    decimals: 0,
    logoUri: undefined,
  })
  const [tokenAddress, setTokenAddress] = useState<string>()
  const [disburseLoading, setDisburseLoading] = useState(false)
  const [curMil, setCurMil] = useState(-1)
  const [togglePausedLoading, setTogglePausedLoading] = useState(false)
  const [withdrawLoading, setWithdrawLoading] = useState(false)
  const { chain } = useNetwork()
  const network = (chain?.network || 'goerli') as keyof typeof tokensList
  const { address: addressController, isDisconnected: walletIsDisconnected } =
    useAccount()
  const { data: signer } = useSigner({
    chainId: chain?.id,
  })

  const provider = walletIsDisconnected
    ? new ethers.providers.JsonRpcProvider({
        url: process.env.NEXT_PUBLIC_RPC_URL as string,
      })
    : signer

  const { data: contractData, isLoading } = useSWR(
    getStreamQueryWithParams(router.query?.address as string),
    fetcher,
    {
      initialData: [],
      revalidateOnMount: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  const contractLoadedData = contractData as unknown as
    | Record<'stream', IPayoutItem>
    | undefined
  const stream = contractLoadedData?.stream

  const streamContract =
    stream?.type === 'phased'
      ? // eslint-disable-next-line react-hooks/rules-of-hooks
        useContract({
          address: stream?.address,
          abi: Milestones__factory.abi,
          signerOrProvider: provider,
        })
      : // eslint-disable-next-line react-hooks/rules-of-hooks
        useContract({
          address: stream?.address,
          abi: Stream__factory.abi,
          signerOrProvider: provider,
        })

  const { data: readOnlyContractToken } = useContractRead({
    address: stream?.address,
    abi: Milestones__factory.abi,
    chainId: 5,
    functionName: 'token',
  })

  const { data: readOnlyContractBalance } = useContractRead({
    address: stream?.address,
    abi: Milestones__factory.abi,
    chainId: 5,
    functionName: 'balance',
  })

  const { data: readOnlyToken } = useToken({
    chainId: 5,
    address:
      tokenAddresses.default.ETH !== readOnlyContractToken
        ? readOnlyContractToken
        : undefined,
  })

  const erc20 = useContract({
    address: tokenAddress,
    abi: ERC20__factory.abi,
    signerOrProvider: provider,
  })

  const [balance, setBalance] = useState(stream?.balance || '0.00')

  const { data: activitiesData }: any = useSWR(
    activities(router.query?.address as string),
    fetcher,
    {
      initialData: [],
      revalidateOnMount: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  const getBalance = async () => {
    try {
      const tx = await streamContract?.balance()
      return tx
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (streamContract && readOnlyContractToken) {
      if (!walletIsDisconnected) {
        ;(async () => {
          const ta = await streamContract.token()
          setTokenAddress(ta)
        })()
      } else {
        setTokenAddress(readOnlyContractToken)
      }
    }
  }, [readOnlyContractToken, streamContract, walletIsDisconnected])

  useEffect(() => {
    if (!tokenAddress || !readOnlyContractBalance) {
      return
    }

    ;(async () => {
      const res = walletIsDisconnected
        ? readOnlyContractBalance
        : await getBalance()

      const data = tokensList[network].find(
        (t) => t.address.toLowerCase() == tokenAddress.toLowerCase()
      )!
      const { logoUri, symbol } = data

      if (tokenAddress == tokenAddresses.default.ETH) {
        res && setBalance(ethers.utils.formatEther(res) + ` ${symbol}`)
        setToken({ address: tokenAddress, symbol, decimals: 18, logoUri })
        return
      }

      const tokenSymbol = walletIsDisconnected
        ? readOnlyToken?.symbol
        : await erc20?.symbol()

      const decimals = (
        walletIsDisconnected ? readOnlyToken?.decimals : await erc20?.decimals()
      ) as number

      setToken({
        address: tokenAddress,
        symbol: tokenSymbol as string,
        decimals,
        logoUri,
      })
      res && setBalance(`${res?.toNumber() / 10 ** decimals} ${tokenSymbol}`)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    network,
    tokenAddress,
    readOnlyContractBalance,
    readOnlyToken,
    walletIsDisconnected,
  ])

  const getCurrentStatus = async () => {
    const mil =
      !walletIsDisconnected && (await streamContract?.getCurrentMilestone())
    if (mil) {
      setCurMil(mil[0])
    }
  }

  useEffect(() => {
    if (
      curMil === -1 &&
      stream?.type === 'phased' &&
      !!streamContract &&
      !!stream
    ) {
      getCurrentStatus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curMil, streamContract, stream])

  if (!stream || !streamContract || isLoading || !tokenAddress) {
    return <Loader />
  }

  const { address, controller, recipient, type, paused, blockTimestamp, data } =
    stream

  const updateBalance = async () => {
    const res = walletIsDisconnected
      ? readOnlyContractBalance
      : await getBalance()

    if (tokenAddress == tokenAddresses.default.ETH) {
      res && setBalance(ethers.utils.formatEther(res) + ' ETH')
      return
    }
    const tokenSymbol = walletIsDisconnected
      ? readOnlyToken?.symbol
      : await erc20?.symbol()

    const decimals = (
      walletIsDisconnected ? readOnlyToken?.decimals : await erc20?.decimals()
    ) as number
    res && setBalance(`${res?.toNumber() / 10 ** decimals} ${tokenSymbol}`)
  }

  const deployed = getFormattedDate(+blockTimestamp * 1000)
  const chainName = chain?.name.toLowerCase()
  const preparedData: StreamData = JSON.parse(data)
  const isController =
    stream.controller.toLowerCase() === addressController?.toLowerCase()
  const isRecipient =
    stream.recipient.toLowerCase() === addressController?.toLowerCase()

  const handleTogglePaused = async () => {
    try {
      let tx
      if (paused) {
        tx = await streamContract?.unpause()
      } else {
        tx = await streamContract?.pause()
      }

      setTogglePausedLoading(true)

      await tx?.wait(1)

      activitiesDataMutate(activities(router.query?.address as string))

      setToasterState((prev: ToasterStateProps) => {
        return {
          ...prev,
          queue: [...prev.queue, `Payout ${paused ? 'paused' : 'resumed'}`],
        }
      })
    } catch (error) {
      console.error(error)
    } finally {
      setTogglePausedLoading(false)
    }
  }

  const handleClaim = async () => {
    setDisburseLoading(true)
    try {
      // const gas = await signer?.getFeeData()

      let tx
      if (isRecipient) {
        tx = await streamContract?.claim()
      } else {
        tx = await streamContract?.release()
      }

      await tx?.wait(1)

      if (stream.type === 'phased') {
        await getCurrentStatus()
      }

      await updateBalance()

      activitiesDataMutate(activities(router.query?.address as string))

      setToasterState((prev: ToasterStateProps) => {
        return {
          ...prev,
          queue: [
            ...prev.queue,
            isRecipient ? 'Stream claimed' : 'Stream released',
          ],
        }
      })
    } catch (error) {
      console.error(error)
    } finally {
      setDisburseLoading(false)
    }
  }

  const handleWithdraw = async () => {
    try {
      const gas = await signer?.getFeeData()
      const tx = await streamContract?.withdraw({
        gasPrice: gas?.gasPrice as unknown as BigNumber,
      })

      setWithdrawLoading(true)

      await tx?.wait(1)

      await updateBalance()

      activitiesDataMutate(activities(router.query?.address as string))

      setToasterState((prev: ToasterStateProps) => {
        return {
          ...prev,
          queue: [...prev.queue, 'Withdraw success'],
        }
      })
    } catch (error) {
      console.error(error)
    } finally {
      setWithdrawLoading(false)
    }
  }

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address)

    setToasterState((prev: ToasterStateProps) => {
      return {
        ...prev,
        queue: [...prev.queue, 'Address Copied'],
      }
    })
  }

  const handleQRCodeClick = () => {
    // TODO: handle qr code
  }

  const handleExternalLinkClick = () => {
    window.open(getEtherScanLink(address, chainName), '_blank')
  }

  const openDepositModal = () => {
    setModalState((prev) => {
      return {
        ...prev,
        isModalOpen: true,

        modalChildren: (
          <FrameBlock>
            <DepositBlock
              address={address}
              token={token as any}
              onSubmitCb={updateBalance}
            />
          </FrameBlock>
        ),
      }
    })
  }

  const renderPeriodic = () => {
    const periodicData = JSON.parse(stream?.data)

    const getFrequency = () => {
      const frequency = periodicData?.interval / (60 * 60 * 24)
      if (frequency % 7 == 0) {
        if (frequency / 7 === 1) {
          return `every ${frequency / 7} week`
        }
        return `every ${frequency / 7} weeks`
      }

      return `every ${frequency} day${frequency > 1 ? 's' : ''}`
    }

    const getTotalAlreadyPaid = ({ startDate, paid, interval, owed }: any) =>
      ethers.utils.formatUnits(
        (((paid - startDate) / interval) * owed).toString()
      )

    return (
      <>
        <div className="grid grid-cols-2 sm:grid-cols-3">
          <h5 className="col-span-1 text-title5">From:</h5>
          <span className="col-span-1 text-body3">
            {getFormattedDate(new Date(periodicData.startDate * 1000))}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3">
          <h5 className="col-span-1 text-title5">To:</h5>
          <span className="col-span-1 text-body3">
            {getFormattedDate(new Date(periodicData.endDate * 1000))}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3">
          <h5 className="col-span-1 text-title5">Amount:</h5>
          <span className="col-span-1 text-body3">
            {`${ethers.utils.formatUnits(
              periodicData.owed.toString(),
              token?.decimals || 18
            )} ${token.symbol}`}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3">
          <h5 className="col-span-1 text-title5">Frequency:</h5>
          <span className="col-span-1 text-body3">{getFrequency()}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3">
          <h5 className="col-span-1 text-title5">Total paid:</h5>
          <span className="col-span-1 text-body3">
            {getTotalAlreadyPaid(periodicData)} {token.symbol}
          </span>
        </div>
      </>
    )
  }

  const renderPhased = () => (
    <div className="flex flex-col gap-4">
      <h5 className="col-span-1 text-title5">Phases:</h5>
      <div className="flex flex-col gap-6px">
        {preparedData.msPayments?.map((p, i) => (
          <div key={`k_${i}`} className="flex items-center gap-10px h-8">
            <Icon
              icon="darkBullet"
              classes="w-4 h-4 shrink-0 fill-gray-900"
              color="inherit"
            />
            <span className="inline-flex flex-wrap text-body3 shrink-0">
              {getFormattedDate(preparedData.msDates?.[i]! * 1000)}
              &nbsp;-&nbsp;
              <span className="inline-block text-ellipsis overflow-hidden max-w-33">
                {ethers.utils.formatUnits(p.toString(), token.decimals)}{' '}
                {token.symbol}
              </span>
            </span>
            {i >= curMil ? (
              <>
                {isController || isRecipient ? (
                  <PrimaryButton
                    loading={disburseLoading}
                    onClick={handleClaim}
                    type="button"
                    styling="outlined"
                    classes="text-sm leading-5 h-8 px-3"
                  >
                    {isRecipient ? 'Claim' : 'Release'}
                  </PrimaryButton>
                ) : null}
              </>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-body4 font-light text-gray-900">
                  Funds disbursed
                </span>
                <CheckIcon className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <section className="relative pb-20">
      <div className="container flex flex-col items-start px-6 pt-12 gap-6 lg:gap-7">
        <div className="flex items-center justify-between w-full mb-4">
          <div className="flex items-center gap-2">
            <Link href={'/explorer'} className="group">
              <Icon
                icon="arrow"
                classes="w-5 h-5 origin-center shrink-0 fill-gray-900 rotate-180 transition-transform group-hover:-translate-x-1"
                color="inherit"
              />
            </Link>
            <span className="text-title2">{hideString(address, 4)}</span>
          </div>
          <div className="flex items-center gap-5 sm:gap-8">
            <button
              className="w-10 h-10 cursor-pointer group"
              onClick={handleCopyAddress}
            >
              <Icon
                icon="copy"
                size={[40, 40]}
                classes="fill-gray-900 shrink-0 transition-colors group-hover:fill-olive-800"
                color="inherit"
              />
            </button>
            {/* <button className="w-10 h-10 cursor-pointer group" onClick={handleQRCodeClick}>
              <Icon icon="qrCode" size={[40, 40]} classes="fill-gray-900 shrink-0 transition-colors group-hover:fill-olive-800" color="inherit" />
            </button> */}
            <button
              className="w-10 h-10 cursor-pointer group"
              onClick={handleExternalLinkClick}
            >
              <Icon
                icon="eLink"
                size={[40, 40]}
                classes="fill-gray-900 shrink-0 transition-colors group-hover:fill-olive-800"
                color="inherit"
              />
            </button>
          </div>
        </div>

        <div className="flex flex-col items-start w-233 max-w-full gap-8 mb-20 md:grid md:grid-cols-2 md:mb-25">
          <div className="w-full col-span-1 flex flex-col rounded-lx border border-gray-900 gap-4 sm:gap-6 p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3">
              <h5 className="col-span-1 text-title5">Controller:</h5>
              <div className="col-span-1 flex items-center gap-1">
                <span className="text-body3 capitalize">
                  {hideString(controller, 4)}
                </span>
                <Link
                  href={getEtherScanLink(controller, chainName)}
                  target="_blank"
                  className="w-5 h-5"
                >
                  <Icon
                    icon="eLinkSmall"
                    size={[20, 20]}
                    classes="fill-gray-900 shrink-0 transition-colors hover:fill-olive-800"
                    color="inherit"
                  />
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3">
              <h5 className="col-span-1 text-title5">Recipient:</h5>
              <div className="col-span-1 flex items-center gap-1">
                <span className="text-body3 capitalize">
                  {hideString(recipient, 4)}
                </span>
                <Link
                  href={getEtherScanLink(recipient, chainName)}
                  target="_blank"
                  className="w-5 h-5"
                >
                  <Icon
                    icon="eLinkSmall"
                    size={[20, 20]}
                    classes="fill-gray-900 shrink-0 transition-colors hover:fill-olive-800"
                    color="inherit"
                  />
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3">
              <h5 className="col-span-1 text-title5">Type:</h5>
              <span className="col-span-1 text-body3 capitalize">{type}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3">
              <h5 className="col-span-1 text-title5">Deployed:</h5>
              <span className="col-span-1 text-body3">{deployed}</span>
            </div>
            {type === 'periodic' ? renderPeriodic() : null}
            {type === 'phased' ? renderPhased() : null}
          </div>
          <div className="w-full col-span-1 flex flex-col rounded-lx border border-gray-900 gap-6 p-6">
            <h5 className="text-title5 mb-4">Balance:</h5>
            <span className="text-title3 mb-5">{balance}</span>
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2">
              <div className="flex gap-2 w-full">
                <button
                  onClick={openDepositModal}
                  className="outlined-btn flex-grow"
                >
                  <Icon
                    icon="plus"
                    classes="w-5 h-5 shrink-0 fill-gray-900"
                    color="inherit"
                  />
                  <span className="text-label">Deposit Funds</span>
                </button>
                {type === 'periodic' && (isController || isRecipient) ? (
                  <button
                    onClick={handleClaim}
                    className="outlined-btn flex-grow"
                  >
                    {disburseLoading ? (
                      <LoadingIcon
                        bulletClassNames="w-4 h-4"
                        pendingClassNames="w-3 h-3"
                      />
                    ) : (
                      <Icon
                        icon="claim"
                        classes="w-5 h-5 shrink-0 fill-gray-900"
                        color="inherit"
                      />
                    )}
                    <span className="text-label">
                      {isRecipient ? 'Claim Funds' : 'Release Funds'}
                    </span>
                  </button>
                ) : null}
              </div>
              {isController ? (
                <div className="flex gap-2 w-full">
                  <button
                    onClick={handleTogglePaused}
                    className="outlined-btn flex-grow"
                  >
                    {togglePausedLoading ? (
                      <LoadingIcon
                        bulletClassNames="w-4 h-4"
                        pendingClassNames="w-3 h-3"
                      />
                    ) : (
                      <Icon
                        icon={paused ? 'resume' : 'pause'}
                        classes="w-5 h-5 shrink-0 fill-gray-900"
                        color="inherit"
                      />
                    )}
                    <span className="text-label">
                      {paused ? 'Resume' : 'Pause'}
                    </span>
                  </button>
                  <button
                    onClick={handleWithdraw}
                    className="outlined-btn flex-grow"
                  >
                    {withdrawLoading ? (
                      <LoadingIcon
                        bulletClassNames="w-4 h-4"
                        pendingClassNames="w-3 h-3"
                      />
                    ) : (
                      <Icon
                        icon="withdraw"
                        classes="w-5 h-5 shrink-0 fill-gray-900"
                        color="inherit"
                      />
                    )}
                    <span className="text-label">Withdraw funds</span>
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full gap-9">
          <h3 className="text-title2">Activity</h3>
          <div className="flex flex-col border-t border-gray-200 gap-5 pt-9">
            {!!activitiesData?.activities
              ? activitiesData?.activities.map(
                  (activity: IActivity, i: number) => (
                    <ActivityItem
                      key={`${activity.blockTimestamp}_${i}`}
                      activity={activity}
                      isController={isController}
                      isRecipient={isRecipient}
                      token={token}
                    />
                  )
                )
              : null}
          </div>
        </div>
      </div>
    </section>
  )
}

export default StreamSection
