import axios from "axios";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";

interface ProjectContextType {
  Projects: Projects[] | null;
  IsFetching: boolean;
  refetchProjects: () => Promise<void>;
}

interface Projects {
  id: string;
  videoId: string;
  cover: string;
  status: string;
  title: string;
  slug: string;
  createdAt: string;
}

const POLLING_INTERVAL = 200000; // 20 seconds in milliseconds

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [Projects, setProjects] = useState<Projects[] | null>(null);
  const [IsFetching, setIsFetching] = useState(true);

  const fetchProjects = useCallback(async () => {
    try {
      const response = await axios.get('/api/project');
      setProjects(response.data.projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const poll = async () => {
      await fetchProjects();
      timeoutId = setTimeout(poll, POLLING_INTERVAL);
    };

    poll();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [fetchProjects]);

  const value: ProjectContextType = {
    Projects,
    IsFetching,
    refetchProjects: fetchProjects,
  };

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
};

export const useProject = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
};

export default ProjectContext;
