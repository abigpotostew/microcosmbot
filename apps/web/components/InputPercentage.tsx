import { Icon } from "./Icon"
import React, { InputHTMLAttributes, LegacyRef, forwardRef, useState } from "react"
import classNames from "classnames"
import { createNumberMask } from "text-mask-addons"
import MaskedInput from 'react-text-mask'

interface InputPercentageProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  label?: string
  dropdown?: JSX.Element
  classes?: string
  error?: string
  adornment?: JSX.Element
  limit?: number
  step: number
  increase: (step: number) => void
  decrease: (step: number) => void
  tipValue: string
  hint?: string
}

export const InputPercentage = forwardRef<
  HTMLInputElement,
  InputPercentageProps
>(
  (
    {
      name,
      label,
      dropdown,
      classes,
      error,
      adornment,
      value,
      increase,
      decrease,
      limit,
      step,
      tipValue,
      hint,
      ...rest
    },
    ref: React.Ref<HTMLInputElement>
  ) => {
    const [isHintOpen, setIsHintOpen] = useState(false)

    const numberMask = createNumberMask({
      prefix: '',
      suffix: '%',
      allowDecimal: true,
      decimalSymbol: '.',
      integerLimit: 2,
      allowLeadingZeroes: true,
    })

    return (
      <div
        className={`relative flex flex-col box-border w-auto ${classes ?? ''}`}
      >
        {isHintOpen ? (
          <span className="text-body5 flex absolute left-10 bottom-20 bg-olive-200 border border-olive-600 rounded-lx px-3 py-2 z-50">
            {hint}
          </span>
        ) : null}
        <div className="grid w-full grid-cols-2 gap-2">
          <div className="relative inline-flex flex-col col-span-1 gap-1 focus-within:z-10">
            <div className="flex ml-3 px-1 items-center gap-6px pointer-events-none">
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
            <div className="flex items-center">
              <button
                type="button"
                disabled={value === 0}
                onClick={() => decrease(step)}
                className="absolute left-3"
              >
                <Icon
                  icon="minus"
                  classes={classNames(
                    "w-5 h-5 shrink-0",
                    value == 0 ? 'fill-gray-600' : 'fill-gray-900'
                    )}
                  color="inherit"
                />
              </button>
              <MaskedInput
                mask={numberMask}
                ref={ref as LegacyRef<MaskedInput>}
                id={name}
                name={name}
                inputMode="numeric"
                className={classNames(
                  'input-component',
                  'border-gray-900 hover:border-olive-600 focus:border-olive-600 sm:leading-6 text-center'
                )}
                value={value}
                {...rest}
              />
              <button
                type="button"
                disabled={limit !== undefined && value === limit}
                onClick={() => increase(step)}
                className="absolute right-3"
              >
                <Icon
                  icon="plus"
                  classes={classNames(
                    "w-5 h-5 shrink-0",
                    value === limit ? 'fill-gray-600' : 'fill-gray-900'
                    )}
                  color="inherit"
                />
              </button>
            </div>
          </div>
          <div className="flex items-end col-span-1 pl-2 pb-3 whitespace-nowrap">
            <span className="text-label text-olive-600 mr-1">Tip:</span>
            <span className="text-body4">{tipValue}</span>
          </div>
        </div>
        <p className="hidden text-body5 mt-2 px-4 lg:flex">{hint}</p>
      </div>
    )
  }
)

InputPercentage.displayName = 'InputPercentage'