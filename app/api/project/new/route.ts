import { NextRequest } from "next/server";

interface ProjectDetails {
    genre: string;
    clipLength: {
      from: number | 'auto';
      to: number | 'auto';
    };
    keywords: string;
    timeframe: {
      from: number;
      to: number;
    };
    aspectRatio: "16:9" | "1:1" | "9:16";
    shortsCount: number;
  }
  
export async function POST (req:NextRequest){
    const { } : ProjectDetails = await req.json()
}