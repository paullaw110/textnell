"use client";

import Layout from "@/components/Layout";
import { useEffect, useRef, useState } from "react";

// SVG Illustrations
const BirthdayCakeIllustration = () => (
  <svg width="200" height="200" viewBox="0 0 200 200" className="animate-float">
    {/* Cake Base */}
    <ellipse cx="100" cy="180" rx="80" ry="12" fill="#f3e8d3" />
    <rect x="20" y="120" width="160" height="60" rx="8" fill="#ff6b4a" />
    <rect x="30" y="110" width="140" height="20" rx="4" fill="#FFD93D" />
    <rect x="40" y="90" width="120" height="30" rx="6" fill="#ff9f7a" />
    
    {/* Decorative frosting */}
    <circle cx="60" cy="105" r="4" fill="white" opacity="0.8" />
    <circle cx="100" cy="102" r="4" fill="white" opacity="0.8" />
    <circle cx="140" cy="107" r="4" fill="white" opacity="0.8" />
    
    {/* Candles */}
    <rect x="70" y="70" width="4" height="25" fill="#ff6b4a" />
    <rect x="95" y="65" width="4" height="30" fill="#ff6b4a" />
    <rect x="120" y="72" width="4" height="23" fill="#ff6b4a" />
    
    {/* Flames */}
    <ellipse cx="72" cy="65" rx="3" ry="6" fill="#FFD93D" />
    <ellipse cx="97" cy="60" rx="3" ry="6" fill="#FFD93D" />
    <ellipse cx="122" cy="67" rx="3" ry="6" fill="#FFD93D" />
    
    {/* Sparkles */}
    <g className="animate-pulse">
      <path d="M50 40 L52 46 L58 44 L52 50 L56 56 L50 52 L44 56 L48 50 L42 44 L48 46 Z" fill="#FFD93D" opacity="0.8" />
      <path d="M150 30 L151 34 L155 33 L151 37 L153 41 L150 39 L147 41 L149 37 L145 33 L149 34 Z" fill="#FFD93D" opacity="0.8" />
    </g>
  </svg>
);

const GiftBoxIllustration = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" className="animate-float" style={{ animationDelay: '1s' }}>
    <rect x="20" y="40" width="80" height="60" rx="4" fill="#ff9f7a" />
    <rect x="20" y="30" width="80" height="20" rx="4" fill="#FFD93D" />
    <rect x="55" y="20" width="10" height="80" fill="#ff6b4a" />
    <rect x="15" y="45" width="90" height="10" fill="#ff6b4a" />
    
    {/* Bow */}
    <ellipse cx="50" cy="25" rx="8" ry="5" fill="#e55a3a" />
    <ellipse cx="70" cy="25" rx="8" ry="5" fill="#e55a3a" />
    <circle cx="60" cy="25" r="4" fill="#ff6b4a" />
    
    {/* Sparkles */}
    <g className="animate-pulse" style={{ animationDelay: '0.5s' }}>
      <circle cx="30" cy="20" r="2" fill="#FFD93D" opacity="0.8" />
      <circle cx="90" cy="15" r="1.5" fill="#FFD93D" opacity="0.8" />
      <circle cx="85" cy="35" r="1" fill="#FFD93D" opacity="0.8" />
    </g>
  </svg>
);

const BalloonIllustration = () => (
  <svg width="100" height="150" viewBox="0 0 100 150" className="animate-float" style={{ animationDelay: '2s' }}>
    <ellipse cx="30" cy="30" rx="18" ry="25" fill="#ff6b4a" />
    <ellipse cx="70" cy="35" rx="18" ry="25" fill="#FFD93D" />
    <ellipse cx="50" cy="45" rx="18" ry="25" fill="#ff9f7a" />
    
    {/* Strings */}
    <line x1="30" y1="55" x2="45" y2="120" stroke="#6b7280" strokeWidth="1" />
    <line x1="70" y1="60" x2="50" y2="120" stroke="#6b7280" strokeWidth="1" />
    <line x1="50" y1="70" x2="55" y2="120" stroke="#6b7280" strokeWidth="1" />
    
    {/* Shine */}
    <ellipse cx="25" cy="22" rx="4" ry="6" fill="white" opacity="0.6" />
    <ellipse cx="65" cy="27" rx="4" ry="6" fill="white" opacity="0.6" />
    <ellipse cx="45" cy="37" rx="4" ry="6" fill="white" opacity="0.6" />
  </svg>
);

