import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Heart,
  Volume2,
  VolumeX,
  MailOpen,
  Sparkle,
  Music4,
  Map,
  MessageCircle,
  Users,
  ChevronDown,
  Gift,
  CalendarRange,
  Info,
  ChevronRight,
  Sparkles as SparklesIcon
} from "lucide-react";

// TARGET COUNTDOWN DATE: May 30, 2026, 11:00 AM
const TARGET_DATE = new Date("2026-05-30T11:00:00");

// EVENT ITINERARY DATA PLACEHOLDERS
const ITINERARY_STEPS = [
  {
    id: "ceremonia",
    time: "11:00 AM",
    title: "Solemne Misa de Acción de Gracias",
    description: "Ceremonia de agradecimiento religiosa y bendición de los XV Años en la capilla principal, rodeada de familiares y seres queridos.",
    icon: Sparkles
  },
  {
    id: "recepcion",
    time: "01:00 PM",
    title: "Recepción de Invitados en Casa Real",
    description: "Bienvenida oficial, alfombra plateada y brindis inicial con cócteles temáticos celestes en honor a Emili Alisson.",
    icon: CalendarRange
  },
  {
    id: "vals",
    time: "02:30 PM",
    title: "El Vals de Ensueño & Baile de Gala",
    description: "El tradicional y majestuoso Vals de honor junto a mis padres, padrino y corte de chambelanes. Un momento cinematográfico para recordar.",
    icon: Heart
  },
  {
    id: "banquete",
    time: "03:30 PM",
    title: "Banquete Real & Brindis de Honor",
    description: "Cena gourmet de alta gala, proyección de video semblanza cronológica y un agradecimiento especial de la familia.",
    icon: MapPin
  },
  {
    id: "fiesta",
    time: "05:00 PM",
    title: "Gran Fiesta & Shows Sorpresa",
    description: "Apertura de la pista de baile con luces inteligentes, DJ en vivo, robot LED y sorpresas inolvidables para disfrutar toda la noche.",
    icon: Music4
  }
];

// INSPIRATIONAL CINEMATIC QUOTES ("FRASES")
const QUOTES = [
  {
    text: "“Hay momentos en la vida que son especiales, pero compartirlos con quienes más amas los convierte en momentos eternos de felicidad.”",
    author: "Emili Alisson"
  },
  {
    text: "“Hoy celebro el hermoso don de la vida, dejando los mágicos años de la infancia para comenzar un nuevo amanecer lleno de sueños y esperanzas.”",
    author: "Sierra Huillca"
  },
  {
    text: "“Dios diseñó para este día la más perfecta de las melodías, convocando a las almas que más aprecio para ser testigos de mi felicidad.”",
    author: "Agradecimiento Familiar"
  }
];

