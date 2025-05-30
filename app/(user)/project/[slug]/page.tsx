"use client";

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Project, Short } from '@/lib/generated/prisma'
import axios from 'axios'
import Image from 'next/image';
import { StatusBadge } from '@/components/Status';

interface ProjectResponse extends Project {
    shorts: Short[]
}

const ProjectPage = () => {
    const params = useParams()
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
        <div className='min-h-screen p-6 max-w-7xl mx-auto'>
            {/* Project Header */}
            <div className='mb-8'>
                <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
                <div className="flex items-center gap-4 text-gray-600">
                    <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
                    <StatusBadge status={project.status}/>
                </div>
            </div>

            {/* Project Cover and Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="md:col-span-2">
                    <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
                        <Image 
                            src={project.cover} 
                            alt={project.title} 
                            width={1200} 
                            height={675} 
                            className='object-cover w-full h-full'
                        />
                    </div>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Project Details</h2>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-500">Video ID</p>
                            <p className="font-medium">{project.videoId}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Slug</p>
                            <p className="font-medium">{project.slug}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Shorts Section */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-6">Generated Shorts</h2>
                {project.shorts.length === 0 ? (
                    <p className="text-gray-500">No shorts generated yet</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {project.shorts.map((short) => (
                            <div key={short.id} className="bg-white rounded-lg overflow-hidden shadow-md">
                                <div className="aspect-video relative">
                                    <Image
                                        src={project.cover}
                                        alt={`Short ${short.id}`}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-gray-500">
                                            {new Date(short.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 line-clamp-2">{short.highlightText}</p>
                                    <div className="mt-2 text-xs text-gray-500">
                                        <span>From: {short.from}s - To: {short.to}s</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProjectPage