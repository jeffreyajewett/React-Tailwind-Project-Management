import React, { useState, useEffect } from "react";
import db from "../util/db"; // Import your database instance
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";

function TaskTable({ tasks, onTaskStatusChange, onDeleteTask, onEditTask }) {
    const [editedTaskName, setEditedTaskName] = useState("");
    const [editTaskId, setEditTaskId] = useState(null);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                // Fetch tasks from your database here
                // For example:
                // const tasks = await db.tasks.toArray();
                // setTasks(tasks);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };

        // Fetch tasks when the component mounts
        fetchTasks();
    }, [tasks]);

    const handleTaskStatusChange = async (taskId) => {
        const task = tasks.find((t) => t.id === taskId);
        if (task) {
            // Toggle the "completed" field in the database
            try {
                await db.tasks.where("id").equals(taskId).modify({ completed: !task.completed });
                onTaskStatusChange(taskId);
            } catch (error) {
                console.error("Error updating task status:", error);
            }
        }
    };

    const handleEditTaskName = (taskId) => {
        if (editedTaskName !== "") {
            const task = tasks.find((t) => t.id === taskId);
            if (task) {
                // Update the task name in the state
                onEditTask(taskId, editedTaskName);
            }
        }
        // Clear the editing mode
        setEditTaskId(null);
        setEditedTaskName(""); // Clear the edited task name
    };

    return (
        <table className="min-w-full border border-black mt-8">
            <thead>
            <tr>
                <th className="px-3 py-3 bg-black text-white">Complete</th>
                <th className="px-6 py-3 bg-black text-white text-left">Task Name</th>
                <th className="px-6 py-3 bg-black text-white">Actions</th>
            </tr>
            </thead>
            <tbody>
            {tasks.map((task) => (
                <tr key={task.id}>
                    <td className="border px-3 py-4 text-center">
                        <label className="custom-checkbox inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => handleTaskStatusChange(task.id)}
                                className="hidden"
                            />
                            <div className="w-6 h-6 bg-white border-2 border-black rounded-md custom-checkmark flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-current text-white opacity-0 pointer-events-none" viewBox="0 0 24 24">
                                    <path d="M9 16.17l-4.17-4.17 1.41-1.41L9 13.34l6.59-6.59L17 11z" />
                                </svg>
                            </div>
                        </label>
                    </td>
                    <td className={`border px-6 py-4 ${task.completed ? "line-through" : ""}`}>
                        {editTaskId === task.id ? (
                            <div>
                                <input
                                    type="text"
                                    value={editedTaskName}
                                    onChange={(e) => setEditedTaskName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleEditTaskName(task.id);
                                        }
                                    }}
                                    className="border border-black p-1"
                                />
                            </div>
                        ) : (
                            <span>{task.name}</span>
                        )}
                    </td>
                    <td className="border px-6 py-4 text-center">
                        {editTaskId === task.id ? (
                            <button
                                className="bg-black text-white rounded-md px-4 py-2 mr-2"
                                onClick={() => handleEditTaskName(task.id)}
                            >
                                Save
                            </button>
                        ) : (
                            <>
                                <button
                                    className="bg-black text-white rounded-md px-4 py-2 mr-2"
                                    onClick={() => {
                                        setEditedTaskName(task.name);
                                        setEditTaskId(task.id);
                                    }}
                                >
                                    <AiOutlineEdit />
                                </button>
                                <button
                                    className="bg-black text-white rounded-md px-4 py-2"
                                    onClick={() => onDeleteTask(task.id)}
                                >
                                    <AiOutlineDelete />
                                </button>
                            </>
                        )}
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default TaskTable;
