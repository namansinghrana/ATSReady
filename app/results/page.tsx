'use client'

import { notFound } from 'next/navigation'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

interface SearchParams {
  id: string;
}

interface ResultsPageProps {
  searchParams?: Record<string, string | string[]> | undefined;
}

export default function ResultsPage({ searchParams }: ResultsPageProps) {
  if (!searchParams) {
    return <div>No query parameters provided.</div>
  }

  const analysisId = Array.isArray(searchParams.id) ? searchParams.id[0] : searchParams.id
  const [analysis, setAnalysis] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!analysisId) {
      return
    }

    const fetchAnalysis = async () => {
      try {
        const response = await fetch(`/api/analyze-resume?id=${analysisId}`)
        if (response.ok) {
          const data = await response.json()
          setAnalysis(data)
        } else {
          notFound()
        }
      } catch (error) {
        console.error('Error fetching analysis:', error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    fetchAnalysis()
  }, [analysisId])

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12 px-4 sm:px-6 lg:px-8">Loading...</div>
  }

  if (!analysis) {
    return null
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  }

  const categoryScoresData = Object.entries(analysis.categoryScores).map(([key, value]) => ({
    name: key,
    score: value
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600" variants={itemVariants}>
          Resume Analysis Results
        </motion.h1>
        
        <motion.div variants={itemVariants}>
          <Card className="bg-gray-800 text-white mb-8 overflow-hidden">
            <CardHeader>
              <CardTitle>Overall Score</CardTitle>
              <CardDescription>Your resume's performance across all categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                  {analysis.overallScore.toFixed(2)}%
                </span>
                <Progress value={analysis.overallScore} className="w-2/3" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-gray-800 text-white mb-8 overflow-hidden">
            <CardHeader>
              <CardTitle>Category Scores</CardTitle>
              <CardDescription>Breakdown of your resume's performance by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryScoresData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="score" fill="#60a5fa" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-gray-800 text-white overflow-hidden">
            <CardHeader>
              <CardTitle>Detailed Analysis</CardTitle>
              <CardDescription>Specific insights about your resume</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg">{analysis.analysis}</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}

