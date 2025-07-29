"use client"
import { useData } from "../context/data";
import { useEffect, useState } from "react";
import PopupAddTask from "./PopupAddTask";
import { useRouter } from 'next/navigation'
import EditPopupTAsk from "./EditPopupTAsk";
export default function Main() {
    const router = useRouter()
    const { form, setForm, addTask, setAddTask, isToken, token, setToken, setIsToken, enablePopup, setenablePopup, toUpdate, setToUpdate, UpdateSubmit, refreshTasks,task,setTask, isLoading, refreshTask } = useData()
    

    useEffect(() => {
        // Only redirect if not loading, and isToken is explicitly false, meaning no token was found after initial check
        // And if token is empty, which implies not logged in.
        if (!isLoading && !isToken && !token) {
            router.replace('/login');
        }
    }, [isLoading, isToken, token, router]); // Depend on isLoading, isToken and token to react to auth state changes

    useEffect(() => {
        if (!token) return; // Prevent fetch if no token

        const fetchTasks = async () => {
            try {
                const response = await fetch('/api/getTask', {
                    method: 'GET', // Changed to GET
                    headers: {
                        'Authorization': `Bearer ${token}` // Send token in Authorization header
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    if (Array.isArray(data)) {
                        setTask(data);
                    } else {
                        setTask([]);
                    }
                } else {
                    console.error('Failed to fetch tasks:', data.message);
                    setTask([]);
                }
            } catch (error) {
                console.error('Error fetching tasks:', error);
                setTask([]);
            }
        };

        fetchTasks();
    }, [refreshTasks, token]);

    const handlePopEdit = (item) => {
        setToUpdate({
            _id: item._id,
            title: item.title,
            description: item.description,
            date: item.date ? new Date(item.date).toISOString().split('T')[0] : '',
            status: item.status
        });
        setenablePopup(true);
    };

    const handleDelete = async (item) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            try {
                const response = await fetch(`/api/getTask`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': `application/json`,
                        'Authorization': `Bearer ${token}` // Send token in Authorization header
                    },
                    body: JSON.stringify({ _id: item._id }) // Only send _id in body
                });
                const result = await response.json();
                if (response.ok) {
                    alert('Task deleted successfully');
                    refreshTask(token); // Call the refreshTask function with token
                } else {
                    alert('Failed to delete task: ' + result.message);
                }
            } catch (error) {
                console.error('Error deleting task:', error);
                alert('Failed to delete task. Please try again.');
            }
        }
    };
    return (<>{
        isToken &&
        <main className="bg-gradient-to-br from-stone-100 to-stone-300 w-full min-h-[97vh] p-6">
            <h1 className="text-4xl font-bold text-center text-cyan-500 mb-8 drop-shadow-lg">
                Task Manager
            </h1>

           <button
  className="
    text-white font-bold fixed top-[6vh] right-0 mx-5
    bg-gradient-to-r from-pink-400 to-pink-600 rounded-l-2xl
    shadow-lg hover:shadow-xl hover:translate-x-1
    transition-all duration-300 ease-in-out cursor-pointer
    text-base sm:text-lg md:text-xl lg:text-2xl
    px-4 py-2 flex items-center justify-center
  "
  onClick={() => setAddTask(true)}
>
  <span className="sm:hidden">+</span>
  <span className="hidden sm:inline">Add Task</span>
</button>


            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.isArray(task) && task.map((item, index) => (
                        <div key={index}
                            className="bg-white rounded-xl shadow-lg hover:shadow-xl 
                            transform hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="p-5 flex flex-col h-full">
                                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                                 <img src="https://cdn-icons-png.flaticon.com/512/889/889647.png" alt="" className="w-10 h-10 inline-block" />   {item.title || "Task Name"}
                                </h2>
                                <p className="text-gray-600 flex-grow mb-4 ">
                                    {item.description || "Task description goes here..."}
                                </p>
                                <div className="border-t pt-4">
                                    <span className="text-sm text-gray-500">
                                        Due: {item.date ? new Date(item.date).toISOString().split("T")[0] : "Not set"}
                                    </span>
                                </div>
                                <div className="flex justify-between mt-4 gap-2">
                                    <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 " onClick={() => handlePopEdit(item)} disabled={!isToken}>
                                        Edit
                                    </button>
                                    <button className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors duration-200" onClick={() => handleDelete(item)} disabled={!isToken}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {enablePopup && <EditPopupTAsk />}
            {addTask && <PopupAddTask />}
        </main>
    }</>);
}
