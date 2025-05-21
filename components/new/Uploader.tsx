"use client";
import React from "react";
import Container from "../Container";
import { IoIosLink } from "react-icons/io";
import { AiOutlineUpload } from "react-icons/ai";
import { useNewProject } from "@/contexts/NewProjectContext";

const Uploader = () => {
  const { setVideoSource, VideoData, videoSource } = useNewProject();
  return (
    <Container background={false} className="flex flex-col gap-3 py-10 h-fit w-full ">
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full ">
        <Container
          background={VideoData !== null}
          border
          className="flex items-center justify-between w-full md:w-[30vw]"
        >
          <input
            onChange={(e) => {
              setVideoSource({
                data: e.target.value,
                type: "youtube",
              });
            }}
            disabled={VideoData !== null }
            value={typeof videoSource.data === "string" ? videoSource.data : ""}
            placeholder="Youtube link"
            className={`outline-0 border-0 w-full text-white-smoke h-fit px-2 py-1 text-md bg-transparent ${VideoData !== null ? 'cursor-not-allowed opacity-60':''}`}
          />
          <IoIosLink color="gray" />
        </Container>

        <p className="text-xs text-silver hidden md:block">OR</p>

        <Container className="flex items-center justify-center gap-3 tracking-wide text-sm text-silver py-2.5 cursor-pointer ">
          <AiOutlineUpload size={22} color="gray" />
          Upload from device
        </Container>
      </div>
    </Container>
  );
};

export default Uploader;
