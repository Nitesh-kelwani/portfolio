import { ArrowUpRight } from "lucide-react";
import { bookingHref, contact, links, profile } from "@/data/content";
import { Container, CopyButton, GithubIcon, LinkedinIcon, MagneticLink, Reveal } from "@/components/ui/primitives";
import { TextHoverEffect } from "@/components/ui/effects";
import { Mascot } from "@/components/ui/Mascot";

export function Contact() {
  return (
    <Container id="contact" className="py-24 md:py-32">
      <Reveal className="tile relative overflow-hidden px-6 py-20 text-center md:px-16 md:py-28">
        <div className="absolute inset-0 dots opacity-40" />
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,rgb(112_118_248/0.22),transparent_70%)]" />
        <div className="relative">
          <Mascot size={96} interactive className="mx-auto" />
          <h2 className="mx-auto mt-8 max-w-4xl text-5xl leading-[1] font-semibold tracking-[-0.04em] text-balance md:text-7xl">
            <span className="text-gradient">{contact.lead}</span> <span className="serif-accent">{contact.accent}</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted">{contact.body}</p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <MagneticLink href={bookingHref}>
              Let's talk <ArrowUpRight className="h-4 w-4" />
            </MagneticLink>
            <CopyButton text={links.email} className="py-3" />
          </div>
          <div className="mt-8 flex items-center justify-center gap-5 text-sm text-muted">
            <a href={links.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-ink">
              <LinkedinIcon className="h-4 w-4" /> LinkedIn
            </a>
            <a href={links.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-ink">
              <GithubIcon className="h-4 w-4" /> GitHub
            </a>
          </div>
        </div>
      </Reveal>
    </Container>
  );
}

export function Footer() {
  return (
    <footer className="relative border-t border-line pb-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <TextHoverEffect text="Nitesh Kelwani" className="mx-auto mt-4 max-w-5xl" />
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-faint">
          <p>© {new Date().getFullYear()} {profile.name} · {profile.city}, {profile.country}</p>
          <p className="font-mono text-xs">React · Tailwind · Motion · WebGL — hosted on Vercel</p>
          <div className="flex gap-5">
            <a href={links.github} target="_blank" rel="noreferrer" className="hover:text-ink">GitHub</a>
            <a href={links.linkedin} target="_blank" rel="noreferrer" className="hover:text-ink">LinkedIn</a>
            <a href={links.kaggle} target="_blank" rel="noreferrer" className="hover:text-ink">Kaggle</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
