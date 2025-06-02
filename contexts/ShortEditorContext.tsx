"use client"
import { Project, Short } from '@/lib/generated/prisma';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';

interface Projects extends Project {
    config: {
        duration: number
        aspectRatio: '16:9' | '9:16' | '1:1'
    }
}

interface ProjectResponse {
    project: Projects
    short: Short 
}

interface ShortEditorContextType {
  currentShort: Short | null;
  currentProject: Projects | null;
  setCurrentShort: (short: Short | null) => void;
  setCurrentProject: (project: Projects | null) => void;
  updateShortTrim: (from: number, to: number) => void;
  toggleValue: string;
  setToggleValue: (value: string) => void;
}

const ShortEditorContext = createContext<ShortEditorContextType | undefined>(undefined);

const getProject = async (id: string): Promise<ProjectResponse | null> => {
    if (!id) {
        return null;
    }
    try {
        const response = await axios.get(`/api/short/${id}`);
        return {
            project: response.data.project,
            short: response.data
        } as ProjectResponse;
    } catch (err) {
        console.error('Error fetching project:', err);
        return null;
    }
}

export function ShortEditorProvider({ children }: { children: ReactNode }) {
  const [currentShort, setCurrentShort] = useState<Short | null>(null);
  const [currentProject, setCurrentProject] = useState<Projects | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [toggleValue, setToggleValue] = useState("generated");
  const params = useSearchParams()
  const id = params.get('id')



  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      const project = await getProject(id);      
      if (project) {
        setCurrentProject(project.project);
        setCurrentShort(project.short);
      }
    }
    fetchProject();
  }, [id])





  const updateShortTrim = (from: number, to: number) => {
    if (currentShort) {
      setCurrentShort({
        ...currentShort,
        from,
        to,
      });
    }
  };

  return (
    <ShortEditorContext.Provider
      value={{
        currentShort,
        currentProject,
        setCurrentShort,
        setCurrentProject,
        updateShortTrim,
        toggleValue,
        setToggleValue,
      }}
    >
      {children}
    </ShortEditorContext.Provider>
  );
}

export function useShortEditor() {
  const context = useContext(ShortEditorContext);
  if (context === undefined) {
    throw new Error('useShortEditor must be used within a ShortEditorProvider');
  }
  return context;
}
