import { useEffect, useRef, useState } from 'react';
import { IMAGES } from '@/lib/images';

type Crew = {
  file: string;
  codename: string;
  name: string;
  quote: string;
  img: string;
  side: 'left' | 'right' | 'center';
  accent: string; // hex
  ambient: string; // rgba for glow
};

const CREW: Crew[] = [
  {
    file: 'FILE 01',
    codename: 'THE LITTLE DEVIL',
    name: 'Rebecca',
    quote: "I don't do second chances.",
    img: IMAGES.crew.rebecca,
    side: 'left',
    accent: '#FF6FAE',
    ambient: 'rgba(255, 111, 174, 0.14)',
  },
  {
    file: 'FILE 02',
    codename: 'THE PATRIARCH',
    name: 'Maine',
    quote: "The streets don't forget. Neither do I.",
    img: IMAGES.crew.maine,
    side: 'right',
    accent: '#FFB454',
    ambient: 'rgba(255, 180, 84, 0.14)',
  },
  {
    file: 'FILE 03',
    codename: 'THE GHOST',
    name: 'Kiwi',
    quote: "Every secret has a price. I just collect.",
    img: IMAGES.crew.kiwi,
    side: 'left',
    accent: '#3FE0C8',
    ambient: 'rgba(63, 224, 200, 0.14)',
  },
  {
    file: 'FILE 04',
    codename: 'THE BLADE',
    name: 'Dorio',
    quote: "Loyalty is the only currency I trust.",
    img: IMAGES.crew.dorio,
    side: 'right',
    accent: '#B985FF',
    ambient: 'rgba(185, 133, 255, 0.14)',
  },
  {
    file: 'FILE 05',
    codename: 'THE LOUDMOUTH',
    name: 'Pilar',
    quote: "Talk big. Hit harder.",
    img: IMAGES.crew.pilar,
    side: 'left',
    accent: '#FF8A4C',
    ambient: 'rgba(255, 138, 76, 0.14)',
  },
  {
    file: 'FILE 06',
    codename: 'THE KID',
    name: 'David Martinez',
    quote: "I'm not trying to be a legend. I'm trying to stay alive.",
    img: IMAGES.crew.david,
    side: 'right',
    accent: '#4FB8FF',
    ambient: 'rgba(79, 184, 255, 0.14)',
  },
  {
    file: 'FILE 07',
    codename: 'THE MOON DREAMER',
    name: 'Lucyna "Lucy" Kushinada',
    quote: "I'll take you to the moon. If you're ready to fall.",
    img: IMAGES.crew.lucy,
    side: 'left',
    accent: '#FF6FD8',
    ambient: 'rgba(255, 111, 216, 0.14)',
  },
  {
    file: 'FILE 08',
    codename: 'THE FINAL BOSS',
    name: 'Adam Smasher',
    quote: "Legends die. I don't.",
    img: IMAGES.crew.smasher,
    side: 'center',
    accent: '#FF2D2D',
    ambient: 'rgba(255, 45, 45, 0.18)',
  },
];

function useInView<T extends HTMLElement>(threshold = 0.18) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            obs.unobserve(e.target);
          }
        });
      },
      { threshold, rootMargin: '0px 0px -10% 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function useParallax(strength = 60) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const progress = (vh / 2 - (rect.top + rect.height / 2)) / vh;
        el.style.setProperty('--parallax', String(progress * strength));
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [strength]);
  return ref;
}

