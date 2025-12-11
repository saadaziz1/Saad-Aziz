import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Shell from './components/Layout/Shell';
import Dashboard from './pages/Dashboard';
import Projects from './pages/projects/Projects';
import CreateProject from './pages/projects/CreateProject';
import ProjectDetails from './pages/projects/ProjectDetails';
import Members from './pages/member/Members';
import CreateMember from './pages/member/CreateMember';
import EditMember from './pages/member/EditMember';
import ThemeLayout from './components/Layout/ThemeLayout';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

function App() {
  return (
   <ThemeLayout>
     <div style={{maxWidth: "1500px", margin: "0 auto"}}>
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        
        <Route path="/*" element={<ProtectedRoute><Shell /></ProtectedRoute>}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/create" element={<CreateProject />} />
          <Route path="projects/:id" element={<ProjectDetails />} />
          <Route path="members" element={<Members />} />
          <Route path="members/create" element={<CreateMember />} />
          <Route path="members/edit/:id" element={<EditMember />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </div>
   </ThemeLayout>
  );
}

export default App;