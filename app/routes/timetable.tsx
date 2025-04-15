import type { Route } from './+types/timetable'
import TimetablePage from '~/pages/timetable/timetable-page'

export function meta({}: Route.MetaArgs) {
  return [{ title: 'ЖБФФК | Редактор розкладу' }, { name: 'description', content: 'Welcome to React Router!' }]
}

export default function Timetable() {
  return <TimetablePage />
}
