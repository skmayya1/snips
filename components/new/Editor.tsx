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
               <Spinner/>
            ) : (
              <div className="flex items-center gap-1">
                Generate Shorts <RiAiGenerate className="inline-block ml-2" />
              </div>            )}
          </button>
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
                <label className="text-silver font-medium w-32">Genre:</label>
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
                <label className="text-silver font-medium w-32">
                  Aspect Ratio:
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
                <label className=" font-medium w-32">Clip Length(s):</label>
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
                <Switch
                  onCheckedChange={() => {
                    updateProjectData({
                      ...ProjectData,
                      clipLength: {
                        from:
                          ProjectData?.clipLength.from !== "auto" ? "auto" : 0,
                        to: ProjectData?.clipLength.to !== "auto" ? "auto" : 0,
                      },
                    });
                  }}
                />{" "}
                Auto
              </div>

              {/* Keywords */}
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <label className="text-silver font-medium w-32">
                  Keywords:
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
                <label className="text-silver font-medium w-32">
                  Shorts Count:
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
            * Each minute of generated short video consumes 1 credit.
          </p>
        </div>
      </div>
    </Container>
  );
};

export default Editor;
