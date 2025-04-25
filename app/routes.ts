import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("./components/layouts/root-layout.tsx", [
    index("routes/home.tsx"),

    route("teachers", "./routes/teachers.tsx"),

    // route("groups", "./routes/groups.tsx"),
    route("groups/:id", "./routes/full-group.tsx"),

    // route("auditories", "./routes/auditories.tsx"),

    route("plans", "./routes/plans.tsx"),
    route("plans/:id", "./routes/full-plan.tsx"),

    route("distribution", "./routes/distribution.tsx"),

    route("timetable", "./routes/timetable.tsx"),

    route("grade-book", "./routes/grade-book.tsx"),
  ]),
] satisfies RouteConfig;
