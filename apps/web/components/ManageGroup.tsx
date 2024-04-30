// @flow
import * as React from 'react'
import { useCallback, useEffect } from 'react'
import { useRouter } from 'next/router'
import { trpc } from 'utils/trpc'
import { GroupTokenGate } from '@microcosms/db'
import { GetGroup } from 'utils/types'
import FrameBlock from 'components/FrameBlock'
import { useRecoilState } from 'recoil'
import { modalState as modalInitState } from 'state/Modal'
import { EditOrCreateGroupTokenGateView } from 'components/views/EditOrCreateGroupTokenGateView'
import {
  CalendarDaysIcon,
  CheckCircleIcon,
  LockClosedIcon,
  PlusIcon,
  UserGroupIcon,
} from '@heroicons/react/20/solid'
import { TokenRuleListItem } from './VerifyWtfBox'
import { LoadingIcon, PrimaryButton } from '@microcosmbot/ui'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import Dropdown from 'components/Dropdown'
import { ChainInfos } from '@microcosms/bot'
import { useInvalidateCode } from 'utils/trpc/invalidate'

const Schema = z.object({
  matchAny: z.boolean(),
})
// .refine((data) => {
//   if (data.minTokens && data.maxTokens) {
//     return (
//         parseInt(data.minTokens.toString()) <
//         parseInt(data.maxTokens.toString())
//     )
//   }
//   return true
// }, 'refined')

