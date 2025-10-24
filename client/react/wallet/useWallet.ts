import { useContext } from 'react';
import { Wallet } from './WalletContext';

export default function useWallet() {
  const value = useContext(Wallet);
  return value;
}
