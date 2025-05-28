import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("./components/layouts/root-layout.tsx", [
    index("routes/home.tsx"),

    route("groups", "./routes/groups.tsx"),
    route("groups/:id", "./routes/full-group.tsx"),

    route("auditories", "./routes/auditories.tsx"),
    route("auditories/:id", "./routes/full-auditory.tsx"),

    route("teachers", "./routes/teachers.tsx"),
    route("teachers/:id", "./routes/full-teacher.tsx"),

    route("students", "./routes/students-accounts.tsx"),
    route("students-divide", "./routes/students-divide.tsx"),

    route("plans", "./routes/plans.tsx"),
    route("plans/:id", "./routes/full-plan.tsx"),

    route("distribution", "./routes/distribution.tsx"),

    route("streams", "./routes/streams.tsx"),

    route("timetable", "./routes/timetable.tsx"),

    route("grade-book", "./routes/grade-book.tsx"),

    route("profile", "./routes/profile.tsx"),
  ]),

  route("auth", "./routes/auth.tsx"),
] satisfies RouteConfig;
