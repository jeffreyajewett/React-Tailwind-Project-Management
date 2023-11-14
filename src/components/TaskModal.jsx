import React, { useState, useRef, useEffect } from "react";
import db from "../util/db";
import { v4 as uuidv4 } from "uuid";

function TaskModal({ isOpen, onClose, onSave }) {
    const [taskName, setTaskName] = useState("");
    const modalRef = useRef();

    const generateTaskID = () => {
        return `task_${uuidv4()}`;
    };

    const handleSave = async () => {
        if (taskName) {
            const task = {
                id: generateTaskID(),
                name: taskName,
            };

            try {
                await db.tasks.add(task);
                console.log("Added task with ID:", task.id);
                onSave(task);
            } catch (error) {
                console.error("Error adding task:", error);
            }

            setTaskName("");
            onClose();
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent form submission
            handleSave();
        }
    };

    const handleOutsideClick = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            onClose();
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("mousedown", handleOutsideClick);
        } else {
            document.removeEventListener("mousedown", handleOutsideClick);
        }
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [isOpen]);

    return isOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black z-50 bg-opacity-70">
            <form
                ref={modalRef}
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSave();
                }}
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-neutral-200 p-4 rounded-lg z-50"
            >
                <h2 className="text-black text-2xl font-semibold mb-4">Add Task</h2>
                <label htmlFor="taskName" className="text-black">
                    Task Name:
                </label>
                <input
                    type="text"
                    id="taskName"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    className="block w-full border border-black p-2 mb-4"
                    autoFocus
                />
                <button
                    className="bg-black text-white rounded-md px-4 py-2 mr-2"
                    type="submit"
                >
                    Create Task
                </button>
                <button className="text-black" onClick={onClose}>
                    Cancel
                </button>
            </form>
        </div>
    );
}

export default TaskModal;
