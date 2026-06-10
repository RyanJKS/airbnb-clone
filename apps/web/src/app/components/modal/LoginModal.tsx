"use client";

import useLoginModal from "@/app/hooks/useLoginModal";
import Modal from "./Modal";
import CustomButton from "../forms/CustomButton";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import apiService from "@/app/api/apiService";
import { handleLogin } from "@/app/lib/actions";
import { useAuth } from "@/app/contexts/AuthContext";

interface IFormInputs {
    email: string;
    password: string;
}

const schema = yup.object().shape({
    email: yup.string().email('Invalid email address').required('Email is required'),
    password: yup.string().required('Password is required')
});

const LoginModal = () => {
    const router = useRouter();
    const loginModal = useLoginModal()
    const { refreshUserId } = useAuth();
    const [errorMessage, setErrorMessage] = useState<string[]>([]);

    const { register, handleSubmit, formState: { errors } } = useForm<IFormInputs>({
        resolver: yupResolver(schema),
    });

    const submitLogin: SubmitHandler<IFormInputs> = async (data) => {
        try {
            const response = await apiService.post('/api/auth/login/', data);

            if (response.access) {
                handleLogin(response.user.pk, response.access, response.refresh)
                await refreshUserId(); // Update userId in context using getUserId
                loginModal.close();
                router.push('/');
            } else {
                const tempErrors: string[] = Object.values(response.data).flat() as string[];
                setErrorMessage(tempErrors);
            }
        } catch (error: any) {
            if (error.response && error.response.data) {
                const tempErrors: string[] = Object.values(error.response.data).flat() as string[];
                setErrorMessage(tempErrors);
            } else {
                setErrorMessage([error.message]);

            }
        }
    };

    const handleButtonClick = handleSubmit(submitLogin);

    const content = (
        <form className="space-y-4">
            <input
                type="email"
                className="w-full h-[54px] px-4 border-gray-300 rounded-xl"
                placeholder="Your Email"
                {...register('email')}
            />
            {errors.email && <div className="text-red-500">{errors.email.message}</div>}

            <input
                type="password"
                className="w-full h-[54px] px-4 border-gray-300 rounded-xl"
                placeholder="Your Password"
                {...register('password')}
            />
            {errors.password && <div className="text-red-500">{errors.password.message}</div>}

            {errorMessage.map((error, index) => {
                return (
                    <div
                        key={`error_${index}`}
                        className="p-5 bg-airbnb text-white rounded-xl opacity-80"
                    >
                        {error}
                    </div>
                )
            })}

            <CustomButton label="Submit" onClick={handleButtonClick} />
        </form>
    );

    return (
        <Modal
            isOpen={loginModal.isOpen}
            close={loginModal.close}
            title="Log in"
            content={content}
        />
    )
}

export default LoginModal;