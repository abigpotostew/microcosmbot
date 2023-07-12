import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';

export default async function getCosmWasmClient(rpc: string) {
  if (!rpc) {
    throw new Error('No RPC provided to connect CosmWasmClient.');
  }
  return await CosmWasmClient.connect(rpc);
}
