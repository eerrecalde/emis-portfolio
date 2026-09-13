import { Route, Routes } from 'react-router';
import { ExperiencePage } from './experience/ExperiencePage';
import { HomePage } from './home/HomePage';
import { NotFoundPage } from './not-found/NotFoundPage';
import { ProjectPage } from './project/ProjectPage';
import { SkillsPage } from './skills/SkillsPage';
import type {
  PortfolioProject,
  PortfolioSkill,
  ProfessionalExperience,
} from '../types/portfolio';

type PortfolioRoutesProps = {
  projects: PortfolioProject[];
  experience: ProfessionalExperience[];
  skills: PortfolioSkill[];
};

export function PortfolioRoutes({
  projects,
  experience,
  skills,
}: PortfolioRoutesProps) {
  const skillsById = new Map(skills.map((skill) => [skill.id, skill]));

  return (
    <Routes>
      <Route
        element={<HomePage projects={projects} skillsById={skillsById} />}
        path="/"
      />
      <Route
        element={<ExperiencePage experience={experience} />}
        path="/experience"
      />
      <Route element={<SkillsPage skills={skills} />} path="/skills" />
      <Route
        element={<ProjectPage projects={projects} skillsById={skillsById} />}
        path="/projects/:slug"
      />
      <Route element={<NotFoundPage />} path="*" />
    </Routes>
  );
}
