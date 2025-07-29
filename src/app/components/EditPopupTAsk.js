import { useData } from "../context/data"
export default function EditPopupTAsk() {
    const { form, setForm, addTask, setAddTask, isToken, token, setToken, setIsToken, enablePopup, setenablePopup, toUpdate, setToUpdate,UpdateSubmit } = useData()
       const handleChange = (e) => {
        const { name, value } = e.target
        setToUpdate(prev => ({
            ...prev,
            [name]: value
        }))
        console.log(toUpdate)
    }



    return (
        <>
            <form onSubmit={UpdateSubmit} className="bg-gray-800 p-4 flex flex-col gap-4 lg:w-1/5 lg:h-[30vh] mx-auto z-20 fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-lg shadow-xl sm:w-full md:w-full sm:h-[50vh] md:h-[50vh]">
                <div className="top-buttons flex justify-between items-center">
                    <h1 className="text-center font-bold text-blue-200 text-2xl">Update TAsk</h1>
                    <button type="button" className="bg-red-600 px-2 py-1 rounded-md hover:bg-red-700 transition-all duration-300 ease-in-out text-3xl" onClick={() => setAddTask(false)}>X</button>
                </div>
                <input
                    type="text"
                    name="title"
                    value={toUpdate.title}
                    onChange={handleChange}
                    placeholder="Enter task here"
                    required
                    className="border border-white rounded-2xl p-2"
                />
                <input
                    type="date"
                    name="dueDate"
                    value={toUpdate.date}
                    onChange={handleChange}
                    placeholder="Enter last date to complete the task"
                    required
                    className="border border-white rounded-2xl p-2"
                />
                <select
                    name="status"
                    value={toUpdate.status}
                    onChange={handleChange}
                    required
                    className="border border-white rounded-2xl p-2"
                >
                    
                    <option className="bg-gray-900" value="pending">Pending</option>
                    <option className="bg-gray-900" value="in-progress">In Progress</option>
                    <option className="bg-gray-900" value="completed">Completed</option>
                </select>
                <textarea
                    name="description"
                    value={toUpdate.description}
                    onChange={handleChange}
                    id="area"
                    placeholder="Enter description here"
                    rows={5}
                    cols={50}
                    required
                    className="border border-white rounded-2xl p-2"
                ></textarea>
                <button type="submit" className="bg-purple-400 p-2 w-fit mx-auto rounded-2xl mt-5 text-white font-bold hover:bg-purple-500 transition-all duration-300">Update Task</button>
            </form>
        </>
    )
}