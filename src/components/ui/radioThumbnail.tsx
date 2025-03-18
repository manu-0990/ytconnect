import React from "react";

interface ImageOption {
    id: string;
    src: string;
}

interface ImageRadioGroupProps {
    images: ImageOption[];
    selectedImageId: string;
    onChange: (id: string) => void;
}

const ImageRadioGroup = ({ images, selectedImageId, onChange, }: ImageRadioGroupProps) => {
    return (
        <div className="space-y-3">
            {images.map((image) => {
                const isSelected = image.id === selectedImageId;

                return (
                    <label
                        key={image.id}
                        className={`w-80 block rounded-lg p-2 cursor-pointer border transition-colors ${isSelected ? "border-slate-500" : "border-neutral-700"}`}
                    >
                        <div className="flex items-center justify-between">
                            <div
                                className={`mr-4 h-6 w-6 flex items-center justify-center rounded-full border-2 ${isSelected ? "bg-slate-100" : "border-gray-500"}`}
                            >
                                {isSelected && (
                                    <svg
                                        className="h-4 w-4 text-black"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={3}
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>


                            <img
                                src={image.src}
                                alt={image.id}
                                className="border border-green-700 h-40 w-64 object-cover rounded-md"
                            />
                        </div>


                        <input
                            type="radio"
                            name="imageOption"
                            value={image.id}
                            checked={isSelected}
                            onChange={() => onChange(image.id)}
                            className="hidden"
                        />
                    </label>
                );
            })}
        </div>
    );
};

export default ImageRadioGroup;
