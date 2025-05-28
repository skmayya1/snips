import React from "react";
import Container from "../Container";
import Image from "next/image";
import { useNewProject } from "@/contexts/NewProjectContext";
import SelectInput from "../DropDown";
import { Switch } from "../ui/switch";
import VideoTrimSlider from "../DualSlider";
import { parseISODuration } from "@/lib/utils";
import { RiAiGenerate } from "react-icons/ri";
import Spinner from "../Spinner";
import ToolTip from "../ToolTip";
import { CreditStar } from "../CreditStar";
import { motion } from "framer-motion"

const genreOptions = [
  { value: "auto", label: "Auto" },
  { value: "vlog", label: "Vlog" },
  { value: "podcast", label: "Podcast" },
  { value: "interview", label: "Interview" },
  { value: "tutorial", label: "Tutorial" },
  { value: "review", label: "Review" },
  { value: "reaction", label: "Reaction" },
  { value: "gaming", label: "Gaming" },
  { value: "music", label: "Music" },
  { value: "documentary", label: "Documentary" },
  { value: "comedy", label: "Comedy" },
  { value: "educational", label: "Educational" },
  { value: "news", label: "News" },
  { value: "tech", label: "Tech" },
  { value: "travel", label: "Travel" },
  { value: "fitness", label: "Fitness" },
];

const aspectOptions = [
  { value: "16:9", label: "16:9" },
  { value: "1:1", label: "1:1" },
  { value: "9:16", label: "9:16" },
];

