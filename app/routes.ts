import { type RouteConfig, index, layout, route } from '@react-router/dev/routes'

export default [
  layout('./components/layouts/root-layout.tsx', [
    index('routes/home.tsx'),
    route('teachers', './routes/teachers.tsx'),
    route('plans', './routes/plans.tsx'),
    route('timetable', './routes/timetable.tsx'),
  ]),
] satisfies RouteConfig
