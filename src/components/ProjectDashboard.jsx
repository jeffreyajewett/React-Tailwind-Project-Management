import React, { useState, useEffect } from "react";
import { Link, Routes, Route, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import db from "../util/db";
import { RxTable, RxDashboard } from "react-icons/rx";
import { AiOutlineDelete, AiOutlineEdit, AiOutlineEye, AiOutlineSave } from "react-icons/ai";

function ProjectDashboard({ onDelete, onViewDetails, addProject }) {
    const [projects, setProjects] = useState([]);
    const [viewAsTable, setViewAsTable] = useState(true);
    const [editingProjects, setEditingProjects] = useState({});

    const toggleView = () => {
        setViewAsTable(!viewAsTable);
    };

    useEffect(() => {
        // Fetch projects when the component mounts
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const projects = await db.projects.toArray();
            setProjects(projects);
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    };

    useEffect(() => {
        // Fetch projects when the component mounts
        fetchProjects();

        // Use setInterval to fetch and update projects every 5 seconds (adjust as needed)
        const fetchInterval = setInterval(() => {
            fetchProjects();
        }, 500);

        // Cleanup the interval when the component unmounts
        return () => clearInterval(fetchInterval);
    }, []);

    const handleDelete = async (projectId) => {
        try {
            // Remove the project by ID from the database
            await db.projects.where({ id: projectId }).delete();

            // Remove associated tasks from the database
            await db.tasks.where({ projectId: projectId }).delete();

            // Fetch and set the updated projects list
            fetchProjects();
        } catch (error) {
            console.error("Error deleting project:", error);
        }
    };

    const handleEdit = (projectId) => {
        setEditingProjects((prevState) => ({
            ...prevState,
            [projectId]: true,
        }));
    };

    const handleSave = async (projectId) => {
        try {
            // Implement the logic to save the changes for the project with the given projectId
            // For example, you can update the project in the database or send a request to your API.

            // After saving, you can update the editing status for the project:
            setEditingProjects((prevState) => ({
                ...prevState,
                [projectId]: false,
            }));
        } catch (error) {
            console.error("Error saving project:", error);
        }
    };


    const handleAddProject = async () => {
        if (newProject.title) {
            try {
                // Create a new project object
                const project = {
                    title: newProject.title,
                    description: newProject.description,
                    dueDate: newProject.dueDate,
                };

                // Save the project to the database
                await addProjectToDatabase(project);

                // Fetch and set the updated projects list immediately after adding a project
                fetchProjects();

                // Reset the newProject state for the form
                setNewProject({
                    title: "",
                    description: "",
                    dueDate: "",
                });
            } catch (error) {
                console.error("Error adding project:", error);
            }
        }
    };

    const addProjectToDatabase = async (project) => {
        try {
            // Save the project to the database
            await db.projects.add(project);
            console.log('Project saved to the database');
        } catch (error) {
            console.error('Error saving project to the database:', error);
        }
    };
    const isEditing = (projectId) => editingProjects[projectId] || false;

    return (
        <div className="bg-white w-full m-4 p-4 rounded-md">
            <div className="flex justify-between items-center">
                <h2 className="text-black text-3xl font-semibold mb-">
                    Project List
                </h2>
                <button
                    className="bg-black text-white rounded-md p-2 text-sm"
                    onClick={toggleView}
                >
                    {viewAsTable ? (
                        <RxTable className="text-base" />
                    ) : (
                        <RxDashboard className="text-base" />
                    )}
                </button>
            </div>

            {viewAsTable ? (
                <div className="grid grid-cols-1 md grid-cols-2 lg grid-cols-3 gap-4 justify-start mt-4">
                    {projects.map((project) => (
                        <div key={project.id} className="bg-gray-100 p-4 rounded-md">
                            {isEditing(project.id) ? ( // Check if in edit mode
                                <div>
                                    <input
                                        type="text"
                                        value={project.title}
                                        onChange={(e) => handleTitleChange(project.id, e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        value={project.description}
                                        onChange={(e) => handleDescriptionChange(project.id, e.target.value)}
                                    />
                                    <input
                                        type="date"
                                        value={project.dueDate}
                                        onChange={(e) => handleDueDateChange(project.id, e.target.value)}
                                    />
                                </div>
                            ) : (
                                <div>
                                    <h3 className="text-xl font-semibold">{project.title}</h3>
                                    <p className="text-gray-600 mt-2">{project.description}</p>
                                    <p className="text-gray-600 mt-2">Due Date: {project.dueDate}</p>
                                </div>
                            )}
                            <div className="mt-4 flex justify-start">
                                <Link to={`/project/${project.id}`}>
                                    <button
                                        className="bg-black text-white rounded-md px-4 py-2 mr-2"
                                        onClick={() => onViewDetails(project.id)}
                                    >
                                        <AiOutlineEye />
                                    </button>
                                </Link>
                                {isEditing(project.id) ? ( // Show "Save" button in edit mode
                                    <button
                                        className="bg-black text-white rounded-md px-4 py-2 mr-2"
                                        onClick={() => handleSave(project.id)}
                                    >
                                        <AiOutlineSave />
                                    </button>
                                ) : (
                                    <button // Show "Edit" button in view mode
                                        className="bg-black text-white rounded-md px-4 py-2 mr-2"
                                        onClick={() => handleEdit(project.id)}
                                    >
                                        <AiOutlineEdit />
                                    </button>
                                )}
                                <button
                                    className="bg-black text-white rounded-md px-4 py-2"
                                    onClick={() => handleDelete(project.id)}
                                >
                                    <AiOutlineDelete />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <table className="min-w-full border border-black mt-4">
                    <thead>
                    <tr>
                        <th className="px-6 py-3 bg-black text-white">Name</th>
                        <th className="px-6 py-3 bg-black text-white">Details</th>
                        <th className="px-6 py-3 bg-black text-white">Due Date</th>
                        <th className="px-6 py-3 bg-black text-white">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {projects.map((project) => (
                        <tr key={project.id}>
                            <td className="border px-6 py-4">
                                {isEditing(project.id) ? (
                                    <input
                                        type="text"
                                        value={project.title}
                                        onChange={(e) => handleTitleChange(project.id, e.target.value)}
                                    />
                                ) : (
                                    <Link to={`/project/${project.id}`}>{project.title}</Link>
                                )}
                            </td>
                            <td className="border px-6 py-4">
                                {isEditing(project.id) ? (
                                    <input
                                        type="text"
                                        value={project.description}
                                        onChange={(e) => handleDescriptionChange(project.id, e.target.value)}
                                    />
                                ) : (
                                    project.description
                                )}
                            </td>
                            <td className="border px-6 py-4">
                                {isEditing(project.id) ? (
                                    <input
                                        type="date"
                                        value={project.dueDate}
                                        onChange={(e) => handleDueDateChange(project.id, e.target.value)}
                                    />
                                ) : (
                                    project.dueDate
                                )}
                            </td>
                            <td className="border px-6 py-4 text-center">
                                <Link to={`/project/${project.id}`}>
                                    <button
                                        className="bg-black text-white rounded-md px-4 py-2 mr-2"
                                        onClick={() => onViewDetails(project.id)}
                                    >
                                        <AiOutlineEye />
                                    </button>
                                </Link>
                                {isEditing(project.id) ? (
                                    <button
                                        className="bg-black text-white rounded-md px-4 py-2 mr-2"
                                        onClick={() => handleSave(project.id)}
                                    >
                                        <AiOutlineSave />
                                    </button>
                                ) : (
                                    <button
                                        className="bg-black text-white rounded-md px-4 py-2 mr-2"
                                        onClick={() => handleEdit(project.id)}
                                    >
                                        <AiOutlineEdit />
                                    </button>
                                )}
                                <button
                                    className="bg-black text-white rounded-md px-4 py-2"
                                    onClick={() => handleDelete(project.id)}
                                >
                                    <AiOutlineDelete />
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

ProjectDashboard.propTypes = {
    onDelete: PropTypes.func.isRequired,
    onViewDetails: PropTypes.func.isRequired,
    addProject: PropTypes.func.isRequired,
};

export default ProjectDashboard;
