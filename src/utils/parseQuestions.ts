export interface Question {
  id: number;
  question: string;
  options: string[];
  answerIndex: number;
}

export function parseQuestions(rawText: string): Question[] {
  const text = rawText.replace(/\r\n/g, '\n');
  const ansSection = text.match(/Answer Key:[\s\S]*/i)?.[0] || '';
  const ansMap: Record<string, string> = {};
  for (const match of ansSection.matchAll(/(\d+)-\s*([A-D])/g)) {
    ansMap[match[1]] = match[2];
  }

  const cleanedText = text.replace(/Answer Key:[\s\S]*/i, '').trim();
  const parts = ('\n' + cleanedText).split(/(?=\n\d+\.\s+)/);

  const questions: Question[] = [];
  parts.forEach(part => {
    if (!part.trim()) return;
    const match = part.match(/^\n?(\d+)\.\s+([\s\S]*?)\s+A\)\s+([\s\S]*?)\s+B\)\s+([\s\S]*?)\s+C\)\s+([\s\S]*?)\s+D\)\s+([\s\S]*?)$/i);
    if (match) {
      const id = match[1];
      questions.push({
        id: parseInt(id),
        question: match[2].trim().replace(/\s+/g, ' '),
        options: [
           match[3].trim().replace(/\s+/g, ' '),
           match[4].trim().replace(/\s+/g, ' '),
           match[5].trim().replace(/\s+/g, ' '),
           match[6].trim().replace(/\s+/g, ' ')
        ],
        answerIndex: ansMap[id] === 'A' ? 0 : ansMap[id] === 'B' ? 1 : ansMap[id] === 'C' ? 2 : ansMap[id] === 'D' ? 3 : -1
      });
    } else {
      console.warn('Failed to parse question block:', part.substring(0, 50));
    }
  });
  
  return questions;
}
