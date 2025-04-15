import type { Route } from './+types/home'
import PlansPage from '~/pages/plans/plans-page'

export function meta({}: Route.MetaArgs) {
  return [{ title: 'ЖБФФК | Навчальні плани' }, { name: 'description', content: 'Welcome to React Router!' }]
}

export default function Plans() {
  return <PlansPage />
}
