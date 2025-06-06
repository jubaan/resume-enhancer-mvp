'use client';

interface ResumePreviewProps {
  htmlContent: string | null;
  loading: boolean;
}

export default function ResumePreview({ htmlContent, loading }: ResumePreviewProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-300 h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Enhancing your resume...</p>
        </div>
      </div>
    );
  }

  if (!htmlContent) {
    return (
      <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 h-96 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p>Enhanced resume will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
      <iframe
        srcDoc={htmlContent}
        className="w-full h-96 border-none"
        title="Resume Preview"
        sandbox="allow-same-origin"
      />
    </div>
  );
}