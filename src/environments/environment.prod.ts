import { faucet, faucetConfig, rightsManagementPortal, sdacApi } from './private-config';

export const environment = {
  production: true,
  apiUrl: 'https://api.museblockchain.com/api/',
  blockchainFaucet: faucet,
  blockchainFaucetConfig: faucetConfig,
  rightsManagementPortal: rightsManagementPortal,
  sdacApi: sdacApi
};
