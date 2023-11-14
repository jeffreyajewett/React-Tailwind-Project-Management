import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import db from "../util/db";
import {AiOutlineEdit, AiOutlineDelete, AiOutlineEye} from "react-icons/ai";

function ProjectTable({ onEdit, onDelete, onViewDetails }) {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch projects when the component mounts
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            // Reset the error and show loading state
            setError(null);
            setLoading(true);

            // Fetch projects from the database
            const projects = await db.projects.toArray();
            setProjects(projects);

            // Data has been successfully fetched
            setLoading(false);
        } catch (error) {
            console.error("Error fetching projects:", error);

            // Set the error and hide loading state
            setError(error);
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Project List</h2>
            {loading && <p>Loading projects...</p>}
            {error && <p>Error loading projects: {error.message}</p>}
            {!loading && !error && (
                <table className="table-auto">
                    <thead>
                    <tr>
                        <th className="px-4 py-2">ID</th>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {projects.map((project) => (
                        <tr key={project.id}>
                            <td className="border px-4 py-2">{project.id}</td>
                            <td className="border px-4 py-2">{project.title}</td>
                            <td className="border px-4 py-2">
                                <Link to={`/details/${project.id}`}><AiOutlineEye/></Link>
                                <button onClick={() => onEdit(project.id)}><AiOutlineEdit /></button>
                                <button onClick={() => onDelete(project.id)}><AiOutlineDelete /></button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default ProjectTable;
