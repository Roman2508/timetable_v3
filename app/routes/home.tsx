import HomePage from '~/pages/home-page'
import type { Route } from './+types/home'

export function meta({}: Route.MetaArgs) {
  return [{ title: 'ЖБФФК | Головна' }, { name: 'description', content: 'Welcome to React Router!' }]
}

export default function Home() {
  return <HomePage />
}
