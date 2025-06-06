'use client';

import { useState } from 'react';
import FileUpload from './components/FileUpload';
import ResumePreview from './components/ResumePreview';
import DownloadButtons from './components/DownloadButtons';

const targetRoles = [
  'Full-Stack Developer',
  'Backend Developer',
  'Frontend Developer',
  'DevOps Engineer',
  'Data Engineer',
  'Mobile Developer',
  'Software Engineer',
  'Senior Developer'
];

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState('');
  const [customRole, setCustomRole] = useState('');
  const [instructions, setInstructions] = useState('');
  const [clientContext, setClientContext] = useState('');
  const [enhancedHtml, setEnhancedHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [candidateName, setCandidateName] = useState('');

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setError('');
    setEnhancedHtml(null);
  };

  const handleRoleSelect = (role: string) => {
    setTargetRole(role);
    setCustomRole('');
  };

  const handleCustomRoleChange = (value: string) => {
    setCustomRole(value);
    if (value.trim()) {
      setTargetRole(value.trim());
    }
  };

  const handleEnhance = async () => {
    if (!selectedFile || !targetRole) {
      setError('Please upload a file and select a target role');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Parse file
      const formData = new FormData();
      formData.append('file', selectedFile);

      const parseResponse = await fetch('/api/parse-file', {
        method: 'POST',
        body: formData,
      });

      if (!parseResponse.ok) {
        throw new Error('Failed to parse file');
      }

      const parseResult = await parseResponse.json();

      // Enhance resume
      const enhanceResponse = await fetch('/api/enhance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: parseResult.data.text,
          targetRole,
          instructions,
          clientContext,
        }),
      });

      if (!enhanceResponse.ok) {
        throw new Error('Failed to enhance resume');
      }

      const enhanceResult = await enhanceResponse.json();
      setEnhancedHtml(enhanceResult.data.html);
      setCandidateName(enhanceResult.data.enhanced.personalInfo.name);

    } catch (err) {
      console.error('Enhancement error:', err);
      setError('Failed to enhance resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🚀 Resume Enhancer
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Upload a resume, specify the target role, and get a professional, 
            ATS-friendly version optimized for your clients
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">📄 Input</h2>
            
            <FileUpload
              onFileSelect={handleFileSelect}
              selectedFile={selectedFile}
              loading={loading}
            />

            {/* Target Role Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Role
              </label>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {targetRoles.map((role) => (
                  <button
                    key={role}
                    onClick={() => handleRoleSelect(role)}
                    className={`p-2 text-sm border rounded-md transition-colors ${
                      targetRole === role
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="Or specify custom role..."
                value={customRole}
                onChange={(e) => handleCustomRoleChange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Additional Instructions */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Instructions (Optional)
              </label>
              <textarea
                placeholder="e.g., Emphasize cloud experience, highlight leadership skills, focus on specific technologies..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Client Context */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company/Client Context (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g., Fintech startup, Enterprise healthcare, E-commerce..."
                value={clientContext}
                onChange={(e) => setClientContext(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Process Button */}
            <button
              onClick={handleEnhance}
              disabled={!selectedFile || !targetRole || loading}
              className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
                !selectedFile || !targetRole || loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {loading ? '🔄 Enhancing Resume...' : '✨ Enhance Resume'}
            </button>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Output Panel */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">✨ Enhanced Resume</h2>
            
            <ResumePreview htmlContent={enhancedHtml} loading={loading} />
            
            <DownloadButtons
              htmlContent={enhancedHtml}
              candidateName={candidateName}
              targetRole={targetRole}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Built for professional staffing teams • Powered by AI</p>
        </div>
      </div>
    </div>
  );
}