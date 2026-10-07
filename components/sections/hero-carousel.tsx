import Image, { type StaticImageData } from "next/image";

interface HeroCarouselProps {
  images: StaticImageData[];
  slideLabels: string[];
}

export default function HeroCarousel({ images, slideLabels }: HeroCarouselProps) {
  return (
    <div className="relative aspect-square">
      {images.map((src, index) => (
        <div
          key={index}
          className="absolute inset-0"
          style={{
            animation: `${index === 0 ? "heroFadeFirst" : "heroFade"} 13.5s infinite ${index * 4.5}s both`,
          }}
        >
          <Image
            src={src}
            alt={`Palamu Neuro & Eye Care ${index + 1}`}
            placeholder="blur"
            className="rounded-xl shadow-lg aspect-square object-cover"
            priority={index === 0}
            fetchPriority={index === 0 ? "high" : undefined}
            loading={index === 0 ? undefined : "lazy"}
            sizes="(max-width: 1023px) 100vw, 50vw"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-center py-2 rounded-b-xl">
            {slideLabels[index]}
          </div>
        </div>
      ))}
    </div>
  );
}
