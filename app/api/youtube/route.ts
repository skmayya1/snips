import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.YOUTUBE_API_KEY;
const API_URL = "https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const videoId = searchParams.get("video");

  if (!videoId) {
    return NextResponse.json({ error: "Missing video ID" }, { status: 400 });
  }

  try {
    const { data } = await axios.get(`${API_URL}&id=${videoId}&key=${API_KEY}`);

    if (!data.items || data.items.length === 0) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }
    console.log(data.items);
    
    const video = data.items[0];
    const { title, description, thumbnails, channelTitle } = video.snippet;
    const { duration } = video.contentDetails;
    console.log(thumbnails);
    
    return NextResponse.json({
      title,
      description,
      thumbnail: thumbnails?.maxres?.url,
      channelTitle,
      duration,
    });
    
  } catch (error: any) {
    console.error("YouTube API error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: "Failed to fetch video details" },
      { status: 500 }
    );
  }
}
