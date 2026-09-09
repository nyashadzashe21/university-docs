"use client";

import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Download, FileImage, FileText, Printer } from "lucide-react";

interface DocumentPreviewProps {
  children: React.ReactNode;
  documentName: string;
  documentType: "id-card" | "schedule" | "receipt";
}

export default function DocumentPreview({
  children,
  documentName,
  documentType,
}: DocumentPreviewProps) {
  const documentRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const exportAsImage = async (format: "png" | "jpeg") => {
    if (!documentRef.current) return;
    setIsExporting(true);

    try {
      const canvas = await html2canvas(documentRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      });

      const link = document.createElement("a");
      link.download = `${documentName}.${format}`;
      link.href = canvas.toDataURL(`image/${format}`, 0.95);
      link.click();
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportAsPDF = async () => {
    if (!documentRef.current) return;
    setIsExporting(true);

    try {
      const canvas = await html2canvas(documentRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      let pdf: jsPDF;
      if (documentType === "id-card") {
        pdf = new jsPDF({
          orientation: "landscape",
          unit: "in",
          format: [3.375, 2.125],
        });
        pdf.addImage(imgData, "PNG", 0, 0, 3.375, 2.125);
      } else {
        pdf = new jsPDF({
          orientation: "portrait",
          unit: "in",
          format: "letter",
        });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgHeight * pdfWidth) / imgWidth;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      }

      pdf.save(`${documentName}.pdf`);
    } catch (error) {
      console.error("PDF export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow || !documentRef.current) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${documentName}</title>
          <style>
            body { margin: 0; padding: 20px; }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          ${documentRef.current.outerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="space-y-4">
      {/* Export Buttons */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => exportAsImage("png")}
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-2 bg-navy text-white rounded-lg hover:bg-dark-navy transition-colors disabled:opacity-50"
        >
          <FileImage className="w-4 h-4" />
          {isExporting ? "Exporting..." : "PNG"}
        </button>
        <button
          onClick={() => exportAsImage("jpeg")}
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-2 bg-navy text-white rounded-lg hover:bg-dark-navy transition-colors disabled:opacity-50"
        >
          <FileImage className="w-4 h-4" />
          {isExporting ? "Exporting..." : "JPEG"}
        </button>
        <button
          onClick={exportAsPDF}
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-2 bg-gold text-navy rounded-lg hover:bg-gold/90 transition-colors disabled:opacity-50"
        >
          <FileText className="w-4 h-4" />
          {isExporting ? "Exporting..." : "PDF"}
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 border-2 border-navy text-navy rounded-lg hover:bg-navy/5 transition-colors"
        >
          <Printer className="w-4 h-4" />
          Print
        </button>
      </div>

      {/* Document Preview */}
      <div className="flex justify-center p-4 bg-gray-200 rounded-lg overflow-auto">
        <div ref={documentRef}>
          {children}
        </div>
      </div>
    </div>
  );
}
