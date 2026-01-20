import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isAfter, subDays } from 'date-fns';
import { 
  Calendar,
  TrendingUp,
  Target,
  Megaphone,
  BarChart3,
  PieChart,
  ArrowUpRight,
  FileText,
  Clock,
  CheckCircle2,
  Sparkles,
  Share2,
  Eye,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  published: boolean;
  published_at: string | null;
  created_at: string;
  view_count: number;
}

interface ContentCalendarProps {
  posts: BlogPost[];
}

const ContentCalendar = ({ posts }: ContentCalendarProps) => {
  const [currentMonth] = useState(new Date());
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getPostsForDay = (day: Date) => {
    return posts.filter(post => {
      if (post.published_at) {
        return isSameDay(parseISO(post.published_at), day);
      }
      return false;
    });
  };

  return (
    <div className="grid grid-cols-7 gap-1">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
        <div key={day} className="text-xs font-medium text-muted-foreground text-center p-1">
          {day}
        </div>
      ))}
      {Array.from({ length: monthStart.getDay() }).map((_, i) => (
        <div key={`empty-${i}`} className="aspect-square" />
      ))}
      {days.map(day => {
        const dayPosts = getPostsForDay(day);
        const isToday = isSameDay(day, new Date());
        const isFuture = isAfter(day, new Date());
        
        return (
          <div
            key={day.toISOString()}
            className={`aspect-square p-1 rounded-md text-xs flex flex-col items-center justify-center transition-colors ${
              isToday ? 'bg-primary/20 ring-1 ring-primary' : 
              dayPosts.length > 0 ? 'bg-[hsl(var(--ps-green)/0.1)]' : 
              isFuture ? 'bg-muted/50' : 'bg-muted/30'
            }`}
          >
            <span className={`${isToday ? 'font-bold text-primary' : 'text-muted-foreground'}`}>
              {format(day, 'd')}
            </span>
            {dayPosts.length > 0 && (
              <div className="flex gap-0.5 mt-0.5">
                {dayPosts.slice(0, 2).map((_, i) => (
                  <div key={i} className="w-1 h-1 rounded-full bg-[hsl(var(--ps-green))]" />
                ))}
                {dayPosts.length > 2 && (
                  <span className="text-[8px] text-[hsl(var(--ps-green))]">+{dayPosts.length - 2}</span>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const MarketingDashboard = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data } = await supabase
      .from('blog_posts')
      .select('id, title, slug, category, published, published_at, created_at, view_count')
      .order('created_at', { ascending: false });
    
    setPosts(data || []);
    setLoading(false);
  };

  const now = new Date();
  const publishedPosts = posts.filter(p => p.published && (!p.published_at || !isAfter(parseISO(p.published_at), now)));
  const scheduledPosts = posts.filter(p => p.published && p.published_at && isAfter(parseISO(p.published_at), now));
  const draftPosts = posts.filter(p => !p.published);
  const totalViews = posts.reduce((sum, p) => sum + (p.view_count || 0), 0);
  
  // Category breakdown
  const categoryBreakdown = posts.reduce((acc, post) => {
    acc[post.category] = (acc[post.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryColors: Record<string, string> = {
    'SEO': 'bg-[hsl(var(--ps-green))]',
    'Social Media': 'bg-[hsl(var(--ps-blue))]',
    'PPC': 'bg-[hsl(var(--ps-orange))]',
    'Content Marketing': 'bg-[hsl(var(--ps-purple))]',
    'Email Marketing': 'bg-[hsl(var(--ps-pink))]',
    'Web Design': 'bg-[hsl(var(--ps-cyan))]',
    'Digital Marketing': 'bg-primary',
    'Analytics': 'bg-[hsl(var(--ps-yellow))]',
  };

  // Marketing goals
  const monthlyGoal = 8;
  const monthlyProgress = posts.filter(p => {
    const postDate = p.published_at ? parseISO(p.published_at) : parseISO(p.created_at);
    return postDate >= startOfMonth(now) && postDate <= endOfMonth(now);
  }).length;

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg gradient-bg">
            <Megaphone className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Marketing Dashboard</h2>
            <p className="text-sm text-muted-foreground">Track your content performance & goals</p>
          </div>
        </div>
        <Badge variant="outline" className="gap-1">
          <Sparkles className="h-3 w-3" />
          Live Analytics
        </Badge>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow hover-lift">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Eye className="h-4 w-4 text-[hsl(var(--ps-green))]" />
              <ArrowUpRight className="h-3 w-3 text-[hsl(var(--ps-green))]" />
            </div>
            <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total Page Views</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow hover-lift">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">{posts.length} total</span>
            </div>
            <div className="text-2xl font-bold">{publishedPosts.length}</div>
            <p className="text-xs text-muted-foreground">Published Posts</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow hover-lift">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-4 w-4 text-[hsl(var(--ps-blue))]" />
              <Badge variant="secondary" className="text-[10px] px-1 py-0">Queue</Badge>
            </div>
            <div className="text-2xl font-bold">{scheduledPosts.length}</div>
            <p className="text-xs text-muted-foreground">Scheduled</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow hover-lift">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <FileText className="h-4 w-4 text-[hsl(var(--ps-orange))]" />
              <Badge variant="secondary" className="text-[10px] px-1 py-0">WIP</Badge>
            </div>
            <div className="text-2xl font-bold">{draftPosts.length}</div>
            <p className="text-xs text-muted-foreground">Drafts</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Content Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <CardTitle className="text-base">Content Calendar</CardTitle>
              </div>
              <span className="text-sm font-medium">{format(new Date(), 'MMMM yyyy')}</span>
            </div>
          </CardHeader>
          <CardContent>
            <ContentCalendar posts={posts} />
            <div className="flex items-center justify-center gap-6 mt-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-muted-foreground">Today</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[hsl(var(--ps-green))]" />
                <span className="text-muted-foreground">Published</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Goal */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Monthly Goal</CardTitle>
            </div>
            <CardDescription>Posts this month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold">
                {monthlyProgress}/{monthlyGoal}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {monthlyProgress >= monthlyGoal ? '🎉 Goal achieved!' : `${monthlyGoal - monthlyProgress} more to go`}
              </p>
            </div>
            <Progress 
              value={(monthlyProgress / monthlyGoal) * 100} 
              className="h-3"
            />
            <div className="text-center">
              <span className="text-xs text-muted-foreground">
                {Math.round((monthlyProgress / monthlyGoal) * 100)}% complete
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <PieChart className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Content by Category</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(categoryBreakdown)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([category, count]) => (
                  <div key={category} className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${categoryColors[category] || 'bg-muted'}`} />
                    <span className="flex-1 text-sm">{category}</span>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                ))
              }
              {Object.keys(categoryBreakdown).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No posts yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Posts */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Top Performing Posts</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {publishedPosts
                .sort((a, b) => b.view_count - a.view_count)
                .slice(0, 4)
                .map((post, i) => (
                  <div key={post.id} className="flex items-center gap-3">
                    <span className="text-xs font-medium text-muted-foreground w-4">{i + 1}</span>
                    <Link 
                      to={`/blog/${post.slug}`}
                      className="flex-1 text-sm truncate hover:text-primary transition-colors"
                    >
                      {post.title}
                    </Link>
                    <Badge variant="outline" className="flex-shrink-0">
                      <Eye className="h-3 w-3 mr-1" />
                      {post.view_count}
                    </Badge>
                  </div>
                ))
              }
              {publishedPosts.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No published posts yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Button variant="outline" className="h-auto py-3 flex-col gap-1" asChild>
          <Link to="/admin/posts/new">
            <FileText className="h-4 w-4" />
            <span className="text-xs">New Post</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-auto py-3 flex-col gap-1" asChild>
          <Link to="/blog">
            <Eye className="h-4 w-4" />
            <span className="text-xs">View Blog</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-auto py-3 flex-col gap-1" disabled>
          <Share2 className="h-4 w-4" />
          <span className="text-xs">Share Stats</span>
        </Button>
        <Button variant="outline" className="h-auto py-3 flex-col gap-1" disabled>
          <BarChart3 className="h-4 w-4" />
          <span className="text-xs">Full Report</span>
        </Button>
      </div>
    </div>
  );
};

export default MarketingDashboard;
