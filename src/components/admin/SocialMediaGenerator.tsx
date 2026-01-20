import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Twitter,
  Linkedin,
  Instagram,
  Facebook,
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
  Settings,
  Send,
  Link as LinkIcon,
  ExternalLink,
  X,
  Megaphone,
  Lightbulb,
  Gift,
  Calendar,
  TrendingUp,
  Users,
  Star,
  HelpCircle,
  Bookmark,
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

interface BufferProfile {
  id: string;
  service: string;
  formatted_username: string;
  avatar?: string;
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

const SERVICE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  twitter: Twitter,
  linkedin: Linkedin,
  instagram: Instagram,
  facebook: Facebook,
};

interface ContentTemplate {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  color: string;
  prompts: {
    twitter: string;
    linkedin: string;
    instagram: string;
  };
  imagePrompt: string;
  variables: string[];
}

const CONTENT_TEMPLATES: ContentTemplate[] = [
  {
    id: 'announcement',
    name: 'Announcement',
    icon: Megaphone,
    description: 'Share exciting news or updates',
    color: 'hsl(var(--ps-blue))',
    prompts: {
      twitter: '🎉 Big news! [ANNOUNCEMENT]. This is a game-changer for [AUDIENCE]. Learn more: [LINK] #DigitalMarketing #News',
      linkedin: "🚀 Exciting Announcement!\n\nWe're thrilled to share that [ANNOUNCEMENT].\n\nThis means [BENEFIT] for our clients and partners.\n\nWhat excites you most about this development? Share your thoughts below! 👇\n\n#BusinessNews #Growth #Innovation",
      instagram: "🎉 BIG NEWS! 🎉\n\n[ANNOUNCEMENT]\n\nThis is huge for everyone who [AUDIENCE BENEFIT]! 🙌\n\nDouble tap if you're as excited as we are! ❤️\n\n#Announcement #ExcitingNews #BusinessGrowth #DigitalMarketing #Innovation",
    },
    imagePrompt: 'Celebratory announcement graphic with confetti, bold typography, and modern gradient background',
    variables: ['ANNOUNCEMENT', 'AUDIENCE', 'BENEFIT', 'LINK'],
  },
  {
    id: 'tip',
    name: 'Quick Tip',
    icon: Lightbulb,
    description: 'Share actionable advice',
    color: 'hsl(var(--ps-orange))',
    prompts: {
      twitter: '💡 Pro Tip: [TIP]\n\nThis simple change can [BENEFIT].\n\nSave this for later! 🔖 #MarketingTips #DigitalMarketing',
      linkedin: "💡 Quick Marketing Tip\n\n[TIP]\n\nWhy it works:\n→ [REASON 1]\n→ [REASON 2]\n→ [REASON 3]\n\nI've seen this strategy [RESULT] for many businesses.\n\nWhat's your go-to marketing tip? Share below! 👇\n\n#MarketingTips #BusinessGrowth #Strategy",
      instagram: "💡 QUICK TIP 💡\n\n[TIP]\n\nThis works because [REASON]! ✨\n\nSave this post for later! 🔖\n\nTag someone who needs to see this! 👇\n\n#MarketingTips #BusinessTips #DigitalMarketing #SocialMediaTips #GrowthHacks",
    },
    imagePrompt: 'Lightbulb idea concept with clean modern design, tips and tricks visual, professional look',
    variables: ['TIP', 'BENEFIT', 'REASON', 'RESULT'],
  },
  {
    id: 'promotion',
    name: 'Promotion',
    icon: Gift,
    description: 'Promote offers or discounts',
    color: 'hsl(var(--ps-pink))',
    prompts: {
      twitter: '🎁 Special Offer! [OFFER]\n\n⏰ Limited time only!\n\nGrab yours now: [LINK]\n\n#Sale #SpecialOffer #LimitedTime',
      linkedin: "🎁 Exclusive Offer Alert!\n\n[OFFER]\n\nWhat's included:\n✅ [FEATURE 1]\n✅ [FEATURE 2]\n✅ [FEATURE 3]\n\n⏰ Offer ends [DATE]\n\nDon't miss out! Link in comments.\n\n#SpecialOffer #BusinessDeals #Growth",
      instagram: "🎁 SPECIAL OFFER 🎁\n\n[OFFER]\n\nYou get:\n✨ [FEATURE 1]\n✨ [FEATURE 2]\n✨ [FEATURE 3]\n\n⏰ Hurry! Offer ends soon!\n\nLink in bio 👆\n\n#Sale #SpecialOffer #LimitedTimeOffer #Discount #BusinessGrowth",
    },
    imagePrompt: 'Promotional sale graphic with gift boxes, discount badge, vibrant colors, urgency elements',
    variables: ['OFFER', 'FEATURE', 'DATE', 'LINK'],
  },
  {
    id: 'event',
    name: 'Event',
    icon: Calendar,
    description: 'Promote upcoming events',
    color: 'hsl(var(--ps-purple))',
    prompts: {
      twitter: '📅 Save the date! [EVENT NAME]\n\n🗓 [DATE]\n⏰ [TIME]\n📍 [LOCATION]\n\nRegister now: [LINK]\n\n#Event #SaveTheDate',
      linkedin: "📅 You're Invited!\n\n[EVENT NAME]\n\n🗓 Date: [DATE]\n⏰ Time: [TIME]\n📍 Location: [LOCATION]\n\nWhat you'll learn:\n→ [TOPIC 1]\n→ [TOPIC 2]\n→ [TOPIC 3]\n\nSeats are limited! Register via the link in comments.\n\n#Event #Networking #Learning",
      instagram: "📅 SAVE THE DATE 📅\n\n[EVENT NAME]\n\n🗓 [DATE]\n⏰ [TIME]\n📍 [LOCATION]\n\nYou'll learn:\n✨ [TOPIC 1]\n✨ [TOPIC 2]\n✨ [TOPIC 3]\n\nTag someone who should join! 👇\n\nLink in bio to register! 🔗\n\n#Event #Workshop #Networking #Business",
    },
    imagePrompt: 'Event announcement graphic with calendar, modern design, date highlight, professional webinar look',
    variables: ['EVENT NAME', 'DATE', 'TIME', 'LOCATION', 'TOPIC'],
  },
  {
    id: 'stats',
    name: 'Stats & Results',
    icon: TrendingUp,
    description: 'Share impressive numbers',
    color: 'hsl(var(--ps-green))',
    prompts: {
      twitter: '📊 The numbers don\'t lie:\n\n[STAT 1]\n[STAT 2]\n[STAT 3]\n\nThis is what [STRATEGY] can do for your business.\n\n#Results #Growth #Success',
      linkedin: "📊 Results That Speak For Themselves\n\nRecent client results:\n\n📈 [STAT 1]\n📈 [STAT 2]\n📈 [STAT 3]\n\nHow we achieved this:\n→ [METHOD 1]\n→ [METHOD 2]\n→ [METHOD 3]\n\nWant similar results? Let's connect!\n\n#Results #CaseStudy #BusinessGrowth #Marketing",
      instagram: "📊 RESULTS TIME 📊\n\n[STAT 1] ✅\n[STAT 2] ✅\n[STAT 3] ✅\n\nThis is what's possible with the right strategy! 🚀\n\nReady to see these results for your business?\n\nDM us to get started! 💬\n\n#Results #Growth #Success #DigitalMarketing #BusinessResults",
    },
    imagePrompt: 'Data visualization graphic with upward trending charts, success metrics, professional analytics look',
    variables: ['STAT', 'STRATEGY', 'METHOD'],
  },
  {
    id: 'testimonial',
    name: 'Testimonial',
    icon: Star,
    description: 'Share client success stories',
    color: 'hsl(var(--ps-cyan))',
    prompts: {
      twitter: '⭐ "[QUOTE]"\n\n- [CLIENT NAME], [COMPANY]\n\nWe love helping businesses succeed! 💙\n\n#ClientLove #Testimonial #Success',
      linkedin: "⭐ Client Spotlight ⭐\n\n\"[QUOTE]\"\n\n— [CLIENT NAME], [ROLE] at [COMPANY]\n\nIt's stories like these that remind us why we do what we do.\n\nThank you, [CLIENT NAME], for trusting us with your digital marketing journey!\n\n#ClientSuccess #Testimonial #Partnership #Growth",
      instagram: "⭐ CLIENT LOVE ⭐\n\n\"[QUOTE]\"\n\n— [CLIENT NAME] from [COMPANY]\n\nNothing makes us happier than seeing our clients succeed! 💙\n\nWant to be our next success story? DM us! 💬\n\n#ClientLove #Testimonial #Success #HappyClients #DigitalMarketing",
    },
    imagePrompt: 'Testimonial graphic with quote marks, stars, professional client review design, trust elements',
    variables: ['QUOTE', 'CLIENT NAME', 'COMPANY', 'ROLE'],
  },
  {
    id: 'question',
    name: 'Engagement Question',
    icon: HelpCircle,
    description: 'Boost engagement with questions',
    color: 'hsl(var(--ps-yellow))',
    prompts: {
      twitter: '🤔 Quick question for you:\n\n[QUESTION]\n\nDrop your answer below! 👇\n\n#Question #DigitalMarketing #Community',
      linkedin: "🤔 I'm curious...\n\n[QUESTION]\n\nI've been thinking about this a lot lately, and I'd love to hear your perspective.\n\nShare your thoughts in the comments! 👇\n\n#Discussion #BusinessInsights #Community",
      instagram: "🤔 QUESTION TIME 🤔\n\n[QUESTION]\n\nWe want to hear from YOU! 👇\n\nDrop your answer in the comments! 💬\n\n#Question #Community #DigitalMarketing #Engagement #LetsTalk",
    },
    imagePrompt: 'Question mark graphic with engaging colors, conversation bubbles, community engagement visual',
    variables: ['QUESTION'],
  },
  {
    id: 'behindscenes',
    name: 'Behind the Scenes',
    icon: Users,
    description: 'Show your team and culture',
    color: 'hsl(var(--ps-purple))',
    prompts: {
      twitter: '👀 Behind the scenes at PS Digital!\n\n[DESCRIPTION]\n\nThis is how we [ACTION]! 💪\n\n#BehindTheScenes #TeamLife #AgencyLife',
      linkedin: "👀 Behind the Scenes\n\n[DESCRIPTION]\n\nAt PS Digital, we believe [VALUE].\n\nOur team is our greatest asset, and moments like these remind us why we love what we do.\n\n#TeamCulture #BehindTheScenes #AgencyLife #WorkCulture",
      instagram: "👀 BTS TIME! 👀\n\n[DESCRIPTION]\n\nThis is what goes on behind the magic! ✨\n\nWant to see more behind-the-scenes content? Let us know! 👇\n\n#BehindTheScenes #TeamLife #AgencyLife #WorkCulture #PSDigital",
    },
    imagePrompt: 'Behind the scenes office photo style, team collaboration, candid work moments, authentic feel',
    variables: ['DESCRIPTION', 'ACTION', 'VALUE'],
  },
];

