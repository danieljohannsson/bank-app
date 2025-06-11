export type AccountInfo = {
  accountNumber: string;
  currency: string;
  ownerName: string;
  balance: string;
};

export type Transaction = {
  bookingDate: string;
  amount: string;
  currency: string;
  remittanceInfo: string;
  uniqueId: string;
};

export type Camt053Data = {
  accounts: AccountInfo[];
  transactions: Transaction[];
};
