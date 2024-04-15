import { z } from 'zod'
import { zodStarsContractAddress } from 'libs/stars'

export const updateRuleSchema = z.discriminatedUnion('ruleType', [
  z.object({
    ruleType: z.literal('TOKEN_FACTORY'),
    name: z.string().max(128),
    minToken: z.number().int().nonnegative().nullish(),
    maxToken: z.number().int().nonnegative().nullish(),
    tokenFactoryDenom: z.string(),
  }),
  z.object({
    ruleType: z.literal('SG721'),
    name: z.string().max(128),
    minToken: z.number().int().nonnegative().nullish(),
    maxToken: z.number().int().nonnegative().nullish(),
    contractAddress: zodStarsContractAddress, //optional for token_factory
  }),
  z.object({
    ruleType: z.literal('DAO_DAO'),
    name: z.string().max(128),
    minToken: z.number().int().nonnegative().nullish(),
    maxToken: z.number().int().nonnegative().nullish(),
    contractAddress: zodStarsContractAddress, //optional for token_factory
  }),
])
export type UpdateRule = z.infer<typeof updateRuleSchema>
