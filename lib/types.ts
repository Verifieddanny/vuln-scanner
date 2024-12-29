export interface Vulnerability {
    type: string
    severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Info'
    description: string
    evidence?: string
    recommendation?: string
    cwe?: string
    cvss?: number
    location?: string
  }
  
  export interface ScanResult {
    url: string
    timestamp: string
    scanDuration: number
    vulnerabilities: Vulnerability[]
  }
  
  export interface ScanOptions {
    url: string
    scanTypes: string[]
  }
  export interface ScanOption {
    id: string;
    name: string;
    description: string;
    enabled: boolean;
    severity: 'Critical' | 'High' | 'Medium' | 'Low';
  }