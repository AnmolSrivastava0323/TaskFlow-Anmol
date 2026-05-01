// dashboard.js — Dashboard (Admin + Member views)

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className="glass rounded-2xl p-5 hover:border-brand-700/40 transition-all hover:-translate-y-0.5">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${color}`}>{icon}</div>
      </div>
      <p className="text-3xl font-bold mb-0.5">{value}</p>
      <p className="text-sm font-medium text-surface-300">{label}</p>
      {sub && <p className="text-xs text-surface-500 mt-1">{sub}</p>}
    </div>
  );
}

function MiniBar({ label, value, max, color }) {
  const pct = max ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-surface-400 w-20 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-surface-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full progress-bar ${color}`} style={{ width: pct + '%' }} />
      </div>
      <span className="text-xs font-medium text-surface-300 w-6 text-right">{value}</span>
    </div>
  );
}

function AdminDashboard({ data }) {
  const { projects, tasks, users } = data;
  const members = users.filter(u => u.role === 'member');
  const active = projects.filter(p => p.status === 'active').length;
  const todo = tasks.filter(t => t.status === 'todo').length;
  const inProgress = tasks.filter(t => t.status === 'in-progress').length;
  const done = tasks.filter(t => t.status === 'done').length;
  const total = tasks.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-surface-400 text-sm mt-1">Overview of all projects and team activity</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="📁" label="Total Projects" value={projects.length} sub={`${active} active`} color="bg-brand-900/50 text-brand-400" />
        <StatCard icon="✅" label="Total Tasks" value={total} sub={`${done} completed`} color="bg-green-900/50 text-green-400" />
        <StatCard icon="⚡" label="In Progress" value={inProgress} color="bg-amber-900/50 text-amber-400" />
        <StatCard icon="👥" label="Team Members" value={members.length} color="bg-purple-900/50 text-purple-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks by status */}
        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold mb-5">Tasks by Status</h2>
          <div className="space-y-4">
            <MiniBar label="To Do" value={todo} max={total} color="bg-surface-400" />
            <MiniBar label="In Progress" value={inProgress} max={total} color="bg-amber-500" />
            <MiniBar label="Done" value={done} max={total} color="bg-green-500" />
          </div>
          <div className="mt-5 flex gap-4 text-xs text-surface-400">
            {[['bg-surface-400','To Do'],['bg-amber-500','In Progress'],['bg-green-500','Done']].map(([c,l]) => (
              <div key={l} className="flex items-center gap-1.5"><div className={`w-2 h-2 rounded-full ${c}`}/>{l}</div>
            ))}
          </div>
        </div>

        {/* Project progress */}
        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold mb-5">Project Progress</h2>
          <div className="space-y-4">
            {projects.map(p => {
              const ptasks = tasks.filter(t => t.projectId === p.id);
              const pdone = ptasks.filter(t => t.status === 'done').length;
              const pct = ptasks.length ? Math.round((pdone / ptasks.length) * 100) : 0;
              return (
                <div key={p.id}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium truncate">{p.name}</span>
                    <span className="text-surface-400 shrink-0 ml-2">{pct}%</span>
                  </div>
                  <div className="h-2 bg-surface-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full progress-bar bg-gradient-to-r from-brand-600 to-brand-400" style={{ width: pct + '%' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Members overview */}
        <div className="glass rounded-2xl p-6 lg:col-span-2">
          <h2 className="font-semibold mb-5">Team Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {members.map(m => {
              const mt = tasks.filter(t => t.assignedTo === m.id);
              const md = mt.filter(t => t.status === 'done').length;
              return (
                <div key={m.id} className="bg-surface-900 rounded-xl p-4 text-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center font-bold mx-auto mb-2">{m.avatar}</div>
                  <p className="text-sm font-medium">{m.name}</p>
                  <p className="text-xs text-surface-400 mt-1">{mt.length} tasks · {md} done</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function MemberDashboard({ data, user }) {
  const myTasks = data.tasks.filter(t => t.assignedTo === user.id);
  const pending = myTasks.filter(t => t.status !== 'done');
  const done = myTasks.filter(t => t.status === 'done');
  const inProgress = myTasks.filter(t => t.status === 'in-progress');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Dashboard</h1>
        <p className="text-surface-400 text-sm mt-1">Welcome back, {user.name.split(' ')[0]} 👋</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon="📋" label="Total Tasks" value={myTasks.length} color="bg-brand-900/50 text-brand-400" />
        <StatCard icon="⏳" label="Pending" value={pending.length} color="bg-amber-900/50 text-amber-400" />
        <StatCard icon="✅" label="Completed" value={done.length} color="bg-green-900/50 text-green-400" />
      </div>

      <div className="glass rounded-2xl p-6">
        <h2 className="font-semibold mb-4">My Tasks</h2>
        {myTasks.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-surface-400">No tasks yet. Ask your admin to assign one.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {myTasks.map(task => {
              const proj = data.projects.find(p => p.id === task.projectId);
              return (
                <div key={task.id} className="flex items-center gap-4 p-4 bg-surface-900 rounded-xl hover:bg-surface-800 transition-colors">
                  <PriorityBadge priority={task.priority} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{task.title}</p>
                    <p className="text-xs text-surface-500">{proj?.name}</p>
                  </div>
                  <StatusBadge status={task.status} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Dashboard({ data, user }) {
  return user.role === 'admin'
    ? <AdminDashboard data={data} />
    : <MemberDashboard data={data} user={user} />;
}

// Shared badge components
function PriorityBadge({ priority }) {
  const map = { high: 'bg-red-900/50 text-red-400 border-red-800/50', medium: 'bg-amber-900/50 text-amber-400 border-amber-800/50', low: 'bg-green-900/50 text-green-400 border-green-800/50' };
  return <span className={`text-xs px-2.5 py-1 rounded-full border font-medium capitalize ${map[priority] || map.low}`}>{priority}</span>;
}

function StatusBadge({ status }) {
  const map = { 'todo': 'bg-surface-800 text-surface-300', 'in-progress': 'bg-amber-900/50 text-amber-400', 'done': 'bg-green-900/50 text-green-400' };
  const labels = { 'todo': 'To Do', 'in-progress': 'In Progress', 'done': 'Done' };
  return <span className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${map[status] || map.todo}`}>{labels[status] || status}</span>;
}
