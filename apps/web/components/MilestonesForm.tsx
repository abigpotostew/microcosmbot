// SPDX-License-Identifier: GPL-3.0-or-later

import { addresses, Manager__factory } from '@daokitchen/nouns-stream-sdk'
import { yupResolver } from '@hookform/resolvers/yup'
import { Input, PrimaryButton } from '@nouns-stream/ui'
import classNames from 'classnames'
import { useModal } from 'connectkit'
import { tokenAddresses } from 'constants/tokenAddresses'
import { serializeError } from 'eth-rpc-errors'
import { ethers } from 'ethers'
import { isAddress, parseUnits } from 'ethers/lib/utils.js'
import { IMilestonesValidated, TransactionLoadingStates } from 'libs/types'
import EthIcon from 'public/icons/eth-icon.svg'
import MinusIcon from 'public/icons/minus-icon.svg'
import PlusIcon from 'public/icons/plus-icon.svg'
import { FormEvent, useEffect, useMemo, useState } from 'react'
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import { useRecoilState } from 'recoil'
import { milestoneformState } from 'state/Milestones'
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
import {
  toasterState as toasterInitState,
  ToasterStateProps,
} from 'state/Toaster'
import CopyIcon from 'public/icons/copy-icon.svg'
import { InputPercentage } from './InputPercentage'
import { incentiveLimit } from 'constants/forms'
import { hideString } from 'utils/index'
import Decimal from 'decimal.js'
import { checkForSanctions } from 'services/chainalysis'

