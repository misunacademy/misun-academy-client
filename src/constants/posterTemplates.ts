export type PosterTemplate = {
  id: number;
  name: string;
  src: string;
  config: {
    canvasWidth: number;
    canvasHeight: number;
    photo: { x: number; y: number; radius: number };
    name: { x: number; y: number; fontSize: number; color: string };
    batch: {
      x: number;
      y: number;
      fontSize: number;
      color: string;
      bgColor: string;
      minWidth?: number;
      minHeight?: number;
    };
  };
};

export const TEMPLATES: Record<'graphic' | 'english', PosterTemplate[]> = {
  graphic: [
    {
      id: 1,
      name: 'Green Neon Style',
      src: '/posters/templete-1.png',
      config: {
        canvasWidth: 1080,
        canvasHeight: 1080,
        photo: { x: 535, y: 578, radius: 155 },
        name: { x: 540, y: 870, fontSize: 58, color: '#FFFFFF' },
        batch: {
          x: 540, y: 930, fontSize: 28, color: '#000000', bgColor: '#88f400',
        },
      },
    },
    {
      id: 2,
      name: 'Teal Ribbon Style',
      src: '/posters/templete-2.png',
      config: {
        canvasWidth: 1080,
        canvasHeight: 1080,
        photo: { x: 535, y: 578, radius: 155 },
        name: { x: 540, y: 870, fontSize: 58, color: '#FFFFFF' },
        batch: {
          x: 540, y: 930, fontSize: 28, color: '#000000', bgColor: '#00ffb4',
        },
      },
    },
  ],
  english: [
    {
      id: 1,
      name: 'Blue Neon Style',
      src: '/posters/esun1.png',
      config: {
        canvasWidth: 1080,
        canvasHeight: 1080,
        photo: { x: 535, y: 578, radius: 155 },
        name: { x: 540, y: 870, fontSize: 58, color: '#FFFFFF' },
        batch: {
          x: 540, y: 936, fontSize: 28, color: '#000000', bgColor: '#1e90ff',
          minWidth: 220, minHeight: 62,
        },
      },
    },
    {
      id: 2,
      name: 'Sky Ribbon Style',
      src: '/posters/esun2.png',
      config: {
        canvasWidth: 1080,
        canvasHeight: 1080,
        photo: { x: 535, y: 578, radius: 155 },
        name: { x: 540, y: 870, fontSize: 58, color: '#FFFFFF' },
        batch: {
          x: 540, y: 936, fontSize: 28, color: '#000000', bgColor: '#38bdf8',
          minWidth: 220, minHeight: 62,
        },
      },
    },
  ],
};
