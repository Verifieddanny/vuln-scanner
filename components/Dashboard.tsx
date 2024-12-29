import { useEffect, useState,  useCallback, useRef  } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { ArrowDownTrayIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';
import { toPng } from 'html-to-image';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DashboardProps {
  results: {
    vulnerabilities: any[];
    scanDuration: number;
    timestamp: string;
  };
}

export default function Dashboard({ results }: DashboardProps) {
  const [stats, setStats] = useState({
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    info: 0
  });
  const [hidden, setHidden] = useState(false);

  const ref = useRef<HTMLDivElement>(null)

  const onButtonClick = useCallback(() => {
    if (ref.current === null) {
      return;
    }
  
    setHidden(true); 
    toPng(ref.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'scan-results.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setHidden(false);
      });
  }, [ref]);
  
  useEffect(() => {
    const newStats = results.vulnerabilities.reduce((acc, vuln) => {
      acc[vuln.severity.toLowerCase()]++;
      return acc;
    }, {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      info: 0
    });
    setStats(newStats);
  }, [results]);

  const chartData = {
    labels: ['Critical', 'High', 'Medium', 'Low', 'Info'],
    datasets: [
      {
        data: [
          stats.critical,
          stats.high,
          stats.medium,
          stats.low,
          stats.info
        ],
        backgroundColor: [
          '#DC2626',
          '#EA580C',
          '#D97706',
          '#CA8A04',
          '#2563EB'
        ]
      }
    ]
  };

  return (
    <div className="mt-8 bg-white rounded-lg shadow-xl p-6" ref={ref}>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Scan Results</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Vulnerability Summary</h3>
          <div className="h-64">
            <Doughnut data={chartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-[#0e0e0e]">Scan Details</h3>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Scan Duration: {results.scanDuration}ms
            </p>
            <p className="text-sm text-gray-600">
              Timestamp: {new Date(results.timestamp).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">
              Total Vulnerabilities: {results.vulnerabilities.length}
            </p>

            <button
              className={`${hidden ? "hidden" : "flex"} items-center mt-4 text-sm text-blue-600 hover:underline`}
              onClick={onButtonClick}
            >
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              Download Scan Details
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 text-[#0e0e0e]">Detailed Findings</h3>
        <div className="space-y-4">
          {results.vulnerabilities.length === 0 && (
             <div className="rounded-md bg-green-50 p-4">
             <div className="flex">
               <RocketLaunchIcon className="h-5 w-5 text-green-400" />
               <div className="ml-3">
                 <h3 className="text-sm font-medium text-green-800">
                   {results.vulnerabilities.length} Vulnerabilities
                 </h3>
                 <div className="mt-2 text-sm text-green-700">
                   Site is clean for now 
                 </div>
               </div>
             </div>
           </div>
          )}
          {results.vulnerabilities.map((vuln, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">
                    {vuln.type}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {vuln.description}
                  </p>
                  {vuln.evidence && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-500">Evidence:</p>
                      <code className="text-sm bg-gray-100 text-[#0e0e0e] p-2 rounded block mt-1">
                        {vuln.evidence}
                      </code>
                    </div>
                  )}
                  {vuln.recommendation && (
                    <p className="text-sm text-gray-600 mt-2">
                      <span className="font-medium">Recommendation:</span>{' '}
                      {vuln.recommendation}
                    </p>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  vuln.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                  vuln.severity === 'High' ? 'bg-orange-100 text-orange-800' :
                  vuln.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  vuln.severity === 'Low' ? 'bg-green-100 text-green-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {vuln.severity}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}