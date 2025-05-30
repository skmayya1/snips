import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }>}) {
    const { slug } = await params
    try {
        const project = await prisma.project.findUnique({
            where: { slug },
            select:{
                config:true,
                shorts:true,
                title:true,
                cover:true,
                status:true,
                videoId:true,
                createdAt:true,
    
            }
        })
        if(!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 })
        }
        return NextResponse.json(project)  
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }
}