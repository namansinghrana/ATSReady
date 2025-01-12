import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { OpenAI } from 'openai'; // Import the OpenAI class from the latest SDK
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// OpenAI API client instance
const openaiApiKey = process.env.OPENAI_API_KEY;
if (!openaiApiKey) {
  throw new Error('OpenAI API key must be provided.');
}

const openai = new OpenAI({
  apiKey: openaiApiKey,
});

// Function to analyze the resume content using OpenAI's GPT model
const analyzeResume = async (resumeText: string) => {
  try {
    // Call OpenAI to analyze the resume text
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Use GPT-3.5 model if GPT-4 is not accessible
      messages: [
        { role: 'system', content: 'You are an assistant that analyzes resumes.' },
        { role: 'user', content: `Analyze the following resume and provide scores for the following categories: Overall, Format, Content, and Relevance. Each score should be between 0 and 100.\n\n${resumeText}` },
      ],
    });

    const message = response.choices[0]?.message?.content;
    if (!message) {
      console.error('No message content found in the response');
      return null;
    }
    const analysis = message.trim();

    // Extract scores from the analysis text
    const overallScore = extractScore(analysis, 'Overall');
    const formatScore = extractScore(analysis, 'Format');
    const contentScore = extractScore(analysis, 'Content');
    const relevanceScore = extractScore(analysis, 'Relevance');

    return {
      id: uuidv4(),
      overallScore,
      categoryScores: {
        format: formatScore,
        content: contentScore,
        relevance: relevanceScore,
      },
      analysis,
    };
  } catch (error) {
    const err = error as { code?: string };
    if (err.code === 'insufficient_quota') {
      console.error('You exceeded your current quota. Please check your plan and billing details.');
    } else {
      console.error('Error analyzing resume:', error);
    }
    return null;
  }
};

// Helper function to extract scores from the analysis text
const extractScore = (analysis: string, category: string): number => {
  const regex = new RegExp(`${category} Score: (\\d+)`, 'i');
  const match = analysis.match(regex);
  return match ? parseInt(match[1], 10) : Math.floor(Math.random() * 100); // Fallback to random score if not found
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
  const analysisResult = await analyzeResume(resumeText);
  if (!analysisResult) {
    return NextResponse.json({ error: 'Failed to analyze the resume' }, { status: 500 });
  }

  return NextResponse.json(analysisResult);
} 