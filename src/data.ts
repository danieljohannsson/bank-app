import { readFileSync } from "fs";
import { XMLParser } from "fast-xml-parser";
import { AccountInfo, Transaction, Camt053Data } from "./types";

const xmlData = readFileSync("camt053.xml", "utf-8");
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
});
const json = parser.parse(xmlData);

const statement = json.Document.BkToCstmrStmt.Stmt;

export const accounts: AccountInfo[] = (
  Array.isArray(statement.Acct) ? statement.Acct : [statement.Acct]
).map((ntry: any) => {
  const clbdBalance = statement.Bal.find(
    (bal: any) => bal.Tp?.CdOrPrtry?.Cd === "CLBD"
  );
  return {
    accountNumber: ntry.Id.Othr.Id,
    currency: ntry.Ccy,
    ownerName: ntry.Ownr.Nm,
    balance: clbdBalance?.CdtLine?.Amt["#text"] ?? "0",
  };
});

export const transactions: Transaction[] = (
  Array.isArray(statement.Ntry) ? statement.Ntry : [statement.Ntry]
).map((ntry: any) => {
  const details = ntry.NtryDtls.TxDtls;
  console.log("details:", details, Array.isArray(details));
  return {
    bookingDate: ntry.BookgDt.Dt,
    amount: ntry.Amt["#text"],
    currency: ntry.Amt["@_Ccy"],
    remittanceInfo: Array.isArray(details)
      ? details
          .map((dtls: any) => {
            const strd = dtls.RmtInf?.Strd;
            if (strd) {
              const rmtdAmt = strd.RfrdDocAmt?.RmtdAmt;
              const cdtrRef = strd.CdtrRefInf?.Ref;
              const cd = strd.RfrdDocInf?.Tp?.CdOrPrtry?.Cd;
              const nbr = strd.RfrdDocInf?.Nb;
              let referredDocInfo = "";
              if (cd || nbr) {
                referredDocInfo = `RefDocInfo: ${cd} ${nbr}`;
              }
              return `Amount: ${rmtdAmt?.["#text"] ?? "N/A"} ${
                rmtdAmt?.["@_Ccy"] ?? ""
              }, Ref: ${cdtrRef ?? "N/A"} ${referredDocInfo}`;
            }
            return "no-info";
          })
          .join(", ")
      : details.RmtInf?.Strd
      ? `Amount: ${
          details.RmtInf.Strd.RfrdDocAmt?.RmtdAmt?.["#text"] ?? "N/A"
        } ${details.RmtInf.Strd.RfrdDocAmt?.RmtdAmt?.["@_Ccy"] ?? ""}, Ref: ${
          details.RmtInf.Strd.CdtrRefInf?.Ref ?? "N/A"
        }`
      : "no-info",
    uniqueId: ntry.AcctSvcrRef ?? "no-id",
  };
});

export const camtData: Camt053Data = {
  accounts,
  transactions,
};

console.log(JSON.stringify(camtData, null, 2));
console.log(statement.Ntry[0].NtryDtls.TxDtls[0].RmtInf.Strd);
