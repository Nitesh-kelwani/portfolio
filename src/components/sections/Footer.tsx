import { footer, links, profile } from "@/data/content";
import { scrollToId } from "@/lib/scroll";
import { Logo } from "@/components/ui/Logo";
import { GithubIcon, KaggleIcon, LinkedinIcon } from "@/components/ui/primitives";
import { Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative bg-black">
      <div className="mx-auto max-w-[1112px] px-4 pt-16 pb-10 sm:px-6 md:pt-20">
        <div className="grid gap-12 md:grid-cols-[1fr_auto]">
          <a href="#top" onClick={(e) => (e.preventDefault(), scrollToId("top"))} aria-label="Back to top" className="w-fit">
            <Logo className="h-8 w-8 text-white/85" />
          </a>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:gap-20">
            {footer.columns.map((col) => (
              <div key={col.title}>
                <p className="t-small text-ink">{col.title}</p>
                <ul className="mt-5 space-y-3">
                  {col.links.map((l) => {
                    const internal = l.href.startsWith("#");
                    return (
                      <li key={l.label}>
                        <a
                          href={l.href}
                          onClick={internal ? (e) => (e.preventDefault(), scrollToId(l.href.slice(1))) : undefined}
                          target={internal || l.href.startsWith("mailto") ? undefined : "_blank"}
                          rel="noreferrer"
                          className="t-small text-muted transition-colors hover:text-ink"
                        >
                          {l.label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col-reverse items-start justify-between gap-6 border-t border-white/[0.08] pt-8 sm:flex-row sm:items-center">
          <p className="text-[13px] text-faint">
            © {profile.name}, 2026. Built with React, Motion and a lot of evals.
          </p>
          <div className="flex items-center gap-5 text-muted">
            <a href={links.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-ink">
              <GithubIcon className="h-4 w-4" />
            </a>
            <a href={links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-ink">
              <LinkedinIcon className="h-4 w-4" />
            </a>
            <a href={links.kaggle} target="_blank" rel="noreferrer" aria-label="Kaggle" className="hover:text-ink">
              <KaggleIcon className="h-4 w-4" />
            </a>
            <a href={`mailto:${links.email}`} aria-label="Email" className="hover:text-ink">
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
