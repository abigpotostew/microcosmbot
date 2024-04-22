// @flow
import * as React from 'react'
import { Formik, useFormik } from 'formik'
import { GroupTokenGate, GroupTokenGateRuleTypes } from '@microcosms/db'
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
import { UpdateRule } from 'server/update-schema'

type Props = {
  rule?: GroupTokenGate
  manageGroup: GetRuleOutput
  onSave: () => Promise<void>
}

const positiveInteger = z.string().refine((n) => {
  const int = parseFloat(n)
  return int > 0 && Number.isFinite(int)
}, 'must be a positive number')
// .transform((n) => parseInt(n))
const positiveIntegerOrEmptyString = z.union([
  positiveInteger,
  z.string().length(0),
])

const Schema = z
  .object({
    name: z.string().min(1).max(128),
    contractAddress: zodStarsContractAddress.optional(),
    minTokens: positiveInteger,
    maxTokens: positiveIntegerOrEmptyString,
    tokenFactoryDenom: z.string().optional(),
  })
  .refine((data) => {
    if (data.minTokens && data.maxTokens) {
      return (
        parseInt(data.minTokens.toString()) <
        parseInt(data.maxTokens.toString())
      )
    }
    return true
  }, 'tokens')

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
  const [ruleType, setRuleType] =
    React.useState<GroupTokenGateRuleTypes | null>(rule?.ruleType ?? null)

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
    contractAddress: rule?.contractAddress || undefined,
    // minTokens: (typeof rule?.minTokens !== 'number'
    //   ? 1
    //   : rule.minTokens
    // ).toString(),
    minTokens: rule?.minTokens ? rule.minTokens?.toString() : '',
    maxTokens:
      typeof rule?.maxTokens !== 'number' ? '' : rule?.maxTokens.toString(),
    tokenFactoryDenom: rule?.tokenFactoryDenom || undefined,
  }

  const formik = useFormik({
    initialValues: initalizeValues,
    onSubmit: async (values, { setSubmitting }) => {
      console.log('submitted valued', values)
      try {
        let updates: UpdateRule | null = null
        if (ruleType === 'SG721' || !ruleType) {
          if (!values.contractAddress) {
            throw new Error('Contract address is required')
          }
          updates = {
            ruleType: 'SG721',
            minToken: parseInt(values.minTokens.toString()),
            maxToken: values.maxTokens
              ? parseInt(values.maxTokens.toString())
              : null,
            contractAddress: values.contractAddress,
            name: values.name,
          }
        } else if (ruleType === 'DAO_DAO') {
          if (!values.contractAddress) {
            throw new Error('Contract address is required')
          }
          updates = {
            ruleType: 'DAO_DAO',
            minToken: parseInt(values.minTokens.toString()),
            maxToken: values.maxTokens
              ? parseInt(values.maxTokens.toString())
              : null,
            contractAddress: values.contractAddress,
            name: values.name,
          }
        } else if (ruleType === 'TOKEN_FACTORY') {
          const { tokenFactoryDenom } = values
          if (!tokenFactoryDenom) {
            throw new Error('Token Factory Denom is required')
          }
          updates = {
            ruleType: 'TOKEN_FACTORY',
            minToken: parseInt(values.minTokens.toString()),
            maxToken: values.maxTokens
              ? parseInt(values.maxTokens.toString())
              : null,
            name: values.name,
            tokenFactoryDenom,
          }
        }
        if (!updates) {
          throw new Error('Invalid rule type')
        }
        await saveRule.mutateAsync({
          id: rule?.id,
          code: manageGroup.code,
          updates,
        })
        await invalidate()
        await onSave()
        setSubmitting(false)
        closeModal()
      } catch (e) {
        //error uhhh what
        console.error('Error saving rule', e)
        setSubmitting(false)
      }
    },
    validate: toFormikValidate(Schema),
  })

  const daoDaoInfo = trpc.manageGroup.getDaoDaoInfo.useQuery(
    {
      code: manageGroup.code,
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

  const denomInfo = trpc.manageGroup.getDenomInfo.useQuery(
    {
      code: manageGroup.code,
      denom: formik.values.tokenFactoryDenom as string,
    },
    {
      enabled:
        ruleType === 'TOKEN_FACTORY' && !!formik.values.tokenFactoryDenom,
      refetchOnWindowFocus: false,
    }
  )

  const invalidMinMax =
    (formik.touched.minTokens || formik.touched.maxTokens) &&
    formik.values.minTokens &&
    formik.values.maxTokens &&
    parseInt(formik.values.minTokens) >= parseInt(formik.values.maxTokens)

  return (
    <>
      <div className="space-y-10 divide-y divide-gray-900/10">
        <div className="bg-olive-200 grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
          <div className="px-4 pt-4 sm:px-3 sm:py-3">
            <h2 className="text-body1 text-xl font-semibold leading-7 text-gray-900">
              Access Rule
            </h2>
            <p className="mt-1 text-sm leading-6 text-body1 text-gray-600 font-extrabold">
              {rule && 'Configure an access rule'}
              {!rule && 'Create an access rule'}
            </p>
            <p className="mt-1 text-sm leading-6 text-body1 text-gray-600">
              {rule?.ruleType === 'SG721' && 'SG721 NFT Access Rule'}
              {rule?.ruleType === 'TOKEN_FACTORY' &&
                'Token Factory access rules require a token denomination to be configured'}
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

                <div>
                  <PrimaryButton
                    classes="w-full text-body1 text-md text-white p-3 bg-gray-500 tracking-widest"
                    onClick={() => {
                      setRuleType('TOKEN_FACTORY')
                    }}
                  >
                    Native Token
                  </PrimaryButton>
                  <p className={'py-2 text-sm'}>
                    Native Token rules use a token factory denomination to get
                    access. Balance and staked amount are checked.
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
                      </div>
                      <span className={'text-red-400'}>
                        {formik.errors.name &&
                          ((formik.submitCount > 0 && !formik.isValid) ||
                            formik.touched.name) &&
                          formik.errors.name}
                      </span>
                    </div>
                  </div>

                  {ruleType === 'TOKEN_FACTORY' && (
                    <div className="sm:col-span-5">
                      <label
                        htmlFor="tokenFactoryDenom"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Token Factory Denomination Name
                      </label>
                      <div className="mt-2">
                        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                          {/*<span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">*/}
                          {/*  http://*/}
                          {/*</span>*/}
                          <input
                            type="text"
                            name="tokenFactoryDenom"
                            id="tokenFactoryDenom"
                            className="block w-full rounded-md border-0 py-1.5 p-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            placeholder="ustars"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.tokenFactoryDenom}
                          />
                        </div>{' '}
                        <span className={'text-red-400'}>
                          {formik.errors.tokenFactoryDenom &&
                            ((formik.submitCount > 0 && !formik.isValid) ||
                              formik.touched.tokenFactoryDenom) &&
                            formik.errors.tokenFactoryDenom}
                        </span>
                        <div className="mt-2 text-sm leading-6 text-gray-600">
                          {!formik.values
                            .tokenFactoryDenom ? null : denomInfo.isLoading ? (
                            <LoadingIcon containerClassNames={''} />
                          ) : !denomInfo.data ? (
                            <>Something went wrong</>
                          ) : (
                            <div>
                              {!!formik.touched.tokenFactoryDenom &&
                                !denomInfo.data.ok && (
                                  <>{'Denomination not found'}</>
                                )}
                              {denomInfo.data.ok && (
                                <div className={'flex'}>
                                  <CheckCircleIcon color={'green'} width={16} />{' '}
                                  <span>
                                    Found denom with exponent of{' '}
                                    {denomInfo.data.exponent}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/*Show contract address for dao dao and nft rules*/}
                  {ruleType !== 'TOKEN_FACTORY' && (
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
                            ((formik.submitCount > 0 && !formik.isValid) ||
                              formik.touched.contractAddress) &&
                            formik.errors.contractAddress}
                        </span>
                        {ruleType === 'DAO_DAO' && (
                          <div className="mt-2 text-sm leading-6 text-gray-600">
                            {ruleType === 'DAO_DAO' && daoDaoInfo.isLoading ? (
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
                                      <CheckCircleIcon
                                        color={'green'}
                                        width={16}
                                      />
                                      <span>
                                        {daoDaoInfo.data.daoDaoInfo.nft.name}
                                      </span>
                                    </div>
                                  )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

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
                        ((formik.submitCount > 0 && !formik.isValid) ||
                          formik.touched.minTokens) &&
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
                        ((formik.submitCount > 0 && !formik.isValid) ||
                          formik.touched.maxTokens) &&
                        formik.errors.maxTokens}
                    </span>
                  </div>
                </div>
              </div>
              <span className={'text-red-400'}>
                {invalidMinMax &&
                  'Minimum tokens must be less than maximum tokens'}
              </span>
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
                  className="rounded-md bg-indigo-600 px-3 py-2 text-md tracking-widest font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 min-w-[100px]"
                  disabled={
                    invalidMinMax ||
                    formik.isSubmitting ||
                    onDeleteRule.isLoading ||
                    (ruleType === 'DAO_DAO' &&
                      (!daoDaoInfo.data?.daoDaoInfo || daoDaoInfo.isLoading)) ||
                    (ruleType === 'TOKEN_FACTORY' &&
                      (typeof denomInfo.data?.exponent !== 'number' ||
                        denomInfo.isLoading))
                  }
                >
                  Sav{formik.isSubmitting ? 'ing...' : 'e'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  )
}
