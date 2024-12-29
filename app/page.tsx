import ScannerContainer from '@/components/ScannerContainer'

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">
          Web Vulnerability Scanner
        </h1>
        <p className="text-gray-300 text-xl">
          Comprehensive security analysis for web applications
        </p>
      </div>
      <ScannerContainer />
    </main>
  )
}