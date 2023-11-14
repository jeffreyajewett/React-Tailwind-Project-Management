import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import db from "../util/db";
import TaskModal from "./TaskModal.jsx";
import TaskTable from "./TaskTable"; // Import the TaskTable component to display tasks
import { v4 as uuidv4 } from 'uuid';
import StatCard from "./StatCard.jsx";


function ProjectDetails({ onTaskStatusChange, onDeleteTask }) {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [showTaskModal, setShowTaskModal] = useState(false);

    useEffect(() => {
        // Fetch project and tasks when the component mounts
        fetchProjectAndTasks();
    }, [projectId]);

    const fetchProjectAndTasks = async () => {
        try {
            // Fetch project from the database
            const project = await db.projects.get(Number(projectId));
            setProject(project);

            // Fetch tasks for the project from the database
            const projectTasks = await db.tasks.where('projectId').equals(Number(projectId)).toArray();
            setTasks(projectTasks);
        } catch (error) {
            console.error('Error fetching project and tasks:', error);
        }
    };

    const handleAddTask = (task) => {
        const taskWithId = { ...task, id: uuidv4(), projectId: Number(projectId) }; // Include projectId
        console.log('Adding task with ID:', taskWithId.id);

        db.tasks
            .add(taskWithId)
            .then(() => {
                console.log('Added task with ID:', taskWithId.id);
                setTasks([...tasks, taskWithId]);
                setShowTaskModal(false);
            })
            .catch((error) => {
                console.error('Error adding task:', error);
            });
    };

    const handleTaskDelete = (taskId) => {
        db.tasks
            .where('id')
            .equals(taskId)
            .delete()
            .then(() => {
                // Update the tasks list by removing the deleted task
                const updatedTasks = tasks.filter((task) => task.id !== taskId);
                setTasks(updatedTasks);
            })
            .catch((error) => {
                console.error('Error deleting task:', error);
            });
    };

    const handleEditTask = (taskId, newTaskName) => {
        // Update the task name in the database
        db.tasks.update(taskId, { name: newTaskName }).then(() => {
            // Update the state with the new task name
            const updatedTasks = tasks.map((task) => {
                if (task.id === taskId) {
                    return { ...task, name: newTaskName };
                }
                return task;
            });
            setTasks(updatedTasks);
        });
    };

    const handleTaskStatusChange = async (taskId) => {
        // Find the task in the component's state
        const taskToUpdate = tasks.find((task) => task.id === taskId);

        if (taskToUpdate) {
            const newStatus = !taskToUpdate.completed;

            // Update the task status in the database
            try {
                await db.tasks.update(taskId, { completed: newStatus });
            } catch (error) {
                console.error('Error updating task status:', error);
                return;
            }

            // Update the state with the new task status
            const updatedTasks = tasks.map((task) => {
                if (task.id === taskId) {
                    return { ...task, completed: newStatus };
                }
                return task;
            });

            // Update the component's state with the new task list
            setTasks(updatedTasks);
        }
    };


    return (
        <div className="bg-white w-full m-4 p-4 rounded-md">
            <div className="flex justify-between">
                <h2 className="text-black text-3xl font-semibold mb-2">
                    {project ? project.title : ""}
                </h2>
                {project && (
                    <p className="text-gray-600">
                        <strong>Due Date:</strong> {project.dueDate}
                    </p>
                )}
            </div>

            {project && (
                <p className="text-gray-600">
                    <strong>Description:</strong> {project.description}
                </p>
            )}

            <div className="flex justify-between items-start mt-4">
                <StatCard
                    title="Open Tasks"
                    stat={tasks.filter((task) => !task.completed).length}
                />
                <StatCard
                    title="Completed Tasks"
                    stat={tasks.filter((task) => task.completed).length}
                />
                <StatCard
                    title="Progress"
                    stat={
                        tasks.length > 0
                            ? `${Math.round(
                                (tasks.filter((task) => task.completed).length /
                                    tasks.length) *
                                100
                            )}%`
                            : "0%"
                    }
                />
            </div>

            <h3 className="text-lg font-semibold mt-4">Project Tasks</h3>
            <div className="flex justify-between items-center mt-2">
                <p>
                    {tasks.length > 0
                        ? "This project has tasks."
                        : "This project has no tasks."}
                </p>
                <button
                    className="bg-black text-white rounded-md px-4 py-2"
                    onClick={() => setShowTaskModal(true)}
                >
                    Add Task
                </button>
            </div>

            <TaskTable
                tasks={tasks}
                onTaskStatusChange={handleTaskStatusChange}
                onDeleteTask={handleTaskDelete}
                onEditTask={handleEditTask}
            />

            {showTaskModal && (
                <TaskModal
                    isOpen={showTaskModal}
                    onClose={() => setShowTaskModal(false)}
                    onSave={handleAddTask}
                />
            )}
        </div>
    );
}

export default ProjectDetails;
