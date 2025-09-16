import { readFileSync, stat } from "fs";
import { XMLParser } from "fast-xml-parser";
import { AccountInfo, Transaction } from "./types";

const xmlData = readFileSync("camt053.xml", "utf-8");
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
});
const json = parser.parse(xmlData);

const statement = json.Document.BkToCstmrStmt.Stmt;

export const accounts: AccountInfo[] = (
  Array.isArray(statement.Acct) ? statement.Acct : [statement.Acct]
).map((acct: any) => {
  const clbdBalance = statement.Bal.find(
    (bal: any) => bal.Tp?.CdOrPrtry?.Cd === "CLBD"
  );
  return {
    id: String(acct.Id.Othr.Id),
    currency: acct.Ccy,
    ownerName: acct.Ownr.Nm,
    balance: String(clbdBalance?.CdtLine?.Amt["#text"]) ?? "0",
  };
});

export const transactions: Transaction[] = Array.isArray(statement)
  ? statement.flatMap((stmt: any) =>
      (Array.isArray(stmt.Ntry) ? stmt.Ntry : [stmt.Ntry]).map((ntry: any) => {
        const details = ntry.NtryDtls.TxDtls;
        return {
          bookingDate: ntry.BookgDt.Dt,
          amount: ntry.Amt["#text"],
          currency: ntry.Amt["@_Ccy"],
          remittanceInfo: Array.isArray(details)
            ? details.map((dtls: any) => {
                const strd = dtls.RmtInf?.Strd;
                if (strd) {
                  const rmtdAmt = strd.RfrdDocAmt?.RmtdAmt;
                  const cdtrRef = strd.CdtrRefInf?.Ref;
                  const cd = strd.RfrdDocInf?.Tp?.CdOrPrtry?.Cd;
                  const nbr = strd.RfrdDocInf?.Nb;
                  return {
                    amount: rmtdAmt?.["#text"] ?? null,
                    currency: rmtdAmt?.["@_Ccy"] ?? null,
                    creditorReference: cdtrRef ?? null,
                    referredDocInfo: {
                      code: cd ?? null,
                      number: nbr ?? null,
                    },
                  };
                }
                return { info: "no-info" };
              })
            : details.RmtInf?.Strd
            ? {
                amount:
                  details.RmtInf.Strd.RfrdDocAmt?.RmtdAmt?.["#text"] ?? null,
                currency:
                  details.RmtInf.Strd.RfrdDocAmt?.RmtdAmt?.["@_Ccy"] ?? null,
                creditorReference: details.RmtInf.Strd.CdtrRefInf?.Ref ?? null,
                referredDocInfo: {
                  code:
                    details.RmtInf.Strd.RfrdDocInf?.Tp?.CdOrPrtry?.Cd ?? null,
                  number: details.RmtInf.Strd.RfrdDocInf?.Nb ?? null,
                },
              }
            : details.RmtInf?.Ustrd
            ? {
                unstructured: details.RmtInf?.Ustrd,
              }
            : { info: "no-info" },
        };
      })
    )
  : (Array.isArray(statement.Ntry) ? statement.Ntry : [statement.Ntry]).map(
      (ntry: any) => {
        const details = ntry.NtryDtls.TxDtls;
        return {
          bookingDate: ntry.BookgDt.Dt,
          amount: ntry.Amt["#text"],
          currency: ntry.Amt["@_Ccy"],
          remittanceInfo: Array.isArray(details)
            ? details.map((dtls: any) => {
                const strd = dtls.RmtInf?.Strd;
                if (strd) {
                  const rmtdAmt = strd.RfrdDocAmt?.RmtdAmt;
                  const cdtrRef = strd.CdtrRefInf?.Ref;
                  const cd = strd.RfrdDocInf?.Tp?.CdOrPrtry?.Cd;
                  const nbr = strd.RfrdDocInf?.Nb;
                  return {
                    amount: rmtdAmt?.["#text"] ?? null,
                    currency: rmtdAmt?.["@_Ccy"] ?? null,
                    creditorReference: cdtrRef ?? null,
                    referredDocInfo: {
                      code: cd ?? null,
                      number: nbr ?? null,
                    },
                  };
                }
                return { info: "no-info" };
              })
            : details.RmtInf?.Strd
            ? {
                amount:
                  details.RmtInf.Strd.RfrdDocAmt?.RmtdAmt?.["#text"] ?? null,
                currency:
                  details.RmtInf.Strd.RfrdDocAmt?.RmtdAmt?.["@_Ccy"] ?? null,
                creditorReference: details.RmtInf.Strd.CdtrRefInf?.Ref ?? null,
                referredDocInfo: {
                  code:
                    details.RmtInf.Strd.RfrdDocInf?.Tp?.CdOrPrtry?.Cd ?? null,
                  number: details.RmtInf.Strd.RfrdDocInf?.Nb ?? null,
                },
              }
            : details.RmtInf?.Ustrd
            ? {
                unstructured: details.RmtInf?.Ustrd,
              }
            : { info: "no-info" },
        };
      }
    );
console.log("transactions", JSON.stringify(transactions, null, 2));
console.log(JSON.stringify(accounts, null, 2));
console.log(statement.Ntry[0].NtryDtls.TxDtls[0].RmtInf.Strd);
