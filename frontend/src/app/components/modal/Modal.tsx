"use client";
import { useCallback, useEffect, useState } from "react";
import { MdClose } from "react-icons/md";

interface ModelProps {
    title: string;
    content: React.ReactElement; // Passes in react elements '<p> Test <p>'
    isOpen: boolean;
    close: () => void;
}


const Modal: React.FC<ModelProps> = ({ title, content, isOpen, close }) => {

    const [showModal, setShowModal] = useState(isOpen)

    useEffect(() => {
        setShowModal(isOpen)
    }, [isOpen])

    const handleClose = useCallback(() => {
        setShowModal(false)

        setTimeout(() => {
            close();
        }, 100)
    }, [close])

    if (!isOpen) {
        return null;
    }

    return (
        <div className="flex items-center justify-center fixed -inset-0 z-50 bg-black/60">
            <div className="relative w-[90%] md:w-[80%] lg:w-[700px] my-6 mx-auto h-auto">
                <div className={`translate duration-600 h-full ${showModal ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-10'}`}>
                    <div className="w-full h-auto rounded-xl relative flex flex-col bg-white">
                        <header className="h-[60px] flex items-center p-6 rounded-t justify-center relative border-b">
                            <div
                                className="p-3 absolute right-3 hover:bg-gray-300 rounded-full cursor-pointer"
                                onClick={handleClose}>
                                <MdClose className="text-2xl" />
                            </div>

                            <h2 className="text-lg font-bold">{title}</h2>
                        </header>

                        <section className="p-6">
                            {content}
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal