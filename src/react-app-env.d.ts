/// <reference types="react-scripts" />

declare namespace pf {
  interface Image {
    height: number;
    source: string;
    width: number;
  }

  interface ProfilePhoto {
    url: string;
  }

  interface User {
    id: string;
    link: string;
    name: string;
    picture: { data: ProfilePhoto };
  }

  interface Photo {
    id: string;
    name?: string;
    webp_images: Array<Image>;
  }
}
