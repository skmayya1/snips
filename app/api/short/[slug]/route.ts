import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import cloudinary from '@/lib/cloudinary';

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  try {
    const shortDetails = await prisma.short.findUnique({
      where: {
        id: slug,
      },
      include: {
        project: true
      },
    });

    if (!shortDetails) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(shortDetails);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const updatedShortConfigData = await request.json();
    const { slug } = await params;

    const dimensions = getDimensions(updatedShortConfigData.aspectRatio);

    const transformation = [
      {
        start_offset: `${updatedShortConfigData.from}s`,
        end_offset: `${updatedShortConfigData.to}s`,
        width: dimensions.width,
        height: dimensions.height,
        crop: "fill",
        gravity: "center",
        quality: "auto:good",
        format: "mp4"
      }
    ];

    const videoUrl = cloudinary.v2.url(updatedShortConfigData.pubId, {
      resource_type: "video",
      transformation,
      secure: true
    });

    await prisma.short.update({
      where: { id: slug },
      data: {
        from: updatedShortConfigData.from,
        to: updatedShortConfigData.to,
        url: videoUrl
      }
    });

    return NextResponse.json({ success: true, url: videoUrl });
  } catch (error) {
    console.error("PUT /short/:slug failed", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}


const getDimensions = (aspectRatio: string) => {
  switch (aspectRatio) {
    case "16:9":
      return { width: 1920, height: 1080 };
    case "9:16":
      return { width: 1080, height: 1920 };
    case "1:1":
      return { width: 1080, height: 1080 };
    default:
      console.warn(`Unknown aspect ratio: ${aspectRatio}, defaulting to 16:9`);
      return { width: 1920, height: 1080 };
  }
};