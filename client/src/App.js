import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import ContactUs from "./components/ContactUs";
import Analytics from "./components/Analytics/Analytics";
import Login from "./components/Login";
import "./App.css";

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/Login">Login</Link>
            </li>
            <li>
              <Link to="/contact-us">Contact-Us</Link>
            </li>
            <li>
              <Link to="/analytics">Analytics</Link>
            </li>
          </ul>
        </nav>
        <hr></hr>

        <Switch>
          <Route path="/Login">
            <Login />
          </Route>
          <Route path="/contact-us">
            <ContactUs />
          </Route>
          <Route path="/analytics">
            <Analytics />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
export default App;
