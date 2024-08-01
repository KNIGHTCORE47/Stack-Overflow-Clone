"use client";

import { useAuthStore } from "@/store/Auth";
import { useState } from "react";

export default function LoginPage() {
    const { login } = useAuthStore()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        //Collect Data
        const formData = new FormData(event.currentTarget)
        const email = formData.get("email")
        const password = formData.get("password")


        //Validate
        if (!(email && password)) {
            setError(() => "Please provide valid email or password")
            return
        }



        //Handle loading and error
        setIsLoading(() => true)
        setError(() => "")



        //call the store
        const loginResponse = await login(email.toString(), password.toString())

        if (loginResponse.error) {
            setError(() => loginResponse.error!.message)
        }

        setIsLoading(() => false)
    }

    return (
        <div></div>
    )
}