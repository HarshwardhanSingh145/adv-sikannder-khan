const fs = require('fs');
let code = fs.readFileSync('src/context/AdminContext.tsx', 'utf8');

const search = `  // Session Activity Timeout tracking
  useEffect(() => {
    if (!isLoggedIn) return;

    const checkIdle = () => {
      const elapsed = Date.now() - session.lastActiveTime;
      if (elapsed > idleTimeoutMinutes * 60 * 1000) {
        logout();
        alert(\`Session expired due to \${idleTimeoutMinutes} minutes of inactivity. Please re-enter Security PIN.\`);
      }
    };

    const interval = setInterval(checkIdle, 30000);
    const updateActivity = () => {
      setSession((prev) => ({ ...prev, lastActiveTime: Date.now() }));
    };

    window.addEventListener("mousemove", updateActivity);
    window.addEventListener("keydown", updateActivity);

    return () => {
      clearInterval(interval);
      window.removeEventListener("mousemove", updateActivity);
      window.removeEventListener("keydown", updateActivity);
    };
  }, [isLoggedIn, idleTimeoutMinutes, session.lastActiveTime]);`;

const replace = `  // Session Activity Timeout tracking
  const lastActiveTimeRef = React.useRef(Date.now());
  
  useEffect(() => {
    if (!isLoggedIn) return;

    const checkIdle = () => {
      const elapsed = Date.now() - lastActiveTimeRef.current;
      if (elapsed > idleTimeoutMinutes * 60 * 1000) {
        logout();
        alert(\`Session expired due to \${idleTimeoutMinutes} minutes of inactivity. Please re-enter Security PIN.\`);
      }
    };

    const interval = setInterval(checkIdle, 30000);
    
    // Throttle the mousemove to avoid too many event triggers, though it only updates a ref now
    let throttleTimeout;
    const updateActivity = () => {
      if (!throttleTimeout) {
        throttleTimeout = setTimeout(() => {
          lastActiveTimeRef.current = Date.now();
          throttleTimeout = null;
        }, 1000);
      }
    };

    window.addEventListener("mousemove", updateActivity, { passive: true });
    window.addEventListener("keydown", updateActivity, { passive: true });

    return () => {
      clearInterval(interval);
      if (throttleTimeout) clearTimeout(throttleTimeout);
      window.removeEventListener("mousemove", updateActivity);
      window.removeEventListener("keydown", updateActivity);
    };
  }, [isLoggedIn, idleTimeoutMinutes]);`;

code = code.replace(search, replace);

const contextSearch = `  const contextValue = {
    isLoggedIn,
    pin,
    idleTimeoutMinutes,`;

const contextReplace = `  const contextValue = React.useMemo(() => ({
    isLoggedIn,
    pin,
    idleTimeoutMinutes,`;

const contextEndSearch = `    exportBackupJson,
    importBackupJson,
  };

  return (
    <AdminContext.Provider value={contextValue}>`;

const contextEndReplace = `    exportBackupJson,
    importBackupJson,
  }), [
    isLoggedIn, pin, idleTimeoutMinutes, failedPinAttempts, lockoutEndTime, session,
    forgotPinMobile, sentOtp, otpExpiryTime, otpVerified,
    cases, activeCase, clients, news, reminders, payments, auditLogs
  ]);

  return (
    <AdminContext.Provider value={contextValue}>`;

code = code.replace(contextSearch, contextReplace).replace(contextEndSearch, contextEndReplace);

fs.writeFileSync('src/context/AdminContext.tsx', code);
