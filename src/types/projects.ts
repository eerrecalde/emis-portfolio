export type ProjectProfile = {
  slug: string;
  featured: boolean;
  curation?: {
    documentation: 'pending' | 'ready';
    screenshots: 'pending' | 'ready';
    branch?: string;
  };
  repository: {
    name: string;
    fullName: string;
    url: string;
    description: string | null;
    homepage: string | null;
    stars: number;
    forks: number;
    openIssues: number;
    defaultBranch: string;
    createdAt: string;
    updatedAt: string;
  };
  languages: Array<{ name: string; bytes: number }>;
  readme: string;
  images: string[];
  latestRelease: {
    name: string | null;
    tagName: string;
    url: string;
    publishedAt: string | null;
  } | null;
};

export type GeneratedProjects = { projects: ProjectProfile[] };