const SocialMediaGenerator = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<string>('');
  const [customContent, setCustomContent] = useState('');
  const [generating, setGenerating] = useState<Record<string, boolean>>({});
  const [generatedPosts, setGeneratedPosts] = useState<Record<string, GeneratedPost>>({});
  const [copied, setCopied] = useState<Record<string, boolean>>({});
  const [sourceType, setSourceType] = useState<'blog' | 'custom' | 'template'>('blog');
  
  // Template state
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [templateVariables, setTemplateVariables] = useState<Record<string, string>>({});
  
  // Buffer integration state
  const [bufferToken, setBufferToken] = useState<string>(() => 
    localStorage.getItem('buffer_access_token') || ''
  );
  const [bufferProfiles, setBufferProfiles] = useState<BufferProfile[]>([]);
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  // AI Image state
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [includeImage, setIncludeImage] = useState(true);
  const [imagePrompt, setImagePrompt] = useState('');
  
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
    if (bufferToken) {
      fetchBufferProfiles();
    }
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

  const fetchBufferProfiles = async () => {
    if (!bufferToken) return;
    
    setIsLoadingProfiles(true);
    try {
      const { data, error } = await supabase.functions.invoke('publish-social', {
        body: { action: 'get_profiles', bufferToken },
      });

      if (error) throw error;
      
      setBufferProfiles(data.profiles || []);
      // Auto-select all profiles
      setSelectedProfiles((data.profiles || []).map((p: BufferProfile) => p.id));
    } catch (error: any) {
      console.error('Failed to fetch Buffer profiles:', error);
      if (error.message?.includes('Invalid')) {
        toast({
          title: 'Invalid Buffer Token',
          description: 'Please check your Buffer access token in settings',
          variant: 'destructive',
        });
      }
    }
    setIsLoadingProfiles(false);
  };

  const saveBufferToken = () => {
    localStorage.setItem('buffer_access_token', bufferToken);
    setSettingsOpen(false);
    fetchBufferProfiles();
    toast({
      title: 'Token Saved',
      description: 'Buffer access token has been saved',
    });
  };

  const getSourceContent = () => {
    if (sourceType === 'template' && selectedTemplate) {
      const template = CONTENT_TEMPLATES.find(t => t.id === selectedTemplate);
      if (template) {
        // Replace variables in template prompts
        let content = template.prompts.linkedin;
        template.variables.forEach(v => {
          const value = templateVariables[v] || `[${v}]`;
          content = content.replace(new RegExp(`\\[${v}\\]`, 'g'), value);
        });
        return { title: template.name, content, excerpt: template.description };
      }
    }
    if (sourceType === 'custom') {
      return { title: 'Custom Content', content: customContent, excerpt: customContent.slice(0, 150) };
    }
    const post = posts.find(p => p.id === selectedPostId);
    return post || { title: '', content: '', excerpt: '' };
  };

  const generateForPlatform = async (platform: 'twitter' | 'linkedin' | 'instagram') => {
    // If using template, directly apply the template content
    if (sourceType === 'template' && selectedTemplate) {
      const template = CONTENT_TEMPLATES.find(t => t.id === selectedTemplate);
      if (template) {
        let content = template.prompts[platform];
        template.variables.forEach(v => {
          const value = templateVariables[v] || `[${v}]`;
          content = content.replace(new RegExp(`\\[${v}\\]`, 'g'), value);
        });
        
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

        // Set image prompt from template
        if (!imagePrompt) {
          setImagePrompt(template.imagePrompt);
        }

        toast({
          title: 'Template Applied!',
          description: `${PLATFORM_CONFIG[platform].name} post created from template`,
        });
        return;
      }
    }

    const source = getSourceContent();
    if (!source.content && !source.title) {
      toast({
        title: 'No content selected',
        description: 'Please select a blog post, template, or enter custom content',
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

      // Auto-generate image prompt if not set
      if (!imagePrompt) {
        setImagePrompt(`${source.title} - digital marketing visual`);
      }

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
    const source = getSourceContent();
    if (!imagePrompt && source.title) {
      setImagePrompt(`${source.title} - engaging social media visual`);
    }

    await Promise.all([
      generateForPlatform('twitter'),
      generateForPlatform('linkedin'),
      generateForPlatform('instagram'),
    ]);
  };

  const generateImage = async () => {
    // Use local variable to avoid state timing issues
    let promptToUse = imagePrompt.trim();
    
    if (!promptToUse) {
      const source = getSourceContent();
      if (source.title) {
        promptToUse = `${source.title} - engaging social media visual for digital marketing`;
        setImagePrompt(promptToUse);
      } else {
        toast({
          title: 'Missing prompt',
          description: 'Please enter an image prompt or select content first',
          variant: 'destructive',
        });
        return;
      }
    }

    setIsGeneratingImage(true);
    try {
      const { data, error } = await supabase.functions.invoke('publish-social', {
        body: { 
          action: 'generate_image', 
          prompt: promptToUse, // Use local value, not state
          style: 'social',
        },
      });

      if (error) throw error;

      setGeneratedImage(data.url || data.preview);
      toast({
        title: 'Image Generated!',
        description: 'AI image is ready for your social posts',
      });
    } catch (error: any) {
      console.error('Image generation error:', error);
      toast({
        title: 'Generation failed',
        description: error.message || 'Failed to generate image',
        variant: 'destructive',
      });
    }
    setIsGeneratingImage(false);
  };

  const generateAllWithImage = async () => {
    // Generate all posts and image in parallel
    await Promise.all([
      generateAll(),
      generateImage(),
    ]);
  };

  const publishToBuffer = async () => {
    if (!bufferToken) {
      setSettingsOpen(true);
      return;
    }

    if (selectedProfiles.length === 0) {
      toast({
        title: 'No profiles selected',
        description: 'Please select at least one social profile',
        variant: 'destructive',
      });
      return;
    }

    // Get the most suitable post content (prefer LinkedIn for longer content)
    const postContent = generatedPosts.linkedin?.content || 
                       generatedPosts.twitter?.content || 
                       generatedPosts.instagram?.content;

    if (!postContent) {
      toast({
        title: 'No content to publish',
        description: 'Please generate social posts first',
        variant: 'destructive',
      });
      return;
    }

    setIsPublishing(true);
    try {
      const { data, error } = await supabase.functions.invoke('publish-social', {
        body: {
          action: 'publish',
          bufferToken,
          profileIds: selectedProfiles,
          text: postContent,
          imageUrl: includeImage && generatedImage ? generatedImage : undefined,
        },
      });

      if (error) throw error;

      toast({
        title: 'Published!',
        description: data.summary || `Successfully published to ${selectedProfiles.length} profiles`,
      });
    } catch (error: any) {
      console.error('Publish error:', error);
      toast({
        title: 'Publish failed',
        description: error.message || 'Failed to publish to Buffer',
        variant: 'destructive',
      });
    }
    setIsPublishing(false);
  };

  const copyToClipboard = async (platform: string, content: string) => {
    await navigator.clipboard.writeText(content);
    setCopied(prev => ({ ...prev, [platform]: true }));
    setTimeout(() => setCopied(prev => ({ ...prev, [platform]: false })), 2000);
    toast({ title: 'Copied!', description: 'Content copied to clipboard' });
  };

  const selectedPost = posts.find(p => p.id === selectedPostId);
  const hasGeneratedContent = Object.keys(generatedPosts).length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg gradient-bg">
            <Share2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Social Media Publisher</h2>
            <p className="text-sm text-muted-foreground">Generate & publish to all platforms in one click</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Buffer Settings
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Buffer Integration</DialogTitle>
                <DialogDescription>
                  Connect your Buffer account to publish directly to social media
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Buffer Access Token</Label>
                  <Input
                    type="password"
                    value={bufferToken}
                    onChange={(e) => setBufferToken(e.target.value)}
                    placeholder="Enter your Buffer access token..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Get your token from{' '}
                    <a 
                      href="https://buffer.com/developers/api" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      Buffer Developers <ExternalLink className="h-3 w-3" />
                    </a>
                  </p>
                </div>
                <Button onClick={saveBufferToken} className="w-full">
                  Save & Connect
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Connected Profiles */}
      {bufferProfiles.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              Connected Accounts
            </CardTitle>
            <CardDescription>Select profiles to publish to</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {bufferProfiles.map((profile) => {
                const Icon = SERVICE_ICONS[profile.service] || Share2;
                const isSelected = selectedProfiles.includes(profile.id);
                return (
                  <div
                    key={profile.id}
                    onClick={() => {
                      setSelectedProfiles(prev =>
                        isSelected
                          ? prev.filter(id => id !== profile.id)
                          : [...prev, profile.id]
                      );
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Checkbox checked={isSelected} className="pointer-events-none" />
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{profile.formatted_username}</span>
                    <Badge variant="secondary" className="text-[10px] capitalize">{profile.service}</Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Source Selection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Content Source
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={sourceType} onValueChange={(v) => setSourceType(v as 'blog' | 'custom' | 'template')}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="template" className="flex items-center gap-1">
                <Bookmark className="h-3 w-3" />
                Templates
              </TabsTrigger>
              <TabsTrigger value="blog">From Blog</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
            </TabsList>

            <TabsContent value="template" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {CONTENT_TEMPLATES.map((template) => {
                  const Icon = template.icon;
                  const isSelected = selectedTemplate === template.id;
                  return (
                    <div
                      key={template.id}
                      onClick={() => {
                        setSelectedTemplate(template.id);
                        setTemplateVariables({});
                        setImagePrompt(template.imagePrompt);
                      }}
                      className={`p-3 rounded-lg border cursor-pointer transition-all text-center ${
                        isSelected
                          ? 'border-primary bg-primary/5 ring-1 ring-primary'
                          : 'border-border hover:border-primary/50 hover:bg-muted/50'
                      }`}
                    >
                      <div
                        className="mx-auto w-8 h-8 rounded-full flex items-center justify-center mb-2 bg-primary/10"
                      >
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <p className="text-sm font-medium">{template.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{template.description}</p>
                    </div>
                  );
                })}
              </div>

              {/* Template Variables */}
              {selectedTemplate && (
                <div className="space-y-3 p-4 rounded-lg bg-muted/50 border">
                  <Label className="text-sm font-medium">Fill in the details:</Label>
                  {CONTENT_TEMPLATES.find(t => t.id === selectedTemplate)?.variables.map((variable) => (
                    <div key={variable} className="space-y-1">
                      <Label className="text-xs text-muted-foreground">{variable}</Label>
                      <Input
                        placeholder={`Enter ${variable.toLowerCase()}...`}
                        value={templateVariables[variable] || ''}
                        onChange={(e) =>
                          setTemplateVariables(prev => ({ ...prev, [variable]: e.target.value }))
                        }
                      />
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="blog" className="space-y-4 mt-4">
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
              {selectedPost && (
                <div className="p-3 rounded-lg bg-muted/50 text-sm">
                  <p className="font-medium mb-1">{selectedPost.title}</p>
                  <p className="text-muted-foreground line-clamp-2">{selectedPost.excerpt || 'No excerpt'}</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="custom" className="space-y-4 mt-4">
              <Textarea
                placeholder="Enter your content here..."
                value={customContent}
                onChange={(e) => setCustomContent(e.target.value)}
                rows={4}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* AI Image Generation */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              <CardTitle className="text-base">AI Image</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="include-image" className="text-sm">Include in posts</Label>
              <Switch
                id="include-image"
                checked={includeImage}
                onCheckedChange={setIncludeImage}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
              placeholder="Describe the image you want to generate..."
              className="flex-1"
            />
            <Button 
              onClick={generateImage} 
              disabled={isGeneratingImage}
              variant="outline"
            >
              {isGeneratingImage ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
            </Button>
          </div>
          {generatedImage && (
            <div className="relative rounded-lg overflow-hidden border">
              <img 
                src={generatedImage} 
                alt="Generated" 
                className="w-full h-40 object-cover"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => setGeneratedImage(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* One-Click Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          onClick={generateAllWithImage}
          disabled={Object.values(generating).some(Boolean) || isGeneratingImage}
          className="h-auto py-4 gradient-bg"
          size="lg"
        >
          {Object.values(generating).some(Boolean) || isGeneratingImage ? (
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          ) : (
            <Sparkles className="h-5 w-5 mr-2" />
          )}
          <div className="text-left">
            <div className="font-semibold">Generate All</div>
            <div className="text-xs opacity-80">Posts + AI Image for all platforms</div>
          </div>
        </Button>

        <Button
          onClick={publishToBuffer}
          disabled={isPublishing || !hasGeneratedContent || (bufferToken && selectedProfiles.length === 0)}
          variant={bufferToken ? "default" : "outline"}
          className="h-auto py-4"
          size="lg"
        >
          {isPublishing ? (
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          ) : (
            <Send className="h-5 w-5 mr-2" />
          )}
          <div className="text-left">
            <div className="font-semibold">
              {bufferToken ? `Publish to ${selectedProfiles.length} Accounts` : 'Connect Buffer'}
            </div>
            <div className="text-xs opacity-80">
              {bufferToken ? 'Share to all selected profiles' : 'Setup one-click publishing'}
            </div>
          </div>
        </Button>
      </div>

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
                    <div className="p-2 rounded-lg" style={{ backgroundColor: config.bgColor }}>
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
                {generated ? (
                  <div className="flex-1 flex flex-col">
                    <div className="flex-1 p-3 rounded-lg bg-muted/50 text-sm mb-3 max-h-[200px] overflow-auto">
                      <p className="whitespace-pre-wrap">{generated.content}</p>
                    </div>
                    
                    {generated.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {generated.hashtags.slice(0, 5).map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-[10px]">{tag}</Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => copyToClipboard(platform, generated.content)}
                      >
                        {copied[platform] ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                        {copied[platform] ? 'Copied!' : 'Copy'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => generateForPlatform(platform)}
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
                        <p className="text-sm text-muted-foreground mb-3">No content yet</p>
                        <Button variant="outline" size="sm" onClick={() => generateForPlatform(platform)}>
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
    </div>
  );
};

export default SocialMediaGenerator;
