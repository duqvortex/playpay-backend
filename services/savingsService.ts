export type FundType = 'respawn' | 'boss';

export interface Fund {
  id: string;
  name: string;
  type: string;
  balance: number;
  createdAt: number;
  unlockDate?: number;
  adminOnlyWithdraw?: boolean;

  dailyRate?: number; // % ao dia (ex: 0.02 = 2%)
  lastDepositDate?: number;
}


const STORAGE_KEY = 'goldenFunds';

export const getFunds = (): Fund[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveFunds = (funds: Fund[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(funds));
};

export const createFund = (name: string, type: FundType) => {
  const funds = getFunds();

  const newFund: Fund = {
    id: crypto.randomUUID(),
    name,
    type,
    balance: 0,
    createdAt: Date.now(),

    // boss só libera depois de 1 ano
    unlockDate:
      type === 'boss'
        ? Date.now() + 1000 * 60 * 60 * 24 * 365
        : undefined,

    // 🔒 regra do saque
    adminOnlyWithdraw: type === 'boss',
  };

  funds.push(newFund);
  saveFunds(funds);
};
