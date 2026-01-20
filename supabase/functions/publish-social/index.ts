import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BufferProfile {
  id: string;
  service: string;
  formatted_username: string;
}

interface PublishRequest {
  action: 'get_profiles' | 'publish' | 'generate_image';
  bufferToken?: string;
  profileIds?: string[];
  text?: string;
  imageUrl?: string;
  prompt?: string;
  style?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, bufferToken, profileIds, text, imageUrl, prompt, style } = await req.json() as PublishRequest;
    
    if (action === 'get_profiles') {
      // Get connected Buffer profiles
      if (!bufferToken) {
        throw new Error("Buffer access token is required");
      }

      const response = await fetch("https://api.bufferapp.com/1/profiles.json", {
        headers: {
          "Authorization": `Bearer ${bufferToken}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Buffer API error:", response.status, errorText);
        if (response.status === 401) {
          throw new Error("Invalid Buffer access token");
        }
        throw new Error("Failed to fetch Buffer profiles");
      }

      const profiles = await response.json();
      return new Response(
        JSON.stringify({ profiles }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === 'generate_image') {
      // Validate prompt first
      if (!prompt || prompt.trim().length === 0) {
        throw new Error("Image prompt is required. Please provide a description.");
      }

      // Generate image using Lovable AI
      const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
      const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
      const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

      if (!LOVABLE_API_KEY) {
        throw new Error("LOVABLE_API_KEY is not configured");
      }

      const stylePrompts: Record<string, string> = {
        professional: "Professional, clean, modern business style with subtle gradients.",
        creative: "Creative, vibrant, artistic style with bold colors.",
        minimalist: "Minimalist, clean, simple design with elegant aesthetic.",
        social: "Social media optimized, eye-catching, scroll-stopping visual.",
      };

      const enhancedPrompt = `Create an image: ${prompt.trim()}. 
Style: ${stylePrompts[style || 'social']}
Format: Square 1:1 aspect ratio, perfect for social media posts.
Ultra high resolution, engaging visual for social media.`;

      console.log("Generating social image with prompt:", enhancedPrompt);

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image-preview",
          messages: [{ role: "user", content: enhancedPrompt }],
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
        throw new Error("Failed to generate image");
      }

      const data = await response.json();
      const imageBase64 = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

      if (!imageBase64) {
        throw new Error("No image generated");
      }

      // Upload to Supabase storage
      if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        const binaryData = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
        
        const fileName = `social-images/${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
        
        const { error: uploadError } = await supabase.storage
          .from("blog-images")
          .upload(fileName, binaryData, { contentType: "image/png" });

        if (!uploadError) {
          const { data: urlData } = supabase.storage.from("blog-images").getPublicUrl(fileName);
          return new Response(
            JSON.stringify({ url: urlData.publicUrl, preview: imageBase64 }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }

      // Return base64 if storage upload fails
      return new Response(
        JSON.stringify({ preview: imageBase64 }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === 'publish') {
      // Publish to Buffer
      if (!bufferToken) {
        throw new Error("Buffer access token is required");
      }

      if (!profileIds || profileIds.length === 0) {
        throw new Error("At least one profile must be selected");
      }

      if (!text) {
        throw new Error("Post text is required");
      }

      const results = [];

      for (const profileId of profileIds) {
        const body: Record<string, unknown> = {
          profile_ids: [profileId],
          text,
          now: true,
        };

        // Add image if provided
        if (imageUrl) {
          body.media = { photo: imageUrl };
        }

        const response = await fetch("https://api.bufferapp.com/1/updates/create.json", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${bufferToken}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            profile_ids: profileId,
            text,
            now: "true",
            ...(imageUrl ? { "media[photo]": imageUrl } : {}),
          }),
        });

        const result = await response.json();
        
        if (!response.ok) {
          console.error("Buffer publish error:", result);
          results.push({ profileId, success: false, error: result.message || "Failed to publish" });
        } else {
          results.push({ profileId, success: true, update: result.updates?.[0] });
        }
      }

      const successCount = results.filter(r => r.success).length;
      
      return new Response(
        JSON.stringify({ 
          results, 
          summary: `Published to ${successCount}/${profileIds.length} profiles` 
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    throw new Error("Invalid action");

  } catch (error: unknown) {
    console.error("Social publish error:", error);
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
