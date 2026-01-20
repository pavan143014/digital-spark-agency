import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Twitter,
  Linkedin,
  Instagram,
  Sparkles,
  Copy,
  Check,
  Loader2,
  RefreshCw,
  Share2,
  Hash,
  AtSign,
  Image as ImageIcon,
  MessageSquare,
  FileText,
  Zap,
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: string;
}

interface GeneratedPost {
  platform: 'twitter' | 'linkedin' | 'instagram';
  content: string;
  hashtags: string[];
  characterCount: number;
  maxCharacters: number;
}

const PLATFORM_LIMITS = {
  twitter: 280,
  linkedin: 3000,
  instagram: 2200,
};

const PLATFORM_CONFIG = {
  twitter: {
    icon: Twitter,
    name: 'Twitter/X',
    color: 'hsl(var(--ps-blue))',
    bgColor: 'hsl(var(--ps-blue)/0.1)',
    tips: ['Keep it punchy and engaging', 'Use 1-3 hashtags max', 'Include a call-to-action'],
  },
  linkedin: {
    icon: Linkedin,
    name: 'LinkedIn',
    color: 'hsl(var(--ps-blue))',
    bgColor: 'hsl(var(--ps-blue)/0.1)',
    tips: ['Professional tone', 'Include industry insights', 'End with a question to drive engagement'],
  },
  instagram: {
    icon: Instagram,
    name: 'Instagram',
    color: 'hsl(var(--ps-pink))',
    bgColor: 'hsl(var(--ps-pink)/0.1)',
    tips: ['Visual storytelling focus', 'Use 5-10 relevant hashtags', 'Include emojis for engagement'],
  },
};

