import { Route, Routes } from "react-router-dom";
//import PrivateRoutes from './utils/PrivateRoutes';

import PrivateRoutes from "./utils/PrivateRoutes";

import Login from "./pages/Login.jsx";
import ResetPassword from "./components/ResetPassword.jsx";
import ChangePassword from "./components/ChangePassword.jsx";

import Layoutm from "./components/Layout/Layout.jsx";
import Calen from "./components/Calendar.jsx";
import GetReserve from "./components/Reserve_Check.jsx";
import GetEntryPDF from "./components/Entry_PDF.jsx";

import Layout from "./student/components/Layout.jsx";
import DashUser from "./student/pages/Dashboard.jsx";
import Profile from "./student/pages/Profile.jsx";
import Calendar from "./student/pages/Calendar.jsx";

import DetailActivity from "./student/components/DetailActivity.jsx";

import LayoutT from "./teacher/components/Layout.jsx";
import CalendarT from "./teacher/pages/Calendar.jsx";
import ListStudent from "./teacher/pages/ListStudent.jsx";
import ProfileT from "./teacher/pages/Profile.jsx";
import ActivityT from "./teacher/pages/Activity.jsx";
import DetailS from "./teacher/components/DetailStudent.jsx";
import DetailActivityT from "./teacher/components/DetailActivity.jsx";

import Dashboard from "./admin/pages/Dashboard.jsx";
import LayoutA from "./admin/components/Layout.jsx";
import ListUsers from "./admin/components/ListUsers.jsx";
import CalendarA from "./admin/pages/Calendar.jsx";
import Activity from "./admin/pages/Activity.jsx";
import Wallet from "./admin/pages/Wallet.jsx";
import AddUsers from "./admin/components/Add_users.jsx";
import UpdateUser from "./admin/components/Update_user.jsx";
import UpdateStudent from "./admin/components/UpdateStudent.jsx";
import UpdateStaff from "./admin/components/UpdateStaff.jsx";
import DetailActivityA from "./admin/components/Activity/OneActivity.jsx";
import DetailStudent from "./admin/components/DetailStudent.jsx";
// import DetailStaff from "./admin/components/DetailStaff.jsx";
import Table from "./admin/components/Upload/Table.jsx";
import Test from "./admin/components/Test.jsx";

import ManageActivity from "./admin/components/Manage_activity.jsx";

// import Login from './pages/Login.jsx';

export function Router() {
  return (
    <Routes>
      <Route element={<Layoutm />}>
        <Route path="/" element={<Calen />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="reserve/:act_ID" element={<GetReserve />} />
      <Route path="entry/:act_ID" element={<GetEntryPDF />} />
      <Route path="test" element={<Test />} />

      <Route element={<PrivateRoutes />}>
        <Route path="/admin" element={<LayoutA />}>
          <Route path="test" element={<Table />}></Route>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="dashboard/user/:id" element={<DetailStudent />} />
          <Route path="calendar" element={<CalendarA />} />
          <Route path="listusers" element={<ListUsers />} />
          <Route path="activity" element={<Activity />} />
          <Route path="activity/edit/:act_ID" element={<ManageActivity />} />
          <Route path="activity/detail/:act_ID" element={<DetailActivityA />} />
          <Route path="addusers" element={<AddUsers />} />
          <Route path="update" element={<UpdateUser />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="dashboard/user/update/:id" element={<UpdateStudent />} />
          <Route path="change-password/:id" element={<ChangePassword />} />
          <Route
            path="dashboard/detail/teacher/update/:staff_ID"
            element={<UpdateStaff />}
          />
        </Route>

        <Route path="/activity" element={<Layout />}>
          <Route path="list-activity" element={<DashUser />} />
          <Route path="profile" element={<Profile />} />

          <Route path="calendar" element={<Calendar />} />
          <Route path="detail2/:act_ID" element={<DetailActivity />} />
          <Route path="change-password/:id" element={<ChangePassword />} />
        </Route>

        <Route path="/teacher" element={<LayoutT />}>
          <Route path="calendar" element={<CalendarT />} />
          <Route path="liststudent" element={<ListStudent />} />
          <Route path="profile" element={<ProfileT />} />
          <Route path="activity" element={<ActivityT />} />
          <Route path="activity/detail/:act_ID" element={<DetailActivityT />} />
          <Route path="change-password/:id" element={<ChangePassword />} />

          <Route
            path="/teacher/liststudent/detail/student/:std_ID"
            element={<DetailS />}
          />
        </Route>
      </Route>
    </Routes>
  );
}
