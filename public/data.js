// data.js — Storage utilities and seed data

const STORAGE_KEY = 'proflow_data';

const SEED = {
  users: [
    { id: 'u1', name: 'Alice Admin', role: 'admin', avatar: 'AA' },
    { id: 'u2', name: 'Bob Builder', role: 'member', avatar: 'BB' },
    { id: 'u3', name: 'Carol Chen', role: 'member', avatar: 'CC' },
    { id: 'u4', name: 'Dan Dev', role: 'member', avatar: 'DD' },
  ],
  projects: [
    { id: 'p1', name: 'Website Redesign', description: 'Redesign the company website with modern UI/UX principles.', status: 'active', createdAt: '2026-04-01', members: ['u2','u3'] },
    { id: 'p2', name: 'Mobile App v2', description: 'Build the next version of our mobile application with new features.', status: 'active', createdAt: '2026-04-10', members: ['u2','u4'] },
    { id: 'p3', name: 'API Migration', description: 'Migrate legacy REST APIs to GraphQL.', status: 'archived', createdAt: '2026-03-15', members: ['u3','u4'] },
  ],
  tasks: [
    { id: 't1', projectId: 'p1', title: 'Design new homepage', description: 'Create Figma mockups for the new homepage layout.', assignedTo: 'u2', priority: 'high', status: 'in-progress', createdAt: '2026-04-05', comments: [{ id:'c1', userId:'u2', text:'Started working on wireframes!', createdAt:'2026-04-06' }] },
    { id: 't2', projectId: 'p1', title: 'Write content copy', description: 'Write all copy for hero, about, and services sections.', assignedTo: 'u3', priority: 'medium', status: 'todo', createdAt: '2026-04-06', comments: [] },
    { id: 't3', projectId: 'p1', title: 'SEO audit', description: 'Run full SEO audit and fix critical issues.', assignedTo: 'u2', priority: 'low', status: 'done', createdAt: '2026-04-07', comments: [] },
    { id: 't4', projectId: 'p2', title: 'Auth module', description: 'Implement JWT-based authentication flow.', assignedTo: 'u4', priority: 'high', status: 'in-progress', createdAt: '2026-04-12', comments: [] },
    { id: 't5', projectId: 'p2', title: 'Push notifications', description: 'Integrate Firebase push notifications.', assignedTo: 'u2', priority: 'medium', status: 'todo', createdAt: '2026-04-13', comments: [] },
    { id: 't6', projectId: 'p3', title: 'Schema design', description: 'Design GraphQL schema for all existing endpoints.', assignedTo: 'u3', priority: 'high', status: 'done', createdAt: '2026-03-20', comments: [] },
    { id: 't7', projectId: 'p3', title: 'Write resolvers', description: 'Implement resolvers for all query and mutation types.', assignedTo: 'u4', priority: 'high', status: 'done', createdAt: '2026-03-22', comments: [] },
  ],
  session: null,
};

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  const data = JSON.parse(JSON.stringify(SEED));
  saveData(data);
  return data;
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

window.PF = { loadData, saveData, STORAGE_KEY };
