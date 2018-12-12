/// <reference types="react-scripts" />

declare namespace pf {
  interface Image {
    height: number;
    source: string;
    width: number;
  }

  interface Photo {
    id: string;
    name?: string;
    webp_images: Array<Image>;
  }
}
