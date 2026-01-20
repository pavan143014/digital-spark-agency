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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { services } from '@/data/services';
import { format } from 'date-fns';
import { 
  Calendar as CalendarIcon, 
  ChevronDown, 
  ChevronUp, 
  Loader2, 
  Sparkles,
  RefreshCw,
  Link as LinkIcon,
  CheckCircle2,
  Clock,
  Trash2,
  AlertCircle,
  Play,
  Settings,
  Layers,
  History
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface ScheduledPost {
  id: string;
  title: string;
  topic: string;
  service_id: string;
  scheduled_at: string;
  status: string;
  include_internal_links: boolean;
  website_url: string;
  custom_instructions: string | null;
  generated_post_id: string | null;
  error_message: string | null;
  created_at: string;
}

interface AutoBlogSchedulerProps {
  onPostGenerated?: (post: { title: string; content: string; excerpt: string; tags: string; category: string }) => void;
}

const AutoBlogScheduler = ({ onPostGenerated }: AutoBlogSchedulerProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('generate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [customTopics, setCustomTopics] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('https://psdigital.in');
  const [includeInternalLinks, setIncludeInternalLinks] = useState(true);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [isLoadingScheduled, setIsLoadingScheduled] = useState(false);
  
  // Scheduling state
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>(undefined);
  const [scheduleTime, setScheduleTime] = useState('09:00');
  const [scheduleTopic, setScheduleTopic] = useState('');
  const [scheduleTitle, setScheduleTitle] = useState('');
  const [customInstructions, setCustomInstructions] = useState('');
  
  // Bulk scheduling state
  const [bulkSelectedTopics, setBulkSelectedTopics] = useState<string[]>([]);
  const [bulkStartDate, setBulkStartDate] = useState<Date | undefined>(undefined);
  const [bulkInterval, setBulkInterval] = useState('1'); // days between posts
  const [bulkStartTime, setBulkStartTime] = useState('09:00');
  const [isBulkScheduling, setIsBulkScheduling] = useState(false);
  
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

  // Fetch scheduled posts
  const fetchScheduledPosts = async () => {
    setIsLoadingScheduled(true);
    try {
      const { data, error } = await supabase
        .from('scheduled_blog_posts')
        .select('*')
        .order('scheduled_at', { ascending: true });

      if (error) throw error;
      setScheduledPosts(data || []);
    } catch (error) {
      console.error('Error fetching scheduled posts:', error);
    } finally {
      setIsLoadingScheduled(false);
    }
  };

  useEffect(() => {
    fetchScheduledPosts();
  }, []);

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

  const handleSchedulePost = async () => {
    if (!selectedService || !scheduleDate || !scheduleTopic) {
      toast({
        title: 'Missing Information',
        description: 'Please select a service, date, and topic',
        variant: 'destructive'
      });
      return;
    }

    try {
      // Combine date and time
      const [hours, minutes] = scheduleTime.split(':').map(Number);
      const scheduledAt = new Date(scheduleDate);
      scheduledAt.setHours(hours, minutes, 0, 0);

      const { error } = await supabase.from('scheduled_blog_posts').insert({
        title: scheduleTitle || scheduleTopic,
        topic: scheduleTopic,
        service_id: selectedService,
        scheduled_at: scheduledAt.toISOString(),
        include_internal_links: includeInternalLinks,
        website_url: websiteUrl,
        custom_instructions: customInstructions || null,
        status: 'pending'
      });

      if (error) throw error;

      toast({
        title: 'Post Scheduled!',
        description: `Blog post scheduled for ${format(scheduledAt, 'PPP p')}`,
      });

      // Reset form
      setScheduleTopic('');
      setScheduleTitle('');
      setScheduleDate(undefined);
      setCustomInstructions('');
      
      // Refresh list
      fetchScheduledPosts();
    } catch (error) {
      console.error('Scheduling error:', error);
      toast({
        title: 'Scheduling Failed',
        description: 'Failed to schedule the post',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteScheduled = async (id: string) => {
    try {
      const { error } = await supabase
        .from('scheduled_blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Post Removed',
        description: 'Scheduled post has been deleted',
      });

      fetchScheduledPosts();
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: 'Delete Failed',
        description: 'Failed to delete scheduled post',
        variant: 'destructive'
      });
    }
  };

  const handleProcessNow = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('process-scheduled-posts');
      
      if (error) throw error;

      toast({
        title: 'Processing Complete',
        description: data.message || 'Scheduled posts processed',
      });

      fetchScheduledPosts();
    } catch (error) {
      console.error('Process error:', error);
      toast({
        title: 'Processing Failed',
        description: 'Failed to process scheduled posts',
        variant: 'destructive'
      });
    }
  };

  const handleBulkSchedule = async () => {
    if (!selectedService || bulkSelectedTopics.length === 0 || !bulkStartDate) {
      toast({
        title: 'Missing Information',
        description: 'Please select service, topics, and start date',
        variant: 'destructive'
      });
      return;
    }

    setIsBulkScheduling(true);

    try {
      const [hours, minutes] = bulkStartTime.split(':').map(Number);
      const intervalDays = parseInt(bulkInterval) || 1;
      
      const postsToInsert = bulkSelectedTopics.map((topic, index) => {
        const scheduledAt = new Date(bulkStartDate);
        scheduledAt.setDate(scheduledAt.getDate() + (index * intervalDays));
        scheduledAt.setHours(hours, minutes, 0, 0);
        
        return {
          title: topic,
          topic: topic,
          service_id: selectedService,
          scheduled_at: scheduledAt.toISOString(),
          include_internal_links: includeInternalLinks,
          website_url: websiteUrl,
          custom_instructions: customInstructions || null,
          status: 'pending'
        };
      });

      const { error } = await supabase.from('scheduled_blog_posts').insert(postsToInsert);

      if (error) throw error;

      toast({
        title: 'Bulk Schedule Created!',
        description: `${bulkSelectedTopics.length} posts scheduled starting ${format(bulkStartDate, 'PPP')}`,
      });

      // Reset form
      setBulkSelectedTopics([]);
      setBulkStartDate(undefined);
      
      // Refresh list
      fetchScheduledPosts();
    } catch (error) {
      console.error('Bulk scheduling error:', error);
      toast({
        title: 'Bulk Scheduling Failed',
        description: 'Failed to schedule posts',
        variant: 'destructive'
      });
    }

    setIsBulkScheduling(false);
  };

  const toggleBulkTopic = (topic: string) => {
    setBulkSelectedTopics(prev => 
      prev.includes(topic) 
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };

  const selectAllTopics = () => {
    if (selectedService && topicTemplates[selectedService]) {
      setBulkSelectedTopics(topicTemplates[selectedService]);
    }
  };

  const clearAllTopics = () => {
    setBulkSelectedTopics([]);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" /> Pending</Badge>;
      case 'generating':
        return <Badge variant="default" className="gap-1"><Loader2 className="h-3 w-3 animate-spin" /> Generating</Badge>;
      case 'completed':
        return <Badge className="gap-1 bg-primary text-primary-foreground"><CheckCircle2 className="h-3 w-3" /> Completed</Badge>;
      case 'failed':
        return <Badge variant="destructive" className="gap-1"><AlertCircle className="h-3 w-3" /> Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const timeOptions = Array.from({ length: 24 * 4 }, (_, i) => {
    const hours = Math.floor(i / 4);
    const minutes = (i % 4) * 15;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  });

  return (
    <Card className="border-primary/20">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle className="text-lg">AI Blog Automation</CardTitle>
                  <CardDescription>Generate and schedule SEO-optimized posts</CardDescription>
                </div>
              </div>
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="generate">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate
                </TabsTrigger>
                <TabsTrigger value="schedule">
                  <Clock className="h-4 w-4 mr-2" />
                  Schedule
                </TabsTrigger>
                <TabsTrigger value="bulk">
                  <Layers className="h-4 w-4 mr-2" />
                  Bulk
                </TabsTrigger>
              </TabsList>

              {/* Generate Now Tab */}
              <TabsContent value="generate" className="space-y-4 mt-4">
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
              </TabsContent>

              {/* Schedule Posts Tab */}
              <TabsContent value="schedule" className="space-y-4 mt-4">
                {/* Schedule Form */}
                <div className="grid gap-4 p-4 rounded-lg border bg-muted/30">
                  <h4 className="font-medium">Schedule New Post</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {/* Service Selection */}
                    <div className="space-y-2">
                      <Label>Service</Label>
                      <Select value={selectedService} onValueChange={setSelectedService}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select service" />
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

                    {/* Topic Selection */}
                    <div className="space-y-2">
                      <Label>Topic</Label>
                      <Select value={scheduleTopic} onValueChange={setScheduleTopic}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select or type topic" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedService && topicTemplates[selectedService]?.map((topic, idx) => (
                            <SelectItem key={idx} value={topic}>
                              {topic.length > 50 ? topic.substring(0, 50) + '...' : topic}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Custom Title (Optional)</Label>
                    <Input
                      value={scheduleTitle}
                      onChange={(e) => setScheduleTitle(e.target.value)}
                      placeholder="Leave empty to use topic as title"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Date Picker */}
                    <div className="space-y-2">
                      <Label>Schedule Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !scheduleDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {scheduleDate ? format(scheduleDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={scheduleDate}
                            onSelect={setScheduleDate}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Time Picker */}
                    <div className="space-y-2">
                      <Label>Schedule Time</Label>
                      <Select value={scheduleTime} onValueChange={setScheduleTime}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {timeOptions.map(time => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Custom Instructions (Optional)</Label>
                    <Textarea
                      value={customInstructions}
                      onChange={(e) => setCustomInstructions(e.target.value)}
                      placeholder="Add any specific instructions for the AI writer..."
                      rows={2}
                    />
                  </div>

                  {/* Settings toggles */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background">
                    <div className="flex items-center gap-2">
                      <LinkIcon className="h-4 w-4 text-primary" />
                      <Label className="font-medium">Include Internal Links</Label>
                    </div>
                    <Switch
                      checked={includeInternalLinks}
                      onCheckedChange={setIncludeInternalLinks}
                    />
                  </div>

                  <Button onClick={handleSchedulePost} disabled={!selectedService || !scheduleTopic || !scheduleDate}>
                    <Clock className="h-4 w-4 mr-2" />
                    Schedule Post
                  </Button>
                </div>

                {/* Scheduled Posts List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Scheduled Posts</h4>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={fetchScheduledPosts}>
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Refresh
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleProcessNow}>
                        <Play className="h-4 w-4 mr-1" />
                        Process Now
                      </Button>
                    </div>
                  </div>

                  {isLoadingScheduled ? (
                    <div className="flex items-center justify-center p-8">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : scheduledPosts.length === 0 ? (
                    <div className="text-center p-8 text-muted-foreground">
                      <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No scheduled posts yet</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {scheduledPosts.map(post => (
                        <div
                          key={post.id}
                          className="flex items-center justify-between p-3 rounded-lg border bg-card"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {getStatusBadge(post.status)}
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(post.scheduled_at), 'PPP p')}
                              </span>
                            </div>
                            <p className="font-medium truncate">{post.title}</p>
                            <p className="text-sm text-muted-foreground truncate">
                              {services.find(s => s.id === post.service_id)?.shortTitle || post.service_id}
                            </p>
                            {post.error_message && (
                              <p className="text-xs text-destructive mt-1">{post.error_message}</p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteScheduled(post.id)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Bulk Scheduling Tab */}
              <TabsContent value="bulk" className="space-y-4 mt-4">
                <div className="grid gap-4 p-4 rounded-lg border bg-muted/30">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium flex items-center gap-2">
                      <Layers className="h-4 w-4 text-primary" />
                      Bulk Schedule Posts
                    </h4>
                    <Badge variant="outline">
                      {bulkSelectedTopics.length} selected
                    </Badge>
                  </div>
                  
                  {/* Service Selection */}
                  <div className="space-y-2">
                    <Label>Service Category</Label>
                    <Select value={selectedService} onValueChange={(val) => {
                      setSelectedService(val);
                      setBulkSelectedTopics([]);
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a service" />
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

                  {/* Topic Selection */}
                  {selectedService && topicTemplates[selectedService] && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Select Topics</Label>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={selectAllTopics}>
                            Select All
                          </Button>
                          <Button variant="ghost" size="sm" onClick={clearAllTopics}>
                            Clear
                          </Button>
                        </div>
                      </div>
                      <div className="max-h-48 overflow-y-auto space-y-2 p-2 rounded-lg border bg-background">
                        {topicTemplates[selectedService].map((topic, idx) => (
                          <div key={idx} className="flex items-start gap-3 p-2 hover:bg-muted/50 rounded">
                            <Checkbox
                              id={`topic-${idx}`}
                              checked={bulkSelectedTopics.includes(topic)}
                              onCheckedChange={() => toggleBulkTopic(topic)}
                            />
                            <label
                              htmlFor={`topic-${idx}`}
                              className="text-sm cursor-pointer flex-1"
                            >
                              {topic}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Schedule Settings */}
                  <div className="grid grid-cols-3 gap-4">
                    {/* Start Date */}
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !bulkStartDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {bulkStartDate ? format(bulkStartDate, "PP") : "Pick date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={bulkStartDate}
                            onSelect={setBulkStartDate}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Time */}
                    <div className="space-y-2">
                      <Label>Time</Label>
                      <Select value={bulkStartTime} onValueChange={setBulkStartTime}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {timeOptions.map(time => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Interval */}
                    <div className="space-y-2">
                      <Label>Days Between</Label>
                      <Select value={bulkInterval} onValueChange={setBulkInterval}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Every day</SelectItem>
                          <SelectItem value="2">Every 2 days</SelectItem>
                          <SelectItem value="3">Every 3 days</SelectItem>
                          <SelectItem value="7">Weekly</SelectItem>
                          <SelectItem value="14">Bi-weekly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Preview */}
                  {bulkSelectedTopics.length > 0 && bulkStartDate && (
                    <div className="p-3 rounded-lg bg-background border">
                      <p className="text-sm font-medium mb-2">Schedule Preview:</p>
                      <div className="text-xs text-muted-foreground space-y-1 max-h-24 overflow-y-auto">
                        {bulkSelectedTopics.slice(0, 5).map((topic, idx) => {
                          const date = new Date(bulkStartDate);
                          date.setDate(date.getDate() + (idx * parseInt(bulkInterval)));
                          return (
                            <div key={idx} className="flex justify-between">
                              <span className="truncate flex-1">{topic.substring(0, 40)}...</span>
                              <span className="ml-2">{format(date, 'MMM d')}</span>
                            </div>
                          );
                        })}
                        {bulkSelectedTopics.length > 5 && (
                          <p className="text-muted-foreground">...and {bulkSelectedTopics.length - 5} more</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Internal Links Toggle */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background">
                    <div className="flex items-center gap-2">
                      <LinkIcon className="h-4 w-4 text-primary" />
                      <Label className="font-medium">Include Internal Links</Label>
                    </div>
                    <Switch
                      checked={includeInternalLinks}
                      onCheckedChange={setIncludeInternalLinks}
                    />
                  </div>

                  <Button 
                    onClick={handleBulkSchedule} 
                    disabled={isBulkScheduling || bulkSelectedTopics.length === 0 || !bulkStartDate}
                    className="w-full"
                  >
                    {isBulkScheduling ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Scheduling...
                      </>
                    ) : (
                      <>
                        <Layers className="h-4 w-4 mr-2" />
                        Schedule {bulkSelectedTopics.length} Posts
                      </>
                    )}
                  </Button>
                </div>

                {/* Cron Job Info */}
                <div className="p-4 rounded-lg border bg-card">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Settings className="h-4 w-4 text-primary" />
                      Auto-Processing Status
                    </h4>
                    <Badge variant="outline" className="bg-primary/10 text-primary">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Schedule</p>
                      <p className="font-medium">Every 6 hours</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Next Run</p>
                      <p className="font-medium">00:00, 06:00, 12:00, 18:00</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    Scheduled posts are automatically processed when their scheduled time arrives.
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg border bg-card text-center">
                    <p className="text-2xl font-bold text-primary">
                      {scheduledPosts.filter(p => p.status === 'pending').length}
                    </p>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                  <div className="p-3 rounded-lg border bg-card text-center">
                    <p className="text-2xl font-bold text-primary">
                      {scheduledPosts.filter(p => p.status === 'completed').length}
                    </p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                  <div className="p-3 rounded-lg border bg-card text-center">
                    <p className="text-2xl font-bold text-destructive">
                      {scheduledPosts.filter(p => p.status === 'failed').length}
                    </p>
                    <p className="text-xs text-muted-foreground">Failed</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

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
