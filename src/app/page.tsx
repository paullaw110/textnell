"use client";

import Layout from "@/components/Layout";
import { useEffect } from "react";

const TRUST_ITEMS = ["Early Access", "SMS Native", "No App Install", "Personal Memory", "Gift Hints", "Always On"]; 

const FEATURES = [
  {
    title: "Context that compounds",
    copy: "Nell keeps dates, preferences, and relationship notes tied together, so every reminder carries the right context.",
    tone: "from-[#ff5ec8]/30 to-[#ff5ec8]/5",
  },
  {
    title: "Timing that feels human",
    copy: "Get a three-day signal, day-of backup, and optional draft text so you can follow through under pressure.",
    tone: "from-[#6f74ff]/30 to-[#6f74ff]/5",
  },
  {
    title: "Text first simplicity",
    copy: "No dashboards to babysit. You just send a message and Nell handles memory and follow-up in the background.",
    tone: "from-[#74ffd8]/28 to-[#74ffd8]/5",
  },
];

const STEPS = [
  {
    title: "Tell Nell once",
    copy: "Drop a name, date, and whatever details matter.",
  },
  {
    title: "Nell tracks the thread",
    copy: "She stores preferences and timing in one continuous memory.",
  },
  {
    title: "You show up on time",
    copy: "Get focused reminders with message drafts when needed.",
  },
];

function useRevealOnScroll() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!elements.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
}

