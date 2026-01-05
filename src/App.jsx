import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Share2, BarChart2, X, RefreshCw, Play, AlertCircle, Loader2, HelpCircle } from 'lucide-react';

// --- القاموس المحلي السريع (تم تحديث النهايات لتكون "ة" بدلاً من "ه") ---
const LOCAL_DICT = [
  "كتابة", "سيارة", "مدينة", "حقيبة", "طائرة", "سفينة", "مدرسة", "طاولة", "حديقة", "كواكب",
  "ملابس", "ليمون", "زيتون", "غسالة", "ثلاجة", "دفاتر", "اقلام", "اعلام", "احلام", "افلام",
  "الوان", "ارقام", "اوقات", "اشجار", "انهار", "خواتم", "ساعات", "قمصان", "احذية", "اطباق",
  "اكواب", "ابواب", "الواح", "انوار", "ازهار", "اسماك", "اقمار", "امواج", "اخشاب", "الحان",
  "اموال", "البان", "افكار", "انفاس", "ارواح", "اكياس", "العاب", "ابطال", "اجبال", "اجسام",
  "اجيال", "احبال", "احسان", "احفاد", "احمال", "اخبار", "اخلاق", "ادوار", "اذكار", "ارباح",
  "ارزاق", "ارضية", "ارصفة", "اسرار", "اسعار", "اسلاك", "اسوار", "اصحاب", "اصداف", "اصوات",
  "اطفال", "اطياف", "اعصاب", "اعصار", "اعضاء", "اعمال", "اعماق", "اعمدة", "اغصان", "اغلفة",
  "افراح", "افواج", "اقفاص", "اقفال", "اقوال", "اكتاف", "اكياس", "العاب", "املاك", "امثال",
  "امطار", "انعام", "انفاق", "انفاس", "اودية", "اوراق", "اوسمة", "اوطان", "تجارب", "تحالف",
  "تحاور", "تذاكر", "تراجع", "تراكم", "ترتيب", "ترجمة", "ترقية", "تزاحم", "تسامح", "تسجيل",
  "تسليم", "تسمية", "تشابه", "تشكيل", "تصادم", "تصحيح", "تصميم", "تصوير", "تطوير", "تظاهر",
  "تعادل", "تعاون", "تعبير", "تعريف", "تعليم", "تغليف", "تفاحة", "تفاعل", "تفكير", "تقديم",
  "تقليب", "تكامل", "تكرار", "تكوين", "تلاميذ", "تمارين", "تمثيل", "تمجيد", "تمديد", "تمركز",
  "تنافس", "تناغم", "تناول", "تنسيق", "تنظيم", "تنفيذ", "تنقيب", "تنويع", "تواجد", "توازن",
  "تواصل", "توافق", "توقيت", "توليد", "تيسير", "جامعة", "جداول", "جرائد", "جوارب", "حاسوب",
  "حافلة", "حقائب", "حكاية", "حكومة", "حلاوة", "حلقات", "حمامة", "حماية", "حناجر", "حيوية",
  "خزائن", "خسارة", "خشبية", "خصائص", "خطابة", "خطوات", "خلفية", "خليفة", "خناجر", "خواطر",
  "خيمة", "دراجة", "دراسة", "دعائم", "دقائق", "دوائر", "دوافع", "دولية", "ديوان", "ذاكرة",
  "ذهنية", "روابط", "رواية", "رياضة", "رياحة", "زراعة", "زرافة", "زلازل", "زوايا", "زيتية",
  "ساحة", "ساحلة", "سلاسل", "سلطان", "سلطة", "سماعة", "سمكة", "سنابل", "سنوات", "سياسة",
  "سيوفة", "شاشة", "شاملة", "شجاعة", "شجرة", "شرايح", "شريحة", "شوارع", "شواطئ", "شواهد",
  "شياطين", "صاعقة", "صالحة", "صحافة", "صخور", "صدور", "صفائح", "صناعة", "صندوق", "صورة",
  "صيانة", "ضيافة", "طاقة", "طبيعة", "طرائق", "طوابع", "طواحن", "طواقم", "طويلة", "طيور",
  "ظواهر", "عاصفة", "عالمي", "عبادة", "عبقري", "عجائب", "عجائن", "عجلة", "عدالة", "عراقة",
  "عربات", "عربية", "عروض", "عزيمة", "عساكر", "عصافير", "عصائر", "عطارة", "عظمة", "عقارب",
  "علاقة", "علامات", "عناوين", "عناصر", "عناكب", "عناية", "عواصم", "عواصف", "عواقب", "عوامل",
  "غابات", "غالية", "غرفة", "غريبة", "غسالة", "غلافة", "فارسة", "فاصلة", "فاكهة", "فتاكة",
  "فتحات", "فتحة", "فخرية", "فراشة", "فرشاة", "فصيلة", "فطائر", "فقرات", "فلاحون", "فلسفة",
  "فنادق", "فنون", "فهرسة", "فواصل", "فواكه", "قاعدة", "قاموس", "قانون", "قوارب", "قوافل",
  "قوالب", "قوانين", "قواعد", "قيادة", "قياسة", "قيامة", "كاملة", "كبيرة", "كتابة", "كراسي",
  "كواكب", "كواشف", "كيمياء", "لاعبين", "لافتات", "لباسة", "لبنات", "لجنة", "لطافة", "لمسات",
  "لهجات", "لوحات", "ماركة", "ماكينة", "مالية", "مباني", "متباعد", "متجانس", "متحرك", "متحف",
  "متدرب", "متذوق", "مترجم", "متسابق", "متسلق", "متطابق", "متطور", "متعاون", "متعدد", "متفائل",
  "متفاعل", "متقدم", "متقلب", "متكامل", "متكرر", "متكلم", "متميز", "متوازن", "متواجد", "متواضع",
  "متواصل", "متوفر", "مجالس", "مجاهد", "مجادل", "مجاور", "مجالات", "مجلدات", "مجموعه", "محارب",
  "محاسب", "محاضر", "محافظ", "محاكم", "محاوله", "محدده", "محطات", "محطة", "محكمه", "محاور",
  "مخازن", "مخارج", "مخالب", "مخاطر", "مخاوف", "مختلف", "مدارس", "مدافع", "مداخن", "مداخل",
  "مداهم", "مدرسة", "مذياع", "مراحل", "مراسل", "مراسم", "مرافق", "مراكز", "مراكب", "مراوح",
  "مرايا", "مرتبات", "مرتبة", "مرحلة", "مركبات", "مركزه", "مرموق", "مروحة", "مرونة", "مزارع",
  "مساجد", "مساحات", "مسارات", "مسابقات", "مساكن", "مسالك", "مسائل", "مسامير", "مساهم",
  "مسطرة", "مسكنة", "مشاهد", "مشاعر", "مشاغل", "مشاكل", "مشاوي", "مشابك", "مشاعل", "مشروع",
  "مشطوب", "مشعل", "مشوار", "مصاعد", "مصانع", "مصائب", "مصادر", "مصارف", "مصافح", "مصالح",
  "مصباح", "مصحف", "مصلحة", "مضخات", "مضائق", "مطارق", "مطاحن", "مطابع", "مطاعم", "مطالب",
  "مظاهر", "مظلات", "معادن", "معارك", "معالج", "معامل", "معاهد", "معايير", "معالم", "معتاد",
  "معتدل", "معترف", "معتقد", "معدات", "معرفة", "معروف", "معسكر", "معقول", "معلقات", "معنوي",
  "معيشة", "مغارس", "مغاسل", "مغاطس", "مفارش", "مفاصل", "مفاتيح", "مفاهيم", "مفاوض", "مفتاح",
  "مفتوح", "مفردات", "مفروش", "مقصات", "مقصورة", "مقاطع", "مقاعد", "مقاوم", "مقابل", "مقبول",
  "مقتبس", "مقتصد", "مقدور", "مقدمة", "مقصود", "مكابح", "مكاتب", "مكافح", "مكايد", "مكتبة",
  "مكتشف", "مكشوف", "ملاحة", "ملاحق", "ملازم", "ملاعب", "ملابس", "ملامح", "ملتزم", "ملحقات",
  "ملخصات", "ملزمة", "ملفات", "ملقاط", "مماثلة", "ممارسة", "مملكة", "ممرات", "ممرضة", "مميزات",
  "مميزة", "منازل", "مناسب", "مناطق", "مناظر", "منافس", "منافع", "منافذ", "مناهج", "مناهل",
  "منابع", "مناديل", "مناصب", "مناضل", "منبسط", "منبهات", "منتخب", "منتصف", "منتظم", "منتقى",
  "منحدر", "منحنى", "مندوب", "منزلية", "منسق", "منشور", "منصات", "منظمة", "منظور", "منظار",
  "منعطف", "منغلق", "منفوخ", "منهجي", "منواب", "مواثيق", "مواجد", "مواجع", "مواجه", "مواسم",
  "مواصف", "مواصل", "مواضع", "مواطن", "مواقع", "مواقف", "مواقد", "مواكبة", "مواليد", "مواهب",
  "مواجهة", "موظفين", "موعظة", "موفور", "موقوت", "مؤلفة", "ميدان", "ميزانية", "ميسور", "ميناء"
];

