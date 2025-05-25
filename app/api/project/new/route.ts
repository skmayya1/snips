import { auth } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import prisma from "@/lib/prisma";
import redis from "@/lib/redis";
import { ProjectDetails } from "@/lib/types";
import { headers } from "next/headers";
import { NextRequest } from "next/server";


  
export async function POST (req:NextRequest){
    const session = await auth.api.getSession({
      headers: await headers()
    })
    if(!session?.user?.email){
      return new Response(JSON.stringify({message:"Unauthorized"}),{
        status: 401,
      })
    }
    const email = session.user.email
    const ProjectConfig : ProjectDetails = await req.json()
    const slug = ProjectConfig.videoId + "-" + Date.now() + session.user.id

    const { id } = await prisma.project.create({
      data:{
        videoId: ProjectConfig.videoId,
        config: ProjectConfig as any ,
        slug,
        title:ProjectConfig.title,
        cover:ProjectConfig.thumbnail,
        status:'queued',
        user: {
          connect:{
            email
          }
        }
      }
    })
    const job = {
      videoId:ProjectConfig.videoId,
      timeframe: ProjectConfig.timeframe,
      requestedAt: new Date().toISOString(),
      projectId:id
    };
    await redis.rpush("download_queue", JSON.stringify(job));
    return new Response(JSON.stringify({message:"ok"}),{
        status: 200,
    })
}