function CrewEntry({ c, index }: { c: Crew; index: number }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);
  const imgParallax = useParallax(50);
  const textParallax = useParallax(24);
  const isFinal = c.side === 'center';

  const justify = isFinal
    ? 'justify-center text-center items-center'
    : c.side === 'left'
    ? 'justify-start text-left items-start'
    : 'justify-end text-right items-end';

  return (
    <div
      ref={ref}
      className="relative flex min-h-[88vh] items-center"
      style={{ perspective: '1400px' }}
    >
      {/* Ambient lighting per character */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-1000"
        style={{
          opacity: inView ? 1 : 0,
          background: `radial-gradient(60% 60% at 50% 45%, ${c.ambient} 0%, transparent 70%)`,
        }}
      />

      {/* Background artwork — deep, moving through space */}
      <div
        ref={imgParallax}
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center overflow-hidden"
        style={{
          transform: inView
            ? 'translateY(calc(var(--parallax) * 1px)) translateZ(0) scale(1)'
            : 'translateZ(-420px) scale(1.35) rotateX(8deg)',
          filter: inView ? 'blur(0px)' : 'blur(14px)',
          opacity: inView ? 0.42 : 0,
          transition:
            'transform 1.5s cubic-bezier(0.16,1,0.3,1), filter 1.4s ease, opacity 1.2s ease',
        }}
      >
        <img
          src={c.img}
          alt={c.name}
          className="h-full w-full object-cover"
          style={{ filter: 'contrast(1.1) saturate(1.2) brightness(0.7)' }}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cyber-darker via-cyber-darker/40 to-cyber-darker/70" />
      </div>

      {/* Foreground content */}
      <div
        ref={textParallax}
        className={`relative z-10 mx-auto flex w-full max-w-6xl flex-col ${justify} px-6`}
        style={{
          transform: 'translateY(calc(var(--parallax) * 1px))',
        }}
      >
        {/* Image — cinematic portrait, moves toward viewer */}
        <div
          className="relative mb-10 overflow-hidden"
          style={{
            width: isFinal ? 'min(420px, 70vw)' : 'min(340px, 42vw)',
            aspectRatio: '3 / 4',
            transformStyle: 'preserve-3d',
            transform: inView
              ? 'translateZ(0) scale(1) rotateX(0deg)'
              : 'translateZ(-260px) scale(1.18) rotateX(6deg)',
            filter: inView ? 'blur(0px)' : 'blur(8px)',
            opacity: inView ? 1 : 0,
            transition:
              'transform 1.5s cubic-bezier(0.16,1,0.3,1), filter 1.3s ease, opacity 1.1s ease',
          }}
        >
          <img
            src={c.img}
            alt={c.name}
            className="h-full w-full object-cover transition-transform duration-700"
            style={{ filter: 'contrast(1.15) saturate(1.25) brightness(0.82)' }}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cyber-darker/90 via-transparent to-transparent" />
          <div
            className="absolute inset-0 transition-opacity duration-500"
            style={{ boxShadow: `inset 0 0 60px ${c.ambient}` }}
          />
          {/* hover micro-interaction handled via group on wrapper */}
          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ boxShadow: `0 0 40px ${c.ambient}` }}
          />
        </div>

        {/* FILE label */}
        <div
          className="font-mono text-xs tracking-[0.4em] text-gray-500"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(14px)',
            transition: 'opacity 0.7s ease 0.2s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s',
          }}
        >
          {c.file}
        </div>

        {/* Codename */}
        <div
          className="mt-4 font-mono text-sm tracking-[0.35em]"
          style={{
            color: c.accent,
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.7s ease 0.4s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.4s',
          }}
        >
          {c.codename}
        </div>

        {/* Name — oversized, bold */}
        <h3
          className={`mt-3 font-display font-black leading-[0.95] tracking-tight text-white ${
            isFinal
              ? 'text-6xl sm:text-7xl md:text-8xl'
              : 'text-5xl sm:text-6xl md:text-7xl'
          }`}
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(22px)',
            transition: 'opacity 0.8s ease 0.55s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.55s',
          }}
        >
          {isFinal ? (
            <span
              className={`inline-block ${inView ? 'crew-glitch' : ''}`}
              data-text={c.name}
            >
              {c.name}
            </span>
          ) : (
            c.name
          )}
        </h3>

        {/* Quote */}
        <p
          className="mt-6 max-w-md font-body text-lg italic leading-relaxed text-gray-300"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(18px)',
            transition: 'opacity 0.8s ease 0.7s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.7s',
          }}
        >
          "{c.quote}"
        </p>

        {/* Accent line */}
        <div
          className="mt-8 h-px"
          style={{
            width: inView ? '64px' : '0px',
            background: c.accent,
            transition: 'width 0.9s cubic-bezier(0.16,1,0.3,1) 0.85s',
          }}
        />
      </div>

      {/* Subtle file index marker */}
      <div className="pointer-events-none absolute right-6 top-8 font-mono text-[10px] tracking-[0.3em] text-gray-700">
        {String(index + 1).padStart(2, '0')} / 08
      </div>
    </div>
  );
}

export default function CrewDatabase() {
  return (
    <section
      id="crew"
      className="relative overflow-hidden bg-cyber-darker"
    >
      {/* Section header */}
      <div className="mx-auto max-w-6xl px-6 pt-32 pb-8 text-center">
        <div className="reveal font-mono text-xs tracking-[0.4em] text-cyber-magenta">
          // CREW DATABASE
        </div>
        <h2 className="reveal mt-6 font-display text-5xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl">
          LEGENDS <span className="text-cyber-yellow">NEVER</span> DIE.
        </h2>
        <p
          className="reveal mx-auto mt-6 max-w-md font-body text-lg italic text-gray-400"
          style={{ transitionDelay: '200ms' }}
        >
          Every legend leaves a mark.
        </p>
      </div>

      {/* Character files */}
      <div className="relative">
        {CREW.map((c, i) => (
          <CrewEntry key={c.name} c={c} index={i} />
        ))}
      </div>

      {/* Closing breath */}
      <div className="mx-auto max-w-6xl px-6 py-32 text-center">
        <div
          className="mx-auto h-px w-24"
          style={{
            background: 'linear-gradient(90deg, transparent, #FF2D2D, transparent)',
          }}
        />
        <p className="mt-8 font-mono text-xs tracking-[0.4em] text-gray-600">
          END OF TRANSMISSION
        </p>
      </div>
    </section>
  );
}
