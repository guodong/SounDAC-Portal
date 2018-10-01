import { faucet, faucetConfig, rightsManagementPortal, sdacApi, websocket, testAccounts } from './private-config';

export const environment = {
  production: true,
  apiUrl: 'https://api.soundac.io/api/',
  blockchainFaucet: faucet,
  blockchainFaucetConfig: faucetConfig,
  rightsManagementPortal: rightsManagementPortal,
  sdacApi: sdacApi,
  websocket: websocket,
  testAccounts: testAccounts
};
