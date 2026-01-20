import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  LogOut, 
  FileText, 
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Search,
  CalendarClock,
  LayoutDashboard,
  TrendingUp,
  BarChart3,
  EyeIcon,
  ArrowUpRight,
  Loader2,
  Sparkles,
  Megaphone,
  Palette
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format, parseISO, isAfter, subDays, startOfDay } from 'date-fns';
import AIControlsPanel from '@/components/admin/AIControlsPanel';
import MarketingDashboard from '@/components/admin/MarketingDashboard';
import VisualEditor from '@/components/admin/VisualEditor';
import ContentAnalytics from '@/components/admin/ContentAnalytics';
import SocialMediaGenerator from '@/components/admin/SocialMediaGenerator';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  cover_image: string | null;
  view_count: number;
}

interface ViewStats {
  today: number;
  week: number;
  total: number;
  topPosts: { id: string; title: string; view_count: number; slug: string }[];
  recentViews: { date: string; count: number }[];
}

const Admin = () => {
  const { user, isAdmin, isLoading, signOut } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());
  const [isBulkActioning, setIsBulkActioning] = useState(false);
  const [togglingPostId, setTogglingPostId] = useState<string | null>(null);
  const [viewStats, setViewStats] = useState<ViewStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate('/admin/login');
    }
  }, [user, isAdmin, isLoading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchPosts();
      fetchViewStats();
    }
  }, [user, isAdmin]);

  const fetchPosts = async () => {
    setLoadingPosts(true);
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, category, published, published_at, created_at, updated_at, cover_image, view_count')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch posts',
        variant: 'destructive',
      });
    } else {
      setPosts(data || []);
    }
    setLoadingPosts(false);
  };

  const fetchViewStats = async () => {
    setLoadingStats(true);
    try {
      const now = new Date();
      const todayStart = startOfDay(now);
      const weekStart = startOfDay(subDays(now, 7));

      // Get today's views
      const { count: todayCount } = await supabase
        .from('post_views')
        .select('*', { count: 'exact', head: true })
        .gte('viewed_at', todayStart.toISOString());

      // Get this week's views
      const { count: weekCount } = await supabase
        .from('post_views')
        .select('*', { count: 'exact', head: true })
        .gte('viewed_at', weekStart.toISOString());

      // Get total views
      const { count: totalCount } = await supabase
        .from('post_views')
        .select('*', { count: 'exact', head: true });

      // Get top posts
      const { data: topPostsData } = await supabase
        .from('blog_posts')
        .select('id, title, view_count, slug')
        .order('view_count', { ascending: false })
        .limit(5);

      // Get views per day for last 7 days
      const recentViews: { date: string; count: number }[] = [];
      for (let i = 6; i >= 0; i--) {
        const dayStart = startOfDay(subDays(now, i));
        const dayEnd = startOfDay(subDays(now, i - 1));
        
        const { count } = await supabase
          .from('post_views')
          .select('*', { count: 'exact', head: true })
          .gte('viewed_at', dayStart.toISOString())
          .lt('viewed_at', dayEnd.toISOString());

        recentViews.push({
          date: format(dayStart, 'EEE'),
          count: count || 0,
        });
      }

      setViewStats({
        today: todayCount || 0,
        week: weekCount || 0,
        total: totalCount || 0,
        topPosts: topPostsData || [],
        recentViews,
      });
    } catch (error) {
      console.error('Error fetching view stats:', error);
    }
    setLoadingStats(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete post',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Post deleted successfully',
      });
      fetchPosts();
      setSelectedPosts(new Set());
    }
  };

  const handleQuickPublishToggle = async (postId: string, currentlyPublished: boolean) => {
    setTogglingPostId(postId);
    
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ 
          published: !currentlyPublished,
          published_at: !currentlyPublished ? new Date().toISOString() : null
        })
        .eq('id', postId);

      if (error) throw error;

      // Update local state immediately for better UX
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, published: !currentlyPublished, published_at: !currentlyPublished ? new Date().toISOString() : null }
          : post
      ));

      toast({
        title: 'Success',
        description: `Post ${!currentlyPublished ? 'published' : 'unpublished'} successfully`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update post',
        variant: 'destructive',
      });
    }
    
    setTogglingPostId(null);
  };

  const handleBulkAction = async (action: 'publish' | 'unpublish' | 'delete') => {
    if (selectedPosts.size === 0) return;
    
    setIsBulkActioning(true);
    const ids = Array.from(selectedPosts);

    try {
      if (action === 'delete') {
        const { error } = await supabase
          .from('blog_posts')
          .delete()
          .in('id', ids);
        
        if (error) throw error;
        toast({
          title: 'Success',
          description: `${ids.length} post(s) deleted`,
        });
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .update({ 
            published: action === 'publish',
            published_at: action === 'publish' ? new Date().toISOString() : null
          })
          .in('id', ids);
        
        if (error) throw error;
        toast({
          title: 'Success',
          description: `${ids.length} post(s) ${action === 'publish' ? 'published' : 'unpublished'}`,
        });
      }
      
      fetchPosts();
      setSelectedPosts(new Set());
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || `Failed to ${action} posts`,
        variant: 'destructive',
      });
    }
    
    setIsBulkActioning(false);
  };

  const togglePostSelection = (postId: string) => {
    const newSelected = new Set(selectedPosts);
    if (newSelected.has(postId)) {
      newSelected.delete(postId);
    } else {
      newSelected.add(postId);
    }
    setSelectedPosts(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedPosts.size === filteredPosts.length) {
      setSelectedPosts(new Set());
    } else {
      setSelectedPosts(new Set(filteredPosts.map(p => p.id)));
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const now = new Date();
  
  const getPostStatus = (post: BlogPost) => {
    if (!post.published) return 'draft';
    if (post.published_at && isAfter(parseISO(post.published_at), now)) return 'scheduled';
    return 'published';
  };

  const stats = {
    total: posts.length,
    published: posts.filter(p => getPostStatus(p) === 'published').length,
    drafts: posts.filter(p => getPostStatus(p) === 'draft').length,
    scheduled: posts.filter(p => getPostStatus(p) === 'scheduled').length,
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    const status = getPostStatus(post);
    if (activeTab === 'all') return true;
    if (activeTab === 'published') return status === 'published';
    if (activeTab === 'drafts') return status === 'draft';
    if (activeTab === 'scheduled') return status === 'scheduled';
    return true;
  });

  const getStatusBadge = (post: BlogPost) => {
    const status = getPostStatus(post);
    switch (status) {
      case 'published':
        return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Published</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">Scheduled</Badge>;
      default:
        return <Badge variant="secondary">Draft</Badge>;
    }
  };

  if (isLoading) {
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
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5 text-primary" />
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden md:block">{user.email}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Welcome back! 👋</h2>
          <p className="text-muted-foreground">Manage your marketing content, create blogs, and customize your website</p>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-flex">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="marketing" className="flex items-center gap-2">
              <Megaphone className="h-4 w-4" />
              <span className="hidden sm:inline">Marketing</span>
            </TabsTrigger>
            <TabsTrigger value="ai-studio" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">AI Studio</span>
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-2">
              <ArrowUpRight className="h-4 w-4" />
              <span className="hidden sm:inline">Social</span>
            </TabsTrigger>
            <TabsTrigger value="visual" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Visual</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* Analytics Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Analytics Overview
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Today's Views</CardTitle>
                    <div className="p-2 rounded-full bg-[hsl(var(--ps-green)/0.1)]">
                      <TrendingUp className="h-4 w-4 text-[hsl(var(--ps-green))]" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    {loadingStats ? (
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    ) : (
                      <>
                        <div className="text-3xl font-bold">{viewStats?.today || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">Page views today</p>
                      </>
                    )}
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">This Week</CardTitle>
                    <div className="p-2 rounded-full bg-[hsl(var(--ps-blue)/0.1)]">
                      <BarChart3 className="h-4 w-4 text-[hsl(var(--ps-blue))]" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    {loadingStats ? (
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    ) : (
                      <>
                        <div className="text-3xl font-bold">{viewStats?.week || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">Views this week</p>
                      </>
                    )}
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                    <div className="p-2 rounded-full bg-[hsl(var(--ps-purple)/0.1)]">
                      <EyeIcon className="h-4 w-4 text-[hsl(var(--ps-purple))]" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    {loadingStats ? (
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    ) : (
                      <>
                        <div className="text-3xl font-bold">{viewStats?.total || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">All time views</p>
                      </>
                    )}
                  </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                    <div className="p-2 rounded-full bg-primary/10">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.total}</div>
                    <p className="text-xs text-muted-foreground mt-1">{stats.published} published</p>
                  </CardContent>
                </Card>
              </div>

              {/* Top Posts & Weekly Chart */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Weekly Views Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Views This Week</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loadingStats ? (
                      <div className="h-32 flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : (
                      <div className="flex items-end gap-2 h-32">
                        {viewStats?.recentViews.map((day, i) => {
                          const maxCount = Math.max(...(viewStats?.recentViews.map(d => d.count) || [1]), 1);
                          const height = day.count > 0 ? Math.max((day.count / maxCount) * 100, 10) : 4;
                          return (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                              <div 
                                className="w-full bg-primary/80 rounded-t transition-all hover:bg-primary"
                                style={{ height: `${height}%` }}
                                title={`${day.count} views`}
                              />
                              <span className="text-xs text-muted-foreground">{day.date}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Top Posts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Popular Posts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loadingStats ? (
                      <div className="h-32 flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : viewStats?.topPosts.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">No views yet</p>
                    ) : (
                      <div className="space-y-3">
                        {viewStats?.topPosts.slice(0, 4).map((post, i) => (
                          <div key={post.id} className="flex items-center gap-3">
                            <span className="text-xs font-medium text-muted-foreground w-4">{i + 1}</span>
                            <div className="flex-1 min-w-0">
                              <Link 
                                to={`/blog/${post.slug}`} 
                                target="_blank"
                                className="text-sm font-medium truncate hover:text-primary transition-colors flex items-center gap-1"
                              >
                                {post.title}
                                <ArrowUpRight className="h-3 w-3 flex-shrink-0" />
                              </Link>
                            </div>
                            <Badge variant="secondary" className="flex-shrink-0">
                              {post.view_count} views
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Marketing Tab */}
          <TabsContent value="marketing">
            <MarketingDashboard />
          </TabsContent>

          {/* AI Studio Tab */}
          <TabsContent value="ai-studio">
            <AIControlsPanel 
              onPostGenerated={(post) => {
                navigate('/admin/posts/new', { 
                  state: { prefill: post } 
                });
              }}
            />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <ContentAnalytics />
          </TabsContent>

          {/* Social Media Tab */}
          <TabsContent value="social">
            <SocialMediaGenerator />
          </TabsContent>

          {/* Visual Editor Tab */}
          <TabsContent value="visual">
            <VisualEditor />
          </TabsContent>
        </Tabs>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <div className="p-2 rounded-full bg-primary/10">
                <FileText className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">All blog posts</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
              <div className="p-2 rounded-full bg-green-500/10">
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">{stats.published}</div>
              <p className="text-xs text-muted-foreground mt-1">Live on site</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
              <div className="p-2 rounded-full bg-blue-500/10">
                <CalendarClock className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-500">{stats.scheduled}</div>
              <p className="text-xs text-muted-foreground mt-1">Upcoming posts</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Drafts</CardTitle>
              <div className="p-2 rounded-full bg-yellow-500/10">
                <Clock className="h-4 w-4 text-yellow-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-500">{stats.drafts}</div>
              <p className="text-xs text-muted-foreground mt-1">Work in progress</p>
            </CardContent>
          </Card>
        </div>

        {/* Blog Posts Section */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl">Blog Posts</CardTitle>
                <CardDescription>Manage and organize your blog content</CardDescription>
              </div>
              <Button asChild className="gradient-bg w-fit">
                <Link to="/admin/posts/new">
                  <Plus className="h-4 w-4 mr-2" />
                  New Post
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
                <TabsList>
                  <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
                  <TabsTrigger value="published">Published</TabsTrigger>
                  <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                  <TabsTrigger value="drafts">Drafts</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Bulk Actions Bar */}
            {selectedPosts.size > 0 && (
              <div className="flex items-center gap-4 p-3 mb-4 rounded-lg bg-muted">
                <span className="text-sm font-medium">
                  {selectedPosts.size} post(s) selected
                </span>
                <div className="flex-1" />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('publish')}
                  disabled={isBulkActioning}
                >
                  {isBulkActioning ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                  Publish
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('unpublish')}
                  disabled={isBulkActioning}
                >
                  {isBulkActioning ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Clock className="h-4 w-4 mr-2" />}
                  Unpublish
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={isBulkActioning}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete {selectedPosts.size} Post(s)</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete {selectedPosts.size} post(s)? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleBulkAction('delete')}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete All
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedPosts(new Set())}
                >
                  Clear
                </Button>
              </div>
            )}

            {/* Posts List */}
            {loadingPosts ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {searchQuery ? 'No posts found' : 'No posts yet'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery 
                    ? 'Try adjusting your search terms' 
                    : 'Create your first blog post to get started'}
                </p>
                {!searchQuery && (
                  <Button asChild>
                    <Link to="/admin/posts/new">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Post
                    </Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {/* Select All */}
                <div className="flex items-center gap-3 pb-2 border-b">
                  <Checkbox
                    checked={selectedPosts.size === filteredPosts.length && filteredPosts.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                  <span className="text-sm text-muted-foreground">Select all</span>
                </div>

                {filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    className={`flex items-center gap-4 p-4 rounded-lg border transition-colors group ${
                      selectedPosts.has(post.id) ? 'bg-primary/5 border-primary/30' : 'bg-card hover:bg-accent/50'
                    }`}
                  >
                    {/* Checkbox */}
                    <Checkbox
                      checked={selectedPosts.has(post.id)}
                      onCheckedChange={() => togglePostSelection(post.id)}
                    />

                    {/* Thumbnail */}
                    <div className="hidden sm:block w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      {post.cover_image ? (
                        <img
                          src={post.cover_image}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FileText className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-medium truncate">{post.title}</h3>
                        {getStatusBadge(post)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                        <span className="px-2 py-0.5 bg-muted rounded text-xs">{post.category}</span>
                        <span className="flex items-center gap-1">
                          <EyeIcon className="h-3 w-3" />
                          {post.view_count} views
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {getPostStatus(post) === 'scheduled' && post.published_at
                            ? `Scheduled: ${format(parseISO(post.published_at), 'MMM d, yyyy h:mm a')}`
                            : format(parseISO(post.created_at), 'MMM d, yyyy')
                          }
                        </span>
                      </div>
                    </div>

                    {/* Quick Publish Toggle */}
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <Switch
                        checked={getPostStatus(post) === 'published'}
                        onCheckedChange={() => handleQuickPublishToggle(post.id, post.published)}
                        disabled={togglingPostId === post.id || getPostStatus(post) === 'scheduled'}
                        className="data-[state=checked]:bg-green-500"
                      />
                      {togglingPostId === post.id && (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" asChild title="Preview">
                        <Link to={`/blog/${post.slug}`} target="_blank">
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild title="Edit">
                        <Link to={`/admin/posts/${post.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" title="Delete">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Post</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{post.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(post.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/admin/posts/new')}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 rounded-full bg-primary/10">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Create New Post</h3>
                <p className="text-sm text-muted-foreground">Start writing a new blog article</p>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/blog')}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 rounded-full bg-[hsl(var(--ps-cyan)/0.1)]">
                <Eye className="h-6 w-6 text-[hsl(var(--ps-cyan))]" />
              </div>
              <div>
                <h3 className="font-semibold">View Blog</h3>
                <p className="text-sm text-muted-foreground">See how your blog looks to visitors</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Admin;