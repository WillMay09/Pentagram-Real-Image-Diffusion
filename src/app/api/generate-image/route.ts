import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import crypto from "crypto";
import { blob } from "stream/consumers";
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text } = body;
    console.log(text)
    // TODO: Call your Image Generation API here
    // For now, we'll just echo back the text
    const url = process.env.URL_ENDPOINT
    if(!url){

      throw new Error("Endpoint not found!")
    }
    const generateURL = new URL(url);
    console.log(generateURL)
    generateURL.searchParams.set("prompt", text)
    console.log("url with prompt", generateURL)
    console.log("Requesting URL", url.toString())

    const response = await fetch(generateURL.toString(),{
      method:"GET",
      headers:{
        "X-API-KEY":process.env.API_KEY || "",
        Accept: "image/jpeg"
      }
    })
    //error handling
    if(!response.ok){
      const errorText = await response.text();
      console.error("API Reponse:", errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );

    }

    const imageBuffer = await response.arrayBuffer();

    const filename = `${crypto.randomUUID()}.jpg`

      //store prompt and image url in db, need to implement
    const blob = await put(filename,imageBuffer,{
      access:"public",
      contentType:"image/jpeg"

    })
    return NextResponse.json({
      success: true,
      imageUrl: blob.url,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to process request" },
      { status: 500 }
    );
  }
}