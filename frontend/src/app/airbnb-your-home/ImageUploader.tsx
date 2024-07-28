import React from 'react';

interface ImageUploaderProps {
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    imagePreviews: Array<{ file: File, url: string }>;
    removeImage: (url: string) => void;
    error?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ handleImageChange, imagePreviews, removeImage, error }) => {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="images">Upload Images</label>
            <div className="flex flex-col items-center justify-center w-full mb-2">
                <label
                    htmlFor="images"
                    className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer ${error ? 'border-red-500' : 'border-gray-300'} bg-gray-50`}
                >
                    <div className="flex flex-col items-center justify-center pt-7">
                        <svg
                            className="w-8 h-8 text-gray-400 group-hover:text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M7 16V8a4 4 0 014-4h2a4 4 0 014 4v8m-4 4h.01M5 20h14a2 2 0 002-2V10a2 2 0 00-2-2h-3.586a1 1 0 00-.707.293l-1.414 1.414a1 1 0 01-.707.293H9.414a1 1 0 01-.707-.293L7.293 8.293A1 1 0 006.586 8H3a2 2 0 00-2 2v8a2 2 0 002 2z"
                            ></path>
                        </svg>
                        <p className="mt-1 text-sm text-gray-600 group-hover:text-gray-600">
                            <span className="font-medium">Click to upload</span> or drag and drop
                        </p>
                        <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                    <input
                        id="images"
                        name="images"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                    />
                </label>
            </div>
            {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
            <div className="grid grid-cols-3 gap-4 mb-4">
                {imagePreviews.map(({ url }) => (
                    <div key={url} className="relative">
                        <img src={url} alt="Preview" className="object-cover rounded-lg w-full h-full" />
                        <button
                            type="button"
                            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full"
                            onClick={() => removeImage(url)}
                        >
                            X
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageUploader;
