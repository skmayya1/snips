"use client";

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Project, Short } from '@/lib/generated/prisma'
import axios from 'axios'
import Image from 'next/image';
import { StatusBadge } from '@/components/Status';
import Shorts from '@/components/shorts';
import { FaArrowLeftLong } from "react-icons/fa6";

interface ProjectResponse extends Project {
    shorts: Short[]
    config: {
        aspectRatio: string
    }
}

const ProjectPage = () => {
    const params = useParams()
    const router = useRouter()
    const [project, setProject] = useState<ProjectResponse | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const slug = params.slug as string
        if (!slug) return

        const fetchProject = async () => {
            try {
                setIsLoading(true)
                setError(null)
                const response = await axios.get(`/api/project/${slug}`)
                setProject(response.data)
            } catch (err) {
                setError('Failed to load project')
                console.error('Error fetching project:', err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchProject()
    }, [params.slug])

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>
    }

    if (error) {
        return <div className="text-red-500 text-center min-h-screen flex items-center justify-center">{error}</div>
    }

    if (!project) {
        return <div className="text-center min-h-screen flex items-center justify-center">Project not found</div>
    }

    return (
        <div className='min-h-screen p-6 max-w-7xl mx-auto h-full'>
            <div onClick={()=> router.push('/project')} className="flex items-center gap-2 text-silver text-sm cursor-pointer"><FaArrowLeftLong/> back</div>
            {/* Project Cover and Details */}
            <div className="flex items-start justify-start w-full h-[33%] border-b border-silver/30 py-7 gap-10">
                <div className="aspect-video w-full max-w-md relative rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
                    {/* Main thumbnail image */}
                    <Image
                        src={project.cover}
                        alt={project.title}
                        width={1280}
                        height={720}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        priority
                        quality={90}
                        sizes="(max-width: 640px) 280px, (max-width: 1024px) 320px, 448px"
                    />
                </div>
                <div className="flex flex-col justify-between items-start h-full">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
                        <div className="flex items-center gap-4 font-thin text-sm text-silver">
                            <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
                            <StatusBadge status={project.status} />
                        </div>
                    </div>
                    {
                        project.status === 'completed' && (
                            <div className="flex items-center gap-4">
                                <div className="text-lg font-normal text-timberwolf/90 ">{project.shorts.length} {project.shorts.length === 1 ? 'Short' : 'Shorts'} generated</div>
                                <div className="">
                                    <button className="w-full bg-[#FF9505]/90 cursor-pointer text-night font-semibold py-2.5 rounded-lg flex items-center justify-center gap-1 px-10">
                                        Download All
                                    </button>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
            <Shorts shorts={project.shorts} aspectRatio={project.config?.aspectRatio as string} />
        </div>
    )
}

export default ProjectPage