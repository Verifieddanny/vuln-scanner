'use client'

import { useState } from 'react';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import ScanOptions from './ScanOptions';
import CustomConfig from './CustomConfig';
import { ScanResult, ScanOption } from '@/lib/types';

interface ScannerProps {
  onScanComplete: (results: ScanResult) => void;
}

export default function Scanner({ onScanComplete }: ScannerProps) {
  const [url, setUrl] = useState('');
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [scanOptions, setScanOptions] = useState<ScanOption[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customConfig, setCustomConfig] = useState({
    timeout: 10000,
    userAgent: 'Mozilla/5.0',
    maxDepth: 2,
    concurrency: 3,
    followRedirects: true,
  });

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setScanning(true);

    console.log('Enabled scan types:', 
      scanOptions.filter(opt => opt.enabled).map(opt => opt.id)
    );

    // Add this before making the scan request
console.log('Request payload:', {
  url,
  scanTypes: scanOptions.filter(opt => opt.enabled).map(opt => opt.id)
});

    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          scanTypes: scanOptions.filter(opt => opt.enabled).map(opt => opt.id),
          // config: customConfig
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      console.log({response})

      const results = await response.json();
      console.log({results})
      onScanComplete(results);
    } catch (error) {
      setError(error as string || 'An error occurred during scanning');
    } finally {
      setScanning(false);
    }
  };



  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <form onSubmit={handleScan} className="space-y-6">
          {/* URL Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Target URL
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="block w-full pr-10 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-[#0e0e0e] placeholder:text-[#5e5d5d]"
                placeholder="https://example.com"
                required
              />
              {url && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {/^https?:\/\/.*/.test(url) ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-400" />
                  ) : (
                    <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Scan Options */}
          <ScanOptions onChange={setScanOptions} />

          {/* Advanced Options Toggle */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
            </button>
          </div>

          {/* Advanced Configuration */}
          {showAdvanced && (
            <CustomConfig
              config={customConfig}
              onChange={setCustomConfig}
            />
          )}

          {/* Error Display */}
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Scan Error
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    {error}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={scanning}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              scanning
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {scanning ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Scanning...
              </>
            ) : (
              'Start Scan'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

