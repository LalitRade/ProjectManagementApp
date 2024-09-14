import React from 'react';
import { Button } from './components/button'; // Ensure these components exist
import { Card, CardContent, CardHeader } from './components/card'; // Ensure these components exist
import { CheckCircle, Trash2 } from 'lucide-react'; // Ensure these icons exist
import { Input } from './components/input'; // Ensure these components exist
import { Progress } from './components/progress'; // Ensure these components exist

const SubtaskItem = ({ subtask, onDelete, onProgressChange, onUpdate, isViewer }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedName, setEditedName] = React.useState(subtask.name);
  const [newSubtaskName, setNewSubtaskName] = React.useState('');
  const [newSubtaskDate, setNewSubtaskDate] = React.useState('');

  const handleUpdate = () => {
    onUpdate({ ...subtask, name: editedName });
    setIsEditing(false);
  };

  const addNestedSubtask = () => {
    if (newSubtaskName && newSubtaskDate) {
      const newNestedSubtask = {
        id: Date.now(),
        name: newSubtaskName,
        date: newSubtaskDate,
        progress: 0,
        completed: false,
        subtasks: []
      };
      onUpdate({ ...subtask, subtasks: [...(subtask.subtasks || []), newNestedSubtask] });
      setNewSubtaskName('');
      setNewSubtaskDate('');
    }
  };

  return (
    <div className="flex flex-col space-y-2 mb-2 bg-white p-3 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between space-x-2">
        <div className="flex items-center space-x-2 flex-grow">
          <CheckCircle
            size={20}
            className={subtask.completed ? "text-green-500" : "text-gray-300"}
            onClick={() => !isViewer && onProgressChange(subtask.id, subtask.completed ? 0 : 100)}
          />
          {isEditing ? (
            <Input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onBlur={handleUpdate}
              className="flex-grow"
              disabled={isViewer}
            />
          ) : (
            <span
              className={subtask.completed ? 'line-through flex-grow' : 'flex-grow'}
              onClick={() => !isViewer && setIsEditing(true)}
            >
              {subtask.name}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">{subtask.date}</span>
          <span className="text-sm font-semibold" style={{ color: `hsl(${subtask.progress}, 100%, 40%)` }}>
            {subtask.progress}%
          </span>
          {!isViewer && (
            <Button variant="ghost" size="icon" onClick={() => onDelete(subtask.id)}>
              <Trash2 size={16} className="text-red-500" />
            </Button>
          )}
        </div>
      </div>
      <Progress value={subtask.progress} className="h-1 bg-gray-100" indicatorColor="bg-blue-500" />
      {!isViewer && (
        <div className="flex space-x-2 mt-2">
          <Input
            placeholder="New subtask name"
            value={newSubtaskName}
            onChange={(e) => setNewSubtaskName(e.target.value)}
            className="flex-grow"
          />
          <Input
            type="date"
            value={newSubtaskDate}
            onChange={(e) => setNewSubtaskDate(e.target.value)}
          />
          <Button onClick={addNestedSubtask} size="sm">Add Subtask</Button>
        </div>
      )}
      {subtask.subtasks && subtask.subtasks.length > 0 && (
        <div className="pl-4 mt-2">
          {subtask.subtasks.map((nestedSubtask) => (
            <SubtaskItem
              key={nestedSubtask.id}
              subtask={nestedSubtask}
              onDelete={(id) => {
                const updatedSubtasks = subtask.subtasks.filter(s => s.id !== id);
                onUpdate({ ...subtask, subtasks: updatedSubtasks });
              }}
              onProgressChange={(id, newProgress) => {
                const updatedSubtasks = subtask.subtasks.map(s =>
                  s.id === id ? { ...s, progress: newProgress, completed: newProgress === 100 } : s
                );
                onUpdate({ ...subtask, subtasks: updatedSubtasks });
              }}
              onUpdate={(updatedNestedSubtask) => {
                const updatedSubtasks = subtask.subtasks.map(s =>
                  s.id === updatedNestedSubtask.id ? updatedNestedSubtask : s
                );
                onUpdate({ ...subtask, subtasks: updatedSubtasks });
              }}
              isViewer={isViewer}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ProjectCard = ({ project, onDelete, onUpdate, isViewer }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [newTask, setNewTask] = React.useState('');
  const [newTaskDate, setNewTaskDate] = React.useState('');

  const daysLeft = Math.max(0, Math.ceil((new Date(project.deadline) - new Date()) / (1000 * 60 * 60 * 24)));

  const addTask = () => {
    if (newTask.trim() && newTaskDate) {
      onUpdate({
        ...project,
        tasks: [...project.tasks, { id: Date.now(), name: newTask, date: newTaskDate, progress: 0, completed: false, subtasks: [] }]
      });
      setNewTask('');
      setNewTaskDate('');
    }
  };

  const deleteTask = (taskId) => {
    const updatedTasks = project.tasks.filter(task => task.id !== taskId);
    onUpdate({ ...project, tasks: updatedTasks });
  };

  const updateTaskProgress = (taskId, newProgress) => {
    const updatedTasks = project.tasks.map(task =>
      task.id === taskId ? { ...task, progress: newProgress, completed: newProgress === 100 } : task
    );
    onUpdate({ ...project, tasks: updatedTasks });
  };

  const updateTask = (updatedTask) => {
    const updatedTasks = project.tasks.map(task =>
      task.id === updatedTask.id ? updatedTask : task
    );
    onUpdate({ ...project, tasks: updatedTasks });
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{project.name}</h2>
          <Button onClick={() => setIsOpen(!isOpen)}>{isOpen ? 'Hide Tasks' : 'Show Tasks'}</Button>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-semibold">{daysLeft} days left</span>
          {!isViewer && (
            <Button variant="ghost" size="icon" onClick={() => onDelete(project.id)}>
              <Trash2 size={20} className="text-red-500" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <Progress value={project.tasks.reduce((acc, task) => acc + task.progress, 0) / project.tasks.length || 0} className="mb-2 h-2 bg-purple-100" indicatorColor="bg-gradient-to-r from-purple-500 to-blue-500" />
        {isOpen && (
          <div className="mt-4 space-y-2">
            {!isViewer && (
              <div className="flex space-x-2">
                <Input
                  placeholder="Add new task"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                />
                <Input
                  type="date"
                  value={newTaskDate}
                  onChange={(e) => setNewTaskDate(e.target.value)}
                  className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                />
                <Button onClick={addTask} className="bg-purple-600 hover:bg-purple-700 text-white">
                  Add Task
                </Button>
              </div>
            )}
            <div className="mt-4 space-y-2">
              {project.tasks.map(task => (
                <SubtaskItem
                  key={task.id}
                  subtask={task}
                  onDelete={deleteTask}
                  onProgressChange={updateTaskProgress}
                  onUpdate={updateTask}
                  isViewer={isViewer}
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