export const MilestonesForm = () => {
  const [milestones, setMilestones] = useRecoilState(milestoneformState)
  const [loading, setLoading] = useState(false)
  const [defaultTokenAddress] = useState<string>(tokenAddresses.default.ETH) // Zero address is ETH
  const [selectedToken, setSelectedToken] = useState<Token>()

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

  const onePhase = milestones.msPayments.length === 1

  const today = new Date()
  const validationSchema = (decimals: number) =>
    yup.object({
      owner: yup.string().required('This field is required'),
      recipient: yup.string().required('This field is required'),
      ms: yup.array().of(
        yup.object().shape({
          name: yup.string(),
          msPayments: yup
            .string()
            .required('This field is required')
            .max(decimals + 2, `Not more than ${decimals} decimals`),
          msDates: yup
            .date()
            .typeError('Invalid date type')
            .transform((curr, orig) => (orig === '' ? null : curr))
            .required('This field is required'),
        })
      ),
      tip: yup.string().max(decimals + 2, `Not more than ${decimals} decimals`),
    })

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    control,
    reset,
    trigger,
  } = useForm<IMilestonesValidated>({
    resolver: yupResolver(validationSchema(selectedToken?.decimals || 18)),
    defaultValues: {
      ms: milestones.msPayments.map((p) => ({
        name: 'ms',
        msPayments: p,
        msDates: undefined,
      })),
      tip: 0.0,
    },
  })

  const { fields, append, remove } = useFieldArray<
    IMilestonesValidated,
    'ms',
    'msId'
  >({
    control,
    name: 'ms',
    keyName: 'msId',
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

  const tipValue = useMemo(() => {
    const payments = milestones.msPayments.map((p) => +p)
    const sum = new Decimal(payments.reduce((prev, curr) => prev + curr))
    const multiplicand = sum.div(milestones.msPayments.length)
    const multiplier = new Decimal(+milestones.tip).div(100)
    const tip = multiplicand
      .times(multiplier)
      .toDecimalPlaces(selectedToken?.decimals || 18)
      .valueOf()

    return tip
  }, [milestones.msPayments, milestones.tip, selectedToken?.decimals])

  const setAddressField = async (key: 'owner' | 'recipient', val: string) => {
    if (!isAddress(val) && !val.endsWith('.eth')) {
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
            setMilestones((prev: any) => {
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
    setMilestones((prev: any) => {
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

  const formBlur = async (change: FormEvent<HTMLFormElement>) => {
    change.preventDefault()

    const target = change.target as HTMLButtonElement
    const key: any = target.name
    const val = target.value

    if (key === 'deterministicAddress') return
    await trigger(key)
    // @ts-ignore
    if (val !== milestones[key]) {
      if (key.startsWith('ms')) {
        const keyStr: any[] = key.split('.')
        setMilestones((prev: any) => {
          const k = keyStr.at(-1)
          const index = keyStr.at(1)
          const kArr = [...prev[k]]

          if (k === 'msPayments') {
            const v = val !== '' ? val : '0'

            kArr[index] = v
          }

          const newArr = [...kArr]
          return { ...prev, [k]: newArr }
        })

        return
      }

      switch (key) {
        case 'tip':
          setMilestones((prev: any) => {
            const v =
              val !== '' ? Number(val.slice(0, val?.length - 1)) : undefined
            return { ...prev, [key]: v }
          })
          break

        case 'owner':
        case 'recipient':
          setAddressField(key, val)
          break

        default:
          break
      }
    }
  }

  const formChange = async (change: FormEvent<HTMLFormElement>) => {
    change.preventDefault()

    const target = change.target as HTMLButtonElement
    const key: any = target.name
    const val = target.value

    if (key === 'deterministicAddress') return
    await trigger(key)

    // @ts-ignore
    if (val !== milestones[key]) {
      if (key.startsWith('ms')) {
        const keyStr: any[] = key.split('.')
        setMilestones((prev: any) => {
          const k = keyStr.at(-1)
          const index = keyStr.at(1)
          const kArr = [...prev[k]]

          if (k === 'msDates') {
            const seconds = Math.floor(new Date(val).getTime() / 1000)
            kArr[index] = seconds
          }

          const newArr = [...kArr]
          return { ...prev, [k]: newArr }
        })

        return
      }

      switch (key) {
        case 'owner':
        case 'recipient':
          onAddressFieldChange(key)
          break
      }
    }
  }

  useEffect(() => {
    return () => {
      resetForm()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const addMilestone = () => {
    append({
      name: '',
      msPayments: '',
      msDates: today,
    })

    setMilestones((prev: any) => {
      return {
        ...prev,
        msDates: [...prev.msDates, undefined],
        msPayments: [...prev.msPayments, ''],
      }
    })
  }

  const removeMilestone = (idx: number) => {
    remove(idx)

    setMilestones((prev: any) => {
      const prevDates = [...prev.msDates]
      const prevPayments = [...prev.msPayments]

      prevDates.splice(idx, 1)
      prevPayments.splice(idx, 1)

      return {
        ...prev,
        msDates: [...prevDates],
        msPayments: [...prevPayments],
      }
    })
  }

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
    resetForm()
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
        onCloseCb: resetTransactionStatus,
      }
    })
  }

  const setDeterministicAddress = async () => {
    const detAddr = await manager?.getMSSStreamAddress(
      // @ts-ignore
      milestones.owner,
      milestones.msDates,
      milestones.recipient,
      selectedToken?.address || defaultTokenAddress
    )
    console.log('detAddr')
    console.log(detAddr)

    setMilestones((prev: any) => ({ ...prev, deterministicAddress: detAddr }))
  }

  useEffect(() => {
    if (
      (isAddress(milestones.owner!) || resolvedAddress.owner) &&
      (isAddress(milestones.recipient!) || resolvedAddress.recipient) &&
      milestones.msDates.every((n: any) => typeof n === 'number')
    ) {
      ;(async () => await setDeterministicAddress())()
    } else {
      setMilestones((prev: any) => ({
        ...prev,
        deterministicAddress: '',
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    milestones.owner,
    milestones.recipient,
    selectedToken,
    milestones.msDates,
    resolvedAddress.owner,
    resolvedAddress.recipient,
  ])

  const resetForm = () => {
    reset()

    setSelectedToken(undefined)
    setResolvedAddress({
      owner: undefined,
      recipient: undefined,
    })
    setIsResolvingAddress({
      owner: false,
      recipient: false,
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

  const onSubmit: SubmitHandler<IMilestonesValidated> = async (data) => {
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
      if (!milestones.owner && !milestones.recipient)
        throw Error('Incorrect address')

      openModal()

      try {
        const decimals = selectedToken?.decimals || 18

        const tx = await manager?.createMSStream(
          // @ts-ignore
          milestones.owner,
          milestones.msPayments.map((x) => parseUnits(x, decimals)),
          milestones.msDates,
          parseUnits(tipValue, decimals),
          milestones.recipient,
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
    milestones.deterministicAddress &&
      navigator.clipboard.writeText(milestones.deterministicAddress)

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
      +(Number(milestones.tip) + step).toFixed(2)
    )
    if (+milestones.tip < incentiveLimit) {
      setMilestones((prev: any) => {
        return { ...prev, tip: increasedValue }
      })
    }
  }

  const decreaseTip = (step: number) => {
    const decreasedValue = Math.max(
      0,
      +(Number(milestones.tip) - step).toFixed(2)
    )
    if (+milestones.tip > 0) {
      setMilestones((prev: any) => {
        return { ...prev, tip: decreasedValue }
      })
    }
  }

  const onIncentiveChange = (ev: any) => {
    let v = Number(ev.target.value.slice(0, ev.target.value?.length - 1))
    if (v > incentiveLimit) v = incentiveLimit
    if (v < 0) v = 0

    setMilestones((prev: any) => {
      return { ...prev, tip: v }
    })
  }

  return (
    <div className="w-full pt-8">
      <form
        className="flex flex-col gap-4 xl:gap-5"
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
          error={errors.recipient?.message}
          resolvedAddress={resolvedAddress.recipient}
          isResolvingAddress={isResolvingAddress.recipient}
          {...register('recipient')}
        />
        <div className="-mt-1">
          <h5 className="text-label mb-1 px-4">Phase(s)</h5>
          <p className="text-body5 mb-3 px-4">
            Schedule of dates and amounts which will be used for paying out
            original funds to recipient
          </p>

          {fields.map((item, i: number) => (
            <div key={`milestones-${item.msId}`} className="flex mb-3">
              <div
                className={classNames(
                  'grid w-full gap-2 min-w-30',
                  onePhase ? 'grid-cols-10' : 'grid-cols-11'
                )}
              >
                <Input
                  type="date"
                  placeholder="Date"
                  classes="col-span-5"
                  defaultValue={item.msDates as any}
                  error={errors.ms && errors.ms[i]?.msDates?.message}
                  {...register(`ms.${i}.msDates` as const)}
                />
                <Input
                  placeholder="Amount"
                  inputMode="numeric"
                  classes="col-span-5"
                  step="any"
                  defaultValue={item.msPayments}
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
                              src={selectedToken?.logoUri}
                              alt={selectedToken?.symbol}
                            />
                            <p className="text-body4 uppercase">
                              {selectedToken?.symbol.length > 5
                                ? `${selectedToken?.symbol.slice(0, 5)}`
                                : selectedToken?.symbol}
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
                  error={errors.ms && errors.ms[i]?.msPayments?.message}
                  {...register(`ms.${i}.msPayments` as const)}
                />
                {!onePhase ? (
                  <button
                    type="button"
                    className="col-span-1"
                    onClick={() => removeMilestone(i)}
                  >
                    <MinusIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                ) : null}
              </div>
            </div>
          ))}
          <div className="contained-btn" onClick={addMilestone}>
            <PlusIcon className="h-5 w-5" aria-hidden="true" />
            <span className="text-label">Add phase</span>
          </div>
        </div>
        <InputPercentage
          name="tip"
          label="Bot Incentive"
          placeholder="0.00%"
          classes="flex-grow w-full mb-2 -mt-1"
          increase={increaseTip}
          decrease={decreaseTip}
          limit={incentiveLimit}
          value={milestones.tip}
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
          value={milestones.deterministicAddress}
          endAdornment={
            milestones.deterministicAddress ? (
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
