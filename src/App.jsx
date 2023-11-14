import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import Nav from "./components/Nav.jsx";
import ProjectDashboard from "./components/ProjectDashboard";
import ProjectDetails from "./components/ProjectDetails";
import TaskModal from "./components/TaskModal";
import ProjectModal from "./components/ProjectModal";
import Sidebar from "./components/Sidebar";
import { v4 as uuidv4 } from "uuid";

function App() {
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [showAddProjectButton, setShowAddProjectButton] = useState(true);


    const addProject = (project) => {
        setTasks([...projects, { id: generateProjectID(), ...project }]);
        setIsTaskModalOpen(false);
    };

    const addTask = (task) => {
        setTasks([...tasks, { id: generateTaskID(), ...task }]);
        setIsTaskModalOpen(false);
    };

    const updateTaskStatus = (taskId) => {
        const updatedTasks = tasks.map((task) => {
            if (task.id === taskId) {
                return { ...task, status: task.status === "open" ? "closed" : "open" };
            }
            return task;
        });

        setTasks(updatedTasks);
    };

    const deleteTask = (taskId) => {
        const updatedTasks = tasks.filter((task) => task.id !== taskId);
        setTasks(updatedTasks);
    };

    const generateProjectID = () => {
        return `project_${uuidv4()}`;
    };

    const generateTaskID = () => {
        return `task_${uuidv4()}`;
    };

    const handleEdit = (projectId) => {
        // Implement the logic to edit the project with the given projectId
        // For example, you can open a modal or navigate to an edit page.
        console.log(`Editing project with ID: ${projectId}`);
        // Add your logic here.
    };

    const handleDelete = (projectId) => {
        // Implement the logic to delete the project with the given projectId
        // For example, you can show a confirmation dialog and delete the project upon confirmation.
        console.log(`Deleting project with ID: ${projectId}`);
        // Add your logic here.
    };

    const handleViewDetails = (projectId) => {
        // Find the project with the given projectId
        const projectToShow = projects.find((project) => project.id === projectId);

        if (projectToShow) {
            // You can implement logic to display the project details in a modal or navigate to a separate details page.
            // For demonstration purposes, we will use a simple alert to show the details.
            const projectDetails = `Project Title: ${projectToShow.title}\nDescription: ${projectToShow.description}\nDue Date: ${projectToShow.dueDate}`;
            alert(projectDetails);
        }
    };

    return (
        <div className="flex justify-center">
            <div className="max-w-7xl w-full">
                <Nav />
                <div className="flex justify-between items-center sm:hidden">
                    {showAddProjectButton ? (
                        <button
                            className="bg-neutral-200 text-black rounded-md px-4 py-2 mt-2 ml-4"
                            onClick={() => setIsProjectModalOpen(true)}
                        >
                            Add Project
                        </button>
                    ) : (
                        <Link to="/" className="text-white text-lg ml-4 mt-2">
                            View My Projects
                        </Link>
                    )}
                </div>
                <div className="flex">
                    <BrowserRouter>
                        <Sidebar onAddProject={() => setIsProjectModalOpen(true)} />
                        <Routes>
                            <Route
                                path="/"
                                element={
                                    <ProjectDashboard
                                        projects={projects}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        onViewDetails={handleViewDetails}
                                        addProject={addProject}
                                    />
                                }
                            />
                            <Route
                                path="/project/:projectId"
                                element={
                                    <ProjectDetails
                                        projects={projects}
                                        tasks={tasks}
                                        onTaskStatusChange={updateTaskStatus}
                                        onDeleteTask={deleteTask}
                                        onAddTask={() => setIsTaskModalOpen(true)}
                                    />
                                }
                            />

                            <Route
                                path="/"
                                element={
                                    <ProjectDashboard
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        onViewDetails={handleViewDetails}
                                        addProject={addProject}
                                    />
                                }
                            />
                        </Routes>
                    </BrowserRouter>
                </div>
            </div>

            {isProjectModalOpen && (
                <ProjectModal
                    isOpen={isProjectModalOpen}
                    onClose={() => setIsProjectModalOpen(false)}
                    onSave={addProject} // Pass the addProject function as onSave
                />
            )}
        </div>
    );
}

export default App;