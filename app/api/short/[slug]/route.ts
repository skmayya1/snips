import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }>}) {
  const {slug} = await params
  try {
    const shortDetails = await prisma.short.findUnique({
      where: {
        id: slug,
      },
      include: {
        project:true
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

export async function PUT (request: NextRequest, { params }: { params: Promise<{ slug: string }>}) {
  const { updatedShortConfig } = await request.json()

}