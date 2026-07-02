"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import type { StaticHeroSlide } from "@/lib/static-storefront";

export function HomeHero({
  videoUrl,
  logoUrl,
  title,
  description,
  ctaLabel,
  ctaHref,
  slides
}: {
  videoUrl?: string | undefined;
  logoUrl?: string | undefined;
  title?: string | undefined;
  description?: string | undefined;
  ctaLabel?: string | undefined;
  ctaHref?: string | undefined;
  slides?: StaticHeroSlide[] | undefined;
}) {
  const heroSlides = useMemo<StaticHeroSlide[]>(
    () =>
      slides && slides.length > 0
        ? slides
        : [
            {
              id: "default",
              mediaUrl: videoUrl ?? "",
              mediaType: "video",
              logoUrl,
              title: title ?? "",
              description,
              ctaLabel: ctaLabel ?? "Know More",
              ctaHref: ctaHref ?? "/about-us"
            }
          ],
    [ctaHref, ctaLabel, description, logoUrl, slides, title, videoUrl]
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = heroSlides[activeIndex] ?? heroSlides[0];

  useEffect(() => {
    if (heroSlides.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroSlides.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, [heroSlides.length]);

  if (!activeSlide) return null;

  return (
    <section className="inshow-hero">
      {activeSlide.mediaType === "video" ? (
        <video autoPlay loop muted playsInline src={activeSlide.mediaUrl} />
      ) : (
        <img className="inshow-hero__media" src={activeSlide.mediaUrl} alt="" />
      )}
      <div className="inshow-hero__content">
        {activeSlide.logoUrl ? <img className="inshow-hero__logo" src={activeSlide.logoUrl} alt="INSHOW HOME" /> : null}
        <h1>{activeSlide.title}</h1>
        {activeSlide.description ? <p>{activeSlide.description}</p> : null}
        <div className="inshow-hero__actions">
          <Button asChild className="inshow-button">
            <Link href={activeSlide.ctaHref}>{activeSlide.ctaLabel}</Link>
          </Button>
        </div>
      </div>
      {heroSlides.length > 1 ? (
        <div className="inshow-hero__dots" aria-label="Hero slides">
          {heroSlides.map((slide, index) => (
            <button
              aria-label={`Show slide ${index + 1}`}
              aria-pressed={index === activeIndex}
              className={index === activeIndex ? "is-active" : undefined}
              key={slide.id}
              onClick={() => setActiveIndex(index)}
              type="button"
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
