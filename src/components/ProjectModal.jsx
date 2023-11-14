import React, { useState, useEffect, useRef } from "react";
import db from "../util/db"; // Import your database instance

function ProjectModal({ isOpen, onClose, onSave }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const modalRef = useRef();

    const handleSave = async () => {
        if (title) {
            const project = {
                title,
                description,
                dueDate,
                createdAt: new Date(),
            };

            try {
                const projectId = await db.projects.add(project);
                console.log(`Added project with ID: ${projectId}`);

                // Call the onSave function from props to save the project
                onSave(project); // Update the project list
            } catch (error) {
                console.error("Error adding project:", error);
            }

            // Clear the input fields
            setTitle("");
            setDescription("");
            setDueDate("");

            onClose(); // Close the modal
        }
    };




    useEffect(() => {
        function handleClickOutside(event) {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    return (
        isOpen && (
            <div className="fixed top-0 left-0 w-full h-full bg-black z-50 bg-opacity-70">
                <div
                    ref={modalRef}
                    className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-neutral-200 p-4 rounded-lg z-50 xl:w-1/3 sm:w-3/4 w-3/4"
                >
                    <h2 className="text-black text-2xl font-semibold mb-4">Add Project</h2>
                    <label htmlFor="title" className="text-black">
                        Title:
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="block w-full border border-black p-2 mb-4"
                    />
                    <label htmlFor="description" className="text-black">
                        Description:
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="block w-full border border-black p-2 mb-4"
                    />
                    <label htmlFor="dueDate" className="text-black">
                        Due Date:
                    </label>
                    <input
                        type="date"
                        id="dueDate"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="block w-full border border-black p-2 mb-4"
                    />
                    <button
                        className="bg-black text-white rounded-md px-4 py-2 mr-2"
                        onClick={handleSave}
                    >
                        Add Project
                    </button>
                    <button className="text-black" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        )
    );
}

export default ProjectModal;
