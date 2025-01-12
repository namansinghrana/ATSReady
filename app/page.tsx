import ResumeUploadForm from './components/ResumeUploadForm'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="w-full max-w-2xl">
        <h1 className="text-5xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          ATSReady
        </h1>
        <p className="text-xl mb-12 text-center text-gray-300">
          Optimize your resume with AI-powered insights
        </p>
        <ResumeUploadForm />
      </div>
    </main>
  )
}

