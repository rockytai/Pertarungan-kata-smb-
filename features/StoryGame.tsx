
import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import PlayerAvatar from '../components/PlayerAvatar';
import { ArrowLeft, Volume2, Trophy, Star, RefreshCcw } from '../components/Icons';
import { StoryChapter, StoryLine, Player } from '../types';
import { AudioEngine } from '../utils/audio';
import { getDistractors } from '../constants';

interface StoryGameProps {
  chapter: StoryChapter;
  subLevel: number; // 1-6
  player: Player;
  onComplete: (stars: number, score: number) => void;
  onExit: () => void;
}

interface MatchingCard {
    id: string;
    text: string;
    pairId: number;
    type: 'malay' | 'chinese';
    isMatched: boolean;
}

const StoryGame: React.FC<StoryGameProps> = ({ chapter, subLevel, player, onComplete, onExit }) => {
    // Shared State
    const [questions, setQuestions] = useState<StoryLine[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [mistakes, setMistakes] = useState(0);
    
    // UI States
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
    const [options, setOptions] = useState<string[]>([]);
    
    // Level 3 (Matching) Specific State
    const [matchingCards, setMatchingCards] = useState<MatchingCard[]>([]);
    const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
    
    // Level 4 (Spelling) Specific State
    const [spellingInput, setSpellingInput] = useState<string>("");
    
    // Level 6 (Sentence Builder) Specific State
    const [builtSentence, setBuiltSentence] = useState<{id: number, text: string}[]>([]);
    const [wordPool, setWordPool] = useState<{id: number, text: string}[]>([]);

    useEffect(() => {
        // Initialize Content
        let q: StoryLine[] = [];
        
        // Reset states
        setMatchingCards([]);
        setSelectedCardId(null);
        setSpellingInput("");
        setBuiltSentence([]);
        setWordPool([]);
        
        switch(subLevel) {
            case 1: // Story Reader
                q = chapter.content; 
                break;
            case 2: // Vocab Quiz
                // Filter out names, NO DUPLICATION
                q = chapter.content.filter(c => c.type === 'vocab' && !c.isName); 
                q.sort(() => 0.5 - Math.random());
                break;
            case 3: // Matching (Padankan)
                // Filter vocab items, exclude names
                const vocabItems = chapter.content.filter(c => c.type === 'vocab' && !c.isName);
                // Create matching pairs
                const deck: MatchingCard[] = [];
                vocabItems.forEach((item, i) => {
                    deck.push({ id: `m-${item.id}-${i}`, text: item.malay, pairId: item.id, type: 'malay', isMatched: false });
                    deck.push({ id: `c-${item.id}-${i}`, text: item.chinese, pairId: item.id, type: 'chinese', isMatched: false });
                });
                setMatchingCards(deck.sort(() => 0.5 - Math.random()));
                q = vocabItems; 
                break;
            case 4: // Spelling (was 3)
                // Filter out names, NO DUPLICATION
                q = chapter.content.filter(c => c.type === 'vocab' && !c.isName); 
                q.sort(() => 0.5 - Math.random());
                break;
            case 5: // Translation (was 4)
                q = chapter.content.filter(c => c.type === 'sentence');
                q.sort(() => 0.5 - Math.random());
                break;
            case 6: // Sentence Builder (was 5)
                q = chapter.content.filter(c => c.type === 'sentence');
                q.sort(() => 0.5 - Math.random());
                break;
        }
        setQuestions(q);
        setCurrentIndex(0);
        setScore(0);
        setMistakes(0);
        setFeedback(null);
        setSelectedOption(null);
    }, [chapter, subLevel]);

    const currentQ = questions[currentIndex];

    // Initialize Options/Pool when question changes (for non-matching levels)
    useEffect(() => {
        if (!currentQ || subLevel === 3) return; // Skip for matching
        
        setFeedback(null);
        setSelectedOption(null);

        if (subLevel === 1) {
            AudioEngine.speak(currentQ.audioText);
        }
        else if (subLevel === 2 || subLevel === 5) {
            // Multiple Choice
            const distractors = getDistractors(currentQ.id, 3, currentQ.type);
            const opts = [...distractors, currentQ.chinese].sort(() => 0.5 - Math.random());
            setOptions(opts);
            AudioEngine.speak(currentQ.audioText);
        }
        else if (subLevel === 4) {
            // Spelling
            setSpellingInput(getMaskedWord(currentQ.malay));
        }
        else if (subLevel === 6) {
            // Sentence Builder
            const words = currentQ.malay
                .replace(/[.,!]/g, '')
                .split(' ')
                .map((w, i) => ({ id: i, text: w }));
            setWordPool(words.sort(() => 0.5 - Math.random()));
            setBuiltSentence([]);
        }

    }, [currentIndex, currentQ, subLevel]);

    // --- LOGIC HELPERS ---

    const getMaskedWord = (word: string) => {
        if (word.length <= 2) return "_ _";
        const chars = word.split('');
        return chars.map((c, i) => {
            if (i === 0 || i === chars.length - 1) return c;
            return "_";
        }).join('');
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            // End of Level
            const finalStars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
            onComplete(finalStars, score);
        }
    };

    // --- INTERACTION HANDLERS ---

    // Level 2 & 5: Quiz
    const handleOptionSelect = (opt: string) => {
        if (feedback) return;
        setSelectedOption(opt);
        
        if (opt === currentQ.chinese) {
            setFeedback('correct');
            AudioEngine.playAttack();
            setScore(s => s + 100);
            setTimeout(handleNext, 1000);
        } else {
            setFeedback('wrong');
            AudioEngine.playDamage();
            setMistakes(m => m + 1);
            setTimeout(() => {
                setFeedback(null);
                setSelectedOption(null);
            }, 800);
        }
    };

    // Level 3: Matching
    const handleCardClick = (card: MatchingCard) => {
        if (card.isMatched || feedback || card.id === selectedCardId) return;

        AudioEngine.playTone(400, 'sine', 0.05);

        if (!selectedCardId) {
            setSelectedCardId(card.id);
        } else {
            const firstCard = matchingCards.find(c => c.id === selectedCardId);
            if (!firstCard) return;

            if (firstCard.pairId === card.pairId) {
                // Match!
                setFeedback('correct');
                AudioEngine.playAttack();
                setMatchingCards(prev => prev.map(c => 
                    (c.id === firstCard.id || c.id === card.id) ? { ...c, isMatched: true } : c
                ));
                setSelectedCardId(null);
                setScore(s => s + 50);
                setTimeout(() => setFeedback(null), 500);

                // Check Win
                const remaining = matchingCards.filter(c => !c.isMatched && c.id !== firstCard.id && c.id !== card.id).length;
                if (remaining === 0) {
                     setTimeout(() => {
                         const finalStars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
                         onComplete(finalStars, score + 200); // Bonus completion
                     }, 1000);
                }
            } else {
                // Mismatch
                setFeedback('wrong');
                AudioEngine.playDamage();
                setMistakes(m => m + 1);
                // Highlight error briefly then reset selection
                setTimeout(() => {
                    setFeedback(null);
                    setSelectedCardId(null);
                }, 800);
            }
        }
    };

    // Level 4: Spelling
    const handleSpellingSubmit = () => {
        if (feedback) return;
        
        const fullWord = spellingInput;
        
        if (fullWord.toLowerCase() === currentQ.malay.toLowerCase()) {
            setFeedback('correct');
            AudioEngine.playAttack();
            setScore(s => s + 100);
            setTimeout(handleNext, 1000);
        } else {
            setFeedback('wrong');
            AudioEngine.playDamage();
            setMistakes(m => m + 1);
            setSpellingInput(getMaskedWord(currentQ.malay));
            setTimeout(() => setFeedback(null), 800);
        }
    };

    // Level 6: Sentence Builder
    const handleWordClickPool = (word: {id: number, text: string}) => {
        setWordPool(prev => prev.filter(w => w.id !== word.id));
        setBuiltSentence(prev => [...prev, word]);
        AudioEngine.playTone(600, 'sine', 0.05);
    };

    const handleWordClickSentence = (word: {id: number, text: string}) => {
        setBuiltSentence(prev => prev.filter(w => w.id !== word.id));
        setWordPool(prev => [...prev, word]);
        AudioEngine.playTone(400, 'sine', 0.05);
    };

    const checkSentence = () => {
        const constructed = builtSentence.map(w => w.text).join(' ');
        const target = currentQ.malay.replace(/[.,!]/g, ''); 
        
        if (constructed === target) {
            setFeedback('correct');
            AudioEngine.playAttack();
            AudioEngine.speak(currentQ.audioText);
            setScore(s => s + 100);
            setTimeout(handleNext, 1500);
        } else {
            setFeedback('wrong');
            AudioEngine.playDamage();
            setMistakes(m => m + 1);
            setTimeout(() => setFeedback(null), 800);
        }
    };

    // --- RENDER ---

    if (!currentQ && subLevel !== 3) return <div className="p-4 text-center font-bold">Memuatkan...</div>;
    // For Matching, currentQ might not be relevant for rendering individual questions, but we check if cards exist
    if (subLevel === 3 && matchingCards.length === 0) return <div className="p-4 text-center font-bold">Memuatkan...</div>;


    return (
        <div className="h-[100dvh] bg-sky-200 flex flex-col font-sans">
            {/* Header */}
            <div className="bg-gray-900 text-white p-2 flex justify-between items-center shadow-lg shrink-0 h-12">
                <Button variant="secondary" onClick={onExit} className="px-2 py-1 text-xs h-8"><ArrowLeft size={16}/></Button>
                <div className="font-bold text-yellow-400 font-mono text-sm md:text-base truncate max-w-[150px]">
                    {chapter.title} - Level {subLevel}
                </div>
                <div className="flex gap-1">
                    {[1,2,3].map(h => (
                        <Star key={h} size={16} className={h <= (3 - mistakes) ? "text-yellow-400 fill-yellow-400" : "text-gray-700"} />
                    ))}
                </div>
            </div>

            <div className="flex-1 flex flex-col p-1 md:p-2 max-w-4xl mx-auto w-full overflow-hidden">
                
                {/* Progress (Not for Matching as it's single screen) */}
                {subLevel !== 3 && (
                    <div className="w-full bg-gray-300 h-3 rounded-full mb-2 md:mb-4 border-2 border-black shrink-0">
                        <div 
                            className="bg-green-500 h-full rounded-full transition-all duration-300" 
                            style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
                        />
                    </div>
                )}

                {/* --- LEVEL 1: STORY READER --- */}
                {subLevel === 1 && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 animate-fadeIn p-4">
                        <div className="w-full bg-white border-[6px] border-black p-8 rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
                             <div className="mb-4 text-8xl">📖</div>
                             <h1 className="text-4xl md:text-5xl font-bold text-black font-arial mb-4">{currentQ.malay}</h1>
                             <p className="text-xl md:text-3xl text-gray-600 font-bold">{currentQ.chinese}</p>
                             
                             <button onClick={() => AudioEngine.speak(currentQ.audioText)} className="mt-8 mx-auto bg-blue-100 p-4 rounded-full border-4 border-blue-400 active:scale-95 transition-transform block shadow-lg">
                                <Volume2 size={40} className="text-blue-600"/>
                             </button>
                        </div>
                        <Button onClick={handleNext} className="w-full max-w-xs text-xl py-3">
                            Seterusnya <span className="ml-2">→</span>
                        </Button>
                    </div>
                )}

                {/* --- LEVEL 2 & 5: QUIZ (Vocab & Sentence) --- */}
                {(subLevel === 2 || subLevel === 5) && (
                    <div className="flex-1 flex flex-col h-full gap-2">
                        {/* Question Card */}
                        <div className="flex-[0.25] md:flex-[0.3] bg-white border-[6px] border-black p-2 md:p-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full text-center relative flex flex-col justify-center items-center overflow-hidden">
                            <h1 className="text-5xl md:text-7xl font-black text-slate-800 font-arial leading-tight break-words max-w-full">
                                {currentQ.malay}
                            </h1>
                            <div className="mt-1 md:mt-4 inline-block bg-black text-yellow-400 px-3 py-1 rounded-full text-xs md:text-lg font-bold uppercase tracking-widest border-2 border-yellow-400">
                                Pilih Makna
                            </div>
                            <button onClick={() => AudioEngine.speak(currentQ.audioText)} className="absolute top-1 right-1 md:top-4 md:right-4 p-2 bg-blue-500 text-white rounded-full border-2 md:border-4 border-black hover:bg-blue-400 active:scale-95 shadow-md">
                                <Volume2 size={20} className="md:w-8 md:h-8"/>
                            </button>
                        </div>

                        {/* Options Grid - Expanded and Enlarged */}
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 w-full h-full pb-2">
                            {options.map((opt, i) => {
                                // Define colors
                                const colors = [
                                    "bg-red-500 border-red-800 text-white hover:bg-red-400",
                                    "bg-blue-500 border-blue-800 text-white hover:bg-blue-400",
                                    "bg-green-500 border-green-800 text-white hover:bg-green-400",
                                    "bg-yellow-400 border-yellow-700 text-black hover:bg-yellow-300",
                                ];
                                const colorClass = colors[i % colors.length];
                                
                                // Override if selected
                                let btnClass = `${colorClass} border-b-[6px] md:border-b-[8px] active:border-b-2 active:translate-y-1`;
                                
                                if (selectedOption === opt) {
                                    if (feedback === 'correct') btnClass = "bg-green-600 border-green-900 text-white border-b-0 translate-y-2 ring-4 ring-white";
                                    else if (feedback === 'wrong') btnClass = "bg-red-600 border-red-900 text-white border-b-0 translate-y-2 ring-4 ring-white";
                                } else if (selectedOption) {
                                    btnClass += " opacity-50 grayscale";
                                }

                                return (
                                    <button
                                        key={i}
                                        onClick={() => handleOptionSelect(opt)}
                                        className={`
                                            relative h-full w-full rounded-xl font-black text-4xl md:text-6xl transition-all shadow-lg
                                            border-x-4 border-t-4 flex items-center justify-center p-2 leading-tight break-words whitespace-normal
                                            ${btnClass}
                                        `}
                                    >
                                        {opt}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* --- LEVEL 3: MATCHING --- */}
                {subLevel === 3 && (
                    <div className="flex-1 flex flex-col p-2">
                        <h2 className="text-center font-bold text-gray-700 mb-2 font-arial uppercase tracking-widest">Padankan (Match)</h2>
                        <div className="grid grid-cols-2 gap-3 flex-1 overflow-y-auto">
                            {matchingCards.map(card => {
                                const isSelected = selectedCardId === card.id;
                                // Simple visual style
                                return (
                                    <button
                                        key={card.id}
                                        onClick={() => handleCardClick(card)}
                                        disabled={card.isMatched}
                                        className={`
                                            h-32 rounded-lg border-4 flex items-center justify-center p-2 transition-all font-arial font-bold text-3xl md:text-5xl break-words
                                            ${card.isMatched 
                                                ? 'opacity-0' 
                                                : isSelected 
                                                    ? 'bg-yellow-300 border-black scale-105 z-10'
                                                    : 'bg-white border-gray-400 hover:bg-gray-50'
                                            }
                                        `}
                                    >
                                        {card.text}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* --- LEVEL 4: SPELLING (Fill in Blanks) --- */}
                {subLevel === 4 && (
                    <div className="flex-1 flex flex-col h-full gap-4 p-2">
                        <div className="flex-[0.3] flex flex-col items-center justify-center text-center">
                            <div className="text-4xl md:text-6xl font-bold text-gray-800 mb-2 font-arial">{currentQ.chinese}</div>
                            <div className="bg-white border-[6px] border-black p-6 rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-2xl">
                                <div className="text-6xl md:text-8xl font-mono tracking-[0.2em] font-black text-blue-600 mb-2">
                                    {spellingInput || "_ _ _ _"}
                                </div>
                                <div className="text-sm font-bold uppercase tracking-widest text-gray-400">Lengkapkan (Fill in)</div>
                            </div>
                        </div>

                        {/* Custom Keyboard - Takes remaining space */}
                        <div className="flex-1 flex flex-col justify-center gap-4">
                            <div className="flex flex-wrap justify-center gap-3">
                                {currentQ.malay.split('').sort(() => 0.5 - Math.random()).map((char, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            const currentChars = spellingInput.split('');
                                            const firstUnderscore = currentChars.indexOf('_');
                                            if (firstUnderscore !== -1) {
                                                currentChars[firstUnderscore] = char;
                                                const newVal = currentChars.join('');
                                                setSpellingInput(newVal);
                                                // Manual submit only
                                            }
                                        }}
                                        className="w-16 h-16 md:w-20 md:h-20 bg-white border-b-[6px] border-x-2 border-t-2 border-gray-500 rounded-lg font-black text-3xl md:text-5xl hover:bg-blue-100 active:translate-y-1 active:border-b-2 transition-all font-arial shadow-md"
                                    >
                                        {char}
                                    </button>
                                ))}
                                <button 
                                    onClick={() => setSpellingInput(getMaskedWord(currentQ.malay))}
                                    className="w-16 h-16 md:w-20 md:h-20 bg-red-100 border-b-[6px] border-x-2 border-t-2 border-red-400 rounded-lg font-bold text-red-600 flex items-center justify-center active:translate-y-1 active:border-b-2 shadow-md"
                                >
                                    <RefreshCcw size={28}/>
                                </button>
                            </div>

                            {/* Manual Submit Button */}
                            <div className="flex justify-center mt-4">
                                <Button 
                                    onClick={handleSpellingSubmit} 
                                    className="w-full max-w-sm py-4 text-2xl bg-green-500 hover:bg-green-400 text-white"
                                    disabled={spellingInput.includes('_')}
                                >
                                    SEMAK (CHECK)
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- LEVEL 6: SENTENCE BUILDER --- */}
                {subLevel === 6 && (
                    <div className="flex-1 flex flex-col h-full gap-4 p-2">
                        {/* Question */}
                        <div className="flex-[0.2] flex flex-col items-center justify-center text-center">
                             <h2 className="text-4xl md:text-7xl font-black text-stone-800 font-arial leading-none mb-2">{currentQ.chinese}</h2>
                             <p className="text-lg text-stone-500 font-bold uppercase tracking-widest">Bina ayat (Build Sentence)</p>
                        </div>

                        {/* Answer Area - Takes about 40% */}
                        <div className="flex-[0.4] bg-white border-[6px] border-black rounded-xl p-4 flex content-start flex-wrap gap-3 overflow-y-auto shadow-[inset_0_4px_8px_rgba(0,0,0,0.1)] bg-blue-50 items-center justify-center">
                            {builtSentence.length === 0 && (
                                <span className="text-gray-400 font-bold italic w-full text-center text-2xl md:text-4xl opacity-50">Klik perkataan di bawah...</span>
                            )}
                            {builtSentence.map((w, i) => (
                                <button 
                                    key={w.id} 
                                    onClick={() => handleWordClickSentence(w)}
                                    className="bg-yellow-400 text-black font-black font-arial text-3xl md:text-5xl px-4 py-2 md:px-6 md:py-3 rounded-lg border-4 border-black shadow-md hover:bg-red-400 hover:text-white transition-colors animate-fadeIn active:scale-95"
                                >
                                    {w.text}
                                </button>
                            ))}
                        </div>

                        {/* Pool Area - Takes remaining space */}
                        <div className="flex-1 flex flex-col justify-center">
                             <div className="flex flex-wrap justify-center gap-3 md:gap-4 overflow-y-auto max-h-full py-2">
                                {wordPool.map((w) => (
                                    <button
                                        key={w.id}
                                        onClick={() => handleWordClickPool(w)}
                                        className="bg-white text-gray-800 font-black font-arial text-3xl md:text-5xl px-4 py-3 md:px-6 md:py-4 rounded-lg border-b-[6px] border-x-4 border-t-4 border-gray-400 active:border-b-4 active:translate-y-1 transition-all shadow-lg"
                                    >
                                        {w.text}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Check Button - Fixed at bottom */}
                        <div className="mt-auto pt-2 shrink-0">
                             <Button 
                                onClick={checkSentence} 
                                disabled={wordPool.length > 0} 
                                className={`w-full py-3 md:py-5 text-2xl md:text-4xl ${wordPool.length > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                             >
                                Semak Jawapan
                             </Button>
                        </div>
                    </div>
                )}

                {/* Feedback Toast - Disabled for Level 3 */}
                {feedback && subLevel !== 3 && (
                    <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-50 px-12 py-6 border-[6px] border-black text-4xl font-black rotate-[-3deg] shadow-[12px_12px_0px_0px_rgba(0,0,0,0.5)] animate-bounce ${feedback === 'correct' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                        {feedback === 'correct' ? 'BETUL! (Correct!)' : 'SALAH! (Wrong!)'}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StoryGame;
