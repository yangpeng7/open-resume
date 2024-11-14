"use client";
import { useEffect, useState, useRef } from "react";
import { ResumePDF } from "components/Resume/ResumePDF";
import { initialResumeState } from "lib/redux/resumeSlice";
import { initialSettings } from "lib/redux/settingsSlice";
import { ResumeIframeCSR } from "components/Resume/ResumeIFrame";
import { START_HOME_RESUME, END_HOME_RESUME } from "home/constants";
import { makeObjectCharIterator } from "lib/make-object-char-iterator";
import { useTailwindBreakpoints } from "lib/hooks/useTailwindBreakpoints";
import { deepClone } from "lib/deep-clone";

// 计算 END_HOME_RESUME 的字符数 -> 大约 1800 个字符
const INTERVAL_MS = 50; // 每秒 20 个间隔
const CHARS_PER_INTERVAL = 10;
// 自动打字时间：
//  10 CHARS_PER_INTERVAL -> ~1800 / (20*10) = 9s（我们选择 9s，这样感觉比较快）
//  9 CHARS_PER_INTERVAL -> ~1800 / (20*9) = 10s
//  8 CHARS_PER_INTERVAL -> ~1800 / (20*8) = 11s

const RESET_INTERVAL_MS = 60 * 1000; // 60s

export const AutoTypingResume = () => {
  const [resume, setResume] = useState(deepClone(initialResumeState));
  const resumeCharIterator = useRef(
    makeObjectCharIterator(START_HOME_RESUME, END_HOME_RESUME)
  );
  const hasSetEndResume = useRef(false);
  const { isLg } = useTailwindBreakpoints();

  useEffect(() => {
    const intervalId = setInterval(() => {
      let next = resumeCharIterator.current.next();
      for (let i = 0; i < CHARS_PER_INTERVAL - 1; i++) {
        next = resumeCharIterator.current.next();
      }
      if (!next.done) {
        setResume(next.value);
      } else {
        // 有时迭代器不会在最后一个字符结束，
        // 所以我们在这里手动设置它的结束状态
        if (!hasSetEndResume.current) {
          setResume(END_HOME_RESUME);
          hasSetEndResume.current = true;
        }
      }
    }, INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      resumeCharIterator.current = makeObjectCharIterator(
        START_HOME_RESUME,
        END_HOME_RESUME
      );
      hasSetEndResume.current = false;
    }, RESET_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <ResumeIframeCSR documentSize="Letter" scale={isLg? 0.7 : 0.5}>
        <ResumePDF
          resume={resume}
          settings={{
           ...initialSettings,
            fontSize: "12",
            formToHeading: {
              workExperiences: resume.workExperiences[0].company
               ? "WORK EXPERIENCE"
                : "",
              educations: resume.educations[0].school? "EDUCATION吗" : "",
              projects: resume.projects[0].project? "PROJECT" : "",
              skills: resume.skills.featuredSkills[0].skill? "SKILLS" : "",
              custom: "CUSTOM SECTION",
            },
          }}
        />
      </ResumeIframeCSR>
    </>
  );
};