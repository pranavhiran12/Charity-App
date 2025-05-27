//import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
//import './App.css'


/*export default function App() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-100">
      <h1 className="text-4xl font-bold text-blue-800">
        ✅ Tailwind CSS is Working!
      </h1>
    </div>
  );
}*/

/*function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}*/

//export default App



/*import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import CreateEventPage from "./pages/CreateEventPage";;
import UpdateEventWrapper from "./pages/UpdateEventWrapper"



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-event" element={<CreateEventPage />} />
        <Route path="/update-event/:id" element={<UpdateEventWrapper />} />
      </Routes>
    </Router>
  );
}

export default App;*/

/*import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import CreateEventPage from "./pages/CreateEventPage";
import UpdateEventWrapper from "./pages/UpdateEventWrapper";
import EventDetailsPage from "./pages/EventDetailsPage";
import SelectCharityPage from "./pages/SelectCharityPage";
import AddCharityPage from "./pages/AddCharityPage";
import ContributePage from "./pages/ContributePage";
import GuestListPage from "./pages/GuestListPage";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-event" element={<CreateEventPage />} />
        <Route path="/update-event/:id" element={<UpdateEventWrapper />} />
        <Route path="/event/:id" element={<EventDetailsPage />} />
        <Route path="/select-charity" element={<SelectCharityPage />} />
        <Route path="/add-charity" element={<AddCharityPage />} />
        <Route path="/event/:id/contribute" element={<ContributePage />} />
        <Route path="/event/:id/guests" element={<GuestListPage />} />

      </Routes>
    </Router>
  );
}

export default App;*/



import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import EventPage from './pages/EventPage';
import CreateEventPage from './pages/CreateEventPage';
import UpdateEventWrapper from './pages/UpdateEventWrapper';

import GuestRSVPPage from './pages/GuestRSVPPage';
import ContributePage from './pages/ContributePage';
import ContributionListPage from './pages/ContributionListPage';

import Register from './pages/Register';
import Login from './pages/Login';
import AddCharityPage from './pages/AddCharityPage';
import SelectCharityPage from './pages/SelectCharityPage';
import AllEventsPage from './pages/AllEventsPage';
import Dashboard from './pages/Dashboard';

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
          <Route path="/guest/:eventId" element={<EventWrapper><GuestRSVPPage /></EventWrapper>} />

          {/* ✅ Contributions */}
          <Route path="/contribute/:eventId" element={<EventWrapper><ContributePage /></EventWrapper>} />
          <Route path="/contributions/:eventId" element={<EventWrapper><ContributionListPage /></EventWrapper>} />

          {/* ✅ Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* ✅ 404 Fallback */}
          <Route path="*" element={<h1 className="text-center text-xl font-semibold">404 - Page Not Found</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
