import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { blogPosts } from "@/data/blogPosts";
import { Calendar, Clock, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

const BlogPost = () => {
  const { slug } = useParams();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
          <Button asChild>
            <Link to="/blog">Back to Blog</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const relatedPosts = blogPosts.filter((p) => p.id !== post.id).slice(0, 3);

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
            <div className="flex items-center gap-6 text-muted-foreground">
              <span className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {post.date}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {post.readTime}
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
              <div className="aspect-video rounded-xl overflow-hidden mb-8">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Article Body */}
              <div className="prose prose-lg max-w-none">
                <p className="lead text-xl text-muted-foreground mb-6">
                  {post.excerpt}
                </p>

                <p>
                  Digital marketing is constantly evolving, and staying ahead of the curve is essential 
                  for businesses looking to maintain a competitive edge. In this article, we'll explore 
                  some key strategies and insights that can help you navigate the ever-changing digital landscape.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">Key Takeaways</h2>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Understanding your target audience is crucial for effective marketing</li>
                  <li>Data-driven decisions lead to better ROI</li>
                  <li>Consistent content creation builds brand authority</li>
                  <li>Multi-channel approach maximizes reach</li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4">The Importance of Strategy</h2>
                <p>
                  A well-defined strategy is the foundation of any successful digital marketing campaign. 
                  Without a clear roadmap, businesses often find themselves throwing resources at various 
                  tactics without seeing meaningful results.
                </p>

                <p>
                  At PS Digital, we believe in a data-driven approach that focuses on measurable outcomes. 
                  Our team works closely with clients to understand their unique goals and develop customized 
                  strategies that deliver real results.
                </p>

                <h2 className="text-2xl font-bold mt-8 mb-4">Conclusion</h2>
                <p>
                  Success in digital marketing requires a combination of strategic thinking, creative execution, 
                  and continuous optimization. By staying informed about the latest trends and best practices, 
                  businesses can position themselves for long-term growth in the digital age.
                </p>
              </div>

              {/* Share Buttons */}
              <div className="flex items-center gap-4 mt-8 pt-8 border-t">
                <span className="font-medium flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Share:
                </span>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Linkedin className="h-4 w-4" />
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
                  <Link to="/#booking">Book Free Consultation</Link>
                </Button>
              </div>

              {/* Related Posts */}
              <div className="bg-card rounded-xl p-6 card-shadow border border-border/50">
                <h3 className="font-bold text-lg mb-4">Related Articles</h3>
                <div className="space-y-4">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.id}
                      to={`/blog/${relatedPost.slug}`}
                      className="flex gap-3 group"
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                        <img
                          src={relatedPost.image}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                          {relatedPost.title}
                        </h4>
                        <span className="text-xs text-muted-foreground">{relatedPost.date}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BlogPost;
