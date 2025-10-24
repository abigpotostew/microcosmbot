// SPDX-License-Identifier: GPL-3.0-or-later

import React, { useState } from 'react'
import { InputHTMLAttributes } from 'react'
import classNames from 'classnames'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  label?: string
  hint?: string
  dropdown?: JSX.Element
  classes?: string
  error?: string
  startAdornment?: JSX.Element
  endAdornment?: JSX.Element
  inputClasses?: string
  resolvedAddress?: string
  isResolvingAddress?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      name,
      label,
      hint,
      dropdown,
      classes,
      error,
      startAdornment,
      endAdornment,
      inputClasses,
      resolvedAddress,
      isResolvingAddress,
      ...rest
    },
    ref: React.Ref<HTMLInputElement>
  ) => {
    const [isHintOpen, setIsHintOpen] = useState(false)

    return (
      <div
        className={`relative flex flex-col box-border w-auto ${classes ?? ''}`}
      >
        {isHintOpen ? (
          <span className="text-body5 flex absolute left-10 bottom-16 bg-olive-200 border border-olive-600 rounded-lx px-3 py-2 z-50">
            {hint}
          </span>
        ) : null}
        <div className="relative">
          <div className="flex absolute bg-olive-100 px-1 -top-3 left-3 items-center gap-6px pointer-events-none">
            {label ? (
              <label htmlFor={name} className="text-label">
                {label}
              </label>
            ) : null}
            {hint ? (
              <button
                className="w-18px h-18px pointer-events-auto focus:outline-none lg:hidden"
                type="button"
                onClick={() => setIsHintOpen(!isHintOpen)}
                onBlur={() => setIsHintOpen(false)}
              >
                <svg
                  className="w-full h-full pointer-events-none"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12.8799 1.38745L12.8799 3.31701L16.7199 3.3075V7.14746H18.6399V12.9075H16.7199V16.7475H12.8799V18.6674H7.11993V16.7475H3.27997L3.27992 12.9075H1.35992V7.14746L3.27997 7.1475V3.3075L7.11993 3.30745L7.11997 3.32186L7.13439 3.30745H7.11993V1.38745H12.8799ZM10.8334 9.16683V14.1668H9.16669V9.16683H10.8334ZM10.5942 7.26017C10.4342 7.42017 10.2361 7.50017 10 7.50017C9.76447 7.50072 9.56669 7.421 9.40669 7.261C9.24669 7.101 9.16669 6.90294 9.16669 6.66683C9.16613 6.43128 9.24586 6.2335 9.40586 6.0735C9.56586 5.9135 9.76391 5.8335 10 5.8335C10.2356 5.83294 10.4334 5.91267 10.5934 6.07267C10.7534 6.23267 10.8334 6.43072 10.8334 6.66683C10.8339 6.90239 10.7542 7.10017 10.5942 7.26017Z"
                    fill="#212529"
                  />
                </svg>
              </button>
            ) : null}
          </div>
          <input
            ref={ref}
            id={name}
            name={name}
            className={classNames(
              'input-component',
              error
                ? 'border-red'
                : 'border-gray-900 hover:border-olive-600 focus:border-olive-600 disabled:border-olive-300 disabled:hover:border-olive-300',
              inputClasses ?? ''
            )}
            {...rest}
          />
          <div className="flex absolute bg-olive-100 px-1 -bottom-6px left-3 items-center gap-6px pointer-events-none">
            {error && !isResolvingAddress ? <span className="text-error">{error}</span> : null}
            {isResolvingAddress ? <span className="font-sans text-xxs leading-4 text-orange-500">Searching for ENS...</span> : null}
            {resolvedAddress && !isResolvingAddress ? <span className="font-sans text-xxs leading-4 text-green-500">{resolvedAddress}</span> : null}
          </div>
          {dropdown ? (
            <div className="absolute flex max-h-8 top-6px right-6px">
              {dropdown}
            </div>
          ) : null}
          {endAdornment ? endAdornment : null}
        </div>
        {hint ? (
          <p className="hidden text-body5 lg:flex px-4 mt-2">{hint}</p>
        ) : null}
      </div>
    )
  }
)

