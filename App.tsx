
import React, { useState, useEffect } from 'react';
import UserSelect from './features/UserSelect';
import VersusSetup from './features/VersusSetup';
import VersusGame from './features/VersusGame';
import StoryGame from './features/StoryGame';
import MistakeReview from './features/MistakeReview';
import Card from './components/Card';
import Button from './components/Button';
import PlayerAvatar from './components/PlayerAvatar';
import { Sword, Users, Home, ArrowLeft, Star, ArrowRight, RefreshCcw, Lock, Puzzle, Trophy, Shield, Volume2, MapIcon } from './components/Icons';
import { Player, AppState, VersusConfig, BattleResult, BattleMode } from './types';
import { AVATARS, STORIES } from './constants';
import { saveScore, getLeaderboard, formatTime, saveVersusWin, getVersusLeaderboard } from './utils/leaderboard';

function App() {
  const [appState, setAppState] = useState<AppState>('SPLASH'); 
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  
  // Story Mode State
  const [selectedStoryId, setSelectedStoryId] = useState(1);
  const [selectedSubLevel, setSelectedSubLevel] = useState(1);
  
  // Leaderboard State
  const [lbTab, setLbTab] = useState<'SINGLE'|'VERSUS'>('SINGLE');
  const [lbSubTab, setLbSubTab] = useState<'QUIZ'|'MATCH'>('QUIZ');
  
  const [versusConfig, setVersusConfig] = useState<VersusConfig | null>(null);
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);

  useEffect(() => {
      const savedPlayers = JSON.parse(localStorage.getItem('clash_players') || '[]');
      const migratedPlayers = savedPlayers.map((p: any) => ({
          ...p,
          scores: p.scores || {},
          mistakes: p.mistakes || [],
          stars: p.stars || {} // Ensure stars object exists
      }));
      if (migratedPlayers.length > 0) setPlayers(migratedPlayers);
  }, []);

  const savePlayers = (newPlayers: Player[]) => {
      setPlayers(newPlayers);
      localStorage.setItem('clash_players', JSON.stringify(newPlayers));
  };

  const createPlayer = (name: string, avatar: string) => {
      const newPlayer: Player = {
          id: Date.now(),
          name,
          avatar,
          maxUnlockedLevel: 1, // Chapter ID
          stars: {},
          scores: {},
          mistakes: []
      };
      const updatedPlayers = [...players, newPlayer];
      savePlayers(updatedPlayers);
      setCurrentPlayer(newPlayer);
      setAppState('MENU');
  };

  const updateStoryProgress = (pid: number, chapterId: number, subLvl: number, stars: number, score: number) => {
      const updated = players.map(p => {
          if (p.id === pid) {
              // Key for specific sub-level stars: "1-1" (Chapter 1, Sub 1)
              const starKey = `${chapterId}-${subLvl}`;
              const newStars = { ...p.stars };
              if (!newStars[starKey] || stars > newStars[starKey]) {
                  newStars[starKey] = stars;
              }
              
              // Unlock next chapter logic (Simplified: if user gets stars in current chapter's final level)
              // For now, let's just keep maxUnlockedLevel as Chapter ID access
              let maxLvl = p.maxUnlockedLevel;
              // If we wanted to unlock Chapter 2 after finishing all 5 levels of Chapter 1...
              // implementation depends on strictness. Let's assume manual unlock or just standard progress.

              return { 
                  ...p, 
                  stars: newStars, 
              };
          }
          return p;
      });
      savePlayers(updated);
      if (currentPlayer && currentPlayer.id === pid) {
          setCurrentPlayer(updated.find(p => p.id === pid) || null);
      }
  };

  const addMistake = (wordId: number) => {
      if (!currentPlayer) return;
      if (!currentPlayer.mistakes.includes(wordId)) {
          const updatedPlayer = {
              ...currentPlayer,
              mistakes: [...currentPlayer.mistakes, wordId]
          };
          const updatedPlayers = players.map(p => p.id === currentPlayer.id ? updatedPlayer : p);
          savePlayers(updatedPlayers);
          setCurrentPlayer(updatedPlayer);
      }
  };

  const removeMistake = (wordId: number) => {
       if (!currentPlayer) return;
       const updatedPlayer = {
           ...currentPlayer,
           mistakes: currentPlayer.mistakes.filter(id => id !== wordId)
       };
       const updatedPlayers = players.map(p => p.id === currentPlayer.id ? updatedPlayer : p);
       savePlayers(updatedPlayers);
       setCurrentPlayer(updatedPlayer);
  };

  const handleResetGame = () => {
      localStorage.removeItem('clash_players');
      setPlayers([]);
      setCurrentPlayer(null);
      if (appState !== 'USER_SELECT') setAppState('USER_SELECT');
  };

  // Helper to count total stars
  const getTotalStars = (p: Player) => {
      if (!p.stars) return 0;
      return Object.values(p.stars).reduce((acc, curr) => acc + curr, 0);
  };

  if (appState === 'SPLASH') {
      return (
          <div className="h-[100dvh] w-full bg-amber-500 flex flex-col items-center justify-center animate-fadeIn select-none overflow-hidden cursor-pointer" onClick={() => setAppState('USER_SELECT')}>
              <div className="text-9xl mb-8 animate-bounce drop-shadow-2xl">⚔️</div>
              <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-widest drop-shadow-md mb-4 text-center px-4 leading-none">Pertarungan Kata</h1>
              <div className="text-amber-900 font-bold uppercase tracking-wide text-2xl md:text-3xl mb-12 bg-white/20 px-6 py-2 rounded-sm backdrop-blur-sm">Edisi Bahasa Melayu</div>
              <div className="animate-pulse text-white font-black text-3xl md:text-5xl tracking-widest bg-black/20 px-8 py-4 rounded-sm border-4 border-white/20">Tekan untuk Mula</div>
          </div>
      );
  }

  if (appState === 'USER_SELECT') {
      return <UserSelect 
          players={players} 
          avatars={AVATARS} 
          onSelect={(p) => { setCurrentPlayer(p); setAppState('MENU'); }} 
          onCreate={createPlayer} 
          onReset={handleResetGame}
      />;
  }

  if (appState === 'MENU' && currentPlayer) {
      const totalStars = getTotalStars(currentPlayer);
      const mistakeCount = currentPlayer.mistakes?.length || 0;

      return (
          <div className="h-[100dvh] bg-sky-400 flex items-center justify-center p-4">
              <Card className="max-w-md w-full p-8 text-center bg-orange-50">
                  <div className="mb-2 flex justify-center">
                      <PlayerAvatar avatar={currentPlayer.avatar} size="lg" className="border-4 border-amber-500 shadow-xl" />
                  </div>
                  <h1 className="text-3xl font-black text-amber-900 mb-2">Hai, {currentPlayer.name}!</h1>
                  
                  <div className="mb-6 relative group cursor-pointer hover:scale-105 transition-transform">
                     <div className="absolute -inset-1 bg-yellow-400 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-200 animate-pulse"></div>
                     <div className="relative bg-black rounded-lg p-2 border-2 border-yellow-500 flex flex-col items-center">
                        <div className="text-yellow-400 font-bold text-xs uppercase tracking-[0.2em] mb-0">Bintang Terkumpul</div>
                        <div className="flex items-center gap-2">
                             <Star size={28} className="text-yellow-400 fill-yellow-400" />
                             <span className="font-black text-4xl text-white font-mono roblox-text-shadow">
                                 {totalStars}
                             </span>
                        </div>
                     </div>
                  </div>
                  
                  <div className="space-y-3">
                      <Button onClick={() => setAppState('STORY_SELECT')} className="w-full text-xl py-3 shadow-xl">
                          <Sword size={24} /> Mula Pengembaraan
                      </Button>
                      
                      <div className="relative">
                          <Button 
                            onClick={() => setAppState('MISTAKE_REVIEW')} 
                            variant="success" 
                            className="w-full text-xl py-3 shadow-xl"
                            disabled={mistakeCount === 0}
                          >
                             <Shield size={24} /> Bank Soalan Salah
                          </Button>
                          {mistakeCount > 0 && (
                             <div className="absolute -top-2 -right-2 bg-red-600 text-white font-black rounded-full w-8 h-8 flex items-center justify-center border-2 border-white animate-bounce">
                                 {mistakeCount}
                             </div>
                          )}
                      </div>

                      <Button onClick={() => setAppState('VERSUS_SETUP')} variant="danger" className="w-full text-xl py-3 shadow-xl">
                          <Users size={24} /> Dua Pemain (Versus)
                      </Button>
                      
                      <Button onClick={() => { setCurrentPlayer(null); setAppState('USER_SELECT'); }} variant="secondary" className="w-full">
                          Tukar Pemain
                      </Button>
                  </div>
              </Card>
          </div>
      );
  }

  if (appState === 'MISTAKE_REVIEW' && currentPlayer) {
      return (
          <MistakeReview 
            player={currentPlayer}
            onRemoveMistake={removeMistake}
            onExit={() => setAppState('MENU')}
          />
      );
  }

  if (appState === 'VERSUS_SETUP' && currentPlayer) {
      return <VersusSetup 
          currentPlayer={currentPlayer} 
          avatars={AVATARS}
          onBack={() => setAppState('MENU')}
          onStart={(config) => {
              setVersusConfig(config);
              setAppState('VERSUS_GAME');
          }}
      />;
  }

  if (appState === 'VERSUS_GAME' && versusConfig) {
      return <VersusGame 
          config={versusConfig} 
          onExit={() => setAppState('MENU')}
          onGameOver={(winner) => saveVersusWin(winner)}
      />;
  }

  if (appState === 'STORY_SELECT' && currentPlayer) {
      return (
          <div className="h-[100dvh] bg-sky-800 flex flex-col">
              <div className="bg-sky-900 p-4 text-white flex items-center justify-between shadow-lg z-10">
                  <Button variant="secondary" onClick={() => setAppState('MENU')} className="px-3"><Home size={20}/></Button>
                  <h2 className="text-xl font-bold uppercase truncate">Pilih Kisah (Stories)</h2>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {STORIES.map(story => {
                      const isUnlocked = currentPlayer.maxUnlockedLevel >= story.id;
                      return (
                          <button 
                              key={story.id} 
                              onClick={() => { if(isUnlocked) { setSelectedStoryId(story.id); setAppState('SUBLEVEL_SELECT'); } }}
                              disabled={!isUnlocked}
                              className={`w-full relative rounded-xl overflow-hidden shadow-lg border-b-4 text-left transition-transform active:scale-95 ${isUnlocked ? 'bg-orange-100 border-orange-300' : 'bg-gray-600 border-gray-800 grayscale opacity-80'}`}
                          >
                              <div className="p-6 flex items-center gap-4">
                                  <div className="text-4xl">📚</div>
                                  <div className="min-w-0">
                                      <div className="text-2xl font-black uppercase leading-tight text-orange-900">{story.title}</div>
                                      <div className="text-orange-700 font-bold text-sm">6 Misi (6 Missions)</div>
                                  </div>
                                  {!isUnlocked && <Lock className="ml-auto text-gray-400 shrink-0" size={32} />}
                              </div>
                          </button>
                      );
                  })}
              </div>
          </div>
      );
  }

  if (appState === 'SUBLEVEL_SELECT' && currentPlayer) {
      const story = STORIES.find(s => s.id === selectedStoryId);
      if (!story) return <div>Story not found</div>;

      const subLevels = [
          { id: 1, name: "Baca & Dengar", desc: "Reading", icon: <Volume2 size={32}/>, color: "bg-blue-200", border: "border-blue-500" },
          { id: 2, name: "Kuiz Kosa Kata", desc: "Vocab Quiz", icon: <Sword size={32}/>, color: "bg-green-200", border: "border-green-500" },
          { id: 3, name: "Padankan", desc: "Matching", icon: <MapIcon size={32}/>, color: "bg-orange-200", border: "border-orange-500" },
          { id: 4, name: "Ejaan", desc: "Spelling", icon: <Puzzle size={32}/>, color: "bg-yellow-200", border: "border-yellow-500" },
          { id: 5, name: "Terjemahan", desc: "Translation", icon: <RefreshCcw size={32}/>, color: "bg-red-200", border: "border-red-500" },
          { id: 6, name: "Bina Ayat", desc: "Sentence Builder", icon: <Shield size={32}/>, color: "bg-purple-200", border: "border-purple-500" },
      ];

      return (
          <div className="h-[100dvh] bg-orange-100 flex flex-col">
              {/* Header */}
              <div className="bg-orange-600 p-4 text-white flex items-center justify-between shadow-lg z-10 shrink-0">
                  <Button variant="secondary" onClick={() => setAppState('STORY_SELECT')} className="px-3 py-1 h-10 mb-0"><ArrowLeft/></Button>
                  <h2 className="text-xl font-bold uppercase truncate px-2 text-shadow-md">{story.title}</h2>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                  <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
                      {subLevels.map(lvl => {
                          const starKey = `${selectedStoryId}-${lvl.id}`;
                          const stars = currentPlayer.stars[starKey] || 0;
                          
                          return (
                              <button 
                                  key={lvl.id}
                                  onClick={() => { setSelectedSubLevel(lvl.id); setAppState('STORY_GAME'); }}
                                  className={`
                                    relative rounded-sm border-b-8 shadow-md transition-transform active:translate-y-1 active:border-b-4
                                    ${lvl.color} ${lvl.border} p-4 flex items-center justify-between
                                  `}
                              >
                                  <div className="flex items-center gap-4">
                                      <div className="bg-white/50 p-2 rounded-full border-2 border-black/10">
                                          {lvl.icon}
                                      </div>
                                      <div className="text-left">
                                          <div className="text-xs font-black uppercase opacity-60">Level {lvl.id}</div>
                                          <div className="text-xl font-black text-gray-800">{lvl.name}</div>
                                          <div className="text-sm font-bold text-gray-600">{lvl.desc}</div>
                                      </div>
                                  </div>

                                  <div className="flex flex-col items-center bg-black/10 p-2 rounded-lg">
                                      <div className="flex gap-1 mb-1">
                                          {[1,2,3].map(s => (
                                              <Star key={s} size={16} className={s <= stars ? "text-yellow-400 fill-yellow-400 stroke-black" : "text-gray-400 fill-gray-400"} />
                                          ))}
                                      </div>
                                      <div className="text-xs font-bold uppercase text-gray-700">Mula</div>
                                  </div>
                              </button>
                          );
                      })}
                  </div>
              </div>
          </div>
      );
  }

  if (appState === 'STORY_GAME' && currentPlayer) {
      const story = STORIES.find(s => s.id === selectedStoryId);
      if(!story) return <div>Error</div>;

      return (
          <StoryGame
            chapter={story}
            subLevel={selectedSubLevel}
            player={currentPlayer}
            onComplete={(stars, score) => {
                updateStoryProgress(currentPlayer.id, story.id, selectedSubLevel, stars, score);
                setBattleResult({ status: 'WIN', stars, score });
                setAppState('RESULT');
            }}
            onExit={() => setAppState('SUBLEVEL_SELECT')}
          />
      );
  }

  if (appState === 'RESULT' && battleResult) {
      return (
          <div className="h-[100dvh] bg-black/90 flex items-center justify-center p-4">
              <Card className="max-w-md w-full p-6 text-center bg-yellow-50 flex flex-col max-h-[90vh]">
                  <div className="text-6xl mb-2 animate-bounce">🏆</div>
                  <h2 className="text-4xl font-black mb-1 uppercase roblox-text-shadow text-white">TAHNIAH!</h2>
                  
                    <div className="flex justify-center gap-2 mb-4">
                        {[1,2,3].map(s => (
                            <Star key={s} size={40} className={s <= battleResult.stars ? "text-yellow-500 fill-yellow-500 stroke-black stroke-2" : "text-gray-400 fill-gray-400 stroke-black"} />
                        ))}
                    </div>
                    
                    <div className="mb-8">
                        <div className="text-sm font-bold text-gray-500">SKOR DIPEROLEHI</div>
                        <div className="text-5xl font-black font-mono text-green-600 tracking-widest">
                            {battleResult.score?.toLocaleString()}
                        </div>
                    </div>

                  <div className="space-y-2 mt-auto">
                      <Button onClick={() => setAppState('SUBLEVEL_SELECT')} variant="success" className="w-full text-lg py-2">
                          Teruskan <ArrowRight/>
                      </Button>
                      <Button onClick={() => setAppState('STORY_GAME')} variant="primary" className="w-full text-lg py-2">
                          Ulang Semula <RefreshCcw/>
                      </Button>
                  </div>
              </Card>
          </div>
      );
  }

  return <div>Ralat tidak dijangka.</div>;
}

export default App;
