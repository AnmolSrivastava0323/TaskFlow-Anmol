// projects.js — Projects Module (list + detail with tasks)

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="glass rounded-2xl p-6 w-full max-w-md slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-lg">{title}</h3>
          <button onClick={onClose} className="text-surface-400 hover:text-white text-xl leading-none transition-colors">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      {label && <label className="text-xs font-medium text-surface-300 uppercase tracking-wider block mb-1.5">{label}</label>}
      <input className="w-full bg-surface-900 border border-surface-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 transition-colors placeholder-surface-600" {...props} />
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div>
      {label && <label className="text-xs font-medium text-surface-300 uppercase tracking-wider block mb-1.5">{label}</label>}
      <textarea className="w-full bg-surface-900 border border-surface-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 transition-colors placeholder-surface-600 resize-none" rows={3} {...props} />
    </div>
  );
}

function Select({ label, options, ...props }) {
  return (
    <div>
      {label && <label className="text-xs font-medium text-surface-300 uppercase tracking-wider block mb-1.5">{label}</label>}
      <select className="w-full bg-surface-900 border border-surface-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-500 transition-colors" {...props}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function Btn({ children, variant = 'primary', className = '', ...props }) {
  const styles = {
    primary: 'bg-brand-600 hover:bg-brand-500 text-white',
    secondary: 'bg-surface-800 hover:bg-surface-700 text-surface-200',
    danger: 'bg-red-700 hover:bg-red-600 text-white',
  };
  return (
    <button className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

// ---- Project Form Modal ----
function ProjectFormModal({ project, members, onSave, onClose }) {
  const [form, setForm] = React.useState({
    name: project?.name || '',
    description: project?.description || '',
    status: project?.status || 'active',
    members: project?.members || [],
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleMember = id => set('members', form.members.includes(id) ? form.members.filter(m => m !== id) : [...form.members, id]);

  function handleSave() {
    if (!form.name.trim()) return;
    onSave(form);
  }

  return (
    <Modal title={project ? 'Edit Project' : 'New Project'} onClose={onClose}>
      <div className="space-y-4">
        <Input label="Project Name" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Enter project name..." />
        <Textarea label="Description" value={form.description} onChange={e => set('description', e.target.value)} placeholder="What is this project about?" />
        <Select label="Status" value={form.status} onChange={e => set('status', e.target.value)}
          options={[{ value: 'active', label: 'Active' }, { value: 'archived', label: 'Archived' }]} />
        <div>
          <label className="text-xs font-medium text-surface-300 uppercase tracking-wider block mb-2">Assign Members</label>
          <div className="flex flex-wrap gap-2">
            {members.map(m => (
              <button key={m.id} type="button" onClick={() => toggleMember(m.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${form.members.includes(m.id) ? 'bg-brand-600/30 text-brand-300 border-brand-600/50' : 'bg-surface-800 text-surface-400 border-surface-700 hover:border-surface-500'}`}>
                {m.name}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <Btn variant="secondary" onClick={onClose} className="flex-1">Cancel</Btn>
          <Btn onClick={handleSave} className="flex-1">{project ? 'Save Changes' : 'Create Project'}</Btn>
        </div>
      </div>
    </Modal>
  );
}

// ---- Task Form Modal ----
function TaskFormModal({ task, projectId, members, onSave, onClose }) {
  const [form, setForm] = React.useState({
    title: task?.title || '',
    description: task?.description || '',
    assignedTo: task?.assignedTo || (members[0]?.id || ''),
    priority: task?.priority || 'medium',
    status: task?.status || 'todo',
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <Modal title={task ? 'Edit Task' : 'New Task'} onClose={onClose}>
      <div className="space-y-4">
        <Input label="Task Title" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Enter task title..." />
        <Textarea label="Description" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Task details..." />
        <Select label="Assigned To" value={form.assignedTo} onChange={e => set('assignedTo', e.target.value)}
          options={members.map(m => ({ value: m.id, label: m.name }))} />
        <div className="grid grid-cols-2 gap-3">
          <Select label="Priority" value={form.priority} onChange={e => set('priority', e.target.value)}
            options={[{ value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' }]} />
          <Select label="Status" value={form.status} onChange={e => set('status', e.target.value)}
            options={[{ value: 'todo', label: 'To Do' }, { value: 'in-progress', label: 'In Progress' }, { value: 'done', label: 'Done' }]} />
        </div>
        <div className="flex gap-3 pt-2">
          <Btn variant="secondary" onClick={onClose} className="flex-1">Cancel</Btn>
          <Btn onClick={() => form.title.trim() && onSave(form)} className="flex-1">{task ? 'Save' : 'Create Task'}</Btn>
        </div>
      </div>
    </Modal>
  );
}

// ---- Task Detail / Comments ----
function TaskDetailModal({ task, data, user, onUpdateStatus, onClose, onAddComment }) {
  const [comment, setComment] = React.useState('');
  const assignee = data.users.find(u => u.id === task.assignedTo);
  const isAdmin = user.role === 'admin';
  const canUpdateStatus = isAdmin || task.assignedTo === user.id;
  const nextStatus = { 'todo': 'in-progress', 'in-progress': 'done', 'done': null };
  const nextLabel = { 'todo': 'Start Task', 'in-progress': 'Mark Done', 'done': null };

  return (
    <Modal title="Task Details" onClose={onClose}>
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <PriorityBadge priority={task.priority} />
            <StatusBadge status={task.status} />
          </div>
          <h3 className="text-lg font-semibold">{task.title}</h3>
          <p className="text-sm text-surface-400 mt-1">{task.description || 'No description.'}</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-xs font-bold">{assignee?.avatar}</div>
          <span className="text-surface-300">{assignee?.name}</span>
        </div>

        {canUpdateStatus && nextStatus[task.status] && (
          <Btn onClick={() => onUpdateStatus(nextStatus[task.status])} className="w-full">
            {nextLabel[task.status]}
          </Btn>
        )}

        {/* Comments */}
        <div>
          <p className="text-xs font-medium text-surface-300 uppercase tracking-wider mb-3">Comments ({task.comments?.length || 0})</p>
          {(task.comments || []).length === 0 && <p className="text-sm text-surface-600 text-center py-4">No comments yet.</p>}
          <div className="space-y-3 mb-4">
            {(task.comments || []).map(c => {
              const cu = data.users.find(u => u.id === c.userId);
              return (
                <div key={c.id} className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{cu?.avatar}</div>
                  <div className="flex-1 bg-surface-900 rounded-xl p-3">
                    <p className="text-xs font-medium text-brand-300 mb-1">{cu?.name}</p>
                    <p className="text-sm text-surface-300">{c.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex gap-2">
            <input value={comment} onChange={e => setComment(e.target.value)} placeholder="Add a comment..."
              className="flex-1 bg-surface-900 border border-surface-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-brand-500 transition-colors"
              onKeyDown={e => { if (e.key === 'Enter' && comment.trim()) { onAddComment(comment.trim()); setComment(''); } }} />
            <Btn onClick={() => { if (comment.trim()) { onAddComment(comment.trim()); setComment(''); } }}>Post</Btn>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// ---- Project Detail View ----
function ProjectDetail({ project, data, user, onBack, onDataChange }) {
  const isAdmin = user.role === 'admin';
  const allTasks = data.tasks.filter(t => t.projectId === project.id);
  const myTasks = isAdmin ? allTasks : allTasks.filter(t => t.assignedTo === user.id);
  const done = allTasks.filter(t => t.status === 'done').length;
  const pct = allTasks.length ? Math.round((done / allTasks.length) * 100) : 0;
  const projMembers = data.users.filter(u => project.members.includes(u.id));

  const [showTaskForm, setShowTaskForm] = React.useState(false);
  const [editTask, setEditTask] = React.useState(null);
  const [viewTask, setViewTask] = React.useState(null);
  const [filter, setFilter] = React.useState('all');

  function createTask(form) {
    const newTask = { id: 't' + Date.now(), projectId: project.id, createdAt: new Date().toISOString().split('T')[0], comments: [], ...form };
    const d = { ...data, tasks: [...data.tasks, newTask] };
    window.PF.saveData(d); onDataChange(d); setShowTaskForm(false);
  }

  function saveTask(form) {
    const d = { ...data, tasks: data.tasks.map(t => t.id === editTask.id ? { ...t, ...form } : t) };
    window.PF.saveData(d); onDataChange(d); setEditTask(null);
  }

  function deleteTask(id) {
    if (!confirm('Delete this task?')) return;
    const d = { ...data, tasks: data.tasks.filter(t => t.id !== id) };
    window.PF.saveData(d); onDataChange(d);
  }

  function updateStatus(taskId, status) {
    const d = { ...data, tasks: data.tasks.map(t => t.id === taskId ? { ...t, status } : t) };
    window.PF.saveData(d); onDataChange(d);
    if (viewTask) setViewTask(d.tasks.find(t => t.id === taskId));
  }

  function addComment(taskId, text) {
    const comment = { id: 'c' + Date.now(), userId: user.id, text, createdAt: new Date().toISOString() };
    const d = { ...data, tasks: data.tasks.map(t => t.id === taskId ? { ...t, comments: [...(t.comments||[]), comment] } : t) };
    window.PF.saveData(d); onDataChange(d);
    if (viewTask) setViewTask(d.tasks.find(t => t.id === taskId));
  }

  const filtered = myTasks.filter(t => filter === 'all' || t.status === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <button onClick={onBack} className="mt-1 text-surface-400 hover:text-white transition-colors text-lg">←</button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${project.status === 'active' ? 'bg-green-900/50 text-green-400' : 'bg-surface-800 text-surface-400'}`}>
              {project.status}
            </span>
          </div>
          <p className="text-surface-400 text-sm mt-1">{project.description}</p>
        </div>
        {isAdmin && <Btn onClick={() => setShowTaskForm(true)}>+ New Task</Btn>}
      </div>

      {/* Progress */}
      <div className="glass rounded-2xl p-5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Overall Progress</span>
          <span className="text-sm font-bold text-brand-300">{pct}%</span>
        </div>
        <div className="h-3 bg-surface-800 rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-brand-600 to-brand-400 progress-bar" style={{ width: pct + '%' }} />
        </div>
        <div className="flex gap-4 mt-3 text-xs text-surface-400">
          <span>{allTasks.filter(t=>t.status==='todo').length} to do</span>
          <span>{allTasks.filter(t=>t.status==='in-progress').length} in progress</span>
          <span className="text-green-400">{done} done</span>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {[['all','All'],['todo','To Do'],['in-progress','In Progress'],['done','Done']].map(([v,l]) => (
          <button key={v} onClick={() => setFilter(v)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filter===v ? 'bg-brand-600 text-white' : 'bg-surface-800 text-surface-400 hover:text-white'}`}>
            {l}
          </button>
        ))}
      </div>

      {/* Tasks */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 glass rounded-2xl">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-surface-400">{isAdmin ? 'No tasks yet. Create one!' : 'No tasks assigned to you here.'}</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map(task => {
            const assignee = data.users.find(u => u.id === task.assignedTo);
            return (
              <div key={task.id} className="glass rounded-xl p-4 hover:border-brand-700/30 transition-all cursor-pointer group"
                onClick={() => setViewTask(task)}>
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <PriorityBadge priority={task.priority} />
                      <StatusBadge status={task.status} />
                    </div>
                    <p className="font-medium text-sm">{task.title}</p>
                    {task.description && <p className="text-xs text-surface-500 mt-1 line-clamp-2">{task.description}</p>}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-xs font-bold">{assignee?.avatar}</div>
                      <span className="text-xs text-surface-400">{assignee?.name}</span>
                      {(task.comments||[]).length > 0 && <span className="text-xs text-surface-500 ml-1">💬 {task.comments.length}</span>}
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                      <button onClick={() => setEditTask(task)} className="p-1.5 rounded-lg hover:bg-surface-700 text-surface-400 hover:text-white transition-all text-xs">✏️</button>
                      <button onClick={() => deleteTask(task.id)} className="p-1.5 rounded-lg hover:bg-red-900/40 text-surface-400 hover:text-red-400 transition-all text-xs">🗑️</button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showTaskForm && <TaskFormModal projectId={project.id} members={projMembers.length ? projMembers : data.users.filter(u=>u.role==='member')} onSave={createTask} onClose={() => setShowTaskForm(false)} />}
      {editTask && <TaskFormModal task={editTask} projectId={project.id} members={projMembers.length ? projMembers : data.users.filter(u=>u.role==='member')} onSave={saveTask} onClose={() => setEditTask(null)} />}
      {viewTask && <TaskDetailModal task={viewTask} data={data} user={user}
        onUpdateStatus={s => updateStatus(viewTask.id, s)}
        onAddComment={t => addComment(viewTask.id, t)}
        onClose={() => setViewTask(null)} />}
    </div>
  );
}

// ---- Projects List View ----
function Projects({ data, user, onDataChange }) {
  const isAdmin = user.role === 'admin';
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [showForm, setShowForm] = React.useState(false);
  const [editProject, setEditProject] = React.useState(null);
  const [activeProject, setActiveProject] = React.useState(null);

  if (activeProject) {
    const proj = data.projects.find(p => p.id === activeProject);
    if (proj) return <ProjectDetail project={proj} data={data} user={user} onBack={() => setActiveProject(null)} onDataChange={onDataChange} />;
  }

  const members = data.users.filter(u => u.role === 'member');
  const filtered = data.projects.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  function createProject(form) {
    const p = { id: 'p' + Date.now(), createdAt: new Date().toISOString().split('T')[0], ...form };
    const d = { ...data, projects: [...data.projects, p] };
    window.PF.saveData(d); onDataChange(d); setShowForm(false);
  }

  function saveProject(form) {
    const d = { ...data, projects: data.projects.map(p => p.id === editProject.id ? { ...p, ...form } : p) };
    window.PF.saveData(d); onDataChange(d); setEditProject(null);
  }

  function deleteProject(id) {
    if (!confirm('Delete this project and all its tasks?')) return;
    const d = { ...data, projects: data.projects.filter(p => p.id !== id), tasks: data.tasks.filter(t => t.projectId !== id) };
    window.PF.saveData(d); onDataChange(d);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-surface-400 text-sm mt-1">{data.projects.length} projects total</p>
        </div>
        {isAdmin && <Btn onClick={() => setShowForm(true)}>+ New Project</Btn>}
      </div>

      <div className="flex gap-3 flex-wrap">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects..."
          className="flex-1 min-w-[180px] bg-surface-900 border border-surface-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand-500 transition-colors placeholder-surface-600" />
        {[['all','All'],['active','Active'],['archived','Archived']].map(([v,l]) => (
          <button key={v} onClick={() => setStatusFilter(v)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${statusFilter===v ? 'bg-brand-600 text-white' : 'bg-surface-900 text-surface-400 hover:text-white border border-surface-800'}`}>
            {l}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 glass rounded-2xl">
          <div className="text-5xl mb-4">📁</div>
          <p className="text-surface-300 font-medium">No projects found</p>
          <p className="text-surface-500 text-sm mt-1">{isAdmin ? 'Create your first project!' : 'No projects available.'}</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(project => {
            const ptasks = data.tasks.filter(t => t.projectId === project.id);
            const pdone = ptasks.filter(t => t.status === 'done').length;
            const pct = ptasks.length ? Math.round((pdone / ptasks.length) * 100) : 0;
            const projMembers = data.users.filter(u => project.members.includes(u.id));

            return (
              <div key={project.id} className="glass rounded-2xl p-5 hover:border-brand-700/40 transition-all cursor-pointer group hover:-translate-y-0.5"
                onClick={() => setActiveProject(project.id)}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold truncate">{project.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${project.status === 'active' ? 'bg-green-900/50 text-green-400' : 'bg-surface-800 text-surface-500'}`}>
                        {project.status}
                      </span>
                    </div>
                    <p className="text-xs text-surface-500 line-clamp-2">{project.description}</p>
                  </div>
                  {isAdmin && (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0" onClick={e => e.stopPropagation()}>
                      <button onClick={() => setEditProject(project)} className="p-1.5 rounded-lg hover:bg-surface-700 text-surface-400 hover:text-white transition-all text-sm">✏️</button>
                      <button onClick={() => deleteProject(project.id)} className="p-1.5 rounded-lg hover:bg-red-900/40 text-surface-400 hover:text-red-400 transition-all text-sm">🗑️</button>
                    </div>
                  )}
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-surface-400 mb-1.5">
                    <span>{ptasks.length} tasks</span><span>{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-surface-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-brand-600 to-brand-400 rounded-full progress-bar" style={{ width: pct + '%' }} />
                  </div>
                </div>

                {/* Members */}
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {projMembers.slice(0,4).map(m => (
                      <div key={m.id} title={m.name} className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 border-2 border-surface-900 flex items-center justify-center text-xs font-bold">{m.avatar}</div>
                    ))}
                    {projMembers.length > 4 && <div className="w-7 h-7 rounded-full bg-surface-700 border-2 border-surface-900 flex items-center justify-center text-xs">+{projMembers.length-4}</div>}
                  </div>
                  <span className="text-xs text-surface-500">{project.createdAt}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && <ProjectFormModal members={members} onSave={createProject} onClose={() => setShowForm(false)} />}
      {editProject && <ProjectFormModal project={editProject} members={members} onSave={saveProject} onClose={() => setEditProject(null)} />}
    </div>
  );
}
