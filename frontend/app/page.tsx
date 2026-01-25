'use client';

import { useState } from 'react';

export default function Home() {
  const [selectedFrontend, setSelectedFrontend] = useState<string | null>(null);
  const [selectedBackend, setSelectedBackend] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const templateData = {
    react: { name: 'React + Vite', icon: '⚛️' },
    angular: { name: 'Angular', icon: '🅰️' },
    express: { name: 'Express.js', icon: '🚀' },
    nestjs: { name: 'NestJS', icon: '🐱' },
  };

  const handleDownload = async () => {
    if (!selectedFrontend || !selectedBackend) {
      setError('Please select both a frontend and a backend');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL||'http://localhost:8000'}/api/templates`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            templates: [selectedFrontend, selectedBackend],
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate templates');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedFrontend}-${selectedBackend}-stack.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      console.log(templateData[selectedFrontend as keyof typeof templateData].name);
      
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to download templates. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom, #f9fafb 0%, #e9ecef 100%)' }}>
      {/* Header */}
      <header
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        }}
        className="text-white py-12 text-center"
      >
        <h1 className="text-5xl font-bold m-0" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)' }}>
          🚀 Zero-Config MERN Starter
        </h1>
        <p className="text-xl mt-2 opacity-95 font-light">Download, Install, Run — Start Building Instantly!</p>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Stack Selection Section */}
        <div
          className="bg-white rounded-lg shadow-lg p-8 mb-8 border border-gray-100"
          style={{ boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)' }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Select Your Stack Combo</h2>
          <p className="text-gray-600 mb-6">
            Choose one frontend and one backend to create your perfect stack:
          </p>

          {/* Selected Combo Display */}
          {selectedFrontend && selectedBackend && (
            <div
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
              }}
              className="p-6 rounded-lg mb-6 text-white animation"
            >
              <h3 className="text-lg font-semibold text-center mb-4">🎯 Your Selected Stack</h3>
              <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4">
                <div className="bg-white rounded-lg px-4 md:px-6 py-2 flex items-center gap-2 text-gray-800 font-medium whitespace-nowrap">
                  <span className="text-2xl">{templateData[selectedFrontend as keyof typeof templateData].icon}</span>
                  <span className="hidden sm:inline text-sm md:text-base">{templateData[selectedFrontend as keyof typeof templateData].name}</span>
                </div>
                <div className="text-white text-2xl opacity-90 font-bold">+</div>
                <div className="bg-white rounded-lg px-4 md:px-6 py-2 flex items-center gap-2 text-gray-800 font-medium whitespace-nowrap">
                  <span className="text-2xl">{templateData[selectedBackend as keyof typeof templateData].icon}</span>
                  <span className="hidden sm:inline text-sm md:text-base">{templateData[selectedBackend as keyof typeof templateData].name}</span>
                </div>
              </div>
            </div>
          )}

          {/* Template Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Frontend Column */}
            <div>
              <div
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
                }}
                className="text-white text-lg font-semibold text-center p-3 rounded-lg mb-4"
              >
                ⚡ Frontend
              </div>

              {['react', 'angular'].map((frontend) => (
                <label
                  key={frontend}
                  className={`flex items-center p-5 border-2 rounded-lg cursor-pointer transition-all mb-4 ${
                    selectedFrontend === frontend
                      ? 'border-blue-500 bg-blue-50 transform scale-102'
                      : 'border-gray-200 bg-gray-50 hover:border-blue-500 hover:bg-blue-50'
                  }`}
                  style={{
                    boxShadow:
                      selectedFrontend === frontend
                        ? '0 4px 12px rgba(102, 126, 234, 0.4)'
                        : '0 4px 12px rgba(102, 126, 234, 0.15)',
                  }}
                >
                  <input
                    type="radio"
                    name="frontend"
                    value={frontend}
                    checked={selectedFrontend === frontend}
                    onChange={(e) => {
                      setSelectedFrontend(e.target.value);
                      setError(null);
                    }}
                    className="w-5 h-5 mr-4 cursor-pointer"
                    style={{ accentColor: '#667eea' }}
                  />
                  <span className="text-2xl mr-4">
                    {templateData[frontend as keyof typeof templateData].icon}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-lg">
                      {templateData[frontend as keyof typeof templateData].name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {frontend === 'react'
                        ? 'Modern React with Vite bundler and TypeScript'
                        : 'Full-featured Angular with routing'}
                    </p>
                  </div>
                </label>
              ))}
            </div>

            {/* Backend Column */}
            <div>
              <div
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
                }}
                className="text-white text-lg font-semibold text-center p-3 rounded-lg mb-4"
              >
                🔧 Backend
              </div>

              {['express', 'nestjs'].map((backend) => (
                <label
                  key={backend}
                  className={`flex items-center p-5 border-2 rounded-lg cursor-pointer transition-all mb-4 ${
                    selectedBackend === backend
                      ? 'border-blue-500 bg-blue-50 transform scale-102'
                      : 'border-gray-200 bg-gray-50 hover:border-blue-500 hover:bg-blue-50'
                  }`}
                  style={{
                    boxShadow:
                      selectedBackend === backend
                        ? '0 4px 12px rgba(102, 126, 234, 0.4)'
                        : '0 4px 12px rgba(102, 126, 234, 0.15)',
                  }}
                >
                  <input
                    type="radio"
                    name="backend"
                    value={backend}
                    checked={selectedBackend === backend}
                    onChange={(e) => {
                      setSelectedBackend(e.target.value);
                      setError(null);
                    }}
                    className="w-5 h-5 mr-4 cursor-pointer"
                    style={{ accentColor: '#667eea' }}
                  />
                  <span className="text-2xl mr-4">
                    {templateData[backend as keyof typeof templateData].icon}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-lg">
                      {templateData[backend as keyof typeof templateData].name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {backend === 'express'
                        ? 'RESTful API with Express.js and TypeScript and Mongoose'
                        : 'Enterprise NestJS with Postgres SQL and Prisma ORM'}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Instructions Section */}
        <div
          className="bg-white rounded-lg shadow-lg p-8 mb-8 border border-gray-100"
          style={{ boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)' }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">How To Use</h2>

          <div
            style={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              boxShadow: '0 4px 16px rgba(245, 87, 108, 0.3)',
              borderLeft: '5px solid #c0392b',
            }}
            className="text-white p-6 rounded-lg mb-6"
          >
            <h3 className="text-xl font-bold mb-4">🚨 IMPORTANT: Windows Users - Do This FIRST!</h3>
            <ol className="space-y-2 ml-4">
              <li>1. After download, <strong>DO NOT extract yet</strong></li>
              <li>2. <strong>Right-click the ZIP file</strong> → Select "Properties"</li>
              <li>3. At the bottom, check the box: <strong>"Unblock"</strong></li>
              <li>4. Click <strong>"Apply"</strong> then <strong>"OK"</strong></li>
              <li>5. NOW you can extract without any warnings!</li>
            </ol>
            <p className="mt-4 text-sm">⚡ This unblocks ALL files at once (.gitignore, .editorconfig, etc.)</p>
          </div>

          <p className="text-gray-600 font-semibold mb-4">Installation steps:</p>
          <pre className="bg-gray-100 p-6 rounded-lg overflow-x-auto border border-gray-300 font-mono text-sm">
            {`1. Select one frontend framework (React or Angular)
2. Select one backend framework (Express.js or NestJS)
3. Click "Download Stack"
4. UNBLOCK THE ZIP FILE FIRST (see above)
5. Extract the ZIP file
6. For each template folder, run:
   cd [template-name]
   npm install
   npm run dev
7. Start building your full-stack project instantly!`}
          </pre>
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 text-center border border-red-400"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* Download Button */}
        <button
          onClick={handleDownload}
          disabled={loading}
          style={{
            background: loading
              ? '#95a5a6'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: loading ? 'none' : '0 4px 16px rgba(102, 126, 234, 0.4)',
          }}
          className="block w-full max-w-xs mx-auto px-8 py-4 text-xl font-bold text-white rounded-lg border-0 cursor-pointer transition-all duration-300"
        >
          {loading ? 'Generating...' : 'Download Stack'}
        </button>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-600">
        <p>🚀 Build your project faster. Zero config. Zero headaches. Just code.</p>
      </footer>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animation {
          animation: slideDown 0.4s ease;
        }

        button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 24px rgba(102, 126, 234, 0.6) !important;
        }
      `}</style>
    </div>
  );
}