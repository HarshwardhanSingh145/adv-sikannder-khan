const fs = require('fs');
let code = fs.readFileSync('src/components/admin/AdminDashboard.tsx', 'utf8');

const search = `      {/* EDIT CASE MODAL */}`;
const replace = `      <React.Suspense fallback={null}>
      {/* EDIT CASE MODAL */}`;

code = code.replace(search, replace);
fs.writeFileSync('src/components/admin/AdminDashboard.tsx', code);
