import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { PlusCircle, Trash2, ChevronDown, ChevronUp, Calendar, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './components/card';
import { Button } from './components/button';
import { Progress } from './components/progress';
import { Input } from './components/input';

const SubtaskItem = ({ subtask, index, onDelete, onProgressChange, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(subtask.name);
  const [newSubtaskName, setNewSubtaskName] = useState('');
  const [newSubtaskDate, setNewSubtaskDate] = useState('');

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
    <Draggable draggableId={subtask.id.toString()} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="flex flex-col space-y-2 mb-2 bg-white p-3 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between space-x-2">
            <div className="flex items-center space-x-2 flex-grow">
              <CheckCircle 
                size={20} 
                className={subtask.completed ? "text-green-500" : "text-gray-300"}
                onClick={() => onProgressChange(subtask.id, subtask.completed ? 0 : 100)}
              />
              {isEditing ? (
                <Input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  onBlur={handleUpdate}
                  className="flex-grow"
                />
              ) : (
                <span
                  className={subtask.completed ? 'line-through flex-grow' : 'flex-grow'}
                  onClick={() => setIsEditing(true)}
                >
                  {subtask.name}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">{subtask.date}</span>
              <span className="text-sm font-semibold" style={{color: `hsl(${subtask.progress}, 100%, 40%)`}}>
                {subtask.progress}%
              </span>
              <Button variant="ghost" size="icon" onClick={() => onDelete(subtask.id)}>
                <Trash2 size={16} className="text-red-500" />
              </Button>
            </div>
          </div>
          <Progress value={subtask.progress} className="h-1 bg-gray-100" indicatorColor="bg-blue-500" />
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
          {subtask.subtasks && subtask.subtasks.length > 0 && (
            <div className="pl-4 mt-2">
              {subtask.subtasks.map((nestedSubtask, nestedIndex) => (
                <SubtaskItem
                  key={nestedSubtask.id}
                  subtask={nestedSubtask}
                  index={nestedIndex}
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
                />
              ))}
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

const TaskItem = ({ task, index, onDelete, onProgressChange, onUpdate }) => (
  <SubtaskItem
    subtask={task}
    index={index}
    onDelete={onDelete}
    onProgressChange={onProgressChange}
    onUpdate={onUpdate}
  />
);

const ProjectCard = ({ project, onDelete, onUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [newTaskDate, setNewTaskDate] = useState('');

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
      task.id === taskId
        ? { ...task, progress: newProgress, completed: newProgress === 100 }
        : task
    );
    onUpdate({ ...project, tasks: updatedTasks });
  };

  const updateTask = (updatedTask) => {
    const updatedTasks = project.tasks.map(task =>
      task.id === updatedTask.id ? updatedTask : task
    );
    onUpdate({ ...project, tasks: updatedTasks });
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;

    if (sourceIndex === destIndex) {
      const task = project.tasks[sourceIndex];
      const newProgress = Math.round((destIndex / (project.tasks.length - 1)) * 100);
      updateTaskProgress(task.id, newProgress);
    } else {
      const newTasks = Array.from(project.tasks);
      const [reorderedTask] = newTasks.splice(sourceIndex, 1);
      newTasks.splice(destIndex, 0, reorderedTask);
      onUpdate({ ...project, tasks: newTasks });
    }
  };

  const calculateProgress = () => {
    if (project.tasks.length === 0) return 0;
    const totalProgress = project.tasks.reduce((sum, task) => sum + task.progress, 0);
    return Math.round(totalProgress / project.tasks.length);
  };

  const progress = calculateProgress();

  return (
    <Card className="mb-4 overflow-hidden bg-gradient-to-br from-purple-50 to-blue-50">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <CardTitle className="text-lg font-bold text-purple-700">{project.name}</CardTitle>
        <div className="flex items-center space-x-2">
          <Calendar size={16} className="text-blue-500" />
          <span className="text-sm text-gray-600">{daysLeft} days left</span>
          <span className="text-sm font-semibold text-purple-600">{progress}% complete</span>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <ChevronUp size={20} className="text-purple-500" /> : <ChevronDown size={20} className="text-purple-500" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(project.id)}>
            <Trash2 size={20} className="text-red-500" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <Progress value={progress} className="mb-2 h-2 bg-purple-100" indicatorColor="bg-gradient-to-r from-purple-500 to-blue-500" />
        {isOpen && (
          <div className="mt-4 space-y-2">
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
                <PlusCircle size={20} className="mr-2" />
                Add Task
              </Button>
            </div>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId={`project-${project.id}`}>
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {project.tasks.map((task, index) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        index={index}
                        onDelete={deleteTask}
                        onProgressChange={updateTaskProgress}
                        onUpdate={updateTask}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const ProjectManagementApp = () => {
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDeadline, setNewProjectDeadline] = useState('');

  const addProject = () => {
    if (newProjectName.trim() && newProjectDeadline) {
      setProjects([
        ...projects,
        {
          id: Date.now(),
          name: newProjectName,
          deadline: newProjectDeadline,
          tasks: []
        }
      ]);
      setNewProjectName('');
      setNewProjectDeadline('');
    }
  };

  const deleteProject = (id) => {
    setProjects(projects.filter(project => project.id !== id));
  };

  const updateProject = (updatedProject) => {
    setProjects(projects.map(project =>
      project.id === updatedProject.id ? updatedProject : project
    ));
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-transparent bg-clip-text">
        Project Management App
      </h1>
      <Card className="mb-6 bg-gradient-to-r from-purple-100 to-blue-100">
        <CardContent className="p-4">
          <div className="flex space-x-2">
            <Input
              placeholder="New project name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
            />
            <Input
              type="date"
              value={newProjectDeadline}
              onChange={(e) => setNewProjectDeadline(e.target.value)}
              className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
            />
            <Button onClick={addProject} className="bg-purple-600 hover:bg-purple-700 text-white">
              <PlusCircle size={20} className="mr-2" />
              Add Project
            </Button>
          </div>
        </CardContent>
      </Card>
      {projects.map(project => (
        <ProjectCard
          key={project.id}
          project={project}
          onDelete={deleteProject}
          onUpdate={updateProject}
        />
      ))}
    </div>
  );
};

export default ProjectManagementApp;


