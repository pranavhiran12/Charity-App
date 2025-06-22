import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Auth
import Register from './pages/Authentication/Register';
import Login from './pages/Authentication/Login';
import ResendVerification from './pages/Authentication/ResendVerification';
import Verified from './pages/Authentication/ResendVerification';
import OAuthSuccess from './pages/Authentication/OAuthSuccess';


// Events
import EventPage from './pages/Events/EventPage';
import UpdateEventWrapper from './pages/Events/UpdateEventWrapper';
import AllEventsPage from './pages/Events/AllEventsPage';
import AllEvents from './pages/Events/AllEvents';
import EventWrapper from './pages/Events/EventWrapper';
import UIEventTemplateForm from './pages/Events/UIEventTemplateForm';
import UIEvent1 from './components/UIEvent1';
import UIEventDetails from './pages/Events/UIEventDetails';

// Dashboard
import Dashboard from './pages/Dashboard';
import Dashboard2 from './pages/Dashboard2';

// Guest
import GuestRSVPForm from './pages/Guest/GuestRSVPForm';
import ViewGuests from './pages/Guest/ViewGuests';
import RSVPPage from './pages/Guest/RSVPPage';
import GuestContributions from './pages/Guest/GuestContributions';
import UIGuestAddressBook from './pages/Guest/UIGuestAddressBook';
import UIContactsPage from './pages/Guest/UIContactsPage';
import UIUniversalContactsPage from './pages/Guest/UIUniversalContactsPage';

// Contributions
import Contribute from './pages/Contributions/Contribute';
import ContributePage from './pages/Contributions/ContributePage';
import ContributionList from './pages/Contributions/ContributionList';
import ViewContributions from './pages/Contributions/ViewContributions';

// Charity
import AddCharityPage from './pages/Charity/AddCharityPage';
import SelectCharityPage from './pages/Charity/SelectCharityPage';
import UIUserProfilePage from './pages/UIUserProfilePage';

// Invitations
import Invite from './pages/Invitations/Invite';
import InviteeList from './components/InviteeList';
import GenerateInvite from './pages/Invitations/GenerateInvite';

// OAuth redirect handler (optional if you want to use it)
/*const OAuthSuccess = () => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const name = params.get("name");
  const profilePic = params.get("profilePic");

  if (token && name) {
    localStorage.setItem("token", token);
    localStorage.setItem(
      "user",
      JSON.stringify({ name, profilePic: profilePic || "" })
    );
    window.location.href = "/dashboard2";
  }

  return <h2>Processing login...</h2>;
};*/

// Wrapper for guest contributions
function GuestContributionsWrapper() {
  const { guestId } = useParams();
  return <GuestContributions guestId={guestId} />;
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-800 p-4">
        {/* ✅ Global toast messages */}
        <ToastContainer position="top-right" autoClose={4000} />

        <Routes>
          {/* Auth */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/resend-verification" element={<ResendVerification />} />
          <Route path="/verified" element={<Verified />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />

          {/* Events */}
          <Route path="/" element={<AllEventsPage />} />
          <Route path="/events" element={<AllEvents />} />
          <Route path="/update-event/:id" element={<UpdateEventWrapper />} />
          <Route path="/event/:eventId" element={<EventPage />} />

          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard2" element={<Dashboard2 />}>
            <Route path="UIEvent1" element={<UIEvent1 />} />
            <Route path="create-template-event" element={<UIEventTemplateForm />} />
            <Route path="contacts" element={<UIUniversalContactsPage />} />
            <Route path="contacts/:eventId" element={<UIContactsPage />} />
            <Route path="profile" element={<UIUserProfilePage />} />
            <Route path="invitees/:eventId" element={<InviteeList />} />
          </Route>
          <Route path="/dashboard2/event/:id" element={<UIEventDetails />} />

          {/* Guest */}
          <Route path="/guest/:eventId" element={<EventWrapper><GuestRSVPForm /></EventWrapper>} />
          <Route path="/event/:eventId/guests" element={<EventWrapper><ViewGuests /></EventWrapper>} />
          <Route path="/guest/:guestId/contributions" element={<GuestContributionsWrapper />} />
          <Route path="/event/:eventId/addressbook" element={<UIGuestAddressBook />} />

          {/* Contributions */}
          <Route path="/event/:eventId/contribute" element={<EventWrapper><ContributePage /></EventWrapper>} />
          <Route path="/contribute/:eventId" element={<EventWrapper><Contribute /></EventWrapper>} />
          <Route path="/event/:eventId/contributions" element={<EventWrapper><ContributionList /></EventWrapper>} />

          {/* Invitations */}
          <Route path="/rsvp/:code" element={<RSVPPage />} />
          <Route path="/generate-invite" element={<GenerateInvite />} />
          <Route path="/invite/:invitationCode" element={<Invite />} />

          {/* 404 */}
          <Route
            path="*"
            element={
              <h1 className="text-center text-xl font-semibold text-red-500">
                404 - Page Not Found
              </h1>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
