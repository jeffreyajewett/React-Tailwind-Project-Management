import Dexie from "dexie";

const db = new Dexie("ProjectManagement"); // Replace with your desired database name.

db.version(1).stores({
    projects: "++id, title, description, dueDate",
    tasks: "++id, name, projectId, status",
});

export default db;


