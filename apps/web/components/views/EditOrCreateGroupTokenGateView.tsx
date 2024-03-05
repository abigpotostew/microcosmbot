// @flow
import * as React from 'react'
import { Formik, useFormik } from 'formik'
import { GroupTokenGate } from '@microcosms/db'
import { GetRuleOutput } from 'utils/types'
import { toFormikValidate } from 'zod-formik-adapter'
import { z } from 'zod'
import { zodStarsContractAddress } from 'libs/stars'
import { trpc } from 'utils/trpc'
import { useCloseModal } from 'state/hooks'
import { useInvalidateCode } from 'utils/trpc/invalidate'
import { useMutation } from '@tanstack/react-query'
import { PrimaryButton } from '@microcosmbot/ui'
import { LoadingIcon } from '@microcosmbot/ui'
import { ErrorCodes } from '@microcosms/bot/operations/daodao/errors.types'
import { CheckCircleIcon } from '@heroicons/react/20/solid'

type Props = {
  rule?: GroupTokenGate
  manageGroup: GetRuleOutput
  onSave: () => Promise<void>
}

const positiveIntegerOrEmptyString = z.union([
  z
    .string()
    .refine((n) => {
      const int = parseInt(n)
      return int > 0 && Number.isInteger(int)
    }, 'must be an positive integer')
    .transform((n) => parseInt(n)),
  z.string().length(0),
])

const Schema = z
  .object({
    name: z.string().max(128),
    contractAddress: zodStarsContractAddress,
    minTokens: positiveIntegerOrEmptyString,
    maxTokens: positiveIntegerOrEmptyString,
  })
  .refine((data) => {
    if (data.minTokens && data.maxTokens) {
      return (
        parseInt(data.minTokens.toString()) <
        parseInt(data.maxTokens.toString())
      )
    }
    return true
  }, 'refined')

const daodaoErrorMap = (daodaoError?: string) => {
  const errorMap = {
    [ErrorCodes.NOT_NFT_VOTING_MODULE.toString()]:
      'Dao Dao is not configured as an NFT Voting Module',
    [ErrorCodes.VOTING_MODULE_NOT_FOUND.toString()]:
      'Dao Dao is not configured as an NFT Voting Module',
    [ErrorCodes.INVALID_NFT_COLLECTION_INFO.toString()]:
      'The NFT collection is not configured correctly',
    [ErrorCodes.NOT_DAO_DAO_CORE.toString()]:
      'The address is not a Dao Dao contract',
  }
  if (!daodaoError) {
    return 'Unknown error'
  }
  return errorMap[daodaoError] || 'Unknown error'
}

