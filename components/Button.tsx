// SPDX-License-Identifier: GPL-3.0-or-later

import React, { ButtonHTMLAttributes } from 'react'
import classNames from 'classnames'

type ButtonTypes = 'contained' | 'outlined'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode
  onClick?: any
  loading?: boolean
  classes?: string
  disabled?: boolean
  styling?: ButtonTypes
}

export const PrimaryButton: React.FC<Props> = ({
  children,
  onClick,
  loading,
  classes,
  disabled,
  styling,
  type,
  ...rest
}) => {
  return (
    <button
      onClick={onClick}
      disabled={loading && disabled}
      className={classNames(
        styling == 'outlined' ? 'outlined-btn' : 'primary-btn',
        classes ?? ''
      )}
      {...rest}
    >
      <>
        {loading ? (
          <>
            <svg
              className={classNames(
                'animate-spin -ml-1',
                styling == 'outlined' ? 'h-4 w-4 mr-2' : 'h-5 w-5 mr-3'
              )}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className={classNames(
                  'opacity-25',
                  styling == 'outlined'
                    ? 'dark:stroke-olive-100 stroke-gray-900'
                    : 'dark:stroke-olive-100 stroke-gray-900',
                  type === 'submit'
                    ? styling == 'outlined'
                      ? 'dark:stroke-olive-100 stroke-gray-900'
                      : 'dark:stroke-olive-100 stroke-gray-900'
                    : ''
                )}
                cx="12"
                cy="12"
                r="10"
                strokeWidth="4"
              ></circle>
              <path
                className={classNames(
                  'opacity-75',
                  styling == 'outlined'
                    ? 'dark:fill-olive-100 fill-gray-900'
                    : 'dark:fill-gray-900 fill-olive-100'
                )}
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>{' '}
            Loading
          </>
        ) : (
          children
        )}
      </>
    </button>
  )
}
