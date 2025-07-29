import { useData } from "../context/data"
import { useState } from "react"

export default function PopupAddTask() {
    const {  form, setForm, addTask, setAddTask, isToken, token, setToken, setIsToken, enablePopup, setenablePopup, toUpdate, setToUpdate, UpdateSubmit, refreshTasks,refreshTask  } = useData()
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        description: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const sendData = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch("api/createTask", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // Send token in Authorization header
                },
                body: JSON.stringify(formData) // formData already contains title, date, description
            });
            const result = await response.json();
            if (result.success) {
                alert("Task added successfully!");
               setAddTask(false); // Close the popup
               refreshTask()
            } else {
                alert("Failed to add task: " + result.message);
            }
        } catch (error) {
            console.error("Error adding task:", error);
            alert("Failed to add task. Please try again.");
        }
    }

    return (
        <>
            <form onSubmit={sendData} className="bg-gray-800 p-4 flex flex-col gap-4 lg:w-1/5 lg:h-[30vh] mx-auto z-20 fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-lg shadow-xl sm:w-full md:w-full sm:h-[50vh] md:h-[50vh] ">
                <div className="top-buttons flex justify-between items-center">
                    <h1 className="text-center font-bold text-blue-200 text-2xl">Enter Details</h1>
                    <button type="button" className="bg-red-600 px-2 py-1 rounded-md hover:bg-red-700 transition-all duration-300 ease-in-out text-3xl" onClick={() => setAddTask(false)}>X</button>
                </div>
                <input 
                    type="text" 
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter task here" 
                    required 
                    className="border border-white rounded-2xl p-2" 
                />
                <input 
                    type="date" 
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    placeholder="Enter last date to complete the task" 
                    required 
                    className="border border-white rounded-2xl p-2"
                />
                <textarea 
                    name="description" 
                    value={formData.description}
                    onChange={handleChange}
                    id="area" 
                    placeholder="Enter description here" 
                    rows={5} 
                    cols={50} 
                    required 
                    className="border border-white rounded-2xl p-2"
                ></textarea>
                <button type="submit" className="bg-purple-400 p-2 w-fit mx-auto rounded-2xl mt-5 text-white font-bold hover:bg-purple-500 transition-all duration-300">Add Task</button>
            </form>
        </>
    )
}