function ManagingActiveGroup({
  group,
  onSave,
}: {
  group: GetGroup
  onSave: () => Promise<void>
}) {
  const router = useRouter()

  const [modalState, setModalState] = useRecoilState(modalInitState)

  //https://t.me/microcosmbotdotxyz_bot?settings=true

  const groupInviteLink = `https://t.me/microcosmbotdotxyz_bot?start=${group.id}`

  const openEditModal = useCallback(
    (rule?: GroupTokenGate) => {
      setModalState((prev) => {
        return {
          ...prev,
          isModalOpen: true,
          modalChildren: (
            <FrameBlock key={rule?.id || group.group.groupTokenGate.length}>
              <EditOrCreateGroupTokenGateView
                rule={rule}
                manageGroup={group}
                onSave={onSave}
              />
            </FrameBlock>
          ),
        }
      })
    },
    [setModalState, group, onSave]
  )

  const setMatchAnyMutation = trpc.manageGroup.setMatchAny.useMutation()
  const setChain = trpc.manageGroup.setChain.useMutation()

  const { invalidate } = useInvalidateCode()

  const submitForm = useMutation(async (values: { matchAny: boolean }) => {
    await setMatchAnyMutation.mutateAsync({
      code: group.code,
      matchAny: values.matchAny,
    })
    await invalidate()
  })

  // const { handleSubmit, handleChange, values, initialValues, touched } =
  //   useFormik({
  //     initialValues: {
  //       matchAny: group.group.allowMatchAnyRule ?? false,
  //     },
  //     validate: toFormikValidate(Schema),
  //     onSubmit: (values) => submitForm.mutate(values),
  //   })
  // useEffect(() => {
  //   if (
  //     typeof values.matchAny !== 'undefined' &&
  //     values.matchAny !== initialValues.matchAny &&
  //     submitForm.isIdle
  //   ) {
  //     submitForm.mutate({ matchAny: values.matchAny })
  //   }
  // }, [touched.matchAny, submitForm, values.matchAny, initialValues.matchAny])

  const [matchAny, setMatchAny] = React.useState(group.group.allowMatchAnyRule)
  const onMatchAnyChange = useMutation(
    async ({ matchAny }: { matchAny: boolean }) => {
      setMatchAny(matchAny)
      await setMatchAnyMutation.mutateAsync({
        code: group.code,
        matchAny: matchAny,
      })
      await invalidate()
    }
  )
  const chains = ChainInfos
  const groupChain = chains.findIndex(
    (chain) => chain.chainId === group.group.chainId
  )

  const [selectedOption, setSelectedOption] = React.useState<number>(groupChain)
  const saveChainMutation = useMutation(async (optionIndex: number) => {
    try {
      const chainId = chains[optionIndex].chainId
      if (!chainId) {
        return
      }
      await setChain.mutateAsync({
        code: group.code,
        chainId,
      })
      await invalidate()
      setSelectedOption(optionIndex)
    } catch (e) {
      console.error(e)
    }
  })
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false)
  const chainOptions = chains.map((chain, i) => (
    <div className={'flex flex-row gap-1 min-w-130px py-1'}>
      {chain.chainName}
      {i === selectedOption ? (
        <CheckCircleIcon color={'green'} width={16} />
      ) : null}
    </div>
  ))

  return (
    <>
      <div className={'min-w-full w-full'}>
        <div className={'pt-0'}>
          <div
            className={
              'flex md:items-top justify-between flex-col md:flex-row align-top gap-x-6 py-5'
            }
          >
            <div className={'flex flex-col'}>
              <span className={''}>
                <h3
                  className={
                    'text-body1 text-size-title3 text-gray-800 inline truncate'
                  }
                >
                  {group.group.name}
                </h3>
              </span>
              <div className={'flex flex-row items-center gap-1 pt-3'}>
                <Dropdown
                  label={'Chain - ' + chains[selectedOption].chainName}
                  options={chainOptions}
                  isOpen={isDropdownOpen}
                  setIsOpen={setIsDropdownOpen}
                  onOptionSelected={saveChainMutation.mutate}
                  labelClassName={'min-w-[100px]'}
                />
                <div>{saveChainMutation.isLoading && <LoadingIcon />}</div>
                <div>
                  {saveChainMutation.isSuccess && (
                    <CheckCircleIcon color={'green'} width={24} />
                  )}

                  {saveChainMutation.isError && 'Error saving chain'}
                </div>
              </div>
            </div>

            <div>
              <div className="mt-4 md:mt-0 flex w-full flex-none gap-x-4 md:px-6">
                <dt className="flex-none">
                  <span className="sr-only">Member Info</span>
                  <UserGroupIcon
                    className="h-6 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </dt>
                <dd className="text-sm font-medium leading-6 text-gray-900">
                  {group.membersCount} members
                </dd>
              </div>
              <div className="mt-4 flex w-full flex-none gap-x-4 md:px-6">
                <dt className="flex-none">
                  <span className="sr-only">Member Info</span>
                  <LockClosedIcon
                    className="h-6 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </dt>
                <dd className="text-sm font-medium leading-6 text-gray-900">
                  {group.adminsCount} admins
                </dd>
              </div>
              <div className="mt-4 flex w-full flex-none gap-x-4 md:px-6">
                <dt className="flex-none">
                  <span className="sr-only">Due date</span>
                  <CalendarDaysIcon
                    className="h-6 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </dt>
                <dd className="text-sm leading-6 text-gray-900">
                  <time
                    dateTime={
                      group.group.createdAt.getFullYear() +
                      '-' +
                      group.group.createdAt.getMonth() +
                      '-' +
                      group.group.createdAt.getDate()
                    }
                  >
                    created {group.group.createdAt.toLocaleDateString()}
                  </time>
                </dd>
              </div>
            </div>
          </div>
        </div>
        {!group.group.groupTokenGate.length && (
          <div className={'pt-6 text-body1 text-sm text-gray-600'}>
            No rules yet, create access rules to token gate your chat!
          </div>
        )}
        <h3 className={'text-body1 text-xl text-black font-bold my-0'}>
          Access Rules
        </h3>
        <ul role="list" className="pt-2 pb-5 divide-y divide-gray-100">
          {group.group.groupTokenGate.map((tokenGate, index) => {
            return (
              <TokenRuleListItem rule={tokenGate}>
                <PrimaryButton
                  classes="w-full text-body1 text-md text-white p-3 bg-gray-500 tracking-widest"
                  onClick={() => {
                    openEditModal(tokenGate)
                  }}
                >
                  Edit
                </PrimaryButton>
              </TokenRuleListItem>
            )
          })}
          <li className="relative flex justify-between gap-x-6 pt-5">
            <button
              onClick={() => {
                openEditModal(undefined)
              }}
            >
              <div className={'flex gap-x-2'}>
                <PlusIcon className="h-6 w-6" />
                <div className="min-w-0 flex-auto">
                  <p className="text-lg font-semibold leading-6 text-body1 text-gray-900 ">
                    <span>Add access rule</span>
                  </p>
                </div>
                {/*<div className="flex items-center gap-x-4"></div>*/}
              </div>
            </button>
          </li>
        </ul>
        <div className="relative flex items-start">
          <div className="flex h-6 items-center">
            <input
              disabled={onMatchAnyChange.isLoading}
              defaultChecked={matchAny}
              id="matchAny"
              aria-describedby="matchAny"
              name="matchAny"
              type="checkbox"
              onChange={() => onMatchAnyChange.mutate({ matchAny: !matchAny })}
              value={matchAny.toString()}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
          </div>
          <div className="ml-3 text-sm leading-6">
            <label htmlFor="matchAny" className="font-medium text-gray-900">
              <div className={'flex flex-row gap-2'}>
                <span>Match any </span>
                {onMatchAnyChange.isLoading && (
                  <LoadingIcon containerClassNames={'w-4 h-4'} />
                )}
              </div>
            </label>
            <p id="matchAny" className="text-gray-500">
              {matchAny && (
                <span>(Checked) Grant access when any rule matches</span>
              )}
              {!matchAny && (
                <span>(Unchecked) Grant access when all rules match</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export const ManageGroup = () => {
  const router = useRouter()

  const group = trpc.manageGroup.getGroup.useQuery(
    { code: router.query.code?.toString() as string },
    { enabled: !!router.query.code, refetchOnWindowFocus: false, retry: false }
  )
  const refretch = useCallback(async () => {
    await group.refetch()
  }, [group])

  if (group.isLoading) {
    return <div>Loading...</div>
  }
  if (group.error) {
    return <div>Error: {group.error.message}</div>
  }
  if (new Date(group.data.expiresAt) < new Date()) {
    return <div>Link expired.</div>
  }
  if (!group.data.group.active) {
    return null
  }

  return (
    <section className={'w-full'}>
      <ManagingActiveGroup group={group.data} onSave={refretch} />
    </section>
  )
}
