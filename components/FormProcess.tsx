// SPDX-License-Identifier: GPL-3.0-or-later

import Image from 'next/image'
import { websiteData } from 'constants/index'
import BulletIcon from 'public/icons/bullet-icon.svg'
import CheckIcon from 'public/icons/check-icon.svg'
import PendingIcon from 'public/icons/pending-icon.svg'
import ArrowIcon from 'public/icons/arrow-icon.svg'
import Link from 'next/link'
import { useRecoilState } from 'recoil'
import { transactionState as transactionInitState } from 'state/TransactionsState'
import {
  toasterState as toasterInitState,
  ToasterStateProps,
} from 'state/Toaster'
import { getEtherScanLink, hideString } from 'utils/index'
import CopyIcon from 'public/icons/copy-icon.svg'
import { searchStreams } from 'services/payoutsApi'
import { useEffect, useState } from 'react'

type FormType = {
  closeModal: () => void
}

const FormProcess: React.FC<FormType> = ({ closeModal }) => {
  const [transactionState] = useRecoilState(transactionInitState)
  const [streamAddress, setStreamAddress] = useState(undefined)
  // const { chain } = useNetwork()
  const chain = { name: 'sdfsa' }

  const isProcessing = Object.values(transactionState.steps).some(
    (v) => v.status === 'pending'
  )
  const hash = transactionState.contractTransaction?.hash
  const [toasterState, setToasterState] = useRecoilState(toasterInitState)
  const chainName = chain?.name.toLowerCase()

  const copyRecipient = () => {
    streamAddress && navigator.clipboard.writeText(streamAddress)

    setToasterState((prev: ToasterStateProps) => {
      return {
        ...prev,
        queue: [...prev.queue, 'Copied'],
      }
    })
  }

  useEffect(() => {
    if (!hash) {
      return
    }
    getStreamAddress()
    return () => {
      setStreamAddress(undefined)
    }
  }, [transactionState]) // eslint-disable-line react-hooks/exhaustive-deps

  const getStreamAddress = async () => {
    const query = `{ transactionHash: "${hash}" }`
    const result = await searchStreams(10, 0, query)
    const streams = result?.streams

    if (streams && streams.length > 0) {
      setStreamAddress(streams[0]?.address.toString().toLowerCase())
    }
  }

  const handleClose = () => {
    setStreamAddress(undefined)
    closeModal()
  }

  return (
    <div className="box-border w-full bg-olive-100 flex flex-col items-center pt-10 pb-7 px-4">
      <div className="image-container mb-14 w-150px h-218px">
        <Image
          fill
          className="image flex"
          src={websiteData.heroSection.processImageSrc}
          alt="processing"
          priority
        />
      </div>
      <ul className="flex flex-col gap-3 mb-10">
        {Object.values(transactionState.steps).map((step, i) => (
          <li key={i} className="flex items-center gap-3">
            <div className="flex items-center justify-center mr-2px">
              <BulletIcon className="w-8 h-8" />
              {step.status === 'pending' ? (
                <PendingIcon className="loader-icon absolute w-5 h-5" />
              ) : null}
              {step.status === 'finished' ? (
                <CheckIcon className="absolute w-5 h-5" />
              ) : null}
            </div>
            <p className="text-title5">{step.text}</p>
          </li>
        ))}
      </ul>
      <div className="h-5">
        {isProcessing && !streamAddress ? (
          <>
            {hash ? (
              <Link
                href={getEtherScanLink(hash, chainName, true)}
                className="flex items-center gap-1 underline group"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="text-body4 text-olive-600 group-hover:text-olive-700">
                  View on Etherscan
                </span>
                <ArrowIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            ) : null}
          </>
        ) : (
          <>
            {streamAddress ? (
              <p className="text-body4 font-medium flex items-center">
                <span>Your stream is now deployed on &nbsp;</span>
                <Link
                  href={`/explorer/${streamAddress}`}
                  onClick={handleClose}
                  className="text-olive-600 underline uppercase hover:text-olive-600"
                  rel="noopener noreferrer"
                >
                  {hideString(streamAddress, 4)}
                </Link>
                <button
                  onClick={copyRecipient}
                  className="w-5 h-5 focus:outline-none ml-2"
                >
                  <CopyIcon className="w-full h-full" />
                </button>
              </p>
            ) : null}
          </>
        )}
      </div>
    </div>
  )
}

export default FormProcess
