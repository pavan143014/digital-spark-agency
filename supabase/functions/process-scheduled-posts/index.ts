import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Service data for generating blog posts
const serviceData: Record<string, { title: string; shortTitle: string; subServices: string[] }> = {
  'seo': { title: 'SEO Services', shortTitle: 'SEO', subServices: ['Technical SEO', 'Local SEO', 'Link Building', 'On-Page SEO', 'E-commerce SEO'] },
  'social-media': { title: 'Social Media Marketing', shortTitle: 'Social Media', subServices: ['Instagram Marketing', 'LinkedIn Marketing', 'Facebook Marketing', 'Content Strategy'] },
  'google-ads': { title: 'Google Ads Management', shortTitle: 'Google Ads', subServices: ['Search Ads', 'Display Ads', 'Remarketing', 'Shopping Ads'] },
  'web-development': { title: 'Website Development', shortTitle: 'Web Dev', subServices: ['E-commerce', 'Responsive Design', 'CMS Development', 'Landing Pages'] },
  'content-marketing': { title: 'Content Marketing', shortTitle: 'Content', subServices: ['Blog Writing', 'Copywriting', 'Content Strategy', 'Article Writing'] },
  'email-marketing': { title: 'Email Marketing', shortTitle: 'Email', subServices: ['Automation', 'Newsletters', 'Drip Campaigns', 'List Building'] },
  'branding': { title: 'Branding & Identity', shortTitle: 'Branding', subServices: ['Logo Design', 'Brand Identity', 'Visual Design', 'Brand Strategy'] },
  'video-marketing': { title: 'Video Marketing', shortTitle: 'Video', subServices: ['YouTube Marketing', 'Video Production', 'Live Streaming', 'Video Ads'] },
  'influencer-marketing': { title: 'Influencer Marketing', shortTitle: 'Influencer', subServices: ['Instagram Influencers', 'YouTube Collaborations', 'Micro-Influencers', 'Campaign Management'] },
  'orm': { title: 'Online Reputation Management', shortTitle: 'ORM', subServices: ['Review Management', 'Crisis Management', 'Brand Monitoring', 'Reputation Repair'] },
  'app-marketing': { title: 'App Marketing', shortTitle: 'App Marketing', subServices: ['App Store Optimization', 'User Acquisition', 'App Install Campaigns', 'Retention Marketing'] },
  'marketing-automation': { title: 'Marketing Automation', shortTitle: 'Automation', subServices: ['CRM Integration', 'Lead Nurturing', 'Workflow Automation', 'Email Automation'] },
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Find pending scheduled posts that are due
    const now = new Date().toISOString();
    const { data: pendingPosts, error: fetchError } = await supabase
      .from("scheduled_blog_posts")
      .select("*")
      .eq("status", "pending")
      .lte("scheduled_at", now)
      .order("scheduled_at", { ascending: true })
      .limit(5); // Process 5 at a time to avoid timeouts

    if (fetchError) {
      throw new Error(`Failed to fetch scheduled posts: ${fetchError.message}`);
    }

    if (!pendingPosts || pendingPosts.length === 0) {
      return new Response(
        JSON.stringify({ message: "No pending posts to process", processed: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Processing ${pendingPosts.length} scheduled posts`);

    let processedCount = 0;
    const results: { id: string; status: string; postId?: string; error?: string }[] = [];

    for (const scheduledPost of pendingPosts) {
      try {
        // Mark as generating
        await supabase
          .from("scheduled_blog_posts")
          .update({ status: "generating" })
          .eq("id", scheduledPost.id);

        const service = serviceData[scheduledPost.service_id];
        if (!service) {
          throw new Error(`Unknown service: ${scheduledPost.service_id}`);
        }

        // Build internal links section
        const internalLinks = scheduledPost.include_internal_links
          ? `
Include these do-follow internal links naturally within the content:
- Link to the main service page: <a href="${scheduledPost.website_url}/services/${scheduledPost.service_id}" rel="dofollow">${service.title}</a>
- Link to contact page: <a href="${scheduledPost.website_url}/contact" rel="dofollow">contact PS Digital</a>
- Link to homepage: <a href="${scheduledPost.website_url}" rel="dofollow">PS Digital Marketing Agency</a>
- Link to related services where relevant

Make sure links are contextually placed and provide value to readers.`
          : "";

        // Generate blog content using AI
        const prompt = `Write a comprehensive, SEO-optimized blog post about: "${scheduledPost.topic}"

This is for PS Digital Marketing Agency, the best digital marketing agency in Guntur, Andhra Pradesh, India.

Primary SEO Keywords to include:
- "best digital marketing agency in guntur" (use 3-5 times naturally)
- "digital marketing services guntur"
- "guntur", "andhra pradesh", "vijayawada"

${internalLinks}

SEO Requirements:
- Use the primary keyword "best digital marketing agency in guntur" in the first paragraph
- Include H2 and H3 headings with location-based keywords
- Add a compelling meta description mentioning Guntur
- Include actionable tips and local examples relevant to Guntur businesses
- Reference PS Digital as the leading agency in Guntur and Andhra Pradesh
- End with a strong call-to-action mentioning PS Digital's ${service.shortTitle} services in Guntur
- Make content valuable for business owners in Andhra Pradesh
- Target length: 1500-2000 words

${scheduledPost.custom_instructions || ""}

Focus on providing real value to readers in Guntur and Andhra Pradesh looking for ${service.title} information.
Make sure to mention that PS Digital serves businesses across Guntur, Vijayawada, and the entire Andhra Pradesh region.`;

        // Call Lovable AI to generate content
        const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${lovableApiKey}`,
          },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: [
              {
                role: "system",
                content: "You are an expert SEO content writer. Write engaging, well-structured blog posts with proper HTML formatting (H2, H3 tags, paragraphs, lists). Include the internal links naturally where provided."
              },
              { role: "user", content: prompt }
            ],
          }),
        });

        if (!aiResponse.ok) {
          throw new Error(`AI generation failed: ${aiResponse.statusText}`);
        }

        const aiData = await aiResponse.json();
        const content = aiData.choices?.[0]?.message?.content;

        if (!content) {
          throw new Error("No content generated from AI");
        }

        // Generate excerpt
        const excerptResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${lovableApiKey}`,
          },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: [
              {
                role: "system",
                content: "Generate a compelling 150-160 character excerpt/meta description for the blog post. Just return the excerpt, nothing else."
              },
              { role: "user", content: `Topic: ${scheduledPost.topic}\n\nContent preview: ${content.substring(0, 500)}` }
            ],
          }),
        });

        const excerptData = await excerptResponse.json();
        const excerpt = excerptData.choices?.[0]?.message?.content || scheduledPost.topic;

        // Generate slug
        const slug = scheduledPost.topic
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .substring(0, 80);

        // Generate tags
        const tags = [service.shortTitle, "Digital Marketing", "Guntur", "Andhra Pradesh", "Best Digital Marketing Agency in Guntur", ...service.subServices.slice(0, 2)];

        // Generate cover image
        let coverImageUrl: string | null = null;
        try {
          console.log("Generating cover image for:", scheduledPost.topic);
          
          const imagePrompt = `Professional digital marketing blog cover image about ${service.title} for a business in Guntur, Andhra Pradesh, India. 
