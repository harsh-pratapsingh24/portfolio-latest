"use client";

import Image from "next/image";
import { ArrowDown, ArrowUpRight, Check, Copy, Github, Linkedin, Mail, Terminal } from "lucide-react";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { ProjectGrid } from "@/components/ProjectGrid";
import { InteractiveHero3D } from "@/components/InteractiveHero3D";
import { ContactForm } from "@/components/ContactForm";
import { experience, personal, skills } from "@/data/portfolio";

const SectionTitle = ({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body?: string;
}) => (
  <div className="section-title" data-scroll="fade-up">
    <span className="eyebrow">{eyebrow}</span>
    <h2>{title}</h2>
    {body && <p>{body}</p>}
  </div>
);

export default function Home() {
  const [copied, setCopied] = useState(false);
  const [heroProgress, setHeroProgress] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personal.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      setScrollProgress(progress);
      setHeroProgress(Math.min(scrollY / 580, 1));
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Initialize stagger indexes for staggered containers
    const staggerContainers = document.querySelectorAll<HTMLElement>("[data-scroll-stagger]");
    staggerContainers.forEach((container) => {
      Array.from(container.children).forEach((child, idx) => {
        (child as HTMLElement).style.setProperty("--stagger-i", String(idx));
      });
    });

    // IntersectionObserver for varied scroll animations
    const animatedElements = document.querySelectorAll<HTMLElement>(
      "[data-scroll], [data-scroll-stagger], [data-scroll-reveal]"
    );

    // Initial check: immediately reveal elements already within viewport
    animatedElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.96) {
        el.classList.add("is-visible");
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (isIntersecting) {
            target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px 60px 0px" }
    );

    animatedElements.forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  const heroMotion = {
    opacity: 1 - heroProgress * 0.72,
    filter: `blur(${heroProgress * 6}px)`,
    transform: `translateY(${heroProgress * -45}px) scale(${1 - heroProgress * 0.03})`,
  };

  return (
    <main id="top">
      {/* Top scroll progress indicator */}
      <div
        className="scroll-progress-bar"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      <Navbar />

      {/* HERO SECTION WITH INTERACTIVE 3D STAGE */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-backdrop" aria-hidden="true">
          <Image
            src="/images/hero-cyberpunk-profile.png"
            alt=""
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="hero-scrim" aria-hidden="true" />

        <div className="hero-inner">
          <div className="hero-copy" style={heroMotion}>
            <div className="status">
              <i /> Available for opportunities
            </div>
            <p className="hero-label" data-text="HELLO, I'M HARSH PRATAP SINGH">
              <span>HELLO, I&apos;M</span>
              <strong>
                HARSH
                <br />
                PRATAP
                <br />
                SINGH
              </strong>
            </p>
            <h1 id="hero-title">
              Building software.
              <br />
              <span>Exploring intelligence.</span>
              <br />
              Creating impact.
            </h1>
            <p className="hero-summary">
              Computer Science undergraduate focused on software engineering,
              full-stack development and AI/ML. I turn complex ideas into
              functional, thoughtful products.
            </p>
            <div className="hero-actions">
              <a href="#projects" className="button primary">
                Explore my work <ArrowUpRight size={17} />
              </a>
              <a href={personal.resume} download className="button secondary">
                Download resume
              </a>
              <a href="#contact" className="button secondary">
                Let&apos;s connect
              </a>
            </div>
            <div className="social-row">
              <span>CONNECT</span>
              {personal.github && (
                <a
                  href={personal.github}
                  aria-label="GitHub profile"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Github size={16} />
                </a>
              )}
              <a
                href={personal.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn profile"
              >
                <Linkedin size={16} />
              </a>
              <a
                href={personal.leetcode}
                target="_blank"
                rel="noreferrer"
                aria-label="LeetCode profile"
              >
                <Terminal size={16} />
              </a>
              <a href={`mailto:${personal.email}`} aria-label="Direct Email">
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Interactive 3D Hero Stage */}
          <div className="hero-3d-stage">
            <InteractiveHero3D />
          </div>
        </div>

        <a className="scroll-cue" href="#about">
          <ArrowDown size={16} /> Scroll to discover
        </a>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="section about">
        <SectionTitle eyebrow="01 / ABOUT" title="A little about me." />
        <div className="about-grid">
          <div
            className="portrait-placeholder profile-scan"
            data-scroll="fade-right"
          >
            <Image
              src="/images/profile/harsh-ascii-profile.png"
              alt="Harsh Pratap Singh rendered as an ASCII-inspired digital profile"
              fill
              sizes="(max-width: 760px) 290px, 32vw"
              priority
            />
            <div className="portrait-cross" />
            <span>PROFILE / DETAIL_SCAN</span>
            <small>Signal crop · identity reference</small>
          </div>

          <div className="about-copy" data-scroll="fade-left">
            <p>
              I&apos;m a Computer Science Engineering student at BML Munjal
              University, interested in the meeting point of thoughtful software,
              full-stack systems and intelligent products.
            </p>
            <p>
              From AI-powered applications and real-time platforms to
              machine-learning experiments, I enjoy translating a vague problem
              into a clean, useful experience.
            </p>
            <p>
              I learn by building, testing ideas and working through the
              details—then iterating until the experience feels considered.
            </p>

            <div className="facts" data-scroll-stagger>
              <div>
                <span>EDUCATION</span>
                <b>BML Munjal University</b>
              </div>
              <div>
                <span>DEGREE</span>
                <b>B.Tech · CSE</b>
              </div>
              <div>
                <span>GRADUATION</span>
                <b>2028</b>
              </div>
              <div>
                <span>LOCATION</span>
                <b>Gurugram, India</b>
              </div>
            </div>

            <div className="exploring" data-scroll="fade-up">
              <span>CURRENTLY EXPLORING</span>
              <div>
                {[
                  "AI Engineering",
                  "Machine Learning",
                  "Full-Stack Architecture",
                  "Scalable Applications",
                  "DSA",
                ].map((x) => (
                  <b key={x}>{x}</b>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EXPERIENCE SECTION */}
      <section id="experience" className="section experience">
        <SectionTitle
          eyebrow="02 / EXPERIENCE"
          title="Field notes from the build."
          body="Research, product work and technical communities—documented as an active system."
        />
        <div className="experience-deck" data-scroll-stagger>
          {experience.map((item, i) => (
            <article className="experience-card" key={item.organization}>
              <div className="exp-visual" aria-hidden="true">
                <span>0{i + 1}</span>
                <i />
                <i />
                <i />
                <b>
                  NODE
                  <br />
                  ACTIVE
                </b>
              </div>
              <div className="exp-body">
                <div className="exp-head">
                  <div>
                    <span>{item.tag}</span>
                    <h3>{item.organization}</h3>
                    <h4>{item.role}</h4>
                  </div>
                  <time>{item.period}</time>
                </div>
                <p>{item.description}</p>
                <div className="exp-tags">
                  {item.skills.map((s) => (
                    <span className="tag" key={s}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="exp-corner">
                EXP_{String(i + 1).padStart(2, "0")}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* PROJECTS SECTION */}
      <section id="projects" className="section projects">
        <SectionTitle
          eyebrow="03 / SELECTED WORK"
          title="Ideas, translated into systems."
          body="A selection of product, data and experimental work."
        />
        <div data-scroll="fade-up">
          <ProjectGrid />
        </div>
      </section>

      {/* SKILLS SECTION */}
      <section id="skills" className="section skills">
        <SectionTitle
          eyebrow="04 / TOOLKIT"
          title="A practical technical range."
        />
        <div className="skills-grid" data-scroll-stagger>
          {skills.map(([group, items], i) => (
            <article key={group}>
              <span>0{i + 1}</span>
              <h3>{group}</h3>
              <div>
                {items.map((skill) => (
                  <b key={skill}>{skill}</b>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* LEETCODE SECTION */}
      <section
        className="section leetcode"
        aria-labelledby="leetcode-title"
        data-scroll="zoom-in"
      >
        <SectionTitle
          eyebrow="05 / PROBLEM SOLVING"
          title="LeetCode activity."
          body="A consistent practice space for algorithms, data structures and deliberate problem solving."
        />
        <a
          className="leetcode-console leetcode-image"
          href={personal.leetcode}
          target="_blank"
          rel="noreferrer"
          aria-label="Open Harsh's LeetCode profile"
        >
          <Image
            src="/images/leetcode-dashboard.png"
            alt="Futuristic LeetCode activity dashboard"
            width={1776}
            height={888}
            sizes="(max-width: 760px) 100vw, 1310px"
            priority
          />
          <span>OPEN LIVE PROFILE ↗</span>
        </a>
      </section>

      {/* CONTACT SECTION WITH EMAILJS FORM */}
      <section id="contact" className="contact">
        <div className="contact-grid">
          <div data-scroll="fade-right">
            <span className="eyebrow">06 / CONTACT</span>
            <h2>
              Have an idea?
              <br />
              <em>Let&apos;s build something.</em>
            </h2>
            <p>
              I&apos;m always interested in connecting with developers, exploring
              thoughtful opportunities and collaborating on meaningful products.
            </p>
            <div className="contact-links">
              <a href={`mailto:${personal.email}`}>
                <Mail size={16} />
                {personal.email}
              </a>
              <a href={personal.linkedin} target="_blank" rel="noreferrer">
                <Linkedin size={16} /> LinkedIn <ArrowUpRight size={14} />
              </a>
              {personal.github && (
                <a href={personal.github} target="_blank" rel="noreferrer">
                  <Github size={16} /> GitHub <ArrowUpRight size={14} />
                </a>
              )}
            </div>
          </div>

          <div data-scroll="fade-left">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <a className="brand" href="#top">
          <b>HPS</b>
          <span>Harsh Pratap Singh</span>
        </a>
        <p>Designed &amp; built with curiosity. © {new Date().getFullYear()}</p>
        <button onClick={copyEmail} className="copy-email">
          {copied ? <Check size={14} /> : <Copy size={14} />}{" "}
          {copied ? "Email copied" : "Copy email"}
        </button>
      </footer>
    </main>
  );
}
