export interface ProjectDetails {
    genre: string;
    clipLength: {
      from: number | 'auto';
      to: number | 'auto';
    };
    keywords: string;
    timeframe: {
      from: number;
      to: number;
    };
    aspectRatio: "16:9" | "1:1" | "9:16";
    shortsCount: number;
    title: string;
    description: string;
    thumbnail: string;
    channelTitle: string;
    duration: string;
    videoId: string;
  }