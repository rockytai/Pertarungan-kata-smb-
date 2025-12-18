
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
import { AVATARS, STORIES, ACHIEVEMENTS } from './constants';
import { saveScore, getLeaderboard, formatTime, saveVersusWin, getVersusLeaderboard } from './utils/leaderboard';
import { AudioEngine } from './utils/audio';

// Dynamic Level Calculator
const getPlayerLevel = (score: number) => Math.floor(Math.sqrt(score / 100)) + 1;
const getScoreForLevel = (level: number) => Math.pow(level - 1, 2) * 100;

function App() {
  const [appState, setAppState] = useState<AppState>('SPLASH'); 
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  // Story Mode State
  const [selectedStoryId, setSelectedStoryId] = useState(1);
  const [selectedSubLevel, setSelectedSubLevel] = useState(1);
  
  const [versusConfig, setVersusConfig] = useState<VersusConfig | null>(null);
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);

  useEffect(() => {
      const savedPlayers = JSON.parse(localStorage.getItem('clash_players') || '[]');
      const migratedPlayers = savedPlayers.map((p: any) => ({
          ...p,
          scores: p.scores || {},
          totalScore: p.totalScore || 0,
          achievements: p.achievements || [],
          mistakes: p.mistakes || [],
          stars: p.stars || {} 
      }));
      if (migratedPlayers.length > 0) setPlayers(migratedPlayers);

      if (appState === 'SPLASH') {
          const interval = setInterval(() => {
              setLoadingProgress(prev => {
                  if (prev >= 100) {
                      clearInterval(interval);
                      return 100;
                  }
                  return prev + 5;
              });
          }, 100);
          return () => clearInterval(interval);
      }
  }, [appState]);

  const savePlayers = (newPlayers: Player[]) => {
      setPlayers(newPlayers);
      localStorage.setItem('clash_players', JSON.stringify(newPlayers));
  };

  const createPlayer = (name: string, avatar: string) => {
      const newPlayer: Player = {
          id: Date.now(),
          name,
          avatar,
          maxUnlockedLevel: 1, 
          stars: {},
          scores: {},
          totalScore: 0,
          achievements: [],
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
              const starKey = `${chapterId}-${subLvl}`;
              const newStars = { ...p.stars };
              if (!newStars[starKey] || stars > newStars[starKey]) {
                  newStars[starKey] = stars;
              }
              const newScores = { ...p.scores };
              const prevBest = newScores[starKey] || 0;
              const diff = score > prevBest ? score - prevBest : 0;
              if (score > prevBest) newScores[starKey] = score;

              const newTotal = p.totalScore + diff;
              const tempPlayer = { ...p, stars: newStars, totalScore: newTotal };
              const newAchieves = [...p.achievements];
              ACHIEVEMENTS.forEach(ach => {
                  if (!newAchieves.includes(ach.id) && ach.condition(tempPlayer)) {
                      newAchieves.push(ach.id);
                  }
              });

              return { 
                  ...p, 
                  stars: newStars, 
                  scores: newScores,
                  totalScore: newTotal,
                  achievements: newAchieves,
                  maxUnlockedLevel: Math.max(p.maxUnlockedLevel, getPlayerLevel(newTotal))
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
          const updatedPlayer = { ...currentPlayer, mistakes: [...currentPlayer.mistakes, wordId] };
          const updatedPlayers = players.map(p => p.id === currentPlayer.id ? updatedPlayer : p);
          savePlayers(updatedPlayers);
          setCurrentPlayer(updatedPlayer);
      }
  };

  const removeMistake = (wordId: number) => {
       if (!currentPlayer) return;
       const updatedPlayer = { ...currentPlayer, mistakes: currentPlayer.mistakes.filter(id => id !== wordId) };
       const updatedPlayers = players.map(p => p.id === currentPlayer.id ? updatedPlayer : p);
       savePlayers(updatedPlayers);
       setCurrentPlayer(updatedPlayer);
  };

  const handleResetGame = () => {
      localStorage.removeItem('clash_players');
      setPlayers([]);
      setCurrentPlayer(null);
      setAppState('USER_SELECT');
  };

  if (appState === 'SPLASH') {
      return (
          <div className="h-[100dvh] w-full bg-[#111] flex flex-col items-center justify-between p-12 select-none overflow-hidden text-white font-sans">
              <div className="w-full flex flex-col items-center mt-20">
                  <div className="bg-red-600 border-4 border-white p-4 roblox-shadow mb-8 animate-bounce">
                    <Sword size={64} className="text-white"/>
                  </div>
                  <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter italic roblox-text-shadow leading-none text-center">
                    PERTARUNGAN<br/>KATA
                  </h1>
              </div>
              <div className="w-full max-w-xl mb-20 flex flex-col items-center">
                {loadingProgress < 100 ? (
                    <div className="w-full flex flex-col items-center gap-4">
                        <div className="text-2xl font-black tracking-widest animate-pulse">MEMUATKAN... {loadingProgress}%</div>
                        <div className="w-full h-8 bg-gray-800 border-4 border-white p-1"><div className="h-full bg-green-500 transition-all duration-100" style={{ width: `${loadingProgress}%` }}></div></div>
                    </div>
                ) : (
                    <button onClick={() => { AudioEngine.init(); setAppState('USER_SELECT'); }} className="bg-green-500 hover:bg-green-400 border-b-8 border-x-4 border-t-4 border-green-800 text-white font-black text-5xl py-6 px-20 rounded-lg roblox-shadow active:translate-y-2 active:border-b-2 transition-all w-full animate-fadeIn">MASUK (JOIN)</button>
                )}
              </div>
          </div>
      );
  }

  if (appState === 'USER_SELECT') {
      return <UserSelect players={players} avatars={AVATARS} onSelect={(p) => { setCurrentPlayer(p); setAppState('MENU'); }} onCreate={createPlayer} onReset={handleResetGame}/>;
  }

  if (appState === 'MENU' && currentPlayer) {
      const level = getPlayerLevel(currentPlayer.totalScore);
      const scoreForCurrent = getScoreForLevel(level);
      const scoreForNext = getScoreForLevel(level + 1);
      const progressToNext = ((currentPlayer.totalScore - scoreForCurrent) / (scoreForNext - scoreForCurrent)) * 100;
      const mistakeCount = currentPlayer.mistakes?.length || 0;

      return (
          <div className="h-[100dvh] bg-sky-400 flex items-center justify-center p-4">
              <Card className="max-w-md w-full p-6 text-center bg-[#F2F2F2] border-[6px] border-black roblox-shadow relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-yellow-400"></div>
                  
                  <div className="mb-2 flex justify-center relative">
                      <PlayerAvatar avatar={currentPlayer.avatar} size="lg" className="border-4 border-black shadow-xl" />
                      <div className="absolute -bottom-2 right-1/4 bg-yellow-400 border-4 border-black rounded-sm px-3 py-1 font-black text-xl roblox-shadow">
                          {level}
                      </div>
                  </div>
                  
                  <h1 className="text-3xl font-black text-black mb-1 roblox-text-shadow text-white uppercase tracking-tighter italic">{currentPlayer.name}</h1>
                  
                  {/* Level Progress Bar */}
                  <div className="mb-4">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">
                          <span>Tahap {level}</span>
                          <span>{currentPlayer.totalScore.toLocaleString()} / {scoreForNext.toLocaleString()}</span>
                      </div>
                      <div className="w-full h-5 bg-gray-300 border-2 border-black p-0.5 rounded-sm">
                          <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${progressToNext}%` }}></div>
                      </div>
                  </div>

                  <div className="space-y-2">
                      <Button onClick={() => setAppState('STORY_SELECT')} className="w-full text-xl py-4 shadow-xl bg-green-500 text-white hover:bg-green-400 animate-pulse">
                          <Sword size={24} /> MULAKAN MISI
                      </Button>
                      
                      <div className="grid grid-cols-2 gap-2">
                          <Button onClick={() => setAppState('MISTAKE_REVIEW')} variant="success" className="text-sm py-2 bg-blue-500" disabled={mistakeCount === 0}>
                             <Shield size={16} /> SIMPANAN ({mistakeCount})
                          </Button>
                          <Button onClick={() => setAppState('VERSUS_SETUP')} variant="danger" className="text-sm py-2">
                              <Users size={16} /> VERSUS
                          </Button>
                      </div>

                      <div className="p-3 bg-white border-4 border-black text-left">
                          <h3 className="font-black text-xs text-gray-400 uppercase tracking-widest mb-2 border-b-2 border-gray-100 flex items-center gap-2">
                              <Trophy size={14}/> Pencapaian
                          </h3>
                          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                              {ACHIEVEMENTS.map(ach => (
                                  <div key={ach.id} className={`shrink-0 w-12 h-12 rounded-sm border-2 flex items-center justify-center text-2xl ${currentPlayer.achievements.includes(ach.id) ? 'bg-yellow-400 border-black animate-bounce' : 'bg-gray-100 border-gray-300 opacity-20 grayscale'}`} title={ach.title}>
                                      {ach.icon}
                                  </div>
                              ))}
                          </div>
                      </div>
                      
                      <Button onClick={() => { setCurrentPlayer(null); setAppState('USER_SELECT'); }} variant="secondary" className="w-full text-xs py-2 opacity-70">LOG KELUAR</Button>
                  </div>
              </Card>
          </div>
      );
  }

  if (appState === 'MISTAKE_REVIEW' && currentPlayer) {
      return <MistakeReview player={currentPlayer} onRemoveMistake={removeMistake} onExit={() => setAppState('MENU')} />;
  }

  if (appState === 'VERSUS_SETUP' && currentPlayer) {
      return <VersusSetup currentPlayer={currentPlayer} avatars={AVATARS} onBack={() => setAppState('MENU')} onStart={(config) => { setVersusConfig(config); setAppState('VERSUS_GAME'); }} />;
  }

  if (appState === 'VERSUS_GAME' && versusConfig) {
      return <VersusGame config={versusConfig} onExit={() => setAppState('MENU')} onGameOver={(winner) => saveVersusWin(winner)} />;
  }

  if (appState === 'STORY_SELECT' && currentPlayer) {
      return (
          <div className="h-[100dvh] bg-sky-800 flex flex-col">
              <div className="bg-gray-900 border-b-4 border-black p-4 text-white flex items-center justify-between shadow-lg z-10">
                  <Button variant="secondary" onClick={() => setAppState('MENU')} className="px-3 h-10 mb-0"><Home size={20}/></Button>
                  <div className="flex flex-col items-end">
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Jumlah Skor</div>
                      <div className="text-xl font-black text-yellow-400 font-mono leading-none">{currentPlayer.totalScore.toLocaleString()}</div>
                  </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {STORIES.map(story => {
                      const isUnlocked = true; // For demo, all unlocked
                      return (
                          <button key={story.id} onClick={() => { setSelectedStoryId(story.id); setAppState('SUBLEVEL_SELECT'); }} className={`w-full relative rounded-sm overflow-hidden shadow-lg border-b-[8px] border-black text-left transition-transform active:scale-95 active:translate-y-2 active:border-b-[4px] bg-white`}>
                              <div className="p-6 flex items-center gap-4">
                                  <div className="text-5xl">📚</div>
                                  <div className="min-w-0">
                                      <div className="text-2xl font-black uppercase leading-tight text-gray-900 roblox-text-shadow text-white italic">{story.title}</div>
                                      <div className="text-blue-500 font-black text-xs uppercase tracking-widest">Mula Belajar!</div>
                                  </div>
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
              <div className="bg-orange-600 p-4 text-white flex items-center justify-between shadow-lg z-10 shrink-0 border-b-4 border-black">
                  <Button variant="secondary" onClick={() => setAppState('STORY_SELECT')} className="px-3 py-1 h-10 mb-0"><ArrowLeft/></Button>
                  <div className="flex flex-col items-center flex-1">
                      <h2 className="text-xl font-black uppercase italic truncate px-2 text-shadow-md">{story.title}</h2>
                  </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4"><div className="grid grid-cols-1 gap-4 max-w-md mx-auto">{subLevels.map(lvl => { const starKey = `${selectedStoryId}-${lvl.id}`; const stars = currentPlayer.stars[starKey] || 0; return <button key={lvl.id} onClick={() => { setSelectedSubLevel(lvl.id); setAppState('STORY_GAME'); }} className={`relative rounded-sm border-b-8 shadow-md transition-transform active:translate-y-1 active:border-b-4 ${lvl.color} ${lvl.border} p-4 flex items-center justify-between border-4 border-black`}><div className="flex items-center gap-4"><div className="bg-white/50 p-2 rounded-full border-2 border-black/10">{lvl.icon}</div><div className="text-left"><div className="text-[10px] font-black uppercase opacity-60">Level {lvl.id}</div><div className="text-xl font-black text-gray-800 leading-tight">{lvl.name}</div></div></div><div className="flex flex-col items-center bg-black/10 p-2 rounded-lg"><div className="flex gap-1 mb-1">{[1,2,3].map(s => <Star key={s} size={16} className={s <= stars ? "text-yellow-400 fill-yellow-400 stroke-black" : "text-gray-400 fill-gray-400"} />)}</div></div></button>; })}</div></div>
          </div>
      );
  }

  if (appState === 'STORY_GAME' && currentPlayer) {
      const story = STORIES.find(s => s.id === selectedStoryId);
      if(!story) return <div>Error</div>;
      return <StoryGame chapter={story} subLevel={selectedSubLevel} player={currentPlayer} onComplete={(stars, score) => { updateStoryProgress(currentPlayer.id, story.id, selectedSubLevel, stars, score); setBattleResult({ status: 'WIN', stars, score }); setAppState('RESULT'); }} onExit={() => setAppState('SUBLEVEL_SELECT')} />;
  }

  if (appState === 'RESULT' && battleResult) {
      return (
          <div className="h-[100dvh] bg-black/90 flex items-center justify-center p-4">
              <Card className="max-w-md w-full p-6 text-center bg-[#F2F2F2] flex flex-col max-h-[90vh] border-[8px] border-black roblox-shadow">
                  <div className="text-6xl mb-2 animate-bounce">🏆</div>
                  <h2 className="text-4xl font-black mb-1 uppercase roblox-text-shadow text-white italic">MISI SELESAI!</h2>
                    <div className="flex justify-center gap-2 mb-4">{[1,2,3].map(s => <Star key={s} size={50} className={s <= battleResult.stars ? "text-yellow-500 fill-yellow-500 stroke-black stroke-2 animate-pulse" : "text-gray-400 fill-gray-400 stroke-black"} />)}</div>
                    <div className="mb-4 bg-white p-4 border-4 border-black roblox-shadow">
                        <div className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Skor Diperolehi</div>
                        <div className="text-5xl font-black font-mono text-green-600 tracking-tighter">{battleResult.score?.toLocaleString()}</div>
                    </div>
                  <div className="space-y-2 mt-auto">
                      <Button onClick={() => setAppState('SUBLEVEL_SELECT')} variant="success" className="w-full text-xl py-4 bg-green-500 text-white roblox-shadow">Teruskan <ArrowRight/></Button>
                  </div>
              </Card>
          </div>
      );
  }

  return <div>Ralat tidak dijangka.</div>;
}

export default App;
