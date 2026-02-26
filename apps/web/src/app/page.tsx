"use client";

import Layout from "@/components/Layout";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  Brain,
  ChevronDown,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const TRUST_ITEMS = ["Early Access", "SMS Native", "No App Install", "Personal Memory", "Gift Hints", "Always On"];

const GIFT_POINTS = [
  {
    title: "Personalized picks",
    subtitle: "Nell remembers interests, hobbies, and past gifts so every suggestion actually fits.",
  },
  {
    title: "Every budget welcome",
    subtitle: "From a $15 book to a $200 splurge — real products, real links, no guessing.",
  },
  {
    title: "Zero effort required",
    subtitle: "The reminder hits your phone with gift ideas already attached. Just pick one and order.",
  },
];

const GIFT_BURST_ITEMS = [
  { src: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=680&q=80", alt: "Wrapped gift box", tx: -570, ty: -240, rot: -8, w: 170, h: 150 },
  { src: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=860&q=80", alt: "Birthday celebration photo", tx: -70, ty: -420, rot: -2, w: 180, h: 220 },
  { src: "https://images.unsplash.com/photo-1521120413309-42e7eada0334?auto=format&fit=crop&w=700&q=80", alt: "Gift inspiration collage", tx: 740, ty: -360, rot: -4, w: 180, h: 220 },
  { src: "https://images.unsplash.com/photo-1513267048331-5611cad62e41?auto=format&fit=crop&w=760&q=80", alt: "Dinner bowl gift date idea", tx: -540, ty: 250, rot: -4, w: 185, h: 145 },
  { src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=760&q=80", alt: "Shopping gift idea", tx: 545, ty: 240, rot: -5, w: 185, h: 150 },
];

const STEPS = [
  {
    title: "Tell Nell once",
    copy: "Drop a name, date, and whatever details matter.",
    icon: MessageSquare,
  },
  {
    title: "Nell tracks the thread",
    copy: "She stores preferences and timing in one continuous memory.",
    icon: Brain,
  },
  {
    title: "You show up on time",
    copy: "Get focused reminders with message drafts when needed.",
    icon: Sparkles,
  },
];

const STATS = [
  { label: "SMS open rate", value: 98, decimals: 0 },
  { label: "Email open rate", value: 20, decimals: 0 },
  { label: "App push open rate", value: 3.5, decimals: 1 },
];

const FAQ_ITEMS = [
  {
    q: "What exactly is Nell?",
    a: "Nell is a friendly AI you text. She remembers birthdays, suggests gifts, and helps you show up for your people. No app needed.",
  },
  {
    q: "How much does it cost?",
    a: "Nell is free during early access. We will introduce simple pricing later, but early users will always get a great deal.",
  },
  {
    q: "Is my data private?",
    a: "Yes. Your conversations are encrypted and never sold. Nell only uses your data to help you be a better friend.",
  },
  {
    q: "What if I want to stop?",
    a: "Just text STOP anytime. Your data gets deleted. No guilt trips, no dark patterns.",
  },
];

const PHOTOS = {
  hero: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=2200&q=80",
  stats: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80",
  final: "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?auto=format&fit=crop&w=2200&q=80",
};

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="faq-item">
      <button onClick={() => setOpen((state) => !state)} className="faq-trigger" aria-expanded={open}>
        <span>{q}</span>
        <span className={`faq-plus ${open ? "is-open" : ""}`}>+</span>
      </button>
      <div className={`faq-answer ${open ? "is-open" : ""}`}>
        <div className="faq-answer-inner">
          <p>{a}</p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const pageRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const conversationRef = useRef<HTMLDivElement>(null);
  const giftSectionRef = useRef<HTMLElement>(null);
  const [dockVisible, setDockVisible] = useState(true);

  useEffect(() => {
    let lastY = 0;

    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY < 120) {
        setDockVisible(true);
        lastY = currentY;
        return;
      }

      if (Math.abs(currentY - lastY) < 8) return;
      setDockVisible(currentY < lastY);
      lastY = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 38 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 84%",
              once: true,
            },
          }
        );
      });

      if (heroImageRef.current) {
        gsap.to(heroImageRef.current, {
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: "#home",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      gsap.utils.toArray<HTMLElement>("[data-stat-target]").forEach((el) => {
        const target = Number(el.dataset.statTarget || "0");
        const decimals = Number(el.dataset.statDecimals || "0");

        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          once: true,
          onEnter: () => {
            const value = { current: 0 };
            gsap.to(value, {
              current: target,
              duration: 1.45,
              ease: "power2.out",
              onUpdate: () => {
                const displayValue = decimals > 0 ? value.current.toFixed(decimals) : Math.round(value.current).toString();
                el.textContent = `${displayValue}%`;
              },
            });
          },
        });
      });

      gsap.set(".chat-step, .typing-pill", { autoAlpha: 0, y: 24, scale: 0.96 });

      if (conversationRef.current) {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: conversationRef.current,
            start: "top top",
            end: "+=210%",
            scrub: 0.65,
            pin: true,
            anticipatePin: 1,
          },
        });

        timeline
          .to(".chat-step-1", { autoAlpha: 1, y: 0, scale: 1, duration: 1, ease: "back.out(1.7)" })
          .to(".typing-1", { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: "power2.out" }, ">0.2")
          .to(".typing-1", { autoAlpha: 0, duration: 0.3 }, ">0.2")
          .to(".chat-step-2", { autoAlpha: 1, y: 0, scale: 1, duration: 1, ease: "back.out(1.7)" }, ">")
          .to(".chat-step-3", { autoAlpha: 1, y: 0, scale: 1, duration: 1, ease: "back.out(1.7)" }, ">0.18")
          .to(".typing-2", { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: "power2.out" }, ">0.12")
          .to(".typing-2", { autoAlpha: 0, duration: 0.3 }, ">0.2")
          .to(".chat-step-4", { autoAlpha: 1, y: 0, scale: 1, duration: 1, ease: "back.out(1.7)" }, ">");
      }

      if (giftSectionRef.current) {
        const burstItems = gsap.utils.toArray<HTMLElement>(".gift-burst-item");
        gsap.set(burstItems, {
          xPercent: -50,
          yPercent: -50,
          x: 0,
          y: 0,
          scale: 0.45,
          autoAlpha: 0,
          rotate: 0,
        });

        const spread = window.innerWidth >= 1600 ? 1.08 : window.innerWidth <= 1180 ? 0.86 : 1;
        const minRadius = window.innerWidth >= 1600 ? 460 : window.innerWidth >= 1280 ? 410 : 340;

        const resolvedPositions = burstItems.map((el) => {
          const baseX = Number(el.dataset.tx || 0) * spread;
          const baseY = Number(el.dataset.ty || 0) * spread;
          const distance = Math.hypot(baseX, baseY) || 1;
          const multiplier = distance < minRadius ? minRadius / distance : 1;

          return {
            x: baseX * multiplier,
            y: baseY * multiplier,
            rotation: Number(el.dataset.rot || 0),
          };
        });

        gsap.to(burstItems, {
          x: (index) => resolvedPositions[index].x,
          y: (index) => resolvedPositions[index].y,
          rotate: (index) => resolvedPositions[index].rotation,
          scale: 1,
          autoAlpha: 1,
          ease: "power3.out",
          stagger: { each: 0.06, from: "random" },
          scrollTrigger: {
            trigger: giftSectionRef.current,
            start: "top 82%",
            end: "top 38%",
            scrub: 0.95,
          },
        });
      }
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <Layout showNavigation={false} showFooter={false}>
      <div ref={pageRef} className="landing-grain">
        <a href="#home" className="brand-wordmark brand-fixed" aria-label="Go to top">
          nell
        </a>
        <a href="sms:+12795290731" className="btn-nav top-cta-fixed" aria-label="Text Nell">
          Text Nell
          <ArrowRight size={14} />
        </a>

        <nav className={`dock-nav ${dockVisible ? "is-visible" : "is-hidden"}`} aria-label="Floating site navigation">
          <a href="#home">Home</a>
          <a href="#conversation">How it works</a>
          <a href="#faq">FAQ</a>
          <a href="sms:+12795290731" className="dock-cta">
            Text Nell
            <ArrowRight size={14} />
          </a>
        </nav>

        <section id="home" className="hero-section">
          <div ref={heroImageRef} className="hero-media photo-grain" style={{ backgroundImage: `url(${PHOTOS.hero})` }} />
          <div className="hero-overlay" />
          <div className="container-shell hero-content">
            <p className="hero-kicker" data-reveal>
              Relationship Memory for SMS
            </p>
            <h1 data-reveal>Never forget the people who matter</h1>
            <p className="hero-subcopy" data-reveal>
              Keep dates, details, and follow-up in one thread. Nell nudges you at the right moment so thoughtfulness becomes consistent.
            </p>
            <div className="hero-actions" data-reveal>
              <a href="sms:+12795290731" className="btn-primary">
                Text Nell
                <ArrowRight size={16} />
              </a>
              <a href="#conversation" className="btn-ghost">
                See how it works
              </a>
            </div>
            <p className="hero-proof" data-reveal>
              Early Access · SMS Native · No App Install
            </p>
          </div>
          <div className="hero-scroll">
            <span>Scroll</span>
            <ChevronDown size={18} />
          </div>
        </section>

        <section className="tag-marquee" aria-label="Feature highlights">
          <div className="tag-track">
            {[...TRUST_ITEMS, ...TRUST_ITEMS, ...TRUST_ITEMS].map((item, index) => (
              <span key={`${item}-${index}`} className="tag-pill">
                {item}
              </span>
            ))}
          </div>
        </section>

        <section id="conversation" className="conversation-section">
          <div ref={conversationRef} className="conversation-stage">
            <div className="container-shell conversation-layout">
              <div className="conversation-copy" data-reveal>
                <p className="section-kicker">Conversation Layer</p>
                <h2>
                  One thread in.
                  <br />
                  <span>High signal out.</span>
                </h2>
                <p>
                  Nell turns one text thread into reminders, context recall, and smart draft help so you never scramble at the last minute.
                </p>
                <ul>
                  <li>Three-day heads-up for every important date</li>
                  <li>Same-day backup with optional message drafts</li>
                  <li>Person-specific memory for gifts and tone</li>
                </ul>
              </div>

              <div className="phone-shell" aria-label="Nell text conversation mockup">
                <div className="phone-topbar">
                  <span>9:41</span>
                  <span>Nell</span>
                  <span>●●●</span>
                </div>
                <div className="phone-chat">
                  <div className="chat-step chat-step-1 user">Jake birthday July 12. He still likes whiskey and hiking.</div>
                  <div className="typing-pill typing-1">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="chat-step chat-step-2 nell">Saved! 🎂 I&apos;ll remind you 3 days before and again day-of. Want to add anything else about Jake?</div>
                  <div className="chat-step chat-step-3 user">He loves bourbon. Keep draft texts short.</div>
                  <div className="typing-pill typing-2">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="chat-step chat-step-4 nell">Got it — bourbon lover, short drafts. You&apos;re all set for July 12.</div>
                </div>
                <div className="phone-input">Text Message</div>
              </div>
            </div>
          </div>
        </section>

        <section id="gift-recommendations" ref={giftSectionRef} className="section-space gift-section">
          <div className="container-shell gift-wrap">
            <div className="gift-burst" aria-hidden="true">
              {GIFT_BURST_ITEMS.map((item) => (
                <div
                  key={`${item.alt}-${item.tx}-${item.ty}`}
                  className="gift-burst-item photo-grain"
                  data-tx={item.tx}
                  data-ty={item.ty}
                  data-rot={item.rot}
                  style={{
                    backgroundImage: `url(${item.src})`,
                    width: item.w,
                    height: item.h,
                  }}
                />
              ))}
            </div>

            <div className="gift-copy" data-reveal>
              <h2>Never show up empty-handed again</h2>
              <p className="gift-subcopy">
                Nell learns what people actually like and sends thoughtful gift ideas right before birthdays.
              </p>
              <div className="gift-points">
                {GIFT_POINTS.map((point) => (
                  <article key={point.title} className="gift-point">
                    <h3>{point.title}</h3>
                    <p>{point.subtitle}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="sms-stats" className="section-space stats-section">
          <div className="container-shell">
            <div className="stats-panel">
              <div className="stats-copy" data-reveal>
                <p className="section-kicker">Why SMS</p>
                <h2>
                  Texts get read.
                  <br />
                  <span>Everything else gets buried.</span>
                </h2>
                <div className="stats-photo photo-grain" style={{ backgroundImage: `url(${PHOTOS.stats})` }} />
              </div>

              <div className="stats-metrics">
                {STATS.map((stat) => (
                  <article key={stat.label} className="stat-item" data-reveal>
                    <p className="stat-number font-mono" data-stat-target={stat.value} data-stat-decimals={stat.decimals}>
                      0%
                    </p>
                    <p className="stat-label">{stat.label}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="workflow" className="section-space workflow-section">
          <div className="container-shell">
            <div className="workflow-heading" data-reveal>
              <p className="section-kicker">Workflow</p>
              <h2>Set up in under one minute.</h2>
            </div>

            <div className="workflow-grid" data-reveal>
              {STEPS.map(({ title, copy, icon: Icon }, index) => (
                <article key={title} className="workflow-card">
                  <p className="step-number font-mono">0{index + 1}</p>
                  <Icon size={20} aria-hidden="true" />
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="section-space faq-section">
          <div className="container-shell faq-wrap">
            <div className="faq-heading" data-reveal>
              <p className="section-kicker">FAQ</p>
              <h2>Questions</h2>
            </div>
            <div data-reveal>
              {FAQ_ITEMS.map((item) => (
                <FAQItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        </section>

        <section className="final-cta-section section-space">
          <div className="final-cta-media photo-grain" style={{ backgroundImage: `url(${PHOTOS.final})` }} />
          <div className="final-cta-overlay" />
          <div className="container-shell final-cta-content" data-reveal>
            <p className="section-kicker">Ready</p>
            <h2>Build better friendship follow-through with one text.</h2>
            <p>
              Nell is live in early access. Start the thread and let memory run in the background.
            </p>
            <a href="sms:+12795290731" className="btn-primary final-cta-button">
              Text Nell at (279) 529-0731
            </a>
            <span>No app install required</span>
          </div>
        </section>

        <footer className="home-footer">
          <div className="container-shell home-footer-inner">
            <div>
              <p className="brand-wordmark">nell</p>
              <p>Made with 💛 for people who give a damn about their people.</p>
            </div>
            <div className="home-footer-links">
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
            </div>
          </div>
          <p className="home-footer-copy">© 2026 Nell</p>
        </footer>
      </div>
    </Layout>
  );
}