Input.displayName = 'Input'

interface InputPercentageProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  label?: string
  hint?: string
  dropdown?: JSX.Element
  classes?: string
  error?: string
  adornment?: JSX.Element
  loading: boolean
  value: number
}

// WIP percentage increase/decrease
export const InputPercentage = React.forwardRef<
  HTMLInputElement,
  InputPercentageProps
>(
  (
    {
      name,
      label,
      hint,
      dropdown,
      classes,
      error,
      adornment,
      loading,
      value,
      ...rest
    },
    ref: React.Ref<HTMLInputElement>
  ) => {
    const [isHintOpen, setIsHintOpen] = useState(false)

    const increase = () => {
      if (value) value = Number(value) + 0.05
      console.log(value)
    }
    const decrease = () => {
      if (value) value = Number(value) - 0.05
      console.log(value)
    }
    return (
      <div
        className={`relative flex flex-col box-border w-auto ${classes ?? ''}`}
      >
        {isHintOpen ? (
          <span className="text-body5 flex absolute left-10 bottom-16 bg-olive-200 border border-olive-600 rounded-lx px-3 py-2 z-50">
            {hint}
          </span>
        ) : null}
        <div className="flex absolute bg-olive-100 px-1 -top-3 left-3 items-center gap-6px pointer-events-none">
          {label ? (
            <label htmlFor={name} className="text-label">
              {label}
            </label>
          ) : null}
          {hint ? (
            <button
              className="w-18px h-18px pointer-events-auto focus:outline-none xl:hidden"
              onClick={() => setIsHintOpen(!isHintOpen)}
            >
              <svg
                className="w-full h-full pointer-events-none"
                viewBox="0 0 20 20"
                aria-hidden="true"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12.8799 1.38745L12.8799 3.31701L16.7199 3.3075V7.14746H18.6399V12.9075H16.7199V16.7475H12.8799V18.6674H7.11993V16.7475H3.27997L3.27992 12.9075H1.35992V7.14746L3.27997 7.1475V3.3075L7.11993 3.30745L7.11997 3.32186L7.13439 3.30745H7.11993V1.38745H12.8799ZM10.8334 9.16683V14.1668H9.16669V9.16683H10.8334ZM10.5942 7.26017C10.4342 7.42017 10.2361 7.50017 10 7.50017C9.76447 7.50072 9.56669 7.421 9.40669 7.261C9.24669 7.101 9.16669 6.90294 9.16669 6.66683C9.16613 6.43128 9.24586 6.2335 9.40586 6.0735C9.56586 5.9135 9.76391 5.8335 10 5.8335C10.2356 5.83294 10.4334 5.91267 10.5934 6.07267C10.7534 6.23267 10.8334 6.43072 10.8334 6.66683C10.8339 6.90239 10.7542 7.10017 10.5942 7.26017Z"
                  fill="#212529"
                />
              </svg>
            </button>
          ) : null}
          {error ? <span className="text-error">{error}</span> : null}
        </div>
        <div className="mt-2 flex rounded-md shadow-sm">
          <div className="relative flex flex-grow items-stretch focus-within:z-10">
            {/* <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"> */}
            <button
              type="button"
              className="button-adorn-component rounded-l-md"
              onClick={decrease}
            >
              Down
            </button>{' '}
            {/* </div> */}
            <input
              ref={ref}
              id={name}
              name={name}
              type="number"
              onWheel={(e) => {
                e.preventDefault()
              }}
              value={value}
              className={classNames(
                'input-component',
                'border-r-0',
                'sm:leading-6',
                'focus:outline-none',
                'cursor-not-allowed',
                error
                  ? 'border-red'
                  : 'border-gray-900 hover:border-olive-600 focus:border-olive-600'
              )}
              {...rest}
            />
          </div>
          <button
            type="button"
            className="button-adorn-component border-gray-900 rounded-r-md "
            onClick={increase}
          >
            Up
          </button>
        </div>
        {hint ? (
          <p className="hidden text-body5 xl:flex px-4 mt-2">{hint}</p>
        ) : null}
      </div>
    )
  }
)

InputPercentage.displayName = 'InputPercentage'
