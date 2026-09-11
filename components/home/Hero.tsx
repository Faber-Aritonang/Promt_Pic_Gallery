"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, MessageSquare, Globe, ArrowRight, ChevronDown } from "lucide-react";

// ── Particle Canvas ─────────────────────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      color: string;

      constructor(width: number, height: number) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
        const colors = ["195, 100%, 50%", "270, 80%, 60%", "330, 90%, 60%"];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update(width: number, height: number) {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
        ctx.fill();
      }
    }

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx?.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    function init() {
      resize();
      const count = Math.min(80, Math.floor((canvas?.offsetWidth ?? 800) / 15));
      particles = Array.from({ length: count }, () => new Particle(canvas?.offsetWidth ?? 800, canvas?.offsetHeight ?? 600));
    }

    function drawConnections() {
      if (!ctx || !canvas) return;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(195, 100%, 50%, ${0.1 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      particles.forEach((p) => {
        p.update(canvas.offsetWidth, canvas.offsetHeight);
        p.draw(ctx);
      });
      drawConnections();
      animationId = requestAnimationFrame(animate);
    }

    init();
    animate();
    window.addEventListener("resize", init);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", init);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.6 }}
    />
  );
}

// ── Mouse Tracker (parallax effect) ────────────────────────────────────
function MouseParallax({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    setPosition({ x, y });
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative"
      style={{ perspective: "1000px" }}
    >
      <div
        style={{
          transform: `rotateY(${position.x * 3}deg) rotateX(${-position.y * 3}deg)`,
          transition: "transform 0.1s ease-out",
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ── Typing Animation ───────────────────────────────────────────────────
function TypingText({ texts, className }: { texts: string[]; className?: string }) {
  const [displayText, setDisplayText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setDisplayText(currentText.slice(0, charIndex + 1));
          setCharIndex(charIndex + 1);
          if (charIndex + 1 === currentText.length) {
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          setDisplayText(currentText.slice(0, charIndex - 1));
          setCharIndex(charIndex - 1);
          if (charIndex - 1 === 0) {
            setIsDeleting(false);
            setTextIndex((textIndex + 1) % texts.length);
          }
        }
      },
      isDeleting ? 30 : 70
    );
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex, texts]);

  return (
    <span className={className}>
      {displayText}
      <span className="animate-pulse text-neon-cyan">|</span>
    </span>
  );
}

// ── Main Hero Component ────────────────────────────────────────────────
export function Hero() {
  const t = useTranslations();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* ── Background Effects ──────────────────────────────────────── */}
      <div className="absolute inset-0">
        {/* Particle canvas */}
        <ParticleCanvas />

        {/* Gradient orbs following mouse */}
        <div
          className="absolute w-[500px] h-[500px] bg-neon-cyan/8 rounded-full blur-[120px] transition-transform duration-1000 ease-out"
          style={{
            left: "20%",
            top: "30%",
            transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)`,
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] bg-neon-purple/8 rounded-full blur-[100px] transition-transform duration-1000 ease-out"
          style={{
            right: "15%",
            top: "20%",
            transform: `translate(${mousePos.x * -0.3}px, ${mousePos.y * -0.3}px)`,
          }}
        />
        <div
          className="absolute w-[300px] h-[300px] bg-neon-pink/5 rounded-full blur-[80px] transition-transform duration-1000 ease-out"
          style={{
            left: "50%",
            bottom: "20%",
            transform: `translate(-50%, ${mousePos.y * 0.4}px)`,
          }}
        />

        {/* Grid overlay */}
        <div className="absolute inset-0 grid-pattern opacity-30" />
      </div>

      {/* ── Content ────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
        <MouseParallax>
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-8 glass neon-border rounded-full px-5 py-2 text-xs font-medium tracking-wider uppercase text-neon-cyan animate-slide-down">
              <Sparkles className="h-3.5 w-3.5" />
              AI-Powered Prompt Engineering
              <span className="h-1.5 w-1.5 rounded-full bg-neon-cyan animate-pulse" />
            </div>

            {/* Main Title */}
            <h1 className="mb-6 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9]">
              <span className="block text-foreground">Master</span>
              <span className="block text-gradient mt-2">Prompt</span>
              <span className="block text-foreground mt-2">Engineering</span>
            </h1>

            {/* Typing subtitle */}
            <div className="mb-8 h-8 flex items-center justify-center">
              <p className="text-muted-foreground text-lg sm:text-xl">
                <TypingText
                  texts={[
                    "Browse curated templates",
                    "Refine with AI assistance",
                    "Generate stunning images",
                    "Share with the community",
                  ]}
                  className="font-mono text-sm sm:text-base"
                />
              </p>
            </div>

            {/* Description */}
            <p className="mx-auto mb-10 max-w-xl text-muted-foreground leading-relaxed text-sm sm:text-base">
              {t("home.subtitle")}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/gallery">
                <Button
                  size="lg"
                  className="group relative gap-2 bg-gradient-to-r from-neon-cyan to-cyan-400 text-background font-bold px-8 py-6 text-base rounded-2xl border-0 shadow-neon hover:shadow-neon-lg transition-all duration-300 hover:scale-[1.03] w-full sm:w-auto"
                >
                  <Globe className="h-5 w-5" />
                  {t("home.browseGallery")}
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/chat">
                <Button
                  size="lg"
                  variant="outline"
                  className="group gap-2 glass neon-border px-8 py-6 text-base rounded-2xl hover:bg-neon-cyan/5 hover:border-neon-cyan/30 transition-all duration-300 w-full sm:w-auto"
                >
                  <MessageSquare className="h-5 w-5 text-neon-cyan" />
                  {t("home.startChat")}
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto">
              {[
                { value: "50+", label: "Templates" },
                { value: "10+", label: "AI Models" },
                { value: "100%", label: "Free" },
                { value: "∞", label: "Generations" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="glass rounded-xl p-3 sm:p-4 neon-border hover:shadow-neon-sm transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="text-xl sm:text-2xl font-bold text-gradient">{stat.value}</div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </MouseParallax>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Scroll</span>
          <ChevronDown className="h-4 w-4 text-neon-cyan/50" />
        </div>
      </div>
    </section>
  );
}
