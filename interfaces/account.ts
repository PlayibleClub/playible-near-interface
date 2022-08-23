import type { AccountView } from '@near-wallet-selector/core/node_modules/near-api-js/lib/providers/provider';

export type Account = AccountView & {
  account_id: string;
};
