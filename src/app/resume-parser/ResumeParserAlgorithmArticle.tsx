import { isBold } from "lib/parse-resume-from-pdf/extract-resume-from-sections/lib/common-features";
import {
  Badge,
  Heading,
  Link,
  Paragraph,
  Table,
} from "components/documentation";
import type {
  Line,
  Lines,
  ResumeSectionToLines,
  TextItem,
  TextItems,
  TextScores,
} from "lib/parse-resume-from-pdf/types";
import { extractProfile } from "lib/parse-resume-from-pdf/extract-resume-from-sections/extract-profile";

export const ResumeParserAlgorithmArticle = ({
  textItems,
  lines,
  sections,
}: {
  textItems: TextItems;
  lines: Lines;
  sections: ResumeSectionToLines;
}) => {
  const getBadgeContent = (item: TextItem) => {
    const X1 = Math.round(item.x);
    const X2 = Math.round(item.x + item.width);
    const Y = Math.round(item.y);
    let content = `X₁=${X1} X₂=${X2} Y=${Y}`;
    if (X1 === X2) {
      content = `X=${X2} Y=${Y}`;
    }
    if (isBold(item)) {
      content = `${content} Bold`;
    }
    if (item.hasEOL) {
      content = `${content} NewLine`;
    }
    return content;
  };
  const step1TextItemsTable = [
    ["#", "Text Content", "Metadata"],
    ...textItems.map((item, idx) => [
      idx + 1,
      item.text,
      <Badge key={idx}>{getBadgeContent(item)}</Badge>,
    ]),
  ];

  const step2LinesTable = [
    ["Lines", "Line Content"],
    ...lines.map((line, idx) => [
      idx + 1,
      line.map((item, idx) => (
        <span key={idx}>
          {item.text}
          {idx !== line.length - 1 && (
            <span className="select-none font-extrabold text-sky-400">
              &nbsp;&nbsp;{"|"}&nbsp;&nbsp;
            </span>
          )}
        </span>
      )),
    ]),
  ];

  const { profile, profileScores } = extractProfile(sections);
  const Scores = ({ scores }: { scores: TextScores }) => {
    return (
      <>
        {scores
          .sort((a, b) => b.score - a.score)
          .map((item, idx) => (
            <span key={idx} className="break-all">
              <Badge>{item.score}</Badge> {item.text}
              <br />
            </span>
          ))}
      </>
    );
  };
  const step4ProfileFeatureScoresTable = [
    [
      "Resume Attribute",
      "Text (Highest Feature Score)",
      "Feature Scores of Other Texts",
    ],
    ["Name", profile.name, <Scores key={"Name"} scores={profileScores.name} />],
    [
      "Email",
      profile.email,
      <Scores key={"Email"} scores={profileScores.email} />,
    ],
    [
      "Phone",
      profile.phone,
      <Scores key={"Phone"} scores={profileScores.phone} />,
    ],
  ];

  return (
    <article className="mt-10">
      <Heading className="text-primary!mt-0 border-t-2 pt-8">
        简历解析算法深度解析
      </Heading>
      <Paragraph smallMarginTop={true}>
        对于技术好奇者，本节将深入探讨 OpenResume 解析算法，并逐步介绍其工作原理的 4 个步骤。（请注意，该算法旨在解析英文单栏简历）
      </Paragraph>
      {/* 步骤 1. 从 PDF 文件读取文本项 */}
      <Heading level={2}>步骤 1. 从 PDF 文件读取文本项</Heading>
      <Paragraph smallMarginTop={true}>
        PDF 文件是由 <Link href="https://www.iso.org/standard/51502.html">ISO 32000 规范</Link> 定义的标准化文件格式。当你使用文本编辑器打开 PDF 文件时，你会注意到原始内容看起来是编码的，难以阅读。要以可读的格式显示它，你需要一个 PDF 阅读器来解码并查看文件。同样，简历解析器首先需要解码 PDF 文件，以便提取其文本内容。
      </Paragraph>
      <Paragraph>
        虽然可以根据 ISO 32000 规范编写自定义 PDF 读取器函数，但利用现有的库会简单得多。在这种情况下，简历解析器使用 Mozilla 的开源 <Link href="https://github.com/mozilla/pdf.js">pdf.js</Link> 库首先提取文件中的所有文本项。
      </Paragraph>
      <Paragraph>
        下表列出了从添加的简历 PDF 中提取的 {textItems.length} 个文本项。文本项包含文本内容以及一些关于内容的元数据，例如它在文档中的 x、y 位置，字体是否加粗，或者它是否开始新的一行。（请注意，x、y 位置是相对于页面左下角的原点 0,0）
      </Paragraph>
      <div className="mt-4 max-h-72 overflow-y-scroll border scrollbar scrollbar-track-gray-100 scrollbar-thumb-gray-200 scrollbar-w-3">
        <Table
          table={step1TextItemsTable}
          className="!border-none"
          tdClassNames={["", "", "md:whitespace-nowrap"]}
        />
      </div>
      {/* 步骤 2. 将文本项分组为行 */}
      <Heading level={2}>步骤 2. 将文本项分组为行</Heading>
      <Paragraph smallMarginTop={true}>
        提取的文本项还不能直接使用，存在两个主要问题：
      </Paragraph>
      <Paragraph>
        <span className="mt-3 block font-semibold">
          问题 1：它们包含一些不需要的噪声。
        </span>
        一些单个文本项可能会被分成多个，如你在上面的表格中可能观察到的，例如电话号码 "(123) 456-7890" 可能会被分成 3 个文本项 "(123) 456"、"-" 和 "7890"。
      </Paragraph>
      <Paragraph smallMarginTop={true}>
        <span className="font-semibold">解决方案：</span> 为了解决这个问题，简历解析器会将相邻的文本项连接成一个文本项，如果它们之间的距离小于平均典型字符宽度，其中
        <span
          dangerouslySetInnerHTML={{
            __html: `<math display="block">
                        <mrow>
                            <mn>距离 </mn>
                            <mo>=</mo>
                            <mn>右文本项X₁</mn>
                            <mo>-</mo>
                            <mn>左文本项X₂</mn>
                        </mrow>
                    </math>`,
          }}
          className="my-2 block text-left text-base"
        />
        平均典型字符宽度是通过将所有文本项的宽度总和除以文本项的总字符数来计算的（粗体文本和新行元素被排除在外，以避免结果失真）。
      </Paragraph>
      <Paragraph>
        <span className="mt-3 block font-semibold">
          问题 2：它们缺乏上下文和关联。
        </span>
        当我们阅读简历时，我们逐行扫描简历。我们的大脑可以通过视觉线索（如文本的粗体和接近度）来处理每个部分，我们可以快速地将更接近的文本关联起来，形成一个相关的组。然而，提取的文本项目前没有这些上下文/关联，只是不相关的元素。
      </Paragraph>
      <Paragraph smallMarginTop={true}>
        <span className="font-semibold">解决方案：</span> 为了解决这个问题，简历解析器重建了这些上下文和关联，类似于我们的大脑如何阅读和处理简历。它首先将文本项分组为行，因为我们逐行阅读文本。然后，它将行分组为部分，这将在下一个步骤中讨论。
      </Paragraph>
      <Paragraph>
        在步骤 2 结束时，简历解析器从添加的简历 PDF 中提取了 {lines.length} 行，如下表所示。当以行的形式显示时，结果更加易读。（有些行可能有多个文本项，它们之间用蓝色垂直分隔符 <span className="select-none font-extrabold text-sky-400"> &nbsp;{"|"}&nbsp; </span> 分隔）
      </Paragraph>
      <div className="mt-4 max-h-96 overflow-y-scroll border scrollbar scrollbar-track-gray-100 scrollbar-thumb-gray-200 scrollbar-w-3">
        <Table table={step2LinesTable} className="!border-none" />
      </div>
      {/* 步骤 3. 将行分组为部分 */}
      <Heading level={2}>步骤 3. 将行分组为部分</Heading>
      <Paragraph smallMarginTop={true}>
        在步骤 2 中，简历解析器通过将文本项分组为行来开始构建上下文和关联。步骤 3 继续这个过程，通过将行分组为部分来构建额外的关联。
      </Paragraph>
      <Paragraph>
        请注意，每个部分（除了个人资料部分）都以占据整行的部分标题开始。这不仅在简历中，而且在书籍和博客中都是一种常见的模式。简历解析器使用这种模式将行分组到这些行上方最接近的部分标题。
      </Paragraph>
      <Paragraph>
        简历解析器应用一些启发式方法来检测部分标题。确定部分标题的主要启发式方法是检查它是否满足以下所有 3 个条件：<br />
        1. 它是行中唯一的文本项<br />
        2. 它是 <span className="font-bold">加粗的</span><br />
        3. 它的字母都是大写的<br />
      </Paragraph>
      <Paragraph>
        简单来说，如果一个文本项被双重强调为既加粗又大写，那么它很可能是简历中的部分标题。对于格式良好的简历来说，这通常是正确的。可能会有例外，但在这些情况下，使用加粗和大写可能不是一个好的用法。
      </Paragraph>
      <Paragraph>
        简历解析器还有一个备用启发式方法，如果主要启发式方法不适用。备用启发式方法主要是对一组常见的简历部分标题关键词进行关键词匹配。
      </Paragraph>
      <Paragraph>
        在步骤 3 结束时，简历解析器从简历中识别出部分，并将这些行与相关的部分标题分组，如下表所示。请注意，<span className="font-bold">部分标题是加粗的</span>，并且 <span className="bg-teal-50">与部分相关的行用相同的颜色突出显示</span>。
      </Paragraph>
      <Step3SectionsTable sections={sections} />
      {/* 步骤 4. 从部分中提取简历 */}
      <Heading level={2}>步骤 4. 从部分中提取简历</Heading>
      <Paragraph smallMarginTop={true}>
        步骤 4 是简历解析过程的最后一步，也是简历解析器的核心，它从部分中提取简历信息。
      </Paragraph>
      <Heading level={3}>特征评分系统</Heading>
      <Paragraph smallMarginTop={true}>
        提取引擎的核心是一个特征评分系统。每个待提取的简历属性都有一个自定义的特征集，每个特征集由一个特征匹配函数和一个匹配得分组成（特征匹配得分可以是正数或负数）。为了计算一个文本项对于特定简历属性的最终特征得分，它会运行该文本项通过其所有的特征集，并将匹配的特征得分相加。这个过程在该部分的所有文本项上进行，得分最高的文本项被确定为提取的简历属性。
      </Paragraph>
      <Paragraph>
        作为演示，下表显示了添加的简历 PDF 中的个人资料部分的 3 个简历属性。
      </Paragraph>
      <Table table={step4ProfileFeatureScoresTable} className="mt-4" />
      {(profileScores.name.find((item) => item.text === profile.name)?.score ||
        0) > 0 && (
        <Paragraph smallMarginTop={true}>
          在添加的简历 PDF 中，简历属性名称很可能是 "
          {profile.name}"，因为它的特征得分是{" "}
          {profileScores.name.find((item) => item.text === profile.name)?.score}
          ，这是个人资料部分所有文本项中的最高特征得分。（一些文本项的特征得分可能为负，表明它们不太可能是目标属性）
        </Paragraph>
      )}
      <Heading level={3}>特征集</Heading>
      <Paragraph smallMarginTop={true}>
        在解释了特征评分系统之后，我们可以更深入地了解如何为简历属性构建特征集。它遵循 2 个原则：<br />
        1. 简历属性的特征集是相对于同一部分中的所有其他简历属性设计的。<br />
        2. 简历属性的特征集是根据其特征和每个特征的可能性手动制作的。
      </Paragraph>
      <Paragraph>
        下表列出了简历属性名称的一些特征集。它包含与名称属性匹配的正特征得分的特征函数，以及仅与该部分中的其他简历属性匹配的负特征得分的特征函数。
      </Paragraph>
      <Table
        table={step4NameFeatureSetsTable}
        title="名称特征集"
        className="mt-4"
      />
      <Heading level={3}>核心特征函数</Heading>
      <Paragraph smallMarginTop={true}>
        每个简历属性都有多个特征集。它们可以在源代码中的 extract-resume-from-sections 文件夹下找到，我们不会在这里全部列出。每个简历属性通常都有一个核心特征函数，可以极大地识别它们，因此我们将在下面列出核心特征函数。
      </Paragraph>
      <Table table={step4CoreFeatureFunctionTable} className="mt-4" />
      <Heading level={3}>特殊情况：子部分</Heading>
      <Paragraph smallMarginTop={true}>
        最后值得一提的是子部分。对于个人资料部分，我们可以直接将所有文本项传递给特征评分系统。但是对于其他部分，如教育和工作经验，我们必须首先将该部分划分为子部分，因为该部分可能包含多个学校或工作经验。然后，特征评分系统处理每个子部分，以检索每个子部分的简历属性并附加结果。
      </Paragraph>
      <Paragraph smallMarginTop={true}>
        简历解析器应用一些启发式方法来检测子部分。确定子部分的主要启发式方法是检查 2 行之间的垂直行间距是否大于典型行间距 * 1.4，因为格式良好的简历通常会在添加下一个子部分之前创建一个新的空行。如果主要启发式方法不适用，还有一个备用启发式方法来检查文本项是否加粗。
      </Paragraph>
      <Paragraph>
        这就是关于 OpenResume 解析器算法的全部内容：）
      </Paragraph>
      <Paragraph>
        由 <Link href="https://github.com/xitanggg">Xitang</Link> 于 2023 年 6 月撰写
      </Paragraph>
    </article>
  );
};

