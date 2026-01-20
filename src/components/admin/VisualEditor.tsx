import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import {
  Palette,
  Type,
  Layout,
  Image,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Wand2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline
} from 'lucide-react';

const VisualEditor = () => {
  const [activeTab, setActiveTab] = useState('text');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Text customization state
  const [textSettings, setTextSettings] = useState({
    content: 'Your headline here',
    fontSize: 32,
    fontWeight: 'bold',
    alignment: 'center',
    color: '#0ea5e9',
    backgroundColor: 'transparent',
    italic: false,
    underline: false,
  });

  // Button customization state
  const [buttonSettings, setButtonSettings] = useState({
    text: 'Get Started',
    variant: 'gradient',
    size: 'md',
    rounded: 'lg',
    icon: true,
  });

  // Card customization state
  const [cardSettings, setCardSettings] = useState({
    title: 'Card Title',
    description: 'This is a description for the card component.',
    showImage: true,
    showBadge: true,
    shadowLevel: 2,
  });

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: 'Copied!', description: 'Code copied to clipboard' });
  };

  const generateTextCode = () => {
    const styles = [];
    styles.push(`fontSize: '${textSettings.fontSize}px'`);
    styles.push(`fontWeight: '${textSettings.fontWeight}'`);
    styles.push(`textAlign: '${textSettings.alignment}'`);
    styles.push(`color: '${textSettings.color}'`);
    if (textSettings.backgroundColor !== 'transparent') {
      styles.push(`backgroundColor: '${textSettings.backgroundColor}'`);
    }
    if (textSettings.italic) styles.push(`fontStyle: 'italic'`);
    if (textSettings.underline) styles.push(`textDecoration: 'underline'`);

    return `<h1 style={{ ${styles.join(', ')} }}>
  ${textSettings.content}
</h1>`;
  };

  const generateButtonCode = () => {
    const classNames = [];
    if (buttonSettings.variant === 'gradient') {
      classNames.push('gradient-bg');
    }
    if (buttonSettings.rounded === 'full') {
      classNames.push('rounded-full');
    }

    return `<Button ${buttonSettings.variant !== 'gradient' ? `variant="${buttonSettings.variant}"` : ''} 
  size="${buttonSettings.size}" 
  className="${classNames.join(' ')}"
>
  ${buttonSettings.icon ? '<Sparkles className="h-4 w-4 mr-2" />' : ''}
  ${buttonSettings.text}
</Button>`;
  };

  const generateCardCode = () => {
    return `<Card className="shadow-${['sm', 'md', 'lg', 'xl'][cardSettings.shadowLevel - 1] || 'md'}">
  ${cardSettings.showImage ? `<div className="aspect-video bg-muted rounded-t-lg" />` : ''}
  <CardHeader>
    ${cardSettings.showBadge ? `<Badge>Featured</Badge>` : ''}
    <CardTitle>${cardSettings.title}</CardTitle>
    <CardDescription>${cardSettings.description}</CardDescription>
  </CardHeader>
</Card>`;
  };

  return (
    <Card className="border-[hsl(var(--ps-purple)/0.3)] bg-gradient-to-br from-[hsl(var(--ps-purple)/0.05)] to-transparent">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-[hsl(var(--ps-purple)/0.1)]">
            <Palette className="h-5 w-5 text-[hsl(var(--ps-purple))]" />
          </div>
          <div>
            <CardTitle className="text-xl">Visual Editor</CardTitle>
            <CardDescription>Customize components visually and copy the code</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="text" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              Text
            </TabsTrigger>
            <TabsTrigger value="button" className="flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              Button
            </TabsTrigger>
            <TabsTrigger value="card" className="flex items-center gap-2">
              <Layout className="h-4 w-4" />
              Card
            </TabsTrigger>
          </TabsList>

          {/* Text Editor */}
          <TabsContent value="text" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Controls */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Text Content</Label>
                  <Input
                    value={textSettings.content}
                    onChange={(e) => setTextSettings(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Enter your text..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Font Size: {textSettings.fontSize}px</Label>
                    <Slider
                      value={[textSettings.fontSize]}
                      onValueChange={([v]) => setTextSettings(prev => ({ ...prev, fontSize: v }))}
                      min={12}
                      max={72}
                      step={1}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Font Weight</Label>
                    <Select 
                      value={textSettings.fontWeight} 
                      onValueChange={(v) => setTextSettings(prev => ({ ...prev, fontWeight: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="semibold">Semi Bold</SelectItem>
                        <SelectItem value="bold">Bold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Alignment</Label>
                  <div className="flex gap-2">
                    {[
                      { value: 'left', icon: AlignLeft },
                      { value: 'center', icon: AlignCenter },
                      { value: 'right', icon: AlignRight },
                    ].map(({ value, icon: Icon }) => (
                      <Button
                        key={value}
                        variant={textSettings.alignment === value ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setTextSettings(prev => ({ ...prev, alignment: value }))}
                      >
                        <Icon className="h-4 w-4" />
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={textSettings.italic}
                      onCheckedChange={(v) => setTextSettings(prev => ({ ...prev, italic: v }))}
                    />
                    <Label className="flex items-center gap-1">
                      <Italic className="h-4 w-4" /> Italic
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={textSettings.underline}
                      onCheckedChange={(v) => setTextSettings(prev => ({ ...prev, underline: v }))}
                    />
                    <Label className="flex items-center gap-1">
                      <Underline className="h-4 w-4" /> Underline
                    </Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Text Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={textSettings.color}
                      onChange={(e) => setTextSettings(prev => ({ ...prev, color: e.target.value }))}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={textSettings.color}
                      onChange={(e) => setTextSettings(prev => ({ ...prev, color: e.target.value }))}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="space-y-4">
                <Label>Preview</Label>
                <div className="p-6 rounded-lg bg-muted/50 border min-h-[120px] flex items-center justify-center">
                  <div
                    style={{
                      fontSize: `${textSettings.fontSize}px`,
                      fontWeight: textSettings.fontWeight,
                      textAlign: textSettings.alignment as 'left' | 'center' | 'right',
                      color: textSettings.color,
                      fontStyle: textSettings.italic ? 'italic' : 'normal',
                      textDecoration: textSettings.underline ? 'underline' : 'none',
                    }}
                  >
                    {textSettings.content}
                  </div>
                </div>
                <Button onClick={() => copyCode(generateTextCode())} className="w-full" variant="outline">
                  {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  Copy Code
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Button Editor */}
          <TabsContent value="button" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Button Text</Label>
                  <Input
                    value={buttonSettings.text}
                    onChange={(e) => setButtonSettings(prev => ({ ...prev, text: e.target.value }))}
                    placeholder="Button text..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Variant</Label>
                    <Select 
                      value={buttonSettings.variant} 
                      onValueChange={(v) => setButtonSettings(prev => ({ ...prev, variant: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gradient">Gradient</SelectItem>
                        <SelectItem value="default">Primary</SelectItem>
                        <SelectItem value="secondary">Secondary</SelectItem>
                        <SelectItem value="outline">Outline</SelectItem>
                        <SelectItem value="ghost">Ghost</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Size</Label>
                    <Select 
                      value={buttonSettings.size} 
                      onValueChange={(v) => setButtonSettings(prev => ({ ...prev, size: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sm">Small</SelectItem>
                        <SelectItem value="md">Medium</SelectItem>
                        <SelectItem value="lg">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={buttonSettings.icon}
                      onCheckedChange={(v) => setButtonSettings(prev => ({ ...prev, icon: v }))}
                    />
                    <Label>Show Icon</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={buttonSettings.rounded === 'full'}
                      onCheckedChange={(v) => setButtonSettings(prev => ({ ...prev, rounded: v ? 'full' : 'lg' }))}
                    />
                    <Label>Pill Shape</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Preview</Label>
                <div className="p-6 rounded-lg bg-muted/50 border min-h-[120px] flex items-center justify-center">
                  <Button
                    variant={buttonSettings.variant === 'gradient' ? 'default' : buttonSettings.variant as 'default'}
                    size={buttonSettings.size as 'sm' | 'default' | 'lg'}
                    className={`${buttonSettings.variant === 'gradient' ? 'gradient-bg' : ''} ${buttonSettings.rounded === 'full' ? 'rounded-full' : ''}`}
                  >
                    {buttonSettings.icon && <Sparkles className="h-4 w-4 mr-2" />}
                    {buttonSettings.text}
                  </Button>
                </div>
                <Button onClick={() => copyCode(generateButtonCode())} className="w-full" variant="outline">
                  {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  Copy Code
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Card Editor */}
          <TabsContent value="card" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Card Title</Label>
                  <Input
                    value={cardSettings.title}
                    onChange={(e) => setCardSettings(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Card title..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={cardSettings.description}
                    onChange={(e) => setCardSettings(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Card description..."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Shadow Level: {cardSettings.shadowLevel}</Label>
                  <Slider
                    value={[cardSettings.shadowLevel]}
                    onValueChange={([v]) => setCardSettings(prev => ({ ...prev, shadowLevel: v }))}
                    min={1}
                    max={4}
                    step={1}
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={cardSettings.showImage}
                      onCheckedChange={(v) => setCardSettings(prev => ({ ...prev, showImage: v }))}
                    />
                    <Label className="flex items-center gap-1">
                      <Image className="h-4 w-4" /> Show Image
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={cardSettings.showBadge}
                      onCheckedChange={(v) => setCardSettings(prev => ({ ...prev, showBadge: v }))}
                    />
                    <Label>Show Badge</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Preview</Label>
                <Card className={`shadow-${['sm', 'md', 'lg', 'xl'][cardSettings.shadowLevel - 1] || 'md'}`}>
                  {cardSettings.showImage && (
                    <div className="aspect-video bg-gradient-to-br from-muted to-muted-foreground/10 rounded-t-lg flex items-center justify-center">
                      <Image className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <CardHeader>
                    {cardSettings.showBadge && <Badge className="w-fit">Featured</Badge>}
                    <CardTitle>{cardSettings.title}</CardTitle>
                    <CardDescription>{cardSettings.description}</CardDescription>
                  </CardHeader>
                </Card>
                <Button onClick={() => copyCode(generateCardCode())} className="w-full" variant="outline">
                  {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  Copy Code
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default VisualEditor;
