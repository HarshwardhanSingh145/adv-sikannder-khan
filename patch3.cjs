const fs = require('fs');
let code = fs.readFileSync('src/components/admin/AdminDashboard.tsx', 'utf8');

const search = `                <div className="grid grid-cols-7 gap-2 min-h-[320px]">
                  {Array.from({ length: 31 }).map((_, i) => {
                    const dayNum = i + 1;
                    const dateStr = \`2026-08-\${dayNum < 10 ? "0" + dayNum : dayNum}\`;
                    const dayCases = React.useMemo(() => cases.filter(
                      (c) => c.hearings.some((h) => h.currentHearingDate === dateStr || h.nextHearingDate === dateStr)
                    ), [cases, dateStr]);`;

const replace = `                <div className="grid grid-cols-7 gap-2 min-h-[320px]">
                  {Array.from({ length: 31 }).map((_, i) => {
                    const dayNum = i + 1;
                    const dateStr = \`2026-08-\${dayNum < 10 ? "0" + dayNum : dayNum}\`;
                    const dayCases = cases.filter(
                      (c) => c.hearings.some((h) => h.currentHearingDate === dateStr || h.nextHearingDate === dateStr)
                    );`;

code = code.replace(search, replace);
fs.writeFileSync('src/components/admin/AdminDashboard.tsx', code);
