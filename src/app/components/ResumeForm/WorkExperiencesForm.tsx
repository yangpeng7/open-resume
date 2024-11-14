import { Form, FormSection } from "components/ResumeForm/Form";
import {
  Input,
  BulletListTextarea,
} from "components/ResumeForm/Form/InputGroup";
import type { CreateHandleChangeArgsWithDescriptions } from "components/ResumeForm/types";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import {
  changeWorkExperiences,
  selectWorkExperiences,
} from "lib/redux/resumeSlice";
import type { ResumeWorkExperience } from "lib/redux/types";

export const WorkExperiencesForm = () => {
  const workExperiences = useAppSelector(selectWorkExperiences);
  const dispatch = useAppDispatch();

  const showDelete = workExperiences.length > 1;

  return (
    <Form form="workExperiences" addButtonText="添加工作">
      {workExperiences.map(({ company, jobTitle, date, descriptions }, idx) => {
        const handleWorkExperienceChange = (
         ...[
            field,
            value,
          ]: CreateHandleChangeArgsWithDescriptions<ResumeWorkExperience>
        ) => {
          // TS 不支持将联合类型传递给单个调用签名
          // https://github.com/microsoft/TypeScript/issues/54027
          // 这里使用 any 作为变通方法
          dispatch(changeWorkExperiences({ idx, field, value } as any));
        };
        const showMoveUp = idx!== 0;
        const showMoveDown = idx!== workExperiences.length - 1;

        return (
          <FormSection
            key={idx}
            form="workExperiences"
            idx={idx}
            showMoveUp={showMoveUp}
            showMoveDown={showMoveDown}
            showDelete={showDelete}
            deleteButtonTooltipText="删除工作"
          >
            <Input
              label="公司"
              labelClassName="col-span-full"
              name="company"
              placeholder="可汗学院"
              value={company}
              onChange={handleWorkExperienceChange}
            />
            <Input
              label="职位"
              labelClassName="col-span-4"
              name="jobTitle"
              placeholder="软件工程师"
              value={jobTitle}
              onChange={handleWorkExperienceChange}
            />
            <Input
              label="日期"
              labelClassName="col-span-2"
              name="date"
              placeholder="2022 年 6 月 - 至今"
              value={date}
              onChange={handleWorkExperienceChange}
            />
            <BulletListTextarea
              label="描述"
              labelClassName="col-span-full"
              name="descriptions"
              placeholder="要点"
              value={descriptions}
              onChange={handleWorkExperienceChange}
            />
          </FormSection>
        );
      })}
    </Form>
  );
};
