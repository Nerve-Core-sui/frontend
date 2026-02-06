import { SuiJsonRpcClient, getJsonRpcFullnodeUrl } from '@mysten/sui/jsonRpc';

const network = (process.env.NEXT_PUBLIC_NETWORK as 'testnet' | 'mainnet' | 'devnet') || 'testnet';

export const suiClient = new SuiJsonRpcClient({
  network,
  url: process.env.NEXT_PUBLIC_SUI_RPC_URL || getJsonRpcFullnodeUrl(network),
});
