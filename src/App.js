import "./App.css";
//import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Favorites from "./pages/Favorites";
import NavBar from "./components/NavBar";

import { Route, BrowserRouter, Switch } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <NavBar />
        <Switch>
          <Route path="/login" component={Login} />
          <ProtectedRoute path="/dashboard" page={Dashboard} />
          <ProtectedRoute path="/favorites" page={Favorites} />
          <ProtectedRoute path="" page={Home} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
