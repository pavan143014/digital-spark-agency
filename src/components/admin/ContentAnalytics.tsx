import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays, startOfDay, endOfDay, eachDayOfInterval, parseISO, differenceInDays } from 'date-fns';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Users,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Share2,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  BarChart3,
  Activity,
  Target,
  Zap,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface ViewData {
  id: string;
  post_id: string;
  viewed_at: string;
  referrer: string | null;
  user_agent: string | null;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  view_count: number;
  published_at: string | null;
}

type TimeRange = '7d' | '14d' | '30d' | '90d';

const CHART_COLORS = [
  'hsl(var(--ps-blue))',
  'hsl(var(--ps-green))',
  'hsl(var(--ps-purple))',
  'hsl(var(--ps-orange))',
  'hsl(var(--ps-pink))',
  'hsl(var(--ps-cyan))',
  'hsl(var(--ps-yellow))',
  'hsl(var(--primary))',
];

const ContentAnalytics = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [loading, setLoading] = useState(true);
  const [views, setViews] = useState<ViewData[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [previousPeriodViews, setPreviousPeriodViews] = useState(0);

  const daysMap: Record<TimeRange, number> = {
    '7d': 7,
    '14d': 14,
    '30d': 30,
    '90d': 90,
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    const days = daysMap[timeRange];
    const startDate = startOfDay(subDays(new Date(), days));
    const previousStartDate = startOfDay(subDays(new Date(), days * 2));

    try {
      // Fetch views for current period
      const { data: viewsData } = await supabase
        .from('post_views')
        .select('*')
        .gte('viewed_at', startDate.toISOString())
        .order('viewed_at', { ascending: false });

      // Fetch views count for previous period (for comparison)
      const { count: prevCount } = await supabase
        .from('post_views')
        .select('*', { count: 'exact', head: true })
        .gte('viewed_at', previousStartDate.toISOString())
        .lt('viewed_at', startDate.toISOString());

      // Fetch posts
      const { data: postsData } = await supabase
        .from('blog_posts')
        .select('id, title, slug, category, view_count, published_at')
        .eq('published', true)
        .order('view_count', { ascending: false });

      setViews(viewsData || []);
      setPreviousPeriodViews(prevCount || 0);
      setPosts(postsData || []);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
    setLoading(false);
  };

  // Calculate views over time
  const viewsOverTime = useMemo(() => {
    const days = daysMap[timeRange];
    const startDate = startOfDay(subDays(new Date(), days - 1));
    const endDate = endOfDay(new Date());
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

    return dateRange.map(day => {
      const dayViews = views.filter(v => {
        const viewDate = parseISO(v.viewed_at);
        return viewDate >= startOfDay(day) && viewDate <= endOfDay(day);
      });

      return {
        date: format(day, timeRange === '7d' ? 'EEE' : 'MMM dd'),
        fullDate: format(day, 'MMM dd, yyyy'),
        views: dayViews.length,
      };
    });
  }, [views, timeRange]);

  // Calculate traffic sources from referrer
  const trafficSources = useMemo(() => {
    const sources: Record<string, number> = {
      'Direct': 0,
      'Search': 0,
      'Social': 0,
      'Referral': 0,
    };

    views.forEach(view => {
      const referrer = view.referrer?.toLowerCase() || '';
      
      if (!referrer || referrer === 'direct' || referrer === '') {
        sources['Direct']++;
      } else if (referrer.includes('google') || referrer.includes('bing') || referrer.includes('yahoo') || referrer.includes('duckduckgo')) {
        sources['Search']++;
      } else if (referrer.includes('facebook') || referrer.includes('twitter') || referrer.includes('linkedin') || referrer.includes('instagram') || referrer.includes('whatsapp')) {
        sources['Social']++;
      } else {
        sources['Referral']++;
      }
    });

    return Object.entries(sources).map(([name, value]) => ({
      name,
      value,
      percentage: views.length > 0 ? Math.round((value / views.length) * 100) : 0,
    }));
  }, [views]);

  // Calculate device breakdown from user agent
  const deviceBreakdown = useMemo(() => {
    const devices: Record<string, number> = {
      'Desktop': 0,
      'Mobile': 0,
      'Tablet': 0,
    };

    views.forEach(view => {
      const ua = view.user_agent?.toLowerCase() || '';
      
      if (ua.includes('mobile') && !ua.includes('ipad')) {
        devices['Mobile']++;
      } else if (ua.includes('ipad') || ua.includes('tablet')) {
        devices['Tablet']++;
      } else {
        devices['Desktop']++;
      }
    });

    return Object.entries(devices).map(([name, value]) => ({
      name,
      value,
      percentage: views.length > 0 ? Math.round((value / views.length) * 100) : 0,
    }));
  }, [views]);

  // Calculate category performance
  const categoryPerformance = useMemo(() => {
    const categories: Record<string, { views: number; posts: number }> = {};

    posts.forEach(post => {
      if (!categories[post.category]) {
        categories[post.category] = { views: 0, posts: 0 };
      }
      categories[post.category].views += post.view_count;
      categories[post.category].posts++;
    });

    return Object.entries(categories)
      .map(([category, data]) => ({
        category,
        views: data.views,
        posts: data.posts,
        avgViews: data.posts > 0 ? Math.round(data.views / data.posts) : 0,
      }))
      .sort((a, b) => b.views - a.views);
  }, [posts]);

  // Calculate engagement metrics
  const currentPeriodViews = views.length;
  const viewsChange = previousPeriodViews > 0 
    ? Math.round(((currentPeriodViews - previousPeriodViews) / previousPeriodViews) * 100)
    : 100;

  const avgDailyViews = Math.round(currentPeriodViews / daysMap[timeRange]);
  const topPerformingPost = posts[0];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg gradient-bg">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Content Performance</h2>
            <p className="text-sm text-muted-foreground">Detailed analytics for your content</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="14d">Last 14 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Badge variant="outline" className="gap-1">
            <Activity className="h-3 w-3" />
            Real-time
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Eye className="h-4 w-4 text-[hsl(var(--ps-blue))]" />
              <div className={`flex items-center gap-1 text-xs ${viewsChange >= 0 ? 'text-[hsl(var(--ps-green))]' : 'text-[hsl(var(--ps-red))]'}`}>
                {viewsChange >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {Math.abs(viewsChange)}%
              </div>
            </div>
            <div className="text-2xl font-bold">{currentPeriodViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total Views</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-4 w-4 text-[hsl(var(--ps-green))]" />
              <Badge variant="secondary" className="text-[10px]">Avg</Badge>
            </div>
            <div className="text-2xl font-bold">{avgDailyViews}</div>
            <p className="text-xs text-muted-foreground">Daily Average</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <FileText className="h-4 w-4 text-[hsl(var(--ps-purple))]" />
              <Badge variant="secondary" className="text-[10px]">Published</Badge>
            </div>
            <div className="text-2xl font-bold">{posts.length}</div>
            <p className="text-xs text-muted-foreground">Active Posts</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Zap className="h-4 w-4 text-[hsl(var(--ps-orange))]" />
              <Badge variant="secondary" className="text-[10px]">Best</Badge>
            </div>
            <div className="text-2xl font-bold">{topPerformingPost?.view_count || 0}</div>
            <p className="text-xs text-muted-foreground truncate">{topPerformingPost?.title?.slice(0, 20) || 'N/A'}...</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="views" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
          <TabsTrigger value="views">Views Over Time</TabsTrigger>
          <TabsTrigger value="sources">Traffic Sources</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
        </TabsList>

        {/* Views Over Time */}
        <TabsContent value="views" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Page Views Trend</CardTitle>
              <CardDescription>Daily views for the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={viewsOverTime}>
                    <defs>
                      <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }} 
                      className="text-muted-foreground"
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }} 
                      className="text-muted-foreground"
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-popover border rounded-lg p-3 shadow-lg">
                              <p className="text-sm font-medium">{payload[0].payload.fullDate}</p>
                              <p className="text-sm text-muted-foreground">
                                Views: <span className="font-bold text-foreground">{payload[0].value}</span>
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="views"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fill="url(#viewsGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Daily breakdown table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Daily Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-[300px] overflow-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-background">
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium">Date</th>
                      <th className="text-right py-2 font-medium">Views</th>
                      <th className="text-right py-2 font-medium">% of Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewsOverTime.slice().reverse().map((day, i) => (
                      <tr key={i} className="border-b border-muted/50">
                        <td className="py-2">{day.fullDate}</td>
                        <td className="text-right py-2 font-medium">{day.views}</td>
                        <td className="text-right py-2 text-muted-foreground">
                          {currentPeriodViews > 0 ? Math.round((day.views / currentPeriodViews) * 100) : 0}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Traffic Sources */}
        <TabsContent value="sources" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Traffic Sources
                </CardTitle>
                <CardDescription>Where your visitors come from</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={trafficSources}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {trafficSources.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-popover border rounded-lg p-3 shadow-lg">
                                <p className="text-sm font-medium">{payload[0].name}</p>
                                <p className="text-sm text-muted-foreground">
                                  Views: <span className="font-bold text-foreground">{payload[0].value}</span>
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Source Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {trafficSources.map((source, index) => (
                  <div key={source.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                        />
                        <span>{source.name}</span>
                      </div>
                      <span className="font-medium">{source.value} ({source.percentage}%)</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all"
                        style={{ 
                          width: `${source.percentage}%`,
                          backgroundColor: CHART_COLORS[index % CHART_COLORS.length]
                        }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Devices */}
        <TabsContent value="devices" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  Device Distribution
                </CardTitle>
                <CardDescription>Devices used by visitors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={deviceBreakdown} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" tick={{ fontSize: 12 }} />
                      <YAxis 
                        type="category" 
                        dataKey="name" 
                        tick={{ fontSize: 12 }}
                        width={80}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-popover border rounded-lg p-3 shadow-lg">
                                <p className="text-sm font-medium">{payload[0].payload.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  Views: <span className="font-bold text-foreground">{payload[0].value}</span> ({payload[0].payload.percentage}%)
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {deviceBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Device Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {deviceBreakdown.map((device, index) => {
                  const Icon = device.name === 'Mobile' ? Smartphone : device.name === 'Tablet' ? Monitor : Monitor;
                  return (
                    <div key={device.name} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                      <div 
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${CHART_COLORS[index % CHART_COLORS.length]}20` }}
                      >
                        <Icon 
                          className="h-5 w-5"
                          style={{ color: CHART_COLORS[index % CHART_COLORS.length] }}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{device.name}</div>
                        <div className="text-sm text-muted-foreground">{device.value} views</div>
                      </div>
                      <div className="text-2xl font-bold">{device.percentage}%</div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Content Performance */}
        <TabsContent value="content" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Category Performance
                </CardTitle>
                <CardDescription>Views by content category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryPerformance.slice(0, 6)}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="category" 
                        tick={{ fontSize: 10 }}
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-popover border rounded-lg p-3 shadow-lg">
                                <p className="text-sm font-medium">{data.category}</p>
                                <p className="text-sm text-muted-foreground">
                                  Total Views: <span className="font-bold text-foreground">{data.views}</span>
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Posts: <span className="font-bold text-foreground">{data.posts}</span>
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Avg/Post: <span className="font-bold text-foreground">{data.avgViews}</span>
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="views" radius={[4, 4, 0, 0]}>
                        {categoryPerformance.slice(0, 6).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Top Performing Posts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[300px] overflow-auto">
                  {posts.slice(0, 10).map((post, index) => (
                    <div key={post.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <Link 
                          to={`/blog/${post.slug}`}
                          className="text-sm font-medium truncate block hover:text-primary transition-colors"
                        >
                          {post.title}
                        </Link>
                        <span className="text-xs text-muted-foreground">{post.category}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm font-medium">
                        <Eye className="h-3 w-3 text-muted-foreground" />
                        {post.view_count}
                      </div>
                    </div>
                  ))}
                  {posts.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">No published posts yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Category breakdown table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Category Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium">Category</th>
                    <th className="text-right py-2 font-medium">Posts</th>
                    <th className="text-right py-2 font-medium">Total Views</th>
                    <th className="text-right py-2 font-medium">Avg Views/Post</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryPerformance.map((cat, i) => (
                    <tr key={cat.category} className="border-b border-muted/50">
                      <td className="py-2">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                          />
                          {cat.category}
                        </div>
                      </td>
                      <td className="text-right py-2">{cat.posts}</td>
                      <td className="text-right py-2 font-medium">{cat.views}</td>
                      <td className="text-right py-2 text-muted-foreground">{cat.avgViews}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentAnalytics;
