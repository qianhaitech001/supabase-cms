"use client";

import { useMemo, useState } from "react";
import type { MediaAsset } from "@global-trade/core";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type ProductGalleryProps = {
  images: MediaAsset[];
  title: string;
};

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const galleryImages = useMemo(() => images.filter((image) => image.publicUrl), [images]);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = galleryImages[activeIndex];

  if (!activeImage) {
    return <div className="product-image-placeholder">INSHOW HOME</div>;
  }

  return (
    <div className="product-gallery">
      <div className="product-main-image">
        <img key={activeImage.publicUrl} src={activeImage.publicUrl} alt={activeImage.alt ?? title} />
        <Dialog>
          <DialogTrigger asChild>
            <button className="product-zoom-button" type="button" aria-label="View product image fullscreen">
              <Search size={18} strokeWidth={2.5} />
            </button>
          </DialogTrigger>
          <DialogContent className="product-lightbox-content">
            <DialogTitle className="sr-only">{title}</DialogTitle>
            <img src={activeImage.publicUrl} alt={activeImage.alt ?? title} />
          </DialogContent>
        </Dialog>
      </div>
      {galleryImages.length > 1 && (
        <div className="product-thumbnail-grid">
          {galleryImages.slice(0, 10).map((image, index) => (
            <button
              className={index === activeIndex ? "is-active" : undefined}
              key={`${image.publicUrl}-${index}`}
              onClick={() => setActiveIndex(index)}
              type="button"
              aria-label={`Show image ${index + 1}`}
            >
              <img src={image.publicUrl} alt={image.alt ?? `${title} ${index + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
