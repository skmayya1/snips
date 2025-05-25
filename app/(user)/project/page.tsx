"use client";
import NewProject from "@/components/new";
import Projects from "@/components/projects";
import NewProjectContext, {
  NewProjectProvider,
} from "@/contexts/NewProjectContext";
import { ProjectProvider } from "@/contexts/ProjectContext";
import React from "react";

const page = () => {
  return (
    <NewProjectProvider>
      <ProjectProvider>
        <div className="flex flex-col items-center justify-evenly h-full w-full">
        <NewProject />
        <Projects />
        </div>
      </ProjectProvider>
    </NewProjectProvider>
  );
};

export default page;
