export type AccountInfo = {
  id: string;
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

export type User = {
  id: string;
  username: string;
  passwordHash: string;
};
