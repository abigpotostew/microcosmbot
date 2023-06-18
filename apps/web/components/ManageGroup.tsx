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

function ManagingActiveGroup({
  group,
  onSave,
}: {
  group: GetGroup
  onSave: () => Promise<void>
}) {
  const router = useRouter()

  const [modalState, setModalState] = useRecoilState(modalInitState)

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
              {/*<DepositBlock*/}
              {/*  address={address}*/}
              {/*  token={token as any}*/}
              {/*  onSubmitCb={updateBalance}*/}
              {/*/>*/}
            </FrameBlock>
          ),
        }
      })
    },
    [setModalState, group, onSave]
  )
  return (
    <>
      <h3 className={'text-body1'}>{group.group.name}</h3>
      <h4 className={'text-body1 text-sm'}>
        Create one or more Access Rules to gate your group.
      </h4>

      <div className={'min-w-full w-full'}>
        {!group.group.groupTokenGate.length && (
          <div className={'pt-3 text-body1 text-sm text-gray-600'}>
            No token gates for this group.
          </div>
        )}
        <ul role="list" className="divide-y divide-gray-100">
          {group.group.groupTokenGate.map((tokenGate, index) => {
            return (
              <li
                key={index}
                className="relative flex justify-between gap-x-6 py-5"
              >
                <button
                  onClick={
                    () => {
                      openEditModal(tokenGate)
                    }
                    // router.push(
                    //   '/manage-group/' +
                    //     router.query.code +
                    //     '/edit/' +
                    //     tokenGate.id
                    // )
                  }
                >
                  <div className={'flex gap-x-4'}>
                    <div className="min-w-0 flex-auto">
                      <p className="text-left text-body1 text-sm font-semibold leading-6 text-gray-900">
                        {tokenGate.name}
                      </p>
                      <p className="text-body1 mt-1 truncate text-xs leading-5 text-gray-500">
                        {tokenGate.contractAddress}
                      </p>
                    </div>
                    <div className="flex items-center gap-x-4">
                      {/*<div className="hidden sm:flex sm:flex-col sm:items-end">*/}
                      {/*  <button*/}
                      {/*    type="button"*/}
                      {/*    className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"*/}
                      {/*  >*/}
                      {/*    Button Edit*/}
                      {/*  </button>*/}
                      {/*</div>*/}

                      <svg
                        className="h-5 w-5 flex-none text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </button>
              </li>
            )
          })}
          <li className="relative flex justify-between gap-x-6 py-5">
            <button
              onClick={() => {
                openEditModal(undefined)
              }}
            >
              <div className={'flex gap-x-4'}>
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-body1 text-gray-900 ">
                    Add new access rule
                  </p>
                </div>
                <div className="flex items-center gap-x-4">
                  <svg
                    className="h-5 w-5 flex-none text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>{' '}
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
    { enabled: !!router.query.code }
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
