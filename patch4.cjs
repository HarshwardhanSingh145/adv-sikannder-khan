const fs = require('fs');
let code = fs.readFileSync('src/components/admin/AdminDashboard.tsx', 'utf8');

const search = `  // Pin & Star Sorting`;
const replace = `  const casesByDate = React.useMemo(() => {
    const map = new Map();
    cases.forEach(c => {
      c.hearings.forEach(h => {
        if (h.currentHearingDate) {
          if (!map.has(h.currentHearingDate)) map.set(h.currentHearingDate, []);
          if (!map.get(h.currentHearingDate).includes(c)) map.get(h.currentHearingDate).push(c);
        }
        if (h.nextHearingDate) {
          if (!map.has(h.nextHearingDate)) map.set(h.nextHearingDate, []);
          if (!map.get(h.nextHearingDate).includes(c)) map.get(h.nextHearingDate).push(c);
        }
      });
    });
    return map;
  }, [cases]);

  // Pin & Star Sorting`;

const search2 = `                    const dayCases = cases.filter(
                      (c) => c.hearings.some((h) => h.currentHearingDate === dateStr || h.nextHearingDate === dateStr)
                    );`;
const replace2 = `                    const dayCases = casesByDate.get(dateStr) || [];`;

code = code.replace(search, replace).replace(search2, replace2);
fs.writeFileSync('src/components/admin/AdminDashboard.tsx', code);
