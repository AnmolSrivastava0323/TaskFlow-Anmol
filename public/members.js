// members.js — Members Management (Admin only)

function Members({ data, user, onDataChange }) {
  const members = data.users.filter(u => u.role === 'member');
  const [showForm, setShowForm] = React.useState(false);
  const [form, setForm] = React.useState({ name: '', role: 'member' });
  const [err, setErr] = React.useState('');

  function addMember() {
    if (!form.name.trim()) { setErr('Name is required'); return; }
    const exists = data.users.find(u => u.name.toLowerCase() === form.name.trim().toLowerCase());
    if (exists) { setErr('User already exists'); return; }
    const newUser = {
      id: 'u' + Date.now(),
      name: form.name.trim(),
      role: form.role,
      avatar: form.name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2),
    };
    const d = { ...data, users: [...data.users, newUser] };
    window.PF.saveData(d); onDataChange(d);
    setShowForm(false); setForm({ name: '', role: 'member' }); setErr('');
  }

  function removeMember(id) {
    if (id === user.id) { alert("You can't remove yourself."); return; }
    if (!confirm('Remove this member?')) return;
    const d = {
      ...data,
      users: data.users.filter(u => u.id !== id),
      projects: data.projects.map(p => ({ ...p, members: p.members.filter(m => m !== id) })),
    };
    window.PF.saveData(d); onDataChange(d);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Team Members</h1>
          <p className="text-surface-400 text-sm mt-1">{members.length} members on your team</p>
        </div>
        <button id="add-member-btn" onClick={() => setShowForm(s => !s)}
          className="px-4 py-2 rounded-xl text-sm font-medium bg-brand-600 hover:bg-brand-500 text-white transition-all">
          + Add Member
        </button>
      </div>

      {/* Add member form */}
      {showForm && (
        <div className="glass rounded-2xl p-5 slide-up">
          <h3 className="font-medium mb-4">New Member</h3>
          <div className="flex gap-3 flex-wrap">
            <input value={form.name} onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErr(''); }}
              placeholder="Full name..."
              className="flex-1 min-w-[180px] bg-surface-900 border border-surface-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 transition-colors" />
            <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
              className="bg-surface-900 border border-surface-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 transition-colors">
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
            <button onClick={addMember} className="px-4 py-2.5 rounded-xl text-sm font-medium bg-brand-600 hover:bg-brand-500 text-white transition-all">Add</button>
            <button onClick={() => { setShowForm(false); setErr(''); }} className="px-4 py-2.5 rounded-xl text-sm font-medium bg-surface-800 hover:bg-surface-700 text-surface-200 transition-all">Cancel</button>
          </div>
          {err && <p className="text-red-400 text-sm mt-2">{err}</p>}
        </div>
      )}

      {/* Members grid */}
      {members.length === 0 ? (
        <div className="text-center py-20 glass rounded-2xl">
          <div className="text-5xl mb-4">👥</div>
          <p className="text-surface-300 font-medium">No members yet</p>
          <p className="text-surface-500 text-sm mt-1">Add your first team member above.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {members.map(m => {
            const assigned = data.tasks.filter(t => t.assignedTo === m.id);
            const done = assigned.filter(t => t.status === 'done').length;
            const inProgress = assigned.filter(t => t.status === 'in-progress').length;
            const todo = assigned.filter(t => t.status === 'todo').length;
            const pct = assigned.length ? Math.round((done / assigned.length) * 100) : 0;
            const projIds = [...new Set(assigned.map(t => t.projectId))];
            const projNames = projIds.map(id => data.projects.find(p => p.id === id)?.name).filter(Boolean);

            return (
              <div key={m.id} className="glass rounded-2xl p-5 hover:border-brand-700/30 transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-lg font-bold shadow-lg shadow-brand-900/30">
                      {m.avatar}
                    </div>
                    <div>
                      <p className="font-semibold">{m.name}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-surface-800 text-surface-400 capitalize">{m.role}</span>
                    </div>
                  </div>
                  <button onClick={() => removeMember(m.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-red-900/30 text-surface-500 hover:text-red-400 text-sm">
                    🗑️
                  </button>
                </div>

                {/* Task stats */}
                <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                  {[['todo', todo, 'text-surface-300'], ['in-progress', inProgress, 'text-amber-400'], ['done', done, 'text-green-400']].map(([s, v, c]) => (
                    <div key={s} className="bg-surface-900 rounded-xl py-2">
                      <p className={`text-lg font-bold ${c}`}>{v}</p>
                      <p className="text-xs text-surface-500 capitalize">{s === 'in-progress' ? 'WIP' : s}</p>
                    </div>
                  ))}
                </div>

                {/* Progress */}
                {assigned.length > 0 && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-surface-400 mb-1">
                      <span>Completion</span><span>{pct}%</span>
                    </div>
                    <div className="h-1.5 bg-surface-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-brand-600 to-brand-400 rounded-full progress-bar" style={{ width: pct + '%' }} />
                    </div>
                  </div>
                )}

                {/* Projects */}
                {projNames.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {projNames.map(name => (
                      <span key={name} className="text-xs px-2 py-0.5 rounded-full bg-brand-900/40 text-brand-300 border border-brand-800/40">{name}</span>
                    ))}
                  </div>
                )}
                {assigned.length === 0 && <p className="text-xs text-surface-600 text-center mt-2">No tasks assigned yet</p>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
