import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { services } from '@/data/services';
import { 
  Sparkles, 
  Wand2, 
  FileText, 
  RefreshCw, 
  Loader2, 
  Zap,
  PenTool,
  Target,
  Hash,
  BookOpen,
  Link as LinkIcon,
  Copy,
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';
import AIImageGenerator from './AIImageGenerator';

interface AIControlsPanelProps {
  onPostGenerated?: (post: { title: string; content: string; excerpt: string; tags: string; category: string }) => void;
}

const AIControlsPanel = ({ onPostGenerated }: AIControlsPanelProps) => {
  const [activeTab, setActiveTab] = useState('generate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('https://psdigital.in');
  const [includeLinks, setIncludeLinks] = useState(true);
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('1500');
  
  // Quick tools state
  const [quickInput, setQuickInput] = useState('');
  const [quickOutput, setQuickOutput] = useState('');
  const [quickTool, setQuickTool] = useState('');
  const [copied, setCopied] = useState(false);
  
  const { toast } = useToast();

  // Topic templates
  const topicTemplates: Record<string, string[]> = {
    'seo': [
      'How to Improve Your Website\'s Google Ranking in 2025',
      'Local SEO Strategies That Drive Foot Traffic',
      'Technical SEO Checklist for E-commerce Websites',
      'Link Building Strategies That Actually Work',
    ],
    'social-media': [
      'Instagram Marketing Trends Every Business Should Know',
      'How to Create Viral Content on Social Media',
      'LinkedIn Marketing Strategies for B2B Companies',
    ],
    'google-ads': [
      'Google Ads Budget Optimization Tips for Small Businesses',
      'How to Write High-Converting Ad Copy',
      'Remarketing Campaigns: A Step-by-Step Guide',
    ],
    'web-development': [
      'Why Your Business Needs a Mobile-Responsive Website',
      'E-commerce Website Features That Boost Sales',
      'Website Speed Optimization: A Complete Guide',
    ],
    'content-marketing': [
      'Content Marketing ROI: How to Measure Success',
      'Creating a Content Strategy That Drives Traffic',
      'The Art of Storytelling in Content Marketing',
    ],
    'email-marketing': [
      'Email Marketing Automation for Beginners',
      'Subject Lines That Increase Open Rates',
      'Drip Campaigns That Convert Leads to Customers',
    ],
    'branding': [
      'Building a Strong Brand Identity for Your Business',
      'Brand Voice: How to Communicate Authentically',
      'Color Psychology in Brand Design',
    ],
    'video-marketing': [
      'Video Marketing Strategies for Small Businesses',
      'Creating Engaging YouTube Content',
      'Video SEO: How to Rank Your Videos',
    ]
  };

  const generateFullPost = async () => {
    if (!selectedService && !customTopic) {
      toast({
        title: 'Missing Input',
        description: 'Please select a service or enter a custom topic',
        variant: 'destructive'
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const serviceData = services.find(s => s.id === selectedService);
      const topic = customTopic || (topicTemplates[selectedService]?.[Math.floor(Math.random() * topicTemplates[selectedService].length)] || 'Digital Marketing Best Practices');

      const internalLinks = includeLinks && serviceData ? `
Include these do-follow internal links naturally within the content:
- Link to the main service page: <a href="${websiteUrl}/services/${selectedService}" rel="dofollow">${serviceData.title}</a>
- Link to contact page: <a href="${websiteUrl}/contact" rel="dofollow">contact PS Digital</a>
- Link to homepage: <a href="${websiteUrl}" rel="dofollow">PS Digital Marketing Agency</a>
Make sure links are contextually placed and provide value to readers.` : '';

      const keywords = serviceData 
        ? `${serviceData.title}, digital marketing, ${serviceData.subServices.slice(0, 3).map(s => s.name).join(', ')}, PS Digital, India`
        : 'digital marketing, business growth, online presence, PS Digital';

      const { data, error } = await supabase.functions.invoke('generate-blog', {
        body: {
          type: 'generate_full',
          topic,
          keywords,
          tone: tone === 'professional' ? 'Professional and informative' : tone === 'casual' ? 'Casual and friendly' : 'Authoritative and expert',
          length: `${length}-${parseInt(length) + 500}`,
          additionalInstructions: `
${internalLinks}

SEO Requirements:
- Use the primary keyword in the first paragraph
- Include H2 and H3 headings with keywords
- Add actionable tips and examples
- End with a strong call-to-action
`
        }
      });

      if (error) throw error;

      // Generate excerpt and tags
      const [excerptRes, tagsRes] = await Promise.all([
        supabase.functions.invoke('generate-blog', {
          body: { type: 'generate_excerpt', topic, keywords }
        }),
        supabase.functions.invoke('generate-blog', {
          body: { type: 'generate_tags', topic }
        })
      ]);

      const post = {
        title: topic,
        content: data.content,
        excerpt: excerptRes.data?.content || '',
        tags: tagsRes.data?.content || (serviceData?.shortTitle || 'Digital Marketing'),
        category: serviceData?.shortTitle || 'Digital Marketing'
      };

      if (onPostGenerated) {
        onPostGenerated(post);
      }

      toast({
        title: 'Post Generated!',
        description: `"${topic}" is ready for review`,
      });

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

  const runQuickTool = async (toolType: string) => {
    if (!quickInput.trim()) {
      toast({
        title: 'Missing Input',
        description: 'Please enter some text first',
        variant: 'destructive'
      });
      return;
    }

    setQuickTool(toolType);
    setIsGenerating(true);
    setQuickOutput('');

    try {
      const { data, error } = await supabase.functions.invoke('generate-blog', {
        body: {
          type: toolType,
          topic: quickInput
        }
      });

      if (error) throw error;
      setQuickOutput(data.content);

    } catch (error) {
      console.error('Quick tool error:', error);
      toast({
        title: 'Error',
        description: 'Failed to process. Please try again.',
        variant: 'destructive'
      });
    }

    setIsGenerating(false);
    setQuickTool('');
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(quickOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: 'Copied!', description: 'Content copied to clipboard' });
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">AI Content Studio</CardTitle>
            <CardDescription>Powerful AI tools for content creation and optimization</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="generate" className="flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              Generate Post
            </TabsTrigger>
            <TabsTrigger value="images" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              AI Images
            </TabsTrigger>
            <TabsTrigger value="tools" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Quick Tools
            </TabsTrigger>
            <TabsTrigger value="bulk" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Bulk Actions
            </TabsTrigger>
          </TabsList>

          {/* Generate Post Tab */}
          <TabsContent value="generate" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Service Category</Label>
                <Select value={selectedService} onValueChange={setSelectedService}>
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

              <div className="space-y-2">
                <Label>Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual & Friendly</SelectItem>
                    <SelectItem value="expert">Authoritative Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Custom Topic (optional)</Label>
              <Input
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="Or enter a specific topic to write about..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Website URL</Label>
                <Input
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://yourwebsite.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Word Count Target</Label>
                <Select value={length} onValueChange={setLength}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="800">800-1000 words</SelectItem>
                    <SelectItem value="1200">1200-1500 words</SelectItem>
                    <SelectItem value="1500">1500-2000 words</SelectItem>
                    <SelectItem value="2000">2000-2500 words</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
              <div className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-primary" />
                <div>
                  <span className="text-sm font-medium">Do-Follow Internal Links</span>
                  <p className="text-xs text-muted-foreground">Include SEO-boosting links to your pages</p>
                </div>
              </div>
              <Switch checked={includeLinks} onCheckedChange={setIncludeLinks} />
            </div>

            {selectedService && topicTemplates[selectedService] && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Suggested Topics</Label>
                <div className="flex flex-wrap gap-2">
                  {topicTemplates[selectedService].slice(0, 3).map((topic, idx) => (
                    <Badge 
                      key={idx} 
                      variant="outline" 
                      className="cursor-pointer hover:bg-primary/10 transition-colors text-xs"
                      onClick={() => setCustomTopic(topic)}
                    >
                      {topic.length > 35 ? topic.substring(0, 35) + '...' : topic}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Button
              onClick={generateFullPost}
              disabled={isGenerating}
              className="w-full gradient-bg"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating SEO-Optimized Post...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Blog Post
                </>
              )}
            </Button>
          </TabsContent>

          {/* AI Images Tab */}
          <TabsContent value="images" className="space-y-4">
            <div className="grid gap-4">
              <div className="p-6 rounded-lg border bg-gradient-to-br from-primary/5 to-transparent">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <ImageIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Generate AI Images</h3>
                    <p className="text-sm text-muted-foreground">Create custom images for blog posts and marketing</p>
                  </div>
                </div>
                <AIImageGenerator
                  trigger={
                    <Button className="w-full gradient-bg" size="lg">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Open AI Image Generator
                    </Button>
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border hover:border-primary/50 transition-colors">
                  <h4 className="font-medium mb-1">Blog Cover Images</h4>
                  <p className="text-sm text-muted-foreground">1200×630 format optimized for blog headers and social sharing</p>
                </div>
                <div className="p-4 rounded-lg border hover:border-primary/50 transition-colors">
                  <h4 className="font-medium mb-1">Social Media Graphics</h4>
                  <p className="text-sm text-muted-foreground">Square 1080×1080 format for Instagram, Facebook, LinkedIn</p>
                </div>
                <div className="p-4 rounded-lg border hover:border-primary/50 transition-colors">
                  <h4 className="font-medium mb-1">Story Format</h4>
                  <p className="text-sm text-muted-foreground">Vertical 1080×1920 for Instagram and Facebook stories</p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/50 border">
                <h4 className="font-medium mb-2">Tips for Better Results</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Be specific about colors, style, and mood</li>
                  <li>• Mention the subject matter clearly (e.g., "digital marketing concept")</li>
                  <li>• Use style presets that match your brand aesthetic</li>
                  <li>• Generated images are automatically saved to your storage</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          {/* Quick Tools Tab */}
          <TabsContent value="tools" className="space-y-4">
            <div className="space-y-2">
              <Label>Input Text</Label>
              <Textarea
                value={quickInput}
                onChange={(e) => setQuickInput(e.target.value)}
                placeholder="Enter a topic, title, or content to process..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => runQuickTool('generate_title')}
                disabled={isGenerating}
                className="flex flex-col h-auto py-3"
              >
                {quickTool === 'generate_title' ? (
                  <Loader2 className="h-4 w-4 animate-spin mb-1" />
                ) : (
                  <PenTool className="h-4 w-4 mb-1" />
                )}
                <span className="text-xs">Generate Titles</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => runQuickTool('generate_excerpt')}
                disabled={isGenerating}
                className="flex flex-col h-auto py-3"
              >
                {quickTool === 'generate_excerpt' ? (
                  <Loader2 className="h-4 w-4 animate-spin mb-1" />
                ) : (
                  <Target className="h-4 w-4 mb-1" />
                )}
                <span className="text-xs">Meta Description</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => runQuickTool('generate_tags')}
                disabled={isGenerating}
                className="flex flex-col h-auto py-3"
              >
                {quickTool === 'generate_tags' ? (
                  <Loader2 className="h-4 w-4 animate-spin mb-1" />
                ) : (
                  <Hash className="h-4 w-4 mb-1" />
                )}
                <span className="text-xs">Generate Tags</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => runQuickTool('generate_outline')}
                disabled={isGenerating}
                className="flex flex-col h-auto py-3"
              >
                {quickTool === 'generate_outline' ? (
                  <Loader2 className="h-4 w-4 animate-spin mb-1" />
                ) : (
                  <BookOpen className="h-4 w-4 mb-1" />
                )}
                <span className="text-xs">Create Outline</span>
              </Button>
            </div>

            {quickOutput && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Generated Output</Label>
                  <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                    {copied ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 border max-h-48 overflow-y-auto">
                  <pre className="text-sm whitespace-pre-wrap font-sans">{quickOutput}</pre>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Bulk Actions Tab */}
          <TabsContent value="bulk" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer border-dashed" onClick={() => setActiveTab('generate')}>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <FileText className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-medium">Generate Single Post</h4>
                    <p className="text-xs text-muted-foreground">Create one SEO-optimized blog post</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4 hover:shadow-md transition-shadow border-dashed opacity-70">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <RefreshCw className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-medium">Weekly Content Pack</h4>
                    <p className="text-xs text-muted-foreground">Generate 7 posts for the week</p>
                    <Badge variant="secondary" className="mt-1 text-xs">Coming Soon</Badge>
                  </div>
                </div>
              </Card>
            </div>

            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                AI Content Features
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• SEO-optimized content with proper heading structure</li>
                <li>• Automatic do-follow internal linking to your service pages</li>
                <li>• Meta descriptions and tags generation</li>
                <li>• Keyword-rich content targeting your services</li>
                <li>• Call-to-action sections linking to contact page</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AIControlsPanel;
