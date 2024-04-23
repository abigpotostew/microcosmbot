import {
  CalculatorIcon,
  CalendarDaysIcon,
  CreditCardIcon,
  DocumentIcon,
  HomeIcon,
  LockClosedIcon,
  UserCircleIcon,
  UserGroupIcon,
  SparklesIcon,
} from '@heroicons/react/20/solid'
import { GetOtpOutput } from 'utils/types'
import FrameBlock from './FrameBlock'
import { VerifyButtons } from 'components/VerifyButtons'
import { ReactNode, useState } from 'react'
import classNames from 'classnames'
import { PrimaryButton, KeyValue } from '@microcosmbot/ui'
import * as React from 'react'

const StargazeName = ({ address }: { address: string }) => {
  //https://www.stargaze.zone/marketplace/stars19jq6mj84cnt9p7sagjxqf8hxtczwc8wlpuwe4sh62w45aheseues57n420
  return <span>{address}</span>
}

const statuses = {
  Complete: 'text-green-700 bg-green-50 ring-green-600/20',
  'In progress': 'text-gray-600 bg-gray-50 ring-gray-500/10',
  Archived: 'text-yellow-800 bg-yellow-50 ring-yellow-600/20',
}
export const TokenRuleListItem = ({
  rule,
  children,
}: {
  rule: Rule
  children: ReactNode
}) => {
  return (
    <li
      key={rule.id}
      className="flex items-center justify-between gap-x-6 py-5"
    >
      <div className="min-w-0">
        <div className="flex items-start gap-x-3">
          <p className="text-lg font-semibold leading-6 text-gray-900">
            {rule.name}
          </p>
          <p
            className={classNames(
              statuses['Complete'],
              'rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset'
            )}
          >
            Active
          </p>
        </div>
        <div className="mt-1 flex items-center gap-x-2 text-sm leading-5 text-gray-500">
          {rule.ruleType === 'TOKEN_FACTORY' && (
            <>
              <p className="whitespace-nowrap">
                At least {rule.minTokens}
                {" '"}
                {rule.tokenFactoryDenom && rule.tokenFactoryDenom.length > 8
                  ? rule.tokenFactoryDenom.slice(0, 12) +
                    '...' +
                    rule.tokenFactoryDenom.slice(
                      rule.tokenFactoryDenom.length - 9
                    )
                  : rule.tokenFactoryDenom}
                {"' "}
                token
                {(rule.minTokens || 1) > 1 ? 's' : ''}
              </p>
              {!!rule.maxTokens && (
                <>
                  <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                    <circle cx={1} cy={1} r={1} />
                  </svg>
                  <p className="truncate">
                    at most {rule.maxTokens} {rule.tokenFactoryDenom} token
                    {rule.maxTokens > 1 ? 's' : ''}
                  </p>
                </>
              )}
            </>
          )}
          {rule.ruleType !== 'TOKEN_FACTORY' && (
            <>
              <p className="whitespace-nowrap">
                At least {rule.minTokens} token
                {(rule.minTokens || 1) > 1 ? 's' : ''}
                {rule.ruleType === 'DAO_DAO' ? ' staked in DAO' : ''}
              </p>
              {!!rule.maxTokens && (
                <>
                  <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                    <circle cx={1} cy={1} r={1} />
                  </svg>
                  <p className="truncate">
                    at most {rule.maxTokens} token
                    {rule.maxTokens > 1 ? 's' : ''}
                    {rule.ruleType === 'DAO_DAO' ? ' staked in DAO' : ''}
                  </p>
                </>
              )}
            </>
          )}
        </div>
      </div>

      <div className="flex flex-none items-center gap-x-4">{children}</div>
    </li>
  )
}

