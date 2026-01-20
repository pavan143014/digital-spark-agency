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
import { Sparkles, Loader2, Download, RefreshCw, Check, Image as ImageIcon, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIImageGeneratorProps {
  onImageGenerated?: (url: string) => void;
  trigger?: React.ReactNode;
  defaultPrompt?: string;
}

const AIImageGenerator = ({ onImageGenerated, trigger, defaultPrompt = '' }: AIImageGeneratorProps) => {
  const [open, setOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [style, setStyle] = useState('professional');
  const [size, setSize] = useState('1200x630');
  const [generatedImage, setGeneratedImage] = useState<{ url: string; preview: string } | null>(null);
  const { toast } = useToast();

  const styleOptions = [
    { value: 'professional', label: 'Professional', description: 'Clean, modern business style' },
    { value: 'creative', label: 'Creative', description: 'Vibrant and artistic' },
    { value: 'minimalist', label: 'Minimalist', description: 'Simple and elegant' },
    { value: 'abstract', label: 'Abstract', description: 'Conceptual and geometric' },
    { value: 'photorealistic', label: 'Photorealistic', description: 'Natural photograph style' },
  ];

  const sizeOptions = [
    { value: '1200x630', label: 'Blog Cover (1200×630)', description: 'Ideal for blog headers' },
    { value: '1080x1080', label: 'Social Square (1080×1080)', description: 'Perfect for social posts' },
    { value: '1080x1920', label: 'Story (1080×1920)', description: 'Vertical story format' },
  ];

  const promptSuggestions = [
    'Digital marketing strategy visualization with abstract network connections',
    'Modern business growth concept with upward trending graphs',
    'Social media marketing collage with engagement icons',
    'SEO optimization concept with search engine elements',
    'Professional team collaboration in modern office setting',
    'E-commerce success with shopping and analytics elements',
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Missing prompt',
        description: 'Please enter a description for your image',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { prompt, style, size },
      });

      if (error) throw error;

      if (data.url) {
        setGeneratedImage({ url: data.url, preview: data.preview || data.url });
        toast({
          title: 'Image generated!',
          description: 'Your AI image is ready to use',
        });
      }
    } catch (error: any) {
      console.error('Generation error:', error);
      toast({
        title: 'Generation failed',
        description: error.message || 'Failed to generate image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    if (generatedImage && onImageGenerated) {
      onImageGenerated(generatedImage.url);
      setOpen(false);
      setGeneratedImage(null);
      setPrompt('');
      toast({
        title: 'Image applied!',
        description: 'The AI-generated image has been added',
      });
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage.preview;
      link.download = `ai-generated-${Date.now()}.png`;
      link.click();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Wand2 className="h-4 w-4" />
            Generate with AI
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Image Generator
          </DialogTitle>
          <DialogDescription>
            Generate custom images for your blog posts and marketing content
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Prompt Input */}
          <div className="space-y-2">
            <Label>Describe your image</Label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A professional digital marketing concept with blue gradient background..."
              rows={3}
              className="resize-none"
            />
            <div className="flex flex-wrap gap-1.5">
              {promptSuggestions.slice(0, 3).map((suggestion, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPrompt(suggestion)}
                  className="text-xs px-2 py-1 rounded-full bg-muted hover:bg-muted/80 transition-colors truncate max-w-[200px]"
                >
                  {suggestion.length > 40 ? suggestion.substring(0, 40) + '...' : suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Style and Size Selectors */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Style</Label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {styleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex flex-col">
                        <span>{option.label}</span>
                        <span className="text-xs text-muted-foreground">{option.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Size</Label>
              <Select value={size} onValueChange={setSize}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sizeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex flex-col">
                        <span>{option.label}</span>
                        <span className="text-xs text-muted-foreground">{option.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full gradient-bg"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating image...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Image
              </>
            )}
          </Button>

          {/* Generated Image Preview */}
          {generatedImage && (
            <div className="space-y-3">
              <Label>Generated Image</Label>
              <div className="relative rounded-lg overflow-hidden border border-border">
                <img
                  src={generatedImage.preview}
                  alt="AI Generated"
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleApply}
                  className="flex-1 gradient-bg"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Apply to Post
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                >
                  <RefreshCw className={cn("h-4 w-4", isGenerating && "animate-spin")} />
                </Button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isGenerating && !generatedImage && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-primary/30" />
                </div>
                <Loader2 className="h-16 w-16 animate-spin text-primary/50" />
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Creating your image with AI...
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                This may take 10-20 seconds
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIImageGenerator;
