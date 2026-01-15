import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Target, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface KeywordDensityAnalyzerProps {
  content: string;
  title: string;
  excerpt: string;
}

interface KeywordAnalysis {
  keyword: string;
  count: number;
  density: number;
  inTitle: boolean;
  inExcerpt: boolean;
  inFirstParagraph: boolean;
  locations: number[];
}

const KeywordDensityAnalyzer = ({ content, title, excerpt }: KeywordDensityAnalyzerProps) => {
  const [targetKeywords, setTargetKeywords] = useState('');
  const [isOpen, setIsOpen] = useState(true);

  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  const getFirstParagraph = (html: string) => {
    const match = html.match(/<p[^>]*>(.*?)<\/p>/i);
    if (match) {
      return stripHtml(match[0]);
    }
    const plainText = stripHtml(html);
    return plainText.split('\n')[0] || plainText.substring(0, 200);
  };

  const analysis = useMemo(() => {
    const plainContent = stripHtml(content).toLowerCase();
    const words = plainContent.split(/\s+/).filter(w => w.length > 0);
    const totalWords = words.length;
    const firstParagraph = getFirstParagraph(content).toLowerCase();

    const keywords = targetKeywords
      .split(',')
      .map(k => k.trim().toLowerCase())
      .filter(k => k.length > 0);

    const results: KeywordAnalysis[] = keywords.map(keyword => {
      const regex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      const matches = plainContent.match(regex) || [];
      const count = matches.length;
      const density = totalWords > 0 ? (count / totalWords) * 100 : 0;

      // Find locations (word positions)
      const locations: number[] = [];
      let wordIndex = 0;
      for (const word of words) {
        if (word.includes(keyword)) {
          locations.push(wordIndex);
        }
        wordIndex++;
      }

      return {
        keyword,
        count,
        density,
        inTitle: title.toLowerCase().includes(keyword),
        inExcerpt: excerpt.toLowerCase().includes(keyword),
        inFirstParagraph: firstParagraph.includes(keyword),
        locations
      };
    });

    return {
      totalWords,
      keywords: results
    };
  }, [content, title, excerpt, targetKeywords]);

  const getDensityStatus = (density: number) => {
    if (density === 0) return { status: 'missing', color: 'text-red-500', bg: 'bg-red-500' };
    if (density < 0.5) return { status: 'low', color: 'text-yellow-500', bg: 'bg-yellow-500' };
    if (density <= 2.5) return { status: 'optimal', color: 'text-green-500', bg: 'bg-green-500' };
    return { status: 'high', color: 'text-orange-500', bg: 'bg-orange-500' };
  };

  const getOverallScore = () => {
    if (analysis.keywords.length === 0) return 0;
    
    let score = 0;
    for (const kw of analysis.keywords) {
      const densityStatus = getDensityStatus(kw.density);
      if (densityStatus.status === 'optimal') score += 40;
      else if (densityStatus.status === 'low') score += 20;
      else if (densityStatus.status === 'high') score += 15;
      
      if (kw.inTitle) score += 20;
      if (kw.inExcerpt) score += 15;
      if (kw.inFirstParagraph) score += 25;
    }
    
    return Math.min(100, Math.round(score / analysis.keywords.length));
  };

  return (
    <Card className="border-primary/20">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle className="text-lg">Keyword Density</CardTitle>
                  <CardDescription>Track keyword usage and placement</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {analysis.keywords.length > 0 && (
                  <span className={`text-2xl font-bold ${
                    getOverallScore() >= 70 ? 'text-green-500' : 
                    getOverallScore() >= 40 ? 'text-yellow-500' : 'text-red-500'
                  }`}>
                    {getOverallScore()}%
                  </span>
                )}
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Keywords</label>
              <Input
                placeholder="Enter keywords separated by commas (e.g., SEO, digital marketing, content strategy)"
                value={targetKeywords}
                onChange={(e) => setTargetKeywords(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Total words in content: {analysis.totalWords}
              </p>
            </div>

            {analysis.keywords.length > 0 && (
              <div className="space-y-4">
                {analysis.keywords.map((kw, idx) => {
                  const status = getDensityStatus(kw.density);
                  return (
                    <div key={idx} className="p-4 rounded-lg bg-muted/50 border space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono">
                            {kw.keyword}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {kw.count} occurrence{kw.count !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${status.color}`}>
                            {kw.density.toFixed(2)}%
                          </span>
                          <Badge 
                            variant={status.status === 'optimal' ? 'default' : 'secondary'}
                            className={status.status === 'optimal' ? 'bg-green-500' : ''}
                          >
                            {status.status}
                          </Badge>
                        </div>
                      </div>

                      {/* Density bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Density</span>
                          <span>Optimal: 1-2.5%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all ${status.bg}`}
                            style={{ width: `${Math.min(100, kw.density * 20)}%` }}
                          />
                        </div>
                      </div>

                      {/* Placement checks */}
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className={`flex items-center gap-1 ${kw.inTitle ? 'text-green-500' : 'text-muted-foreground'}`}>
                          {kw.inTitle ? <CheckCircle2 className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                          <span>In Title</span>
                        </div>
                        <div className={`flex items-center gap-1 ${kw.inExcerpt ? 'text-green-500' : 'text-muted-foreground'}`}>
                          {kw.inExcerpt ? <CheckCircle2 className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                          <span>In Excerpt</span>
                        </div>
                        <div className={`flex items-center gap-1 ${kw.inFirstParagraph ? 'text-green-500' : 'text-muted-foreground'}`}>
                          {kw.inFirstParagraph ? <CheckCircle2 className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                          <span>In First ¶</span>
                        </div>
                      </div>

                      {/* Distribution visualization */}
                      {kw.locations.length > 0 && analysis.totalWords > 0 && (
                        <div className="space-y-1">
                          <span className="text-xs text-muted-foreground">Distribution in content</span>
                          <div className="h-3 bg-muted rounded relative">
                            {kw.locations.map((loc, i) => (
                              <div
                                key={i}
                                className="absolute top-0 h-full w-1 bg-primary rounded"
                                style={{ left: `${(loc / analysis.totalWords) * 100}%` }}
                              />
                            ))}
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Start</span>
                            <span>End</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Recommendations */}
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <h4 className="font-medium text-sm mb-2">Recommendations</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {analysis.keywords.some(k => k.density < 0.5) && (
                      <li>• Consider adding more instances of low-density keywords naturally</li>
                    )}
                    {analysis.keywords.some(k => k.density > 2.5) && (
                      <li>• Reduce keyword stuffing - some keywords appear too frequently</li>
                    )}
                    {analysis.keywords.some(k => !k.inTitle) && (
                      <li>• Include target keywords in your title for better SEO</li>
                    )}
                    {analysis.keywords.some(k => !k.inFirstParagraph) && (
                      <li>• Add keywords to the first paragraph for early placement</li>
                    )}
                    {analysis.keywords.every(k => k.density >= 0.5 && k.density <= 2.5 && k.inTitle && k.inFirstParagraph) && (
                      <li className="text-green-500">✓ Great job! Keyword placement looks optimal</li>
                    )}
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default KeywordDensityAnalyzer;
