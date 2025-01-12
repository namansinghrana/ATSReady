import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// List of filler words to check
const fillerWords = ['um', 'uh', 'like', 'you know', 'so', 'actually', 'basically', 'literally', 'seriously', 'just'];

// List of strong verbs and weak verbs
const strongVerbs = ['achieved', 'improved', 'managed', 'created', 'resolved', 'developed', 'implemented', 'designed', 'launched', 'increased'];
const weakVerbs = ['helped', 'assisted', 'worked', 'handled', 'made', 'used', 'tried', 'started', 'participated', 'supported'];

// Function to analyze the resume content based on various categories
const analyzeResume = (resumeText: string) => {
  const wordCount = resumeText.split(/\s+/).length;
  const fillerWordCount = fillerWords.reduce((count, word) => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    return count + (resumeText.match(regex)?.length || 0);
  }, 0);

  const strongVerbCount = strongVerbs.reduce((count, word) => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    return count + (resumeText.match(regex)?.length || 0);
  }, 0);

  const weakVerbCount = weakVerbs.reduce((count, word) => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    return count + (resumeText.match(regex)?.length || 0);
  }, 0);

  const verbTenseIssues = (resumeText.match(/\b(is|are|was|were|be|being|been)\b/gi) || []).length;

  const fillerWordScore = Math.max(0, 100 - (fillerWordCount / wordCount) * 100);
  const strongVerbScore = Math.min(100, (strongVerbCount / wordCount) * 100);
  const weakVerbScore = Math.max(0, 100 - (weakVerbCount / wordCount) * 100);
  const verbTenseScore = Math.max(0, 100 - (verbTenseIssues / wordCount) * 100);
  const overallImpactScore = (fillerWordScore + strongVerbScore + weakVerbScore + verbTenseScore) / 4;

  return {
    id: uuidv4(),
    overallScore: overallImpactScore,
    categoryScores: {
      fillerWords: fillerWordScore,
      strongVerbs: strongVerbScore,
      weakVerbs: weakVerbScore,
      verbTenses: verbTenseScore,
    },
    analysis: `The resume contains ${fillerWordCount} filler words, ${strongVerbCount} strong verbs, ${weakVerbCount} weak verbs, and ${verbTenseIssues} verb tense issues out of ${wordCount} total words.`,
  };
};

// POST request handler
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('resume') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const resumeText = await file.text(); // Assuming the file is in a readable text format (like a PDF to text conversion)

  // Analyze the resume
  const analysisResult = analyzeResume(resumeText);
  return NextResponse.json(analysisResult);
}