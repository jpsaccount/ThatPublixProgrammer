import { useAuth } from "@/customHooks/auth";
import { ExpenseLineItem } from "@/sdk/childEntities/ExpenseLineItem";
import { ContentQuality, ContentType } from "@/sdk/contracts/Entity";
import { Expense } from "@/sdk/entities/billing/Expense";
import { ExpenseReport } from "@/sdk/entities/billing/ExpenseReport";
import { GlobalExpenseReport } from "@/sdk/entities/billing/GlobalExpenseReport";
import { TaxCategory } from "@/sdk/entities/billing/TaxCategory";
import { User } from "@/sdk/entities/core/User";
import { getEntityService } from "@/sdk/services/getEntityService";
import { groupBy, tryGetSum } from "@/sdk/utils/arrayUtils";
import { getFullName } from "@/sdk/utils/entityUtils/userUtils";
import { toUsdString } from "@/sdk/utils/moneyUtils";
import { range } from "@/utilities/arrayUtilities";
import { Page, View, Text, Document, Font, StyleSheet, Image } from "@react-pdf/renderer";
import process from "process";
import calibri from "@/assets/fonts/CALIBRI.ttf?raw";
import calibrib from "@/assets/fonts/CALIBRIB.ttf?raw";
Font.register({
  family: "Open Sans",
  fonts: [{ src: calibri }, { src: calibrib, fontWeight: 600 }],
});
Font.registerHyphenationCallback((word) => [word]);
interface ExpenseReportPdfProps {
  expenses: Expense[];
  categories: TaxCategory[];
  expenseReport: ExpenseReport;
  globalExpenseReport: GlobalExpenseReport;
  user: User;
  printerUser: User;
  attachments: Map<Expense, ArrayBuffer[]>;
}

const styles = StyleSheet.create({
  text: { paddingHorizontal: "5px", justifyContent: "center" },
  cell: { justifyContent: "center", paddingTop: "3px" },
  header: {
    display: "flex",
    backgroundColor: "aliceblue",
    borderTop: "1px",
    borderBottom: "1px",
    borderColor: "darkblue",
    width: "100%",
    padding: "5px",
    paddingHorizontal: "15px",
    marginVertical: "10px",
    flexDirection: "row",
  },
});

