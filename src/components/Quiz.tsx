import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Question } from '../utils/parseQuestions';

export default function Quiz({ questions }: { questions: Question[] }) {
  const [currentIndex, setCurrentIndex] = useState(() => {
    const saved = localStorage.getItem('quiz_progress');
    if (saved) {
      try {
        return JSON.parse(saved).currentIndex || 0;
      } catch (e) {}
    }
    return 0;
  });
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(() => {
    const saved = localStorage.getItem('quiz_progress');
    if (saved) {
      try {
        return JSON.parse(saved).score || 0;
      } catch (e) {}
    }
    return 0;
  });
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (!showResult) {
      localStorage.setItem('quiz_progress', JSON.stringify({ currentIndex, score }));
    } else {
      localStorage.removeItem('quiz_progress');
    }
  }, [currentIndex, score, showResult]);
  
  if (!questions || questions.length === 0) {
    return <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-slate-200 text-slate-500">Failed to load questions. Check console.</div>;
  }

  const question = questions[currentIndex];
  
  const handleSelect = (index: number) => {
    if (selectedOption !== null) return; 
    setSelectedOption(index);
    if (index === question.answerIndex) {
      setScore(s => s + 1);
    }
  };
  
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(c => c + 1);
      setSelectedOption(null);
    } else {
      setShowResult(true);
    }
  };
  
  const resetQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setShowResult(false);
    localStorage.removeItem('quiz_progress');
  };
  
    if (showResult) {
    return (
      <div className="max-w-2xl w-full mx-auto bg-[#0f0f12] rounded-lg border border-white/10 shadow-2xl p-8 sm:p-12 text-center flex flex-col items-center">
        <h2 className="text-3xl font-serif text-white mb-2">Assessment Completed</h2>
        <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-8">Final Results</div>
        
        <div className="text-7xl font-mono text-white mb-8 border-b border-white/10 pb-8 w-full">
          {score} <span className="text-3xl text-slate-500">/ {questions.length}</span>
        </div>
        
        <div className="w-full bg-white/5 rounded-sm h-2 mb-8 relative overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(score / questions.length) * 100}%` }}
            className={`h-full ${score / questions.length > 0.7 ? 'bg-emerald-500' : score / questions.length > 0.4 ? 'bg-amber-500' : 'bg-red-500'}`}
          />
        </div>
        
        <p className="text-sm text-slate-400 mb-10 italic max-w-md">
          {score / questions.length > 0.8 
            ? "Outstanding performance. Your mastery of systemic vectors and physiological parameters is excellent." 
            : score / questions.length > 0.5 
              ? "Satisfactory performance. A solid foundation, but further review of granular mechanisms is recommended." 
              : "Suboptimal performance. Comprehensive review of the material is required."}
        </p>
        
        <button 
          onClick={resetQuiz}
          className="flex items-center gap-2 px-8 py-3 border border-amber-500/50 text-amber-500 rounded-sm text-sm uppercase tracking-widest hover:bg-amber-500/10 transition-colors"
        >
          <RotateCcw className="w-4 h-4" /> Initialize Retake
        </button>
      </div>
    );
  }
  
  const Letters = ['A', 'B', 'C', 'D'];
  
  return (
    <div className="max-w-3xl w-full mx-auto">
      {/* Header Info */}
      <div className="flex items-center gap-4 mb-8">
        <span className="px-3 py-1 bg-white/10 rounded-full text-[11px] text-amber-500 uppercase font-bold tracking-tighter">
          Question {currentIndex + 1} of {questions.length}
        </span>
        <span className="text-slate-500 text-xs">
          Score: {score}
        </span>
      </div>
      
      {/* Progress Bar styled as a thin line */}
      <div className="w-full bg-white/5 h-[1px] mb-8 overflow-hidden">
        <motion.div 
          className="bg-amber-500 h-full"
          initial={{ width: 0 }}
          animate={{ width: `${((currentIndex) / questions.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={currentIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col"
        >
          <h2 className="text-xl sm:text-2xl font-serif text-white leading-snug mb-10">
            {question.question}
          </h2>
          
          <div className="space-y-4">
            {question.options.map((opt: string, idx: number) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === question.answerIndex;
              const showCorrectState = selectedOption !== null && isCorrect;
              const showWrongState = selectedOption !== null && isSelected && !isCorrect;
              
              let containerClasses = 'border-white/10 bg-[#16161a] hover:border-amber-500/50 hover:bg-[#1c1c22]';
              let badgeClasses = 'border-white/20 text-slate-400 group-hover:border-amber-500 group-hover:text-amber-500 bg-transparent';
              let textClasses = 'text-slate-300';
              let pointerClasses = 'cursor-pointer group';

              if (selectedOption !== null) {
                pointerClasses = 'cursor-default';
                if (showCorrectState) {
                  containerClasses = 'bg-emerald-500/10 border-emerald-500/50';
                  badgeClasses = 'bg-emerald-500 border-emerald-500 text-black';
                  textClasses = 'text-emerald-100';
                } else if (showWrongState) {
                  containerClasses = 'bg-red-500/10 border-red-500/50';
                  badgeClasses = 'bg-red-500 border-red-500 text-black';
                  textClasses = 'text-white';
                } else {
                  containerClasses = 'border-white/5 bg-[#16161a]/50 opacity-40';
                  badgeClasses = 'border-white/10 text-slate-600 bg-transparent';
                  textClasses = 'text-slate-500';
                }
              }
              
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={selectedOption !== null}
                  className={`w-full text-left p-4 sm:p-5 rounded-lg border transition-colors duration-200 flex items-start sm:items-center gap-4 ${containerClasses} ${pointerClasses}`}
                >
                  <div className={`shrink-0 w-8 h-8 flex items-center justify-center rounded text-xs font-bold border transition-colors ${badgeClasses}`}>
                    {Letters[idx]}
                  </div>
                  <div className={`flex-1 font-sans leading-relaxed text-sm sm:text-base ${textClasses}`}>
                    {opt}
                  </div>
                  {showCorrectState && <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 hidden sm:block" />}
                  {showWrongState && <XCircle className="w-5 h-5 text-red-500 shrink-0 hidden sm:block" />}
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {selectedOption !== null && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 40 }}
                className="flex items-center justify-between"
              >
                <div /> {/* Spacer */}
                <button
                  onClick={handleNext}
                  className="bg-white text-black px-8 py-3 rounded text-sm font-bold uppercase tracking-widest hover:bg-amber-500 transition-colors flex items-center gap-2"
                >
                  {currentIndex < questions.length - 1 ? 'Next Question' : 'View Results'}
                  {currentIndex < questions.length - 1 && <ArrowRight className="w-4 h-4 ml-1" />}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
