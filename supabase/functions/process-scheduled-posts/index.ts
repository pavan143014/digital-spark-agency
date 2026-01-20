import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Service data for generating blog posts
const serviceData: Record<string, { title: string; shortTitle: string; subServices: string[] }> = {
  'seo': { title: 'SEO Services', shortTitle: 'SEO', subServices: ['Technical SEO', 'Local SEO', 'Link Building'] },
  'social-media': { title: 'Social Media Marketing', shortTitle: 'Social Media', subServices: ['Instagram Marketing', 'LinkedIn Marketing', 'Content Strategy'] },
  'google-ads': { title: 'Google Ads Management', shortTitle: 'Google Ads', subServices: ['Search Ads', 'Display Ads', 'Remarketing'] },
  'web-development': { title: 'Web Development', shortTitle: 'Web Dev', subServices: ['E-commerce', 'Responsive Design', 'CMS Development'] },
  'content-marketing': { title: 'Content Marketing', shortTitle: 'Content', subServices: ['Blog Writing', 'Copywriting', 'Content Strategy'] },
  'email-marketing': { title: 'Email Marketing', shortTitle: 'Email', subServices: ['Automation', 'Newsletters', 'Drip Campaigns'] },
  'branding': { title: 'Branding & Design', shortTitle: 'Branding', subServices: ['Logo Design', 'Brand Identity', 'Visual Design'] },
  'video-marketing': { title: 'Video Marketing', shortTitle: 'Video', subServices: ['YouTube Marketing', 'Video Production', 'Live Streaming'] },
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

This is for PS Digital Marketing Agency based in India.

${internalLinks}

SEO Requirements:
- Use the primary keyword in the first paragraph
- Include H2 and H3 headings with keywords
- Add a compelling meta description
- Include actionable tips and examples
- End with a strong call-to-action mentioning PS Digital's ${service.shortTitle} services
- Make content valuable and shareable
- Target length: 1500-2000 words

${scheduledPost.custom_instructions || ""}

Focus on providing real value to readers looking for ${service.title} information.`;

        // Call Lovable AI to generate content
        const aiResponse = await fetch("https://api.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${lovableApiKey}`,
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
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
        const excerptResponse = await fetch("https://api.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${lovableApiKey}`,
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
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
        const tags = [service.shortTitle, "Digital Marketing", "India", ...service.subServices.slice(0, 2)];

        // Insert the blog post
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
            published: false, // Save as draft for review
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
