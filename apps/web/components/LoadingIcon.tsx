// SPDX-License-Identifier: GPL-3.0-or-later

import classNames from 'classnames'

interface LoadingIconProps {
  containerClassNames?: string
  bulletClassNames?: string
  pendingClassNames?: string
  bgClassNames?: string
}

export const LoadingIcon: React.FC<LoadingIconProps> = ({
  containerClassNames,
  bulletClassNames,
  pendingClassNames,
  bgClassNames,
}) => (
  <div
    className={classNames(
      'flex items-center justify-center overflow-hidden',
      containerClassNames ?? ''
    )}
  >
    <svg
      className={classNames(bulletClassNames ?? 'w-8 h-8')}
      viewBox="0 0 32 32"
    >
      <rect
        x="6"
        y="6"
        width="20"
        height="20"
        className={classNames(bgClassNames ?? "fill-none")}
      />
      <rect
        y="6"
        width="2"
        height="20"
        className="fill-gray-900 dark:fill-gray-200"
      />
      <rect
        x="2"
        y="6"
        width="4"
        height="20"
        className={classNames(bgClassNames ?? "fill-none")}
      />
      <rect
        x="6"
        width="20"
        height="2"
        className="fill-gray-900 dark:fill-gray-200"
      />
      <rect
        x="4"
        y="4"
        width="24"
        height="2"
        className={classNames(bgClassNames ?? "fill-none")}
      />
      <rect
        x="6"
        y="2"
        width="20"
        height="2"
        className={classNames(bgClassNames ?? "fill-none")}
      />
      <rect
        x="26"
        y="2"
        width="2"
        height="2"
        className="fill-gray-900 dark:fill-gray-200"
      />
      <rect
        x="28"
        y="4"
        width="2"
        height="2"
        className="fill-gray-900 dark:fill-gray-200"
      />
      <rect
        x="28"
        y="24"
        width="2"
        height="2"
        className="fill-gray-900 dark:fill-gray-200"
      />
      <rect
        x="26"
        y="26"
        width="2"
        height="2"
        className="fill-gray-900 dark:fill-gray-200"
      />
      <rect
        x="24"
        y="28"
        width="2"
        height="2"
        className="fill-gray-900 dark:fill-gray-200"
      />
      <rect
        x="4"
        y="28"
        width="2"
        height="2"
        className="fill-gray-900 dark:fill-gray-200"
      />
      <rect
        width="2"
        height="2"
        transform="matrix(-1 0 0 1 28 28)"
        className="fill-gray-900 dark:fill-gray-200"
      />
      <rect
        x="2"
        y="26"
        width="2"
        height="2"
        className="fill-gray-900 dark:fill-gray-200"
      />
      <rect
        width="2"
        height="2"
        transform="matrix(-1 0 0 1 30 26)"
        className="fill-gray-900 dark:fill-gray-200"
      />
      <rect
        x="4"
        y="2"
        width="2"
        height="2"
        className="fill-gray-900 dark:fill-gray-200"
      />
      <rect
        x="2"
        y="4"
        width="2"
        height="2"
        className="fill-gray-900 dark:fill-gray-200"
      />
      <rect
        x="6"
        y="30"
        width="20"
        height="2"
        className="fill-gray-900 dark:fill-gray-200"
      />
      <rect
        x="6"
        y="28"
        width="20"
        height="2"
        className={classNames(bgClassNames ?? "fill-none")}
      />
      <rect
        x="4"
        y="26"
        width="24"
        height="2"
        className={classNames(bgClassNames ?? "fill-none")}
      />
      <rect
        x="30"
        y="6"
        width="2"
        height="20"
        className="fill-gray-900 dark:fill-gray-200"
      />
      <rect
        x="26"
        y="6"
        width="4"
        height="20"
        className={classNames(bgClassNames ?? "fill-none")}
      />
    </svg>
    <svg
      className={classNames(
        'loader-icon absolute',
        pendingClassNames ?? 'w-5 h-5'
      )}
      fill="none"
      viewBox="0 0 20 20"
    >
      <path
        d="M17 11.5V3H3V17H10"
        className="stroke-gray-900 dark:stroke-gray-200"
        strokeWidth="1.8"
      />
    </svg>
  </div>
)
