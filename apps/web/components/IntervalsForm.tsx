// SPDX-License-Identifier: GPL-3.0-or-later

import { addresses, Manager__factory } from '@daokitchen/nouns-stream-sdk'
import { yupResolver } from '@hookform/resolvers/yup'
import { Input, PrimaryButton } from '@nouns-stream/ui'
import { useModal } from 'connectkit'
import {
  frequencyMultipliers,
  incentiveLimit,
  tokenAddresses,
} from 'constants/index'
import { serializeError } from 'eth-rpc-errors'
import { BigNumber, ethers } from 'ethers'
import { isAddress, parseUnits } from 'ethers/lib/utils.js'
import { TransactionLoadingStates } from 'libs/types'
import EthIcon from 'public/icons/eth-icon.svg'
import { FormEvent, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useRecoilState } from 'recoil'
import { IIntervals, intervalsState } from 'state/Intervals'
import { modalState as modalInitState } from 'state/Modal'
import { Token } from 'state/TokenList'
import { transactionState as transactionInitState } from 'state/TransactionsState'
import {
  useAccount,
  useContract,
  useNetwork,
  useProvider,
  useSigner,
} from 'wagmi'
import * as yup from 'yup'
import FormProcess from './FormProcess'
import FormSelectToken from './FormSelectToken'
import FrameBlock from './FrameBlock'
import Select from './Select'
import {
  toasterState as toasterInitState,
  ToasterStateProps,
} from 'state/Toaster'
import CopyIcon from 'public/icons/copy-icon.svg'
import { InputPercentage } from './InputPercentage'
import { hideString } from 'utils/index'
import Decimal from 'decimal.js'
import { checkForSanctions } from 'services/chainalysis'

