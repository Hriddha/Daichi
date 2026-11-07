import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  CloudSun,
  Leaf,
  ScanLine,
  Store,
  Wallet,
} from "lucide-react";
import GlassCard from "../components/ui/GlassCard";

const tools = [
  {
    number: "01",
    icon: Store,
    title: "Sell your harvest",
    description: "Meet buyers and agree on a fair price, directly.",
    href: "/marketplace",
    link: "Visit marketplace",
  },
  {
    number: "02",
    icon: ScanLine,
    title: "Check crop health",
    description: "Get a useful first look at a plant from a photo.",
    href: "/scanner",
    link: "Open crop scanner",
  },
  {
    number: "03",
    icon: Wallet,
    title: "Know your numbers",
    description: "Keep harvest costs, earnings and loans in view.",
    href: "/ledger",
    link: "View your ledger",
  },
  {
    number: "04",
    icon: CloudSun,
    title: "Plan for the weather",
    description: "See local risk alerts and what you can do next.",
    href: "/risk-alerts",
    link: "Check field alerts",
  },
];

function FieldIllustration() {
  return (
    <div className="relative min-h-[340px] overflow-hidden rounded-warm-lg border border-daichi-forest/15 bg-[#e7e2d3] shadow-glass sm:min-h-[440px]">
      <div className="absolute left-5 top-5 z-10 text-[10px] font-semibold uppercase tracking-[0.2em] text-daichi-forest sm:left-7 sm:top-7">
        Field note / 01
      </div>
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 640 520"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="640" height="520" fill="#E7E2D3" />
        <circle cx="472" cy="142" r="52" fill="#D97757" />
        <path d="M0 315L211 234L416 289L640 214V520H0V315Z" fill="#9AAB82" />
        <path d="M0 365L216 278L416 333L640 258V520H0V365Z" fill="#718B67" />
        <path d="M0 410L216 322L416 378L640 302V520H0V410Z" fill="#526F55" />
        <path d="M0 458L216 370L416 425L640 348V520H0V458Z" fill="#344F40" />
        <path d="M-39 510L218 395L679 523" stroke="#D8C89B" strokeWidth="3" />
        <path d="M24 520L231 400L561 520" stroke="#D8C89B" strokeWidth="3" />
        <path d="M116 520L252 403L452 520" stroke="#D8C89B" strokeWidth="3" />
        <path d="M214 520L270 407L343 520" stroke="#D8C89B" strokeWidth="3" />
        <path d="M-20 447L637 447" stroke="#D8C89B" strokeWidth="2" opacity=".8" />
        <path d="M37 424L593 424" stroke="#D8C89B" strokeWidth="2" opacity=".8" />
        <path d="M102 400L546 400" stroke="#D8C89B" strokeWidth="2" opacity=".8" />
        <path d="M168 376L500 376" stroke="#D8C89B" strokeWidth="2" opacity=".8" />
        <path d="M232 352L456 352" stroke="#D8C89B" strokeWidth="2" opacity=".8" />
        <path d="M300 328L411 328" stroke="#D8C89B" strokeWidth="2" opacity=".8" />
        <path d="M368 305L367 245M367 279C346 273 339 257 339 244C357 248 366 259 367 279ZM368 264C383 254 389 240 385 226C371 233 366 247 368 264Z" stroke="#344F40" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M366 246C350 236 347 222 352 211C365 220 369 231 366 246Z" fill="#718B67" />
      </svg>
      <div className="glass-panel absolute bottom-4 left-4 right-4 flex items-end justify-between rounded-warm border border-white/80 px-4 py-3 text-daichi-forest sm:bottom-6 sm:left-6 sm:right-6 sm:px-5 sm:py-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em]">Made for the people who grow it</p>
          <p className="mt-1 font-serif text-2xl italic sm:text-3xl">From field to fair deal.</p>
        </div>
        <Leaf aria-hidden="true" className="mb-1 h-5 w-5 shrink-0" strokeWidth={1.5} />
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-daichi-bg text-daichi-charcoal">
      <header className="mx-auto flex max-w-7xl items-center justify-between border-b border-daichi-forest/15 px-5 py-5 sm:px-8 lg:px-12">
        <Link href="/" className="group flex items-center gap-3" aria-label="Daichi home">
          <span className="flex h-10 w-10 items-center justify-center bg-daichi-forest text-daichi-bg">
            <Leaf aria-hidden="true" className="h-5 w-5" strokeWidth={1.7} />
          </span>
          <span>
            <span className="block font-serif text-2xl leading-none tracking-tight">daichi</span>
            <span className="mt-1 block text-[9px] font-semibold uppercase tracking-[0.16em] text-daichi-muted">
              Digital agriculture
            </span>
          </span>
        </Link>
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-2 border-b border-daichi-forest pb-1 text-xs font-semibold text-daichi-forest transition-colors hover:text-daichi-clay sm:text-sm"
        >
          Go to marketplace <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </header>

      <section className="mx-auto grid max-w-7xl items-center gap-9 px-5 pb-14 pt-10 sm:px-8 sm:pb-20 sm:pt-14 lg:grid-cols-[1fr_0.92fr] lg:gap-16 lg:px-12 lg:pb-24 lg:pt-20">
        <div className="max-w-2xl">
          <p className="mb-6 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-daichi-sage sm:text-xs">
            <span className="h-px w-8 bg-daichi-clay" />
            Better tools for Bangladesh&apos;s farmers
          </p>
          <h1 className="font-serif text-[clamp(3.25rem,6.5vw,5.75rem)] leading-[0.94] tracking-[-0.055em]">
            Your harvest deserves{" "}
            <span className="italic text-daichi-forest">a fair market.</span>
          </h1>
          <p className="mt-7 max-w-lg text-base leading-7 text-daichi-muted sm:mt-8 sm:text-lg sm:leading-8">
            Sell directly to buyers, make sense of your crop health, and plan
            around the weather. Practical support for the work you already do.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4 sm:mt-10">
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-3 bg-daichi-forest px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#243c32]"
            >
              Find a buyer <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <a
              href="#tools"
              className="inline-flex items-center gap-2 text-sm font-semibold text-daichi-forest hover:text-daichi-clay"
            >
              Explore the tools <ArrowDown aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="lg:pl-3">
          <FieldIllustration />
          <p className="mt-3 text-right text-[10px] font-medium uppercase tracking-[0.16em] text-daichi-muted">
            Daichi / Grown with care, built with farmers
          </p>
        </div>
      </section>

      <section id="tools" className="border-y border-daichi-forest/15 bg-[#f3f0e9]/75">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
          <div className="mb-8 flex flex-col justify-between gap-3 sm:mb-10 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-daichi-clay">
                Straightforward support
              </p>
              <h2 className="mt-2 font-serif text-3xl tracking-tight sm:text-4xl">
                What do you need today?
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-daichi-muted">
              Start with one task. Your tools are here when you need them.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.number}
                  href={tool.href}
                  className="group rounded-warm-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-daichi-forest focus-visible:ring-offset-2"
                >
                  <GlassCard className="flex h-full min-h-56 flex-col border border-daichi-forest/10 bg-white/65 p-5 sm:p-6">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold tracking-[0.16em] text-daichi-clay">
                        {tool.number}
                      </span>
                      <Icon
                        aria-hidden="true"
                        className="h-5 w-5 text-daichi-sage transition-transform group-hover:-translate-y-0.5 group-hover:text-daichi-forest"
                        strokeWidth={1.6}
                      />
                    </div>
                    <h3 className="mt-7 font-serif text-xl">{tool.title}</h3>
                    <p className="mt-2 max-w-60 text-sm leading-6 text-daichi-muted">
                      {tool.description}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-2 pt-5 text-xs font-semibold text-daichi-forest">
                      {tool.link}
                      <ArrowRight
                      aria-hidden="true"
                      className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                      />
                    </span>
                  </GlassCard>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-[10px] font-medium uppercase tracking-[0.12em] text-daichi-muted sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <span>Daichi / Digital agriculture</span>
        <span>Built for a fairer way to grow</span>
      </footer>
    </main>
  );
}
