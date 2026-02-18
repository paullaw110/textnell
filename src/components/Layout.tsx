import Link from "next/link";

interface LayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
}

export default function Layout({ children, showNavigation = true }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {showNavigation && (
        <nav className="border-b border-zinc-800 bg-[#0a0a0a]/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="text-2xl font-bold text-white hover:text-[#ff7849] transition-colors">
                Nell
              </Link>
              <a
                href="sms:+12795290731"
                className="bg-[#ff7849] text-white px-6 py-2 rounded-full font-medium hover:bg-[#e56a42] transition-colors"
              >
                Text Nell
              </a>
            </div>
          </div>
        </nav>
      )}
      
      <main className="flex-1">
        {children}
      </main>
      
      <footer className="border-t border-zinc-800 bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-xl font-bold text-white">
                Nell
              </Link>
              <div className="flex space-x-6 text-sm">
                <Link href="/privacy" className="text-zinc-400 hover:text-white transition-colors">
                  Privacy
                </Link>
                <Link href="/terms" className="text-zinc-400 hover:text-white transition-colors">
                  Terms
                </Link>
              </div>
            </div>
            <div className="text-sm text-zinc-400">
              © 2026 Nell. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}