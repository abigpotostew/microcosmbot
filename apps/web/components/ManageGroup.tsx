// @flow
import * as React from 'react'
import { useRouter } from 'next/router'
import { trpc } from 'utils/trpc'
import { Group, ManageGroupCode } from '@microcosms/db'
import { GetGroup } from 'utils/types'

function ManagingActiveGroup({ group }: { group: GetGroup }) {
  const router = useRouter()
  // const [gates, setGates] = React.useState<
  //   {
  //     id: string | null
  //     contractAddress: string
  //     minTokens: number | null
  //     maxTokens: number | null
  //   }[]
  // >(group.group.groupTokenGate)
  return (
    <>
      <h3>{group.group.name}</h3>
      <div className={'min-w-full w-full'}>
        {!group.group.groupTokenGate.length && (
          <div>No token gates for this group.</div>
        )}
        <ul role="list" className="divide-y divide-gray-100">
          {group.group.groupTokenGate.map((tokenGate, index) => {
            return (
              <li
                key={index}
                className="relative flex justify-between gap-x-6 py-5"
              >
                <div className={'flex gap-x-4'}>
                  <div className="min-w-0 flex-auto">
                    <p className="text-sm font-semibold leading-6 text-gray-900">
                      {tokenGate.name}
                    </p>
                    <p className="mt-1 truncate text-xs leading-5 text-gray-500">
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
                    <button
                      onClick={() =>
                        router.push(
                          '/manage-group/' +
                            router.query.code +
                            '/edit/' +
                            tokenGate.id
                        )
                      }
                    >
                      <svg
                        className="h-5 w-5 flex-none text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </li>
            )
          })}
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
      <ManagingActiveGroup group={group.data} />
    </section>
  )
}
