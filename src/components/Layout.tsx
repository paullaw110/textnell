import Link from "next/link";

interface LayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
}

export default function Layout({ children, showNavigation = true }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#FFF8F0] text-[#1a1a2e] relative overflow-x-hidden">
      {showNavigation && (
        <nav className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b border-[#e5e7eb] shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link
                href="/"
                className="text-2xl font-display font-bold text-[#1a1a2e] hover:text-[#ff6b4a] transition-colors"
              >
                Nell
              </Link>
              <a
                href="sms:+12795290731"
                className="bg-[#ff6b4a] text-white px-6 py-2.5 rounded-full font-medium hover:bg-[#e55a3a] transition-all shadow-lg text-sm btn-bounce"
              >
                Text Nell →
              </a>
            </div>
          </div>
        </nav>
      )}

      <main className="flex-1 relative z-10">{children}</main>

      <footer className="bg-white border-t border-[#e5e7eb] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Link href="/" className="text-xl font-display font-bold text-[#1a1a2e]">
              Nell
            </Link>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-[#6b7280] hover:text-[#1a1a2e] transition-colors">Privacy</Link>
              <Link href="/terms" className="text-[#6b7280] hover:text-[#1a1a2e] transition-colors">Terms</Link>
            </div>
            <div className="text-sm text-[#6b7280]">
              Made with 💛 for people who give a damn about their people. · © 2026 Nell
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
