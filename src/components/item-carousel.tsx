"use client";

import { useState, useRef, useCallback } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons-pro/core-stroke-rounded";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Counter from "yet-another-react-lightbox/plugins/counter";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/counter.css";
import { cn } from "@/lib/utils";

interface ItemCarouselProps {
  photos: string[];
  title: string;
}

export function ItemCarousel({ photos, title }: ItemCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStart = useRef(0);
  const touchDelta = useRef(0);

  const goTo = useCallback(
    (index: number) => {
      setCurrent(Math.max(0, Math.min(index, photos.length - 1)));
    },
    [photos.length]
  );

  function handleTouchStart(e: React.TouchEvent) {
    touchStart.current = e.touches[0].clientX;
    touchDelta.current = 0;
  }

  function handleTouchMove(e: React.TouchEvent) {
    touchDelta.current = e.touches[0].clientX - touchStart.current;
  }

  function handleTouchEnd() {
    if (Math.abs(touchDelta.current) > 50) {
      goTo(touchDelta.current < 0 ? current + 1 : current - 1);
    }
    touchDelta.current = 0;
  }

  if (!photos.length) return null;

  return (
    <div className="relative">
      <div
        className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={photos[current]}
          alt={`${title} - foto ${current + 1}`}
          className="h-full w-full cursor-zoom-in object-cover transition-opacity duration-200"
          onClick={() => setLightboxOpen(true)}
        />

        {/* Arrows */}
        {photos.length > 1 && (
          <>
            {current > 0 && (
              <button
                onClick={() => goTo(current - 1)}
                className="absolute top-1/2 left-2 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-card/90 text-foreground shadow-md ring-1 ring-border/50 backdrop-blur-sm transition-all hover:bg-card hover:shadow-lg"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
              </button>
            )}
            {current < photos.length - 1 && (
              <button
                onClick={() => goTo(current + 1)}
                className="absolute top-1/2 right-2 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-card/90 text-foreground shadow-md ring-1 ring-border/50 backdrop-blur-sm transition-all hover:bg-card hover:shadow-lg"
              >
                <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
              </button>
            )}
          </>
        )}

        {/* Counter */}
        {photos.length > 1 && (
          <span className="absolute right-2 bottom-2 rounded-full bg-foreground/70 px-2.5 py-0.5 text-[11px] font-bold text-white backdrop-blur-sm">
            {current + 1}/{photos.length}
          </span>
        )}
      </div>

      {/* Dots */}
      {photos.length > 1 && (
        <div className="mt-3 flex justify-center gap-1.5">
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={cn(
                "h-1.5 cursor-pointer rounded-full transition-all duration-300",
                i === current
                  ? "w-5 bg-primary"
                  : "w-1.5 bg-border hover:bg-muted-foreground/30"
              )}
            />
          ))}
        </div>
      )}

      {/* Fullscreen lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={current}
        slides={photos.map((src) => ({ src }))}
        on={{ view: ({ index }) => setCurrent(index) }}
        plugins={[Zoom, Counter]}
        animation={{ fade: 200, swipe: 300 }}
        controller={{ closeOnBackdropClick: true }}
        carousel={{ finite: true }}
      />
    </div>
  );
}
