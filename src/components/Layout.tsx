import Link from "next/link";

interface LayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
}

export default function Layout({ children, showNavigation = true }: LayoutProps) {
  return (
    <div className="grain min-h-screen bg-[#FFF8F0] text-[#1a1a2e] relative overflow-x-hidden">
      {showNavigation && (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FFF8F0]/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="flex justify-between items-center h-16">
              <Link
                href="/"
                className="font-display text-2xl text-[#1a1a2e] hover:text-[#ff6b4a] transition-colors duration-300"
              >
                nell
              </Link>
              <a
                href="sms:+12795290731"
                className="bg-[#1a1a2e] text-[#FFF8F0] px-6 py-2.5 rounded-full font-medium hover:bg-[#ff6b4a] transition-all duration-300 text-sm tracking-wide"
              >
                Text Nell →
              </a>
            </div>
          </div>
        </nav>
      )}

      <main className="flex-1 relative z-10">{children}</main>

      <footer className="border-t border-[#e8e0d8] relative z-10 bg-[#FFF8F0]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div>
              <Link href="/" className="font-display text-3xl text-[#1a1a2e]">
                nell
              </Link>
              <p className="mt-3 text-sm text-[#9a918a] max-w-xs leading-relaxed">
                Made with 💛 for people who give a damn about their people.
              </p>
            </div>
            <div className="flex gap-8 text-sm">
              <Link href="/privacy" className="text-[#9a918a] hover:text-[#1a1a2e] transition-colors duration-300">Privacy</Link>
              <Link href="/terms" className="text-[#9a918a] hover:text-[#1a1a2e] transition-colors duration-300">Terms</Link>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-[#e8e0d8] text-xs text-[#9a918a]">
            © 2026 Nell
          </div>
        </div>
      </footer>
    </div>
  );
}
