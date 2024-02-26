// @flow
import * as React from 'react'
import { useRouter } from 'next/router'
import { trpc } from 'utils/trpc'
import { Group, GroupTokenGate, ManageGroupCode } from '@microcosms/db'
import { GetGroup } from 'utils/types'
import FrameBlock from 'components/FrameBlock'
import { useRecoilState } from 'recoil'
import { modalState as modalInitState } from 'state/Modal'
import { EditOrCreateGroupTokenGateView } from 'components/views/EditOrCreateGroupTokenGateView'
import { useCallback } from 'react'
import {
  CalendarDaysIcon,
  HomeIcon,
  LockClosedIcon,
  PlusIcon,
  UserGroupIcon,
} from '@heroicons/react/20/solid'
import { TokenRuleListItem } from './VerifyWtfBox'
import { PrimaryButton } from '@microcosmbot/ui'

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
  return (
    <>
      <div className={'min-w-full w-full'}>
        <div className={'pt-0'}>
          <div
            className={
              'flex md:items-top justify-between flex-col md:flex-row align-top gap-x-6 py-5'
            }
          >
            <div className={''}>
              <span className={''}>
                {/*<h3 className={'text-body1 text-sxl text-gray-600'}>*/}
                {/*  Access Rules*/}
                {/*</h3>*/}
                <h3
                  className={
                    'text-body1 text-size-title3 text-gray-800 inline truncate'
                  }
                >
                  {group.group.name}
                </h3>
              </span>
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
