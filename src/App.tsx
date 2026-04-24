import { useState, useMemo, useEffect } from 'react';
import Quiz from './components/Quiz';
import rawText from './data/raw.txt?raw';
import { parseQuestions } from './utils/parseQuestions';

export default function App() {
  const [started, setStarted] = useState(false);
  const [hasSavedProgress, setHasSavedProgress] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('quiz_progress')) {
      setHasSavedProgress(true);
    }
  }, []);

  const questions = useMemo(() => parseQuestions(rawText), []);

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-slate-200 flex flex-col font-sans overflow-hidden selection:bg-amber-500/30">
      {/* Top Navbar mockup for aesthetic */}
      <nav className="h-20 border-b border-white/10 flex items-center justify-between px-6 sm:px-10 bg-[#0f0f12] shrink-0">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-[0.2em] text-amber-500 font-bold italic">Section II: Cell Physiology</span>
          <h1 className="text-lg sm:text-xl font-serif text-white">Medical Assessment System v4.0</h1>
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto flex items-center justify-center py-12 px-4 sm:px-6">
        {!started ? (
          <div className="max-w-2xl w-full bg-[#0f0f12] border border-white/10 rounded-lg p-8 sm:p-12 text-center space-y-8 shadow-2xl">
            <h2 className="text-3xl sm:text-4xl font-serif text-white tracking-tight">Physiology Mastery Quiz</h2>
            <p className="text-slate-400 text-base sm:text-lg max-w-lg mx-auto leading-relaxed italic">
              Test your knowledge of cell physiology, autonomic nervous systems, transport mechanisms, and fluid dynamics. Note: High difficulty inference questions require multi-stage physiological calculation.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 py-6">
              <span className="px-4 py-2 border border-white/10 bg-white/5 rounded-sm text-[11px] uppercase tracking-widest text-slate-300">
                {questions.length} Questions
              </span>
              <span className="px-4 py-2 border border-white/10 bg-white/5 rounded-sm text-[11px] uppercase tracking-widest text-slate-300">
                Multiple Choice
              </span>
              <span className="px-4 py-2 border border-amber-500/30 bg-amber-500/10 rounded-sm text-[11px] uppercase tracking-widest text-amber-500 font-bold">
                Instant Feedback
              </span>
            </div>

            <button 
              onClick={() => setStarted(true)}
              className="w-full sm:w-auto bg-white text-black px-10 py-4 rounded text-sm font-bold uppercase tracking-widest hover:bg-amber-500 transition-colors shadow-lg"
            >
              {hasSavedProgress ? 'Resume Challenge' : 'Start Challenge'}
            </button>
          </div>
        ) : (
          <Quiz questions={questions} />
        )}
      </main>
      
      {/* Footer for aesthetic */}
      <footer className="h-12 bg-[#0a0a0b] border-t border-white/10 px-6 sm:px-10 flex items-center justify-between text-[10px] text-slate-500 shrink-0">
        <div className="flex gap-6 uppercase tracking-widest">
          <span className="hidden sm:inline">Session ID: 8829-PX-01</span>
          <span>Status: Secure / Encrypted</span>
        </div>
      </footer>
    </div>
  );
}
