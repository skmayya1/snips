import { useProject } from "@/contexts/ProjectContext";
import React from "react";
import { StatusBadge } from "../Status";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

const Projects = () => {
  const { IsFetching, Projects } = useProject();
  console.log(Projects);

  const ProjectSkeleton = () => (
    <div className="relative overflow-hidden rounded-lg bg-eerie-black animate-pulse">
      <div className="aspect-video w-full bg-eerie-black"></div>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-eerie-black/80 to-transparent p-4">
        <div className="h-4 bg-eerie-black rounded w-3/4"></div>
      </div>
    </div>
  );

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <h3 className="text-xs font-medium text-white-smoke mb-2">
        No Projects Yet
      </h3>
      <h4 className="text-sm text-gray-400">Just drop a video link to begin</h4>
    </div>
  );

  return (
    <div className="h-full MAX_WIDTH">
      <div className="w-full h-fit">
        <span className="font-semibold text-sm text-white-smoke">
          Projects
        </span>
        <div className="mt-4">
          {IsFetching ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <ProjectSkeleton key={index} />
              ))}
            </div>
          ) : Projects && Projects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Projects.map((project, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-lg hover:rounded-none transition-all group ease-in-out duration-300 cursor-pointer"
                >
                  <div className="absolute top-0 right-0 m-2 z-10">
                    <StatusBadge
                      status={
                        project.status as
                          | "queued"
                          | "analyzing"
                          | "completed"
                          | "failed"
                      }
                    />
                  </div>
                  <img
                    src={project.cover}
                    alt={project.title}
                    className="w-full aspect-video object-cover group-hover:scale-105  transition-all group ease-in-out duration-300"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-night to-transparent px-4 pb-2 pt-10">
                    <h3 className="text-white font-semibold text-sm line-clamp-2 leading-tight">
                      {project.title}
                    </h3>
                    <p className="text-xs text-white-smoke">ETA - 5mins</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;
