import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import {
    Users, BookOpen, Heart, Package, Globe, Gavel,
    ArrowRight, ExternalLink, Calendar, Mail, Linkedin,
    Instagram, Facebook, Twitter, Menu, X, ChevronRight,
    MapPin, Award, CheckCircle2, Send, Sparkles
} from 'lucide-react';
import { HUB_CONTENT } from './constants';

const IconMap: Record<string, React.ElementType> = { Users, BookOpen, Heart, Package, Globe, Gavel };

/* ─── Starfield Canvas ─── */
function StarField() {
    const ref = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const c = ref.current!;
        const ctx = c.getContext('2d')!;
        let raf: number;
        const particles: { x: number; y: number; z: number; px: number; py: number }[] = [];
        let W = 0, H = 0, mx = 0, my = 0;

        const resize = () => { W = c.width = c.offsetWidth; H = c.height = c.offsetHeight; };
        resize();
        window.addEventListener('resize', resize);

        for (let i = 0; i < 140; i++)
            particles.push({ x: (Math.random() - .5) * 1000, y: (Math.random() - .5) * 1000, z: Math.random() * 1000, px: 0, py: 0 });

        const onMove = (e: MouseEvent) => { mx = e.clientX - W / 2; my = e.clientY - H / 2; };
        window.addEventListener('mousemove', onMove);

        const draw = () => {
            ctx.clearRect(0, 0, W, H);
            for (const p of particles) {
                p.z -= 1.4;
                if (p.z <= 0) { p.x = (Math.random() - .5) * 1000; p.y = (Math.random() - .5) * 1000; p.z = 1000; p.px = 0; p.py = 0; }
                const sx = (p.x - mx * .02) / (p.z / 300) + W / 2;
                const sy = (p.y - my * .02) / (p.z / 300) + H / 2;
                const a = 1 - p.z / 1000;
                const r = Math.max(a * 2.5, .2);
                ctx.beginPath();
                ctx.arc(sx, sy, r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(100,180,255,${a * .85})`;
                ctx.fill();
                if (p.px && p.py) {
                    ctx.beginPath(); ctx.moveTo(p.px, p.py); ctx.lineTo(sx, sy);
                    ctx.strokeStyle = `rgba(96,165,250,${a * .25})`; ctx.lineWidth = r * .5; ctx.stroke();
                }
                p.px = sx; p.py = sy;
            }
            raf = requestAnimationFrame(draw);
        };
        draw();
        return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); window.removeEventListener('mousemove', onMove); };
    }, []);
    return <canvas ref={ref} className="absolute inset-0 w-full h-full" aria-hidden />;
}

/* ─── CSS 3D Globe ─── */
function Globe3D() {
    return (
        <div className="globe-outer">
            <div className="globe">
                {Array.from({ length: 8 }, (_, i) => (
                    <div key={i} className="meridian" style={{ transform: `rotateY(${i * 22.5}deg)` }} />
                ))}
                {[15, 30, 45, 60, 75].map(top => (
                    <div key={top} className="parallel" style={{ top: `${top}%` }} />
                ))}
                <div className="globe-shine" />
            </div>
            <div className="orb-ring" />
            <div className="orb-dot" />
            {/* Floating badges */}
            <div className="float-badge" style={{ top: '10%', right: '-10%', animationDelay: '0s' }}>
                <span className="badge-label">Founded</span>
                <span className="badge-val">2022</span>
            </div>
            <div className="float-badge" style={{ bottom: '10%', left: '-10%', animationDelay: '1.5s' }}>
                <span className="badge-label">Members</span>
                <span className="badge-val">69+</span>
            </div>
        </div>
    );
}

/* ─── Animated Counter ─── */
function Counter({ value }: { value: string }) {
    const [n, setN] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const done = useRef(false);
    const num = parseInt(value.replace(/\D/g, ''), 10) || 0;
    const suffix = value.replace(/[\d,]/g, '');
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => {
            if (!e.isIntersecting || done.current) return;
            done.current = true;
            const start = Date.now();
            const tick = () => {
                const t = Math.min((Date.now() - start) / 1800, 1);
                setN(Math.floor((1 - Math.pow(1 - t, 3)) * num));
                if (t < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        }, { threshold: .4 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [num]);
    return <span ref={ref}>{n.toLocaleString()}{suffix}</span>;
}

/* ─── 3D Tilt Card ─── */
function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const onMove = useCallback((e: React.MouseEvent) => {
        const el = ref.current!;
        const { left, top, width, height } = el.getBoundingClientRect();
        const x = ((e.clientX - left) / width - .5) * 16;
        const y = -((e.clientY - top) / height - .5) * 16;
        el.style.transform = `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg) translateZ(8px)`;
    }, []);
    const onLeave = useCallback(() => {
        ref.current!.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    }, []);
    return (
        <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
            className={className} style={{ transition: 'transform .15s ease', transformStyle: 'preserve-3d' }}>
            {children}
        </div>
    );
}

function SectionHeading({ title, subtitle, align = 'left', theme = 'light' }: { title: string; subtitle?: string; align?: 'left' | 'center'; theme?: 'light' | 'dark' }) {
    const isLight = theme === 'light';
    return (
        <div className={`mb-16 ${align === 'center' ? 'text-center flex flex-col items-center' : ''}`}>
            <motion.h2 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className={`text-4xl md:text-5xl font-extrabold mb-5 leading-tight tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {title}
            </motion.h2>
            {subtitle && (
                <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    transition={{ delay: 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className={`text-lg max-w-2xl ${isLight ? 'text-slate-500' : 'text-blue-100'} ${align === 'center' ? 'mx-auto' : ''}`}>
                    {subtitle}
                </motion.p>
            )}
            <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
                transition={{ delay: 0.25, duration: 0.55, ease: [0.16, 1, 0.3, 1] }} style={{ originX: align === 'center' ? 0.5 : 0 }}
                className={`h-1.5 w-24 mt-6 rounded-full ${isLight ? 'bg-blue-600' : 'bg-blue-300'}`} />
        </div>
    );
}

const NAV = [
    { name: 'About', href: '#about' }, { name: 'Quetta Hub', href: '#quetta' },
    { name: 'Leadership', href: '#leadership' }, { name: 'Impact', href: '#impact' },
    { name: 'Projects', href: '#projects' }, { name: 'Contact', href: '#contact' },
];

export default function App() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { scrollYProgress } = useScroll();
    const barScale = useSpring(scrollYProgress, { stiffness: 220, damping: 32 });

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => { window.removeEventListener('scroll', onScroll); };
    }, []);

    return (
        <div className="min-h-screen bg-deep font-sans overflow-x-hidden">


            {/* Scroll progress bar */}
            <motion.div className="scroll-bar" style={{ scaleX: barScale }} aria-hidden />

            {/* ═══ NAVBAR ═══ */}
            <div className="fixed top-5 inset-x-0 z-50 px-4 flex justify-center pointer-events-none">
                <motion.nav initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: .85, ease: [.16, 1, .3, 1] }}
                    className={`pointer-events-auto flex items-center justify-between gap-6 px-5 md:px-8 py-3 rounded-full w-full max-w-6xl transition-all duration-500 border ${scrolled ? 'glass-dark border-white/10 shadow-2xl shadow-black/20'
                        : 'bg-transparent border-transparent'
                        }`}>
                    <div className="flex items-center gap-2 shrink-0">
                        <div className="logo-q">Q</div>
                        <span className="font-bold text-sm md:text-base tracking-tight text-white transition-colors">
                            Global Shapers <span className="text-sky-400">Quetta</span>
                        </span>
                    </div>
                    <div className="hidden md:flex items-center gap-7">
                        {NAV.map(l => (
                            <a key={l.name} href={l.href}
                                className="text-[11px] font-bold uppercase tracking-[.14em] text-slate-300 hover:text-cyan-400 transition-colors">
                                {l.name}
                            </a>
                        ))}
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                        <a href={HUB_CONTENT.hero.secondaryLink} target="_blank" rel="noopener noreferrer"
                            className="hidden sm:flex btn-primary text-xs py-2 px-5 shadow-none">Join Us</a>
                        <button className="md:hidden p-2 rounded-full text-white hover:bg-white/10 transition-colors"
                            onClick={() => setMenuOpen(v => !v)} aria-label="Menu">
                            {menuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </motion.nav>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {menuOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setMenuOpen(false)}
                            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden" />
                        <motion.div initial={{ opacity: 0, scale: .95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: .95, y: 16 }}
                            className="fixed top-24 inset-x-4 z-50 glass-dark rounded-3xl p-8 shadow-2xl border border-white/10 md:hidden">
                            {NAV.map(l => (
                                <a key={l.name} href={l.href} onClick={() => setMenuOpen(false)}
                                    className="flex items-center justify-between py-3 text-xl font-bold text-white border-b border-white/5 last:border-0 group">
                                    {l.name}
                                    <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                                </a>
                            ))}
                            <a href={HUB_CONTENT.hero.secondaryLink} target="_blank" rel="noopener noreferrer"
                                className="btn-primary w-full mt-6 text-base py-4"
                                onClick={() => setMenuOpen(false)}>
                                Official Platform <ExternalLink size={18} />
                            </a>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ═══ HERO ═══ */}
            <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-deep">
                <StarField />
                {/* Ambient glows */}
                <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-sky-400/20 rounded-full blur-[130px] pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-white/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-16">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .15 }}
                                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-cyan-300 text-sm font-bold tracking-wider uppercase mb-6 border border-cyan-500/30 bg-cyan-500/10">
                                <Sparkles size={13} /> World Economic Forum Initiative
                            </motion.div>
                            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .25, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                className="text-5xl md:text-7xl font-black text-white leading-[1.1] mb-6 drop-shadow-lg tracking-tight">
                                Global Shapers <br /><span className="text-white drop-shadow-md">Quetta Hub</span>
                            </motion.h1>
                            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .38, duration: 0.8 }}
                                className="text-lg md:text-xl text-slate-300 mb-5 font-medium leading-relaxed">{HUB_CONTENT.hero.subheading}</motion.p>
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .48, duration: 0.8 }}
                                className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md mb-10 shadow-lg shadow-black/10">
                                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                <span className="text-sm text-white font-semibold tracking-wide uppercase">{HUB_CONTENT.hero.tagline}</span>
                            </motion.div>
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .58 }}
                                className="flex flex-col sm:flex-row gap-4">
                                <a href="#projects" className="btn-primary">
                                    {HUB_CONTENT.hero.primaryBtn} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </a>
                                <a href={HUB_CONTENT.hero.secondaryLink} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                                    {HUB_CONTENT.hero.secondaryBtn} <ExternalLink className="w-5 h-5" />
                                </a>
                            </motion.div>
                        </div>

                        {/* 3D Globe */}
                        <motion.div initial={{ opacity: 0, scale: .7, x: 50 }} animate={{ opacity: 1, scale: 1, x: 0 }}
                            transition={{ duration: 1.1, ease: 'easeOut', delay: .4 }}
                            className="hidden lg:flex items-center justify-center">
                            <Globe3D />
                        </motion.div>
                    </div>

                    {/* Partners */}
                    <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .9 }}
                        className="mt-20 pt-10 border-t border-white/8">
                        <p className="text-center text-slate-500 text-xs font-bold uppercase tracking-[.18em] mb-8">Institutional Partners & Collaborators</p>
                        <div className="flex flex-wrap justify-center gap-8 md:gap-14">
                            {HUB_CONTENT.collaborations.map(p => (
                                <div key={p} className="flex items-center gap-2 group">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center text-white font-bold text-xs group-hover:bg-blue-600/30 group-hover:border-blue-500/40 transition-all">
                                        {p.charAt(0)}
                                    </div>
                                    <span className="text-slate-500 text-xs font-bold tracking-wide group-hover:text-slate-300 transition-colors">{p}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2.2 }}
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:block" aria-hidden>
                    <div className="w-5 h-9 border-2 border-white/12 rounded-full flex justify-center pt-1">
                        <div className="w-1 h-2 bg-cyan-400/50 rounded-full" />
                    </div>
                </motion.div>
            </section>

            {/* ═══ ABOUT ═══ */}
            <section id="about" className="py-24 bg-[#f8fafc] relative overflow-hidden text-slate-900 border-b border-slate-200">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[100px] pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-start">
                        <div>
                            <div className="mb-16">
                                <motion.h2 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                                    transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                                    className="text-4xl md:text-5xl font-extrabold mb-5 leading-tight text-slate-900 tracking-tight">
                                    {HUB_CONTENT.aboutGlobal.title}
                                </motion.h2>
                                <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                                    transition={{ delay: 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                    className="text-lg max-w-2xl text-slate-600">
                                    {HUB_CONTENT.aboutGlobal.description}
                                </motion.p>
                                <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
                                    transition={{ delay: 0.25, duration: 0.55, ease: [0.16, 1, 0.3, 1] }} style={{ originX: 0 }}
                                    className="h-1.5 w-24 mt-6 rounded-full bg-blue-600" />
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-5 mb-14">
                                {HUB_CONTENT.aboutGlobal.stats.map(s => (
                                    <TiltCard key={s.label}>
                                        <div className="bg-white border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 rounded-2xl flex flex-col items-center justify-center h-[120px]">
                                            <div className="text-2xl md:text-4xl font-black text-blue-600 mb-2 tracking-tight"><Counter value={s.value} /></div>
                                            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{s.label}</div>
                                        </div>
                                    </TiltCard>
                                ))}
                            </div>
                            <ul className="space-y-5 mb-12">
                                {HUB_CONTENT.aboutGlobal.details.map((d, i) => (
                                    <motion.li key={i} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }} transition={{ delay: i * .09 }}
                                        className="flex gap-4 text-slate-700 text-lg items-start">
                                        <div className="mt-1 p-1 rounded-full bg-blue-50 text-blue-600 shrink-0 border border-blue-100">
                                            <CheckCircle2 className="w-5 h-5" />
                                        </div>
                                        {d}
                                    </motion.li>
                                ))}
                            </ul>
                            <a href={HUB_CONTENT.aboutGlobal.learnMoreLink} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 text-blue-600 font-bold text-lg group hover:gap-4 transition-all hover:text-blue-700">
                                Learn More About Global Shapers <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>

                        <TiltCard className="h-full">
                            <div className="bg-white border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-10 rounded-3xl h-full relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-[80px] pointer-events-none group-hover:bg-blue-100/50 transition-colors" />
                                <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3 relative z-10">
                                    <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100"><Award size={24} /></div>
                                    Governance & Leadership
                                </h3>
                                <div className="space-y-8 relative z-10">
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Leadership Roles</p>
                                        <div className="flex flex-wrap gap-3">
                                            {HUB_CONTENT.aboutGlobal.leadership.map(r => (
                                                <span key={r} className="px-4 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors hover:bg-slate-100">{r}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Global Governance</p>
                                        <p className="text-slate-600 text-base leading-relaxed p-4 rounded-2xl bg-slate-50 border border-slate-200">{HUB_CONTENT.aboutGlobal.governance}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Global Gatherings</p>
                                        <ul className="space-y-3">
                                            {HUB_CONTENT.aboutGlobal.gatherings.map(g => (
                                                <li key={g} className="flex items-center gap-3 text-slate-600 text-base">
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.3)]" />{g}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </TiltCard>
                    </div>
                </div>
            </section>

            {/* ═══ QUETTA HUB ═══ */}
            <section id="quetta" className="py-24 bg-deep relative overflow-hidden">
                <div className="absolute inset-0 grid-bg-light opacity-5 pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <SectionHeading title="Global Shapers Quetta Hub" align="center" theme="dark"
                        subtitle={`Founded in ${HUB_CONTENT.aboutQuetta.founded} by Founding Curator ${HUB_CONTENT.aboutQuetta.foundingCurator}.`} />
                    <div className="grid lg:grid-cols-3 gap-8 mt-12">
                        <div className="glass-dark p-10 rounded-3xl shadow-xl relative overflow-hidden group">
                            <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-[50px] group-hover:bg-indigo-500/30 transition-colors" />
                            <h3 className="text-3xl font-bold mb-6 text-white tracking-tight">Our Mission</h3>
                            <p className="text-blue-200 mb-8 text-base">To transform Quetta and empower youth through:</p>
                            <ul className="space-y-5">
                                {HUB_CONTENT.aboutQuetta.mission.map((m, i) => (
                                    <motion.li key={m} initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }} transition={{ delay: i * .08 }}
                                        className="flex items-center gap-4 font-semibold text-base text-white">
                                        <div className="w-2.5 h-2.5 bg-sky-300 rounded-full shrink-0 shadow-[0_0_10px_rgba(125,211,252,0.6)]" />{m}
                                    </motion.li>
                                ))}
                            </ul>
                        </div>
                        <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
                            {HUB_CONTENT.aboutQuetta.membership.map((tier, i) => (
                                <TiltCard key={tier.type}>
                                    <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                                        className="p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl hover:border-blue-400/50 hover:bg-white/10 transition-all h-full flex flex-col justify-center relative overflow-hidden">
                                        <div className="flex justify-between items-start mb-4 relative z-10">
                                            <h4 className="text-xl font-bold text-white">{tier.type}</h4>
                                            {tier.count && <span className="text-4xl font-black text-sky-300">{tier.count}</span>}
                                        </div>
                                        <p className="text-blue-100 text-sm font-medium relative z-10">{tier.desc}</p>
                                    </motion.div>
                                </TiltCard>
                            ))}
                            <TiltCard className="md:col-span-2">
                                <div className="p-8 glass-dark rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden h-full">
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 mix-blend-overlay"></div>
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/shattered-dark.png')] opacity-20 mix-blend-overlay"></div>
                                    <div className="relative z-10">
                                        <h4 className="text-2xl font-bold mb-2 tracking-tight">Democratic Election System</h4>
                                        <p className="text-blue-100 text-base max-w-lg">{HUB_CONTENT.aboutQuetta.elections.desc}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-3 relative z-10">
                                        {HUB_CONTENT.aboutQuetta.elections.details.map(d => (
                                            <span key={d} className="px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-xl text-sm font-bold border border-white/20 shadow-sm hover:bg-white/20 transition-colors cursor-default">{d}</span>
                                        ))}
                                    </div>
                                </div>
                            </TiltCard>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ LEADERSHIP TIMELINE ═══ */}
            <section id="leadership" className="py-24 bg-[#f8fafc] overflow-hidden relative border-y border-slate-200/60">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/clean-gray-paper.png')] opacity-[0.3] pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <SectionHeading title="Leadership Timeline" subtitle="The visionaries who have led the Quetta Hub since its inception." theme="light" align="center" />
                    <div className="relative mt-16">
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 hidden md:block" />
                        <div className="absolute top-1/2 left-0 w-1/3 h-0.5 bg-blue-400 -translate-y-1/2 hidden md:block blur-[1px]" />
                        <div className="grid md:grid-cols-4 gap-8 relative">
                            {HUB_CONTENT.leadershipTimeline.map((l, i) => (
                                <TiltCard key={l.years}>
                                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }} transition={{ delay: i * 0.15, type: 'spring', stiffness: 100 }}
                                        className="bg-white border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 rounded-3xl relative z-10 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:border-blue-200 transition-all duration-300 group cursor-default">
                                        <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-blue-600 font-black text-xl mb-6 group-hover:scale-110 group-hover:bg-blue-50 group-hover:text-blue-700 transition-all duration-300">
                                            {i + 1}
                                        </div>
                                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{l.years}</div>
                                        <h4 className="text-xl font-bold text-slate-900 mb-2">{l.name}</h4>
                                        <p className="text-blue-600 text-sm font-semibold">{l.role}</p>
                                    </motion.div>
                                </TiltCard>
                            ))}
                        </div>
                    </div>
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                        className="mt-20 bg-white border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-10 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group hover:border-blue-200 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all">
                        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-blue-50 rounded-full blur-[80px] group-hover:bg-blue-100/50 transition-colors" />
                        <div className="flex items-center gap-6 relative z-10">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center shrink-0">
                                <Gavel className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform" />
                            </div>
                            <div>
                                <h4 className="text-2xl font-bold text-slate-900 mb-2 tracking-wide">Hub Governance Charter</h4>
                                <p className="text-slate-600 text-base max-w-xl">{HUB_CONTENT.charter.desc}</p>
                            </div>
                        </div>
                        <a href={HUB_CONTENT.charter.link} target="_blank" rel="noopener noreferrer" className="btn-primary shrink-0 z-10">
                            View Charter <ExternalLink className="w-5 h-5" />
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* ═══ IMPACT AREAS ═══ */}
            <section id="impact" className="py-24 bg-[#050b1a] relative overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[100px]" />
                </div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <SectionHeading title="Key Impact Areas" align="center" theme="dark"
                        subtitle="Aligned with the UN Sustainable Development Goals and World Economic Forum priorities." />
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                        {HUB_CONTENT.impactAreas.map((area, i) => {
                            const Icon = IconMap[area.icon];
                            return (
                                <TiltCard key={area.title}>
                                    <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                        viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
                                        className="glass-dark p-8 rounded-3xl relative z-10 hover:-translate-y-2 transition-transform group shadow-xl">
                                        <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white/10 group-hover:border-cyan-400/50 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.02)] group-hover:shadow-[0_0_20px_rgba(56,189,248,0.2)]">
                                            <Icon className="w-8 h-8 text-cyan-400 group-hover:scale-110 transition-transform" />
                                        </div>
                                        <h4 className="text-xl font-bold text-white mb-4 tracking-wide">{area.title}</h4>
                                        <div className="h-1 w-12 bg-white/10 rounded-full group-hover:bg-cyan-400 group-hover:w-24 transition-all duration-300 group-hover:shadow-[0_0_10px_rgba(56,189,248,0.5)]" />
                                    </motion.div>
                                </TiltCard>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ═══ PROJECTS ═══ */}
            <section id="projects" className="py-24 bg-[#f8fafc] relative overflow-hidden border-b border-slate-200">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-50/50 rounded-full blur-[100px] pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <SectionHeading title="Major Projects" subtitle="Transforming vision into tangible impact across Balochistan." align="center" theme="light" />
                    <div className="grid lg:grid-cols-2 gap-10 mt-12">
                        {HUB_CONTENT.projects.map((p, i) => (
                            <TiltCard key={p.id}>
                                <motion.div initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}
                                    className="group bg-white border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] overflow-hidden hover:border-blue-200 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 h-full flex flex-col cursor-default">
                                    <div className="h-56 bg-slate-100 relative overflow-hidden">
                                        <img src={`https://picsum.photos/seed/qs-${p.id}/800/400`} alt={p.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700 mix-blend-multiply group-hover:mix-blend-normal"
                                            loading="lazy" referrerPolicy="no-referrer" />
                                        <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-blue-700 tracking-widest uppercase border border-slate-200 shadow-sm">
                                            {p.subtitle}
                                        </div>
                                    </div>
                                    <div className="p-8 flex-1 flex flex-col bg-white">
                                        <h4 className="text-2xl font-bold text-slate-900 mb-3 tracking-wide">{p.title}</h4>
                                        <p className="text-slate-600 text-sm mb-6 leading-relaxed flex-1">{p.desc}</p>
                                        <div className="flex flex-wrap gap-2 mb-8">
                                            {p.stats.map(s => (
                                                <span key={s} className="px-3 py-1 bg-slate-50 border border-slate-200 text-blue-600 rounded-lg text-xs font-semibold">{s}</span>
                                            ))}
                                        </div>
                                        <div className="pt-5 border-t border-slate-100 flex items-center gap-4">
                                            <div className="p-2 rounded-full bg-slate-50 border border-slate-200 text-slate-500"><Users className="w-4 h-4" /></div>
                                            <p className="text-xs text-slate-500"><span className="text-blue-600 font-bold tracking-wide">LEADS:</span> {p.leads}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </TiltCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ INTERNATIONAL ═══ */}
            <section className="py-24 bg-[#050b1a] relative overflow-hidden border-t border-b border-white/5">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none mix-blend-overlay" />
                <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <SectionHeading title="International Engagement" theme="dark"
                                subtitle="Connecting Quetta to the global stage through strategic partnerships and summits." />
                            <div className="space-y-8 mt-8">
                                {HUB_CONTENT.international.map((item, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }} className="flex gap-6 group">
                                        <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(255,255,255,0.02)] group-hover:border-cyan-400/50 group-hover:shadow-[0_0_20px_rgba(56,189,248,0.2)] transition-all duration-300">
                                            <Globe className="w-7 h-7 text-cyan-400 group-hover:scale-110 transition-transform" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-white mb-2 tracking-wide group-hover:text-cyan-400 transition-colors">{item.title}</h4>
                                            <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                        <TiltCard>
                            <div className="glass-dark p-10 rounded-3xl relative overflow-hidden group">
                                <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-[60px] group-hover:bg-indigo-500/30 transition-colors" />
                                <h3 className="text-xl font-bold mb-8 flex items-center gap-3 text-white">
                                    <div className="p-2.5 rounded-xl bg-white/5 text-cyan-400 border border-white/10 shadow-[0_0_10px_rgba(56,189,248,0.1)]"><Calendar size={20} /></div>
                                    Annual & Regional Engagements
                                </h3>
                                <div className="grid sm:grid-cols-2 gap-4 relative z-10">
                                    {HUB_CONTENT.engagements.map(e => (
                                        <div key={e} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-cyan-500/30 hover:bg-white/10 transition-all cursor-default group/item">
                                            <div className="w-2 h-2 bg-indigo-400 rounded-full shrink-0 shadow-[0_0_8px_rgba(129,140,248,0.8)] group-hover/item:bg-cyan-400 group-hover/item:shadow-[0_0_10px_rgba(56,189,248,0.8)] transition-colors" />
                                            <span className="text-sm font-semibold text-slate-200 group-hover/item:text-white transition-colors">{e}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </TiltCard>
                    </div>
                </div>
            </section>

            {/* ═══ COLLABORATIONS ═══ */}
            <section className="py-24 bg-[#f8fafc] relative overflow-hidden border-b border-slate-200 text-center">
                <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-blue-100/50 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-sky-100/50 rounded-full blur-[120px] pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <SectionHeading title="Our Collaborations" align="center" theme="light"
                        subtitle="We work with leading institutions to amplify our impact in Balochistan." />
                    <div className="flex flex-wrap justify-center gap-8 md:gap-14 mt-12">
                        {HUB_CONTENT.collaborations.map((c, i) => (
                            <TiltCard key={c}>
                                <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }} transition={{ delay: i * 0.08, type: 'spring' }}
                                    className="flex flex-col items-center gap-5 group cursor-default">
                                    <div className="w-24 h-24 bg-white border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl flex items-center justify-center text-blue-600 font-black text-3xl group-hover:bg-blue-50 group-hover:text-blue-700 group-hover:border-blue-200 group-hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
                                        <span className="relative z-10 group-hover:scale-110 transition-transform">{c.charAt(0)}</span>
                                    </div>
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center max-w-[130px] group-hover:text-blue-600 transition-colors">{c}</span>
                                </motion.div>
                            </TiltCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ VISION ═══ */}
            <section className="py-32 bg-[#050b1a] relative overflow-hidden border-t border-b border-white/10">
                <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-sky-400/10 rounded-full blur-[150px] pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[130px] pointer-events-none" />
                <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 40, ease: 'linear' }}
                        className="w-20 h-20 mx-auto mb-12 rounded-full border border-cyan-500/30 bg-white/5 backdrop-blur-sm flex items-center justify-center shadow-[0_0_30px_rgba(56,189,248,0.2)]" aria-hidden>
                        <Globe className="w-10 h-10 text-cyan-400" />
                    </motion.div>
                    <motion.h2 initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
                        className="text-3xl md:text-5xl font-bold mb-10 leading-relaxed italic text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-slate-400 drop-shadow-lg">
                        "{HUB_CONTENT.vision}"
                    </motion.h2>
                    <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
                        transition={{ delay: 0.4, duration: 0.8 }} style={{ originX: 0.5 }}
                        className="h-1 w-32 bg-gradient-to-r from-cyan-400 to-indigo-500 mx-auto rounded-full shadow-[0_0_15px_rgba(56,189,248,0.5)]" />
                </div>
            </section>

            {/* ═══ CONTACT ═══ */}
            <section id="contact" className="py-24 bg-[#f8fafc] relative overflow-hidden text-slate-900 border-v border-slate-200">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/60 rounded-full blur-[120px] pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16">
                        <div>
                            <SectionHeading title="Get in Touch" subtitle="Have questions or want to collaborate? Reach out to the Quetta Hub team." theme="light" />
                            <div className="space-y-8 mt-4">
                                {[
                                    { icon: Mail, label: 'Email Us', val: HUB_CONTENT.socials.email, href: `mailto:${HUB_CONTENT.socials.email}` },
                                    { icon: MapPin, label: 'Location', val: 'Quetta, Balochistan, Pakistan', href: null },
                                ].map(({ icon: Icon, label, val, href }) => (
                                    <motion.div key={label} initial={{ opacity: 0, x: -18 }} whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }} className="flex items-center gap-6 group cursor-default">
                                        <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-blue-600 shadow-[0_8px_20px_rgb(0,0,0,0.03)] group-hover:scale-105 group-hover:bg-blue-50 group-hover:border-blue-200 transition-all duration-300">
                                            <Icon className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">{label}</p>
                                            {href ? (
                                                <a href={href} className="text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors tracking-wide border-b border-transparent hover:border-blue-200 pb-0.5">{val}</a>
                                            ) : (
                                                <p className="text-lg font-bold text-slate-900 tracking-wide">{val}</p>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            <div className="mt-16">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Follow Our Journey</p>
                                <div className="flex flex-wrap gap-4">
                                    {[
                                        { icon: Linkedin, href: HUB_CONTENT.socials.linkedin, label: 'LinkedIn' },
                                        { icon: Instagram, href: HUB_CONTENT.socials.instagram, label: 'Instagram' },
                                        { icon: Facebook, href: HUB_CONTENT.socials.facebook, label: 'Facebook' },
                                        { icon: Twitter, href: HUB_CONTENT.socials.x, label: 'Twitter' },
                                    ].map(s => (
                                        <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                                            className="w-14 h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-500 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-[0_10px_20px_rgba(37,99,235,0.2)] transition-all duration-300 hover:-translate-y-1">
                                            <s.icon className="w-6 h-6" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <TiltCard>
                            <div className="bg-white border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-10 rounded-3xl h-full relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/50 rounded-full blur-[60px] group-hover:bg-blue-200/50 transition-colors" />
                                <form className="space-y-6 relative z-10" onSubmit={e => e.preventDefault()}>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">Full Name</label>
                                            <input type="text" placeholder="Jane Doe" className="form-input !bg-slate-50 !border-slate-200 !text-slate-900 !placeholder-slate-400 focus:!border-blue-400 focus:!bg-white focus:!ring-4 focus:!ring-blue-100" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">Email Address</label>
                                            <input type="email" placeholder="jane@example.com" className="form-input !bg-slate-50 !border-slate-200 !text-slate-900 !placeholder-slate-400 focus:!border-blue-400 focus:!bg-white focus:!ring-4 focus:!ring-blue-100" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">Subject</label>
                                        <input type="text" placeholder="How can we help?" className="form-input !bg-slate-50 !border-slate-200 !text-slate-900 !placeholder-slate-400 focus:!border-blue-400 focus:!bg-white focus:!ring-4 focus:!ring-blue-100" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">Message</label>
                                        <textarea rows={5} placeholder="Your message here..." className="form-input !bg-slate-50 !border-slate-200 !text-slate-900 !placeholder-slate-400 focus:!border-blue-400 focus:!bg-white focus:!ring-4 focus:!ring-blue-100 resize-none" />
                                    </div>
                                    <button type="submit" className="btn-primary w-full py-4 text-lg tracking-wide rounded-2xl mt-4">
                                        Send Message <Send className="w-5 h-5 ml-2" />
                                    </button>
                                </form>
                            </div>
                        </TiltCard>
                    </div>
                </div>
            </section>

            {/* ═══ FOOTER ═══ */}
            <footer className="bg-[#050b1a] text-white pt-24 pb-12 relative overflow-hidden border-t border-white/10">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-4 gap-12 mb-16">
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="logo-q text-xl w-12 h-12">Q</div>
                                <span className="font-bold text-2xl text-white tracking-tight">Global Shapers <span className="text-cyan-400">Quetta</span></span>
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-8">
                                An initiative of the World Economic Forum. Locally rooted, globally connected, youth-led, and impact-driven hub in Balochistan, Pakistan.
                            </p>
                            <div className="flex gap-6">
                                <a href={HUB_CONTENT.socials.linktree} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-cyan-400 hover:text-white border-b border-cyan-400/30 hover:border-white pb-1 transition-all">Linktree</a>
                                <a href={HUB_CONTENT.socials.forum} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-cyan-400 hover:text-white border-b border-cyan-400/30 hover:border-white pb-1 transition-all">Forum Spaces</a>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-lg font-bold mb-8 text-white tracking-wide">Quick Links</h4>
                            <ul className="space-y-4">
                                {NAV.map(l => (
                                    <li key={l.name}>
                                        <a href={l.href} className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-3 text-sm font-medium group">
                                            <ChevronRight className="w-4 h-4 text-cyan-500 group-hover:translate-x-1 transition-transform" />{l.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-bold mb-8 text-white tracking-wide">Official Platforms</h4>
                            <ul className="space-y-4">
                                {[['LinkedIn', HUB_CONTENT.socials.linkedin], ['Instagram', HUB_CONTENT.socials.instagram], ['Facebook', HUB_CONTENT.socials.facebook], ['X (Twitter)', HUB_CONTENT.socials.x], ['TikTok', HUB_CONTENT.socials.tiktok]].map(([name, href]) => (
                                    <li key={name} className="flex"><a href={href} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm font-medium">{name}</a></li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <p className="text-slate-500 text-sm font-medium">© {new Date().getFullYear()} Global Shapers Community – Quetta Hub.</p>
                        <div className="flex gap-8">
                            <a href="#" className="text-slate-500 hover:text-white text-sm font-medium transition-colors">Privacy Policy</a>
                            <a href="#" className="text-slate-500 hover:text-white text-sm font-medium transition-colors">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
