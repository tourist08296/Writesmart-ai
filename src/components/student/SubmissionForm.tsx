"use client";

import { useState, useRef } from "react";
import { Upload, FileText, Loader2, Image as ImageIcon, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SubmissionFormProps {
    onSubmit: (data: { type: "text" | "image"; content: string | File }) => void;
    isLoading: boolean;
}

export default function SubmissionForm({ onSubmit, isLoading }: SubmissionFormProps) {
    const [type, setType] = useState<"text" | "image">("text");
    const [text, setText] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (type === "text" && text.trim()) {
            onSubmit({ type: "text", content: text });
        } else if (type === "image" && image) {
            onSubmit({ type: "image", content: image });
        }
    };

    return (
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="mb-6 flex gap-4">
                <button
                    onClick={() => setType("text")}
                    className={cn(
                        "flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all",
                        type === "text"
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                >
                    <FileText className="h-4 w-4" />
                    直接输入文字
                </button>
                <button
                    onClick={() => setType("image")}
                    className={cn(
                        "flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all",
                        type === "image"
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                >
                    <ImageIcon className="h-4 w-4" />
                    拍照上传作文
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <AnimatePresence mode="wait">
                    {type === "text" ? (
                        <motion.div
                            key="text"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="在这里粘贴或输入你的作文内容..."
                                disabled={isLoading}
                                className="h-64 w-full resize-none rounded-xl border-2 border-gray-100 p-4 outline-none transition-focus focus:border-indigo-600"
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="image"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            {!preview ? (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 transition-colors hover:border-indigo-400 hover:bg-indigo-50"
                                >
                                    <Upload className="mb-4 h-12 w-12 text-gray-400" />
                                    <p className="text-gray-600">点击或将作文照片拖到此处</p>
                                    <p className="mt-2 text-xs text-gray-400">支持 JPG, PNG 格式</p>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageChange}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                </div>
                            ) : (
                                <div className="relative h-64 w-full overflow-hidden rounded-xl border">
                                    <img src={preview} alt="Preview" className="h-full w-full object-contain" />
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    type="submit"
                    disabled={isLoading || (type === "text" ? !text.trim() : !image)}
                    className="flex w-full items-center justify-center gap-3 rounded-xl bg-indigo-600 py-4 text-lg font-bold text-white transition-all hover:bg-indigo-700 disabled:bg-gray-300"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            正在分析作文...
                        </>
                    ) : (
                        <>
                            <FileText className="h-5 w-5" />
                            开始智能评分与分析
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
