import { extractYoutubeVideoId } from "@/lib/utils";
import axios from "axios";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface NewProjectContextType {
  resetProjectData: () => void;
  isLoading: boolean;
  error: string | null;
  videoSource: VideoSource;
  setVideoSource: React.Dispatch<React.SetStateAction<VideoSource>>;
  VideoData: VideoDetails | null;
  ProjectData: ProjectDetails | null;
  updateProjectData: (data: Partial<ProjectDetails>) => void;
  HandleGenerate:()=> void
}

interface VideoSource {
  type: "youtube" | "upload" | null;
  data: string | File | null;
}

interface VideoDetails {
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  duration: string;
}

interface ProjectDetails {
  videoId: string;
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
}

const NewProjectContext = createContext<NewProjectContextType | undefined>(
  undefined
);

export const NewProjectProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [videoSource, setVideoSource] = useState<VideoSource>({
    type: null,
    data: null,
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [VideoData, setVideoData] = useState<VideoDetails | null>(null);
  const [ProjectData, setProjectData] = useState<ProjectDetails | null>(null);
  const resetProjectData = () => {
    setError(null);
    setVideoSource({ type: null, data: null });
    setVideoData(null);
    setProjectData(null);
  };

  const updateProjectData = (data: Partial<ProjectDetails>) => {
    setProjectData((prev) => ({
          ...prev,
          ...data,
          clipLength: {
            ...(prev?.clipLength || { from: 0, to: 0 }),
            ...data.clipLength,
          },
          timeframe: {
            ...(prev?.timeframe || { from: 0, to: 0 }),
            ...data.timeframe,
          },
          videoId: data.videoId ?? prev?.videoId ?? "",
          genre: data.genre ?? prev?.genre ?? "",
          keywords: data.keywords ?? prev?.keywords ?? "",
          aspectRatio: data.aspectRatio ?? prev?.aspectRatio ?? "16:9",
          shortsCount: data.shortsCount ?? prev?.shortsCount ?? 0,
        }));
  };

  React.useEffect(() => {
    const isYoutube = videoSource.type === "youtube";
    const isValid =
      typeof videoSource.data === "string" &&
      extractYoutubeVideoId(videoSource.data);

    if (isYoutube && isValid) {
      HandleUpload();
    }
  }, [videoSource]);



  const HandleUpload = async () => {
    const videoId = extractYoutubeVideoId(videoSource.data as string);
    updateProjectData({ videoId: videoId || "" });
    if (!videoId) {
      setError("Invalid YouTube link");
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.get(`/api/youtube?video=${videoId}`);
      setVideoData(res.data);
      setError(null);
    } catch (err: any) {
      setError("Failed to fetch video details");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const HandleGenerate = async () =>{
    console.log(ProjectData);
    setIsLoading(true)
    const data = {
      ...ProjectData,
      ...VideoData
    }

    const response = await axios.post('/api/project/new', data);
    if (response.status === 200) {
      window.location.reload();
    } else {  
      
    }
    setIsLoading(false)
  }

  const value: NewProjectContextType = {
    resetProjectData,
    error,
    isLoading,
    setVideoSource,
    VideoData,
    videoSource,
    ProjectData,
    updateProjectData,
    HandleGenerate
  };

  return (
    <NewProjectContext.Provider value={value}>
      {children}
    </NewProjectContext.Provider>
  );
};

export const useNewProject = (): NewProjectContextType => {
  const context = useContext(NewProjectContext);
  if (context === undefined) {
    throw new Error("useNewProject must be used within a NewProjectProvider");
  }
  return context;
};

export default NewProjectContext;
