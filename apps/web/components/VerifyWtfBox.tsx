import {
  CalculatorIcon,
  CalendarDaysIcon,
  CreditCardIcon,
  DocumentIcon,
  HomeIcon,
  LockClosedIcon,
  UserCircleIcon,
  UserGroupIcon,
} from '@heroicons/react/20/solid'
import { GetOtpOutput } from 'utils/types'
import FrameBlock from './FrameBlock'
import { VerifyButtons } from 'components/VerifyButtons'
import { useState } from 'react'
import { useWalletName } from '../client/react/hooks/sg-names'
import { isError } from '@tanstack/react-query'

const StargazeName = ({ address }: { address: string }) => {
  return <span>{address}</span>
  const {
    data: nameOfWallet,
    isLoading,
    isError,
  } = useWalletName(address ?? '')
  console.log('nameOfWallet', nameOfWallet)
  if (isLoading) return <span>Loading...</span>
  if (isError || !nameOfWallet) {
    return <span>{address}</span>
  }
  return <span>{nameOfWallet + '.stars'}</span>
}

const TokenRulesExpand = ({ otp }: { otp: GetOtpOutput }) => {
  const [expanded, setExpanded] = useState(false)
  if (!otp) {
    return null
  }
  return (
    <div
      id="accordion-flush"
      data-accordion="collapse"
      data-active-classes="bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
      data-inactive-classes="text-gray-500 dark:text-gray-400"
    >
      <h2 id="accordion-flush-heading-1">
        <button
          type="button"
          className="flex items-center justify-between w-full py-5 font-medium text-body2 text-left dark:text-gray-400"
          data-accordion-target="#accordion-flush-body-1"
          aria-expanded={expanded}
          aria-controls="accordion-flush-body-1"
          onClick={() => setExpanded((old) => !old)}
        >
          <span>View Access Rules</span>
          <svg
            data-accordion-icon
            className={
              'w-3 h-3 shrink-0 ' + (expanded ? 'transform rotate-180' : '')
            }
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5 5 1 1 5"
            />
          </svg>
        </button>
      </h2>
      <div
        id="accordion-flush-body-1"
        className={expanded ? 'border-t border-gray-900/5' : 'hidden'}
        aria-labelledby="accordion-flush-heading-1"
      >
        <div className="py-5 ">
          {otp.group.groupTokenGate.map((rule, id) => {
            return (
              <div
                key={id}
                className="mt-4 flex w-full flex-none gap-x-4 px-6 items-center"
              >
                <dt className="flex-none">
                  <span className="sr-only">Member Info</span>
                  <CalculatorIcon
                    className="h-6 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </dt>
                <dd className=" font-medium leading-6 text-gray-900">
                  <div className={''}>
                    <div>Rule: {rule.name}</div>
                    <div>
                      Minimum tokens: {rule.minTokens}
                      {rule.maxTokens
                        ? `, Maximum tokens: ${rule.maxTokens}`
                        : ''}
                    </div>

                    <div className={'text-body5'}>
                      Collection:{' '}
                      <StargazeName address={rule.contractAddress} />
                    </div>
                  </div>
                </dd>
              </div>
            )
          })}

          {/*<p className="mb-2 text-gray-500 dark:text-gray-400">*/}
          {/*  Flowbite is an open-source library of interactive components built*/}
          {/*  on top of Tailwind CSS including buttons, dropdowns, modals,*/}
          {/*  navbars, and more.*/}
          {/*</p>*/}
          {/*<p className="text-gray-500 dark:text-gray-400">*/}
          {/*  Check out this guide to learn how to{' '}*/}
          {/*  <a*/}
          {/*    href="/docs/getting-started/introduction/"*/}
          {/*    className="text-blue-600 dark:text-blue-500 hover:underline"*/}
          {/*  >*/}
          {/*    get started*/}
          {/*  </a>{' '}*/}
          {/*  and start developing websites even faster with components on top of*/}
          {/*  Tailwind CSS.*/}
          {/*</p>*/}
        </div>
      </div>
    </div>
  )
}

export default function VerifyWtfBox({ otp }: { otp: GetOtpOutput }) {
  if (!otp) return null
  // console.log('otp', otp)

  return (
    <FrameBlock classes="col-span-8 lg:col-start-3 lg:row-end-1 text-body4">
      <h2 className="sr-only">Verify Wallet & Prove Ownership</h2>
      <div className="rounded-lg bg-gray-50 bg-olive-200 shadow-sm ring-1 ring-gray-900/5">
        <dl className="flex flex-wrap">
          <div className="flex-auto pl-6 pt-6">
            {/*<dt className="text-sm font-semibold leading-6 text-gray-900 text-body4">*/}
            {/*  WTF*/}
            {/*</dt>*/}
            {/*<dd className="mt-1 text-base font-semibold leading-6 text-gray-900">*/}
            {/*  $10,560.00*/}
            {/*</dd>*/}
            <VerifyButtons />
          </div>
          {/*<div className="flex-none self-end px-6 pt-4">*/}
          {/*  <dt className="sr-only">Member Count</dt>*/}
          {/*  <dd className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">*/}
          {/*    Paid*/}
          {/*  </dd>*/}
          {/*</div>*/}
          <div className="mt-6 flex w-full flex-none gap-x-4 border-t border-gray-900/5 px-6 pt-6">
            <dt className="flex-none">
              <span className="sr-only">Member Info</span>
              <HomeIcon className="h-6 w-5 text-gray-400" aria-hidden="true" />
            </dt>
            <dd className="text-lg font-medium leading-6 text-gray-900">
              {otp.group.name}
            </dd>
          </div>
          <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
            <dt className="flex-none">
              <span className="sr-only">Member Info</span>
              <UserGroupIcon
                className="h-6 w-5 text-gray-400"
                aria-hidden="true"
              />
            </dt>
            <dd className="text-sm font-medium leading-6 text-gray-900">
              {otp.membersCount} members
            </dd>
          </div>
          <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
            <dt className="flex-none">
              <span className="sr-only">Member Info</span>
              <LockClosedIcon
                className="h-6 w-5 text-gray-400"
                aria-hidden="true"
              />
            </dt>
            <dd className="text-sm font-medium leading-6 text-gray-900">
              {otp.adminsCount} admins
            </dd>
          </div>
          <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
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
                  otp.group.createdAt.getFullYear() +
                  '-' +
                  otp.group.createdAt.getMonth() +
                  '-' +
                  otp.group.createdAt.getDate()
                }
              >
                created {otp.group.createdAt.toLocaleDateString()}
              </time>
            </dd>
          </div>
          {/*<div className="mt-4 flex w-full flex-none gap-x-4 px-6">*/}
          {/*  <dt className="flex-none">*/}
          {/*    <span className="sr-only">Status</span>*/}
          {/*    <CreditCardIcon*/}
          {/*      className="h-6 w-5 text-gray-400"*/}
          {/*      aria-hidden="true"*/}
          {/*    />*/}
          {/*  </dt>*/}
          {/*  <dd className="text-sm leading-6 text-gray-500">*/}
          {/*    Paid with MasterCard*/}
          {/*  </dd>*/}
          {/*</div>*/}
        </dl>
        <div className="mt-6 border-t border-gray-900/5 px-6 py-3">
          {/*<a href="#" className="text-sm font-semibold leading-6 text-gray-900">*/}
          {/*  View access rules <span aria-hidden="true">&rarr;</span>*/}
          {/*</a>*/}
          <TokenRulesExpand otp={otp} />
        </div>
      </div>
    </FrameBlock>
  )
}
