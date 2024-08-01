"use client";

import { useAuthStore } from "@/store/Auth"
import { useState } from "react"

export default function RegisterPage() {
    const { createAccount, login } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        //Collect Data
        const formData = new FormData(event.currentTarget)
        const firstName = formData.get("firstname")
        const lastName = formData.get("lastname")
        const email = formData.get("email")
        const password = formData.get("password")


        //Validate
        if (!(firstName && lastName && email && password)) {
            setError(() => "Please provide valid information!!")
            return
        }


        //Call the store
        setIsLoading(() => true)
        setError(() => "")


        const response = await createAccount(
            `${firstName} ${lastName}`,
            email?.toString(),
            password?.toString()
        )

        if (response.error) {
            setError(() => response.error!.message)
        }
        else {
            const loginResponse = await login(email.toString(), password.toString())

            if (loginResponse.error) {
                setError(() => loginResponse.error!.message)
            }
        }

        setIsLoading(() => false)
    }


    return (
        <div className="">
            {error && (
                <p className="mt-8 text-center text-sm text-red-500 dark:text-red-400">{error}</p>
            )}

            <form
                className="my-8"
                onSubmit={submitHandler}
            >
                <div
                    className="mb-4 flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0"
                >

                </div>

            </form>
        </div>
    )
}
