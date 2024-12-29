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
    } catch (error: any) {
      setError(error.message || 'An error occurred during scanning');
    } finally {
      setScanning(false);
    }
  };

  //   const handleScan = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setScanning(true);

//     try {
//       const response = await axios.post('/api/scan', { 
//         url,
//         scanTypes: scanTypes.filter(type => type.enabled).map(type => type.id)
//       });
//       onScanComplete(response.data);
//     } catch (error: any) {
//       setError(error.response?.data?.message || 'An error occurred during scanning');
//     } finally {
//       setScanning(false);
//     }
//   };

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

// 'use client'

// import { useState } from 'react';
// import axios from 'axios';
// import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

// interface ScannerProps {
//   onScanComplete: (results: any) => void;
// }

// export default function Scanner({ onScanComplete }: ScannerProps) {
//   const [url, setUrl] = useState('');
//   const [scanning, setScanning] = useState(false);
//   const [error, setError] = useState('');

//   const scanTypes = [
//     {
//       id: 'xss',
//       name: 'Cross-Site Scripting (XSS)',
//       description: 'Detect XSS vulnerabilities in input parameters',
//       enabled: true,
//       severity: 'High'
//     },
//     {
//       id: 'sqli',
//       name: 'SQL Injection',
//       description: 'Detect SQL injection vulnerabilities',
//       enabled: true,
//       severity: 'Critical'
//     },
//     {
//       id: 'ssrf',
//       name: 'Server-Side Request Forgery',
//       description: 'Detect SSRF vulnerabilities',
//       enabled: true,
//       severity: 'Critical'
//     },
//     {
//       id: 'csrf',
//       name: 'Cross-Site Request Forgery',
//       description: 'Check for missing CSRF protections',
//       enabled: true,
//       severity: 'High'
//     },
//     {
//       id: 'lfi',
//       name: 'Local File Inclusion',
//       description: 'Detect LFI vulnerabilities',
//       enabled: true,
//       severity: 'Critical'
//     },
//     {
//       id: 'nosqli',
//       name: 'NoSQL Injection',
//       description: 'Detect NoSQL injection vulnerabilities',
//       enabled: true,
//       severity: 'High'
//     },
//     {
//       id: 'cors',
//       name: 'CORS Misconfiguration',
//       description: 'Check for dangerous CORS configurations',
//       enabled: true,
//       severity: 'High'
//     },
//     {
//       id: 'sensitive',
//       name: 'Sensitive Information',
//       description: 'Detect exposed sensitive information',
//       enabled: true,
//       severity: 'Critical'
//     },
//     {
//       id: 'headers',
//       name: 'Security Headers',
//       description: 'Check for missing security headers',
//       enabled: true,
//       severity: 'Medium'
//     }

//   ];

//   const handleScan = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setScanning(true);

//     try {
//       const response = await axios.post('/api/scan', { 
//         url,
//         scanTypes: scanTypes.filter(type => type.enabled).map(type => type.id)
//       });
//       onScanComplete(response.data);
//     } catch (error: any) {
//       setError(error.response?.data?.message || 'An error occurred during scanning');
//     } finally {
//       setScanning(false);
//     }
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-xl p-6 max-w-3xl mx-auto">
//       <form onSubmit={handleScan} className="space-y-6">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Target URL
//           </label>
//           <div className="mt-1 relative rounded-md shadow-sm">
//             <input
//               type="url"
//               value={url}
//               onChange={(e) => setUrl(e.target.value)}
//               className="block w-full pr-10 border-gray-300 rounded-md text-[#0e0e0e] focus:ring-indigo-500 focus:border-indigo-500"
//               placeholder="https://example.com"
//               required
//             />
//             {url && (
//               <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
//                 {/^https?:\/\/.*/.test(url) ? (
//                   <CheckCircleIcon className="h-5 w-5 text-green-400" />
//                 ) : (
//                   <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
//                 )}
//               </div>
//             )}
//           </div>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Scan Options
//           </label>
//           <div className="grid grid-cols-2 gap-4">
//             {scanTypes.map((type) => (
//               <div key={type.id} className="flex items-center">
//                 <input
//                   type="checkbox"
//                   checked={type.enabled}
//                   className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//                 />
//                 <label className="ml-2 text-sm text-gray-600">
//                   {type.name}
//                 </label>
//               </div>
//             ))}
//           </div>
//         </div>

//         {error && (
//           <div className="rounded-md bg-red-50 p-4">
//             <div className="flex">
//               <div className="flex-shrink-0">
//                 <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
//               </div>
//               <div className="ml-3">
//                 <h3 className="text-sm font-medium text-red-800">{error}</h3>
//               </div>
//             </div>
//           </div>
//         )}

//         <button
//           type="submit"
//           disabled={scanning}
//           className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
//             scanning
//               ? 'bg-indigo-400 cursor-not-allowed'
//               : 'bg-indigo-600 hover:bg-indigo-700'
//           }`}
//         >
//           {scanning ? (
//             <>
//               <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//               </svg>
//               Scanning...
//             </>
//           ) : (
//             'Start Scan'
//           )}
//         </button>
//       </form>
//     </div>
//   );
// }