export const IntervalsForm = () => {
  const [intervals, setIntervals] = useRecoilState(intervalsState)
  const [loading, setLoading] = useState(false)
  const [defaultTokenAddress] = useState<string>(tokenAddresses.default.ETH) // Zero address is ETH
  const [selectedToken, setSelectedToken] = useState<Token>()

  const [frequencyMultiplier, setFrequencyMultiplier] = useState(
    frequencyMultipliers.weeks
  )
  const [transactionState, setTransactionState] =
    useRecoilState(transactionInitState)
  const [modalState, setModalState] = useRecoilState(modalInitState)
  const [toasterState, setToasterState] = useRecoilState(toasterInitState)
  const { chain } = useNetwork()
  const { isDisconnected: walletIsDisconnected } = useAccount()
  const { setOpen: setOpenConnectkitModal } = useModal()
  const mainProvider = useProvider({ chainId: 1 })
  const [isResolvingAddress, setIsResolvingAddress] = useState({
    owner: false,
    recipient: false,
  })
  const [resolvedAddress, setResolvedAddress] = useState({
    owner: undefined,
    recipient: undefined,
  })

  const tipValue = new Decimal(+intervals.owed)
    .times(new Decimal(+intervals.tip).div(100).valueOf())
    .toDecimalPlaces(selectedToken?.decimals || 18)
    .valueOf()

  const today = new Date()
  const validationSchema = (decimals: number) =>
    yup.object({
      owner: yup.string().required('This field is required'),
      recipient: yup.string().required('This field is required'),
      owed: yup
        .string()
        .required('This field is required')
        .max(decimals + 2, `Not more than ${decimals} decimals`),
      interval: yup
        .number()
        .min(1)
        .typeError('Invalid field type')
        .required('This field is required'),
      startDate: yup
        .date()
        .typeError('Invalid date type')
        .transform((curr, orig) => (orig === '' ? null : curr))
        .required('This field is required'),
      endDate: yup
        .date()
        .typeError('Invalid date type')
        .min(
          new Date(today.setHours(0, 0, 0, 0)),
          'This field must be later than now'
        )
        .transform((curr, orig) => (orig === '' ? null : curr))
        .required('This field is required'),
      tip: yup.string().max(decimals + 2, `Not more than ${decimals} decimals`),
    })

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    reset,
    trigger,
  } = useForm<IIntervals>({
    resolver: yupResolver(validationSchema(selectedToken?.decimals || 18)),
    defaultValues: {
      tip: 0.0,
    },
  })

  const { data: signer } = useSigner({
    chainId: chain?.id,
  })

  const manager = useContract({
    address: addresses.goerli.ManagerProxy,
    abi: Manager__factory.abi,
    signerOrProvider: walletIsDisconnected
      ? new ethers.providers.JsonRpcProvider({
          url: process.env.NEXT_PUBLIC_RPC_URL as string,
        })
      : signer,
  })

  const setAddressField = async (key: 'owner' | 'recipient', val: string) => {
    if (!isAddress(val) || !val.endsWith('.eth')) {
      setError(key, { message: `Invalid Address` })
      // @ts-ignore
    } else if (isAddress(val) || val.endsWith('.eth')) {
      clearErrors(key)

      if (val.endsWith('.eth')) {
        setIsResolvingAddress((prev) => {
          return { ...prev, [key]: true }
        })
        const address = await mainProvider.resolveName(val)
        setIsResolvingAddress((prev) => {
          return { ...prev, [key]: false }
        })
        if (address) {
          const isSanctioned = await checkForSanctions(address)
          if (isSanctioned?.identifications?.length) {
            setError(key, { message: `Address is sanctioned` })
          } else {
            setIntervals((prev: any) => {
              return { ...prev, [key]: address }
            })
            setResolvedAddress((prev) => {
              return { ...prev, [key]: hideString(address, 4) }
            })
          }
        } else {
          setResolvedAddress((prev) => {
            return { ...prev, [key]: undefined }
          })
          setError(key, { message: `ENS doesn't exist` })
        }
        return
      } else {
        const isSanctioned = await checkForSanctions(val)

        if (isSanctioned?.identifications?.length) {
          setError(key, { message: `Address is sanctioned` })
        }
      }
    } else {
      setResolvedAddress((prev) => {
        return { ...prev, [key]: undefined }
      })
      setIsResolvingAddress((prev) => {
        return { ...prev, [key]: false }
      })
    }
    setIntervals((prev: any) => {
      return { ...prev, [key]: val }
    })
  }

  const onAddressFieldChange = (key: 'owner' | 'recipient') => {
    setResolvedAddress((prev) => {
      return { ...prev, [key]: undefined }
    })
    setIsResolvingAddress((prev) => {
      return { ...prev, [key]: false }
    })
  }

  const formChange = async (
    change: FormEvent<HTMLFormElement> | FormEvent<HTMLInputElement>
  ) => {
    const target = change.target as HTMLButtonElement
    const key: any = target.name
    const val = target.value
    if (key === 'deterministicAddress') return
    await trigger(key)

    // @ts-ignore
    if (val !== intervals[key]) {
      switch (key) {
        case 'startDate':
        case 'endDate':
          setIntervals((currVal: any) => {
            const seconds = Math.floor(new Date(val).getTime() / 1000)
            return { ...currVal, [key]: seconds }
          })
          break
        case 'owner':
        case 'recipient':
          onAddressFieldChange(key)
          break
      }
    }
  }

  const formBlur = async (
    change: FormEvent<HTMLFormElement> | FormEvent<HTMLInputElement>
  ) => {
    const target = change.target as HTMLButtonElement
    const key: any = target.name
    const val = target.value

    if (key === 'deterministicAddress') return
    await trigger(key)

    // @ts-ignore
    if (val !== intervals[key]) {
      switch (key) {
        case 'startDate':
        case 'endDate':
          setIntervals((currVal: any) => {
            const seconds = Math.floor(new Date(val).getTime() / 1000)
            return { ...currVal, [key]: seconds }
          })
          break
        case 'owed':
          setIntervals((currVal: any) => {
            const v = val !== '' ? val : '0'
            return { ...currVal, [key]: v }
          })
          break
        case 'tip':
          setIntervals((currVal: any) => {
            const v =
              val !== '' ? Number(val.slice(0, val?.length - 1)) : undefined
            return { ...currVal, [key]: v }
          })
          break
        case 'interval':
          setIntervals((currVal: any) => {
            return {
              ...currVal,
              [key]: Number(val),
            }
          })
          break
        case 'owner':
        case 'recipient':
          setAddressField(key, val)
          break
      }
    }
  }

  const resetForm = () => {
    reset()
    setSelectedToken(undefined)
  }

  useEffect(() => {
    return () => {
      resetForm()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const getFrequency = (): number => {
    return Number(intervals.interval) * 60 * 60 * 24 * frequencyMultiplier
  }

  const setDeterministicAddress = async () => {
    const detAddr = await manager?.getIntvStreamAddress(
      // @ts-ignore
      intervals.owner,
      intervals.startDate,
      intervals.endDate,
      getFrequency(),
      selectedToken?.address || defaultTokenAddress,
      intervals.recipient
    )
    console.log('detAddr')
    console.log(detAddr)

    setIntervals((prev: any) => ({ ...prev, deterministicAddress: detAddr }))
  }

  useEffect(() => {
    if (
      (isAddress(intervals.owner!) || resolvedAddress.owner) &&
      (isAddress(intervals.recipient!) || resolvedAddress.recipient) &&
      intervals.startDate &&
      intervals.endDate &&
      intervals.interval
    ) {
      ;(async () => await setDeterministicAddress())()
    } else {
      setIntervals((prev: any) => ({
        ...prev,
        deterministicAddress: '',
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    intervals.recipient,
    intervals.owner,
    intervals.startDate,
    intervals.endDate,
    intervals.interval,
    resolvedAddress.owner,
    resolvedAddress.recipient,
    selectedToken,
    frequencyMultiplier,
  ])

  const resetTransactionStatus = () => {
    setTransactionState(
      (prev: TransactionLoadingStates): TransactionLoadingStates => {
        return {
          steps: {
            approval: {
              ...prev.steps.approval,
              status: 'pending',
            },
            deploy: {
              ...prev.steps.deploy,
              status: 'pending',
            },
          },
          contractTransaction: undefined,
        }
      }
    )
  }

  const closeModal = () => {
    setModalState((prev) => {
      return {
        ...prev,
        isModalOpen: false,
      }
    })
  }

  const openModal = () => {
    setModalState((prev) => {
      return {
        ...prev,
        isModalOpen: true,
        modalChildren: (
          <FrameBlock>
            <FormProcess closeModal={closeModal} />
          </FrameBlock>
        ),
        onCloseCb: () => {
          resetTransactionStatus()
          resetForm()

          setIntervals((prev: any) => ({
            ...prev,
            deterministicAddress: '',
          }))
        },
      }
    })
  }

  const checkAddressField = async (key: 'owner' | 'recipient', val: string) => {
    if (val.endsWith('.eth')) {
      const address = await mainProvider.resolveName(val)
      if (address) {
        const isSanctioned = await checkForSanctions(address)
        if (isSanctioned?.identifications?.length) {
          setError(key, { message: `Address is sanctioned` })
          return false
        }
        return true
      } else {
        setError(key, { message: `ENS doesn't exist` })
        return false
      }
    }
    if (isAddress(val)) {
      const isSanctioned = await checkForSanctions(val)
      if (isSanctioned?.identifications?.length) {
        setError(key, { message: `Address is sanctioned` })
        return false
      }
      clearErrors(key)
      return true
    } else {
      setError(key, { message: 'Invalid address' })
      return false
    }
  }

  const onSubmit: SubmitHandler<IIntervals> = async (data) => {
    if (walletIsDisconnected) {
      setOpenConnectkitModal(true)

      return
    }

    const isControllerValid = await checkAddressField('owner', data.owner!)
    const isRecipientValid = await checkAddressField(
      'recipient',
      data.recipient!
    )
    if (!isControllerValid || !isRecipientValid) {
      return
    }

    const allFieldsValid = await trigger()
    if (!allFieldsValid) {
      return
    }

    setLoading(true)

    try {
      if (!intervals.owner && !intervals.recipient)
        throw Error('Incorrect address')

      openModal()

      try {
        const decimals = selectedToken?.decimals || 18

        const tx = await manager?.createIntvStream(
          // @ts-ignore
          intervals.owner,
          intervals.startDate as unknown as BigNumber,
          intervals.endDate as unknown as BigNumber,
          getFrequency(),
          parseUnits(intervals.owed, decimals),
          parseUnits(tipValue, decimals),
          intervals.recipient,
          (selectedToken?.address || defaultTokenAddress) as `0x${string}`
        )

        setTransactionState(
          (prev: TransactionLoadingStates): TransactionLoadingStates => {
            return {
              steps: {
                ...prev.steps,
                approval: {
                  ...prev.steps.approval,
                  status: 'finished',
                },
              },
              contractTransaction: tx,
            }
          }
        )

        await tx?.wait(1)

        setTransactionState(
          (prev: TransactionLoadingStates): TransactionLoadingStates => {
            return {
              ...prev,
              steps: {
                ...prev.steps,
                deploy: {
                  ...prev.steps.deploy,
                  status: 'finished',
                },
              },
            }
          }
        )
      } catch (err) {
        const serializedError = serializeError(err)
        console.error('Error:', serializedError)

        const userRejectedCode = -32603

        if (serializedError?.code === userRejectedCode) {
          setModalState((prev) => {
            return {
              ...prev,
              isModalOpen: false,
              modalChildren: null,
            }
          })
        }
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleFrequencyChange = (option: number) => {
    setFrequencyMultiplier(option)
  }

  const onTokenSelectClick = () => {
    if (walletIsDisconnected || !chain) {
      setOpenConnectkitModal(true)
    } else {
      setModalState((prev) => {
        return {
          ...prev,
          isModalOpen: true,
          modalChildren: (
            <FrameBlock>
              <FormSelectToken
                network={chain.network}
                onTokenSelected={(token) => {
                  console.log(token)
                  setSelectedToken(token)
                  setModalState((prev) => {
                    return {
                      ...prev,
                      isModalOpen: false,
                      modalChildren: null,
                    }
                  })
                }}
              />
            </FrameBlock>
          ),
        }
      })
    }
  }

  const copyDeterministicAddress = () => {
    intervals.deterministicAddress &&
      navigator.clipboard.writeText(intervals.deterministicAddress)

    setToasterState((prev: ToasterStateProps) => {
      return {
        ...prev,
        queue: [...prev.queue, 'Copied'],
      }
    })
  }

  const increaseTip = (step: number) => {
    const increasedValue = Math.min(
      incentiveLimit,
      +(Number(intervals.tip) + step).toFixed(2)
    )
    if (+intervals.tip < incentiveLimit) {
      setIntervals((prev: any) => {
        return { ...prev, tip: increasedValue }
      })
    }
  }

  const decreaseTip = (step: number) => {
    const decreasedValue = Math.max(
      0,
      +(Number(intervals.tip) - step).toFixed(2)
    )
    if (+intervals.tip > 0) {
      setIntervals((prev: any) => {
        return { ...prev, tip: decreasedValue }
      })
    }
  }

  const onIncentiveChange = (ev: any) => {
    let v = Number(ev.target.value.slice(0, ev.target.value?.length - 1))
    if (v > incentiveLimit) v = incentiveLimit
    if (v < 0) v = 0

    setIntervals((prev: any) => {
      return { ...prev, tip: v }
    })
  }

  return (
    <div className="w-full pt-8">
      <form
        className="flex flex-col gap-5"
        onChange={formChange}
        onSubmit={handleSubmit(onSubmit)}
        onBlur={formBlur}
      >
        <Input
          label="Controller"
          placeholder="Ethereum address or ENS domain"
          hint="Controller can add funds to contract and pause or cancel future payments"
          classes="mb-2"
          error={errors.owner?.message}
          resolvedAddress={resolvedAddress.owner}
          isResolvingAddress={isResolvingAddress.owner}
          {...register('owner')}
        />
        <Input
          label="Recipient"
          placeholder="Ethereum address or ENS domain"
          hint="Receiving party who will be paid out in phases by Controller"
          classes="mb-2"
          error={errors.recipient?.message}
          resolvedAddress={resolvedAddress.recipient}
          isResolvingAddress={isResolvingAddress.recipient}
          {...register('recipient')}
        />
        <div className="grid grid-cols-2 gap-2 mb-2">
          <Input
            label="From"
            type="date"
            placeholder="Date"
            classes="col-span-1"
            hint="Date of first payment"
            error={errors?.startDate?.message}
            {...register('startDate')}
          />
          <Input
            label="To"
            type="date"
            placeholder="Date"
            classes="col-span-1"
            hint="Date of last payment"
            error={errors?.endDate?.message}
            {...register('endDate')}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Input
            label="Amount"
            placeholder="0.1"
            inputMode="numeric"
            step="any"
            classes="col-span-1"
            hint="Payment amount for each period"
            dropdown={
              <button
                type="button"
                className="col-span-1"
                onClick={onTokenSelectClick}
              >
                <div className="flex items-center max-h-8 top-6px right-6px gap-1 rounded-md p-6px pr-2 bg-olive-300 pointer-events-none">
                  {selectedToken ? (
                    <div className="flex items-center gap-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className="w-5 h-5 rounded-full"
                        src={selectedToken.logoUri}
                        alt={selectedToken?.symbol}
                      />
                      <p className="text-body4 uppercase">
                        {selectedToken.symbol.length > 5
                          ? `${selectedToken.symbol.slice(0, 5)}`
                          : selectedToken.symbol}
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <EthIcon className="w-5 h-5" />
                      <p className="text-body4 uppercase">ETH</p>
                    </div>
                  )}
                </div>
              </button>
            }
            error={errors?.owed?.message}
            {...register('owed')}
          />
          <Input
            label="Frequency"
            placeholder="2"
            pattern="[0-9]*"
            inputMode="numeric"
            classes="col-span-1"
            hint="Duration of each period between payments"
            dropdown={
              <Select
                options={frequencyMultipliers}
                currentOption={frequencyMultiplier}
                onChange={handleFrequencyChange}
              />
            }
            error={errors?.interval?.message}
            {...register('interval')}
          />
        </div>
        <InputPercentage
          name="tip"
          label="Bot Incentive"
          placeholder="0.00%"
          classes="flex-grow w-full mb-2"
          increase={increaseTip}
          decrease={decreaseTip}
          limit={incentiveLimit}
          value={intervals.tip}
          onChange={onIncentiveChange}
          step={0.05}
          tipValue={`${tipValue} ${selectedToken?.symbol || 'ETH'}`}
          hint="Tips incentivise our bots that automate payouts to the Recipient, otherwise, they manually claim funds"
        />
        <Input
          label="Contract Address"
          placeholder="Please complete form to generate an address"
          hint="Based on above inputs, we generate your future contract address. The contract must eventually be deployed and funded for recipients to receive funds"
          classes="mb-2"
          name="deterministicAddress"
          disabled={true}
          value={intervals.deterministicAddress}
          endAdornment={
            intervals.deterministicAddress ? (
              <div className="absolute flex items-center max-h-8 top-6px right-6px rounded-md p-6px pr-2 bg-olive-300">
                <button
                  type="button"
                  onClick={copyDeterministicAddress}
                  className="w-5 h-5 focus:outline-none"
                >
                  <CopyIcon className="w-full h-full" />
                </button>
              </div>
            ) : (
              <></>
            )
          }
        />
        <div>
          <PrimaryButton loading={loading} classes="w-full">
            Deploy contract
          </PrimaryButton>
        </div>
      </form>
    </div>
  )
}
