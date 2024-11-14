import { Link } from "components/documentation";

const QAS = [
  {
    question:
      "Q1. 什么是简历生成器？为什么简历生成器比简历模板文档更好？",
    answer: (
      <>
        <p>
          如今，创建简历有两种方式。一种选择是使用简历模板，例如Office/Google文档，然后根据需要进行自定义。另一种选择是使用简历生成器，这是一种在线工具，允许您输入信息并自动为您生成简历。
        </p>
        <p>
          使用简历模板需要手动进行格式化工作，例如复制和粘贴文本部分并调整间距，这可能既耗时又容易出错。在复制和粘贴后，很容易遇到格式问题，例如使用不同的项目符号或字体样式。另一方面，像OpenResume这样的简历生成器通过自动格式化简历来节省时间并防止格式错误。它还提供了方便的功能，可以通过简单的点击轻松更改字体类型或大小。总之，与简历模板相比，简历生成器更易于使用。
        </p>
      </>
    ),
  },
  {
    question:
      "Q2. OpenResume与其他简历生成器和模板有何独特之处？",
    answer: (
      <>
        <p>
          除了OpenResume，还有一些很棒的免费简历生成器，例如<Link href="https://rxresu.me/">Reactive Resume</Link>，<Link href="https://flowcv.com/">FlowCV</Link>。然而，OpenResume以两个独特的功能脱颖而出：
        </p>{" "}
        <p>
          <span className="font-semibold">
            1. OpenResume专为美国就业市场和最佳实践而设计。
          </span>
          <br />
          与其他面向全球受众并提供许多自定义选项的简历生成器不同，OpenResume有意只提供符合美国最佳实践的选项。例如，它排除了添加个人照片的选项，以避免偏见和歧视。它只提供核心部分，例如个人资料、工作经验、教育和技能，同时省略了不必要的部分，如推荐信。此外，OpenResume只提供自上而下的单栏简历设计，而不是两栏设计，因为单栏设计最适合AST。 <br />{" "}
        </p>
        <p>
          <span className="font-semibold">
            2. OpenResume非常注重隐私。
          </span>{" "}
          <br />
          虽然其他简历生成器可能需要电子邮件注册并将用户数据存储在其数据库中，但OpenResume认为简历数据应该保持私密，并且只能在用户的本地机器上访问。因此，OpenResume不需要注册即可使用该应用程序，并且所有输入的数据都存储在用户的浏览器中，只有用户可以访问。
        </p>
      </>
    ),
  },
  {
    question: "Q3. 谁创建了OpenResume，为什么？",
    answer: (
      <p>
        OpenResume是由<Link href="https://github.com/xitanggg">Xitang Zhao</Link>创建，并由<Link href="https://www.linkedin.com/in/imzhi">Zhigang Wen</Link>设计的一个周末项目。作为移民到美国的人，我们在创建第一份简历和申请实习及工作时犯了很多错误。我们花了很长时间才学会了一些最佳实践。在指导第一代学生并审查他们的简历时，我们注意到学生们正在犯我们以前犯过的同样错误。这促使我们思考如何利用我们所获得的知识和技能来提供帮助。我们开始在周末聊天和工作，最终促成了OpenResume的诞生，我们将最佳实践和知识融入到这个简历生成器中。我们希望OpenResume能够帮助任何人轻松创建遵循最佳实践的现代专业简历，让任何人都能自信地申请工作。
      </p>
    ),
  },
  {
    question: "Q4. 我如何支持OpenResume？",
    answer: (
      <>
        <p>
          支持OpenResume的最佳方式是与我们分享您的想法和反馈，以帮助进一步改进它。您可以通过发送电子邮件至<Link href="mailto:hello@open-resume.com">hello@open-resume.com</Link>或在我们的Github仓库中<Link href="https://github.com/xitanggg/open-resume/issues/new">打开一个问题</Link>与我们联系。无论您喜欢与否，我们都很乐意听到您的声音。
        </p>
        <p>
          另一个支持OpenResume的好方法是传播这个消息。与您的朋友、在社交媒体平台上或与您学校的职业中心分享它。我们的目标是接触到更多在创建简历方面遇到困难的人，您的口碑支持将非常感激。如果您使用Github，您还可以通过<Link href="https://github.com/xitanggg/open-resume">给项目一个星星</Link>来表示您的支持，以帮助提高其知名度和影响力。
        </p>
      </>
    ),
  },
];

export const QuestionsAndAnswers = () => {
  return (
    <section className="mx-auto max-w-3xl divide-y divide-gray-300 lg:mt-4 lg:px-2">
      <h2 className="text-center text-3xl font-bold">问题与解答</h2>
      <div className="mt-6 divide-y divide-gray-300">
        {QAS.map(({ question, answer }) => (
          <div key={question} className="py-6">
            <h3 className="font-semibold leading-7">{question}</h3>
            <div className="mt-3 grid gap-2 leading-7 text-gray-600">
              {answer}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};