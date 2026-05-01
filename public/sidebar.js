// sidebar.js — Sidebar + Layout Shell

function Sidebar({ user, page, setPage, onLogout }) {
  const isAdmin = user.role === 'admin';
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'projects', label: 'Projects', icon: '📁' },
    ...(isAdmin ? [{ id: 'members', label: 'Members', icon: '👥' }] : []),
  ];
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14 bg-surface-900 border-b border-surface-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-sm font-bold">P</div>
          <span className="font-bold text-brand-300">ProFlow</span>
        </div>
        <button onClick={() => setMobileOpen(o => !o)} className="p-2 rounded-lg hover:bg-surface-800 transition-colors text-lg">☰</button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && <div className="lg:hidden fixed inset-0 z-40 bg-black/60" onClick={() => setMobileOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-surface-900 border-r border-surface-800 z-50 flex flex-col transition-transform duration-300
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>

        {/* Logo */}
        <div className="p-6 border-b border-surface-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center font-bold shadow-lg shadow-brand-900/40">P</div>
            <span className="text-xl font-bold bg-gradient-to-r from-brand-300 to-brand-500 bg-clip-text text-transparent">ProFlow</span>
          </div>
        </div>

        {/* User badge */}
        <div className="px-4 py-3 mx-4 mt-4 rounded-xl bg-surface-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-sm font-bold shrink-0">{user.avatar}</div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-surface-400 capitalize">{user.role}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 mt-2">
          {navItems.map(item => (
            <button key={item.id} id={`nav-${item.id}`}
              onClick={() => { setPage(item.id); setMobileOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                ${page === item.id
                  ? 'bg-brand-600/20 text-brand-300 border border-brand-600/30'
                  : 'text-surface-400 hover:text-white hover:bg-surface-800'}`}>
              <span className="text-base">{item.icon}</span>
              {item.label}
              {page === item.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-400" />}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-surface-800">
          <button id="logout-btn" onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-surface-400 hover:text-red-400 hover:bg-red-950/30 transition-all">
            <span>🚪</span> Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

function AppLayout({ user, page, setPage, onLogout, children }) {
  return (
    <div className="flex min-h-screen bg-surface-950">
      <Sidebar user={user} page={page} setPage={setPage} onLogout={onLogout} />
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0 min-h-screen">
        <div className="p-6 max-w-7xl mx-auto fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
