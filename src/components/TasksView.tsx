import React, { useState } from 'react';
import { Site, SiteTask } from '../types';
import { 
  CheckSquare, 
  Plus, 
  Calendar, 
  Clock, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  X,
  Filter
} from 'lucide-react';

interface TasksViewProps {
  site: Site;
  tasks: SiteTask[];
  onSaveTask: (task: SiteTask) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  site,
  tasks = [],
  onSaveTask,
  onDeleteTask
}) => {
  const [filter, setFilter] = useState<'all' | 'todo' | 'in_progress' | 'done'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<SiteTask | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [priority, setPriority] = useState<SiteTask['priority']>('medium');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);

  const siteTasks = tasks.filter((t) => t.siteId === site.id);

  const filteredTasks = siteTasks.filter((t) => {
    if (filter === 'all') return true;
    return t.status === filter;
  });

  const handleOpenNew = () => {
    setEditingTask(null);
    setTitle('');
    setDescription('');
    setAssignedTo('');
    setPriority('medium');
    setDueDate(new Date().toISOString().split('T')[0]);
    setModalOpen(true);
  };

  const handleToggleStatus = (task: SiteTask) => {
    const nextStatus = task.status === 'done' ? 'todo' : task.status === 'todo' ? 'in_progress' : 'done';
    onSaveTask({ ...task, status: nextStatus });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const task: SiteTask = {
      id: editingTask?.id || `task-${Date.now()}`,
      siteId: site.id,
      title: title.trim(),
      description: description.trim() || undefined,
      assignedTo: assignedTo.trim() || undefined,
      priority,
      status: editingTask?.status || 'todo',
      dueDate
    };

    onSaveTask(task);
    setModalOpen(false);
  };

  const countTodo = siteTasks.filter((t) => t.status === 'todo').length;
  const countInProgress = siteTasks.filter((t) => t.status === 'in_progress').length;
  const countDone = siteTasks.filter((t) => t.status === 'done').length;

  return (
    <div className="max-w-md sm:max-w-lg mx-auto w-full pt-3 pb-28 px-3 space-y-3">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-4 shadow-md border border-slate-200/80 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-amber-500" />
            Tâches & Travaux Chantier
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Planning d'avancement et répartition des équipes</p>
        </div>

        <button
          onClick={handleOpenNew}
          className="p-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow active:scale-95 transition-all"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 p-1 bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all ${
            filter === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Toutes ({siteTasks.length})
        </button>
        <button
          onClick={() => setFilter('todo')}
          className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all ${
            filter === 'todo' ? 'bg-amber-500 text-slate-950' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          À faire ({countTodo})
        </button>
        <button
          onClick={() => setFilter('in_progress')}
          className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all ${
            filter === 'in_progress' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          En cours ({countInProgress})
        </button>
        <button
          onClick={() => setFilter('done')}
          className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all ${
            filter === 'done' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Fait ({countDone})
        </button>
      </div>

      {/* Tasks List */}
      <div className="space-y-2">
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center text-slate-400 border border-slate-200/80">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-80" />
            <p className="font-bold text-slate-700">Aucune tâche dans cette catégorie</p>
            <p className="text-xs text-slate-400 mt-1">Cliquez sur le bouton + pour en ajouter une.</p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isDone = task.status === 'done';
            const isInProgress = task.status === 'in_progress';

            return (
              <div
                key={task.id}
                className={`bg-white rounded-2xl p-3.5 border shadow-sm flex items-start gap-3 transition-all ${
                  isDone ? 'border-slate-200 opacity-60' : 'border-slate-200/80'
                }`}
              >
                <button
                  onClick={() => handleToggleStatus(task)}
                  className={`mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-colors ${
                    isDone
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : isInProgress
                      ? 'bg-blue-100 border-blue-500 text-blue-700'
                      : 'border-slate-300 hover:border-amber-500 text-transparent'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className={`font-bold text-sm text-slate-900 ${isDone ? 'line-through text-slate-400' : ''}`}>
                      {task.title}
                    </h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      task.priority === 'high'
                        ? 'bg-rose-100 text-rose-700'
                        : task.priority === 'medium'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {task.priority === 'high' ? 'Urgent' : task.priority === 'medium' ? 'Normal' : 'Secondaire'}
                    </span>
                  </div>

                  {task.description && (
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{task.description}</p>
                  )}

                  <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-100 text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{task.assignedTo || 'Non assigné'}</span>
                    </div>

                    <div className="flex items-center gap-1 text-slate-500 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-amber-500" />
                      <span>{task.dueDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Task Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="font-bold text-lg text-white">Nouvelle Tâche Chantier</h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-400 mb-1">Titre de la tâche</label>
                <input
                  type="text"
                  placeholder="Ex: Coulage poteaux axe 4-B..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-slate-400 mb-1">Détails / Spécifications</label>
                <textarea
                  rows={2}
                  placeholder="Ex: Enrobage 3cm, vibration soignée, vérification ferraillage..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-400 mb-1">Responsable</label>
                  <input
                    type="text"
                    placeholder="Ex: Chef d'équipe"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-400 mb-1">Priorité</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as SiteTask['priority'])}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="high">Urgent</option>
                    <option value="medium">Normal</option>
                    <option value="low">Secondaire</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-400 mb-1">Date d'échéance</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
