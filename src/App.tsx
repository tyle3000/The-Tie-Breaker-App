import { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from "motion/react";
import { 
  Scale, 
  Columns, 
  Target, 
  Loader2, 
  Sparkles, 
  ArrowRight,
  CheckCircle2,
  XCircle,
  Info,
  ChevronRight,
  RefreshCw
} from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from './lib/utils';

type AnalysisType = 'pros-cons' | 'comparison' | 'swot';

interface AnalysisOption {
  id: AnalysisType;
  label: string;
  description: string;
  icon: typeof Scale;
}

const ANALYSIS_OPTIONS: AnalysisOption[] = [
  { 
    id: 'pros-cons', 
    label: 'Pros & Cons', 
    description: 'A balanced look at the advantages and disadvantages.',
    icon: Scale 
  },
  { 
    id: 'comparison', 
    label: 'Comparison Table', 
    description: 'Compare multiple options side-by-side.',
    icon: Columns 
  },
  { 
    id: 'swot', 
    label: 'SWOT Analysis', 
    description: 'Strengths, Weaknesses, Opportunities, and Threats.',
    icon: Target 
  },
];

const EXAMPLES = [
  "Should I switch to a remote job?",
  "Should I buy a house or keep renting?",
  "Should I learn Python or JavaScript first?",
  "Should I start a side hustle or focus on my current career?"
];

export default function App() {
  const [decision, setDecision] = useState('');
  const [analysisType, setAnalysisType] = useState<AnalysisType>('pros-cons');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateAnalysis = async () => {
    if (!decision.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = "gemini-3-flash-preview";
      
      let prompt = "";
      if (analysisType === 'pros-cons') {
        prompt = `Analyze the following decision: "${decision}". Provide a detailed list of Pros and Cons. Use markdown formatting with clear headings and bullet points. Include a brief "Final Verdict" or summary at the end.`;
      } else if (analysisType === 'comparison') {
        prompt = `Analyze the following decision: "${decision}". Create a comparison table if there are multiple options involved, or a structured comparison of the current state vs. the potential future state. Use markdown tables. Include a summary of key differences.`;
      } else if (analysisType === 'swot') {
        prompt = `Perform a SWOT analysis for the following decision: "${decision}". Break it down into Strengths, Weaknesses, Opportunities, and Threats. Use markdown formatting with clear sections. Provide strategic advice based on the SWOT.`;
      }

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });

      setResult(response.text || "No analysis generated.");
    } catch (err) {
      console.error(err);
      setError("Failed to generate analysis. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-display font-bold tracking-tight text-slate-900">
              The Tiebreaker
            </h1>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-sm text-slate-500">
            <span>AI-Powered Decision Assistant</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Input Section */}
          <div className="lg:col-span-5 space-y-8">
            <section className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-2xl font-display font-bold text-slate-900">
                  What's on your mind?
                </h2>
                <p className="text-slate-500">
                  Describe the decision you're trying to make.
                </p>
              </div>

              <div className="relative">
                <textarea
                  value={decision}
                  onChange={(e) => setDecision(e.target.value)}
                  placeholder="e.g., Should I move to a new city for a job?"
                  className="w-full h-40 p-4 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none text-slate-700 placeholder:text-slate-400"
                />
                <div className="absolute bottom-3 right-3 text-xs text-slate-400">
                  {decision.length} characters
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {EXAMPLES.map((ex) => (
                  <button
                    key={ex}
                    onClick={() => setDecision(ex)}
                    className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-full transition-colors"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-lg font-display font-semibold text-slate-900">
                  Choose Analysis Type
                </h3>
                <p className="text-sm text-slate-500">
                  Select how you want the AI to evaluate your decision.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {ANALYSIS_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  const isActive = analysisType === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() => setAnalysisType(option.id)}
                      className={cn(
                        "flex items-start gap-4 p-4 rounded-xl border transition-all text-left group",
                        isActive 
                          ? "bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200" 
                          : "bg-white border-slate-200 hover:border-indigo-200 hover:bg-slate-50"
                      )}
                    >
                      <div className={cn(
                        "p-2 rounded-lg shrink-0 transition-colors",
                        isActive ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600"
                      )}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className={cn(
                          "font-semibold text-sm",
                          isActive ? "text-indigo-900" : "text-slate-900"
                        )}>
                          {option.label}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {option.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            <button
              onClick={generateAnalysis}
              disabled={loading || !decision.trim()}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Analysis
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {!result && !loading && !error && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-white border border-dashed border-slate-300 rounded-2xl"
                >
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <Info className="w-8 h-8 text-slate-300" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-slate-900 mb-2">
                    Ready to help you decide
                  </h3>
                  <p className="text-slate-500 max-w-xs">
                    Enter your decision details and choose an analysis type to get started.
                  </p>
                </motion.div>
              )}

              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 bg-white border border-slate-200 rounded-2xl"
                >
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-indigo-600 animate-pulse" />
                    </div>
                  </div>
                  <p className="mt-6 text-lg font-medium text-slate-900">
                    Consulting the AI...
                  </p>
                  <p className="text-slate-500 text-sm mt-2">
                    We're weighing the options for you.
                  </p>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-4"
                >
                  <XCircle className="w-6 h-6 text-red-500 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-red-900">Something went wrong</h4>
                    <p className="text-red-700 text-sm mt-1">{error}</p>
                    <button 
                      onClick={generateAnalysis}
                      className="mt-4 text-sm font-semibold text-red-900 hover:underline flex items-center gap-1"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Try again
                    </button>
                  </div>
                </motion.div>
              )}

              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
                >
                  <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-slate-900">Analysis Result</span>
                    </div>
                    <button 
                      onClick={() => setResult(null)}
                      className="text-xs text-slate-500 hover:text-indigo-600 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="p-6 md:p-8 prose prose-slate max-w-none prose-headings:font-display prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-table:border prose-table:border-slate-200 prose-th:bg-slate-50 prose-th:p-3 prose-td:p-3">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-4 py-8 border-t border-slate-200 mt-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>© 2026 The Tiebreaker. Built with Google Gemini.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Feedback</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
