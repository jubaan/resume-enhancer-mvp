'use client';

interface DownloadButtonsProps {
  htmlContent: string | null;
  candidateName?: string;
  targetRole?: string;
}

export default function DownloadButtons({ htmlContent, candidateName, targetRole }: DownloadButtonsProps) {
  const downloadHtml = () => {
    if (!htmlContent) return;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${candidateName || 'resume'}_${targetRole?.replace(/\s+/g, '_') || 'enhanced'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadPdf = async () => {
    if (!htmlContent) return;

    // Simple PDF generation using browser print
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (!htmlContent) return null;

  return (
    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
      <h3 className="text-lg font-medium text-green-800 mb-3">✅ Resume Enhanced Successfully!</h3>
      <div className="flex gap-3">
        <button
          onClick={downloadHtml}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Download HTML
        </button>
        <button
          onClick={downloadPdf}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          Print/Save as PDF
        </button>
      </div>
      <p className="text-sm text-green-700 mt-2">
        HTML version is recommended for ATS compatibility
      </p>
    </div>
  );
}