export default function App() {
  const [preloaderComplete, setPreloaderComplete] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Dynamic Quote slider index
  const [currentQuoteIdx, setCurrentQuoteIdx] = useState(0);
  
  // Interactive "Desglosables" indices
  const [expandedItineraryId, setExpandedItineraryId] = useState<string | null>("vals");
  const [isDressCodeOpen, setIsDressCodeOpen] = useState(true);
  const [isGiftSuggestionOpen, setIsGiftSuggestionOpen] = useState(false);

  const [countdown, setCountdown] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00"
  });
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sparkles representation (stateless positioning via simple mapping)
  const [particles, setParticles] = useState<Array<{ id: number; left: string; size: number; delay: string; duration: string; top?: string }>>([]);

  // Music notes animation representation for the interactive speaker
  const [musicalNotes, setMusicalNotes] = useState<Array<{ id: number; left: string; size: number; delay: string; duration: string }>>([]);

  // Generate randomized star coordinates on mount to prevent SSR mismatch or constant re-renders
  useEffect(() => {
    const list = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 4 + 2, // 2px to 6px
      delay: `${Math.random() * 8}s`,
      duration: `${Math.random() * 8 + 6}s`
    }));
    setParticles(list);

    // Initial notes
    const notes = Array.from({ length: 5 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 30 + 35}%`,
      size: Math.random() * 8 + 10,
      delay: `${Math.random() * 2}s`,
      duration: `${Math.random() * 2 + 1.5}s`
    }));
    setMusicalNotes(notes);
  }, []);

  // Preloader timeout (1.5 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      setPreloaderComplete(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Countdown timer calculations
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = TARGET_DATE.getTime() - now;

      if (difference <= 0) {
        setCountdown({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        return;
      }

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((difference % (1000 * 60)) / 1000);

      setCountdown({
        days: String(d).padStart(2, "0"),
        hours: String(h).padStart(2, "0"),
        minutes: String(m).padStart(2, "0"),
        seconds: String(s).padStart(2, "0")
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Periodically emit randomized musical notes when playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setMusicalNotes((prev) => {
        const nextId = prev.length ? prev[prev.length - 1].id + 1 : 0;
        const newNote = {
          id: nextId,
          left: `${Math.random() * 40 + 30}%`,
          size: Math.random() * 12 + 10,
          delay: "0s",
          duration: `${Math.random() * 2 + 2}s`
        };
        return [...prev.slice(-8), newNote];
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Handle music playing on invite unlock
  const handleOpenInvitation = () => {
    setIsOpen(true);
    setIsPlaying(true);
    if (!audioRef.current) {
      audioRef.current = new Audio(
        "https://res.cloudinary.com/dcnynnstm/video/upload/v1779747463/CHROMATICS_GIRLS_JUST_WANNA_HAVE_SOME_Official_Video_yqea0s.mp3"
      );
      audioRef.current.loop = true;
    }
    audioRef.current.play().catch((err) => {
      console.warn("Autoplay block detected or file load issue:", err);
      setIsPlaying(false);
    });
  };

  // Toggle audio player
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch((err) => console.error(err));
      setIsPlaying(true);
    }
  };

  // Rotate through inspirational quotes
  const nextQuote = () => {
    setCurrentQuoteIdx((prev) => (prev + 1) % QUOTES.length);
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 font-sans overflow-x-hidden selection:bg-sky-500/30 selection:text-sky-200 flex flex-col justify-center">
      
      {/* 🔮 PARTICLE EFFECTS SYSTEM (GLITTER OVERLAY) */}
      <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-sky-200/30 blur-[0.5px] animate-pulse"
            style={{
              left: particle.left,
              top: particle.top,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              boxShadow: "0 0 10px rgba(56, 189, 248, 0.5)",
              animationDelay: particle.delay,
              animationDuration: particle.duration
            }}
          />
        ))}
      </div>

      {/* 🎞️ INTERACTIVE PRELOADER SCREEN */}
      <AnimatePresence>
        {!preloaderComplete && (
          <motion.div
            id="preloader-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center z-50 pointer-events-auto"
          >
            <div className="relative text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="mb-4"
              >
                <span className="font-serif italic text-4xl sm:text-6xl tracking-widest text-[#a5f3fc] drop-shadow-[0_0_15px_rgba(165,243,252,0.4)] block mb-1">
                  E.A.S.H.
                </span>
                <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-[#a5f3fc] to-transparent mx-auto mt-2" />
              </motion.div>
              <div className="flex items-center justify-center gap-1.5 text-slate-400 font-serif text-[10px] uppercase tracking-widest animate-pulse">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span>Diseño Virtual Premium Pro</span>
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🎞️ INITIAL ENTRY GATE MODAL */}
      <AnimatePresence>
        {preloaderComplete && !isOpen && (
          <motion.div
            id="invitation-gate"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-[#03050a]/98 backdrop-blur-3xl flex items-center justify-center z-40 p-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="max-w-md w-full p-8 sm:p-10 rounded-3xl border border-sky-500/30 text-center relative overflow-hidden bg-slate-900/50 backdrop-blur-3xl"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
              
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full border-2 border-sky-400 mx-auto flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.2)]">
                  <span className="text-xl font-serif text-sky-400 font-bold uppercase tracking-widest">E.A</span>
                </div>
              </div>

              <h2 className="text-3xl font-light tracking-[0.2em] uppercase text-white mb-2">
                Estás Invitado ✨
              </h2>
              
              <p className="font-serif italic text-base text-slate-300 tracking-wider mb-6">
                A celebrar un momento inolvidable
              </p>

              <div className="text-xs text-slate-400/80 leading-relaxed font-light mb-8 max-w-xs mx-auto">
                Para escuchar la música oficial de la celebración, por favor haz clic en el botón de abajo.
              </div>

              <button
                id="btn-open-invitation"
                onClick={handleOpenInvitation}
                className="px-12 py-4 border border-white/20 bg-white/5 rounded-full text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all cursor-pointer inline-flex items-center gap-2 duration-300 font-medium"
              >
                <MailOpen className="w-4.5 h-4.5 text-sky-300" />
                <span>Abrir invitación</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SLEEK STATE-OF-THE-ART VIEWPORT FRAME */}
      {isOpen && (
        <main className="w-full max-w-[1360px] mx-auto min-h-screen lg:h-[840px] flex flex-col lg:flex-row relative z-20 shadow-2xl overflow-hidden bg-slate-950 border border-sky-950/40 lg:rounded-3xl lg:my-8 transition-all duration-500">
          
          {/* LEFT PANEL: CINEMATIC COVER & STORY */}
          <div className="w-full lg:w-[50%] h-[560px] lg:h-full relative overflow-hidden flex flex-col justify-end p-8 sm:p-12 border-b lg:border-b-0 lg:border-r border-sky-900/35">
            {/* Parallax Portrait Background */}
            <div className="absolute inset-0 z-0 select-none">
              <img
                src="https://i.pinimg.com/1200x/c5/1d/13/c51d1338a56774febd3c069128f469bf.jpg"
                alt="Retrato hermoso de XV años de Emili Alisson Sierra Huillca"
                className="w-full h-full object-cover object-center scale-[1.01] brightness-[0.70] contrast-[1.02] transform transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/20 to-transparent opacity-95" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-100" />
              <div className="absolute inset-0 bg-[#020408]/30 blend-mode-multiply" />
            </div>

            {/* Glowing Refraction Rays */}
            <div className="absolute inset-0 z-[1] discoball-glow mix-blend-color-dodge opacity-60 pointer-events-none" />

            {/* Premium Signature Header */}
            <div className="absolute top-8 left-8 sm:top-12 sm:left-12 flex items-center gap-3.5 z-10">
              <div className="w-11 h-11 rounded-full border border-sky-400/40 flex items-center justify-center text-sky-300 text-xs tracking-widest font-serif font-bold uppercase bg-slate-950/80 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
                E.A
              </div>
              <div className="h-[1px] w-14 bg-sky-400/30"></div>
              <span className="text-[10px] tracking-[0.45em] uppercase text-sky-400/90 font-bold text-shadow-glow">Estás Invitado</span>
            </div>

            {/* Floating content with quote at bottom left */}
            <div className="relative z-10 space-y-4">
              <span className="text-sky-400 font-medium tracking-[0.3em] uppercase text-xs sm:text-sm text-shadow-glow block">
                Mis XV Años
              </span>
              
              <h1 className="text-5xl sm:text-7xl leading-none font-serif text-white tracking-tight drop-shadow-2xl font-semibold select-none">
                Emili Alisson <br />
                <span className="text-sky-300 font-light italic font-script tracking-wide text-5xl sm:text-6xl text-shadow-glow">Sierra Huillca</span>
              </h1>
              
              <div className="h-[1px] w-24 bg-gradient-to-r from-sky-400 via-sky-300 to-transparent my-3" />

              {/* Dynamic Quote presentation inside the cinematic side panel */}
              <div className="bg-slate-950/40 backdrop-blur-md border border-white/5 rounded-2xl p-4 max-w-md relative group select-none">
                <p className="text-slate-200 text-sm italic font-sans font-light leading-relaxed">
                  {QUOTES[currentQuoteIdx].text}
                </p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-[10px] uppercase tracking-widest text-[#a5f3fc]">
                    — {QUOTES[currentQuoteIdx].author}
                  </span>
                  <button
                    onClick={nextQuote}
                    className="text-sky-400 text-[10px] uppercase font-bold tracking-widest hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1"
                  >
                    <span>Siguiente Frase</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-400 font-mono tracking-widest uppercase">
                Puno, Perú • 30 de Mayo de 2026
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: COMPREHENSIVE CONTROL & INTERACTIVE DESGLOSABLES */}
          <div className="w-full lg:w-[50%] h-auto lg:h-full flex flex-col p-6 sm:p-10 lg:p-12 overflow-y-auto bg-slate-950 relative z-10 space-y-8 scrollbar-thin">
            
            {/* Header: Date and indicator */}
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <div className="space-y-1">
                <p className="text-[9px] uppercase tracking-widest text-sky-400 font-bold">Fecha Oficial</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-light text-white font-serif tracking-tight">30</span>
                  <span className="text-sm font-light text-slate-400 uppercase tracking-[0.2em]">Mayo de 2026</span>
                </div>
              </div>

              {/* Animated Floating Musician Speaker - Bocina de Música Animada */}
              <div className="relative select-none">
                {/* Visual waves around the speaker */}
                {isPlaying && (
                  <div className="absolute inset-0 rounded-full bg-sky-500/10 animate-speaker-waves" />
                )}
                
                {/* Floating notes rising up when playing */}
                {isPlaying && musicalNotes.map((note) => (
                  <div
                    key={note.id}
                    className="absolute text-sky-400/75 pointer-events-none font-serif text-sm font-bold z-20 animate-music-note-daddy"
                    style={{
                      left: note.left,
                      fontSize: `${note.size}px`,
                      bottom: "100%"
                    }}
                  >
                    ♩
                  </div>
                ))}

                <button
                  id="bocina-musica-animada"
                  onClick={togglePlay}
                  aria-label="Speaker"
                  className={`w-14 h-14 rounded-full flex items-center justify-center relative z-10 transition-all duration-500 border cursor-pointer ${
                    isPlaying 
                      ? "bg-sky-500/10 border-sky-400 text-sky-300 shadow-[0_0_20px_rgba(56,189,248,0.25)] scale-105" 
                      : "bg-[#090d16] border-white/10 text-slate-500 hover:border-sky-500/30 hover:text-sky-300"
                  }`}
                >
                  {isPlaying ? (
                    <div className="relative">
                      {/* Spinning vinyl design disk */}
                      <div className="w-8 h-8 rounded-full border-2 border-sky-300 flex items-center justify-center animate-spin-slow animate-spin">
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-950" />
                      </div>
                      <Volume2 className="w-3.5 h-3.5 absolute -top-1.5 -right-1.5 text-sky-300" />
                    </div>
                  ) : (
                    <VolumeX className="w-6 h-6" />
                  )}
                </button>
              </div>
            </div>

            {/* COUNTDOWN TILES */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold font-mono block">Countdown</span>
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-white/5 border border-white/5 rounded-2xl p-3 text-center transition-all hover:border-sky-500/10">
                  <p className="text-2xl sm:text-3xl font-light text-sky-300 text-shadow-glow font-serif">{countdown.days}</p>
                  <p className="text-[8px] uppercase tracking-widest text-slate-500 mt-1">Días</p>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-2xl p-3 text-center transition-all hover:border-sky-500/10">
                  <p className="text-2xl sm:text-3xl font-light text-sky-300 text-shadow-glow font-serif">{countdown.hours}</p>
                  <p className="text-[8px] uppercase tracking-widest text-slate-500 mt-1">Horas</p>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-2xl p-3 text-center transition-all hover:border-sky-500/10">
                  <p className="text-2xl sm:text-3xl font-light text-sky-300 text-shadow-glow font-serif">{countdown.minutes}</p>
                  <p className="text-[8px] uppercase tracking-widest text-slate-500 mt-1">Minutos</p>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-2xl p-3 text-center transition-all hover:border-sky-500/10">
                  <p className="text-2xl sm:text-3xl font-light text-sky-200 text-shadow-glow font-serif">{countdown.seconds}</p>
                  <p className="text-[8px] uppercase tracking-widest text-slate-500 mt-1">Segundos</p>
                </div>
              </div>
            </div>

            {/* INTERACTIVE DESGLOSABLE 1: ACCORDION ITINERARY OF GLAMOUR */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 justify-between">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono font-bold">✨ Itinerario del Evento (Desglosable)</span>
                <span className="text-[9px] text-[#a5f3fc]/90 font-light italic">Haz clic en cada paso para desglosarlo</span>
              </div>
              
              <div className="border border-white/5 rounded-2xl overflow-hidden bg-slate-900/15 overflow-hidden divide-y divide-white/5">
                {ITINERARY_STEPS.map((step) => {
                  const isExpanded = expandedItineraryId === step.id;
                  const IconComp = step.icon;
                  return (
                    <div key={step.id} className="transition-colors">
                      <button
                        onClick={() => setExpandedItineraryId(isExpanded ? null : step.id)}
                        className="w-full text-left p-4 flex justify-between items-center hover:bg-white/5 transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`text-xs font-mono font-bold px-2.5 py-1.5 rounded-md ${
                            isExpanded ? "bg-sky-500/20 text-sky-300" : "bg-slate-900 text-slate-400"
                          }`}>
                            {step.time}
                          </span>
                          <div>
                            <h4 className="text-xs sm:text-sm text-slate-100 font-semibold">{step.title}</h4>
                          </div>
                        </div>
                        <div className="text-sky-400 shrink-0 ml-2">
                          {isExpanded ? (
                            <div className="w-5 h-5 rounded-full bg-sky-950 flex items-center justify-center">
                              <ChevronDown className="w-3 h-3 rotate-180 transition-transform text-sky-300" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-slate-900/60 flex items-center justify-center">
                              <ChevronRight className="w-3 h-3 text-slate-400" />
                            </div>
                          )}
                        </div>
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-slate-900/40 px-4 pb-5 pt-1 overflow-hidden"
                          >
                            <div className="pl-1 space-y-2 border-l border-sky-500/30 ml-4 py-1">
                              <p className="text-xs text-slate-300 leading-relaxed font-light">
                                {step.description}
                              </p>
                              <div className="flex items-center gap-1.5 text-[10px] text-sky-300 font-mono font-light uppercase pt-1">
                                <IconComp className="w-3.5 h-3.5 text-sky-400" />
                                <span>Momento especial {step.time}</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* INTERACTIVE DESGLOSABLE 2: CÓDIGO DE VESTIMENTA */}
            <div className="space-y-2">
              <button
                onClick={() => setIsDressCodeOpen(!isDressCodeOpen)}
                className="w-full py-4 px-5 rounded-2xl bg-[#0a1222] border border-sky-900/30 flex justify-between items-center cursor-pointer hover:border-sky-500/20 transition-all shadow-md text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-950 flex items-center justify-center text-sky-400">
                    <SparklesIcon className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-slate-300 font-bold">Código de Vestimenta</h4>
                    <p className="text-[10px] text-sky-300 italic font-mono uppercase mt-0.5">Etiqueta Rigurosa / Gala</p>
                  </div>
                </div>
                <div>
                  {isDressCodeOpen ? (
                    <ChevronDown className="w-4 h-4 rotate-180 text-sky-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {isDressCodeOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden bg-[#0c1324] border border-sky-950 rounded-2xl p-5 space-y-4"
                  >
                    <p className="text-xs text-slate-300 leading-relaxed font-light">
                      Queremos que seas parte del glamour de esta gran noche mágica. Te sugerimos el siguiente código de etiqueta:
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-950/50 p-3 rounded-xl border border-white/5 space-y-1">
                        <span className="text-[10px] uppercase text-sky-400 tracking-widest font-bold">Hombres</span>
                        <p className="text-xs font-medium text-slate-200">Traje Formal / Esmoquin</p>
                        <p className="text-[10px] text-slate-500 font-light">Colores sugeridos oscuros elegante.</p>
                      </div>

                      <div className="bg-slate-950/50 p-3 rounded-xl border border-white/5 space-y-1">
                        <span className="text-[10px] uppercase text-sky-400 tracking-widest font-bold">Mujeres</span>
                        <p className="text-xs font-medium text-slate-200">Vestido Largo de Gala</p>
                        <p className="text-[10px] text-slate-500 font-light">Cualquier color excepto blanco/celeste.</p>
                      </div>
                    </div>

                    <div className="rounded-xl bg-sky-950/30 p-3 flex gap-2 items-center">
                      <Info className="w-4 h-4 text-sky-400 shrink-0" />
                      <span className="text-[10px] text-slate-300 font-light leading-snug">
                        ¡Se ruega evitar vestir de color celeste brillante o blanco, reservados para la quinceañera!
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* INTERACTIVE DESGLOSABLE 3: SUGERENCIA DE REGALOS (LLUVIA DE SOBRES) */}
            <div className="space-y-2">
              <button
                onClick={() => setIsGiftSuggestionOpen(!isGiftSuggestionOpen)}
                className="w-full py-4 px-5 rounded-2xl bg-[#0a1222] border border-sky-900/30 flex justify-between items-center cursor-pointer hover:border-sky-500/20 transition-all shadow-md text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-950 flex items-center justify-center text-sky-400">
                    <Gift className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-slate-300 font-bold">Lluvia de Sobres</h4>
                    <p className="text-[10px] text-sky-300 italic font-mono uppercase mt-0.5">Sugerencia de Obsequio</p>
                  </div>
                </div>
                <div>
                  {isGiftSuggestionOpen ? (
                    <ChevronDown className="w-4 h-4 rotate-180 text-sky-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {isGiftSuggestionOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden bg-[#0c1324] border border-sky-950 rounded-2xl p-5 space-y-4"
                  >
                    <p className="text-xs text-slate-300 leading-relaxed font-light">
                      “Mi mayor obsequio es contar con tu estimada compañía en este evento único. Pero si deseas tener un detalle para con mi persona, te comento que dispondremos de:”
                    </p>
                    
                    <div className="space-y-3">
                      <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5 space-y-1">
                        <h5 className="text-[11px] uppercase tracking-wider text-sky-400 font-bold">✉️ Lluvia de Sobres</h5>
                        <p className="text-xs text-slate-300 font-light">
                          Consiste en depositar tu presente económico en un sobre cerrado el día de la celebración en la urna que estará ubicada en el ingreso del salón de recepciones de Casa Real.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* SECCIÓN FAMILIARES DETALLADA */}
            <div className="p-5 sm:p-6 rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-md space-y-4">
              <div className="flex items-center gap-1.5 pb-1">
                <Users className="w-4 h-4 text-sky-400" />
                <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Bendecida por mis Padres & Padrino</p>
              </div>
              <div className="space-y-3.5 font-sans text-xs">
                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <span className="text-slate-400 font-light block">Madre Elena</span>
                    <span className="text-white font-medium">Yolanda Huillca Duran</span>
                  </div>
                  <Heart className="w-4 h-4 text-sky-400 mt-1 shrink-0 animate-pulse" />
                </div>
                <div className="w-full h-[1px] bg-white/5" />
                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <span className="text-slate-400 font-light block">Padre Protector</span>
                    <span className="text-white font-medium">Luis Alberto Sierra Barazorda</span>
                  </div>
                  <Heart className="w-4 h-4 text-sky-400 mt-1 shrink-0 animate-pulse" />
                </div>
                <div className="w-full h-[1px] bg-white/5" />
                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <span className="text-slate-400 font-bold text-sky-300 tracking-wider">Padrino de Honor</span>
                    <span className="text-sky-250 font-medium block text-slate-200">Ferrer Pachari Cuno</span>
                  </div>
                  <Sparkle className="w-4 h-4 text-sky-400 mt-1 shrink-0 animate-pulse" />
                </div>
              </div>
            </div>

            {/* BOTTOM CTAS & LINK TO MAPS */}
            <div className="mt-auto space-y-4 pt-4 border-t border-slate-900">
              <div className="flex gap-4">
                {/* Visual Google Map Launcher Button */}
                <a
                  id="link-google-maps"
                  href="https://maps.app.goo.gl/vVjT36noYYNLGa5B9"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 bg-slate-900 border border-white/10 hover:border-sky-500/30 hover:bg-slate-800 transition-all rounded-full text-[10px] uppercase tracking-widest font-bold text-center inline-flex items-center justify-center gap-2 py-4 text-slate-300"
                >
                  <Map className="w-3.5 h-3.5 text-sky-400" />
                  <span>Ver Mapa - Casa Real</span>
                </a>

                {/* Integrated pause/play backup icon trigger */}
                <button
                  id="btn-toggle-audio-right"
                  onClick={togglePlay}
                  className={`w-14 h-14 rounded-full border flex items-center justify-center cursor-pointer transition-all duration-300 shadow shrink-0 ${
                    isPlaying ? "bg-sky-500/10 border-sky-400 text-sky-300" : "bg-white/5 border-white/10 text-slate-500"
                  }`}
                  aria-label="Reprod/Pausa"
                >
                  {isPlaying ? (
                    <Volume2 className="w-5 h-5 text-sky-300 animate-pulse" />
                  ) : (
                    <VolumeX className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* RSVP CONFIRMATION LINK VIA WHATSAPP WITH CUSTOM MESSAGE */}
              <div className="space-y-2">
                <a
                  id="btn-whatsapp-rsvp"
                  href="https://wa.me/51992741524?text=Hola,%20confirmo%20mi%20asistencia%20a%20los%20XV%20an%C3%B1os%20de%20Emili%20Alisson%20Sierra%20Huillca%20%F0%9F%8E%89"
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full bg-gradient-to-r from-sky-500 to-cyan-500 py-4.5 rounded-full text-center text-xs uppercase tracking-[0.2em] font-bold text-white shadow-[0_0_25px_rgba(14,165,233,0.35)] hover:shadow-[0_0_35px_rgba(14,165,233,0.5)] hover:scale-[1.01] active:scale-95 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-center gap-2">
                    <MessageCircle className="w-4 h-4 fill-white/10 animate-bounce" />
                    <span>Confirmar Asistencia ✨</span>
                  </div>
                </a>
                
                <p className="text-center text-[10px] text-slate-400 leading-relaxed pt-1 select-none">
                  “Te espero para compartir este momento inolvidable 💖”
                </p>
              </div>

            </div>
          </div>

        </main>
      )}

    </div>
  );
}