type Rule = NonNullable<GetOtpOutput>['group']['groupTokenGate'][0]
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
        <div className={'flex flex-row items-center pt-4'}>
          {otp.group.allowMatchAnyRule && (
            <div className="flex flex-row items-center justify-center gap-1 text-sm leading-6">
              <LockClosedIcon
                className="h-6 w-5 text-gray-400"
                aria-hidden="true"
              />

              <label htmlFor="matchAny" className="font-medium text-gray-900">
                Match any rule
              </label>
              <span id="matchAny" className="text-gray-500">
                {' '}
                Gain access when any rule matches
              </span>
            </div>
          )}
          {!otp.group.allowMatchAnyRule && (
            <div className="flex flex-row items-center justify-center gap-1 text-sm leading-6">
              <LockClosedIcon
                className="h-6 w-5 text-gray-400"
                aria-hidden="true"
              />

              <label htmlFor="matchAny" className="font-medium text-gray-900">
                Match all rules
              </label>
              <span id="matchAny" className="text-gray-500">
                {' '}
                Gain access when all rules match
              </span>
            </div>
          )}
        </div>
        <ul className="pb-5 divide-y divide-gray-100">
          {otp.group.groupTokenGate.map((rule, id) => {
            return (
              <TokenRuleListItem rule={rule}>
                <>
                  {rule.ruleType === 'SG721' && (
                    <a
                      href={`https://www.stargaze.zone/marketplace/${rule.contractAddress}`}
                      target={'_blank'}
                      rel="noreferrer"
                    >
                      <PrimaryButton classes="w-full text-body1 text-sm text-white p-3 bg-gray-500">
                        View collection
                      </PrimaryButton>
                    </a>
                  )}
                </>
              </TokenRuleListItem>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default function VerifyWtfBox({ otp }: { otp: GetOtpOutput }) {
  if (!otp) return null

  return (
    <FrameBlock classes="col-span-8 lg:col-start-3 lg:row-end-1 text-body4">
      <h2 className="sr-only">Verify Wallet & Prove Ownership</h2>
      <div className="rounded-lg bg-gray-50 bg-olive-200 shadow-sm ring-1 ring-gray-900/5">
        <dl className="flex flex-wrap">
          <div className="flex-auto pl-6 pt-6">
            <VerifyButtons />
          </div>
          <div className="mt-6 flex w-full flex-none gap-x-4 border-t border-gray-900/5 px-6 pt-6">
            <dt className="flex-none">
              <span className="sr-only">Member Info</span>
              <HomeIcon className="h-6 w-5 text-gray-400" aria-hidden="true" />
            </dt>
            <dd className="text-lg font-medium leading-6 text-gray-900">
              {otp.group.name}
            </dd>
          </div>
          <div className="mt-6 flex w-full flex-none gap-x-4  px-6">
            <dt className="flex-none">
              <span className="sr-only">Chain Name</span>
              <SparklesIcon
                className="h-6 w-5 text-gray-400"
                aria-hidden="true"
              />
            </dt>
            <dd className="text-sm font-medium leading-6 text-gray-900">
              {otp.chain.chainName}
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
          <KeyValue
            className={'mt-4'}
            labelTextScreenReader={'Member Info'}
            label={
              <LockClosedIcon
                className="h-6 w-5 text-gray-400"
                aria-hidden="true"
              />
            }
          >
            {otp.adminsCount} admins
          </KeyValue>
          {/*<div className="mt-4 flex w-full flex-none gap-x-4 px-6">*/}
          {/*  <dt className="flex-none">*/}
          {/*    <span className="sr-only">Member Info</span>*/}
          {/*    <LockClosedIcon*/}
          {/*      className="h-6 w-5 text-gray-400"*/}
          {/*      aria-hidden="true"*/}
          {/*    />*/}
          {/*  </dt>*/}
          {/*  <dd className="text-sm font-medium leading-6 text-gray-900">*/}
          {/*    {otp.adminsCount} admins*/}
          {/*  </dd>*/}
          {/*</div>*/}
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
        </dl>
        <div className="mt-6 border-t border-gray-900/5 px-6 py-3">
          <TokenRulesExpand otp={otp} />
        </div>
      </div>
    </FrameBlock>
  )
}
