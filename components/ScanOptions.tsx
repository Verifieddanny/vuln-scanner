
'use client'

import { useState } from 'react';
import { Switch } from '@headlessui/react';

interface ScanOption {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
}

interface ScanOptionsProps {
  onChange: (options: ScanOption[]) => void;
}

export default function ScanOptions({ onChange }: ScanOptionsProps) {
  const [options, setOptions] = useState<ScanOption[]>([
    {
      id: 'xss',
      name: 'Cross-Site Scripting (XSS)',
      description: 'Detect XSS vulnerabilities in input parameters',
      enabled: false,
      severity: 'High'
    },
    {
      id: 'sqli',
      name: 'SQL Injection',
      description: 'Detect SQL injection vulnerabilities',
      enabled: false,
      severity: 'Critical'
    },
    {
      id: 'ssrf',
      name: 'Server-Side Request Forgery',
      description: 'Detect SSRF vulnerabilities',
      enabled: false,
      severity: 'Critical'
    },
    {
      id: 'csrf',
      name: 'Cross-Site Request Forgery',
      description: 'Check for missing CSRF protections',
      enabled: false,
      severity: 'High'
    },
    {
      id: 'lfi',
      name: 'Local File Inclusion',
      description: 'Detect LFI vulnerabilities',
      enabled: false,
      severity: 'Critical'
    },
    {
      id: 'nosqli',
      name: 'NoSQL Injection',
      description: 'Detect NoSQL injection vulnerabilities',
      enabled: false,
      severity: 'High'
    },
    {
      id: 'cors',
      name: 'CORS Misconfiguration',
      description: 'Check for dangerous CORS configurations',
      enabled: false,
      severity: 'High'
    },
    {
      id: 'sensitive',
      name: 'Sensitive Information',
      description: 'Detect exposed sensitive information',
      enabled: false,
      severity: 'Critical'
    },
    {
      id: 'headers',
      name: 'Security Headers',
      description: 'Check for missing security headers',
      enabled: false,
      severity: 'Medium'
    },    {
        id: 'rce',
        name: 'Remote Code Execution',
        description: 'Detect remote code execution vulnerabilities',
        enabled: false,
        severity: 'Critical'
      },
  ]);

  const toggleOption = (index: number) => {
    const newOptions = [...options];
    newOptions[index].enabled = !newOptions[index].enabled;
    setOptions(newOptions);
    onChange(newOptions);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4 text-[#0e0e0e]">Scan Options</h2>
      <div className="space-y-4">
        {options.map((option, index) => (
          <div key={option.id} className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center">
                <span className="font-medium text-gray-900">{option.name}</span>
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                  option.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                  option.severity === 'High' ? 'bg-orange-100 text-orange-800' :
                  option.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {option.severity}
                </span>
              </div>
              <p className="text-sm text-gray-500">{option.description}</p>
            </div>
            <Switch
              checked={option.enabled}
              onChange={() => toggleOption(index)}
              className={`${
                option.enabled ? 'bg-indigo-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 flex-shrink-0 rounded-full transition-colors duration-200 ease-in-out`}
            >
              <span className="sr-only">Enable {option.name}</span>
              <span
                className={`${
                  option.enabled ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1`}
              />
            </Switch>
          </div>
        ))}
      </div>
    </div>
  );
}