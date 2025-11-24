import React, { useState, useCallback } from 'react';
import { Layout } from './components/Layout';
import { ImageUpload } from './components/ImageUpload';
import { PhotoIcon, TextIcon, SparklesIcon } from './components/Icons';
import { generateHairstyle } from './services/gemini';
import { HairStyleState, GenerationType } from './types';

function App() {
  const [state, setState] = useState<HairStyleState>({
    userImage: null,
    refImage: null,
    prompt: '',
    generationType: GenerationType.IMAGE, // Default to image reference
    isGenerating: false,
    result: null,
    error: null,
  });

  const handleUserImageChange = (image: string | null) => {
    setState(prev => ({ ...prev, userImage: image, error: null }));
  };

  const handleRefImageChange = (image: string | null) => {
    setState(prev => ({ ...prev, refImage: image, error: null }));
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setState(prev => ({ ...prev, prompt: e.target.value, error: null }));
  };

  const handleGenerate = async () => {
    if (!state.userImage) {
      setState(prev => ({ ...prev, error: "Please upload your photo first." }));
      return;
    }

    if (state.generationType === GenerationType.IMAGE && !state.refImage) {
      setState(prev => ({ ...prev, error: "Please upload a hairstyle reference photo." }));
      return;
    }

    if (state.generationType === GenerationType.TEXT && !state.prompt.trim()) {
      setState(prev => ({ ...prev, error: "Please describe the hairstyle you want." }));
      return;
    }

    setState(prev => ({ ...prev, isGenerating: true, error: null, result: null }));

    try {
      const resultImage = await generateHairstyle(
        state.userImage,
        state.generationType,
        state.prompt,
        state.refImage || undefined
      );

      setState(prev => ({
        ...prev,
        isGenerating: false,
        result: { imageUrl: resultImage }
      }));
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isGenerating: false,
        error: err.message || "Something went wrong during generation. Please try again."
      }));
    }
  };

  return (
    <Layout>
      {/* Header */}
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 mb-4">
          HairStyle AI
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Try a new look instantly. Upload your selfie and choose a style reference or describe your dream hair.
        </p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Panel: Inputs */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Section 1: Your Photo */}
          <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold">1</div>
              <h2 className="text-xl font-semibold text-white">Your Photo</h2>
            </div>
            <ImageUpload 
              label="Upload a clear selfie (face visible)"
              image={state.userImage}
              onImageChange={handleUserImageChange}
              description="Front-facing photos work best."
            />
          </div>

          {/* Section 2: Target Style */}
          <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-fuchsia-500/20 flex items-center justify-center text-fuchsia-400 font-bold">2</div>
                <h2 className="text-xl font-semibold text-white">Target Style</h2>
              </div>
              
              {/* Toggle Switch */}
              <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700">
                <button
                  onClick={() => setState(s => ({ ...s, generationType: GenerationType.IMAGE, error: null }))}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    state.generationType === GenerationType.IMAGE 
                      ? 'bg-slate-700 text-white shadow-sm' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <PhotoIcon className="w-4 h-4" /> Reference
                </button>
                <button
                  onClick={() => setState(s => ({ ...s, generationType: GenerationType.TEXT, error: null }))}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    state.generationType === GenerationType.TEXT 
                      ? 'bg-slate-700 text-white shadow-sm' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <TextIcon className="w-4 h-4" /> Description
                </button>
              </div>
            </div>

            {state.generationType === GenerationType.IMAGE ? (
              <ImageUpload 
                label="Upload a hairstyle reference"
                image={state.refImage}
                onImageChange={handleRefImageChange}
                description="We'll transfer this hair to you."
              />
            ) : (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Describe the hairstyle</label>
                <textarea
                  value={state.prompt}
                  onChange={handlePromptChange}
                  placeholder="E.g., short blonde bob with bangs, messy bun, curly red hair..."
                  className="w-full h-32 bg-slate-900/50 border border-slate-600 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all resize-none"
                />
              </div>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={handleGenerate}
            disabled={state.isGenerating}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
              state.isGenerating 
                ? 'bg-slate-700 cursor-not-allowed opacity-75' 
                : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-900/20'
            }`}
          >
            {state.isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Styling...
              </>
            ) : (
              <>
                <SparklesIcon className="w-6 h-6" />
                Generate New Look
              </>
            )}
          </button>
          
          {state.error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-sm flex items-start gap-2">
               <span className="text-lg">⚠️</span> {state.error}
            </div>
          )}
        </div>

        {/* Right Panel: Result */}
        <div className="lg:col-span-7">
           <div className="bg-slate-800/40 p-1 rounded-2xl border border-slate-700/50 backdrop-blur-sm h-full min-h-[500px] flex flex-col">
              <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <SparklesIcon className="w-5 h-5 text-yellow-400" />
                  Result
                </h2>
                {state.result && (
                  <a 
                    href={state.result.imageUrl} 
                    download="hairstyle-makeover.png"
                    className="text-sm text-violet-400 hover:text-violet-300 font-medium"
                  >
                    Download Image
                  </a>
                )}
              </div>
              
              <div className="flex-1 p-6 flex items-center justify-center bg-slate-900/30 rounded-b-xl relative overflow-hidden">
                {state.isGenerating ? (
                   <div className="text-center space-y-4 animate-pulse">
                      <div className="w-24 h-24 mx-auto rounded-full bg-slate-700 flex items-center justify-center relative">
                        <div className="absolute inset-0 border-4 border-violet-500/30 rounded-full animate-ping"></div>
                        <SparklesIcon className="w-10 h-10 text-violet-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">AI is working its magic...</h3>
                        <p className="text-slate-400">This usually takes about 10-20 seconds.</p>
                      </div>
                   </div>
                ) : state.result ? (
                  <div className="relative w-full h-full flex items-center justify-center group">
                    <img 
                      src={state.result.imageUrl} 
                      alt="Generated Hairstyle" 
                      className="max-w-full max-h-[600px] object-contain rounded-lg shadow-2xl"
                    />
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white pointer-events-none">
                      AI Generated
                    </div>
                  </div>
                ) : (
                  <div className="text-center max-w-sm">
                     <div className="w-64 h-64 mx-auto bg-slate-800 rounded-full mb-6 flex items-center justify-center border-4 border-dashed border-slate-700 opacity-50">
                        <span className="text-6xl">✨</span>
                     </div>
                     <h3 className="text-xl font-semibold text-slate-300 mb-2">No transformation yet</h3>
                     <p className="text-slate-500">
                       Upload your photo and a style reference to see yourself with a new haircut!
                     </p>
                  </div>
                )}
              </div>
           </div>
        </div>
      </main>
    </Layout>
  );
}

export default App;
