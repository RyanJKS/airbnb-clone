"use client";

import useSignUpModal from "@/app/hooks/useSignUpModal";
import Modal from "./Modal";
import CustomButton from "../forms/CustomButton";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import apiService from "@/app/api/apiService";
import { handleLogin } from "@/app/lib/actions";


interface IFormInputs {
    name: string,
    email: string;
    password1: string;
    password2: string;
}

const schema = yup.object().shape({
    name: yup.string()
        .matches(/^[A-Za-z\s]+$/, 'Name should only contain alphabetic characters.')
        .required('Name is required.'),
    email: yup.string().email('Invalid email address').required('Email is required'),
    password1: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
    password2: yup
        .string()
        .oneOf([yup.ref('password1')], 'Passwords must match')
        .required('Repeat Password is required'),
});

const SignUpModal = () => {
    const router = useRouter();
    const signUpModal = useSignUpModal();
    const [errorMessage, setErrorMessage] = useState<string[]>([]);

    const { register, handleSubmit, formState: { errors } } = useForm<IFormInputs>({
        resolver: yupResolver(schema),
    });

    const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
        try {
            const response = await apiService.post('/api/auth/register/', data);

            if (response.access) {
                handleLogin(response.user.pk, response.access, response.refresh)
                signUpModal.close();
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

    const handleButtonClick = handleSubmit(onSubmit);

    const content = (
        <form className="space-y-4">
            <input
                type="email"
                className="w-full h-[54px] px-4 border-gray-300 rounded-xl"
                placeholder="Your Name"
                {...register('name')}
            />
            {errors.name && <div className="text-red-500">{errors.name.message}</div>}

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
                {...register('password1')}
            />
            {errors.password1 && <div className="text-red-500">{errors.password1.message}</div>}

            <input
                type="password"
                className="w-full h-[54px] px-4 border-gray-300 rounded-xl"
                placeholder="Repeat Password"
                {...register('password2')}
            />
            {errors.password2 && <div className="text-red-500">{errors.password2.message}</div>}

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
            isOpen={signUpModal.isOpen}
            close={signUpModal.close}
            title="Sign Up"
            content={content}
        />
    )
}

export default SignUpModal;