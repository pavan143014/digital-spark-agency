import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Eye, Calendar, Clock, CalendarClock, Sparkles } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';
import RichTextEditor from '@/components/admin/RichTextEditor';
import AIBlogGenerator from '@/components/admin/AIBlogGenerator';
import SEOAnalyzer from '@/components/admin/SEOAnalyzer';
import KeywordDensityAnalyzer from '@/components/admin/KeywordDensityAnalyzer';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format, parseISO, isAfter } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AdminPostEditor = () => {
  const { id } = useParams();
  const location = useLocation();
  const isEditing = id && id !== 'new';
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [publishMode, setPublishMode] = useState<'draft' | 'now' | 'scheduled'>('draft');
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
  const [scheduledTime, setScheduledTime] = useState('09:00');
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_image: '',
    author: 'PS Digital Team',
    category: 'Digital Marketing',
    tags: '',
    published: false,
  });

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/admin/login');
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isEditing && user && isAdmin) {
      fetchPost();
    }
  }, [id, user, isAdmin]);

  // Handle prefilled data from AutoBlogScheduler
  useEffect(() => {
    const prefill = location.state?.prefill;
    if (prefill && !isEditing) {
      const generateSlugFromTitle = (title: string) => {
        return title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
      };
      
      setFormData(prev => ({
        ...prev,
        title: prefill.title || prev.title,
        slug: prefill.title ? generateSlugFromTitle(prefill.title) : prev.slug,
        content: prefill.content || prev.content,
        excerpt: prefill.excerpt || prev.excerpt,
        tags: prefill.tags || prev.tags,
        category: prefill.category || prev.category,
      }));

      toast({
        title: 'AI Content Loaded',
        description: 'Review the generated content and make any adjustments before publishing.',
      });
    }
  }, [location.state, isEditing]);

  const fetchPost = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch post',
        variant: 'destructive',
      });
      navigate('/admin');
    } else if (data) {
      setFormData({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt || '',
        content: data.content,
        cover_image: data.cover_image || '',
        author: data.author,
        category: data.category,
        tags: data.tags?.join(', ') || '',
        published: data.published,
      });
      
      // Set publish mode based on existing data
      if (!data.published) {
        setPublishMode('draft');
      } else if (data.published_at && isAfter(parseISO(data.published_at), new Date())) {
        setPublishMode('scheduled');
        const pubDate = parseISO(data.published_at);
        setScheduledDate(pubDate);
        setScheduledTime(format(pubDate, 'HH:mm'));
      } else {
        setPublishMode('now');
      }
    }
    setIsLoading(false);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: isEditing ? prev.slug : generateSlug(title),
    }));
  };

  const getPublishData = () => {
    switch (publishMode) {
      case 'draft':
        return { published: false, published_at: null };
      case 'now':
        return { published: true, published_at: new Date().toISOString() };
      case 'scheduled':
        if (!scheduledDate) {
          return { published: false, published_at: null };
        }
        const [hours, minutes] = scheduledTime.split(':').map(Number);
        const scheduledDateTime = new Date(scheduledDate);
        scheduledDateTime.setHours(hours, minutes, 0, 0);
        return { published: true, published_at: scheduledDateTime.toISOString() };
      default:
        return { published: false, published_at: null };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const { published, published_at } = getPublishData();

    const postData = {
      title: formData.title,
      slug: formData.slug || generateSlug(formData.title),
      excerpt: formData.excerpt || null,
      content: formData.content,
      cover_image: formData.cover_image || null,
      author: formData.author,
      category: formData.category,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      published,
      published_at,
      created_by: user?.id,
    };

    let error;

    if (isEditing) {
      const result = await supabase
        .from('blog_posts')
        .update(postData)
        .eq('id', id);
      error = result.error;
    } else {
      const result = await supabase
        .from('blog_posts')
        .insert(postData);
      error = result.error;
    }

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      const statusMessage = publishMode === 'scheduled' 
        ? `Post scheduled for ${format(new Date(published_at!), 'MMM d, yyyy h:mm a')}`
        : publishMode === 'now' 
          ? 'Post published successfully'
          : 'Draft saved successfully';
      
      toast({
        title: 'Success',
        description: statusMessage,
      });
      navigate('/admin');
    }

    setIsSaving(false);
  };

  // Generate time options for the dropdown
  const timeOptions = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const time = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
      const displayTime = format(new Date(`2000-01-01T${time}`), 'h:mm a');
      timeOptions.push({ value: time, label: displayTime });
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-bold">
              {isEditing ? 'Edit Post' : 'New Post'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <AIBlogGenerator
              onTitleGenerated={(title) => {
                setFormData(prev => ({
                  ...prev,
                  title,
                  slug: generateSlug(title),
                }));
              }}
              onContentGenerated={(content) => setFormData(prev => ({ ...prev, content }))}
              onExcerptGenerated={(excerpt) => setFormData(prev => ({ ...prev, excerpt }))}
              onTagsGenerated={(tags) => setFormData(prev => ({ ...prev, tags }))}
              currentContent={formData.content}
            />
            {formData.slug && (
              <Button variant="outline" size="sm" asChild>
                <Link to={`/blog/${formData.slug}`} target="_blank">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Link>
              </Button>
            )}
            <Button 
              onClick={handleSubmit} 
              disabled={isSaving}
              className="gradient-bg"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Post Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="Enter post title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="post-url-slug"
                />
                <p className="text-xs text-muted-foreground">
                  URL: /blog/{formData.slug || 'your-post-slug'}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Brief description of the post"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Content *</Label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                  placeholder="Write your post content here..."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cover Image</CardTitle>
              <CardDescription>Upload or add a URL for your post's featured image</CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUpload
                value={formData.cover_image}
                onChange={(url) => setFormData(prev => ({ ...prev, cover_image: url }))}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                    placeholder="Author name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                      <SelectItem value="SEO">SEO</SelectItem>
                      <SelectItem value="Social Media">Social Media</SelectItem>
                      <SelectItem value="Content Marketing">Content Marketing</SelectItem>
                      <SelectItem value="PPC">PPC</SelectItem>
                      <SelectItem value="Email Marketing">Email Marketing</SelectItem>
                      <SelectItem value="Web Design">Web Design</SelectItem>
                      <SelectItem value="Analytics">Analytics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="tag1, tag2, tag3"
                />
                <p className="text-xs text-muted-foreground">Separate tags with commas</p>
              </div>
            </CardContent>
          </Card>

          {/* SEO Analyzer */}
          <SEOAnalyzer
            title={formData.title}
            content={formData.content}
            excerpt={formData.excerpt}
            slug={formData.slug}
            tags={formData.tags}
            coverImage={formData.cover_image}
          />

          {/* Keyword Density Analyzer */}
          <KeywordDensityAnalyzer
            title={formData.title}
            content={formData.content}
            excerpt={formData.excerpt}
          />

          <Card>
            <CardHeader>
              <CardTitle>Publishing</CardTitle>
              <CardDescription>Choose when to publish your post</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Publish Mode Selection */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  onClick={() => setPublishMode('draft')}
                  className={cn(
                    'p-4 rounded-lg border-2 cursor-pointer transition-all',
                    publishMode === 'draft' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={cn(
                      'p-2 rounded-full',
                      publishMode === 'draft' ? 'bg-primary/20' : 'bg-muted'
                    )}>
                      <Clock className={cn(
                        'h-4 w-4',
                        publishMode === 'draft' ? 'text-primary' : 'text-muted-foreground'
                      )} />
                    </div>
                    <span className="font-medium">Save as Draft</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Save without publishing. You can publish later.
                  </p>
                </div>

                <div
                  onClick={() => setPublishMode('now')}
                  className={cn(
                    'p-4 rounded-lg border-2 cursor-pointer transition-all',
                    publishMode === 'now' 
                      ? 'border-green-500 bg-green-500/5' 
                      : 'border-border hover:border-green-500/50'
                  )}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={cn(
                      'p-2 rounded-full',
                      publishMode === 'now' ? 'bg-green-500/20' : 'bg-muted'
                    )}>
                      <Eye className={cn(
                        'h-4 w-4',
                        publishMode === 'now' ? 'text-green-500' : 'text-muted-foreground'
                      )} />
                    </div>
                    <span className="font-medium">Publish Now</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Make your post live immediately.
                  </p>
                </div>

                <div
                  onClick={() => setPublishMode('scheduled')}
                  className={cn(
                    'p-4 rounded-lg border-2 cursor-pointer transition-all',
                    publishMode === 'scheduled' 
                      ? 'border-blue-500 bg-blue-500/5' 
                      : 'border-border hover:border-blue-500/50'
                  )}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={cn(
                      'p-2 rounded-full',
                      publishMode === 'scheduled' ? 'bg-blue-500/20' : 'bg-muted'
                    )}>
                      <CalendarClock className={cn(
                        'h-4 w-4',
                        publishMode === 'scheduled' ? 'text-blue-500' : 'text-muted-foreground'
                      )} />
                    </div>
                    <span className="font-medium">Schedule</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Set a future date and time.
                  </p>
                </div>
              </div>

              {/* Schedule Date/Time Picker */}
              {publishMode === 'scheduled' && (
                <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20 space-y-4">
                  <div className="flex items-center gap-2 text-blue-500">
                    <CalendarClock className="h-4 w-4" />
                    <span className="font-medium">Schedule Publication</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !scheduledDate && 'text-muted-foreground'
                            )}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {scheduledDate ? format(scheduledDate, 'PPP') : 'Pick a date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={scheduledDate}
                            onSelect={setScheduledDate}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label>Time</Label>
                      <Select value={scheduledTime} onValueChange={setScheduledTime}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {scheduledDate && (
                    <p className="text-sm text-blue-500">
                      This post will be published on{' '}
                      <strong>
                        {format(scheduledDate, 'MMMM d, yyyy')} at{' '}
                        {format(new Date(`2000-01-01T${scheduledTime}`), 'h:mm a')}
                      </strong>
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" asChild>
              <Link to="/admin">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSaving} className="gradient-bg">
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : (
                publishMode === 'draft' ? 'Save Draft' :
                publishMode === 'now' ? 'Publish Now' :
                'Schedule Post'
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AdminPostEditor;