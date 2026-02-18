import Layout from "@/components/Layout";

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto pt-20 pb-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-8">
              Never forget a{" "}
              <span className="text-[#ff7849]">birthday</span> again.
            </h1>
            <p className="text-xl sm:text-2xl text-zinc-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              Nell is your SMS-powered birthday reminder and relationship CRM. Just text her about the people you care about, and she'll make sure you never miss another special day.
            </p>
            
            {/* Phone Number Display */}
            <div className="mb-12">
              <div className="inline-block bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-6">
                <p className="text-zinc-400 text-lg mb-2">Text Nell now</p>
                <a 
                  href="sms:+12795290731"
                  className="text-4xl sm:text-5xl font-bold text-[#ff7849] hover:text-[#e56a42] transition-colors block"
                >
                  (279) 529-0731
                </a>
              </div>
              
              <a
                href="sms:+12795290731"
                className="inline-flex items-center px-8 py-4 bg-[#ff7849] text-white text-lg font-semibold rounded-full hover:bg-[#e56a42] transition-colors shadow-lg"
              >
                Text Nell now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Mock Conversation Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-32">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">
            See how it works
          </h2>
          
          <div className="bg-zinc-900 rounded-3xl p-8 max-w-md mx-auto">
            {/* Chat Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#ff7849] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">N</span>
                </div>
                <span className="font-semibold">Nell</span>
              </div>
              <div className="text-xs text-zinc-500">Text Message</div>
            </div>
            
            {/* Chat Messages */}
            <div className="space-y-4">
              {/* User Message */}
              <div className="flex justify-end">
                <div className="bg-blue-600 text-white px-4 py-3 rounded-2xl rounded-br-md max-w-xs">
                  <p className="text-sm">Hey Nell! My friend Sarah's birthday is March 15th. Can you remind me a few days before?</p>
                </div>
              </div>
              
              {/* Nell Response */}
              <div className="flex justify-start">
                <div className="bg-zinc-800 text-white px-4 py-3 rounded-2xl rounded-bl-md max-w-xs">
                  <p className="text-sm">Perfect! I've got Sarah's birthday saved for March 15th. I'll remind you on March 12th so you have time to plan something special. 🎉</p>
                </div>
              </div>
              
              {/* Time Jump Indicator */}
              <div className="text-center py-4">
                <span className="text-xs text-zinc-500 bg-zinc-800 px-3 py-1 rounded-full">2 days later</span>
              </div>
              
              {/* Reminder Message */}
              <div className="flex justify-start">
                <div className="bg-zinc-800 text-white px-4 py-3 rounded-2xl rounded-bl-md max-w-xs">
                  <p className="text-sm">🎂 Hey! Sarah's birthday is in 3 days (March 15th). Want me to suggest some gift ideas, or do you have something in mind?</p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <div className="bg-blue-600 text-white px-4 py-3 rounded-2xl rounded-br-md max-w-xs">
                  <p className="text-sm">Thanks Nell! You're a lifesaver 🙌</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-32">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">
            How it works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#ff7849] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Text Nell</h3>
              <p className="text-zinc-400 leading-relaxed">
                Send a simple text to <span className="text-[#ff7849] font-semibold">(279) 529-0731</span> to get started. No apps to download, no accounts to create.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#ff7849] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Tell her about your people</h3>
              <p className="text-zinc-400 leading-relaxed">
                Share birthdays, anniversaries, and other important dates. Nell remembers everything so you don't have to.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#ff7849] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Get reminded at the right time</h3>
              <p className="text-zinc-400 leading-relaxed">
                Receive thoughtful reminders when you need them. Configure timing, get gift suggestions, and never miss what matters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-32">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">
            Everything you need to stay connected
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800">
              <div className="w-12 h-12 bg-[#ff7849]/10 rounded-lg flex items-center justify-center mb-6">
                <div className="w-6 h-6 bg-[#ff7849] rounded-sm"></div>
              </div>
              <h3 className="text-lg font-semibold mb-3">Conversational AI</h3>
              <p className="text-zinc-400 text-sm">Natural conversations that feel like texting a friend who never forgets.</p>
            </div>
            
            <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800">
              <div className="w-12 h-12 bg-[#ff7849]/10 rounded-lg flex items-center justify-center mb-6">
                <div className="w-6 h-6 bg-[#ff7849] rounded-sm"></div>
              </div>
              <h3 className="text-lg font-semibold mb-3">Smart Reminders</h3>
              <p className="text-zinc-400 text-sm">Configurable timing and personalized messages that help you show you care.</p>
            </div>
            
            <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 opacity-60">
              <div className="w-12 h-12 bg-zinc-700 rounded-lg flex items-center justify-center mb-6">
                <div className="w-6 h-6 bg-zinc-600 rounded-sm"></div>
              </div>
              <h3 className="text-lg font-semibold mb-3">Gift Suggestions</h3>
              <p className="text-zinc-400 text-sm">Coming soon: AI-powered gift ideas based on what you know about them.</p>
            </div>
            
            <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 opacity-60">
              <div className="w-12 h-12 bg-zinc-700 rounded-lg flex items-center justify-center mb-6">
                <div className="w-6 h-6 bg-zinc-600 rounded-sm"></div>
              </div>
              <h3 className="text-lg font-semibold mb-3">Personal Rolodex</h3>
              <p className="text-zinc-400 text-sm">Coming soon: Keep track of conversations, preferences, and relationship history.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-32">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-16">
            Simple, transparent pricing
          </h2>
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 sm:p-12 max-w-md mx-auto">
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-4">Early Access</h3>
              <div className="flex items-baseline justify-center mb-4">
                <span className="text-5xl font-bold text-[#ff7849]">Free</span>
              </div>
              <p className="text-zinc-400">Complete access during early access period</p>
            </div>
            
            <ul className="text-left space-y-3 mb-8 text-zinc-300">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-[#ff7849] mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Unlimited reminders
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-[#ff7849] mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Smart scheduling
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-[#ff7849] mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Early access to new features
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-[#ff7849] mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Direct feedback channel
              </li>
            </ul>
            
            <a
              href="sms:+12795290731"
              className="w-full bg-[#ff7849] text-white py-3 px-6 rounded-full font-semibold hover:bg-[#e56a42] transition-colors inline-block"
            >
              Get Started Free
            </a>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-32">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-[#ff7849] to-[#ff6b35] rounded-3xl p-8 sm:p-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to never miss a birthday?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join hundreds of people who are already using Nell to strengthen their relationships and show they care.
            </p>
            
            <div className="space-y-4">
              <div className="text-white/90 text-lg">
                Text Nell at
              </div>
              <a 
                href="sms:+12795290731"
                className="inline-block text-4xl sm:text-5xl font-bold text-white hover:text-white/90 transition-colors"
              >
                (279) 529-0731
              </a>
              <div className="pt-4">
                <a
                  href="sms:+12795290731"
                  className="inline-flex items-center px-8 py-4 bg-white text-[#ff7849] text-lg font-semibold rounded-full hover:bg-white/90 transition-colors shadow-lg"
                >
                  Start your first conversation
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}