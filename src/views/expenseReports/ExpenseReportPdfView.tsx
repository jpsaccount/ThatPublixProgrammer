import { PolRequestPresenter } from "@/components/polComponents/PolRequestPresenter";
import PolSpinner from "@/components/polComponents/PolSpinner";
import { useAuth } from "@/customHooks/auth";
import { useDbQuery } from "@/customHooks/sdkHooks/useDbQuery";
import { useDbQueryFirst } from "@/customHooks/sdkHooks/useDbQueryFirst";
import useDevice from "@/customHooks/useDevice";
import ExpenseReportPdf from "@/pdfs/ExpenseReportPdf";
import { useExpenseReportPdfViewParams } from "@/routes/_auth/expense/$globalExpenseReportId/$expenseReportId/print.lazy";
import { ContentType } from "@/sdk/contracts/Entity";
import { Expense } from "@/sdk/entities/billing/Expense";
import { ExpenseReport } from "@/sdk/entities/billing/ExpenseReport";
import { GlobalExpenseReport } from "@/sdk/entities/billing/GlobalExpenseReport";
import { TaxCategory } from "@/sdk/entities/billing/TaxCategory";
import { User } from "@/sdk/entities/core/User";
import { getEntityService } from "@/sdk/services/getEntityService";
import { isUsable } from "@/sdk/utils/usabilityUtils";
import { PDFViewer } from "@react-pdf/renderer";
import { Suspense, useEffect, useState } from "react";

export default function ExpenseReportPdfView() {
  const { expenseReportId } = useExpenseReportPdfViewParams();

  const [attachments, setAttachments] = useState<Map<Expense, ArrayBuffer[]>>(new Map<Expense, ArrayBuffer[]>());
  const expenseReportRequest = useDbQueryFirst(ExpenseReport, `WHERE c.id = "${expenseReportId}"`);
  const expensesRequest = useDbQuery(Expense, `WHERE c.ExpenseReportId = "${expenseReportId}"`);
  const globalExpenseReportRequest = useDbQueryFirst(
    GlobalExpenseReport,
    `WHERE c.id = "${expenseReportRequest.data?.GlobalExpenseReportId}"`,
    { enabled: isUsable(expenseReportRequest.data) },
  );

  const taxCategoryRequest = useDbQuery(
    TaxCategory,
    `WHERE c.id IN ["${expensesRequest.data
      ?.flatMap((x) => x.LineItems)
      .map((x) => x.CategoryId)
      .join(`","`)}"]"`,
    { enabled: isUsable(expenseReportRequest.data) },
  );
  const userRequest = useDbQueryFirst(User, `WHERE c.id = "${expenseReportRequest.data?.UserId}"`, {
    enabled: isUsable(expenseReportRequest.data),
  });

  useEffect(() => {
    expensesRequest.data?.forEach(async (x) => {
      if (x.AttachmentMetadata.ContentType === ContentType.PDF) {
        const imagesRequest = await getEntityService(Expense).customGetAsync<ArrayBuffer[]>(`${x.id}/Contents/images`);
        if (imagesRequest.isSuccess() === false) return;
        setAttachments((pre) => {
          const results = new Map<Expense, ArrayBuffer[]>(pre);
          const newArray = results.has(x) ? results.get(x) : [];
          results.set(x, [...newArray, ...imagesRequest.data]);
          return results;
        });
      } else {
        const imagesRequest = await getEntityService(Expense).customGetAsync<ArrayBuffer>(
          `${x.id}/Content?quality=Original`,
        );
        if (imagesRequest.isSuccess() === false) return;
        setAttachments((pre) => {
          const results = new Map<Expense, ArrayBuffer[]>(pre);
          const newArray = results.has(x) ? results.get(x) : [];
          results.set(x, [...newArray, imagesRequest.data]);
          return results;
        });
      }
    });
  }, [expensesRequest.data]);

  const { user: printerUser } = useAuth();

  const device = useDevice();

  return (
    <PolRequestPresenter
      ready={isUsable(printerUser) && isUsable(attachments)}
      request={[globalExpenseReportRequest, expenseReportRequest, userRequest, taxCategoryRequest, expensesRequest]}
      onSuccess={() => (
        <Suspense fallback={<PolSpinner />}>
          <PDFViewer width={"100%"} height={device.height - 275}>
            <ExpenseReportPdf
              printerUser={printerUser}
              attachments={attachments}
              categories={taxCategoryRequest.data}
              expenses={expensesRequest.data}
              user={userRequest.data}
              expenseReport={expenseReportRequest.data}
              globalExpenseReport={globalExpenseReportRequest.data}
            />
          </PDFViewer>
        </Suspense>
      )}
    />
  );
}
