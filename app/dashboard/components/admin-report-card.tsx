"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { jsPDF } from "jspdf";

interface Transaction {
  transaction_id: string;
  amount: number;
  created_at: string | Date;
  transaction_type: string;
  description: string | null;
}

interface Account {
  account_id: string;
  account_type: string;
  balance: number;
}

interface Customer {
  customer_id: string;
  first_name: string | null;
  last_name: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
}

interface ReportData {
  customer: Customer;
  accounts: Account[];
  transactions: Transaction[];
}
interface MonthlySpending {
  month: string;
  year: number;
  monthIndex: number;
  total: number;
  date: Date;
}
export function AdminReportCard({
  customer_id,
  account_id,
}: {
  customer_id: string;
  account_id: string;
}) {

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // Utility: load image from public folder and return data URL
  const loadImageDataUrl = async (path: string): Promise<string> => {
    const res = await fetch(path);
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Failed to read image blob"));
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  };
  // Calculate total spending per month
  const calculateMonthlySpending = (transactions: Transaction[]): MonthlySpending[] => {
    const monthlyMap = new Map<string, MonthlySpending>();

    transactions.forEach(transaction => {
      const date = new Date(transaction.created_at);
      const year = date.getFullYear();
      const month = date.getMonth();
      const key = `${year}-${month}`;
      const monthName = date.toLocaleDateString("en-US", { month: "long", year: "numeric" });

      if (!monthlyMap.has(key)) {
        monthlyMap.set(key, {
          month: monthName,
          year,
          monthIndex: month,
          total: 0,
          date: new Date(year, month, 1),
        });
      }

      const monthly = monthlyMap.get(key)!;
      monthly.total += Math.abs(transaction.amount);
    });

    return Array.from(monthlyMap.values()).sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.monthIndex - b.monthIndex;
    });
  };
  // Draws a simple monthly spending bar chart in the PDF
  const drawBarChart = (
    doc: jsPDF,
    monthlySpending: MonthlySpending[],
    startY: number,
    averageSpending: number
  ) => {
    if (monthlySpending.length === 0) return startY;

    const pageWidth = doc.internal.pageSize.getWidth();
    const leftMargin = 35;
    const rightMargin = 20;
    const chartWidth = pageWidth - leftMargin - rightMargin;
    const chartHeight = 80;
    const chartX = leftMargin;
    const chartY = startY;
    const spacing = 3;
    const availableWidth = chartWidth - (monthlySpending.length - 1) * spacing;
    const barWidth = Math.max(availableWidth / monthlySpending.length, 5);
    const maxSpending = Math.max(...monthlySpending.map(m => m.total), averageSpending * 1.2, 1);

    // Draw axes
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(chartX, chartY, chartX, chartY + chartHeight);
    doc.line(chartX, chartY + chartHeight, chartX + chartWidth, chartY + chartHeight);

    // Draw bars
    monthlySpending.forEach((month, i) => {
      const barHeight = maxSpending > 0 ? (month.total / maxSpending) * chartHeight : 0;
      const barX = chartX + i * (barWidth + spacing);
      const barY = chartY + chartHeight - barHeight;

      doc.setFillColor(100, 149, 237);
      if (barHeight > 0) doc.rect(barX, barY, barWidth, barHeight, "F");

      // Month label
      doc.setFontSize(6);
      const monthLabel = new Date(month.date).toLocaleDateString("en-US", { month: "short" });
      const labelWidth = doc.getTextWidth(monthLabel);
      doc.text(monthLabel, barX + barWidth / 2 - labelWidth / 2, chartY + chartHeight + 5);
    });

    // Optional average spending line
    if (averageSpending > 0 && maxSpending > 0) {
      const avgY = chartY + chartHeight - (averageSpending / maxSpending) * chartHeight;
      doc.setDrawColor(255, 0, 0);
      doc.setLineDashPattern([2, 2], 0);
      doc.line(chartX, avgY, chartX + chartWidth, avgY);
      doc.setLineDashPattern([], 0);
    }

    return chartY + chartHeight + 20;
  };

  const generateReport = async () => {
    setIsLoading(true);
    try {
      // Fetch report data

      const response = await fetch(`/api/reports?customerId=${customer_id}`, {
        method: "GET",
        credentials: "include", // ✅ makes sure your cookies/session go through
      });

      if (!response.ok) {
        throw new Error("Failed to fetch report data");
      }

      const data: ReportData = await response.json();
      const { customer, transactions } = data;

      // Calculate monthly spending
      const monthlySpending = calculateMonthlySpending(transactions);
      const totalSpending = monthlySpending.reduce(
        (sum: number, month: MonthlySpending) => sum + month.total,
        0
      );
      const averageSpending = monthlySpending.length > 0 ? totalSpending / monthlySpending.length : 0;

      // Create PDF
      const doc = new jsPDF();
      let currentY = 20;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Header with logo + title + horizontal line
      const headerMarginY = 20;
      const headerLeft = 20;
      const headerRight = pageWidth - 20;

      // Set header fonts
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);

      // Left: Financial Report
      doc.text("Financial Report", headerLeft, headerMarginY);

      // Right: Landmark + "Online Bank"
      doc.setFontSize(18);
      doc.setFont("helvetica", "normal");

      try {
        const landmarkIconUrl = await loadImageDataUrl("/bank.png");
        const textWidth = doc.getTextWidth("Online Bank");
        const iconSize = 8; // mm
        const totalWidth = textWidth + iconSize + 3;
        const startX = headerRight - totalWidth;

        // Add the icon, then text
        doc.addImage(landmarkIconUrl, "PNG", startX + 1, headerMarginY - iconSize + 2, iconSize, iconSize);
        doc.text("Online Bank", startX + iconSize + 3, headerMarginY);
      } catch {
        // fallback: just text
        doc.text("Online Bank", headerRight, headerMarginY, { align: "right" });
      }

      // Horizontal divider
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.35);
      doc.line(20, headerMarginY + 4, pageWidth - 20, headerMarginY + 4);

      currentY = headerMarginY + 12;

      // --- Metadata Section ---
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");

      const firstName = customer.first_name || "N/A";
      const lastName = customer.last_name || "N/A";

      const metaInfo = [
        `Generated on: ${new Date().toLocaleDateString()}`,
        `Customer Name: ${firstName} ${lastName}`,
        `Email: ${customer.email || "N/A"}`,
        `Phone: ${customer.phone || "N/A"}`,
        `Address: ${customer.address || "N/A"}`,
      ];

      metaInfo.forEach((line) => {
        doc.text(line, headerLeft, currentY);
        currentY += 6;
      });
      // --- Account Balances ---
      if (data.accounts && data.accounts.length > 0) {
        doc.setFont("helvetica", "bold");
        doc.text("Accounts & Current Balances:", headerLeft, currentY + 2);
        doc.setFont("helvetica", "normal");
        currentY += 8;

        // ✅ keep only one account per type
        const uniqueAccounts = Object.values(
          data.accounts.reduce((map: any, acc) => {
            if (!map[acc.account_type]) map[acc.account_type] = acc;
            return map;
          }, {})
        );

        uniqueAccounts.forEach((acc: any) => {
          const accText = `• ${acc.account_type.toUpperCase()} — $${Number(acc.balance ?? 0).toFixed(2)}`;
          doc.text(accText, headerLeft + 4, currentY);
          currentY += 6;
          if (currentY > pageHeight - 30) {
            doc.addPage();
            currentY = 20;
          }
        });

        currentY += 6;
      }

      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.35);
      doc.line(20, currentY, pageWidth - 20, currentY);
      currentY += 12;

      // Monthly Spending Chart section
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Monthly Spending Overview", 20, currentY);
      doc.setFont("helvetica", "normal");
      currentY += 10;

      if (monthlySpending.length > 0) {
        currentY = drawBarChart(doc, monthlySpending, currentY, averageSpending);

        // Summary statistics
        if (currentY > pageHeight - 80) {
          doc.addPage();
          currentY = 20;
        }

        // Summary Statistics
        currentY += 5;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.text("Summary Statistics", 20, currentY);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        currentY += 8;

        // Prepare bullet-style summary list
        const totalMonths = monthlySpending.length;
        const summaryItems = [
          `Total Spending: $${totalSpending.toFixed(2)}`,
          `Average Monthly Spending: $${averageSpending.toFixed(2)}`,
          `Number of Months: ${totalMonths}`,
          `Total Transactions: ${transactions.length}`,
        ];

        // Render each summary item with bullets
        summaryItems.forEach((item) => {
          doc.text("• " + item, headerLeft + 4, currentY, { maxWidth: pageWidth - 42 });
          currentY += 6;

          if (currentY > pageHeight - 40) {
            doc.addPage();
            currentY = 20;
          }
        });

        currentY += 6;

        // --- Insights Section ---
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.text("Insights", 20, currentY);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        currentY += 8;

        const highestMonth = monthlySpending.reduce((a, b) => (a.total > b.total ? a : b));
        const lowestMonth = monthlySpending.reduce((a, b) => (a.total < b.total ? a : b));

        const insights = [
          `Your highest spending month was ${highestMonth.month} with $${highestMonth.total.toFixed(2)} spent.`,
          `Your lowest spending month was ${lowestMonth.month} with $${lowestMonth.total.toFixed(2)} spent.`,
          averageSpending > 0
            ? `Average monthly spending: $${averageSpending.toFixed(2)}.`
            : "Not enough data to compute an average.",
        ];

        // Render insights as bullet list matching summary style
        insights.forEach((insight) => {
          doc.text("• " + insight, headerLeft + 4, currentY, { maxWidth: pageWidth - 42 });
          currentY += 6;

          if (currentY > pageHeight - 40) {
            doc.addPage();
            currentY = 20;
          }
        });

        currentY += 10;

      } else {
        doc.setFontSize(10);
        doc.text("No spending data available for the selected period.", 20, currentY);
      }

      // Footer (bottom of last page)
      doc.setFontSize(8);
      doc.setTextColor(100);

      // Add footer on every page
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        const footerY = pageHeight - 15;
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text("For support, contact: Group1@sjsu.edu", 20, footerY - 5);
        doc.text("This report is for informational purposes only.", 20, footerY);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - 30, footerY);
      }

      // Output PDF
      const pdfBlob = doc.output("blob");
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
      setIsDialogOpen(true);
    } catch (err) {
      console.error("Error generating report:", err);
      alert("Failed to generate report.");
    } finally {
      setIsLoading(false);
    }
  };
  const downloadPdf = () => {
    if (pdfUrl) {
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = `admin-report-${new Date().toISOString().split("T")[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open && pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
  };

  return (
    <>
      <Card className="h-full">
        <Button
          variant="outline"
          className="hover:cursor-pointer w-full"

          onClick={generateReport}
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Generate Report"}
        </Button>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0 gap-0">
          <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
            <DialogTitle>Customer Report Preview</DialogTitle>
            <DialogDescription>
              Preview the generated report for this customer.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-hidden px-6 min-h-0">
            {pdfUrl && (
              <iframe
                src={pdfUrl}
                className="w-full h-full border rounded-lg"
                title="PDF Preview"
              />
            )}
          </div>
          <DialogFooter className="px-6 pb-6 pt-4 shrink-0">
            <Button variant="outline" onClick={() => handleDialogClose(false)}>
              Close
            </Button>
            <Button onClick={downloadPdf}>Download PDF</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}