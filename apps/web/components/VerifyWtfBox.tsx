import {
  CalendarDaysIcon,
  CreditCardIcon,
  UserCircleIcon,
} from '@heroicons/react/20/solid'
import { GetOtpOutput } from 'utils/types'
import FrameBlock from './FrameBlock'
import { VerifyButtons } from 'components/VerifyButtons'
import { useState } from 'react'

export default function VerifyWtfBox({ otp }: { otp: GetOtpOutput }) {
  if (!otp) return null
  // console.log('otp', otp)

  return (
    <FrameBlock classes="lg:col-start-3 lg:row-end-1 text-body4">
      <h2 className="sr-only">Summary</h2>
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
              <UserCircleIcon
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
              <UserCircleIcon
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
            <dd className="text-sm leading-6 text-gray-500">
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
        <div className="mt-6 border-t border-gray-900/5 px-6 py-6">
          <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
            Download receipt <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
    </FrameBlock>
  )
}