function useScrollParallax() {
  useEffect(() => {
    let frame = 0;

    const updateScrollVar = () => {
      document.documentElement.style.setProperty("--scroll-y", String(window.scrollY));
      frame = 0;
    };

    const onScroll = () => {
      if (frame) {
        return;
      }
      frame = window.requestAnimationFrame(updateScrollVar);
    };

    updateScrollVar();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);
}

function HeroPhone() {
  return (
    <div className="relative mx-auto max-w-[25rem]">
      <div
        aria-hidden
        className="ambient-blob absolute -left-8 top-12 h-32 w-32 rounded-full bg-[#ff59bd]/35"
        style={{ transform: "translateY(calc(var(--scroll-y) * -0.06px))" }}
      />
      <div
        aria-hidden
        className="ambient-blob absolute -right-10 bottom-8 h-36 w-36 rounded-full bg-[#6f74ff]/33"
        style={{ transform: "translateY(calc(var(--scroll-y) * 0.07px))" }}
      />

      <div className="relative rounded-[2.2rem] border border-white/15 bg-[#17102a] p-3 shadow-[0_36px_100px_-50px_rgba(0,0,0,0.95)]">
        <div className="rounded-[1.8rem] border border-white/10 bg-[#0e0a1a] p-4">
          <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3 text-xs text-[#d9d5ef]">
            <span>9:41</span>
            <span>Nell</span>
          </div>

          <div className="space-y-3 text-[14px] leading-relaxed">
            <div className="max-w-[84%] rounded-2xl rounded-bl-md bg-[#251f3a] px-3 py-2 text-[#e6e3f6]">
              Jake birthday July 12. He still likes whiskey and hiking.
            </div>
            <div className="ml-auto max-w-[84%] rounded-2xl rounded-br-md bg-gradient-to-r from-[#ff57bf] to-[#ff6d8f] px-3 py-2 text-white">
              Saved. I will remind you 3 days before and again day-of.
            </div>
            <div className="max-w-[84%] rounded-2xl rounded-bl-md bg-[#251f3a] px-3 py-2 text-[#e6e3f6]">
              Great. Keep draft text short.
            </div>
            <div className="ml-auto max-w-[84%] rounded-2xl rounded-br-md bg-[#6f74ff] px-3 py-2 text-white">
              Done. Two options queued for you.
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -right-6 top-6 hidden rounded-full border border-white/20 bg-[#2a223f]/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#f4efff] shadow-lg sm:block">
        July 12 in 3 days
      </div>
      <div className="absolute -left-8 bottom-10 hidden rounded-full border border-white/20 bg-[#2a223f]/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#f4efff] shadow-lg sm:block">
        Draft ready
      </div>
    </div>
  );
}

export default function Home() {
  useRevealOnScroll();
  useScrollParallax();

  return (
    <Layout>
      <section className="relative overflow-hidden px-4 pb-20 pt-10 sm:px-8 sm:pt-14">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
          <div data-reveal className="reveal">
            <p className="mb-4 inline-flex rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.13em] text-[#bfb4df]">
              Nell | Relationship Memory for SMS
            </p>

            <h1 className="font-display text-5xl leading-[0.97] text-white sm:text-6xl lg:text-7xl">
              A relationship assistant
              <span className="block bg-gradient-to-r from-[#ff57bf] via-[#ff76a5] to-[#9d8dff] bg-clip-text text-transparent">
                built for real life chaos
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#cdc7e4] sm:text-xl">
              Keep dates, details, and follow-up in one thread. Nell nudges you at the right moment so thoughtfulness becomes consistent.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a href="sms:+12795290731" className="site-pill-btn">
                Text Nell
              </a>
              <a href="#features" className="site-outline-btn">
                See how it works
              </a>
            </div>

            <div className="mt-8 grid max-w-lg grid-cols-3 gap-3 text-center text-sm">
              <div className="rounded-2xl border border-white/14 bg-white/[0.04] px-3 py-3 text-[#d9d2ef]">
                <p className="text-lg font-semibold text-white">3x</p>
                <p>Reminder layers</p>
              </div>
              <div className="rounded-2xl border border-white/14 bg-white/[0.04] px-3 py-3 text-[#d9d2ef]">
                <p className="text-lg font-semibold text-white">0</p>
                <p>Apps to install</p>
              </div>
              <div className="rounded-2xl border border-white/14 bg-white/[0.04] px-3 py-3 text-[#d9d2ef]">
                <p className="text-lg font-semibold text-white">24/7</p>
                <p>Memory thread</p>
              </div>
            </div>
          </div>

          <div data-reveal className="reveal">
            <HeroPhone />
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-black/10 py-5">
        <div className="marquee-track">
          {[...TRUST_ITEMS, ...TRUST_ITEMS].map((item, index) => (
            <span key={`${item}-${index}`} className="marquee-item">
              {item}
            </span>
          ))}
        </div>
      </section>

      <section id="features" className="px-4 py-20 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div data-reveal className="reveal mb-12 max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.13em] text-[#b4a8d8]">Why Nell</p>
            <h2 className="font-display text-4xl text-white sm:text-5xl">Nell works with your social brain, not against it.</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {FEATURES.map((item, index) => (
              <article
                key={item.title}
                data-reveal
                className="reveal overflow-hidden rounded-[1.6rem] border border-white/14 bg-[#171129]"
                style={{ transitionDelay: `${index * 90}ms` }}
              >
                <div className={`h-1 w-full bg-gradient-to-r ${item.tone}`} />
                <div className="p-6">
                  <h3 className="font-display text-2xl text-white">{item.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-[#cec6e6]">{item.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 rounded-[2rem] border border-white/12 bg-[#140f24] p-6 sm:p-10 lg:grid-cols-[1.08fr_0.92fr]">
          <div data-reveal className="reveal">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.13em] text-[#b3a7d8]">Conversation Layer</p>
            <h2 className="font-display text-4xl text-white sm:text-5xl">One thread in. High signal out.</h2>
            <p className="mt-5 max-w-xl text-lg text-[#cac2e3]">
              Nell turns one text thread into reminders, context recall, and smart draft help so you never scramble at the last minute.
            </p>
          </div>

          <div data-reveal className="reveal grid gap-3">
            <div className="rounded-2xl border border-white/12 bg-white/[0.04] p-4 text-sm text-[#e2dcf3]">Three-day heads-up for every important date</div>
            <div className="rounded-2xl border border-white/12 bg-white/[0.04] p-4 text-sm text-[#e2dcf3]">Same-day backup with optional message drafts</div>
            <div className="rounded-2xl border border-white/12 bg-white/[0.04] p-4 text-sm text-[#e2dcf3]">Person-specific memory for gifts and tone</div>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div data-reveal className="reveal mb-12 max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.13em] text-[#b4a8d8]">Workflow</p>
            <h2 className="font-display text-4xl text-white sm:text-5xl">Set up in under one minute.</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <article
                key={step.title}
                data-reveal
                className="reveal rounded-[1.5rem] border border-white/12 bg-[#161028] p-6"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <p className="mb-3 text-sm font-semibold text-[#8f84b4]">0{index + 1}</p>
                <h3 className="font-display text-2xl text-white">{step.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[#d0c9e8]">{step.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-8">
        <div
          data-reveal
          className="reveal mx-auto max-w-5xl rounded-[2.2rem] border border-white/20 bg-gradient-to-br from-[#ff4fbe] via-[#ff649a] to-[#8172ff] p-10 shadow-[0_34px_100px_-48px_rgba(0,0,0,0.95)] sm:p-14"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.13em] text-[#ffe7f8]">Ready</p>
          <h2 className="mt-3 font-display text-4xl leading-tight text-white sm:text-5xl">Build better friendship follow-through with one text.</h2>
          <p className="mt-5 max-w-2xl text-lg text-[#ffe8f6]">Nell is live in early access. Start the thread and let memory run in the background.</p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a href="sms:+12795290731" className="rounded-full bg-[#140d23] px-8 py-3 text-base font-semibold text-white transition hover:bg-black">
              Text Nell at (279) 529-0731
            </a>
            <span className="rounded-full border border-white/35 bg-white/10 px-4 py-2 text-sm text-[#ffeaf8]">No app install required</span>
          </div>
        </div>
      </section>
    </Layout>
  );
}
