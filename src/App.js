import Dashboard from "./pages/Home.js";
import Login from "./pages/auth/SignIn.js";
import Main from "../src/components/layout/Main.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { useAuth } from "./providers/AuthProvider";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import "antd/dist/antd.css";
import ListStudents from "./pages/students/ListStudents.js";
import ListParents from "./pages/students/ListParents.js";
import StudentLeaves from "./pages/students/studentleaves.js";
import StaffLeave from "./pages/students/staffleaves.js";
import StudentSetup from "./pages/students/studentsetup.js";
import StaffSetup from "./pages/students/staffsetup.js";
import SalarySetup from "./pages/students/salarysetup.js";
import ListStaffs from "./pages/staff/ListStaffs.js";
import ViewStudent from "./pages/students/ViewStudent.js";
import ViewStaff from "./pages/staff/ViewStaff.js";
import Create from "./pages/students/Create.js";
import SalarySlip from "./pages/staff/salarySlip.js";
import CreateStaff from "./pages/students/CreateStaff.js";
import UpdateStudent from "./pages/students/UpdateStudent.js";

function App() {
  const { isLoggedIn, userToken } = useAuth(); // Use the useAuth hook
  console.log("is user logged in", isLoggedIn);
  const { darkMode } = useContext(DarkModeContext);

  return (
    <Router>
        <Routes>
          {userToken ? (
            <>
            
              <Route path="/students" element={<Main><ListStudents /></Main>} />
              <Route path="/parents" element={<Main><ListParents /></Main>} />
              <Route path="/staffleaves" element={<Main><StaffLeave /></Main>} />
              <Route path="/studentleaves" element={<Main><StudentLeaves /></Main>} />
              <Route path="/studentsetup" element={<Main><StudentSetup /></Main>} />
              <Route path="/staffsetup" element={<Main><StaffSetup /></Main>} />
              <Route path="/salarysetup" element={<Main><SalarySetup /></Main>} />
              <Route path="/ListStaffs" element={<Main><ListStaffs /></Main>} />
              <Route path="/students/:id" element={<Main><ViewStudent /></Main>} />
              <Route path="/staff/:id" element={<Main><ViewStaff /></Main>} />
              <Route path="staff/salarySlip/:id" element={<Main><SalarySlip /></Main>} />
              <Route path="/create" element={<Main><Create /></Main>} />
              <Route path="/staffs/create" element={<Main><CreateStaff /></Main>} />
              <Route path="/students/update/:id" element={<Main><UpdateStudent /></Main>} />
              {/* Other routes for authenticated users */}
              <Route path="*" element={<Main><Dashboard userToken={userToken} /></Main>} />
            </>
          ) : (
            <Route path="*" element={<Login />} />
          )}
        </Routes>
    </Router>
  );
}

export default App;
