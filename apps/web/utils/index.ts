import {
  GOERLI_ETHERSCAN_BASE_URL,
  MAINNET_ETHERSCAN_BASE_URL,
  SEPOLIA_ETHERSCAN_BASE_URL
} from "constants/index";

export function hideString(str: string, charsToShow: number) {
  const shortStrStart = str.slice(0, charsToShow)
  const shortStrEnd = str.slice(str.length - charsToShow, str.length)
  const dots = '...'

  return `${shortStrStart}${dots}${shortStrEnd}`
}

export function getKeyByValue(object: Record<string, any>, value: any) {
  return Object.keys(object).find(key => object[key] === value);
}

export function capitalizeFirstLetter(string: string | undefined) {
  if (!string) {
    return
  }
  return string?.charAt(0).toUpperCase() + string.slice(1)
}

export function getFormattedDate(dateData: string | Date | number) {
  if (!dateData) return "---";
  const date = new Date(dateData);

  const year = date.getFullYear();
  const monthNumber = date.getMonth() + 1;
  const day = date.getDate();

  return `${monthNumber}/${day}/${year}`;
}

export const getEtherScanLink = (address: string, chainName: string | undefined, isHash?: boolean) => {
  if (!address || !chainName) {
    return '';
  }

  switch (chainName) {
    case 'sepolia':
      return `${SEPOLIA_ETHERSCAN_BASE_URL}${isHash ? 'tx' : 'address'}/${address}`

    case 'goerli':
      return `${GOERLI_ETHERSCAN_BASE_URL}${isHash ? 'tx' : 'address'}/${address}`

    case 'mainnet':
      return `${MAINNET_ETHERSCAN_BASE_URL}${isHash ? 'tx' : 'address'}/${address}`
  
    default:
      return SEPOLIA_ETHERSCAN_BASE_URL
  }
}