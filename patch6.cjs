const fs = require('fs');
let code = fs.readFileSync('src/components/admin/AdminDashboard.tsx', 'utf8');

const search = `      {/* Modals & Popovers */}`;
const replace = `      {/* Modals & Popovers */}
      <React.Suspense fallback={null}>`;

const searchEnd = `    </div>
  );
};`;
const replaceEnd = `      </React.Suspense>
    </div>
  );
};`;

code = code.replace(search, replace).replace(searchEnd, replaceEnd);
fs.writeFileSync('src/components/admin/AdminDashboard.tsx', code);
