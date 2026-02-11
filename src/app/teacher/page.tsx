"use client";

import { useState, useEffect } from "react";
import { Users, BarChart3, MessageSquare, AlertTriangle, TrendingUp } from "lucide-react";

export default function TeacherPage() {
    const [stats, setStats] = useState({
        total: 0,
        avgScore: 0,
        commonIssues: [] as string[],
        recentScores: [] as number[],
    });

    useEffect(() => {
        const saved = localStorage.getItem("writesmart_history");
        if (saved) {
            const history = JSON.parse(saved);
            const scores = history.map((h: any) => h.score.total);
            const avg = scores.reduce((a: number, b: number) => a + b, 0) / scores.length;

            // 模拟提取常见问题（实际应由 AI 汇总）
            const issues = ["标点符号规范性", "细节描写不足", "逻辑连词单一"];

            setStats({
                total: history.length,
                avgScore: Math.round(avg),
                commonIssues: issues,
                recentScores: scores.slice(0, 10),
            });
        }
    }, []);

    return (
        <div className="container mx-auto max-w-6xl px-4 py-12">
            <div className="mb-10">
                <h2 className="text-3xl font-extrabold text-gray-900">教师端仪表盘</h2>
                <p className="text-gray-600">实时监控班级写作表现，发现教学痛点。</p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                {[
                    { label: "已提交作文", value: stats.total, icon: MessageSquare, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "班级平均分", value: stats.avgScore || "-", icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
                    { label: "活跃学生", value: stats.total > 0 ? 1 : 0, icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
                    { label: "待处理问题", value: stats.commonIssues.length, icon: AlertTriangle, color: "text-orange-600", bg: "bg-orange-50" },
                ].map((stat, i) => (
                    <div key={i} className="rounded-2xl border bg-white p-6 shadow-sm">
                        <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}>
                            <stat.icon className="h-5 w-5" />
                        </div>
                        <div className="text-sm font-medium text-gray-500">{stat.label}</div>
                        <div className="mt-1 text-3xl font-bold text-gray-900">{stat.value}</div>
                    </div>
                ))}
            </div>

            <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* 常见问题汇总 */}
                <section className="rounded-2xl border bg-white p-8">
                    <h3 className="mb-6 flex items-center gap-2 text-xl font-bold">
                        <BarChart3 className="h-5 w-5 text-indigo-500" />
                        学生常见问题汇总
                    </h3>
                    <div className="space-y-4">
                        {stats.commonIssues.map((issue, i) => (
                            <div key={i} className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
                                <span className="font-medium text-gray-700">{issue}</span>
                                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-600">高频出现</span>
                            </div>
                        ))}
                        {stats.commonIssues.length === 0 && (
                            <p className="py-10 text-center text-gray-400">目前尚无足够数据生成汇总</p>
                        )}
                    </div>
                </section>

                {/* 教学建议 */}
                <section className="rounded-2xl border bg-indigo-600 p-8 text-white">
                    <h3 className="mb-4 text-xl font-bold">本周教学重点建议</h3>
                    <p className="mb-6 opacity-90">
                        根据 AI 对班级作文的分析，建议本周重点讲解**描写方法**与**标点符号的规范使用**。
                    </p>
                    <ul className="space-y-3 opacity-90">
                        <li className="flex gap-2">
                            <div className="h-5 w-5 shrink-0 rounded-full bg-white/20 text-center text-xs leading-5">1</div>
                            引导学生学习感官描写技巧。
                        </li>
                        <li className="flex gap-2">
                            <div className="h-5 w-5 shrink-0 rounded-full bg-white/20 text-center text-xs leading-5">2</div>
                            进行一次针对性的标点纠错练习。
                        </li>
                    </ul>
                </section>
            </div>
        </div>
    );
}
