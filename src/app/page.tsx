import Link from "next/link";
import { ArrowRight, PenLine, GraduationCap, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-20">
      <div className="max-w-4xl text-center">
        <div className="mb-6 inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-600">
          <ShieldCheck className="mr-2 h-4 w-4" />
          守护学生隐私，专业写作提升
        </div>
        <h1 className="mb-8 text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
          提升你的写作能力 <br />
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            WriteSmart AI 伴你成长
          </span>
        </h1>
        <p className="mb-12 text-xl text-gray-600">
          基于最新 AI 技术，为您的作文提供全方位评分、专业反馈及修改建议。
          支持直接输入或拍照提交。
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/student"
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-indigo-700 sm:w-auto"
          >
            学生开始写作
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/teacher"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-8 py-4 text-lg font-semibold text-gray-700 transition-all hover:bg-gray-50 sm:w-auto"
          >
            教师管理端
          </Link>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3">
        {[
          {
            title: "全方位评估",
            desc: "从结构、内容、语言、语法等维度给出专业反馈。",
            icon: GraduationCap,
          },
          {
            title: "拍照即识别",
            desc: "支持手写作文拍照上传，AI 自动识别文字内容。",
            icon: PenLine,
          },
          {
            title: "针对性建议",
            desc: "不只是纠错，更是提供好句推荐，助力文采提升。",
            icon: ArrowRight,
          },
        ].map((feature, i) => (
          <div key={i} className="rounded-2xl border bg-white p-8 transition-shadow hover:shadow-lg">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <feature.icon className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900">{feature.title}</h3>
            <p className="text-gray-600">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
