"use client";

import useSignUpModal from "@/app/hooks/useSignUpModal";
import Modal from "./Modal";
import CustomButton from "../forms/CustomButton";

const SignUpModal = () => {

    const signUpModal = useSignUpModal()

    const content = (
        <>
            <form className="space-y-4">
                <input type="email" className="w-full h-[54px] px-4 border-gray-300 rounded-xl" placeholder="Your Email" />
                <input type="password" className="w-full h-[54px] px-4 border-gray-300 rounded-xl" placeholder="Your Password" />
                <input type="password" className="w-full h-[54px] px-4 border-gray-300 rounded-xl" placeholder="Repeat Password" />


                <div className="p-5 bg-airbnb text-white rounded-xl opacity-80">
                    The error message
                </div>
                <CustomButton label="Submit" onClick={() => console.log("Sent")} />
            </form>
        </>
    )

    return (
        <Modal
            isOpen={signUpModal.isOpen}
            close={signUpModal.close}
            title="Sign Up"
            content={content}
        />
    )
}

export default SignUpModal;