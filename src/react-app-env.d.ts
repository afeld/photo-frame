/// <reference types="react-scripts" />

declare namespace pf {
  interface Image {
    source: string;
  }

  interface Photo {
    id: string;
    name?: string;
    webp_images: Array<Image>;
  }
}
