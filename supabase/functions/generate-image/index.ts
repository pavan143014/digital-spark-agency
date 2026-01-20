import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, style, size } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase configuration is missing");
    }

    // Build enhanced prompt based on style
    const stylePrompts: Record<string, string> = {
      professional: "Professional, clean, modern business style with subtle gradients and corporate feel.",
      creative: "Creative, vibrant, artistic style with bold colors and dynamic composition.",
      minimalist: "Minimalist, clean, simple design with lots of white space and elegant typography.",
      abstract: "Abstract, artistic, conceptual design with geometric shapes and modern aesthetic.",
      photorealistic: "Photorealistic, high-quality photograph style with natural lighting and depth.",
    };

    const sizeDescriptions: Record<string, string> = {
      "1200x630": "landscape banner format, 16:9 aspect ratio suitable for blog headers and social sharing",
      "1080x1080": "square format, perfect for social media posts",
      "1080x1920": "vertical story format, 9:16 aspect ratio for mobile and stories",
    };

    const enhancedPrompt = `${prompt}. 
Style: ${stylePrompts[style] || stylePrompts.professional}
Format: ${sizeDescriptions[size] || sizeDescriptions["1200x630"]}
The image should be high quality, suitable for professional digital marketing use.
Ultra high resolution.`;

    console.log("Generating image with prompt:", enhancedPrompt);

    // Generate image using Lovable AI
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: enhancedPrompt,
          },
        ],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to generate image");
    }

    const data = await response.json();
    const imageBase64 = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageBase64) {
      console.error("No image in response:", JSON.stringify(data));
      throw new Error("No image generated");
    }

    // Extract base64 data (remove data:image/png;base64, prefix if present)
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    
    // Convert base64 to Uint8Array for upload
    const binaryData = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Generate unique filename
    const fileName = `ai-generated/${Date.now()}-${Math.random().toString(36).substring(7)}.png`;

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from("blog-images")
      .upload(fileName, binaryData, {
        contentType: "image/png",
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("blog-images")
      .getPublicUrl(fileName);

    return new Response(
      JSON.stringify({ 
        url: urlData.publicUrl,
        preview: imageBase64, // Send preview for immediate display
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Image generation error:", error);
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
