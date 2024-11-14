import Image from "next/image";
import featureFreeSrc from "public/assets/feature-free.svg";
import featureUSSrc from "public/assets/feature-us.svg";
import featurePrivacySrc from "public/assets/feature-privacy.svg";
import featureOpenSourceSrc from "public/assets/feature-open-source.svg";
import { Link } from "components/documentation";

const FEATURES = [
  {
    src: featureFreeSrc,
    title: "永久免费",
    text: "OpenResume 的创建理念是每个人都应该免费且轻松地获得现代专业简历设计",
  },
  {
    src: featureUSSrc,
    title: "美国最佳实践",
    text: "OpenResume 内置了美国就业市场的最佳实践，并与 Greenhouse 和 Lever 等顶级 ATS 平台兼容",
  },
  {
    src: featurePrivacySrc,
    title: "隐私关注",
    text: "OpenResume 将数据本地存储在您的浏览器中，因此只有您可以访问您的数据并完全控制",
  },
  {
    src: featureOpenSourceSrc,
    title: "开源",
    text: (
      <>
        OpenResume 是一个开源项目，其源代码可以在其{" "}
        <Link href="https://github.com/xitanggg/open-resume">
          GitHub 仓库
        </Link>
        上被任何人查看
      </>
    ),
  },
];

export const Features = () => {
  return (
    <section className="py-16 lg:py-36">
      <div className="mx-auto lg:max-w-4xl">
        <dl className="grid grid-cols-1 justify-items-center gap-y-8 lg:grid-cols-2 lg:gap-x-6 lg:gap-y-16">
          {FEATURES.map(({ src, title, text }) => (
            <div className="px-2" key={title}>
              <div className="relative w-96 self-center pl-16">
                <dt className="text-2xl font-bold">
                  <Image
                    src={src}
                    className="absolute left-0 top-1 h-12 w-12"
                    alt="Feature icon"
                  />
                  {title}
                </dt>
                <dd className="mt-2">{text}</dd>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};
