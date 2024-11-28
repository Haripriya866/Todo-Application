import { Component } from "react";

import "./index.css";

class Login extends Component {
  state = {
    name: "",
    email: "",
    password: "",
    nameError: "",
    emailError: "",
    passwordError: "",
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value, [`${name}Error`]: "" }); 
  };

  renderNameInputField = () => {
    const { name, nameError } = this.state;
    return (
      <div className="input-container">
        <input
          type="text"
          id="name"
          placeholder="Name"
          className="input-field"
          name="name"
          value={name}
          onChange={this.handleInputChange}
        />
        {nameError && <span className="error-message">{nameError}</span>}
      </div>
    );
  };

  renderEmailInputField = () => {
    const { email, emailError } = this.state;
    return (
      <div className="input-container">
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          className="input-field"
          value={email}
          onChange={this.handleInputChange}
        />
        {emailError && <span className="error-message">{emailError}</span>}
      </div>
    );
  };

  renderPasswordInputField = () => {
    const { password, passwordError } = this.state;
    return (
      <div className="input-container">
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          className="input-field"
          value={password}
          onChange={this.handleInputChange}
        />
        {passwordError && (
          <span className="error-message">{passwordError}</span>
        )}
      </div>
    );
  };

  validateFields = () => {
    const { name, email, password } = this.state;
    let isValid = true;

    this.setState({
      nameError: "",
      emailError: "",
      passwordError: "",
    });

    if (!name) {
      this.setState({ nameError: "Name is required" });
      isValid = false;
    }
    if (!email) {
      this.setState({ emailError: "Email is required" });
      isValid = false;
    }
    if (!password) {
      this.setState({ passwordError: "Password is required" });
      isValid = false;
    }

    return isValid;
  };

  submitForm = async (event) => {
    event.preventDefault();

    // Validate fields
    const isValid = this.validateFields();
    if (!isValid) {
      return; // Stop submission if validation fails
    }

    const { name, email, password } = this.state;
    const userDetails = { name, email, password };

    const url = "http://localhost:3006/login/";

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDetails),
    };
    try {
      const response = await fetch(url, options);
      if (response.ok === true) {
        const data = await response.json();
        const jwtToken = data.jwtToken;

        localStorage.setItem("jwtToken", jwtToken);
        const { history } = this.props; 
        history.replace("/todos"); 
      } else {
        const errorData = await response.json();
        console.error("Error: ", errorData);
      }
    } catch (error) {
      console.error("Login failed: ", error);
    }
  };

  render() {
    return (
      <div className="registration-container">
        <form className="form" onSubmit={this.submitForm}>
          <h1 className="user-details-heading">Login</h1>
          {this.renderNameInputField()}
          {this.renderEmailInputField()}
          {this.renderPasswordInputField()}
          <button type="submit" className="signup-button">
            Login
          </button>
        </form>
      </div>
    );
  }
}

export default Login;
