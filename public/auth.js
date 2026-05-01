// auth.js — Login Screen Component

function LoginScreen({ onLogin }) {
  const [name, setName] = React.useState('');
  const [role, setRole] = React.useState('member');
  const [error, setError] = React.useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) { setError('Please enter your name.'); return; }
    const data = window.PF.loadData();
    // Find existing user by name+role or create new
    let user = data.users.find(u => u.name.toLowerCase() === name.trim().toLowerCase() && u.role === role);
    if (!user) {
      if (role === 'admin') {
        // Only allow admin login if user exists
        const existing = data.users.find(u => u.name.toLowerCase() === name.trim().toLowerCase());
        if (!existing) {
          user = { id: 'u' + Date.now(), name: name.trim(), role: 'admin', avatar: name.trim().split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2) };
          data.users.push(user);
        } else {
          user = existing;
          user.role = 'admin';
        }
      } else {
        user = { id: 'u' + Date.now(), name: name.trim(), role: 'member', avatar: name.trim().split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2) };
        data.users.push(user);
      }
    }
    data.session = user;
    window.PF.saveData(data);
    onLogin(user, data);
  }

  const suggestions = role === 'admin' ? ['Alice Admin'] : ['Bob Builder', 'Carol Chen', 'Dan Dev'];

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-2xl font-bold shadow-lg shadow-brand-900/50">P</div>
            <span className="text-3xl font-bold bg-gradient-to-r from-brand-300 to-brand-500 bg-clip-text text-transparent">ProFlow</span>
          </div>
          <p className="text-surface-300 text-sm">Project management for modern teams</p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8">
          <h1 className="text-xl font-semibold mb-6 text-center">Sign In</h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role toggle */}
            <div>
              <label className="text-xs font-medium text-surface-300 uppercase tracking-wider block mb-2">Select Role</label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-surface-900 rounded-xl">
                {['admin','member'].map(r => (
                  <button key={r} type="button" onClick={() => setRole(r)}
                    className={`py-2.5 rounded-lg text-sm font-medium transition-all ${role===r ? 'bg-brand-600 text-white shadow-lg' : 'text-surface-400 hover:text-white'}`}>
                    {r === 'admin' ? '👑 Admin' : '👤 Member'}
                  </button>
                ))}
              </div>
            </div>

            {/* Name input */}
            <div>
              <label className="text-xs font-medium text-surface-300 uppercase tracking-wider block mb-2">Your Name</label>
              <input id="login-name" value={name} onChange={e => { setName(e.target.value); setError(''); }}
                placeholder="Enter your name..."
                className="w-full bg-surface-900 border border-surface-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 transition-colors placeholder-surface-600" />
              {/* Suggestions */}
              <div className="flex flex-wrap gap-2 mt-2">
                {suggestions.map(s => (
                  <button key={s} type="button" onClick={() => setName(s)}
                    className="text-xs px-3 py-1 rounded-full bg-surface-800 text-surface-400 hover:text-brand-300 hover:bg-surface-700 transition-all">
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button type="submit" id="login-submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold hover:from-brand-500 hover:to-brand-400 transition-all shadow-lg shadow-brand-900/40 hover:shadow-brand-800/50 hover:-translate-y-0.5 active:translate-y-0">
              Sign In →
            </button>
          </form>

          <p className="text-center text-xs text-surface-600 mt-6">
            Sample users: Alice Admin (admin), Bob Builder, Carol Chen, Dan Dev (members)
          </p>
        </div>
      </div>
    </div>
  );
}
