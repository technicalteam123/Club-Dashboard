import { Route, Switch, Router as WouterRouter, Redirect } from 'wouter';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import Login from '@/pages/login';
import DashboardLayout from '@/components/layout/DashboardLayout';
import NotFound from '@/pages/not-found';

// User Pages
import UserDashboard from '@/pages/user/Dashboard';
import UserMembership from '@/pages/user/Membership';
import UserAppointments from '@/pages/user/Appointments';
import UserDoctors from '@/pages/user/Doctors';
import UserReports from '@/pages/user/Reports';
import UserFinance from '@/pages/user/Finance';
import UserCommunity from '@/pages/user/Community';
import UserLearning from '@/pages/user/Learning';
import UserWebinars from '@/pages/user/Webinars';
import UserMessages from '@/pages/user/Messages';
import UserSupport from '@/pages/user/Support';

// Doctor Pages
import DoctorDashboard from '@/pages/doctor/Dashboard';
import DoctorAppointments from '@/pages/doctor/Appointments';
import DoctorPatients from '@/pages/doctor/Patients';
import DoctorReports from '@/pages/doctor/Reports';
import DoctorMessages from '@/pages/doctor/Messages';
import DoctorProfile from '@/pages/doctor/Profile';

// Admin Pages
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminUsers from '@/pages/admin/Users';

// Add dummy components for the rest of admin so routing works
const AdminDoctors = () => <div className="p-8">Doctors Management</div>;
const AdminAppointments = () => <div className="p-8">Global Appointments</div>;
const AdminReports = () => <div className="p-8">Global Reports</div>;
const AdminWebinars = () => <div className="p-8">Webinar Management</div>;
const AdminCommunity = () => <div className="p-8">Community Moderation</div>;
const AdminFinance = () => <div className="p-8">Loan Partners & Finance</div>;
const AdminSupport = () => <div className="p-8">Support Tickets Queue</div>;

export function AppRoutes() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      
      {/* Root Redirect */}
      <Route path="/">
        {() => {
          const { user } = useAuth();
          if (!user) return <Redirect to="/login" />;
          return <Redirect to={`/${user.role}/dashboard`} />;
        }}
      </Route>

      {/* Protected Routes Wrapper */}
      <Route path="/:role/:page">
        {(params) => {
          const { user } = useAuth();
          if (!user) return <Redirect to="/login" />;
          if (user.role !== params.role) return <Redirect to={`/${user.role}/dashboard`} />;
          
          let Component = null;
          
          if (params.role === 'user') {
            switch (params.page) {
              case 'dashboard': Component = UserDashboard; break;
              case 'membership': Component = UserMembership; break;
              case 'appointments': Component = UserAppointments; break;
              case 'doctors': Component = UserDoctors; break;
              case 'reports': Component = UserReports; break;
              case 'finance': Component = UserFinance; break;
              case 'community': Component = UserCommunity; break;
              case 'learning': Component = UserLearning; break;
              case 'webinars': Component = UserWebinars; break;
              case 'messages': Component = UserMessages; break;
              case 'support': Component = UserSupport; break;
            }
          } else if (params.role === 'doctor') {
            switch (params.page) {
              case 'dashboard': Component = DoctorDashboard; break;
              case 'appointments': Component = DoctorAppointments; break;
              case 'patients': Component = DoctorPatients; break;
              case 'reports': Component = DoctorReports; break;
              case 'messages': Component = DoctorMessages; break;
              case 'profile': Component = DoctorProfile; break;
            }
          } else if (params.role === 'admin') {
             switch (params.page) {
              case 'dashboard': Component = AdminDashboard; break;
              case 'users': Component = AdminUsers; break;
              case 'doctors': Component = AdminDoctors; break;
              case 'appointments': Component = AdminAppointments; break;
              case 'reports': Component = AdminReports; break;
              case 'webinars': Component = AdminWebinars; break;
              case 'community': Component = AdminCommunity; break;
              case 'finance': Component = AdminFinance; break;
              case 'support': Component = AdminSupport; break;
             }
          }

          if (!Component) return <NotFound />;

          return (
            <DashboardLayout>
              <Component />
            </DashboardLayout>
          );
        }}
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}
