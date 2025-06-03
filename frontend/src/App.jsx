import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import EventPage from './pages/EventPage';
import CreateEventPage from './pages/CreateEventPage';
import UpdateEventWrapper from './pages/UpdateEventWrapper';
import Invite from './pages/Invite';
import GuestRSVPForm from './pages/GuestRSVPForm.jsx';
import ViewGuests from './pages/ViewGuests';
import ContributePage from './pages/ContributePage';
import ContributionListPage from './pages/ContributionListPage';

import Register from './pages/Register';
import Login from './pages/Login';
import AddCharityPage from './pages/AddCharityPage';
import SelectCharityPage from './pages/SelectCharityPage';
import AllEventsPage from './pages/AllEventsPage';
import Dashboard from './pages/Dashboard';
import ViewContributions from './pages/ViewContributions';
import RSVPPage from './pages/RSVPPage'; // ✅ Make sure this exists
import GenerateInvite from './pages/GenerateInvite'; // ✅ Make sure this exists

import EventWrapper from './components/EventWrapper';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-800 p-4">
        <Routes>
          {/* ✅ Auth Routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* ✅ Event Routes */}
          <Route path="/create-event" element={<CreateEventPage />} />
          <Route path="/update-event/:id" element={<UpdateEventWrapper />} />
          <Route path="/event/:eventId" element={<EventWrapper><EventPage /></EventWrapper>} />
          <Route path="/" element={<AllEventsPage />} />

          {/* ✅ Charity */}
          <Route path="/add-charity" element={<AddCharityPage />} />
          <Route path="/select-charity" element={<SelectCharityPage />} />

          {/* ✅ Guest RSVP */}
          <Route path="/guest/:eventId" element={<EventWrapper><GuestRSVPForm /></EventWrapper>} />
          <Route path="/event/:eventId/guests" element={<EventWrapper><ViewGuests /></EventWrapper>} />

          {/* ✅ Contributions */}
          {/* ✅ Contribution Submission (Guest Form) */}

          <Route path="/event/:eventId/contribute" element={<EventWrapper><ContributePage /></EventWrapper>} />


          {/* ✅ View All Contributions (Host/Public) */}
          <Route path="/event/:eventId/contributions" element={<EventWrapper><ContributionListPage /></EventWrapper>} />

          {/* ✅ Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* ✅ Invitations */}
          <Route path="/rsvp/:code" element={<RSVPPage />} />
          <Route path="/generate-invite" element={<GenerateInvite />} />
          <Route path="/invite/:invitationCode" element={<Invite />} />


          {/* ✅ 404 Fallback */}
          <Route path="*" element={<h1 className="text-center text-xl font-semibold">404 - Page Not Found</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
