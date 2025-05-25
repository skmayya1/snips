import axios from "axios";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface ProjectContextType {
  Projects: Projects[] | null;
  IsFetching : boolean
}

interface Projects {
  id: string,
  videoId: string,
  cover:string,
  status:string
  title:string,
  slug: string,
  createdAt: string
}


const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [Projects, setProjects] = useState<Projects[] | null>(null);
  const [IsFetching, setIsFetching] = useState(true)
  const value: ProjectContextType = {
    Projects,
    IsFetching
  };
  useEffect(() => {
    axios.get('/api/project')
    .then((res)=> setProjects(res.data.projects))
    .finally(()=> setIsFetching(false))
  },[]);
  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
};

export const useProject = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useNewProject must be used within a NewProjectProvider");
  }
  return context;
};

export default ProjectContext;