// دالة توحيد خفيفة جداً (لحذف الحركات والهمزات للمقارنة)
const normalizeCompare = (word) => {
  if (!word) return "";
  return word
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه") // نوحد التاء المربوطة بالهاء في المقارنة فقط لضمان سهولة اللعب
    .replace(/ى/g, "ي")
    .replace(/[\u064B-\u065F]/g, ""); 
};

const App = () => {
  const [targetWord, setTargetWord] = useState("");
  const [guesses, setGuesses] = useState(Array(6).fill(""));
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameState, setGameState] = useState("playing");
  const [letterStatuses, setLetterStatuses] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [stats, setStats] = useState({ played: 0, wins: 0, streak: 0, maxStreak: 0 });
  const [shakeRow, setShakeRow] = useState(-1);
  const [learnedWords, setLearnedWords] = useState(new Set());

  const apiKey = "";

  useEffect(() => {
    // اختيار كلمة اليوم مع الحفاظ على التاء المربوطة الأصلية
    const todayIndex = new Date().getDate() % LOCAL_DICT.length;
    const todayWord = LOCAL_DICT[todayIndex];
    setTargetWord(todayWord);

    const savedStats = localStorage.getItem('kalima-v10-stats');
    if (savedStats) setStats(JSON.parse(savedStats));

    const savedLearned = localStorage.getItem('kalima-v10-learned');
    if (savedLearned) setLearnedWords(new Set(JSON.parse(savedLearned)));

    const savedState = localStorage.getItem('kalima-v10-state');
    const todayStr = new Date().toDateString();
    if (localStorage.getItem('kalima-v10-last-played') === todayStr && savedState) {
      const { guesses, status, target } = JSON.parse(savedState);
      if (target === todayWord) {
        setGuesses(guesses);
        setGameState(status);
        updateKeyboard(guesses, todayWord);
      }
    }
  }, []);

  const updateKeyboard = (allGuesses, target) => {
    const newStatuses = { ...letterStatuses };
    allGuesses.forEach(guess => {
      if (!guess) return;
      for (let i = 0; i < 5; i++) {
        const char = guess[i];
        if (char === target[i]) newStatuses[char] = 'correct';
        else if (target.includes(char) && newStatuses[char] !== 'correct') newStatuses[char] = 'present';
        else if (!newStatuses[char]) newStatuses[char] = 'absent';
      }
    });
    setLetterStatuses(newStatuses);
  };

  const checkWordFast = async (word) => {
    // 1. التحقق من القاموس المحلي أو الكلمات المتعلمة سابقاً (مقارنة مرنة)
    const normWord = normalizeCompare(word);
    const inLocal = LOCAL_DICT.some(w => normalizeCompare(w) === normWord);
    const inLearned = Array.from(learnedWords).some(w => normalizeCompare(w) === normWord);

    if (inLocal || inLearned) return true;

    // 2. التحقق من الإنترنت (فقط إذا لم تكن في المحلي)
    setIsChecking(true);
    const isValid = await checkWordWithAI(word);
    setIsChecking(false);

    if (isValid) {
      const newLearned = new Set(learnedWords).add(word);
      setLearnedWords(newLearned);
      localStorage.setItem('kalima-v10-learned', JSON.stringify(Array.from(newLearned)));
    }
    return isValid;
  };

  const checkWordWithAI = async (word) => {
    const systemPrompt = "Respond with 'YES' if this is a valid 5-letter Arabic word (noun or verb), 'NO' otherwise. Only 1 word response.";
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: `Is "${word}" a valid 5-letter Arabic word?` }] }], systemInstruction: { parts: [{ text: systemPrompt }] } })
      });
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim().toUpperCase() === 'YES';
    } catch { return true; } 
  };

  const handleKeyPress = useCallback(async (key) => {
    if (gameState !== "playing" || isChecking || errorMessage) return;

    if (key === "Enter") {
      if (currentGuess.length !== 5) { triggerError("الكلمة ناقصة"); return; }
      
      const isValid = await checkWordFast(currentGuess);
      if (!isValid) { triggerError("ليست في القاموس"); return; }

      const idx = guesses.findIndex(g => g === "");
      const newGuesses = [...guesses];
      newGuesses[idx] = currentGuess;
      setGuesses(newGuesses);
      updateKeyboard(newGuesses, targetWord);

      // مقارنة مرنة (ة = ه) لتسهيل اللعب
      if (normalizeCompare(currentGuess) === normalizeCompare(targetWord)) {
        finishGame(true, newGuesses);
      } else if (idx === 5) {
        finishGame(false, newGuesses);
      } else {
        persistState(newGuesses, "playing");
      }
      setCurrentGuess("");

    } else if (key === "Backspace") {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (currentGuess.length < 5 && /^[\u0600-\u06FF]$/.test(key)) {
      setCurrentGuess(prev => prev + key);
    }
  }, [currentGuess, guesses, gameState, targetWord, isChecking, errorMessage, learnedWords]);

  const triggerError = (msg) => {
    setErrorMessage(msg);
    setShakeRow(guesses.findIndex(g => g === ""));
    setTimeout(() => { setErrorMessage(""); setShakeRow(-1); }, 1200);
  };

  const persistState = (history, status) => {
    localStorage.setItem('kalima-v10-state', JSON.stringify({ guesses: history, status, target: targetWord }));
    localStorage.setItem('kalima-v10-last-played', new Date().toDateString());
  };

  const finishGame = (won, history) => {
    setGameState(won ? "won" : "lost");
    const newStats = { played: stats.played + 1, wins: stats.wins + (won?1:0), streak: won ? stats.streak + 1 : 0, maxStreak: Math.max(stats.maxStreak, won ? stats.streak + 1 : 0) };
    setStats(newStats);
    localStorage.setItem('kalima-v10-stats', JSON.stringify(newStats));
    persistState(history, won ? "won" : "lost");
    setTimeout(() => setShowStats(true), 2000);
  };

  const startRandom = () => {
    const word = LOCAL_DICT[Math.floor(Math.random() * LOCAL_DICT.length)];
    setTargetWord(word);
    setGuesses(Array(6).fill(""));
    setCurrentGuess("");
    setGameState("playing");
    setLetterStatuses({});
    setShowStats(false);
  };

  const getCellColor = (char, index, fullGuess) => {
    if (!fullGuess) return "border-zinc-800";
    
    const nTarget = normalizeCompare(targetWord);
    const nFullGuess = normalizeCompare(fullGuess);
    const nChar = normalizeCompare(char);

    // 1. صحيح وفي مكانه
    if (nChar === nTarget[index]) return "bg-emerald-600 border-emerald-600 text-white";
    
    // 2. موجود ولكن بمكان آخر (مع معالجة التكرار)
    const targetCount = nTarget.split('').filter(c => c === nChar).length;
    const matchesBefore = nFullGuess.substring(0, index).split('').filter(c => c === nChar).length;
    
    if (nTarget.includes(nChar) && matchesBefore < targetCount) return "bg-amber-500 border-amber-500 text-white";
    
    return "bg-zinc-800 border-zinc-800 text-zinc-500";
  };

  const keyboardRows = [
    ["ض", "ص", "ث", "ق", "ف", "غ", "ع", "ه", "خ", "ح", "ج", "د"],
    ["ش", "س", "ي", "ب", "ل", "ت", "ن", "م", "ك", "ط", "ذ"],
    ["Enter", "ئ", "ء", "ؤ", "ر", "ا", "ى", "ة", "و", "ز", "Backspace"]
  ];

  useEffect(() => {
    const fn = (e) => handleKeyPress(e.key);
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [handleKeyPress]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-4 font-sans select-none overflow-hidden" dir="rtl">
      {errorMessage && <div className="fixed top-24 bg-white text-black px-6 py-2 rounded-lg font-bold z-[100] animate-bounce shadow-2xl">{errorMessage}</div>}
      
      {isChecking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90] flex items-center justify-center">
          <div className="bg-zinc-900 p-6 rounded-2xl flex flex-col items-center gap-3 border border-zinc-800">
            <Loader2 size={32} className="animate-spin text-emerald-500" />
            <span className="text-xs font-bold text-zinc-400">جاري التأكد لغوياً...</span>
          </div>
        </div>
      )}

      <header className="w-full max-w-md flex justify-between items-center border-b border-zinc-900 pb-3 mb-8">
        <button onClick={() => setShowHelp(true)} className="p-2 text-zinc-500 hover:text-white"><HelpCircle size={24} /></button>
        <div className="text-center">
          <h1 className="text-3xl font-black tracking-tighter uppercase">كَلِمَة</h1>
          <div className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">إصدار اللغة الفصيحة</div>
        </div>
        <button onClick={() => setShowStats(true)} className="p-2 text-zinc-500 hover:text-white"><BarChart2 size={24} /></button>
      </header>

      <main className="flex-grow flex flex-col justify-center gap-1.5 mb-10">
        {guesses.map((g, r) => {
          const isCurrent = r === guesses.findIndex(gr => gr === "");
          const display = isCurrent ? currentGuess : g;
          return (
            <div key={r} className={`flex gap-1.5 ${shakeRow === r ? 'animate-shake' : ''}`}>
              {Array(5).fill("").map((_, c) => (
                <div key={c} className={`w-14 h-14 sm:w-16 sm:h-16 border-2 flex items-center justify-center text-3xl font-bold transition-all duration-300 ${g && !isCurrent ? getCellColor(display[c], c, g) : "border-zinc-800"} ${display[c] && isCurrent ? 'border-zinc-500 scale-105 shadow-lg' : ''}`}>
                  {display[c]}
                </div>
              ))}
            </div>
          );
        })}
      </main>

      <div className="w-full max-w-lg space-y-1.5 pb-6">
        {keyboardRows.map((row, i) => (
          <div key={i} className="flex justify-center gap-1 px-1">
            {row.map(k => {
              const s = letterStatuses[k];
              let bg = s === 'correct' ? "bg-emerald-600" : s === 'present' ? "bg-amber-500" : s === 'absent' ? "bg-zinc-900 opacity-40" : "bg-zinc-500";
              const isA = k === "Enter" || k === "Backspace";
              return (
                <button key={k} onClick={() => handleKeyPress(k)} className={`${bg} h-12 sm:h-14 rounded-lg flex items-center justify-center font-bold text-xs sm:text-base active:scale-90 flex-1 transition-all ${isA ? 'px-4 min-w-[55px] bg-zinc-600' : ''}`}>
                  {k === "Backspace" ? "⌫" : k}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {showStats && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
          <div className="bg-zinc-900 w-full max-w-sm p-8 rounded-3xl border border-zinc-800 text-center relative shadow-2xl">
            <button onClick={() => setShowStats(false)} className="absolute top-6 left-6 text-zinc-500 hover:text-white"><X size={24}/></button>
            {gameState !== "playing" && <div className="mb-6 animate-in zoom-in duration-300"><p className="text-zinc-500 text-xs mb-1 uppercase font-bold tracking-widest">الكلمة هي</p><h2 className="text-4xl font-black text-emerald-500">{targetWord}</h2></div>}
            <h3 className="text-xl font-bold mb-6 uppercase tracking-wider">الإحصائيات</h3>
            <div className="grid grid-cols-4 gap-2 mb-10 text-[10px] sm:text-xs text-zinc-400">
              <div><div className="text-2xl text-white font-black">{stats.played}</div>لعب</div>
              <div><div className="text-2xl text-white font-black">{stats.played ? Math.round((stats.wins/stats.played)*100) : 0}</div>فوز%</div>
              <div><div className="text-2xl text-white font-black">{stats.streak}</div>حالي</div>
              <div><div className="text-2xl font-black text-white">{stats.maxStreak}</div>أفضل</div>
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={() => {
                let text = `كَلِمَة ${guesses.filter(g => g !== "").length}/6\n\n`;
                guesses.forEach(g => {
                  if (!g) return;
                  let row = "";
                  for (let i = 0; i < 5; i++) {
                    const color = getCellColor(g[i], i, g);
                    if (color.includes("emerald")) row += "🟩";
                    else if (color.includes("amber")) row += "🟨";
                    else row += "⬛";
                  }
                  text += row + "\n";
                });
                navigator.clipboard.writeText(text);
                setErrorMessage("تم نسخ النتيجة!");
                setTimeout(() => setErrorMessage(""), 2000);
              }} className="w-full bg-emerald-600 py-4 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-emerald-500 active:scale-95 shadow-lg"><Share2 size={18} /> مشاركة</button>
              <button onClick={startRandom} className="w-full bg-zinc-800 py-3 rounded-xl font-bold text-zinc-300 hover:bg-zinc-700">جولة عشوائية جديدة</button>
            </div>
          </div>
        </div>
      )}

      {showHelp && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
          <div className="bg-zinc-900 w-full max-w-sm p-8 rounded-2xl border border-zinc-800 shadow-2xl">
            <h2 className="text-2xl font-black mb-6 text-center text-emerald-500 tracking-widest uppercase">طريقة اللعب</h2>
            <p className="text-zinc-400 text-sm mb-10 text-center leading-relaxed font-medium">خمن الكلمة الخماسية في 6 محاولات فقط. يتم استخدام نهايات التاء المربوطة "ة" في الكلمات المؤنثة.</p>
            <div className="space-y-5">
              <div className="flex items-center gap-4"><div className="w-12 h-12 bg-emerald-600 rounded flex items-center justify-center font-bold text-xl shadow-lg">خ</div><p className="text-xs font-bold text-zinc-300">صحيح وفي مكانه الصحيح.</p></div>
              <div className="flex items-center gap-4"><div className="w-12 h-12 bg-amber-500 rounded flex items-center justify-center font-bold text-xl shadow-lg">س</div><p className="text-xs font-bold text-zinc-300">موجود ولكن بمكان آخر.</p></div>
              <div className="flex items-center gap-4"><div className="w-12 h-12 bg-zinc-800 rounded flex items-center justify-center font-bold text-xl text-zinc-500 border border-zinc-700">م</div><p className="text-xs font-bold text-zinc-500">غير موجود في الكلمة.</p></div>
            </div>
            <button onClick={() => setShowHelp(false)} className="w-full mt-10 bg-zinc-100 text-black py-4 rounded-xl font-black text-lg">ابدأ الآن</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes shake { 0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-6px); } 40%, 80% { transform: translateX(6px); } }
        .animate-shake { animation: shake 0.4s ease-in-out; }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default App;

