// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
import { faucet, faucetConfig, rightsManagementPortal, sdacApi, websocket, testAccounts } from './private-config';

export const environment = {
  production: false,
  temporary: false, // Update in firebase first - this is just a fallback if firebase is dead
  apiUrl: 'http://localhost:5000/api/',
  blockchainFaucet: faucet,
  blockchainFaucetConfig: faucetConfig,
  rightsManagementPortal: rightsManagementPortal,
  sdacApi: sdacApi,
  websocket: websocket,
  testAccounts: testAccounts
};
