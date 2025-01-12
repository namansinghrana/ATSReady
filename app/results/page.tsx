'use client'

import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

// In a real application, you would fetch this data from your database
const getMockAnalysis = (id: string) => {
  return {
    id,
    overallScore: 75,
    categoryScores: {
      fillerWords: 80,
      strongVerbs: 70,
      weakVerbs: 75,
      verbTenses: 85,
    },
    skillsMatch: [
      { skill: 'JavaScript', score: 90 },
      { skill: 'React', score: 85 },
      { skill: 'Node.js', score: 70 },
      { skill: 'Python', score: 60 },
      { skill: 'SQL', score: 75 },
    ],
    feedback: [
      { type: 'positive', message: 'Strong use of action verbs in job descriptions.' },
      { type: 'positive', message: 'Clear and concise summary of qualifications.' },
      { type: 'negative', message: 'Lack of quantifiable achievements in work experience.' },
      { type: 'negative', message: 'Some inconsistencies in formatting throughout the resume.' },
      { type: 'suggestion', message: 'Consider adding a dedicated skills section to highlight technical abilities.' },
      { type: 'suggestion', message: 'Tailor your resume more specifically to the job description for better relevance.' },
    ],
  }
}

export default function ResultsPage({ searchParams }: { searchParams: { id: string } }) {
  const analysisId = searchParams.id

  if (!analysisId) {
    notFound()
  }

  const analysis = getMockAnalysis(analysisId)

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Resume Analysis Results</h1>
        
        <Card className="bg-gray-800 text-white mb-8">
          <CardHeader>
            <CardTitle>Overall Score</CardTitle>
            <CardDescription>Your resume's performance across all categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-4xl font-bold">{analysis.overallScore}%</span>
              <Progress value={analysis.overallScore} className="w-2/3" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 text-white mb-8">
          <CardHeader>
            <CardTitle>Category Scores</CardTitle>
            <CardDescription>Breakdown of your resume's performance by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                fillerWords: {
                  label: "Filler Words",
                  color: "hsl(var(--chart-1))",
                },
                strongVerbs: {
                  label: "Strong Verbs",
                  color: "hsl(var(--chart-2))",
                },
                weakVerbs: {
                  label: "Weak Verbs",
                  color: "hsl(var(--chart-3))",
                },
                verbTenses: {
                  label: "Verb Tenses",
                  color: "hsl(var(--chart-4))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[analysis.categoryScores]}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="fillerWords" fill="var(--color-fillerWords)" />
                  <Bar dataKey="strongVerbs" fill="var(--color-strongVerbs)" />
                  <Bar dataKey="weakVerbs" fill="var(--color-weakVerbs)" />
                  <Bar dataKey="verbTenses" fill="var(--color-verbTenses)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 text-white mb-8">
          <CardHeader>
            <CardTitle>Skills Match</CardTitle>
            <CardDescription>How well your skills align with job requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                score: {
                  label: "Match Score",
                  color: "hsl(var(--chart-4))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analysis.skillsMatch} layout="vertical">
                  <XAxis type="number" />
                  <YAxis dataKey="skill" type="category" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="score" fill="var(--color-score)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 text-white">
          <CardHeader>
            <CardTitle>Detailed Feedback</CardTitle>
            <CardDescription>Specific insights to improve your resume</CardDescription>
          </CardHeader>
          <CardContent>
            {analysis.feedback.map((item, index) => (
              <div key={index} className="mb-4 last:mb-0">
                <h3 className={`font-semibold mb-1 ${
                  item.type === 'positive' ? 'text-green-400' :
                  item.type === 'negative' ? 'text-red-400' :
                  'text-yellow-400'
                }`}>
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                </h3>
                <p>{item.message}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

