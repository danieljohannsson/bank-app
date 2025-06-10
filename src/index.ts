import express, { Request, Response } from "express";
import { readFileSync } from "fs";
import { XMLParser } from "fast-xml-parser";

const app = express();
const PORT = process.env.PORT || 3000;

type AccountInfo = {
  accountNumber: string;
  currency: string;
  ownerName: string;
  balance: string;
};

type Transaction = {
  bookingDate: string;
  amount: string;
  currency: string;
  remittanceInfo: string;
  uniqueId: string;
};

type Camt053Data = {
  account: AccountInfo;
  transactions: Transaction[];
};

// Read and parse XML
const xmlData = readFileSync("camt053.xml", "utf-8");
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
});
const json = parser.parse(xmlData);

// Navigate to the root (structure may vary slightly)
const statement = json.Document.BkToCstmrStmt.Stmt;

const clbdBalance = statement.Bal.find(
  (bal: any) => bal.Tp?.CdOrPrtry?.Cd === "CLBD"
);

const account: AccountInfo = {
  accountNumber: statement.Acct.Id.Othr.Id,
  currency: statement.Acct.Ccy,
  ownerName: statement.Acct.Ownr.Nm,
  balance: clbdBalance?.CdtLine?.Amt["#text"]
    ? clbdBalance.CdtLine.Amt["#text"]
    : "0",
};

const transactions: Transaction[] = (
  Array.isArray(statement.Ntry) ? statement.Ntry : [statement.Ntry]
).map((ntry: any) => {
  const details = ntry.NtryDtls.TxDtls;
  return {
    bookingDate: ntry.BookgDt.Dt,
    amount: ntry.Amt["#text"],
    currency: ntry.Amt["@_Ccy"],
    remittanceInfo: details.RmtInf ?? "",
    uniqueId: ntry.AcctSvcrRef ?? "no-id",
  };
});

// Final object
const camtData: Camt053Data = {
  account,
  transactions,
};

console.log(JSON.stringify(camtData, null, 2));

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from TypeScript + Express!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
