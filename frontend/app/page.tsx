'use client';

import { useState } from 'react';

type TemplateType = 'frontend' | 'backend' | 'standalone';

interface BaseTemplate {
  name: string;
  fullName: string;
  icon: string;
  type: TemplateType;
  port: number;
  description: string;
  technologies: string;
}

interface FrontendTemplate extends BaseTemplate {
  type: 'frontend';
  version: string;
}

interface BackendTemplate extends BaseTemplate {
  type: 'backend';
  database: string;
  orm: string;
}

interface StandaloneTemplate extends BaseTemplate {
  type: 'standalone';
  version: string;
}

type Template = FrontendTemplate | BackendTemplate | StandaloneTemplate;

export default function Home() {
  const [selectedFrontend, setSelectedFrontend] = useState<string | null>(null);
  const [selectedBackend, setSelectedBackend] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const templateData: Record<string, Template> = {
    react: {
      name: 'React',
      fullName: 'React + Vite',
      icon: '⚛️',
      type: 'frontend',
      version: 'v19',
      port: 5173,
      description: 'Auth context, Protected routes, Token refresh',
      technologies: 'React 19, Vite 7.2, React Router v6, TypeScript 5.9, Tailwind CSS',
    },
    angular: {
      name: 'Angular',
      fullName: 'Angular + SSR',
      icon: '🅰️',
      type: 'frontend',
      version: 'v21',
      port: 4200,
      description: 'Auth guards, Signals, Tailwind CSS 4',
      technologies: 'Angular 21, SSR, Signals, Tailwind CSS 4.x, Vitest, RxJS',
    },
    vue: {
      name: 'Vue.js',
      fullName: 'Vue.js + Vite',
      icon: '💚',
      type: 'frontend',
      version: 'v3',
      port: 5173,
      description: 'Pinia store, Composition API, Oxlint',
      technologies: 'Vue 3.5, Pinia 3.0, Vue Router 4.6, Vite 7.3, Oxlint, Tailwind CSS',
    },
    nextjs: {
      name: 'Next.js',
      fullName: 'Next.js App Router',
      icon: '▲',
      type: 'standalone',
      version: 'v15',
      port: 3000,
      description: 'SQLite auth, Server Actions, Full CRUD',
      technologies: 'Next.js 15, SQLite, Server Actions, Tailwind CSS 4',
    },
    express: {
      name: 'Express',
      fullName: 'Express.js',
      icon: '🚀',
      type: 'backend',
      database: 'MongoDB',
      orm: 'Mongoose',
      port: 5000,
      description: 'In-memory fallback, Auto-migration',
      technologies: 'Express 4.18, Mongoose 7, mongodb-memory-server, JWT, bcrypt',
    },
    nestjs: {
      name: 'NestJS',
      fullName: 'NestJS',
      icon: '🐱',
      type: 'backend',
      database: 'PostgreSQL',
      orm: 'Prisma',
      port: 5000,
      description: 'Modular architecture, Passport.js',
      technologies: 'NestJS 11, Prisma 6.2, Passport.js, JWT, class-validator',
    },
    springboot: {
      name: 'Spring Boot',
      fullName: 'Spring Boot',
      icon: '🍃',
      type: 'backend',
      database: 'MySQL',
      orm: 'JPA',
      port: 8080,
      description: 'Spring Security, Enterprise-grade',
      technologies: 'Spring Boot 4.0.2, Spring Security, JPA, JJWT 0.12, MySQL',
    },
  };

  const handleDownload = async () => {
    // If Next.js standalone is selected, only download that
    if (selectedFrontend === 'nextjs') {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/templates`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              templates: ['nextjs'],
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to generate template');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `nextjs-fullstack.zip`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to download template. Please try again.'
        );
      } finally {
        setLoading(false);
      }
      return;
    }

    // For traditional frontend + backend combo
    if (!selectedFrontend || !selectedBackend) {
      setError('Please select both a frontend and a backend');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/templates`,
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

  const isStandalone = selectedFrontend === 'nextjs';
  const canDownload = isStandalone || (selectedFrontend && selectedBackend);

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
          🚀 Zero-Config Starter Templates
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
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Select Your Stack</h2>
          <p className="text-gray-600 mb-6">
            Choose a full-stack Next.js app OR select one frontend (React/Angular/Vue) and one backend (Express/NestJS/Spring Boot):
          </p>

          {/* Selected Combo Display */}
          {(isStandalone || (selectedFrontend && selectedBackend)) && (
            <div
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
              }}
              className="p-6 rounded-lg mb-6 text-white animation"
            >
              <h3 className="text-lg font-semibold text-center mb-4">🎯 Your Selected Stack</h3>
              <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4">
                {isStandalone ? (
                  <div className="bg-white rounded-lg px-4 md:px-6 py-3 text-gray-800">
                    <div className="flex items-center gap-2 font-medium mb-1">
                      <span className="text-2xl">▲</span>
                      <span className="text-sm md:text-base">Next.js v15 (Full-Stack)</span>
                    </div>
                    <p className="text-xs text-gray-600">Port: 3000 | SQLite + Server Actions</p>
                  </div>
                ) : (
                  <>
                    {(() => {
                      const frontendTemplate = templateData[selectedFrontend as keyof typeof templateData];
                      const backendTemplate = templateData[selectedBackend as keyof typeof templateData];
                      return (
                        <>
                          <div className="bg-white rounded-lg px-4 md:px-6 py-3 text-gray-800">
                            <div className="flex items-center gap-2 font-medium mb-1">
                              <span className="text-2xl">{frontendTemplate.icon}</span>
                              <span className="text-sm md:text-base">
                                {frontendTemplate.name}{' '}
                                {'version' in frontendTemplate ? 
                                  (frontendTemplate as FrontendTemplate | StandaloneTemplate).version : ''}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600">
                              Port: {frontendTemplate.port}
                            </p>
                          </div>
                          <div className="text-white text-2xl opacity-90 font-bold">+</div>
                          <div className="bg-white rounded-lg px-4 md:px-6 py-3 text-gray-800">
                            <div className="flex items-center gap-2 font-medium mb-1">
                              <span className="text-2xl">{backendTemplate.icon}</span>
                              <span className="text-sm md:text-base">
                                {backendTemplate.name}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600">
                              Port: {backendTemplate.port} | {'database' in backendTemplate ? 
                                (backendTemplate as BackendTemplate).database : ''}
                            </p>
                          </div>
                        </>
                      );
                    })()}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Full-Stack Standalone Option */}
          <div className="mb-8">
            <div
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
              }}
              className="text-white text-lg font-semibold text-center p-3 rounded-lg mb-4"
            >
              ⚡ Full-Stack (All-in-One)
            </div>

            <label
              className={`flex items-center p-5 border-2 rounded-lg cursor-pointer transition-all mb-4 ${
                selectedFrontend === 'nextjs'
                  ? 'border-green-500 bg-green-50 transform scale-102'
                  : 'border-gray-200 bg-gray-50 hover:border-green-500 hover:bg-green-50'
              }`}
              style={{
                boxShadow:
                  selectedFrontend === 'nextjs'
                    ? '0 4px 12px rgba(16, 185, 129, 0.4)'
                    : '0 4px 12px rgba(16, 185, 129, 0.15)',
              }}
            >
              <input
                type="radio"
                name="stack"
                value="nextjs"
                checked={selectedFrontend === 'nextjs'}
                onChange={(e) => {
                  setSelectedFrontend(e.target.value);
                  setSelectedBackend(null);
                  setError(null);
                }}
                className="w-5 h-5 mr-4 cursor-pointer"
                style={{ accentColor: '#10b981' }}
              />
              <span className="text-2xl mr-4">▲</span>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 text-lg">Next.js v15 App Router (Full-Stack)</h3>
                <p className="text-gray-600 text-sm">
                  {templateData.nextjs.description} - Complete app with frontend & backend integrated!
                </p>
              </div>
            </label>
          </div>

          {/* Divider */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-semibold">OR</span>
            </div>
          </div>

          {/* Traditional Frontend + Backend Grid */}
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

              {['react', 'angular', 'vue'].map((frontend) => (
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
                      {templateData[frontend as keyof typeof templateData].fullName}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {templateData[frontend as keyof typeof templateData].description}
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

              {['express', 'nestjs', 'springboot'].map((backend) => (
                <label
                  key={backend}
                  className={`flex items-center p-5 border-2 rounded-lg cursor-pointer transition-all mb-4 ${
                    selectedBackend === backend
                      ? 'border-blue-500 bg-blue-50 transform scale-102'
                      : 'border-gray-200 bg-gray-50 hover:border-blue-500 hover:bg-blue-50'
                  } ${isStandalone ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                    disabled={isStandalone}
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
                      {templateData[backend as keyof typeof templateData].fullName}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {templateData[backend as keyof typeof templateData].description}
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
              <li>2. <strong>Right-click the ZIP file</strong> → Select &quot;Properties&quot;</li>
              <li>3. At the bottom, check the box: <strong>&quot;Unblock&quot;</strong></li>
              <li>4. Click <strong>&quot;Apply&quot;</strong> then <strong>&quot;OK&quot;</strong></li>
              <li>5. NOW you can extract without any warnings!</li>
            </ol>
            <p className="mt-4 text-sm">⚡ This unblocks ALL files at once (.gitignore, .editorconfig, etc.)</p>
          </div>

          <p className="text-gray-600 font-semibold mb-4">Installation steps:</p>
          <pre className="bg-gray-100 p-6 rounded-lg overflow-x-auto border border-gray-300 font-mono text-sm">
            {isStandalone
              ? `1. Select "Next.js Full-Stack" (standalone app)
2. Click "Download Stack"
3. UNBLOCK THE ZIP FILE FIRST (see above)
4. Extract the ZIP file
5. Run:
   cd nextjs
   npm install
   npm run dev
6. Open http://localhost:3000
7. Complete full-stack app with auth & database included!`
              : `1. Select one frontend framework (React/Angular/Vue)
2. Select one backend framework (Express/NestJS/Spring Boot)
3. Click "Download Stack"
4. UNBLOCK THE ZIP FILE FIRST (see above)
5. Extract the ZIP file
6. For each template folder, run:
   cd [template-name]
   npm install  # or mvn install for Spring Boot
   npm run dev  # or mvn spring-boot:run for Spring Boot
7. Frontend: http://localhost:${selectedFrontend ? templateData[selectedFrontend as keyof typeof templateData].port : '5173 or 4200'}
8. Backend: http://localhost:${selectedBackend ? templateData[selectedBackend as keyof typeof templateData].port : '5000 or 8080'}
9. Start building your full-stack project instantly!`}
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
          disabled={loading || !canDownload}
          style={{
            background: loading || !canDownload
              ? '#95a5a6'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: loading || !canDownload ? 'none' : '0 4px 16px rgba(102, 126, 234, 0.4)',
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