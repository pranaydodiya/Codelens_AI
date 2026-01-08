/**
 * AI Service Layer - Core AI functionality
 */

import { generateText, generateStructuredJSON, type GeminiConfig } from '../gemini';

export interface CodeSummaryRequest {
  code: string;
  language?: string;
}

export interface CodeSummaryResponse {
  title: string;
  overview: string;
  keyComponents: string[];
  complexity: 'Low' | 'Medium' | 'High';
  linesOfCode: number;
  functions: number;
  dependencies: string[];
  securityNotes: string[];
}

export interface CodeGenerationRequest {
  prompt: string;
  template: 'hook' | 'component' | 'api' | 'util' | 'test';
  language: 'typescript' | 'javascript' | 'python' | 'go';
}

export interface CodeAnalysisRequest {
  code: string;
  language?: string;
  options: {
    checkSecurity?: boolean;
    checkPerformance?: boolean;
    suggestions?: boolean;
  };
}

export interface CodeIssue {
  severity: 'error' | 'warning' | 'suggestion' | 'info';
  message: string;
  line?: number;
  file?: string;
  suggestion?: string;
}

export interface CodeAnalysisResponse {
  score: number;
  summary: string;
  issues: CodeIssue[];
  suggestions: string[];
}

/**
 * Generate code summary using AI
 */
export async function generateCodeSummary(
  request: CodeSummaryRequest
): Promise<CodeSummaryResponse> {
  const { code, language = 'typescript' } = request;

  const prompt = `Analyze the following ${language} code and provide a comprehensive summary.

Code:
\`\`\`${language}
${code}
\`\`\`

Provide a detailed analysis including:
1. A descriptive title
2. An overview of what the code does
3. Key components and their purposes
4. Complexity assessment (Low, Medium, or High)
5. Approximate lines of code
6. Number of functions/methods
7. Dependencies used
8. Security considerations and best practices

Return the response as JSON with this structure:
{
  "title": "string",
  "overview": "string",
  "keyComponents": ["string"],
  "complexity": "Low" | "Medium" | "High",
  "linesOfCode": number,
  "functions": number,
  "dependencies": ["string"],
  "securityNotes": ["string"]
}`;

  const schema = `{
  "title": "string",
  "overview": "string",
  "keyComponents": ["string"],
  "complexity": "Low" | "Medium" | "High",
  "linesOfCode": number,
  "functions": number,
  "dependencies": ["string"],
  "securityNotes": ["string"]
}`;

  const config: GeminiConfig = {
    temperature: 0.3,
    maxOutputTokens: 2048,
  };

  const result = await generateStructuredJSON(prompt, schema, config) as CodeSummaryResponse;
  
  // Validate and ensure all fields are present
  return {
    title: result.title || 'Code Summary',
    overview: result.overview || 'No overview available',
    keyComponents: Array.isArray(result.keyComponents) ? result.keyComponents : [],
    complexity: result.complexity || 'Medium',
    linesOfCode: result.linesOfCode || 0,
    functions: result.functions || 0,
    dependencies: Array.isArray(result.dependencies) ? result.dependencies : [],
    securityNotes: Array.isArray(result.securityNotes) ? result.securityNotes : [],
  };
}

/**
 * Generate code from natural language prompt
 */
export async function generateCode(
  request: CodeGenerationRequest
): Promise<string> {
  const { prompt, template, language } = request;

  const templateInstructions: Record<CodeGenerationRequest['template'], string> = {
    hook: 'Create a custom React hook',
    component: 'Create a React component',
    api: 'Create an API route handler',
    util: 'Create a utility function',
    test: 'Create a unit test',
  };

  const languageInstructions: Record<CodeGenerationRequest['language'], string> = {
    typescript: 'Use TypeScript with proper type annotations',
    javascript: 'Use modern JavaScript (ES6+)',
    python: 'Use Python 3 with type hints',
    go: 'Use Go with proper error handling',
  };

  const systemPrompt = `You are an expert ${language} developer. ${templateInstructions[template]} using ${languageInstructions[language]}.

Requirements:
- Production-ready code
- Proper error handling
- Type safety (if applicable)
- Clean, readable code
- Follow best practices
- Include comments where helpful

User Request: ${prompt}

Generate only the code, no explanations or markdown formatting.`;

  const config: GeminiConfig = {
    temperature: 0.7,
    maxOutputTokens: 4096,
  };

  const response = await generateText(systemPrompt, config);
  
  // Clean up the response (remove markdown code blocks if present)
  let code = response.text.trim();
  if (code.startsWith('```')) {
    const lines = code.split('\n');
    const startIndex = lines.findIndex(line => line.includes('```'));
    const endIndex = lines.findIndex((line, idx) => idx > startIndex && line.includes('```'));
    code = lines.slice(startIndex + 1, endIndex).join('\n');
  }

  return code;
}

/**
 * Analyze code for issues, security, and performance
 */
export async function analyzeCode(
  request: CodeAnalysisRequest
): Promise<CodeAnalysisResponse> {
  const { code, language = 'typescript', options } = request;

  const analysisAreas: string[] = [];
  if (options.checkSecurity) analysisAreas.push('security vulnerabilities');
  if (options.checkPerformance) analysisAreas.push('performance issues');
  if (options.suggestions) analysisAreas.push('code improvements');

  const prompt = `Analyze the following ${language} code for ${analysisAreas.join(', ')}.

Code:
\`\`\`${language}
${code}
\`\`\`

Provide a comprehensive code review including:
1. A quality score (0-100)
2. A summary of the overall code quality
3. Specific issues found (categorized by severity: error, warning, suggestion, info)
4. Actionable suggestions for improvement

For each issue, provide:
- Severity level
- Clear description
- Line number (if applicable)
- Suggested fix (if applicable)

Return the response as JSON with this structure:
{
  "score": number,
  "summary": "string",
  "issues": [
    {
      "severity": "error" | "warning" | "suggestion" | "info",
      "message": "string",
      "line": number (optional),
      "file": "string" (optional),
      "suggestion": "string" (optional)
    }
  ],
  "suggestions": ["string"]
}`;

  const schema = `{
  "score": number,
  "summary": "string",
  "issues": [
    {
      "severity": "error" | "warning" | "suggestion" | "info",
      "message": "string",
      "line": number,
      "file": "string",
      "suggestion": "string"
    }
  ],
  "suggestions": ["string"]
}`;

  const config: GeminiConfig = {
    temperature: 0.2, // Lower temperature for more consistent analysis
    maxOutputTokens: 4096,
  };

  const result = await generateStructuredJSON(prompt, schema, config) as CodeAnalysisResponse;

  // Validate and ensure all fields are present
  return {
    score: Math.max(0, Math.min(100, result.score || 75)),
    summary: result.summary || 'Code analysis completed',
    issues: Array.isArray(result.issues) ? result.issues : [],
    suggestions: Array.isArray(result.suggestions) ? result.suggestions : [],
  };
}

export default {
  generateCodeSummary,
  generateCode,
  analyzeCode,
};

