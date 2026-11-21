import { useState } from 'react'

type ImageGalleryProps = { title: string; images: string[] }

/** Large image with thumbnails; the selected thumbnail has a frame. */
export function ImageGallery({ title, images }: ImageGalleryProps) {
  const [selected, setSelected] = useState(0)
  return (
    <div>
      <div className="aspect-square bg-surface">
        <img
          src={images[selected]}
          alt={title}
          className="size-full object-contain"
        />
      </div>
      <div className="mt-4 flex justify-center gap-2">
        {images.map((src, index) => (
          <button
            key={src}
            type="button"
            aria-label={`Image ${index + 1}`}
            aria-current={index === selected}
            onClick={() => setSelected(index)}
            className={`size-20 cursor-pointer border-2 bg-white ${
              index === selected ? 'border-text' : 'border-transparent'
            }`}
          >
            <img src={src} alt="" className="size-full object-contain" />
          </button>
        ))}
      </div>
    </div>
  )
}
