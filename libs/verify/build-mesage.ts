export const buildMessage = (otp: string) => {
  return {
    title: 'Microcosms Bot Wallet Verification',
    description:
      'This is a signature that verifies ownership of your wallet with microcosmsbot.xyz',
    otp: otp,
  }
}
