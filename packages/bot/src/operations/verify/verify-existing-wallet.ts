import { addAccountToGroup } from '../account/add-account-to-group'
import { LogContext } from '../../utils'
import { getCodeGroupUser, getMemberAccountsAndWallets } from '../member/get-with-code'

import {checkAccessRules} from "../access/access-rules";

//get existing wallets
//check nfts against group access rules
//stop if not allowed
//create invite link if allowed
export const verifyExistingWallet = async ({
  cl,
  userId,
  code,
}: {
  cl: LogContext
  userId: number
  code: string
}) => {
  const walletsPromise = getMemberAccountsAndWallets(userId.toString())
  const pendingCodePromise = getCodeGroupUser(code, userId.toString())
  const [account, pendingCode] = await Promise.all([
    walletsPromise,
    pendingCodePromise,
  ])
  if (!pendingCode) {
    return 'Link expired. Please try the invite link again.'
  }
  if (pendingCode.group?.groupMembers?.length) {
    //they are a member of the group
    return `You're already a member of this group.`
  }
  if (pendingCode.consumed) {
    return 'Link expired. Please try the invite link again.'
  } else if (pendingCode.expiresAt < new Date()) {
    return 'Link expired. Please try the invite link again.'
  }
  const group = pendingCode.group

  if (!account?.wallets?.length) {
    //they are not a member of the group
    return "You don't have any wallets yet. Try connecting a new wallet."
  }
  const wallets = account.wallets
  const fw = await checkAccessRules(cl, group, wallets)
  if (!fw) {
    return 'None of your existing wallets are allowed to join this group. Did you connect a wallet that is allowed to join the group?'
  }
  cl.log('wallet is authorized to group')
  //add the wallet to the group
  const { inviteLink } = await addAccountToGroup({
    account: account,
    group,
    cl,
  })
  if (inviteLink) {
    return `You have successfully verified your wallet address ${fw.address}. Join the chat with your unique invite link ${inviteLink}`
  } else {
    return `You're already a member of this group.`
  }
}
