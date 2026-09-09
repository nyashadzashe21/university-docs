import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="university-gradient text-white">
        {/* Navigation */}
        <nav className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full gold-bg flex items-center justify-center">
                <span className="text-navy text-xl font-bold">D</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">Document Management System</h1>
                <p className="text-gold text-xs tracking-wider">University Document Generator</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <Link
                href="/login"
                className="px-6 py-2 gold-bg text-navy font-semibold rounded hover:bg-gold/90 transition-colors"
              >
                Staff Login
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="max-w-2xl">
            <p className="text-gold text-sm tracking-widest mb-4">OFFICIAL DOCUMENT SERVICES</p>
            <h2 className="text-5xl font-bold mb-6 leading-tight">
              Student Document<br />Management System
            </h2>
            <p className="text-lg text-white/80 mb-8">
              Generate official student identification cards, class schedules, and tuition payment
              receipts with built-in verification and anti-tamper protection. Enter your own university details and customize everything.
            </p>
            <div className="flex gap-4">
              <Link
                href="/login"
                className="px-8 py-3 gold-bg text-navy font-semibold rounded-lg hover:bg-gold/90 transition-colors text-lg"
              >
                Get Started
              </Link>
              <a
                href="#features"
                className="px-8 py-3 border-2 border-gold text-gold font-semibold rounded-lg hover:bg-gold/10 transition-colors text-lg"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-gold text-sm tracking-widest mb-2">FEATURES</p>
            <h3 className="text-3xl font-bold text-navy">Secure Document Generation</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-xl border-2 border-navy/10 hover:border-gold transition-colors">
              <div className="w-12 h-12 rounded-lg navy-bg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-navy mb-2">Student ID Cards</h4>
              <p className="text-gray-600">
                Professional photo ID cards with holographic effects, QR verification, and
                automatic expiration dates. Upload your own logo.
              </p>
            </div>

            <div className="p-8 rounded-xl border-2 border-navy/10 hover:border-gold transition-colors">
              <div className="w-12 h-12 rounded-lg navy-bg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-navy mb-2">Class Schedules</h4>
              <p className="text-gray-600">
                Official academic schedules with course details, instructor information, and
                term-specific formatting. Fully customizable.
              </p>
            </div>

            <div className="p-8 rounded-xl border-2 border-navy/10 hover:border-gold transition-colors">
              <div className="w-12 h-12 rounded-lg navy-bg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-navy mb-2">Tuition Receipts</h4>
              <p className="text-gray-600">
                Official payment receipts with QR verification, transaction details, and
                audit trail compliance. Your branding included.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-navy/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-gold text-sm tracking-widest mb-2">HOW IT WORKS</p>
            <h3 className="text-3xl font-bold text-navy">Three Simple Steps</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full navy-bg flex items-center justify-center mx-auto mb-4">
                <span className="text-gold text-2xl font-bold">1</span>
              </div>
              <h4 className="text-lg font-bold text-navy mb-2">Enter Your Details</h4>
              <p className="text-gray-600">Add your university name, logo, address, and contact information. Colors are fully customizable.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full navy-bg flex items-center justify-center mx-auto mb-4">
                <span className="text-gold text-2xl font-bold">2</span>
              </div>
              <h4 className="text-lg font-bold text-navy mb-2">Add Student Info</h4>
              <p className="text-gray-600">Fill in student details, upload a photo using your camera or file picker, and add courses.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full navy-bg flex items-center justify-center mx-auto mb-4">
                <span className="text-gold text-2xl font-bold">3</span>
              </div>
              <h4 className="text-lg font-bold text-navy mb-2">Generate & Export</h4>
              <p className="text-gray-600">Download as PNG, JPEG, or PDF. Print directly. Each document includes a QR code for verification.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-gold text-sm tracking-widest mb-2">SECURITY</p>
              <h3 className="text-3xl font-bold text-navy mb-6">Anti-Tamper Protection</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-gold mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <p className="font-semibold text-navy">QR Code Verification</p>
                    <p className="text-gray-600 text-sm">Each document contains a unique QR code linking to verification endpoint</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-gold mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <p className="font-semibold text-navy">Issue & Expiration Dates</p>
                    <p className="text-gray-600 text-sm">Documents show clear issue date and 1-year expiration</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-gold mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <p className="font-semibold text-navy">Audit Trail</p>
                    <p className="text-gray-600 text-sm">Complete log of who generated what document and when</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-gold mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <p className="font-semibold text-navy">Holographic Effects</p>
                    <p className="text-gray-600 text-sm">ID cards feature animated holographic overlay for authenticity</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-navy/5 p-8 rounded-xl">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full gold-bg flex items-center justify-center mx-auto mb-4">
                  <span className="text-navy text-3xl font-bold">D</span>
                </div>
                <h4 className="text-xl font-bold text-navy mb-2">Document Management System</h4>
                <p className="text-gold text-sm mb-4">Your University, Your Branding</p>
                <p className="text-gray-600 text-sm mb-6">Enter your institution details and generate professional documents in seconds.</p>
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-xs text-gray-500">Document Management System v1.0</p>
                  <p className="text-xs text-gray-500">Authorized Staff Access Only</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-navy text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full gold-bg flex items-center justify-center">
                <span className="text-navy text-sm font-bold">D</span>
              </div>
              <div>
                <p className="font-semibold">Document Management System</p>
                <p className="text-gold/70 text-xs">University Document Generator</p>
              </div>
            </div>
            <p className="text-gold/70 text-sm">
              © {new Date().getFullYear()} Document Management System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
