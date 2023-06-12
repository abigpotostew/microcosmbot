// SPDX-License-Identifier: GPL-3.0-or-later

import Image from 'next/image'
import { tokenAddresses, websiteData } from 'constants/index'
import { useState } from 'react'
import { useRecoilState } from 'recoil'
import { useAccount, useContract, useNetwork, useSigner } from 'wagmi'
import {
  toasterState as toasterInitState,
  ToasterStateProps,
} from 'state/Toaster'
import { modalState as modalInitState } from 'state/Modal'
import { useModal } from 'connectkit'
import { useForm } from 'react-hook-form'
import { Input, PrimaryButton } from '@nouns-stream/ui'
import { serializeError } from 'eth-rpc-errors'
import { BigNumber, ethers } from 'ethers'
import { ERC20__factory } from '@daokitchen/nouns-stream-sdk'
import { DepositBlockProps, DepositForm } from 'libs/types'

const DepositBlock: React.FC<DepositBlockProps> = ({
  address,
  token,
  onSubmitCb,
}) => {
  const { chain } = useNetwork()
  const [loading, setLoading] = useState(false)
  const [toasterState, setToasterState] = useRecoilState(toasterInitState)
  const [modalState, setModalState] = useRecoilState(modalInitState)
  const { isDisconnected: walletIsDisconnected } = useAccount()
  const { setOpen: setOpenConnectkitModal } = useModal()

  const { data: signer } = useSigner({
    chainId: chain?.id,
  })

  const erc20 = useContract({
    address: token?.address,
    abi: ERC20__factory.abi,
    signerOrProvider: signer,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    reset,
  } = useForm<DepositForm>()

  const showSuccessMsg = () => {
    setToasterState((prev: ToasterStateProps) => {
      return {
        ...prev,
        queue: [...prev.queue, 'Funds successfully added'],
      }
    })
  }

  const resetDepositBlock = () => {
    reset()
    setLoading(false)

    setModalState((prev) => {
      return {
        ...prev,
        isModalOpen: false,
        modalChildren: null,
      }
    })
  }

  const onSubmit = async (data: DepositForm) => {
    if (walletIsDisconnected) {
      setOpenConnectkitModal(true)

      return
    }

    const allFieldsValid = await trigger()

    if (!allFieldsValid) {
      return
    }

    setLoading(true)
    try {
      if (
        token.address?.toLowerCase() ===
        tokenAddresses.default.ETH.toLowerCase()
      ) {
        const gas = await signer?.getFeeData()
        const tx = await signer?.sendTransaction({
          to: address,
          value: ethers.utils.parseEther(data.amount),
          gasLimit: 3100000,
        })
        await tx?.wait()
        onSubmitCb && (await onSubmitCb())
        resetDepositBlock()
        showSuccessMsg()
      } else {
        const decimal = (await erc20?.decimals()) as number
        const tx = await erc20?.transfer(
          address,
          BigNumber.from(data.amount).mul(10 ** decimal)
        )
        await tx?.wait()
        onSubmitCb && (await onSubmitCb())
        resetDepositBlock()
        showSuccessMsg()
      }
    } catch (err) {
      const serializedError = serializeError(err)
      console.error('Error:', serializedError)
      onSubmitCb && (await onSubmitCb())
    }
  }

  return (
    <div className="box-border w-full bg-olive-100 flex flex-col items-center pt-10 pb-7 px-4">
      <div className="image-container mb-8 w-150px h-218px">
        <Image
          fill
          className="image flex"
          src={websiteData.heroSection.processImageSrc}
          alt="processing"
          priority
        />
      </div>
      <p className="text-body2 mb-6">Please add the amount</p>
      <form
        className="flex flex-col gap-5 w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          placeholder="Amount"
          inputMode="numeric"
          error={errors?.amount?.message}
          endAdornment={
            token.logoUri && token.symbol ? (
              <div className="absolute flex items-center max-h-8 top-6px right-6px gap-1 rounded-md p-6px pr-2 bg-olive-300 pointer-events-none">
                <div className="flex items-center max-h-8 top-6px right-6px gap-1 rounded-md p-6px pr-2 bg-olive-300 pointer-events-none">
                  <span className="text-body4 uppercase flex items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="w-5 h-5 mr-1 rounded-full"
                      src={token?.logoUri}
                      alt={token.symbol}
                    />
                    <p>{token.symbol}</p>
                  </span>
                </div>
              </div>
            ) : (
              <></>
            )
          }
          {...register('amount', { required: true, min: 0 })}
        />
        <PrimaryButton loading={loading} type="submit" classes="w-full">
          Add Funds
        </PrimaryButton>
      </form>
    </div>
  )
}

export default DepositBlock
