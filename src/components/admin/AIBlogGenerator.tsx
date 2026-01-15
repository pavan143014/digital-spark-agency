import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Wand2, FileText, Tags, ListTree, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AIBlogGeneratorProps {
  onTitleGenerated?: (title: string) => void;
  onContentGenerated?: (content: string) => void;
  onExcerptGenerated?: (excerpt: string) => void;
  onTagsGenerated?: (tags: string) => void;
  currentContent?: string;
}

const AIBlogGenerator = ({
  onTitleGenerated,
  onContentGenerated,
  onExcerptGenerated,
  onTagsGenerated,
  currentContent,
}: AIBlogGeneratorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('1000-1500');
  const [generatedContent, setGeneratedContent] = useState('');
  const [activeTab, setActiveTab] = useState('full');
  const { toast } = useToast();

  const generate = async (type: string) => {
    if (!topic.trim() && type !== 'improve_content') {
      toast({
        title: 'Topic required',
        description: 'Please enter a topic for your blog post',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setGeneratedContent('');

    try {
      const { data, error } = await supabase.functions.invoke('generate-blog', {
        body: {
          type,
          topic: type === 'improve_content' ? currentContent : topic,
          keywords,
          tone,
          length,
        },
      });

      if (error) throw error;

      if (data?.error) {
        throw new Error(data.error);
      }

      const content = data?.content || '';
      setGeneratedContent(content);

      toast({
        title: 'Content generated!',
        description: 'AI has generated your content successfully',
      });

    } catch (error: any) {
      console.error('Generation error:', error);
      toast({
        title: 'Generation failed',
        description: error.message || 'Failed to generate content',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applyContent = () => {
    if (!generatedContent) return;

    switch (activeTab) {
      case 'full':
      case 'improve':
        onContentGenerated?.(generatedContent);
        break;
      case 'title':
        // Extract first title from numbered list
        const firstTitle = generatedContent.split('\n').find(line => line.trim())?.replace(/^\d+\.\s*/, '');
        if (firstTitle) onTitleGenerated?.(firstTitle);
        break;
      case 'excerpt':
        onExcerptGenerated?.(generatedContent);
        break;
      case 'tags':
        onTagsGenerated?.(generatedContent);
        break;
    }

    setIsOpen(false);
    toast({
      title: 'Content applied!',
      description: 'The generated content has been added to your post',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Sparkles className="h-4 w-4" />
          AI Generate
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Blog Generator
          </DialogTitle>
          <DialogDescription>
            Use AI to generate blog content, titles, excerpts, and more
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="full" className="text-xs">
              <FileText className="h-3 w-3 mr-1" />
              Full Post
            </TabsTrigger>
            <TabsTrigger value="title" className="text-xs">
              <Wand2 className="h-3 w-3 mr-1" />
              Titles
            </TabsTrigger>
            <TabsTrigger value="excerpt" className="text-xs">
              <FileText className="h-3 w-3 mr-1" />
              Excerpt
            </TabsTrigger>
            <TabsTrigger value="outline" className="text-xs">
              <ListTree className="h-3 w-3 mr-1" />
              Outline
            </TabsTrigger>
            <TabsTrigger value="tags" className="text-xs">
              <Tags className="h-3 w-3 mr-1" />
              Tags
            </TabsTrigger>
          </TabsList>

          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label>Topic / Subject</Label>
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., How to improve your SEO in 2025"
              />
            </div>

            <div className="space-y-2">
              <Label>Keywords (optional)</Label>
              <Input
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g., SEO, digital marketing, Google ranking"
              />
            </div>

            {(activeTab === 'full' || activeTab === 'outline') && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tone</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual & Friendly</SelectItem>
                      <SelectItem value="authoritative">Authoritative</SelectItem>
                      <SelectItem value="conversational">Conversational</SelectItem>
                      <SelectItem value="inspirational">Inspirational</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Length</Label>
                  <Select value={length} onValueChange={setLength}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="500-750">Short (500-750 words)</SelectItem>
                      <SelectItem value="1000-1500">Medium (1000-1500 words)</SelectItem>
                      <SelectItem value="2000-2500">Long (2000-2500 words)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <TabsContent value="full" className="mt-0">
              <Button
                onClick={() => generate('generate_full')}
                disabled={isLoading}
                className="w-full gradient-bg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating full post...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Full Blog Post
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="title" className="mt-0">
              <Button
                onClick={() => generate('generate_title')}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating titles...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Generate Title Ideas
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="excerpt" className="mt-0">
              <Button
                onClick={() => generate('generate_excerpt')}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating excerpt...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Excerpt
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="outline" className="mt-0">
              <Button
                onClick={() => generate('generate_outline')}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating outline...
                  </>
                ) : (
                  <>
                    <ListTree className="h-4 w-4 mr-2" />
                    Generate Outline
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="tags" className="mt-0">
              <Button
                onClick={() => generate('generate_tags')}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating tags...
                  </>
                ) : (
                  <>
                    <Tags className="h-4 w-4 mr-2" />
                    Generate Tags
                  </>
                )}
              </Button>
            </TabsContent>

            {currentContent && (
              <div className="pt-4 border-t">
                <Button
                  onClick={() => generate('improve_content')}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Improving content...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 mr-2" />
                      Improve Existing Content
                    </>
                  )}
                </Button>
              </div>
            )}

            {generatedContent && (
              <div className="space-y-3 pt-4 border-t">
                <Label>Generated Content</Label>
                <div className="p-4 rounded-lg bg-muted max-h-64 overflow-y-auto">
                  {activeTab === 'full' || activeTab === 'improve' ? (
                    <div
                      className="prose prose-sm dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: generatedContent }}
                    />
                  ) : (
                    <pre className="whitespace-pre-wrap text-sm">{generatedContent}</pre>
                  )}
                </div>
                <Button onClick={applyContent} className="w-full gradient-bg">
                  Apply to Post
                </Button>
              </div>
            )}
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AIBlogGenerator;