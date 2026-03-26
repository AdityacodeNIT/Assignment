import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';

// Ensure base URL leverages production environment variables
axios.defaults.baseURL = import.meta.env.VITE_API_URL || '';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  // hold all dash data here
  const [data, setData] = useState({ leads: [], tasks: [], users: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // task state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);

  // lead state
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadCompany, setNewLeadCompany] = useState('');
  const [isAddingLead, setIsAddingLead] = useState(false);

  // team state
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamRole, setNewTeamRole] = useState('');
  const [isAddingTeam, setIsAddingTeam] = useState(false);

  // fetch everything on mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };
        
        const response = await axios.get('/api/dashboard/data', config);
        setData(response.data);
      } catch (err) {
        setError('Failed to fetch dashboard data. Please try again later.');
        // bad token probably, force log them out
        if (err.response && err.response.status === 401) {
            logout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [logout]);


  // --- tasks ---
  
  const handleAddTask = async (e) => {
    e.preventDefault();
    if(!newTaskTitle.trim()) return;
    
    setIsAddingTask(true);
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      const response = await axios.post('/api/tasks', { title: newTaskTitle }, config);
      
      // prepend new task
      setData({ ...data, tasks: [response.data, ...data.tasks] });
      setNewTaskTitle('');
    } catch (err) { 
        console.error(err); 
    } finally { 
        setIsAddingTask(false);
    }
  };

  const handleToggleTask = async (task) => {
    if(!task._id) {
      // just toggle ui for dummy items
      setData({ ...data, tasks: data.tasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t) });
      return;
    }
    
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      const response = await axios.put(`/api/tasks/${task._id}`, { completed: !task.completed }, config);
      setData({ ...data, tasks: data.tasks.map(t => t._id === task._id ? response.data : t) });
    } catch (err) { console.error(err); }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      await axios.delete(`/api/tasks/${taskId}`, config);
      setData({ ...data, tasks: data.tasks.filter(t => t._id !== taskId) });
    } catch (err) { console.error(err); }
  };


  // --- leads ---
  
  const handleAddLead = async (e) => {
    e.preventDefault();
    if(!newLeadName.trim() || !newLeadCompany.trim()) return;
    
    setIsAddingLead(true);
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      const response = await axios.post('/api/leads', { name: newLeadName, company: newLeadCompany }, config);
      
      setData({ ...data, leads: [response.data, ...data.leads] });
      setNewLeadName('');
      setNewLeadCompany('');
    } catch (err) { console.error(err); } finally { setIsAddingLead(false); }
  };

  const handleCycleLeadStatus = async (lead) => {
    const statuses = ['New', 'Contacted', 'Qualified'];
    // cycle through the statuses array
    const nextStatus = statuses[(statuses.indexOf(lead.status) + 1) % statuses.length];
    
    if(!lead._id) {
       setData({ ...data, leads: data.leads.map(l => l.id === lead.id ? { ...l, status: nextStatus } : l) });
       return;
    }

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      const response = await axios.put(`/api/leads/${lead._id}`, { status: nextStatus }, config);
      setData({ ...data, leads: data.leads.map(l => l._id === lead._id ? response.data : l) });
    } catch (err) { console.error(err); }
  };

  const handleDeleteLead = async (leadId) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.delete(`/api/leads/${leadId}`, config);
      
      setData({ ...data, leads: data.leads.filter(l => l._id !== leadId) });
    } catch (err) { console.error(err); }
  };


  // --- team ---
  
  const handleAddTeamMember = async (e) => {
    e.preventDefault();
    if(!newTeamName.trim() || !newTeamRole.trim()) return;
    setIsAddingTeam(true);
    
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      const response = await axios.post('/api/team', { name: newTeamName, role: newTeamRole }, config);
      
      setData({ ...data, users: [response.data, ...data.users] });
      setNewTeamName('');
      setNewTeamRole('');
    } catch (err) { console.error(err); } finally { setIsAddingTeam(false); }
  };

  const handleDeleteTeamMember = async (teamId) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      await axios.delete(`/api/team/${teamId}`, config);
      setData({ ...data, users: data.users.filter(u => u._id !== teamId) });
    } catch (err) { console.error(err); }
  };


  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 transition-colors">
      {/* Navbar */}
      <nav className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-slate-700 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">AssignmentApp</span>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Theme Toggle Button */}
              <button 
                onClick={toggleTheme} 
                className="p-2 rounded-full text-gray-500 dark:text-yellow-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                aria-label="Toggle Dark Mode"
              >
                {theme === 'light' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                )}
              </button>

              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center border dark:border-indigo-800">
                  <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
                  {user?.name}
                </span>
              </div>
              <button
                onClick={logout}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 transition-colors">
            Welcome back, {user?.name}! Here's what's happening today.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-md mb-6 border border-red-200 dark:border-red-800/50">
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            
            {/* Leads Card (CRUD) */}
            <div className="bg-white dark:bg-slate-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-slate-700 flex flex-col h-[500px] transition-colors">
              <div className="px-5 py-4 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 flex justify-between items-center transition-colors">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Recent Leads</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300">
                  {data.leads.length}
                </span>
              </div>
              
              <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/30 transition-colors">
                <form onSubmit={handleAddLead} className="flex flex-col space-y-2">
                  <div className="flex space-x-2">
                    <input type="text" placeholder="Name" value={newLeadName} onChange={(e) => setNewLeadName(e.target.value)} className="flex-1 min-w-0 block w-full px-3 py-1.5 rounded-md text-sm border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 border transition-colors" />
                    <input type="text" placeholder="Company" value={newLeadCompany} onChange={(e) => setNewLeadCompany(e.target.value)} className="flex-1 min-w-0 block w-full px-3 py-1.5 rounded-md text-sm border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 border transition-colors" />
                  </div>
                  <button type="submit" disabled={isAddingLead || !newLeadName.trim() || !newLeadCompany.trim()} className="w-full inline-flex justify-center items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors">
                    Add Lead
                  </button>
                </form>
              </div>

              <ul className="divide-y divide-gray-200 dark:divide-slate-700 flex-1 overflow-y-auto">
                {data.leads.map((lead) => (
                  <li key={lead._id || lead.id} className="px-5 py-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors group">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                          {lead.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{lead.company}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span 
                          onClick={() => handleCycleLeadStatus(lead)}
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer hover:ring-2 hover:ring-offset-1 dark:hover:ring-offset-slate-800 transition-all ${
                            lead.status === 'New' ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300' : 
                            lead.status === 'Contacted' ? 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300' : 
                            'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300'
                          }`}>
                          {lead.status}
                        </span>
                        {lead._id && (
                          <button onClick={() => handleDeleteLead(lead._id)} className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" title="Delete lead">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Dynamic Tasks Card (CRUD) */}
            <div className="bg-white dark:bg-slate-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-slate-700 flex flex-col h-[500px] transition-colors">
              <div className="px-5 py-4 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 flex justify-between items-center transition-colors">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Tasks</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300">
                  {data.tasks.filter(t => !t.completed).length} pending
                </span>
              </div>
              
              <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/30 transition-colors">
                <form onSubmit={handleAddTask} className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Add a new task..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="flex-1 min-w-0 block w-full px-3 py-1.5 rounded-md text-sm border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:placeholder-gray-400 border transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={isAddingTask || !newTaskTitle.trim()}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
                  >
                    Add
                  </button>
                </form>
              </div>

              <ul className="divide-y divide-gray-200 dark:divide-slate-700 flex-1 overflow-y-auto">
                {data.tasks.length === 0 ? (
                  <div className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400 text-center">No tasks yet. Add one above!</div>
                ) : (
                  data.tasks.map((task) => (
                    <li key={task._id || task.id} className="px-5 py-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors flex items-start group">
                      <div className="flex-shrink-0 pt-0.5 cursor-pointer" onClick={() => handleToggleTask(task)}>
                        <input 
                          type="checkbox" 
                          checked={task.completed}
                          onChange={() => handleToggleTask(task)}
                          className="h-4 w-4 text-indigo-600 dark:text-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400 border-gray-300 dark:border-slate-600 dark:bg-slate-700 rounded cursor-pointer transition-colors" 
                        />
                      </div>
                      <div className="ml-3 flex-1">
                        <p className={`text-sm font-medium flex items-center transition-colors ${task.completed ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-900 dark:text-gray-200'}`}>
                          {task.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Due: {task.dueDate}</p>
                      </div>
                      <div className="ml-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        {task._id && (
                          <button 
                            onClick={() => handleDeleteTask(task._id)}
                            className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                            title="Delete task"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        )}
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>

            {/* Users Card (CRUD) */}
            <div className="bg-white dark:bg-slate-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-slate-700 flex flex-col h-[500px] transition-colors">
              <div className="px-5 py-4 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 flex justify-between items-center transition-colors">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Team Members</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-300">
                  {data.users.length}
                </span>
              </div>
              
              <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/30 transition-colors">
                <form onSubmit={handleAddTeamMember} className="flex flex-col space-y-2">
                  <div className="flex space-x-2">
                    <input type="text" placeholder="Name" value={newTeamName} onChange={(e) => setNewTeamName(e.target.value)} className="flex-1 min-w-0 block w-full px-3 py-1.5 rounded-md text-sm border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 border transition-colors" />
                    <input type="text" placeholder="Role/Title" value={newTeamRole} onChange={(e) => setNewTeamRole(e.target.value)} className="flex-1 min-w-0 block w-full px-3 py-1.5 rounded-md text-sm border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 border transition-colors" />
                  </div>
                  <button type="submit" disabled={isAddingTeam || !newTeamName.trim() || !newTeamRole.trim()} className="w-full inline-flex justify-center items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors">
                    Add Member
                  </button>
                </form>
              </div>

              <ul className="divide-y divide-gray-200 dark:divide-slate-700 flex-1 overflow-y-auto">
                {data.users.map((member) => (
                  <li key={member._id || member.id} className="px-5 py-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors flex items-center justify-between group">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                        {member.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                          {member.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{member.role}</p>
                      </div>
                    </div>
                    {member._id && (
                      <button onClick={() => handleDeleteTeamMember(member._id)} className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" title="Remove member">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
