import type { Route } from './+types/teachers'

import TeachersPage from '~/pages/teachers-page'

export function meta({}: Route.MetaArgs) {
  return [{ title: 'ЖБФФК | Викладацький склад' }, { name: 'description', content: 'Welcome to React Router!' }]
}

export default function Teachers() {
  return <TeachersPage />
}

/* 
export async function loader({ params }: Route.LoaderArgs) {
  let team = await fetchTeam(params.teamId);
  return { name: team.name };
}

export default function Teachers({
  loaderData,
}: Route.ComponentProps) {
  return <h1>{loaderData.name}</h1>;
} */
