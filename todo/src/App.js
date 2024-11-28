import { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Registration from "./components/Registration";
import Login from "./components/Login";
import Header from "./components/Header";
import TodoApplication from "./components/TodoApplication";

import "./App.css";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Header />
        <div className="app-container">
          <Switch>
            <Route exact path="/register" component={Registration} />
            <Route exact path="/login/" component={Login} />
            <Route exact path="/todos" component={TodoApplication} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
