
interface CrawlerConfig {
  timeout: number;
  userAgent: string;
  maxDepth: number;
  concurrency: number;
  followRedirects: boolean;
}
interface CustomConfigProps {
  config: CrawlerConfig; // Use the defined interface here
  onChange: (config: CrawlerConfig) => void; // Update argument type
}
  
  export default function CustomConfig({ config, onChange }: CustomConfigProps) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Advanced Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Request Timeout (ms)
            </label>
            <input
              type="number"
              value={config.timeout}
              onChange={(e) => onChange({ ...config, timeout: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700">
              User Agent
            </label>
            <input
              type="text"
              value={config.userAgent}
              onChange={(e) => onChange({ ...config, userAgent: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Max Crawl Depth
            </label>
            <input
              type="number"
              value={config.maxDepth}
              onChange={(e) => onChange({ ...config, maxDepth: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Concurrent Requests
            </label>
            <input
              type="number"
              value={config.concurrency}
              onChange={(e) => onChange({ ...config, concurrency: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
  
          <div className="col-span-2">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={config.followRedirects}
                onChange={(e) => onChange({ ...config, followRedirects: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Follow Redirects
              </span>
            </label>
          </div>
        </div>
      </div>
    );
  }