import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} min-h-screen bg-background text-foreground antialiased`}
      >
        {/* Global background (full-viewport, neutral) */}
        <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-500/5 blur-[100px] rounded-full" />
        </div>

        {/* Global header */}
        <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/60 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
            <span className="text-xl font-black tracking-tighter text-gradient">
              GENAI LAB
            </span>
            <nav className="flex items-center gap-6">
           
              <div className="h-4 w-px bg-white/10" />
             
            </nav>
          </div>
        </header>

        {/* Main — no spacing, no width enforcement */}
        <main className="relative">
          {children}
        </main>

        {/* Global footer */}
        <footer className="border-t border-white/5">
          <div className="mx-auto max-w-7xl px-6 py-10 text-center">
            <p className="text-xs text-slate-500 tracking-widest uppercase">
              Built for Engineers · Open Source Models Only
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
