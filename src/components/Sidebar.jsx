import React, { useState, useEffect } from "react";
import ProjectModal from "./ProjectModal";
import { Link, useParams } from "react-router-dom";
import db from "../util/db";

function Sidebar({ onAddProject }) {
    const [projects, setProjects] = useState([]);
    const { projectId } = useParams();
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false); // State to control the modal

    const fetchProjects = async () => {
        try {
            // Fetch the most recently created projects (limited to 10) ordered by their ID
            const recentProjects = await db.projects.orderBy("id").reverse().limit(10).toArray();
            setProjects(recentProjects); // Move the setProjects here
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    };

    useEffect(() => {
        // Fetch projects initially
        fetchProjects();

        // Set up an interval to check for new projects every 500ms
        const intervalId = setInterval(() => {
            fetchProjects();
        }, 500);

        // Clean up the interval when the component unmounts
        return () => {
            clearInterval(intervalId);
        };
    }, []);

    const handleOpenProjectModal = () => {
        setIsProjectModalOpen(true);
    };

    const handleCloseProjectModal = () => {
        setIsProjectModalOpen(false);
    };

    const addProject = (project) => {
        // Define the logic to add a project here.
        // You can use setState or any other method to update the project list.
        console.log("Adding project:", project);
    };
    return (
        <aside className="bg-neutral-900 rounded-xl mt-2 ml-4 w-1/4 hidden sm:block">
            <div className="p-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-white text-lg font-inter">My Projects</h2>
                    <Link to="/" className="text-white text-sm">
                        View All
                    </Link>
                </div>
                <button
                    className="bg-neutral-200 text-black rounded-md px-4 py-2 mt-4 w-full"
                    onClick={handleOpenProjectModal} // Open the project modal
                >
                    Add Project
                </button>
                <div className="mt-4">
                    {projects.map((project) => (
                        <Link
                            to={`/project/${project.id}`}
                            key={project.id}
                            className={`block text-white font-thin text-neutral-400 mb-2 overflow-hidden overflow-ellipsis ${
                                project.id === projectId ? "active:text-white" : ""
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <span>{project.title}</span>
                                <svg
                                    className="w-4 h-4"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 14 10"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1"
                                        d="M1 5h12m0 0L9 1m4 4L9 9"
                                    />
                                </svg>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Pass the necessary props to the ProjectModal */}
            <ProjectModal isOpen={isProjectModalOpen} onClose={handleCloseProjectModal} addProject={addProject} />
        </aside>
    );
}

export default Sidebar;
