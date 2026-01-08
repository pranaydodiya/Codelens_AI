import { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Send, Copy, Check, Loader2, Play, Key, Clock } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BackButton } from '@/components/ui/back-button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { sanitizeJsonInput, isValidApiKeyFormat } from '@/lib/security';
import { toast } from '@/hooks/use-toast';
import { useClipboard } from '@/hooks/useClipboard';
import { apiClient, ApiClientError } from '@/lib/api-client';

interface ApiResponse {
  status: number;
  time: string;
  data: unknown;
  error?: string;
}

const endpoints = [
  { value: 'analyze', label: 'POST /api/v1/analyze', method: 'POST' },
  { value: 'summary', label: 'POST /api/v1/summary', method: 'POST' },
  { value: 'generate', label: 'POST /api/v1/generate', method: 'POST' },
  { value: 'history', label: 'GET /api/v1/reviews/history', method: 'GET' },
];

const sampleRequest = `{
  "code": "function calculateTotal(items) {\\n  return items.reduce((sum, item) => sum + item.price, 0);\\n}",
  "language": "javascript",
  "options": {
    "checkSecurity": true,
    "checkPerformance": true,
    "suggestions": true
  }
}`;

export default function APIPlayground() {
  const [endpoint, setEndpoint] = useState('analyze');
  const [requestBody, setRequestBody] = useState(sampleRequest);
  const [apiKey, setApiKey] = useState('clk_xxxxxxxxxxxxxxxxxxxxxxxx');
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const { copied, copyToClipboard } = useClipboard();

  const handleSend = async () => {
    // Validate JSON request body for POST requests
    if (selectedEndpoint?.method === 'POST' && !sanitizeJsonInput(requestBody)) {
      toast({
        title: 'Invalid JSON',
        description: 'Please enter valid JSON in the request body',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setApiResponse(null);
    const startTime = performance.now();

    try {
      let response: unknown;
      const endpointPath = `/api/v1/${endpoint}`;

      if (selectedEndpoint?.method === 'GET') {
        response = await apiClient.get(endpointPath);
      } else {
        // Parse request body
        const body = JSON.parse(requestBody);
        response = await apiClient.post(endpointPath, body);
      }

      const endTime = performance.now();
      const responseTime = `${Math.round(endTime - startTime)}ms`;

      setApiResponse({
        status: 200,
        time: responseTime,
        data: response,
      });

      toast({
        title: 'Request Successful',
        description: `Response received in ${responseTime}`,
      });
    } catch (error) {
      const endTime = performance.now();
      const responseTime = `${Math.round(endTime - startTime)}ms`;

      if (error instanceof ApiClientError) {
        setApiResponse({
          status: error.status || 500,
          time: responseTime,
          data: null,
          error: error.message,
        });

        toast({
          title: 'Request Failed',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        setApiResponse({
          status: 500,
          time: responseTime,
          data: null,
          error: error instanceof Error ? error.message : 'Unknown error occurred',
        });

        toast({
          title: 'Request Failed',
          description: 'An unexpected error occurred',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (apiResponse) {
      const copyData = apiResponse.error 
        ? { error: apiResponse.error }
        : apiResponse.data;
      copyToClipboard(JSON.stringify(copyData, null, 2), 'Response copied to clipboard');
    }
  };

  const selectedEndpoint = endpoints.find(e => e.value === endpoint);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <BackButton to="/dashboard" />
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-info/20 flex items-center justify-center">
              <Globe className="h-5 w-5 text-info" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">API Playground</h1>
              <p className="text-muted-foreground text-sm">
                Test and explore the CodeLens API endpoints
              </p>
            </div>
          </div>
        </motion.div>

        {/* API Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-4 sm:grid-cols-4"
        >
          {[
            { label: 'API Calls Today', value: '1,234', icon: Globe },
            { label: 'Avg Response Time', value: '156ms', icon: Clock },
            { label: 'Success Rate', value: '99.8%', icon: Check },
            { label: 'Rate Limit', value: '10k/hr', icon: Key },
          ].map((stat, i) => (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-foreground">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Request Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Request
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">API Key</label>
                  <Input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your API key"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Endpoint</label>
                  <Select value={endpoint} onValueChange={setEndpoint}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {endpoints.map((ep) => (
                        <SelectItem key={ep.value} value={ep.value}>
                          <span className="flex items-center gap-2">
                            <Badge variant={ep.method === 'GET' ? 'secondary' : 'default'} className="text-[10px]">
                              {ep.method}
                            </Badge>
                            {ep.label.split(' ')[1]}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Tabs defaultValue="body">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="body">Body</TabsTrigger>
                    <TabsTrigger value="headers">Headers</TabsTrigger>
                    <TabsTrigger value="params">Params</TabsTrigger>
                  </TabsList>
                  <TabsContent value="body" className="mt-4">
                    <Textarea
                      className="min-h-[250px] font-mono text-sm"
                      value={requestBody}
                      onChange={(e) => setRequestBody(e.target.value)}
                    />
                  </TabsContent>
                  <TabsContent value="headers" className="mt-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between p-2 rounded bg-muted/50">
                        <span className="text-muted-foreground">Authorization</span>
                        <span className="font-mono">Bearer {apiKey.slice(0, 12)}...</span>
                      </div>
                      <div className="flex justify-between p-2 rounded bg-muted/50">
                        <span className="text-muted-foreground">Content-Type</span>
                        <span className="font-mono">application/json</span>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="params" className="mt-4">
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No query parameters for this endpoint
                    </p>
                  </TabsContent>
                </Tabs>
                
                <Button 
                  onClick={handleSend} 
                  className="w-full gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending Request...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Send Request
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Response Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-primary" />
                    Response
                  </CardTitle>
                  {apiResponse && (
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={
                          apiResponse.status >= 200 && apiResponse.status < 300
                            ? "bg-success/10 text-success border-success/20"
                            : "bg-destructive/10 text-destructive border-destructive/20"
                        }
                      >
                        {apiResponse.status} {apiResponse.status >= 200 && apiResponse.status < 300 ? 'OK' : 'Error'}
                      </Badge>
                      <Badge variant="outline">
                        {apiResponse.time}
                      </Badge>
                      <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2">
                        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {!apiResponse ? (
                  <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                    <div className="text-center space-y-2">
                      <Globe className="h-12 w-12 mx-auto opacity-20" />
                      <p>Response will appear here</p>
                    </div>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <ScrollArea className="h-[400px]">
                      <pre className="p-4 rounded-lg bg-muted/50 text-sm font-mono overflow-x-auto">
                        <code className={apiResponse.error ? "text-destructive" : "text-foreground"}>
                          {apiResponse.error 
                            ? JSON.stringify({ error: apiResponse.error }, null, 2)
                            : JSON.stringify(apiResponse.data, null, 2)
                          }
                        </code>
                      </pre>
                    </ScrollArea>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