const step4NameFeatureSetsTable = [
  ["Feature Function", "Feature Matching Score"],
  ["Contains only letters, spaces or periods", "+3"],
  ["Is bolded", "+2"],
  ["Contains all uppercase letters", "+2"],
  ["Contains @", "-4 (match email)"],
  ["Contains number", "-4 (match phone)"],
  ["Contains ,", "-4 (match address)"],
  ["Contains /", "-4 (match url)"],
];

const step4CoreFeatureFunctionTable = [
  ["Resume Attribute", "Core Feature Function", "Regex"],
  ["Name", "Contains only letters, spaces or periods", "/^[a-zA-Z\\s\\.]+$/"],
  [
    "Email",
    <>
      Match email format xxx@xxx.xxx
      <br />
      xxx can be anything not space
    </>,
    "/\\S+@\\S+\\.\\S+/",
  ],
  [
    "Phone",
    <>
      Match phone format (xxx)-xxx-xxxx <br /> () and - are optional
    </>,
    "/\\(?\\d{3}\\)?[\\s-]?\\d{3}[\\s-]?\\d{4}/",
  ],
  [
    "Location",
    <>Match city and state format {"City, ST"}</>,
    "/[A-Z][a-zA-Z\\s]+, [A-Z]{2}/",
  ],
  ["Url", "Match url format xxx.xxx/xxx", "/\\S+\\.[a-z]+\\/\\S+/"],
  ["School", "Contains a school keyword, e.g. College, University, School", ""],
  ["Degree", "Contains a degree keyword, e.g. Associate, Bachelor, Master", ""],
  ["GPA", "Match GPA format x.xx", "/[0-4]\\.\\d{1,2}/"],
  [
    "Date",
    "Contains date keyword related to year, month, seasons or the word Present",
    "Year: /(?:19|20)\\d{2}/",
  ],
  [
    "Job Title",
    "Contains a job title keyword, e.g. Analyst, Engineer, Intern",
    "",
  ],
  ["Company", "Is bolded or doesn't match job title & date", ""],
  ["Project", "Is bolded or doesn't match date", ""],
];