const SocialMediaGenerator = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<string>('');
  const [customContent, setCustomContent] = useState('');
  const [generating, setGenerating] = useState<Record<string, boolean>>({});
  const [generatedPosts, setGeneratedPosts] = useState<Record<string, GeneratedPost>>({});
  const [copied, setCopied] = useState<Record<string, boolean>>({});
  const [sourceType, setSourceType] = useState<'blog' | 'custom'>('blog');
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data } = await supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, content, category')
      .eq('published', true)
      .order('published_at', { ascending: false })
      .limit(20);

    setPosts(data || []);
    if (data && data.length > 0) {
      setSelectedPostId(data[0].id);
    }
  };

  const getSourceContent = () => {
    if (sourceType === 'custom') {
      return { title: 'Custom Content', content: customContent, excerpt: customContent.slice(0, 150) };
    }
    const post = posts.find(p => p.id === selectedPostId);
    return post || { title: '', content: '', excerpt: '' };
  };

  const generateForPlatform = async (platform: 'twitter' | 'linkedin' | 'instagram') => {
    const source = getSourceContent();
    if (!source.content && !source.title) {
      toast({
        title: 'No content selected',
        description: 'Please select a blog post or enter custom content',
        variant: 'destructive',
      });
      return;
    }

    setGenerating(prev => ({ ...prev, [platform]: true }));

    try {
      const { data, error } = await supabase.functions.invoke('generate-blog', {
        body: {
          type: 'generate_social',
          platform,
          topic: source.title,
          content: source.content?.slice(0, 3000),
          excerpt: source.excerpt,
        },
      });

      if (error) throw error;

      const content = data.content || '';
      
      // Extract hashtags from content
      const hashtagMatches = content.match(/#\w+/g) || [];
      
      setGeneratedPosts(prev => ({
        ...prev,
        [platform]: {
          platform,
          content,
          hashtags: hashtagMatches,
          characterCount: content.length,
          maxCharacters: PLATFORM_LIMITS[platform],
        },
      }));

      toast({
        title: 'Generated!',
        description: `${PLATFORM_CONFIG[platform].name} post created successfully`,
      });
    } catch (error: any) {
      console.error('Generation error:', error);
      toast({
        title: 'Generation failed',
        description: error.message || 'Failed to generate social post',
        variant: 'destructive',
      });
    }

    setGenerating(prev => ({ ...prev, [platform]: false }));
  };

  const generateAll = async () => {
    await Promise.all([
      generateForPlatform('twitter'),
      generateForPlatform('linkedin'),
      generateForPlatform('instagram'),
    ]);
  };

  const copyToClipboard = async (platform: string, content: string) => {
    await navigator.clipboard.writeText(content);
    setCopied(prev => ({ ...prev, [platform]: true }));
    setTimeout(() => {
      setCopied(prev => ({ ...prev, [platform]: false }));
    }, 2000);
    toast({
      title: 'Copied!',
      description: 'Content copied to clipboard',
    });
  };

  const regenerate = (platform: 'twitter' | 'linkedin' | 'instagram') => {
    generateForPlatform(platform);
  };

  const selectedPost = posts.find(p => p.id === selectedPostId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg gradient-bg">
            <Share2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Social Media Generator</h2>
            <p className="text-sm text-muted-foreground">Create platform-optimized posts from your content</p>
          </div>
        </div>
        <Button onClick={generateAll} disabled={Object.values(generating).some(Boolean)}>
          {Object.values(generating).some(Boolean) ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Zap className="h-4 w-4 mr-2" />
          )}
          Generate All
        </Button>
      </div>

      {/* Source Selection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Content Source
          </CardTitle>
          <CardDescription>Select a blog post or enter custom content</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={sourceType} onValueChange={(v) => setSourceType(v as 'blog' | 'custom')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="blog">From Blog Post</TabsTrigger>
              <TabsTrigger value="custom">Custom Content</TabsTrigger>
            </TabsList>

            <TabsContent value="blog" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Select Blog Post</Label>
                <Select value={selectedPostId} onValueChange={setSelectedPostId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a blog post..." />
                  </SelectTrigger>
                  <SelectContent>
                    {posts.map(post => (
                      <SelectItem key={post.id} value={post.id}>
                        <div className="flex items-center gap-2">
                          <span className="truncate max-w-[300px]">{post.title}</span>
                          <Badge variant="secondary" className="text-[10px]">{post.category}</Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedPost && (
                <div className="p-3 rounded-lg bg-muted/50 text-sm">
                  <p className="font-medium mb-1">{selectedPost.title}</p>
                  <p className="text-muted-foreground line-clamp-2">{selectedPost.excerpt || 'No excerpt available'}</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="custom" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Custom Content</Label>
                <Textarea
                  placeholder="Enter your content here... This could be a product description, announcement, or any message you want to share."
                  value={customContent}
                  onChange={(e) => setCustomContent(e.target.value)}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">{customContent.length} characters</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Generated Posts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {(['twitter', 'linkedin', 'instagram'] as const).map(platform => {
          const config = PLATFORM_CONFIG[platform];
          const Icon = config.icon;
          const generated = generatedPosts[platform];
          const isGenerating = generating[platform];

          return (
            <Card key={platform} className="flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: config.bgColor }}
                    >
                      <Icon className="h-4 w-4" style={{ color: config.color }} />
                    </div>
                    <CardTitle className="text-base">{config.name}</CardTitle>
                  </div>
                  {generated && (
                    <Badge 
                      variant={generated.characterCount <= generated.maxCharacters ? 'secondary' : 'destructive'}
                      className="text-[10px]"
                    >
                      {generated.characterCount}/{generated.maxCharacters}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {/* Tips */}
                <div className="mb-3 space-y-1">
                  {config.tips.map((tip, i) => (
                    <p key={i} className="text-xs text-muted-foreground flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-primary" />
                      {tip}
                    </p>
                  ))}
                </div>

                {/* Generated Content */}
                {generated ? (
                  <div className="flex-1 flex flex-col">
                    <div className="flex-1 p-3 rounded-lg bg-muted/50 text-sm mb-3 max-h-[200px] overflow-auto">
                      <p className="whitespace-pre-wrap">{generated.content}</p>
                    </div>
                    
                    {/* Hashtags Preview */}
                    {generated.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {generated.hashtags.slice(0, 5).map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-[10px]">
                            {tag}
                          </Badge>
                        ))}
                        {generated.hashtags.length > 5 && (
                          <Badge variant="outline" className="text-[10px]">
                            +{generated.hashtags.length - 5} more
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => copyToClipboard(platform, generated.content)}
                      >
                        {copied[platform] ? (
                          <Check className="h-3 w-3 mr-1" />
                        ) : (
                          <Copy className="h-3 w-3 mr-1" />
                        )}
                        {copied[platform] ? 'Copied!' : 'Copy'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => regenerate(platform)}
                        disabled={isGenerating}
                      >
                        <RefreshCw className={`h-3 w-3 ${isGenerating ? 'animate-spin' : ''}`} />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center py-8">
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Generating...</p>
                      </>
                    ) : (
                      <>
                        <MessageSquare className="h-8 w-8 text-muted-foreground/50 mb-2" />
                        <p className="text-sm text-muted-foreground mb-3">No content generated yet</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => generateForPlatform(platform)}
                        >
                          <Sparkles className="h-3 w-3 mr-1" />
                          Generate
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Best Practices */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Platform Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-medium">
                <Twitter className="h-4 w-4 text-[hsl(var(--ps-blue))]" />
                Twitter/X
              </div>
              <ul className="space-y-1 text-muted-foreground">
                <li className="flex items-center gap-1"><Hash className="h-3 w-3" /> 1-3 hashtags optimal</li>
                <li className="flex items-center gap-1"><AtSign className="h-3 w-3" /> Tag relevant accounts</li>
                <li className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> Ask questions for replies</li>
              </ul>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-medium">
                <Linkedin className="h-4 w-4 text-[hsl(var(--ps-blue))]" />
                LinkedIn
              </div>
              <ul className="space-y-1 text-muted-foreground">
                <li className="flex items-center gap-1"><Hash className="h-3 w-3" /> 3-5 hashtags work best</li>
                <li className="flex items-center gap-1"><FileText className="h-3 w-3" /> Long-form encouraged</li>
                <li className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> Professional insights</li>
              </ul>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-medium">
                <Instagram className="h-4 w-4 text-[hsl(var(--ps-pink))]" />
                Instagram
              </div>
              <ul className="space-y-1 text-muted-foreground">
                <li className="flex items-center gap-1"><Hash className="h-3 w-3" /> 5-10 hashtags ideal</li>
                <li className="flex items-center gap-1"><ImageIcon className="h-3 w-3" /> Visual-first content</li>
                <li className="flex items-center gap-1"><AtSign className="h-3 w-3" /> Use relevant emojis</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialMediaGenerator;
