"use client"
import React, { useContext, createContext, useEffect, useState } from "react";
const data = createContext();
export const DataProvider = ({ children }) => {
    const [form, setForm] = useState([])
    const [addTask, setAddTask] = useState(false)
    const [isToken, setIsToken] = useState(false)
    const [token, setToken] = useState("")
    const [enablePopup,setenablePopup]=useState(false);
    const [toUpdate,setToUpdate] = useState({
        _id: '',
        title: '',
        description: '',
        date: '',
        status: ''
    })
    const [refreshTasks, setRefreshTasks] = useState(false); 
    const [task, setTask] = useState([])
    const [isLoading, setIsLoading] = useState(true); // New loading state

const refreshTask = async () => {
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

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setIsToken(true);
            setToken(storedToken);
        } else {
            setIsToken(false);
            setToken(""); // Ensure token is empty if not present
        }
        setIsLoading(false); // Set loading to false after initial check
    }, []); // Run only once on mount to load token from localStorage

    const UpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/getTask', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Send token in Authorization header
                },
                body: JSON.stringify(toUpdate) // toUpdate already contains _id, title, description, date, status
            });
            const data = await response.json();
            if (response.ok) {
                alert("Task updated successfully!");
                setenablePopup(false);
                refreshTask();
                setRefreshTasks(prev => !prev); // Toggle to trigger re-fetch in Main.jsx
            } else {
                alert("Error updating task: " + (data.message || "Unknown error occurred"));
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error updating task: Please try again.");
        }
    };



    return (
        <data.Provider value={{ form, setForm, addTask, setAddTask,isToken, token, setToken,setIsToken,enablePopup ,setenablePopup,toUpdate,setToUpdate ,UpdateSubmit, refreshTasks,task,setTask, isLoading,refreshTask}} >
            {children}
        </data.Provider >
    )
}

export const useData=() => useContext(data)