export default function ExpenseReportPdf({
  expenseReport,
  globalExpenseReport,
  user,
  expenses,
  categories,
  attachments,
  printerUser,
}: ExpenseReportPdfProps) {
  const categoriesLineItems = groupBy(
    expenses
      .sort((a, b) => (a.TxnDate.isSame(b.TxnDate) ? 0 : a.TxnDate.isBefore(b.TxnDate) ? -1 : 1))
      .flatMap((x) => x.LineItems),
    "CategoryId",
  );

  let currentExpenseItem = 1;
  const expensesPrinted: ExpenseLineItem[] = [];
  return (
    <Document
      producer="Point of Light Inc."
      creator={getFullName(printerUser.Person)}
      style={{ fontFamily: "Open Sans" }}
    >
      <Page size="LETTER" break>
        <View style={{ display: "flex", flexDirection: "column" }}>
          <View fixed style={styles.header}>
            <View style={{ display: "flex", flexGrow: 1, flexDirection: "column", width: "100%" }}>
              <Text>{globalExpenseReport.Title}</Text>
              <Text style={{ fontSize: "12px" }}>
                {globalExpenseReport.StartDate?.format("MM/DD/YYYY") ??
                  "Unknown" + " - " + (globalExpenseReport.EndDate?.format("MM/DD/YYYY") ?? "Unknown")}
              </Text>
            </View>
            <View style={{ display: "flex", flexGrow: 1, flexDirection: "column", width: "100%" }}>
              <Text style={{ textAlign: "right" }}>{toUsdString(expenseReport.TotalAmountUsd)}</Text>
              <Text style={{ fontSize: "14px", fontWeight: "bold", textAlign: "right" }}>
                {getFullName(user.Person)}
              </Text>
            </View>
          </View>
          <View break={false} wrap={false} style={{ paddingVertical: "5px", paddingHorizontal: "15px" }}>
            <View
              style={{ width: "100%", fontSize: "11px", fontWeight: "semibold", display: "flex", flexDirection: "row" }}
            >
              <Text style={{ width: "4%", textAlign: "center", ...styles.text }}>#</Text>
              <Text style={{ width: "10%", ...styles.text }}>Date</Text>
              <Text style={{ width: "40%", ...styles.text }}>Categories</Text>
              <Text style={{ width: "36%", ...styles.text }}>Description</Text>
              <Text style={{ width: "10%", textAlign: "right", ...styles.text }}>Amount</Text>
            </View>
          </View>
          {Array.from(categoriesLineItems.keys())
            .sort()
            .map((key, index) => (
              <View break={false} wrap={true} style={{ paddingVertical: "5px", marginBottom: "5px" }}>
                <View
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    flexGrow: 1,
                    paddingHorizontal: "15px",
                  }}
                >
                  <Text style={{ fontSize: "11px", fontWeight: "semibold" }}>
                    {categories.find((x) => x.id == key)?.Title}
                  </Text>
                </View>
                {categoriesLineItems.get(key).map((lineItem, index) => {
                  expensesPrinted.push(lineItem);
                  const expense = expenses.find((x) => x.LineItems.includes(lineItem));
                  return (
                    <View
                      style={{
                        paddingHorizontal: "15px",
                        width: "100%",
                        fontSize: "11px",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        backgroundColor: index % 2 ? "white" : "aliceblue",
                        borderTop: index === 0 ? 1 : 0.5,
                        borderBottom: index + 1 === categoriesLineItems.get(key).length ? 1 : 0.5,
                      }}
                    >
                      <View style={{ width: "4%", ...styles.cell }}>
                        <Text style={{ ...styles.text, textAlign: "center" }}>{currentExpenseItem++}</Text>
                      </View>
                      <View style={{ width: "10%", ...styles.cell }}>
                        <Text style={{ ...styles.text }}>{expense.TxnDate.format("MM/DD/YYYY")}</Text>
                      </View>
                      <View style={{ width: "40%", ...styles.cell }}>
                        <Text style={{ ...styles.text }}>
                          {categories.find((i) => i.id === lineItem.CategoryId)?.Title}
                        </Text>
                      </View>
                      <View style={{ width: "36%", ...styles.cell }}>
                        <Text style={{ ...styles.text }}>{lineItem.Description}</Text>
                      </View>
                      <View style={{ width: "10%", ...styles.cell }}>
                        <Text style={{ textAlign: "right", ...styles.text }}>
                          {toUsdString(lineItem.Amount * expense.CurrencyRateToUsd)}
                        </Text>
                      </View>
                    </View>
                  );
                })}

                <Text
                  style={{
                    textAlign: "right",
                    marginLeft: "auto",
                    fontSize: "11px",
                    fontWeight: "semibold",
                    borderTop: ".5px",
                    paddingTop: "2px",
                    paddingRight: "20px",
                    width: "100%",
                  }}
                >
                  {toUsdString(
                    tryGetSum(
                      categoriesLineItems
                        .get(key)
                        .map((x) => x.Amount * expenses.find((i) => i.LineItems.includes(x)).CurrencyRateToUsd),
                    ),
                  )}
                </Text>
              </View>
            ))}
        </View>
        <Text
          style={{ marginTop: "auto", marginBottom: 10, textAlign: "center", fontSize: 11 }}
          render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          fixed
        />
      </Page>

      {expensesPrinted
        .filter((x) => expenses.find((e) => e.LineItems.includes(x)).AttachmentMetadata.HasAttachment)
        .map((lineItem, index) => {
          const x = expenses.find((x) => x.LineItems.includes(lineItem));
          const pageStart = Number.isNaN(x.PrintSetting?.PrintStartPage - 1) ? 0 : x.PrintSetting?.PrintStartPage - 1;
          const pageEnd = Number.isNaN(x.PrintSetting?.PrintEndPage - 1) ? 0 : x.PrintSetting?.PrintEndPage - 1;
          const pagesCount = pageEnd - pageStart > 0 ? pageEnd - pageStart : 1;
          let currentPage = 1;
          return (
            <Page size="LETTER">
              {x.AttachmentMetadata.ContentType !== ContentType.PDF ? (
                <>
                  <Text style={{ textAlign: "center", marginVertical: "auto", ...styles.header, paddingTop: 10 }}>
                    Line Item: {index + 1}
                  </Text>

                  <Image
                    style={{
                      maxWidth: "80%",
                      height: "90%",
                      marginHorizontal: "auto",
                      aspectRatio:
                        Number(x.AttachmentMetadata.Dimensions.PixelWidth) /
                        Number(x.AttachmentMetadata.Dimensions.PixelHeight),
                    }}
                    src={
                      x.AttachmentMetadata.AttachmentLinks.find((x) => x.ContentQuality === ContentQuality.Original).Url
                    }
                  />
                </>
              ) : (
                range(pagesCount, pageStart).map((pageIndex) => (
                  <>
                    <Text style={{ textAlign: "center", marginVertical: "auto", ...styles.header, paddingTop: 10 }}>
                      Line Item: {index + 1} - Page {currentPage++}/{pagesCount}
                    </Text>
                    <View
                      fixed
                      style={{
                        display: "flex",
                        backgroundColor: "aliceblue",
                        borderTop: "1px",
                        borderBottom: "1px",
                        borderColor: "blue",
                        width: "100%",
                        padding: "5px",
                        marginVertical: "10px",
                      }}
                    >
                      <View style={{ display: "flex", flexGrow: 1, flexDirection: "row", width: "100%" }}>
                        <Text>{globalExpenseReport.Title}</Text>
                        <Text style={{ textAlign: "right", marginLeft: "auto" }}>
                          {toUsdString(expenseReport.TotalAmountUsd)}
                        </Text>
                      </View>
                      <Text style={{ fontSize: "14px", fontWeight: "bold" }}>{getFullName(user.Person)}</Text>
                    </View>

                    <Image
                      style={{
                        maxWidth: "80%",
                        height: "90%",
                        marginHorizontal: "auto",
                        aspectRatio:
                          Number(x.AttachmentMetadata.Dimensions.PixelWidth) /
                          Number(x.AttachmentMetadata.Dimensions.PixelHeight),
                      }}
                      src={getEntityService(Expense).createRoute(
                        `${x.id}/Contents/images?quality=Original&page=${pageIndex}`,
                      )}
                    />
                  </>
                ))
              )}
            </Page>
          );
        })}
    </Document>
  );
}
