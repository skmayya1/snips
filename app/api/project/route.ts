import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.email) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }
    const email = session.user.email;
    const projects = await prisma.project.findMany({
      where: {
        user: {
          email,
        },
      },
      select: {
        id: true,
        videoId: true,
        cover:true,
        slug: true,
        status:true,
        title:true,
        createdAt: true
      },
      orderBy: {
        createdAt: "desc",
      },
    
    });
    return new Response(JSON.stringify({ projects }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
