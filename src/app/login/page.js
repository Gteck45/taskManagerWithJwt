"use client"
import { useState, useEffect, useContext } from 'react'
import { useData } from "../context/data";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter()
    const { isToken, token, setToken, setIsToken } = useData()
    const [showButton, setShowButton] = useState(true)
    const [loginForm, setLoginForm] = useState(false)
    const [signUpForm, setSignUpForm] = useState(false)
    const [loginUser, setLoginUser] = useState({
        email: "",
        password: ""
    })
    const [signUpUser, setSignUpUser] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    })
    const handleloginChange = (e) => {
        const { name, value } = e.target;
        setLoginUser(prevData => ({
            ...prevData,
            [name]: value
        }));


    };
    const handleSignUpChange = (e) => {
        const { name, value } = e.target;
        setSignUpUser(prevData => ({
            ...prevData,
            [name]: value
        }));


    };

    const loginSubmit = (e) => {
        e.preventDefault()
        fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginUser)
        })
            .then(async (res) => {
                const data = await res.json();
                console.log(data);
                localStorage.setItem("token", data.token);
                setIsToken(true);
                router.push("/"); // Redirect immediately after successful login
            })
            .catch((err) => {
                console.error("Fetch error:", err);
            });

    }
    const SignUpSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("/api/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(signUpUser)
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 400) {
                alert("Email already exists. Please log in.");
                setSignUpForm(false);
                setLoginForm(true);
                setShowButton(false); // ← ADD THIS
            } else if (res.ok) {
                alert("Sign up successful!");
                setSignUpForm(false);
                setLoginForm(true);
                setShowButton(false); // ← ADD THIS
            } else {
                // server responded with an error
                console.error("Signup failed:", data.message);
                alert(data.message || "Signup error");
            }
        } catch (err) {
            console.error("Network or server error:", err);
            alert("Something went wrong!");
        }
    };


    return <div className="bg-stone-200 w-screen h-screen flex justify-center ">
        <div className="buttons text-black mt-20 ">
            {showButton && <>
                <button className="mx-2 p-2 border rounded-2xl cursor-pointer bg-green-500 text-white font-bold text-2xl hover:bg-green-600" onClick={() => { setShowButton(false); setLoginForm(true) }}  >login</button>
                <button className="mx-2 p-2 border rounded-2xl cursor-pointer bg-blue-500 text-white font-bold text-2xl hover:bg-blue-600" onClick={() => { setShowButton(false); setSignUpForm(true) }}>signup</button></>
            }
        </div >
        {
            loginForm && <form onSubmit={loginSubmit} className="flex flex-col gap-2 items-center bg-gray-600 text-black font-bold text-2xl  justify-center fixed top-[40vh] p-3 rounded-2xl">
                <input onChange={handleloginChange} name="email" type="text" placeholder="email" value={loginUser.email} className="mx-2 p-2 border rounded-2xl cursor-pointer bg-white text-black font-bold text-sm w-full " />
                <input onChange={handleloginChange} name="password" type="password" placeholder="password" value={loginUser.password} className="mx-2 p-2 border rounded-2xl cursor-pointer bg-white text-black font-bold text-sm w-full" />
                <button className="mx-2 p-2 border rounded-2xl cursor-pointer bg-green-500 text-white font-bold text-2xl hover:bg-green-600" >login</button>
            </form>
        }
        {
            signUpForm && <form onSubmit={SignUpSubmit} className="flex flex-col gap-2 items-center bg-gray-600 text-black font-bold text-sm  justify-center fixed top-[40vh] p-3 rounded-2xl">
                <input type="text" placeholder="email" className="mx-2 p-2 border rounded-2xl cursor-pointer bg-white text-black font-bold text-sm " name="email" value={signUpUser.email} onChange={handleSignUpChange} />
                <input type="password" placeholder="password" className="mx-2 p-2 border rounded-2xl cursor-pointer bg-white text-black font-bold text-sm" name="password" value={signUpUser.password} onChange={handleSignUpChange} />
                <input type="password" placeholder="Confirm password" className="mx-2 p-2 border rounded-2xl cursor-pointer bg-white text-black font-bold text-sm" name="confirmPassword" value={signUpUser.confirmPassword} onChange={handleSignUpChange} />
                {signUpUser.confirmPassword.length > 0 && <p className="text-red-500 text-sm">{signUpUser.password === signUpUser.confirmPassword ? "" : "password not match"}</p>}
                <button className="mx-2 p-2 border rounded-2xl cursor-pointer bg-green-500 text-white font-bold text-xl hover:bg-green-600">SignUP</button>
            </form>
        }



    </div >
}
