"use server"

import { error } from "console";

export async function generateImage(text:string){

    try {
        const response = await fetch(`http://localhost:3000/api/generate-image`, {
          method: "POST",
          //headers appear in the network request
          headers: {
            "Content-Type": "application/json",
            "X-API-SECRET": process.env.API_SECRET || "",
          },
          body: JSON.stringify({text}),
        });
  
        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        //parse the response
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.error || "Failed to generate image");
        }
      
        return data;
      } catch (error) {
        console.error("Error:", error);
        return {
            success: false,
            error:
            error instanceof Error ? error.message : "Failed to generate image",
    
           }

        }

    }