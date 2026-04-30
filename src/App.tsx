import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, Baby, BookA, Info, Search, Loader2, ArrowRight, Volume2, Sun, Moon } from 'lucide-react';
import { generateBabyNames, BabyName } from './services/geminiService';

const ALPHABET = [
  'Any', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 
  'N', 'O', 'P', 'R', 'S', 'T', 'U', 'V', 'W', 'Y', 'Z'
];

const THEMES = [
  'Modern & Unique',
  'Traditional Sanskrit',
  'Nature Inspired',
  'Mythology (Gods/Goddesses)',
  'Short & Sweet',
  'Royal & Elegant'
];

export default function App() {
  const [gender, setGender] = useState<'Boy' | 'Girl' | 'Any'>('Girl');
  const [startingLetter, setStartingLetter] = useState('Any');
  const [theme, setTheme] = useState(THEMES[0]);
  const [customKeywords, setCustomKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<BabyName[]>([]);
  const [favorites, setFavorites] = useState<BabyName[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [error, setError] = useState('');

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('namakarana-dark');
      if (saved) return saved === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('namakarana-dark', String(isDarkMode));
  }, [isDarkMode]);

  // Load favorites from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('namakarana-favorites');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse favorites");
      }
    }
  }, []);

  // Save favorites to local storage when updated
  useEffect(() => {
    localStorage.setItem('namakarana-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShowFavorites(false);
    
    try {
      const names = await generateBabyNames(gender, startingLetter, theme, customKeywords);
      setResults(names);
    } catch (err) {
      setError('Could not generate names at this time. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (nameToToggle: BabyName) => {
    setFavorites(prev => {
      const exists = prev.some(n => n.englishName === nameToToggle.englishName);
      if (exists) {
        return prev.filter(n => n.englishName !== nameToToggle.englishName);
      }
      return [...prev, nameToToggle];
    });
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-orange-50/50 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-300">
        {/* Header */}
        <header className="bg-white dark:bg-slate-900 px-6 py-4 shadow-sm border-b border-orange-100/50 dark:border-slate-800 sticky top-0 z-10 flex items-center justify-between transition-colors duration-300">
          <div className="flex items-center gap-3">
            <div className="bg-red-50 dark:bg-red-500/10 p-2 rounded-xl">
              <Baby className="w-6 h-6 text-red-500 dark:text-red-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 leading-tight">Namakarana</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Hindi Baby Names</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button 
              onClick={() => setShowFavorites(!showFavorites)}
              className="flex items-center gap-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 px-4 py-2 rounded-full font-medium hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
            >
              <Heart className={`w-4 h-4 ${favorites.length > 0 ? 'fill-red-600 dark:fill-red-400' : ''}`} />
              <span className="hidden sm:inline">Favorites</span>
              {favorites.length > 0 && (
                <span className="bg-red-600 dark:bg-red-500 text-white text-xs py-0.5 px-2 rounded-full">
                  {favorites.length}
                </span>
              )}
            </button>
          </div>
        </header>

        <main className="flex-1 w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Sidebar / Controls */}
          <div className="w-full lg:w-80 xl:w-[22rem] flex-shrink-0 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-orange-100 dark:border-slate-800 relative overflow-hidden transition-colors duration-300">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-400 to-red-400"></div>
              
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-500" />
                Generator
              </h2>
            
            <form onSubmit={handleGenerate} className="space-y-6">
              
              {/* Gender Selection */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  Gender
                </label>
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
                  {['Girl', 'Boy', 'Any'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g as any)}
                      className={`flex-1 py-2.5 px-3 sm:px-4 rounded-xl text-sm font-medium transition-all ${
                        gender === g 
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm' 
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Starting Letter */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <BookA className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                  Starting Letter
                </label>
                <div className="relative">
                  <select
                    value={startingLetter}
                    onChange={(e) => setStartingLetter(e.target.value)}
                    className="w-full appearance-none bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 dark:focus:border-orange-400 font-medium cursor-pointer transition-colors"
                  >
                    {ALPHABET.map(letter => (
                      <option key={letter} value={letter}>
                        {letter === 'Any' ? 'No preference (Any letter)' : `Starts with ${letter}`}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-slate-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              {/* Theme/Meaning */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Info className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                  Vibe & Theme
                </label>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {THEMES.map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTheme(t)}
                      className={`text-left p-3 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                        theme === t
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400'
                          : 'border-slate-200 dark:border-slate-700 bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Keywords */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Search className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                  Custom Keywords / Meaning
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={customKeywords}
                    onChange={(e) => setCustomKeywords(e.target.value)}
                    placeholder="e.g. 'moon', 'brave', 'lotus'"
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 dark:focus:border-orange-400 font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 dark:bg-orange-500 text-white dark:text-slate-950 font-bold rounded-2xl py-4 flex items-center justify-center gap-2 hover:bg-slate-800 dark:hover:bg-orange-400 transition-colors disabled:opacity-70 group"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Finding names...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Generate Names
                  </>
                )}
              </button>

            </form>
          </div>
        </div>

        {/* Results / Favorites Area */}
        <div className="flex-1 min-w-0 w-full lg:w-auto">
          {error && (
            <div className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-medium mb-6 transition-colors">
              {error}
            </div>
          )}

          {!showFavorites && results.length === 0 && !loading && !error && (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-white/50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 transition-colors">
              <div className="bg-orange-100 dark:bg-orange-500/20 p-4 rounded-full mb-4">
                <Sparkles className="w-8 h-8 text-orange-500 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">Ready to find the perfect name?</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                Select your preferences on the left and let AI discover beautiful Hindi names with deep meanings for your little one.
              </p>
            </div>
          )}

          {loading && (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-white/50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden transition-colors">
               <div className="absolute inset-0 bg-[linear-gradient(to_right,#f8fafc_1px,transparent_1px),linear-gradient(to_bottom,#f8fafc_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-50"></div>
               
               <motion.div
                 animate={{ 
                   scale: [1, 1.1, 1],
                 }}
                 transition={{ 
                   duration: 2, 
                   repeat: Infinity, 
                   ease: "easeInOut" 
                 }}
                 className="relative z-10 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-500/20 dark:to-red-500/20 p-5 rounded-full mb-6 shadow-md shadow-orange-100/50 dark:shadow-none"
               >
                 <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                 >
                   <Sparkles className="w-10 h-10 text-orange-500 dark:text-orange-400" />
                 </motion.div>
               </motion.div>
               
               <motion.div
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="relative z-10"
               >
                 <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">Curating beautiful names...</h3>
                 <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8">
                   Search across origins, analyzing cultural significance, and finding your perfect match.
                 </p>
                 
                 <div className="flex justify-center gap-2">
                   {[0, 1, 2].map((i) => (
                     <motion.div
                       key={i}
                       animate={{ 
                         y: [0, -8, 0],
                         opacity: [0.5, 1, 0.5]
                       }}
                       transition={{
                         duration: 1,
                         repeat: Infinity,
                         delay: i * 0.2,
                         ease: "easeInOut"
                       }}
                       className="w-2.5 h-2.5 rounded-full bg-orange-400 dark:bg-orange-500"
                     />
                   ))}
                 </div>
               </motion.div>
            </div>
          )}

          <AnimatePresence mode="popLayout">
            {(showFavorites ? favorites : results).length > 0 && !loading && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    {showFavorites ? (
                      <>
                        <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                        Saved Favorites
                      </>
                    ) : (
                      <>
                        <Baby className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        Generated Results
                      </>
                    )}
                  </h2>
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 transition-colors">
                    {(showFavorites ? favorites : results).length} names
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {(showFavorites ? favorites : results).map((name, index) => {
                    const isFaved = favorites.some(n => n.englishName === name.englishName);
                    
                    return (
                      <motion.div
                        key={name.englishName + index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="group bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-md transition-all relative overflow-hidden flex flex-col"
                      >
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-orange-300 to-red-300 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        
                        <div className="flex justify-between items-start mb-1">
                          <div className="flex items-center gap-3">
                            <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight font-serif transition-colors">
                              {name.englishName}
                            </h3>
                            {name.audioUrl && (
                              <button
                                onClick={() => {
                                  const audio = new Audio(name.audioUrl);
                                  audio.play().catch(e => console.error("Audio playback failed:", e));
                                }}
                                className="p-2 rounded-full bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-700 shrink-0"
                                aria-label="Play pronunciation"
                                title="Play pronunciation"
                              >
                                <Volume2 className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                          <button
                            onClick={() => toggleFavorite(name)}
                            className={`p-2.5 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900/40 shrink-0 ${
                              isFaved 
                                ? 'bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400' 
                                : 'bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-400'
                            }`}
                            aria-label="Save to favorites"
                          >
                            <Heart className={`w-5 h-5 ${isFaved ? 'fill-red-500 dark:fill-red-400' : ''}`} />
                          </button>
                        </div>
                        
                        <div className="mb-5">
                          <p className="text-2xl text-orange-600/80 dark:text-orange-400 font-medium font-serif transition-colors">
                            {name.hindiName}
                          </p>
                          {name.phoneticSpelling && (
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 transition-colors">
                              "{name.phoneticSpelling}"
                            </p>
                          )}
                        </div>
                        
                        <div className="mt-auto space-y-3 bg-slate-50/50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/50 transition-colors">
                          <div>
                            <span className="text-xs font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase block mb-1">Meaning</span>
                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                              {name.meaning}
                            </p>
                          </div>
                          
                          <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
                              <Sparkles className="w-3 h-3 text-orange-400 dark:text-orange-500" />
                              {name.originTheme}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {showFavorites && favorites.length === 0 && (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-white/50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 transition-colors">
                <div className="bg-red-50 dark:bg-red-500/10 p-4 rounded-full mb-4">
                  <Heart className="w-8 h-8 text-red-300 dark:text-red-400/50" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">No favorites yet</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6">
                  Save the names you love by clicking the heart icon on the results.
                </p>
                <button
                  onClick={() => setShowFavorites(false)}
                  className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-6 py-2.5 rounded-full text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-200 flex items-center gap-2 transition-colors"
                >
                  Go Browse Names <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  </div>
  );
}

