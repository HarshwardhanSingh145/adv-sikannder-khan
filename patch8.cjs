const fs = require('fs');
let code = fs.readFileSync('src/components/admin/AdminDashboard.tsx', 'utf8');
code = code.replace(/const \[isLoading, setIsLoading\] = useState\(true\);\n\n  React.useEffect\(\(\) => {\n    const timer = setTimeout\(\(\) => setIsLoading\(false\), 500\);\n    return \(\) => clearTimeout\(timer\);\n  }, \[\]\);\n\n  useLayoutEffect\(\(\) => {\n    if \(isLoading\) return;/g, '  useLayoutEffect(() => {');
const search2 = `  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col font-sans overflow-hidden bg-[#151619]">
        <PremiumBackground />
        <header className="h-20 bg-white/[0.03] backdrop-blur-xl border-b border-white/10 px-8 flex items-center justify-between shrink-0 z-20">
          <div className="w-48 h-8 bg-white/5 rounded-md animate-pulse" />
          <div className="flex gap-4">
             <div className="w-8 h-8 bg-white/5 rounded-full animate-pulse" />
             <div className="w-8 h-8 bg-white/5 rounded-full animate-pulse" />
          </div>
        </header>
        <div className="flex flex-1 overflow-hidden">
          <aside className="w-72 bg-white/[0.02] backdrop-blur-xl border-r border-white/10 flex flex-col z-20 shrink-0 p-4 gap-4">
             {[...Array(6)].map((_, i) => (
                <div key={i} className="w-full h-12 bg-white/5 rounded-xl animate-pulse" />
             ))}
          </aside>
          <main className="flex-1 overflow-hidden relative flex p-8 gap-8">
            <div className="flex-1 flex flex-col gap-8">
              <div className="w-1/3 h-10 bg-white/5 rounded-md animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                   <div key={i} className="h-32 bg-white/5 rounded-[24px] animate-pulse" />
                ))}
              </div>
              <div className="flex-1 bg-white/5 rounded-[24px] animate-pulse mt-4" />
            </div>
          </main>
        </div>
      </div>
    );
  }`;
code = code.replace(search2, '');
fs.writeFileSync('src/components/admin/AdminDashboard.tsx', code);
