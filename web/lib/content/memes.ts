export interface Meme {
  id: string;
  emoji: string;
  caption: string;
  category: "teknis" | "kehidupan" | "inspirasi" | "ngakak";
}

export const MODULE_MEMES: Record<string, Meme[]> = {
  M0: [
    { id: "m0-1", emoji: "🤔", caption: "Pretest: where you realize you know nothing, and that's okay.", category: "inspirasi" },
    { id: "m0-2", emoji: "😅", caption: "Me clicking 'next' on every question like I understand.", category: "kehidupan" },
    { id: "m0-3", emoji: "🧭", caption: "Orientasi: 90% nonton, 10% panik, 100% semangat!", category: "teknis" },
    { id: "m0-4", emoji: "🚶", caption: "Langkah pertama memang berat. Tapi jalanin aja!", category: "inspirasi" },
  ],
  M1: [
    { id: "m1-1", emoji: "💻", caption: "Me installing VS Code for the 5th time 'this time will be different'.", category: "kehidupan" },
    { id: "m1-2", emoji: "🖥️", caption: "Terminal: the room where Ctrl+C and Ctrl+V are the only skills you need.", category: "teknis" },
    { id: "m1-3", emoji: "📂", caption: "My desktop after learning file systems: organized chaos.", category: "kehidupan" },
    { id: "m1-4", emoji: "🛠️", caption: "Workspace setup: 10% coding, 90% configuring extensions.", category: "teknis" },
  ],
  M2: [
    { id: "m2-1", emoji: "🧠", caption: "Me explaining my algorithm to my cat.", category: "kehidupan" },
    { id: "m2-2", emoji: "🤯", caption: "When the flowchart has more arrows than my brain has neurons.", category: "teknis" },
    { id: "m2-3", emoji: "🗺️", caption: "Algoritma: cara paling ribet buat nyuruh komputer ngerti.", category: "teknis" },
    { id: "m2-4", emoji: "💡", caption: "When your pseudocode actually works on the first try.", category: "inspirasi" },
  ],
  M3: [
    { id: "m3-1", emoji: "📦", caption: "Me naming variables: x, xx, xxx, xFinal, xFinalFinal.", category: "kehidupan" },
    { id: "m3-2", emoji: "🔤", caption: "String? Integer? Float? Bro, I just met her!", category: "teknis" },
    { id: "m3-3", emoji: "🎭", caption: "TypeError: 'int' object is not callable — my 13th reason.", category: "teknis" },
    { id: "m3-4", emoji: "📝", caption: "Python: where indentation is more important than your feelings.", category: "ngakak" },
  ],
  M4: [
    { id: "m4-1", emoji: "🔀", caption: "If-else: Decisions, decisions, decisions everywhere!", category: "teknis" },
    { id: "m4-2", emoji: "🤷", caption: "Nested if-else sampai 10 level: 'I am become spaghetti'", category: "teknis" },
    { id: "m4-3", emoji: "⚖️", caption: "Ternary operator: the fancy way to confuse your friends.", category: "kehidupan" },
    { id: "m4-4", emoji: "🎲", caption: "When your if condition is always False but you don't know why.", category: "ngakak" },
  ],
  M5: [
    { id: "m5-1", emoji: "🔄", caption: "While (alive): eat(), sleep(), code(), repeat().", category: "kehidupan" },
    { id: "m5-2", emoji: "♾️", caption: "For loop: the only time counting from 0 makes sense.", category: "teknis" },
    { id: "m5-3", emoji: "😵", caption: "Accidental infinite loop? Just close the terminal, bro.", category: "ngakak" },
    { id: "m5-4", emoji: "🏃", caption: "Break vs Continue: one stops, the other ghosts you.", category: "teknis" },
  ],
  M6: [
    { id: "m6-1", emoji: "🪄", caption: "DRY: Don't Repeat Yourself (Why write 3 lines when 1 function works?)", category: "teknis" },
    { id: "m6-2", emoji: "🐍", caption: "def fungsi(): return 'gak ngerti' — mood hari ini.", category: "kehidupan" },
    { id: "m6-3", emoji: "🧩", caption: "Parameter vs argument: they're the same picture.jpg", category: "teknis" },
    { id: "m6-4", emoji: "🎯", caption: "Return statement: fungsi pulang bawa oleh-oleh.", category: "ngakak" },
  ],
  M7: [
    { id: "m7-1", emoji: "📊", caption: "Me organizing data in Python lists like a pro.", category: "teknis" },
    { id: "m7-2", emoji: "🎪", caption: "List comprehension: because 3 lines is too many.", category: "teknis" },
    { id: "m7-3", emoji: "🐪", caption: "Index out of range? But I only have 5 items!", category: "ngakak" },
    { id: "m7-4", emoji: "🗂️", caption: "Append vs Extend: they're not the same, and it matters.", category: "teknis" },
  ],
  M8: [
    { id: "m8-1", emoji: "⛑️", caption: "It's not much, but it's honest coding work!", category: "inspirasi" },
    { id: "m8-2", emoji: "🚀", caption: "Mini project: where you realize tutorials lied to you.", category: "kehidupan" },
    { id: "m8-3", emoji: "🎉", caption: "When your project finally runs without errors on the 50th try.", category: "inspirasi" },
    { id: "m8-4", emoji: "🏁", caption: "Finish line: You did it! Now go touch some grass.", category: "kehidupan" },
  ],
};

export function getRandomMemes(moduleId: string, count: number = 1): Meme[] {
  const pool = MODULE_MEMES[moduleId] || MODULE_MEMES["M0"];
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getMemeByCategory(moduleId: string, category: Meme["category"]): Meme | undefined {
  const pool = MODULE_MEMES[moduleId] || MODULE_MEMES["M0"];
  const filtered = pool.filter((m) => m.category === category);
  if (filtered.length === 0) return pool[Math.floor(Math.random() * pool.length)];
  return filtered[Math.floor(Math.random() * filtered.length)];
}
