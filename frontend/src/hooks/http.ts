import { ProjectDescription } from '@app/models';

const API = 'http://90.3.31.132:8081';

export const uploadProjectDescription = async (
  data: ProjectDescription,
): Promise<string> => {
  const res = await fetch(`${API}/upload`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { ContentType: 'application/json' },
  });
  const json = await res.json();
  return json['path'];
};

export const downloadProjectDescription = async (
  cid: string,
): Promise<ProjectDescription> => {
  const res = await fetch(`${API}/download/${cid}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });
  const json = await res.json();
  return {
    title: json['title'] || '',
    description: json['description'] || '',
    due: new Date(json['due']),
  };
};
