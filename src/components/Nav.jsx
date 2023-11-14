import React from "react";
import logo from '../assets/JJ-logo.png';

function Nav() {
    return (
        <div className="flex items-center justify-between bg-neutral-900 p-6 m-4 rounded-xl">
            <div className="flex items-center">
                <a href="/"><img
                    className="h-8 w-8"
                    src={logo}
                    alt="Workflow"
                /></a>
                <div className="text-white font-inter text-2xl pl-4">Project Management</div>
            </div>
            <button className="bg-neutral-200 text-black rounded-md px-4 py-2">Login</button>
        </div>
    );
}

export default Nav;
