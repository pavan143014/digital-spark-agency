import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { services } from '@/data/services';
import { 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  Loader2, 
  Play, 
  Pause, 
  Sparkles,
  RefreshCw,
  Link as LinkIcon,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface ScheduledPost {
  id: string;
  title: string;
  service: string;
  scheduledDate: Date;
  status: 'pending' | 'generating' | 'generated' | 'published';
  topic: string;
}

interface AutoBlogSchedulerProps {
  onPostGenerated?: (post: { title: string; content: string; excerpt: string; tags: string; category: string }) => void;
}

const AutoBlogScheduler = ({ onPostGenerated }: AutoBlogSchedulerProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [customTopics, setCustomTopics] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('https://psdigital.in');
  const [includeInternalLinks, setIncludeInternalLinks] = useState(true);
  const [generatedQueue, setGeneratedQueue] = useState<ScheduledPost[]>([]);
  const { toast } = useToast();

  // Predefined topic templates for each service
  const topicTemplates: Record<string, string[]> = {
    'seo': [
      'How to Improve Your Website\'s Google Ranking in 2025',
      'Local SEO Strategies That Drive Foot Traffic',
      'Technical SEO Checklist for E-commerce Websites',
      'The Ultimate Guide to Keyword Research for Beginners',
      'Link Building Strategies That Actually Work',
      'How Voice Search is Changing SEO in India',
      'Mobile-First Indexing: What Your Business Needs to Know'
    ],
    'social-media': [
      'Instagram Marketing Trends Every Business Should Know',
      'How to Create Viral Content on Social Media',
      'LinkedIn Marketing Strategies for B2B Companies',
      'Building a Brand Community on Facebook',
      'Social Media Content Calendar: A Complete Guide',
      'Influencer Marketing: Finding the Right Partners',
      'Social Media Metrics That Actually Matter'
    ],
    'google-ads': [
      'Google Ads Budget Optimization Tips for Small Businesses',
      'How to Write High-Converting Ad Copy',
      'Remarketing Campaigns: A Step-by-Step Guide',
      'Google Shopping Ads Best Practices for E-commerce',
      'Reducing Cost Per Click Without Sacrificing Quality',
      'Landing Page Optimization for Better Ad Performance',
      'Google Ads vs Facebook Ads: Which is Right for You?'
    ],
    'web-development': [
      'Why Your Business Needs a Mobile-Responsive Website',
      'E-commerce Website Features That Boost Sales',
      'Website Speed Optimization: A Complete Guide',
      'Choosing the Right CMS for Your Business',
      'UX Design Principles That Improve Conversion Rates',
      'Website Security Best Practices for 2025',
      'Progressive Web Apps: The Future of Web Development'
    ],
    'content-marketing': [
      'Content Marketing ROI: How to Measure Success',
      'Creating a Content Strategy That Drives Traffic',
      'Blog Post Ideas for Every Industry',
      'The Art of Storytelling in Content Marketing',
      'Repurposing Content: Get More From Your Efforts',
      'Content Distribution Strategies That Work',
      'How to Create Evergreen Content That Ranks'
    ],
    'email-marketing': [
      'Email Marketing Automation for Beginners',
      'How to Build an Email List From Scratch',
      'Subject Lines That Increase Open Rates',
      'Email Segmentation Strategies for Better Results',
      'Drip Campaigns That Convert Leads to Customers',
      'Email Design Best Practices for 2025',
      'Measuring Email Marketing Success: Key Metrics'
    ],
    'branding': [
      'Building a Strong Brand Identity for Your Business',
      'Logo Design Trends for Modern Businesses',
      'Brand Voice: How to Communicate Authentically',
      'Personal Branding for Entrepreneurs',
      'Rebranding: When and How to Do It Right',
      'Color Psychology in Brand Design',
      'Creating Brand Guidelines That Work'
    ],
    'video-marketing': [
      'Video Marketing Strategies for Small Businesses',
      'Creating Engaging YouTube Content',
      'Short-Form Video: TikTok and Reels for Business',
      'Video SEO: How to Rank Your Videos',
      'Live Streaming for Business Growth',
      'Video Production on a Budget',
      'Measuring Video Marketing ROI'
    ]
  };

  const generateBlogPost = async (service: string, topic: string) => {
    const serviceData = services.find(s => s.id === service);
    if (!serviceData) return null;

    // Build internal links section
    const internalLinks = includeInternalLinks ? `
Include these do-follow internal links naturally within the content:
- Link to the main service page: <a href="${websiteUrl}/services/${service}" rel="dofollow">${serviceData.title}</a>
- Link to contact page: <a href="${websiteUrl}/contact" rel="dofollow">contact PS Digital</a>
- Link to homepage: <a href="${websiteUrl}" rel="dofollow">PS Digital Marketing Agency</a>
- Link to related services where relevant

Make sure links are contextually placed and provide value to readers.` : '';

    try {
      const { data, error } = await supabase.functions.invoke('generate-blog', {
        body: {
          type: 'generate_full',
          topic: topic,
          keywords: `${serviceData.title}, digital marketing, ${serviceData.subServices.slice(0, 3).map(s => s.name).join(', ')}, PS Digital, India`,
          tone: 'Professional and engaging',
          length: '1500-2000',
          additionalInstructions: `
This is for PS Digital Marketing Agency based in India.

${internalLinks}

SEO Requirements:
- Use the primary keyword in the first paragraph
- Include H2 and H3 headings with keywords
- Add a compelling meta description
- Include actionable tips and examples
- End with a strong call-to-action mentioning PS Digital's ${serviceData.shortTitle} services
- Make content valuable and shareable

Focus on providing real value to readers looking for ${serviceData.title} information.
`
        }
      });

      if (error) throw error;

      // Generate excerpt
      const { data: excerptData } = await supabase.functions.invoke('generate-blog', {
        body: {
          type: 'generate_excerpt',
          topic: topic,
          keywords: `${serviceData.title}, digital marketing`
        }
      });

      // Generate tags
      const { data: tagsData } = await supabase.functions.invoke('generate-blog', {
        body: {
          type: 'generate_tags',
          topic: topic
        }
      });

      return {
        title: topic,
        content: data.content,
        excerpt: excerptData?.content || '',
        tags: tagsData?.content || serviceData.shortTitle,
        category: serviceData.shortTitle
      };
    } catch (error) {
      console.error('Error generating blog post:', error);
      throw error;
    }
  };

  const handleGenerateSingle = async () => {
    if (!selectedService) {
      toast({
        title: 'Select a Service',
        description: 'Please select a service category first',
        variant: 'destructive'
      });
      return;
    }

    setIsGenerating(true);

    try {
      const topics = customTopics.trim() 
        ? customTopics.split('\n').filter(t => t.trim())
        : topicTemplates[selectedService] || [];

      if (topics.length === 0) {
        throw new Error('No topics available for this service');
      }

      // Pick a random topic
      const topic = topics[Math.floor(Math.random() * topics.length)];

      const post = await generateBlogPost(selectedService, topic);

      if (post && onPostGenerated) {
        onPostGenerated(post);
        toast({
          title: 'Blog Post Generated!',
          description: `"${post.title}" is ready for review`,
        });
      }
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: 'Generation Failed',
        description: 'Failed to generate blog post. Please try again.',
        variant: 'destructive'
      });
    }

    setIsGenerating(false);
  };

  const handleGenerateBatch = async () => {
    if (!selectedService) {
      toast({
        title: 'Select a Service',
        description: 'Please select a service category first',
        variant: 'destructive'
      });
      return;
    }

    setIsGenerating(true);

    try {
      const topics = topicTemplates[selectedService]?.slice(0, 3) || [];
      
      for (const topic of topics) {
        const post = await generateBlogPost(selectedService, topic);
        
        if (post) {
          // Save as draft to database
          const slug = topic.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-');

          await supabase.from('blog_posts').insert({
            title: post.title,
            slug: slug,
            content: post.content,
            excerpt: post.excerpt,
            tags: post.tags.split(',').map(t => t.trim()),
            category: post.category,
            author: 'PS Digital Team',
            published: false
          });
        }
      }

      toast({
        title: 'Batch Generation Complete!',
        description: `${topics.length} blog posts have been created as drafts`,
      });
    } catch (error) {
      console.error('Batch generation error:', error);
      toast({
        title: 'Batch Generation Failed',
        description: 'Some posts may have failed to generate',
        variant: 'destructive'
      });
    }

    setIsGenerating(false);
  };

  return (
    <Card className="border-primary/20">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle className="text-lg">AI Blog Automation</CardTitle>
                  <CardDescription>Generate SEO-optimized posts with internal links</CardDescription>
                </div>
              </div>
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-4">
            {/* Service Selection */}
            <div className="space-y-2">
              <Label>Service Category</Label>
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a service to write about" />
                </SelectTrigger>
                <SelectContent>
                  {services.map(service => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Website URL for internal links */}
            <div className="space-y-2">
              <Label>Website URL (for internal links)</Label>
              <Input
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://yourwebsite.com"
              />
            </div>

            {/* Include internal links toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-primary" />
                <div>
                  <Label className="font-medium">Include Do-Follow Links</Label>
                  <p className="text-xs text-muted-foreground">Add internal links to boost SEO</p>
                </div>
              </div>
              <Switch
                checked={includeInternalLinks}
                onCheckedChange={setIncludeInternalLinks}
              />
            </div>

            {/* Topic suggestions */}
            {selectedService && topicTemplates[selectedService] && (
              <div className="space-y-2">
                <Label>Available Topics for {services.find(s => s.id === selectedService)?.shortTitle}</Label>
                <div className="flex flex-wrap gap-2">
                  {topicTemplates[selectedService].slice(0, 4).map((topic, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {topic.length > 40 ? topic.substring(0, 40) + '...' : topic}
                    </Badge>
                  ))}
                  {topicTemplates[selectedService].length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{topicTemplates[selectedService].length - 4} more
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Custom topics */}
            <div className="space-y-2">
              <Label>Custom Topics (Optional)</Label>
              <Textarea
                value={customTopics}
                onChange={(e) => setCustomTopics(e.target.value)}
                placeholder="Enter custom topics, one per line..."
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to use pre-defined topics for the selected service
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <Button
                onClick={handleGenerateSingle}
                disabled={isGenerating || !selectedService}
                className="flex-1"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Post
                  </>
                )}
              </Button>
              <Button
                onClick={handleGenerateBatch}
                disabled={isGenerating || !selectedService}
                variant="outline"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Batch (3 Posts)
              </Button>
            </div>

            {/* Info card */}
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 space-y-2">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                What Gets Generated
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• SEO-optimized content with proper H2/H3 structure</li>
                <li>• Do-follow internal links to your service pages</li>
                <li>• Keyword-rich meta description and excerpt</li>
                <li>• Relevant tags for better discoverability</li>
                <li>• Call-to-action linking to your contact page</li>
              </ul>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default AutoBlogScheduler;
