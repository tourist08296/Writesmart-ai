"use client";

import { useState, useEffect } from "react";
import SubmissionForm from "@/components/student/SubmissionForm";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Trophy, BookOpen, AlertCircle, History, ChevronRight } from "lucide-react";

export default function StudentPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<any | null>(null);
    const [history, setHistory] = useState<any[]>([]);

    // 加载历史记录
    useEffect(() => {
        const saved = localStorage.getItem("writesmart_history");
        if (saved) {
            setHistory(JSON.parse(saved));
        }
    }, []);

    const handleSubmit = async (data: { type: "text" | "image"; content: string | File }) => {
        setIsLoading(true);
        setResult(null);

        try {
            const formData = new FormData();
            formData.append("type", data.type);
            formData.append("content", data.content);

            const response = await fetch("/api/analyze", {
                method: "POST",
                body: formData,
            });

            const json = await response.json();
            if (json.error) {
                alert(json.error);
            } else {
                setResult(json);
                // 保存到历史记录
                const newRecord = {
                    ...json,
                    id: Date.now(),
                    date: new Date().toLocaleString(),
                    type: data.type
                };
                const newHistory = [newRecord, ...history];
                setHistory(newHistory);
                localStorage.setItem("writesmart_history", JSON.stringify(newHistory));
            }
        } catch (error) {
            console.error("Submission failed:", error);
            alert("提交失败，请检查网络或 API 配置。");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto max-w-6xl px-4 py-12">
            <div className="mb-10 text-center">
                <h2 className="mb-4 text-3xl font-extrabold text-gray-900">提交你的作文</h2>
                <p className="text-gray-600 text-lg">
                    写下你的故事，让我们为你提供专业的改进建议。
                </p>
            </div>

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
                {/* 左侧：提交与历史 */}
                <div className="lg:col-span-5 space-y-8">
                    <section>
                        <SubmissionForm onSubmit={handleSubmit} isLoading={isLoading} />
                    </section>

                    <section className="rounded-2xl border bg-white p-6 shadow-sm">
                        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
                            <History className="h-5 w-5 text-indigo-500" />
                            进步记录
                        </h3>
                        <div className="space-y-3">
                            {history.length === 0 ? (
                                <p className="py-8 text-center text-sm text-gray-400">暂无记录，开始你的第一次写作吧！</p>
                            ) : (
                                history.slice(0, 5).map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setResult(item)}
                                        className="flex w-full items-center justify-between rounded-xl border border-gray-100 p-3 text-left transition-colors hover:bg-indigo-50"
                                    >
                                        <div>
                                            <div className="text-sm font-bold text-gray-800">评分: {item.score.total}</div>
                                            <div className="text-xs text-gray-400">{item.date}</div>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-gray-300" />
                                    </button>
                                ))
                            )}
                        </div>
                    </section>
                </div>

                {/* 右侧：结果展示 */}
                <section className="lg:col-span-7 min-h-[400px]">
                    <AnimatePresence mode="wait">
                        {!result && !isLoading ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex h-full flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 text-center text-gray-400"
                            >
                                <BookOpen className="mb-4 h-16 w-16" />
                                <p className="text-lg">提交作文后，你将在这里看到分析结果</p>
                            </motion.div>
                        ) : isLoading ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex h-full flex-col items-center justify-center space-y-4"
                            >
                                <div className="h-16 w-16 animate-bounce rounded-full bg-indigo-500 shadow-xl" />
                                <p className="text-xl font-medium text-indigo-600">AI 正在阅读你的文字...</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                {/* 评分卡片 */}
                                <div className="rounded-2xl border bg-white p-6 shadow-sm">
                                    <div className="mb-4 flex items-center justify-between">
                                        <h3 className="text-xl font-bold flex items-center gap-2">
                                            <Trophy className="text-yellow-500" />
                                            评分报告
                                        </h3>
                                        <div className="text-3xl font-black text-indigo-600">
                                            {result.score.total}<span className="text-sm font-normal text-gray-400">/100</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        {result.score.dimensions.map((dim: any) => (
                                            <div key={dim.label} className="rounded-xl bg-gray-50 p-4">
                                                <div className="mb-1 flex justify-between text-sm">
                                                    <span className="font-bold text-gray-700">{dim.label}</span>
                                                    <span className="font-mono text-indigo-600">{dim.score}</span>
                                                </div>
                                                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                                                    <div
                                                        className="h-full bg-indigo-500 transition-all duration-1000"
                                                        style={{ width: `${dim.score}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* 反馈建议 */}
                                <div className="rounded-2xl border bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
                                    <h3 className="mb-4 text-lg font-bold flex items-center gap-2">
                                        <Sparkles className="text-indigo-600" />
                                        修改建议
                                    </h3>
                                    <p className="mb-6 leading-relaxed text-gray-700">{result.feedback}</p>
                                    <ul className="space-y-3">
                                        {result.suggestions.map((s: string, i: number) => (
                                            <li key={i} className="flex gap-2 text-sm text-gray-600">
                                                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
                                                {s}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* 名言推荐 */}
                                <div className="rounded-2xl border bg-white p-6">
                                    <h3 className="mb-4 text-lg font-bold">参考名言</h3>
                                    <div className="space-y-4">
                                        {result.quotes.map((q: any, i: number) => (
                                            <blockquote key={i} className="border-l-4 border-indigo-200 pl-4 py-1 italic">
                                                <p className="text-gray-700">"{q.text}"</p>
                                                <footer className="mt-2 text-sm text-gray-500">— {q.author}</footer>
                                            </blockquote>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>
            </div>
        </div>
    );
}
