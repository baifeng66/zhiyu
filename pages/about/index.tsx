import Head from "next/head";
import Link from "next/link";
import { canonicalUrl } from "../../lib/meta";
import { siteConfig } from "../../lib/site.config";
import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import BackToTop from "../../components/BackToTop";

// 中文注释：简洁"关于"页，后续可改为 Markdown 渲染。
export default function AboutPage() {
    const url = canonicalUrl("/about");
    const [theme, setTheme] = useState<"light" | "dark">("light");

    // 初始化主题
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        const initialTheme = savedTheme || systemTheme;
        setTheme(initialTheme);
        document.documentElement.setAttribute("data-theme", initialTheme);
    }, []);

    // 切换主题
    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
    };

    return (
        <div className="container">
            <Head>
                <title>关于 - {siteConfig.title}</title>
                <link rel="canonical" href={url} />
            </Head>
            <header className="site-header">
                <div className="site-title">
                    <Link href="/">{siteConfig.title}</Link>
                </div>
                <div className="site-header-controls">
                    <nav className="site-nav">
                        <Link href="/">首页</Link>
                        <Link href="/archives">归档</Link>
                        <Link href="/about">关于</Link>
                    </nav>
                    <button className="theme-toggle" onClick={toggleTheme} aria-label="切换主题">
                        {theme === "light" ? <FaMoon /> : <FaSun />}
                    </button>
                </div>
            </header>
            <main>
                <article className="post">
                    <hr className="divider" />

                    <h2>关于「枫知屿」</h2>

                    <p>「枫知屿」——这是我选择的名字，也是一种人生态度。</p>

                    <p>
                        <strong>枫</strong>：秋天的诗意，时间的馈赠。枫叶在四季更迭中变换色彩，正如我们在代码的世界里不断学习与成长。它代表着美丽、变化和生命的韵律。
                    </p>

                    <p>
                        <strong>知</strong>：智慧的追求，技术的本质。在二进制的海洋中，我们寻找确定性的灯塔；在算法的迷宫中，我们探索最优的路径。知识不仅仅是工具，更是理解世界的钥匙。
                    </p>

                    <p>
                        <strong>屿</strong>：独立的精神，内心的平静。在喧嚣的互联网世界里，每个人都需要一个属于自己的岛屿。这里是思考的净土，是创造力的源泉，是灵魂的栖息地。
                    </p>

                    <p>枫知屿，是诗意与技术的交汇，是理性与感性的融合，是在数字世界中寻找人文温度的尝试。</p>

                    <p>就像一座漂浮在数据海洋中的小岛，这里记录着对技术的理解，对生活的感悟，对这个世界的热爱。</p>

                    <p>
                        <em>世界我曾来过，也终究离去。但在离开之前，我想留下些什么。</em>
                    </p>
                </article>
            </main>
            <footer className="site-footer">
                <a href="/feed.xml">RSS</a>
                <a href="/sitemap.xml">Sitemap</a>
                <span>
                    © {new Date().getFullYear()} {siteConfig.author}
                </span>
            </footer>
            <BackToTop />
        </div>
    );
}
