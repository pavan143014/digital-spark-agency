import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Clock, ArrowLeft, Share2, Facebook, Twitter, Linkedin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  category: string;
  author: string;
  tags: string[] | null;
  created_at: string;
  published_at: string | null;
}

const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    setIsLoading(true);
    setNotFound(false);

    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle();

    if (error) {
      console.error('Error fetching post:', error);
      setNotFound(true);
    } else if (!data) {
      setNotFound(true);
    } else {
      setPost(data);
      fetchRelatedPosts(data.id, data.category);
      // Track the view
      trackView(data.id);
    }
    setIsLoading(false);
  };

  const trackView = async (postId: string) => {
    try {
      await supabase.from('post_views').insert({
        post_id: postId,
        user_agent: navigator.userAgent,
        referrer: document.referrer || null,
      });
    } catch (error) {
      // Silently fail - view tracking is non-critical
      console.error('Failed to track view:', error);
    }
  };

  const fetchRelatedPosts = async (currentId: string, category: string) => {
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .eq('category', category)
      .neq('id', currentId)
      .limit(3);

    if (data && data.length > 0) {
      setRelatedPosts(data);
    } else {
      // Fallback to any other posts if no same-category posts
      const { data: fallbackData } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .neq('id', currentId)
        .limit(3);
      
      setRelatedPosts(fallbackData || []);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const estimateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  if (isLoading) {
    return (
      <Layout>
        <section className="py-12 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
          <div className="container">
            <Skeleton className="h-6 w-32 mb-6" />
            <div className="max-w-3xl">
              <Skeleton className="h-8 w-24 mb-4" />
              <Skeleton className="h-12 w-full mb-4" />
              <Skeleton className="h-12 w-3/4 mb-6" />
              <div className="flex gap-6">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          </div>
        </section>
        <section className="py-12">
          <div className="container">
            <div className="grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <Skeleton className="aspect-video rounded-xl mb-8" />
                <div className="space-y-4">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (notFound || !post) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/blog">Back to Blog</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  // Convert content to paragraphs
  const contentParagraphs = post.content.split('\n\n').filter(p => p.trim());

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container">
          <Link
            to="/blog"
            className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>

          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full mb-4">
              {post.category}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
              <span className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {post.author}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {formatDate(post.published_at || post.created_at)}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {estimateReadTime(post.content)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <article className="lg:col-span-2">
              {/* Featured Image */}
              {post.cover_image && (
                <div className="aspect-video rounded-xl overflow-hidden mb-8">
                  <img
                    src={post.cover_image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Article Body */}
              <div className="prose prose-lg max-w-none dark:prose-invert">
                {post.excerpt && (
                  <p className="lead text-xl text-muted-foreground mb-6">
                    {post.excerpt}
                  </p>
                )}

                {contentParagraphs.map((paragraph, index) => (
                  <p key={index} className="mb-4 text-foreground/90 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t">
                  <span className="text-sm font-medium text-muted-foreground">Tags:</span>
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm bg-muted rounded-full text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Share Buttons */}
              <div className="flex items-center gap-4 mt-8 pt-8 border-t">
                <span className="font-medium flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Share:
                </span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full"
                  asChild
                >
                  <a 
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full"
                  asChild
                >
                  <a 
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full"
                  asChild
                >
                  <a 
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(post.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="space-y-8">
              {/* CTA Card */}
              <div className="bg-gradient-to-br from-primary to-secondary rounded-xl p-6 text-white">
                <h3 className="font-bold text-xl mb-3">Need Help with Digital Marketing?</h3>
                <p className="text-white/80 mb-4 text-sm">
                  Get a free consultation and learn how we can help grow your business online.
                </p>
                <Button asChild className="w-full bg-white text-primary hover:bg-white/90">
                  <Link to="/contact">Book Free Consultation</Link>
                </Button>
              </div>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div className="bg-card rounded-xl p-6 card-shadow border border-border/50">
                  <h3 className="font-bold text-lg mb-4">Related Articles</h3>
                  <div className="space-y-4">
                    {relatedPosts.map((relatedPost) => (
                      <Link
                        key={relatedPost.id}
                        to={`/blog/${relatedPost.slug}`}
                        className="flex gap-3 group"
                      >
                        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-muted">
                          {relatedPost.cover_image ? (
                            <img
                              src={relatedPost.cover_image}
                              alt={relatedPost.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                              <span className="text-lg font-bold text-primary/30">
                                {relatedPost.title.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                            {relatedPost.title}
                          </h4>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(relatedPost.published_at || relatedPost.created_at)}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BlogPostPage;