const Step3SectionsTable = ({
  sections,
}: {
  sections: ResumeSectionToLines;
}) => {
  const table: React.ReactNode[][] = [["Lines", "Line Content"]];
  const trClassNames = [];
  let lineCounter = 0;
  const BACKGROUND_COLORS = [
    "bg-red-50",
    "bg-yellow-50",
    "bg-orange-50",
    "bg-green-50",
    "bg-blue-50",
    "bg-purple-50",
  ] as const;
  const sectionsEntries = Object.entries(sections);

  const Line = ({ line }: { line: Line }) => {
    return (
      <>
        {line.map((item, idx) => (
          <span key={idx}>
            {item.text}
            {idx !== line.length - 1 && (
              <span className="select-none font-extrabold text-sky-400">
                &nbsp;&nbsp;{"|"}&nbsp;&nbsp;
              </span>
            )}
          </span>
        ))}
      </>
    );
  };

  for (let i = 0; i < sectionsEntries.length; i++) {
    const sectionBackgroundColor = BACKGROUND_COLORS[i % 6];
    const [sectionTitle, lines] = sectionsEntries[i];
    table.push([
      sectionTitle === "profile" ? "" : lineCounter,
      sectionTitle === "profile" ? "PROFILE" : sectionTitle,
    ]);
    trClassNames.push(`${sectionBackgroundColor} font-bold`);
    lineCounter += 1;
    for (let j = 0; j < lines.length; j++) {
      table.push([lineCounter, <Line key={lineCounter} line={lines[j]} />]);
      trClassNames.push(sectionBackgroundColor);
      lineCounter += 1;
    }
  }

  return (
    <div className="mt-4 max-h-96 overflow-y-scroll border scrollbar scrollbar-track-gray-100 scrollbar-thumb-gray-200 scrollbar-w-3">
      <Table
        table={table}
        className="!border-none"
        trClassNames={trClassNames}
      />
    </div>
  );
};
