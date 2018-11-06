import { faucet, faucetConfig, rightsManagementPortal, sdacApi, websocket, testAccounts } from './private-config';

export const environment = {
  production: true,
  temporary: false, // Update in firebase first - this is just a fallback if firebase is dead
  apiUrl: 'https://api.soundac.io/api/',
  blockchainFaucet: faucet,
  blockchainFaucetConfig: faucetConfig,
  rightsManagementPortal: rightsManagementPortal,
  sdacApi: sdacApi,
  websocket: websocket,
  testAccounts: testAccounts
};