export const EditOrCreateGroupTokenGateView = ({
  rule,
  manageGroup,
  onSave,
}: Props) => {
  const [ruleType, setRuleType] = React.useState<'SG721' | 'DAO_DAO' | null>(
    rule?.ruleType ?? null
  )

  const { closeModalReset: closeModal } = useCloseModal()

  const saveRule = trpc.manageGroup.saveRule.useMutation()
  const deleteRule = trpc.manageGroup.deleteRule.useMutation()
  const onDeleteRule = useMutation(async () => {
    if (!rule) return
    await deleteRule.mutateAsync({ id: rule.id, code: manageGroup.code })
    await invalidate()
    await onSave()
    closeModal()
  })

  const { invalidate } = useInvalidateCode()
  const initalizeValues = {
    name: rule?.name || '',
    contractAddress: rule?.contractAddress || '',
    minTokens:
      typeof rule?.minTokens !== 'number' ? '' : rule.minTokens.toString(),
    maxTokens:
      typeof rule?.maxTokens !== 'number' ? '' : rule?.maxTokens.toString(),
  }

  const formik = useFormik({
    initialValues: initalizeValues,
    onSubmit: async (values, { setSubmitting }) => {
      console.log('submitted valued', values)
      try {
        await saveRule.mutateAsync({
          id: rule?.id,
          code: manageGroup.code,
          updates: {
            ...values,
            minToken: parseInt(values.minTokens.toString()),
            maxToken: values.maxTokens
              ? parseInt(values.maxTokens.toString())
              : null,
            ruleType: ruleType ?? undefined,
          },
        })
      } catch (e) {
        //error uhhh what
      }
      await invalidate()
      await onSave()
      setSubmitting(false)
      closeModal()
    },
    validate: toFormikValidate(Schema),
  })

  const daoDaoInfo = trpc.manageGroup.getDaoDaoInfo.useQuery(
    {
      contractAddress: formik.values.contractAddress as string,
    },
    {
      enabled:
        ruleType === 'DAO_DAO' &&
        !!formik.values.contractAddress &&
        !!zodStarsContractAddress.safeParse(formik.values.contractAddress)
          .success,
      refetchOnWindowFocus: false,
    }
  )
  const loading = daoDaoInfo.isLoading

  return (
    <>
      <div className="space-y-10 divide-y divide-gray-900/10">
        <div className="bg-olive-200 grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
          <div className="px-4 pt-4 sm:px-3 sm:py-3">
            <h2 className="text-body1 text-xl font-semibold leading-7 text-gray-900">
              Access Rule
            </h2>
            <p className="mt-1 text-sm leading-6 text-body1 text-gray-600">
              {rule && 'Configure an access rule'}
              {!rule && 'Create an access rule'}
            </p>
          </div>
          {!ruleType && (
            <div className="text-body1 bg-olive-100 shadow-sm md:col-span-2 py-16 px-8">
              <p className={'pb-4'}>Select an access rule type</p>
              <div
                className={'grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-2'}
              >
                <div>
                  <PrimaryButton
                    classes="w-full text-body1 text-md text-white p-3 bg-gray-700 tracking-widest"
                    onClick={() => {
                      setRuleType('SG721')
                    }}
                  >
                    Hodl
                  </PrimaryButton>
                  <p className={'py-2 text-sm'}>
                    Hodl access rules require the user wallet to directly hold
                    the SG721 NFT. This is the default.
                  </p>
                </div>
                <div>
                  <PrimaryButton
                    classes="w-full text-body1 text-md text-white p-3 bg-gray-500 tracking-widest"
                    onClick={() => {
                      setRuleType('DAO_DAO')
                    }}
                  >
                    Staked
                  </PrimaryButton>
                  <p className={'py-2 text-sm'}>
                    Staked rules require SG721 NFTs to be staked via an NFT
                    configured Dao Dao.
                  </p>
                </div>
              </div>
            </div>
          )}
          {!!ruleType && (
            <form
              onSubmit={formik.handleSubmit}
              className="text-body1 bg-olive-100 shadow-sm md:col-span-2"
            >
              <div className="px-4 py-6 sm:p-8">
                <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-5">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Name
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        {/*<span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">*/}
                        {/*  http://*/}
                        {/*</span>*/}
                        <input
                          type="text"
                          name="name"
                          id="name"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.name}
                          className="block w-full rounded-md border-0 py-1.5 p-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          placeholder="Rule name"
                        />
                        <span className={'text-red-400'}>
                          {formik.errors.name &&
                            formik.touched.name &&
                            formik.errors.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-5">
                    <label
                      htmlFor="contractAddress"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      {ruleType === 'DAO_DAO'
                        ? 'Dao Dao Contract Address'
                        : 'NFT Contract Address'}
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        {/*<span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">*/}
                        {/*  http://*/}
                        {/*</span>*/}
                        <input
                          type="text"
                          name="contractAddress"
                          id="contractAddress"
                          className="block w-full rounded-md border-0 py-1.5 p-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          placeholder="stars..."
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.contractAddress}
                        />
                      </div>{' '}
                      <span className={'text-red-400'}>
                        {formik.errors.contractAddress &&
                          formik.touched.contractAddress &&
                          formik.errors.contractAddress}
                      </span>
                      <div className="mt-2 text-sm leading-6 text-gray-600">
                        {ruleType === 'DAO_DAO' && loading ? (
                          <LoadingIcon containerClassNames={' '} />
                        ) : !daoDaoInfo.data ? (
                          <>Something went wrong</>
                        ) : (
                          <div>
                            {(!daoDaoInfo.data.ok ||
                              !!daoDaoInfo.data.error) && (
                              <>{daodaoErrorMap(daoDaoInfo.data?.error)}</>
                            )}
                            {daoDaoInfo.data.ok &&
                              !!daoDaoInfo.data.daoDaoInfo && (
                                <div className={'flex'}>
                                  <CheckCircleIcon color={'green'} width={16} />
                                  <span>
                                    {daoDaoInfo.data.daoDaoInfo.nft.name}
                                  </span>
                                </div>
                              )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label
                      htmlFor="minTokens"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Minimum Tokens
                    </label>
                    <div className="mt-2">
                      <input
                        // type="number"
                        min={1}
                        name="minTokens"
                        id="minTokens"
                        autoComplete="minTokens"
                        className="block w-full rounded-md border-0 py-1.5 p-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="1"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.minTokens || ''}
                      />
                    </div>
                    <span className={'text-red-400'}>
                      {formik.errors.minTokens &&
                        formik.touched.minTokens &&
                        formik.errors.minTokens}
                    </span>
                  </div>
                  <div className="sm:col-span-4">
                    <label
                      htmlFor="maxTokens"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Maximum Tokens (optional)
                    </label>
                    <div className="mt-2">
                      <input
                        // type="number"
                        name="maxTokens"
                        id="maxTokens"
                        autoComplete="maxTokens"
                        className="block w-full rounded-md border-0 py-1.5 p-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.maxTokens || ''}
                      />
                    </div>
                    <span className={'text-red-400'}>
                      {formik.errors.maxTokens &&
                        formik.touched.maxTokens &&
                        formik.errors.maxTokens}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
                {rule && (
                  <button
                    className="rounded-md bg-red-600 px-3 py-2 text-sm tracking-wide font-semibold text-gray-900 shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    disabled={formik.isSubmitting || onDeleteRule.isLoading}
                    onClick={(e) => {
                      e.preventDefault()
                      onDeleteRule.mutate()
                    }}
                  >
                    Delete
                  </button>
                )}
                <button
                  type="button"
                  className="text-md tracking-widest font-semibold leading-6 text-gray-900"
                  disabled={formik.isSubmitting || onDeleteRule.isLoading}
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-indigo-600 px-3 py-2 text-md tracking-widest font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  disabled={
                    formik.isSubmitting ||
                    onDeleteRule.isLoading ||
                    (ruleType === 'DAO_DAO' &&
                      (!daoDaoInfo.data?.daoDaoInfo || daoDaoInfo.isLoading))
                  }
                >
                  Save
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  )
}
