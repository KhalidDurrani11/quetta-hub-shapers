import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  BookOpen, 
  Heart, 
  Package, 
  Globe, 
  Gavel, 
  ArrowRight, 
  ExternalLink, 
  Calendar, 
  Mail, 
  Linkedin, 
  Instagram, 
  Facebook, 
  Twitter, 
  Menu, 
  X, 
  ChevronRight,
  MapPin,
  Award,
  CheckCircle2,
  Send
} from 'lucide-react';
import { HUB_CONTENT } from './constants';

const IconMap: Record<string, any> = {
  Users,
  BookOpen,
  Heart,
  Package,
  Globe,
  Gavel
};

const SectionHeading = ({ title, subtitle, light = false }: { title: string; subtitle?: string; light?: boolean }) => (
  <div className="mb-12 md:mb-16">
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`text-3xl md:text-4xl font-bold mb-4 ${light ? 'text-white' : 'text-slate-900'}`}
    >
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className={`text-lg max-w-2xl ${light ? 'text-slate-300' : 'text-slate-600'}`}
      >
        {subtitle}
      </motion.p>
    )}
    <div className={`h-1 w-20 mt-6 ${light ? 'bg-white' : 'bg-blue-600'}`} />
  </div>
);

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Quetta Hub', href: '#quetta' },
    { name: 'Leadership', href: '#leadership' },
    { name: 'Impact', href: '#impact' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Navbar */}
      <div className="fixed top-6 left-0 right-0 z-50 px-6 flex justify-center pointer-events-none">
        <motion.nav 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={`pointer-events-auto flex items-center justify-between gap-4 md:gap-8 px-4 md:px-8 py-3 rounded-full transition-all duration-500 border ${
            scrolled 
              ? 'bg-white/80 backdrop-blur-xl border-slate-200 shadow-2xl shadow-blue-900/10 w-full max-w-5xl' 
              : 'bg-slate-900/40 backdrop-blur-md border-white/10 w-full max-w-7xl'
          }`}
        >
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">Q</div>
            <span className={`font-bold text-sm md:text-base tracking-tight ${scrolled ? 'text-slate-900' : 'text-white'}`}>
              Global Shapers <span className="text-blue-500">Quetta</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className={`text-[10px] lg:text-xs font-bold uppercase tracking-[0.15em] transition-colors hover:text-blue-500 ${scrolled ? 'text-slate-600' : 'text-slate-200'}`}
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            <a 
              href={HUB_CONTENT.hero.secondaryLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:block bg-blue-600 text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
            >
              Join Us
            </a>
            
            {/* Mobile Menu Toggle */}
            <button 
              className={`md:hidden p-2 rounded-full transition-colors ${scrolled ? 'text-slate-900 hover:bg-slate-100' : 'text-white hover:bg-white/10'}`} 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </motion.nav>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm md:hidden"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-24 left-6 right-6 z-50 bg-white rounded-3xl p-8 shadow-2xl md:hidden border border-slate-100"
            >
              <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <a 
                    key={link.name} 
                    href={link.href} 
                    className="text-xl font-bold text-slate-900 flex items-center justify-between group"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 transition-colors" />
                  </a>
                ))}
                <div className="pt-6 border-t border-slate-100">
                  <a 
                    href={HUB_CONTENT.hero.secondaryLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-blue-600 text-white px-8 py-4 rounded-2xl text-lg font-bold flex items-center justify-center gap-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Official Platform <ExternalLink size={20} />
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/quetta-landscape/1920/1080?blur=2" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-30"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900 to-slate-900" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block px-4 py-1.5 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-400 text-sm font-bold tracking-wider uppercase mb-6"
              >
                World Economic Forum Initiative
              </motion.span>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6"
              >
                {HUB_CONTENT.hero.title}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl md:text-2xl text-slate-300 mb-4 font-medium"
              >
                {HUB_CONTENT.hero.subheading}
              </motion.p>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-lg text-slate-400 mb-10 italic border-l-2 border-blue-600 pl-4"
              >
                {HUB_CONTENT.hero.tagline}
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <a 
                  href="#projects" 
                  className="group bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20"
                >
                  {HUB_CONTENT.hero.primaryBtn}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <a 
                  href={HUB_CONTENT.hero.secondaryLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-full text-lg font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                >
                  {HUB_CONTENT.hero.secondaryBtn}
                  <ExternalLink className="w-5 h-5" />
                </a>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
              className="relative hidden lg:block"
            >
              <div className="relative z-10 rounded-3xl overflow-hidden border border-white/10 shadow-2xl aspect-[4/5] max-w-md mx-auto">
                <img 
                  src="https://picsum.photos/seed/curator-spotlight/800/1000" 
                  alt="Curator Spotlight" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <p className="text-blue-400 text-sm font-bold uppercase tracking-widest mb-1">Current Leadership</p>
                  <h3 className="text-2xl font-bold text-white">Mumtaz Alam</h3>
                  <p className="text-slate-300">Curator (2025–2026)</p>
                </div>
              </div>
              {/* Decorative Elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl" />
            </motion.div>
          </div>

          {/* Partner Logos Strip */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-20 pt-12 border-t border-white/10"
          >
            <p className="text-center text-slate-500 text-sm font-bold uppercase tracking-[0.2em] mb-8">Institutional Partners & Collaborators</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 hover:opacity-100 transition-opacity duration-500">
              {HUB_CONTENT.collaborations.map((partner, i) => (
                <div key={partner} className="flex items-center gap-2 group cursor-default">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-white font-bold text-xs group-hover:bg-blue-600 transition-colors">
                    {partner.charAt(0)}
                  </div>
                  <span className="text-white/60 text-xs font-bold tracking-wider group-hover:text-white transition-colors">{partner}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/30 hidden md:block"
        >
          <div className="w-6 h-10 border-2 border-white/10 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-white/30 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* About Global Section */}
      <section id="about" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <SectionHeading 
                title={HUB_CONTENT.aboutGlobal.title} 
                subtitle={HUB_CONTENT.aboutGlobal.description}
              />
              
              <div className="grid grid-cols-3 gap-6 mb-12">
                {HUB_CONTENT.aboutGlobal.stats.map((stat) => (
                  <div key={stat.label} className="text-center p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                    <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">{stat.value}</div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>

              <ul className="space-y-4 mb-10">
                {HUB_CONTENT.aboutGlobal.details.map((detail, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>

              <a 
                href={HUB_CONTENT.aboutGlobal.learnMoreLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all"
              >
                Learn More About Global Shapers <ArrowRight className="w-5 h-5" />
              </a>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Award className="text-blue-600" /> Governance & Leadership
                </h3>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-bold text-slate-400 uppercase mb-2">Leadership Roles</p>
                    <div className="flex flex-wrap gap-2">
                      {HUB_CONTENT.aboutGlobal.leadership.map(role => (
                        <span key={role} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold">{role}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-400 uppercase mb-2">Global Governance</p>
                    <p className="text-slate-700 font-medium leading-relaxed">{HUB_CONTENT.aboutGlobal.governance}</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-400 uppercase mb-2">Global Gatherings</p>
                    <ul className="space-y-2">
                      {HUB_CONTENT.aboutGlobal.gatherings.map(item => (
                        <li key={item} className="flex items-center gap-2 text-slate-700 text-sm font-medium">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quetta Hub Section */}
      <section id="quetta" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading 
            title="Global Shapers Quetta Hub" 
            subtitle={`Founded in ${HUB_CONTENT.aboutQuetta.founded} by Founding Curator ${HUB_CONTENT.aboutQuetta.foundingCurator}.`}
          />

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <div className="lg:col-span-1 bg-slate-900 text-white p-8 rounded-3xl">
              <h3 className="text-2xl font-bold mb-6">Our Mission</h3>
              <p className="text-slate-400 mb-8">To transform Quetta and empower youth through focused impact areas:</p>
              <ul className="space-y-4">
                {HUB_CONTENT.aboutQuetta.mission.map(item => (
                  <li key={item} className="flex items-center gap-3 font-semibold">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" /> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
              {HUB_CONTENT.aboutQuetta.membership.map((tier) => (
                <div key={tier.type} className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:border-blue-200 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-xl font-bold text-slate-900">{tier.type}</h4>
                    {tier.count && <span className="text-3xl font-bold text-blue-600">{tier.count}</span>}
                  </div>
                  <p className="text-slate-600 font-medium">{tier.desc}</p>
                </div>
              ))}
              <div className="p-8 bg-blue-600 text-white rounded-3xl md:col-span-2 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h4 className="text-xl font-bold mb-2">Democratic Election System</h4>
                  <p className="text-blue-100 max-w-md">{HUB_CONTENT.aboutQuetta.elections.desc}</p>
                </div>
                <div className="flex flex-wrap gap-3 justify-center">
                  {HUB_CONTENT.aboutQuetta.elections.details.map(detail => (
                    <span key={detail} className="px-4 py-2 bg-white/10 rounded-xl text-sm font-bold border border-white/20">{detail}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Timeline */}
      <section id="leadership" className="py-24 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading title="Leadership Timeline" subtitle="The visionaries who have led the Quetta Hub since its inception." />
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 hidden md:block" />
            
            <div className="grid md:grid-cols-4 gap-8 relative">
              {HUB_CONTENT.leadershipTimeline.map((leader, i) => (
                <motion.div 
                  key={leader.years}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 relative z-10"
                >
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white mb-6 font-bold">
                    {i + 1}
                  </div>
                  <div className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-2">{leader.years}</div>
                  <h4 className="text-xl font-bold text-slate-900 mb-1">{leader.name}</h4>
                  <p className="text-slate-500 font-medium">{leader.role}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-16 p-8 bg-white rounded-3xl shadow-xl border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
                <Gavel className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900">Hub Governance Charter</h4>
                <p className="text-slate-500 max-w-md">{HUB_CONTENT.charter.desc}</p>
              </div>
            </div>
            <a 
              href={HUB_CONTENT.charter.link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-900 text-white px-8 py-4 rounded-full font-bold hover:bg-slate-800 transition-all flex items-center gap-2"
            >
              View Governance Charter <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Impact Areas */}
      <section id="impact" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading 
            title="Key Impact Areas" 
            subtitle="Aligned with the United Nations Sustainable Development Goals (SDGs) and World Economic Forum priorities." 
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {HUB_CONTENT.impactAreas.map((area, i) => {
              const Icon = IconMap[area.icon];
              return (
                <motion.div 
                  key={area.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group p-10 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-blue-600 transition-all duration-500"
                >
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-white/20 transition-colors">
                    <Icon className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 group-hover:text-white transition-colors mb-4">{area.title}</h4>
                  <div className="h-1 w-12 bg-blue-600 group-hover:bg-white/50 transition-colors" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Major Projects */}
      <section id="projects" className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading 
            title="Major Projects" 
            subtitle="Transforming vision into tangible impact across Balochistan." 
            light
          />

          <div className="grid lg:grid-cols-2 gap-10">
            {HUB_CONTENT.projects.map((project, i) => (
              <motion.div 
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-all"
              >
                <div className="h-48 bg-slate-800 relative overflow-hidden">
                  <img 
                    src={`https://picsum.photos/seed/project-${project.id}/800/400`} 
                    alt={project.title}
                    className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-6 left-6 px-4 py-1.5 bg-blue-600 rounded-full text-xs font-bold uppercase tracking-widest">
                    {project.subtitle}
                  </div>
                </div>
                <div className="p-8">
                  <h4 className="text-2xl font-bold mb-4">{project.title}</h4>
                  <p className="text-slate-400 mb-6 leading-relaxed">{project.desc}</p>
                  
                  <div className="flex flex-wrap gap-3 mb-8">
                    {project.stats.map(stat => (
                      <span key={stat} className="px-3 py-1 bg-white/10 rounded-lg text-sm font-semibold text-blue-300 border border-white/10">
                        {stat}
                      </span>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-white/10 flex items-center gap-3">
                    <Users className="w-5 h-5 text-slate-500" />
                    <p className="text-sm text-slate-400 font-medium">
                      <span className="text-slate-200 font-bold">Leads:</span> {project.leads}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* International Engagement */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <SectionHeading 
                title="International Engagement" 
                subtitle="Connecting Quetta to the global stage through strategic partnerships and summits." 
              />
              <div className="space-y-8">
                {HUB_CONTENT.international.map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-6"
                  >
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
                      <Globe className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 mb-1">{item.title}</h4>
                      <p className="text-slate-600">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="bg-slate-50 p-10 rounded-3xl border border-slate-100">
              <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                <Calendar className="text-blue-600" /> Annual & Regional Engagements
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {HUB_CONTENT.engagements.map(item => (
                  <div key={item} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-sm font-bold text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collaborations */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Collaborations</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">We work with leading institutions to amplify our impact in Balochistan.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {HUB_CONTENT.collaborations.map(partner => (
              <div key={partner} className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 bg-white rounded-3xl shadow-sm border border-slate-200 flex items-center justify-center text-blue-600 font-bold text-2xl">
                  {partner.charAt(0)}
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center max-w-[120px]">{partner}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-24 bg-blue-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <Globe className="w-16 h-16 mx-auto mb-10 opacity-50" />
          <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight italic">
            "{HUB_CONTENT.vision}"
          </h2>
          <div className="h-1 w-24 bg-white/30 mx-auto" />
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <SectionHeading title="Get in Touch" subtitle="Have questions or want to collaborate? Reach out to the Quetta Hub team." />
              <div className="space-y-8 mt-12">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-400 uppercase">Email Us</p>
                    <a href={`mailto:${HUB_CONTENT.socials.email}`} className="text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors">
                      {HUB_CONTENT.socials.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-400 uppercase">Location</p>
                    <p className="text-lg font-bold text-slate-900">Quetta, Balochistan, Pakistan</p>
                  </div>
                </div>
              </div>

              <div className="mt-16">
                <p className="text-sm font-bold text-slate-400 uppercase mb-6">Follow Our Journey</p>
                <div className="flex flex-wrap gap-4">
                  {[
                    { icon: Linkedin, link: HUB_CONTENT.socials.linkedin },
                    { icon: Instagram, link: HUB_CONTENT.socials.instagram },
                    { icon: Facebook, link: HUB_CONTENT.socials.facebook },
                    { icon: Twitter, link: HUB_CONTENT.socials.x },
                  ].map((social, i) => (
                    <a 
                      key={i} 
                      href={social.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600 hover:bg-blue-600 hover:text-white transition-all"
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-10 rounded-3xl border border-slate-100">
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                    <input type="text" className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                    <input type="email" className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="john@example.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Subject</label>
                  <input type="text" className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="How can we help?" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
                  <textarea rows={5} className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Your message here..."></textarea>
                </div>
                <button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20">
                  Send Message <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-8">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">Q</div>
                <span className="font-bold text-2xl tracking-tight">
                  Global Shapers <span className="text-blue-500">Quetta</span>
                </span>
              </div>
              <p className="text-slate-400 max-w-md mb-8 leading-relaxed">
                An initiative of the World Economic Forum. Locally rooted, globally connected, youth-led, and impact-driven hub in Balochistan, Pakistan.
              </p>
              <div className="flex gap-4">
                <a href={HUB_CONTENT.socials.linktree} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-blue-400 hover:text-blue-300 underline underline-offset-4">Linktree</a>
                <a href={HUB_CONTENT.socials.forum} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-blue-400 hover:text-blue-300 underline underline-offset-4">Forum Spaces</a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-8">Quick Links</h4>
              <ul className="space-y-4">
                {navLinks.map(link => (
                  <li key={link.name}>
                    <a href={link.href} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
                      <ChevronRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-8">Official Platforms</h4>
              <ul className="space-y-4">
                <li><a href={HUB_CONTENT.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">LinkedIn</a></li>
                <li><a href={HUB_CONTENT.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">Instagram</a></li>
                <li><a href={HUB_CONTENT.socials.facebook} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">Facebook</a></li>
                <li><a href={HUB_CONTENT.socials.x} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">X (Twitter)</a></li>
                <li><a href={HUB_CONTENT.socials.tiktok} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">TikTok</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} Global Shapers Community – Quetta Hub. All rights reserved.
            </p>
            <div className="flex items-center gap-8">
              <a href="#" className="text-slate-500 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-slate-500 hover:text-white text-sm transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