Modern, clean design with business and technology elements. 
Include subtle visual elements related to ${service.shortTitle}: ${service.subServices.slice(0, 2).join(", ")}.
Professional blue and orange color scheme. 
Space on left side for text overlay.
16:9 landscape banner format suitable for blog headers.
Ultra high resolution, professional marketing aesthetic.`;

          const imageResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${lovableApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "google/gemini-2.5-flash-image-preview",
              messages: [{ role: "user", content: imagePrompt }],
              modalities: ["image", "text"],
            }),
          });

          if (imageResponse.ok) {
            const imageData = await imageResponse.json();
            const imageBase64 = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

            if (imageBase64) {
              // Extract base64 data
              const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
              const binaryData = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));

              // Generate unique filename
              const fileName = `ai-generated/${Date.now()}-${Math.random().toString(36).substring(7)}.png`;

              // Upload to storage
              const { error: uploadError } = await supabase.storage
                .from("blog-images")
                .upload(fileName, binaryData, {
                  contentType: "image/png",
                  upsert: false,
                });

              if (!uploadError) {
                const { data: urlData } = supabase.storage
                  .from("blog-images")
                  .getPublicUrl(fileName);
                coverImageUrl = urlData.publicUrl;
                console.log("Cover image generated and uploaded:", coverImageUrl);
              } else {
                console.error("Failed to upload cover image:", uploadError.message);
              }
            }
          } else {
            console.error("Failed to generate cover image:", imageResponse.status);
          }
        } catch (imgError) {
          console.error("Error generating cover image:", imgError);
          // Continue without cover image - don't fail the whole post
        }

        // Insert the blog post (auto-publish)
        const { data: blogPost, error: insertError } = await supabase
          .from("blog_posts")
          .insert({
            title: scheduledPost.title || scheduledPost.topic,
            slug: `${slug}-${Date.now()}`,
            content,
            excerpt,
            tags,
            category: service.shortTitle,
            author: "PS Digital Team",
            published: true,
            published_at: new Date().toISOString(),
            cover_image: coverImageUrl,
          })
          .select()
          .single();

        if (insertError) {
          throw new Error(`Failed to insert blog post: ${insertError.message}`);
        }

        // Update scheduled post as completed
        await supabase
          .from("scheduled_blog_posts")
          .update({
            status: "completed",
            generated_post_id: blogPost.id,
          })
          .eq("id", scheduledPost.id);

        processedCount++;
        results.push({ id: scheduledPost.id, status: "completed", postId: blogPost.id });

        console.log(`Successfully processed scheduled post: ${scheduledPost.id}`);
      } catch (postError) {
        const errorMessage = postError instanceof Error ? postError.message : "Unknown error";
        console.error(`Failed to process scheduled post ${scheduledPost.id}:`, errorMessage);

        await supabase
          .from("scheduled_blog_posts")
          .update({
            status: "failed",
            error_message: errorMessage,
          })
          .eq("id", scheduledPost.id);

        results.push({ id: scheduledPost.id, status: "failed", error: errorMessage });
      }
    }

    return new Response(
      JSON.stringify({
        message: `Processed ${processedCount} of ${pendingPosts.length} scheduled posts`,
        processed: processedCount,
        results,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in process-scheduled-posts:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
