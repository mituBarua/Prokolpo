import data from './projects.json';

export type Category = 'residential' | 'shop' | 'institutional' | '3d';
export type ProjectImage = { src: string; w: number; h: number };
export type Project = {
  id: string;
  title: string;
  cat: Category[];
  client: string;
  location: string;
  size: string;
  work: string;
  desc: string;
  wide?: boolean;
  images: ProjectImage[];
};

export const projects = data as Project[];
export const byId: Record<string, Project> = Object.fromEntries(projects.map((p) => [p.id, p]));

export const catName: Record<Category, string> = {
  residential: 'Residential',
  shop: 'Shop & Office',
  institutional: 'Institution',
  '3d': '3D Design',
};

export const FEATURED = ['japandi', 'family2200', 'shahanshah', 'shipon', 'bluemoon', 'cuet'];

export const isPrivate = (p: Project) => /^Private residences?$/.test(p.client);

export function neighbours(id: string) {
  const i = projects.findIndex((p) => p.id === id);
  return {
    prev: projects[(i - 1 + projects.length) % projects.length],
    next: projects[(i + 1) % projects.length],
  };
}
