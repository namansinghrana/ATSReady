'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ResumeUploadForm() {
  const [file, setFile] = useState<File | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) return

    const formData = new FormData()
    formData.append('resume', file)

    try {
      const response = await fetch('/api/analyze-resume', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        router.push(`/results?id=${result.id}`)
      } else {
        console.error('Failed to upload file')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="resume" className="block text-sm font-medium text-gray-300">
          Upload your resume (PDF or DOCX)
        </label>
        <input
          type="file"
          id="resume"
          name="resume"
          accept=".pdf,.docx"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mt-1 block w-full text-sm text-gray-300
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-gray-700 file:text-gray-300
                    hover:file:bg-gray-600"
        />
      </div>
      <button
        type="submit"
        disabled={!file}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        Analyze Resume
      </button>
    </form>
  )
}