const Editor = () => {
  const {
    VideoData,
    ProjectData,
    updateProjectData,
    HandleGenerate,
    isLoading,
  } = useNewProject();

  if (!VideoData) return null;

  const handleGenreChange = (value: string) => {
    updateProjectData({
      ...ProjectData,
      genre: value,
    });
  };

  const handleAspectChange = (value: string) => {
    updateProjectData({
      ...ProjectData,
      aspectRatio: value as "16:9" | "1:1" | "9:16" | undefined,
    });
  };

  return (
    <motion.div
      className="h-full w-full MAX_WIDTH"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.2,
        ease: "easeOut",
        type: "spring",
        stiffness: 100,
        damping: 20,
      }}
    >
      <Container background={false} className="py-6 flex h-full w-full">
        <div className="w-full flex flex-col md:flex-row gap-8">
          {/* Left side - Video Preview */}
          <div className="w-full md:w-1/2 flex flex-col gap-4">
            <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-md">
              {VideoData.thumbnail && (
                <Image
                  src={VideoData.thumbnail}
                  alt="thumbnail"
                  width={622}
                  height={350}
                  className="object-cover w-full h-full rounded-lg"
                />
              )}
            </div>
            <h1 className="text-silver text-xl font-medium line-clamp-2 px-1">
              {VideoData.title || "Untitled Video"}
            </h1>
            <button
              onClick={HandleGenerate}
              className="w-full bg-[#FF9505]/90 cursor-pointer text-night font-semibold py-2.5 rounded-lg flex items-center justify-center gap-1"
            >
              {isLoading ? (
                <Spinner />
              ) : (
                <div className="flex items-center gap-1">
                  Generate Shorts <RiAiGenerate className="inline-block ml-2" />
                </div>
              )}
            </button>
            <span className="text-sm text-silver flex items-center gap-1">
              Credits used:{" "}
              <span className="text-silver font-semibold flex items-center gap-1">
                {Math.ceil(
                  (ProjectData?.timeframe?.to as number) / 60 -
                    (ProjectData?.timeframe?.from as number) / 60
                )}{" "}
                <CreditStar />
              </span>{" "}
            </span>
          </div>

          {/* Right side - Settings Panel */}
          <div className="w-full md:w-1/2 flex flex-col gap-3">
            <Container
              background={false}
              border
              className="w-full p-6 py-5 rounded-lg"
            >
              <div className="space-y-3">
                {/* Genre Selection */}
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <label className="text-silver font-medium w-32 flex items-center gap-1">
                    Genre:
                    <ToolTip tooltipContent="Select the type of content to optimize your shorts">
                      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-eerie-black text-xs text-silver ">
                        ?
                      </span>
                    </ToolTip>
                  </label>
                  <div className="flex-grow">
                    <SelectInput
                      label=""
                      placeholder="Select genre"
                      options={genreOptions}
                      value={ProjectData?.genre}
                      onChange={handleGenreChange}
                    />
                  </div>
                </div>

                {/* Aspect Ratio Selection */}
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <label className="text-silver font-medium w-32 flex items-center gap-1">
                    Aspect Ratio:
                    <ToolTip tooltipContent="Choose format: 16:9 (landscape), 1:1 (square), 9:16 (vertical)">
                      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-eerie-black text-xs text-silver ">
                        ?
                      </span>
                    </ToolTip>
                  </label>
                  <div className="flex-grow">
                    <SelectInput
                      label=""
                      placeholder="Select aspect ratio"
                      options={aspectOptions}
                      value={ProjectData?.aspectRatio}
                      onChange={handleAspectChange}
                    />
                  </div>
                </div>

                {/* Clips Length Range */}
                <div className="flex text-silver flex-col md:flex-row md:items-center gap-3">
                  <label className="font-medium min-w-32 flex items-center gap-1">
                    Clip Length(s):
                    <ToolTip tooltipContent="Set minimum and maximum duration for generated clips in seconds">
                      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-eerie-black text-xs text-silver ">
                        ?
                      </span>
                    </ToolTip>
                  </label>
                  <div className="flex items-center gap-3">
                    <Container className="flex items-center px-1 ">
                      <input
                        type="number"
                        min={0}
                        max={180}
                        placeholder="0"
                        disabled={ProjectData?.clipLength.from == "auto"}
                        className="border-0 outline-0 bg-transparent w-8 text-center appearance-none 
                      [&::-webkit-outer-spin-button]:appearance-none 
                      [&::-webkit-inner-spin-button]:appearance-none 
                      [&::-moz-appearance:textfield]"
                      />
                    </Container>
                    <span className="text-silver font-medium">to</span>
                    <Container className="flex items-center px-1 ">
                      <input
                        disabled={ProjectData?.clipLength.to == "auto"}
                        type="number"
                        min={0}
                        max={180}
                        placeholder="30"
                        className="border-0 outline-0 bg-transparent w-8 text-center appearance-none 
                      [&::-webkit-outer-spin-button]:appearance-none 
                      [&::-webkit-inner-spin-button]:appearance-none 
                      [&::-moz-appearance:textfield]"
                      />
                    </Container>
                  </div>
                  <div className="flex items-center gap-1">
                    <Switch
                      onCheckedChange={() => {
                        updateProjectData({
                          ...ProjectData,
                          clipLength: {
                            from:
                              ProjectData?.clipLength.from !== "auto"
                                ? "auto"
                                : 0,
                            to:
                              ProjectData?.clipLength.to !== "auto"
                                ? "auto"
                                : 0,
                          },
                        });
                      }}
                    />
                    <span className="mr-1">Auto</span>
                    <ToolTip tooltipContent="Let AI determine optimal clip length">
                      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-eerie-black text-xs text-silver ">
                        ?
                      </span>
                    </ToolTip>
                  </div>
                </div>

                {/* Keywords */}
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <label className="text-silver font-medium w-32 flex items-center gap-1">
                    Keywords:
                    <ToolTip tooltipContent="Enter relevant terms to help find engaging moments in your video">
                      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-eerie-black text-xs text-silver ">
                        ?
                      </span>
                    </ToolTip>
                  </label>
                  <div className="flex-grow ">
                    <Container className="px-3 py-1 w-full">
                      <input
                        value={ProjectData?.keywords}
                        onChange={(e) => {
                          updateProjectData({
                            ...ProjectData,
                            keywords: e.target.value,
                          });
                        }}
                        placeholder=" keywords, separated"
                        className="border-0 outline-0 bg-transparent w-full appearance-none"
                      />
                    </Container>
                  </div>
                </div>

                {/* Shorts Count */}
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <label className="text-silver font-medium w-32 flex items-center gap-1">
                    Shorts Count:
                    <ToolTip tooltipContent="Number of short videos to generate from your content">
                      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-eerie-black text-xs text-silver ">
                        ?
                      </span>
                    </ToolTip>
                  </label>
                  <div className="flex items-center">
                    <Container className="flex items-center px-3 py-1">
                      <input
                        type="number"
                        min={0}
                        max={30}
                        placeholder="0"
                        className="border-0 outline-0 bg-transparent w-12 text-center appearance-none 
                      [&::-webkit-outer-spin-button]:appearance-none 
                      [&::-webkit-inner-spin-button]:appearance-none 
                      [&::-moz-appearance:textfield]"
                      />
                    </Container>
                  </div>
                </div>
              </div>
            </Container>
            <Container
              background={false}
              border
              className="w-full py-6 rounded-lg"
            >
              <VideoTrimSlider
                duration={parseISODuration(VideoData?.duration || "PT0S")}
              />
            </Container>
            <p className="text-xs text-timberwolf tracking-wide">
              * Each minute of video processed consumes 1 credit.
            </p>
          </div>
        </div>
      </Container>
    </motion.div>
  );
};

export default Editor;