// Phone mockup conversation component
const PhoneMockup = () => {
  const [visibleMessages, setVisibleMessages] = useState(0);
  const conversationRef = useRef<HTMLDivElement>(null);

  const messages = [
    { type: 'user', text: "Hey Nell! My friend Jake's birthday is July 12", delay: 0 },
    { type: 'nell', text: "Got it! 🎂 I've saved Jake's birthday (July 12). I'll remind you 3 days before. Want to tell me anything about Jake?", delay: 1000 },
    { type: 'user', text: "He loves whiskey and hiking", delay: 2000 },
    { type: 'nell', text: "Nice! I'll remember that. When his birthday comes around, I might have some gift ideas 🎁", delay: 3000 },
    { type: 'divider', text: "3 days later...", delay: 4000 },
    { type: 'nell', text: "Hey! Jake's birthday is in 3 days (July 12). He loves whiskey — maybe a nice bottle? 🥃", delay: 5000 }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && visibleMessages === 0) {
          // Start message animation sequence
          messages.forEach((_, index) => {
            setTimeout(() => {
              setVisibleMessages(index + 1);
            }, messages[index].delay);
          });
        }
      },
      { threshold: 0.3 }
    );

    if (conversationRef.current) {
      observer.observe(conversationRef.current);
    }

    return () => observer.disconnect();
  }, [visibleMessages]);

  return (
    <div ref={conversationRef} className="max-w-sm mx-auto">
      {/* Phone Frame */}
      <div className="relative bg-[#1a1a2e] rounded-[2.5rem] p-4 shadow-2xl">
        {/* Screen */}
        <div className="bg-black rounded-[2rem] p-1">
          <div className="bg-white rounded-[1.8rem] h-[600px] relative overflow-hidden">
            {/* Status bar */}
            <div className="flex justify-between items-center px-6 py-3 text-black text-sm">
              <span className="font-medium">9:41</span>
              <div className="flex space-x-1">
                <div className="w-4 h-2 bg-black rounded-sm"></div>
                <div className="w-4 h-2 bg-black rounded-sm"></div>
                <div className="w-6 h-2 bg-green-500 rounded-sm"></div>
              </div>
            </div>
            
            {/* Chat header */}
            <div className="flex items-center space-x-3 px-4 py-3 border-b bg-gray-50">
              <div className="w-8 h-8 bg-[#ff6b4a] rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">🎂</span>
              </div>
              <div>
                <h3 className="font-medium text-black">Nell</h3>
                <p className="text-xs text-gray-500">SMS • (279) 529-0731</p>
              </div>
            </div>
            
            {/* Messages */}
            <div className="p-4 space-y-4 h-[480px] overflow-y-auto">
              {messages.slice(0, visibleMessages).map((message, index) => {
                if (message.type === 'divider') {
                  return (
                    <div key={index} className="text-center py-2 animate-message-slide-in">
                      <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {message.text}
                      </span>
                    </div>
                  );
                }
                
                return (
                  <div
                    key={index}
                    className={`flex animate-message-slide-in ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${
                        message.type === 'user'
                          ? 'bg-[#007AFF] text-white rounded-br-md'
                          : 'bg-gray-100 text-black rounded-bl-md'
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Scroll animation hook
const useScrollAnimation = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.scroll-animate').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);
};

export default function Home() {
  useScrollAnimation();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-8 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <BirthdayCakeIllustration />
            </div>
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight mb-8 text-[#1a1a2e]">
              Never forget a{" "}
              <span className="text-[#ff6b4a] relative">
                birthday
                <svg className="absolute -right-8 -top-4 w-16 h-16 animate-pulse" viewBox="0 0 64 64">
                  <path d="M32 8 L36 20 L48 16 L40 28 L52 32 L40 36 L48 48 L36 44 L32 56 L28 44 L16 48 L24 36 L12 32 L24 28 L16 16 L28 20 Z" fill="#FFD93D" opacity="0.8" />
                </svg>
              </span>{" "}
              again.
            </h1>
            <p className="text-xl sm:text-2xl text-[#6b7280] mb-12 max-w-3xl mx-auto leading-relaxed font-body">
              Nell is your playful SMS friend who remembers everything about the people you care about. Just text her, and she'll make sure you never miss another special day! 🎉
            </p>
            
            {/* Phone Number Card */}
            <div className="mb-12">
              <div className="inline-block bg-white border-2 border-[#ff6b4a] rounded-3xl p-8 mb-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <p className="text-[#6b7280] text-lg mb-2 font-body">Text Nell right now!</p>
                <a 
                  href="sms:+12795290731"
                  className="text-4xl sm:text-5xl font-display font-bold text-[#ff6b4a] hover:text-[#e55a3a] transition-colors block"
                >
                  (279) 529-0731
                </a>
                <p className="text-sm text-[#6b7280] mt-2">Tap to open your messaging app</p>
              </div>
              
              <div className="space-y-4">
                <a
                  href="sms:+12795290731"
                  className="inline-flex items-center px-8 py-4 bg-[#ff6b4a] text-white text-lg font-medium rounded-full hover:bg-[#e55a3a] transition-all duration-200 shadow-lg btn-bounce"
                >
                  Text Nell → 💬
                </a>
                <div className="bg-[#FFD93D]/20 text-[#1a1a2e] px-4 py-2 rounded-full text-sm font-medium inline-block ml-4">
                  ✨ Free during early access
                </div>
              </div>
            </div>
          </div>
          
          {/* Floating illustrations */}
          <div className="absolute top-20 left-10 opacity-60 hidden lg:block">
            <GiftBoxIllustration />
          </div>
          <div className="absolute top-32 right-16 opacity-60 hidden lg:block">
            <BalloonIllustration />
          </div>
        </div>
      </section>

      {/* Mock Conversation Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-br from-[#ff6b4a]/5 to-[#FFD93D]/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 scroll-animate">
            <h2 className="text-3xl sm:text-5xl font-display font-bold text-[#1a1a2e] mb-6">
              See how it works
            </h2>
            <p className="text-xl text-[#6b7280] max-w-2xl mx-auto font-body">
              Watch Nell in action! She's like having a super-organized friend who never forgets important dates.
            </p>
          </div>
          
          <PhoneMockup />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 scroll-animate">
            <h2 className="text-3xl sm:text-5xl font-display font-bold text-[#1a1a2e] mb-6">
              Three simple steps
            </h2>
            <p className="text-xl text-[#6b7280] max-w-2xl mx-auto font-body">
              No apps, no signups, no complexity. Just pure birthday-remembering magic! ✨
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                number: "1",
                title: "Text Nell",
                description: "Send a simple text to (279) 529-0731. Say hi! No apps to download.",
                icon: (
                  <svg className="w-12 h-12 text-[#ff6b4a]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                  </svg>
                )
              },
              {
                number: "2",
                title: "Share your people",
                description: "Tell Nell about birthdays, anniversaries, and the people you love. She remembers it all!",
                icon: (
                  <svg className="w-12 h-12 text-[#FFD93D]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63c-.34-1.02-1.3-1.74-2.39-1.74-.34 0-.68.07-1 .2L13 8.3V12h-2V6.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5V8l1.8-.7c.13-.05.26-.1.4-.1.47 0 .9.32 1.02.77L18.5 16H20v6h-4zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm2 16v-7H9.5l-2.54-7.63A1.75 1.75 0 005.57 6c-.34 0-.68.07-1 .2L1 8.3V12h2v-2.5l1.8-.7c.13-.05.26-.1.4-.1.47 0 .9.32 1.02.77L8.5 17H10v5H7.5z"/>
                  </svg>
                )
              },
              {
                number: "3",
                title: "Never miss again",
                description: "Get thoughtful reminders at just the right time. Configure timing and get gift ideas too!",
                icon: (
                  <svg className="w-12 h-12 text-[#ff9f7a]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                )
              }
            ].map((step, index) => (
              <div key={index} className="text-center scroll-animate" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border-2 border-[#ff6b4a]/20">
                  {step.icon}
                </div>
                <div className="w-8 h-8 bg-[#ff6b4a] text-white rounded-full flex items-center justify-center mx-auto mb-4 font-display font-bold">
                  {step.number}
                </div>
                <h3 className="text-xl font-display font-semibold mb-4 text-[#1a1a2e]">{step.title}</h3>
                <p className="text-[#6b7280] leading-relaxed font-body max-w-sm mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 scroll-animate">
            <h2 className="text-3xl sm:text-5xl font-display font-bold text-[#1a1a2e] mb-6">
              Everything you need to stay connected
            </h2>
            <p className="text-xl text-[#6b7280] max-w-2xl mx-auto font-body">
              Nell is packed with thoughtful features to help you be the friend everyone loves! 💝
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Natural conversations",
                description: "Talk to Nell like you would any friend. She understands context and remembers everything.",
                emoji: "💬",
                available: true
              },
              {
                title: "Smart reminders",
                description: "Configurable timing and personalized messages that help you show you care.",
                emoji: "⏰",
                available: true
              },
              {
                title: "Gift suggestions",
                description: "AI-powered gift ideas based on what you know about them.",
                emoji: "🎁",
                available: false
              },
              {
                title: "Relationship tracking",
                description: "Keep track of conversations, preferences, and relationship history.",
                emoji: "📱",
                available: false
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className={`bg-white p-8 rounded-3xl border-2 shadow-lg hover:shadow-xl transition-all duration-300 scroll-animate ${
                  feature.available 
                    ? 'border-[#ff6b4a]/20 hover:border-[#ff6b4a]/40' 
                    : 'border-gray-200 opacity-60'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-4xl mb-4">{feature.emoji}</div>
                <h3 className="text-lg font-display font-semibold mb-3 text-[#1a1a2e]">
                  {feature.title}
                  {!feature.available && <span className="text-xs ml-2 bg-[#FFD93D] text-[#1a1a2e] px-2 py-1 rounded-full">Coming Soon</span>}
                </h3>
                <p className="text-[#6b7280] text-sm font-body leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-br from-[#ff6b4a] to-[#ff9f7a] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10">
            <BirthdayCakeIllustration />
          </div>
          <div className="absolute bottom-10 right-10">
            <GiftBoxIllustration />
          </div>
          <div className="absolute top-1/2 left-1/4 transform -translate-y-1/2">
            <BalloonIllustration />
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center scroll-animate">
            <h2 className="text-3xl sm:text-5xl font-display font-bold text-white mb-6">
              Ready to be the friend who never forgets?
            </h2>
            <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto font-body leading-relaxed">
              Join the early access and start strengthening your relationships today. Your friends will love how thoughtful you've become! ✨
            </p>
            
            <div className="space-y-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 max-w-md mx-auto">
                <p className="text-white/90 text-lg mb-4 font-body">Text Nell now at</p>
                <a 
                  href="sms:+12795290731"
                  className="inline-block text-4xl sm:text-5xl font-display font-bold text-white hover:text-white/90 transition-colors"
                >
                  (279) 529-0731
                </a>
              </div>
              
              <div className="space-x-4">
                <a
                  href="sms:+12795290731"
                  className="inline-flex items-center px-10 py-4 bg-white text-[#ff6b4a] text-lg font-medium rounded-full hover:bg-gray-50 transition-all duration-200 shadow-lg btn-bounce"
                >
                  Start your first conversation 🚀
                </a>
              </div>
              
              <p className="text-white/70 text-sm font-body">
                Free during early access • No apps required • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}