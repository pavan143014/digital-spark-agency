import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, topic, keywords, tone, length, content: postContent, excerpt: postExcerpt } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    if (type === "generate_full") {
      systemPrompt = `You are an expert digital marketing content writer for PS Digital Marketing Agency. 
You create engaging, SEO-optimized blog posts that provide real value to readers.
Your writing style is professional yet approachable, with actionable insights.
Always structure content with clear headings, bullet points where appropriate, and a compelling introduction and conclusion.`;

      userPrompt = `Write a comprehensive blog post about: "${topic}"

Requirements:
- Tone: ${tone || "Professional and informative"}
- Target length: ${length || "1000-1500"} words
- Include relevant keywords: ${keywords || "digital marketing, online presence, business growth"}
- Structure with HTML tags (h2, h3, p, ul, li, strong, em)
- Include an engaging introduction that hooks the reader
- Add practical tips and actionable advice
- End with a compelling conclusion and call-to-action mentioning PS Digital

Format the content with proper HTML structure for a rich text editor.`;

    } else if (type === "generate_title") {
      systemPrompt = "You are an expert at creating compelling, SEO-optimized blog titles for digital marketing content.";
      userPrompt = `Generate 5 engaging blog title options for a post about: "${topic}"
      
Include keywords: ${keywords || "digital marketing"}
      
Return only the titles, one per line, numbered 1-5.`;

    } else if (type === "generate_excerpt") {
      systemPrompt = "You are an expert at writing compelling meta descriptions and excerpts for blog posts.";
      userPrompt = `Write a compelling excerpt/meta description (150-160 characters) for a blog post about: "${topic}"

The excerpt should:
- Be engaging and encourage clicks
- Include relevant keywords
- Summarize the value the reader will get

Return only the excerpt text.`;

    } else if (type === "generate_outline") {
      systemPrompt = "You are an expert content strategist who creates detailed blog outlines.";
      userPrompt = `Create a detailed outline for a blog post about: "${topic}"

Include:
- A compelling title
- Introduction hook
- 5-7 main sections with subpoints
- Key takeaways
- Conclusion ideas

Format as a clear, numbered outline.`;

    } else if (type === "improve_content") {
      systemPrompt = "You are an expert editor who improves blog content for clarity, engagement, and SEO.";
      userPrompt = `Improve and enhance the following blog content. Make it more engaging, add relevant examples, improve SEO, and ensure proper HTML formatting:

${topic}`;

    } else if (type === "generate_tags") {
      systemPrompt = "You are an SEO expert who creates relevant tags for blog posts.";
      userPrompt = `Generate 5-8 relevant tags for a blog post about: "${topic}"

Return only the tags, comma-separated, no explanations.`;

    } else if (type === "seo_analysis") {
      systemPrompt = `You are an expert SEO consultant for digital marketing blogs. 
Analyze content and provide specific, actionable optimization suggestions.
Focus on keyword usage, content structure, readability, and search intent.`;

      userPrompt = `Analyze this blog post for SEO optimization:

Title: "${topic}"
Excerpt: "${postExcerpt || 'Not provided'}"
Tags/Keywords: "${keywords || 'Not provided'}"
Content Preview: "${postContent?.substring(0, 2000) || 'Not provided'}..."

Provide specific recommendations in these areas:
1. **Title Optimization**: How to improve the title for better click-through rates
2. **Keyword Strategy**: Primary and secondary keywords to target
3. **Content Improvements**: Specific sections or topics to add/expand
4. **Readability**: Suggestions for better user engagement
5. **Internal Linking**: Types of related content to link to

Keep suggestions concise and actionable. Format with bullet points.`;

    } else {
      throw new Error("Invalid generation type");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: type === "generate_full" || type === "improve_content" ? 4000 : 1000,
        temperature: 0.7,
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
      throw new Error("Failed to generate content");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content generated");
    }

    return new Response(
      JSON.stringify({ content }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Blog generation error:", error);
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});