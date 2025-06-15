import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';


// Auth
import Register from './pages/Authentication/Register';
import Login from './pages/Authentication/Login';
import ResendVerification from './pages/Authentication/ResendVerification';

// Events
import EventPage from './pages/Events/EventPage';
import CreateEventPage from './pages/Events/CreateEventPage';
import UpdateEventWrapper from './pages/Events/UpdateEventWrapper';
import AllEventsPage from './pages/Events/AllEventsPage';
import AllEvents from './pages/Events/AllEvents';
import EventWrapper from './pages/Events/EventWrapper';
import UIEventTemplateForm from './pages/Events/UIEventTemplateForm';

import UIEvent1 from './components/UIEvent1'
import UIEventDetails from "./pages/Events/UIEventDetails";
import UISelectEventPage from "./pages/Events/UISelectEventPage";




// Dashboard
import Dashboard from './pages/Dashboard';
import Dashboard2 from './pages/Dashboard2';

// Guest
import GuestRSVPForm from './pages/Guest/GuestRSVPForm';
import ViewGuests from './pages/Guest/ViewGuests';
import RSVPPage from './pages/Guest/RSVPPage';
import GuestContributions from './pages/Guest/GuestContributions'; // ✅ ADD THIS
import UIGuestAddressBook from './pages/Guest/UIGuestAddressBook';
import UIContactsPage from './pages/Guest/UIContactsPage';
import UIUniversalContactsPage from './pages/Guest/UIUniversalContactsPage';



// Contributions
import Contribute from './pages/Contributions/Contribute';
import ContributePage from './pages/Contributions/ContributePage';
import ContributionList from './pages/Contributions/ContributionList';
import ContributionListPage from './pages/Contributions/ContributionListPage'; // (Not used — maybe cleanup later)
import ViewContributions from './pages/Contributions/ViewContributions'; // (Not used — maybe cleanup later)

// Charity
import AddCharityPage from './pages/Charity/AddCharityPage';
import SelectCharityPage from './pages/Charity/SelectCharityPage';
import UIUserProfilePage from './pages/UIUserProfilePage';

// Invitations
import Invite from './pages/Invitations/Invite';

import GenerateInvite from './pages/Invitations/GenerateInvite';

function GuestContributionsWrapper() {
  const { guestId } = useParams();
  return <GuestContributions guestId={guestId} />;
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-800 p-4">
        <Routes>

          {/* Auth */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/resend-verification" element={<ResendVerification />} />

          {/* Events */}
          <Route path="/create-event" element={<CreateEventPage />} />
          <Route path="/update-event/:id" element={<UpdateEventWrapper />} />
          <Route path="/event/:eventId" element={<EventPage />} />
          <Route path="/" element={<AllEventsPage />} />
          <Route path="/events" element={<AllEvents />} />



          {/* Charity */}
          <Route path="/add-charity" element={<AddCharityPage />} />
          <Route path="/select-charity" element={<SelectCharityPage />} />

          {/* Guest */}
          <Route path="/guest/:eventId" element={<EventWrapper><GuestRSVPForm /></EventWrapper>} />
          <Route path="/event/:eventId/guests" element={<EventWrapper><ViewGuests /></EventWrapper>} />
          <Route path="/guest/:guestId/contributions" element={<GuestContributionsWrapper />} />



          {/* Contributions */}
          <Route path="/event/:eventId/contribute" element={<EventWrapper><ContributePage /></EventWrapper>} />
          <Route path="/contribute/:eventId" element={<EventWrapper><Contribute /></EventWrapper>} />
          <Route path="/event/:eventId/contributions" element={<EventWrapper><ContributionList /></EventWrapper>} />

          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/dashboard2" element={<Dashboard2 />}>
            <Route path="UIEvent1" element={<UIEvent1 />} />
            <Route path="create-template-event" element={<UIEventTemplateForm />} />
            <Route path="contacts" element={<UIUniversalContactsPage />} />
            <Route path="contacts/:eventId" element={<UIContactsPage />} />
            <Route path="profile" element={<UIUserProfilePage />} />

          </Route>



          <Route path="/dashboard2/event/:id" element={<UIEventDetails />} />

          <Route path="/event/:eventId/addressbook" element={<UIGuestAddressBook />} />





          {/* Invitations */}
          <Route path="/rsvp/:code" element={<RSVPPage />} />
          <Route path="/generate-invite" element={<GenerateInvite />} />
          <Route path="/invite/:invitationCode" element={<Invite />} />

          {/* 404 */}
          <Route path="*" element={<h1 className="text-center text-xl font-semibold">404 - Page Not Found</h1>} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
