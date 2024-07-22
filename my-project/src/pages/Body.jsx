 import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './Login';
import Mid from "./Mid";
import Profile from "./Profile";
import Home from "./Home";
import Add from "./Add";

const Body = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route index element={<Mid />} /> {/* Default child route */}
          <Route path="profile/:id" element={<Profile />} /> {/* Nested route under Home */}
          <Route path="/add" element={<Add/>} /> {/* Separate route */}

        </Route>
        <Route path="/login" element={<Login />} /> {/* Separate route */}
      </Routes>
    </Router>
  );
}

export default Body;