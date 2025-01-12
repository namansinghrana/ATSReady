import ResumeUploadForm from './components/ResumeUploadForm'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-8">Resume Analyzer</h1>
      <ResumeUploadForm />
    </main>
  )
}

