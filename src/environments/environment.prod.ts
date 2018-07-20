import { faucet, faucetConfig, rightsManagementPortal, museConnect } from './private-config';

export const environment = {
  production: true,
  apiUrl: 'https://api.museblockchain.com/api/',
  blockchainFaucet: faucet,
  blockchainFaucetConfig: faucetConfig,
  rightsManagementPortal: rightsManagementPortal,
  museConnect: museConnect
};
