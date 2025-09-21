import { createBrowserRouter } from "react-router"

import Home from "./routes/home"
import Auth from "./routes/auth"
import Plans from "./routes/plans"
import Groups from "./routes/groups"
import Streams from "./routes/streams"
import Profile from "./routes/profile"
import Settings from "./routes/settings"
import Teachers from "./routes/teachers"
import FullPlan from "./routes/full-plan"
import Timetable from "./routes/timetable"
import GradeBook from "./routes/grade-book"
import FullGroup from "./routes/full-group"
import Auditories from "./routes/auditories"
import FullTeacher from "./routes/full-teacher"
import FullStudent from "./routes/full-student"
import Distribution from "./routes/distribution"
import FullAuditory from "./routes/full-auditory"
import TeachersReport from "./routes/teachers-report"
import StudentsDivide from "./routes/students-divide"
import MyTeachingLoad from "./routes/my-teaching-load"
import StudentsAccounts from "./routes/students-accounts"
import RootLayout from "./components/layouts/root-layout"
import ViewDistributionLoad from "./routes/view-distribution-load"
import IndividualTeacherWork from "./routes/individual-teacher-work"
import InstructionalMaterials from "./routes/instructional-materials"
import TeacherActivitiesTypes from "./routes/teacher-activities-types"
import { streamsAPI } from "./api/streams-api"

export const router = createBrowserRouter([
  {
    path: "/*",
    Component: RootLayout,
    children: [
      { index: true, element: <Home /> },

      { path: "groups", element: <Groups /> },
      { path: "groups/:id", element: <FullGroup /> },

      { path: "auditories", element: <Auditories /> },
      { path: "auditories/:id", element: <FullAuditory /> },

      { path: "teachers", element: <Teachers /> },
      { path: "teachers/:id", element: <FullTeacher /> },

      { path: "students", element: <StudentsAccounts /> },
      { path: "students/:id", element: <FullStudent /> },

      { path: "students-divide", element: <StudentsDivide /> },

      { path: "plans", element: <Plans /> },
      { path: "plans/:id", element: <FullPlan /> },

      { path: "distribution", element: <Distribution /> },
      { path: "view-distribution-load", element: <ViewDistributionLoad /> },

      { path: "streams", element: <Streams /> },

      { path: "timetable", element: <Timetable /> },

      { path: "grade-book", element: <GradeBook /> },

      { path: "instructional-materials", element: <InstructionalMaterials /> },
      { path: "individual-teacher-work", element: <IndividualTeacherWork /> },
      { path: "teacher-activities-types", element: <TeacherActivitiesTypes /> },
      { path: "teachers-report", element: <TeachersReport /> },
      { path: "my-teaching-load", element: <MyTeachingLoad /> },

      { path: "profile", element: <Profile /> },

      { path: "settings", element: <Settings /> },

      { path: "auth", element: <Auth /> },
    ],
  },
])
