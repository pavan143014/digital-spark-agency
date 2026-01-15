import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp,
  Loader2,
  Target,
  FileText,
  Link as LinkIcon,
  Image,
  Hash,
  RefreshCw
} from 'lucide-react';

interface SEOAnalyzerProps {
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  tags: string;
  coverImage: string;
  onSuggestionApply?: (field: string, value: string) => void;
}

interface SEOIssue {
  type: 'error' | 'warning' | 'success';
  category: string;
  message: string;
  suggestion?: string;
  field?: string;
  suggestedValue?: string;
}

interface SEOAnalysis {
  score: number;
  issues: SEOIssue[];
  aiSuggestions?: string;
}

const SEOAnalyzer = ({ 
  title, 
  content, 
  excerpt, 
  slug, 
  tags, 
  coverImage,
  onSuggestionApply 
}: SEOAnalyzerProps) => {
  const [analysis, setAnalysis] = useState<SEOAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const { toast } = useToast();

  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  const countWords = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const performBasicAnalysis = (): SEOIssue[] => {
    const issues: SEOIssue[] = [];
    const plainContent = stripHtml(content);
    const wordCount = countWords(plainContent);

    // Title analysis
    if (!title) {
      issues.push({
        type: 'error',
        category: 'Title',
        message: 'Missing title',
        suggestion: 'Add a compelling title for your post'
      });
    } else if (title.length < 30) {
      issues.push({
        type: 'warning',
        category: 'Title',
        message: `Title is too short (${title.length} chars)`,
        suggestion: 'Aim for 50-60 characters for optimal SEO'
      });
    } else if (title.length > 60) {
      issues.push({
        type: 'warning',
        category: 'Title',
        message: `Title is too long (${title.length} chars)`,
        suggestion: 'Keep title under 60 characters to avoid truncation in search results'
      });
    } else {
      issues.push({
        type: 'success',
        category: 'Title',
        message: `Title length is optimal (${title.length} chars)`
      });
    }

    // Meta description (excerpt) analysis
    if (!excerpt) {
      issues.push({
        type: 'error',
        category: 'Meta Description',
        message: 'Missing meta description/excerpt',
        suggestion: 'Add an excerpt of 150-160 characters'
      });
    } else if (excerpt.length < 120) {
      issues.push({
        type: 'warning',
        category: 'Meta Description',
        message: `Excerpt is short (${excerpt.length} chars)`,
        suggestion: 'Aim for 150-160 characters for optimal display'
      });
    } else if (excerpt.length > 160) {
      issues.push({
        type: 'warning',
        category: 'Meta Description',
        message: `Excerpt may be truncated (${excerpt.length} chars)`,
        suggestion: 'Keep under 160 characters to avoid truncation'
      });
    } else {
      issues.push({
        type: 'success',
        category: 'Meta Description',
        message: `Excerpt length is optimal (${excerpt.length} chars)`
      });
    }

    // Content length analysis
    if (wordCount < 300) {
      issues.push({
        type: 'error',
        category: 'Content',
        message: `Content too short (${wordCount} words)`,
        suggestion: 'Aim for at least 1000 words for better SEO performance'
      });
    } else if (wordCount < 1000) {
      issues.push({
        type: 'warning',
        category: 'Content',
        message: `Content could be longer (${wordCount} words)`,
        suggestion: 'Posts with 1500-2500 words typically rank better'
      });
    } else {
      issues.push({
        type: 'success',
        category: 'Content',
        message: `Good content length (${wordCount} words)`
      });
    }

    // Heading structure analysis
    const h2Count = (content.match(/<h2/gi) || []).length;
    const h3Count = (content.match(/<h3/gi) || []).length;
    
    if (h2Count === 0) {
      issues.push({
        type: 'warning',
        category: 'Structure',
        message: 'No H2 headings found',
        suggestion: 'Add section headings (H2) to improve readability and SEO'
      });
    } else {
      issues.push({
        type: 'success',
        category: 'Structure',
        message: `${h2Count} H2 heading(s) found`
      });
    }

    // URL/Slug analysis
    if (!slug) {
      issues.push({
        type: 'error',
        category: 'URL',
        message: 'Missing URL slug',
        suggestion: 'Add a descriptive URL slug'
      });
    } else if (slug.length > 75) {
      issues.push({
        type: 'warning',
        category: 'URL',
        message: 'URL slug is quite long',
        suggestion: 'Keep slugs under 75 characters for best results'
      });
    } else {
      issues.push({
        type: 'success',
        category: 'URL',
        message: 'URL slug looks good'
      });
    }

    // Image analysis
    if (!coverImage) {
      issues.push({
        type: 'warning',
        category: 'Image',
        message: 'No featured image',
        suggestion: 'Add a cover image to improve engagement and social sharing'
      });
    } else {
      issues.push({
        type: 'success',
        category: 'Image',
        message: 'Featured image is set'
      });
    }

    // Check for images in content
    const imgCount = (content.match(/<img/gi) || []).length;
    if (wordCount > 500 && imgCount === 0) {
      issues.push({
        type: 'warning',
        category: 'Image',
        message: 'No images in content',
        suggestion: 'Add relevant images to break up text and improve engagement'
      });
    }

    // Internal/External links
    const linkCount = (content.match(/<a\s/gi) || []).length;
    if (linkCount === 0 && wordCount > 300) {
      issues.push({
        type: 'warning',
        category: 'Links',
        message: 'No links in content',
        suggestion: 'Add internal and external links to improve SEO'
      });
    } else if (linkCount > 0) {
      issues.push({
        type: 'success',
        category: 'Links',
        message: `${linkCount} link(s) found in content`
      });
    }

    // Tags analysis
    const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);
    if (tagArray.length === 0) {
      issues.push({
        type: 'warning',
        category: 'Tags',
        message: 'No tags added',
        suggestion: 'Add 3-8 relevant tags to improve discoverability'
      });
    } else if (tagArray.length < 3) {
      issues.push({
        type: 'warning',
        category: 'Tags',
        message: `Only ${tagArray.length} tag(s)`,
        suggestion: 'Consider adding more relevant tags (3-8 recommended)'
      });
    } else {
      issues.push({
        type: 'success',
        category: 'Tags',
        message: `${tagArray.length} tags added`
      });
    }

    return issues;
  };

  const calculateScore = (issues: SEOIssue[]): number => {
    const weights = { error: 0, warning: 0.5, success: 1 };
    const total = issues.length;
    const score = issues.reduce((acc, issue) => acc + weights[issue.type], 0);
    return Math.round((score / total) * 100);
  };

  const analyzeWithAI = async () => {
    setIsAnalyzing(true);
    
    try {
      // First perform basic analysis
      const basicIssues = performBasicAnalysis();
      const basicScore = calculateScore(basicIssues);

      // Get AI-powered suggestions
      const { data, error } = await supabase.functions.invoke('generate-blog', {
        body: {
          type: 'seo_analysis',
          topic: title,
          content: content,
          excerpt: excerpt,
          keywords: tags
        }
      });

      if (error) throw error;

      setAnalysis({
        score: basicScore,
        issues: basicIssues,
        aiSuggestions: data.content
      });

      toast({
        title: 'Analysis Complete',
        description: `SEO Score: ${basicScore}%`
      });

    } catch (error) {
      console.error('SEO analysis error:', error);
      // Fall back to basic analysis only
      const basicIssues = performBasicAnalysis();
      setAnalysis({
        score: calculateScore(basicIssues),
        issues: basicIssues
      });
      
      toast({
        title: 'Partial Analysis',
        description: 'Basic SEO analysis completed. AI suggestions unavailable.',
        variant: 'default'
      });
    }

    setIsAnalyzing(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Title': return <FileText className="h-4 w-4" />;
      case 'Meta Description': return <Target className="h-4 w-4" />;
      case 'Content': return <FileText className="h-4 w-4" />;
      case 'URL': return <LinkIcon className="h-4 w-4" />;
      case 'Image': return <Image className="h-4 w-4" />;
      case 'Structure': return <Hash className="h-4 w-4" />;
      case 'Links': return <LinkIcon className="h-4 w-4" />;
      case 'Tags': return <Hash className="h-4 w-4" />;
      default: return <Search className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (type: 'error' | 'warning' | 'success') => {
    switch (type) {
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'success': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    }
  };

  return (
    <Card className="border-primary/20">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle className="text-lg">SEO Analyzer</CardTitle>
                  <CardDescription>AI-powered optimization suggestions</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {analysis && (
                  <div className="flex items-center gap-2">
                    <span className={`text-2xl font-bold ${getScoreColor(analysis.score)}`}>
                      {analysis.score}%
                    </span>
                  </div>
                )}
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-4">
            <Button 
              onClick={analyzeWithAI} 
              disabled={isAnalyzing}
              className="w-full"
              variant={analysis ? "outline" : "default"}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : analysis ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Re-analyze
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Analyze SEO
                </>
              )}
            </Button>

            {analysis && (
              <>
                {/* Score Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Overall SEO Score</span>
                    <span className={`font-medium ${getScoreColor(analysis.score)}`}>
                      {analysis.score >= 80 ? 'Good' : analysis.score >= 60 ? 'Needs Work' : 'Poor'}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${getProgressColor(analysis.score)}`}
                      style={{ width: `${analysis.score}%` }}
                    />
                  </div>
                </div>

                {/* Issues List */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Analysis Results</h4>
                  
                  {/* Errors first */}
                  {analysis.issues.filter(i => i.type === 'error').map((issue, idx) => (
                    <div key={`error-${idx}`} className="flex items-start gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                      {getStatusIcon(issue.type)}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(issue.category)}
                          <span className="text-sm font-medium">{issue.category}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{issue.message}</p>
                        {issue.suggestion && (
                          <p className="text-xs text-red-400">💡 {issue.suggestion}</p>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Warnings */}
                  {analysis.issues.filter(i => i.type === 'warning').map((issue, idx) => (
                    <div key={`warning-${idx}`} className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                      {getStatusIcon(issue.type)}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(issue.category)}
                          <span className="text-sm font-medium">{issue.category}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{issue.message}</p>
                        {issue.suggestion && (
                          <p className="text-xs text-yellow-400">💡 {issue.suggestion}</p>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Successes */}
                  {analysis.issues.filter(i => i.type === 'success').map((issue, idx) => (
                    <div key={`success-${idx}`} className="flex items-start gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                      {getStatusIcon(issue.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(issue.category)}
                          <span className="text-sm font-medium">{issue.category}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{issue.message}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Suggestions */}
                {analysis.aiSuggestions && (
                  <div className="space-y-2 pt-4 border-t">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary" />
                      AI Optimization Suggestions
                    </h4>
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 text-sm whitespace-pre-wrap">
                      {analysis.aiSuggestions}
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default SEOAnalyzer;
