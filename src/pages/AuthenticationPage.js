import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

const AuthenticationPageStyle = styled.div`
  min-height: 100vh;
  padding: 40px;
  .logo {
    margin: 0 auto 25px;
  }
  .heading {
    color: ${(props) => props.theme.primary};
    text-align: center;
    font-weight: bold;
    font-size: 40px;
    margin-bottom: 60px;
  }

  .form {
    max-width: 600px;
    margin: 0 auto;
  }
`;

const AuthenticationPage = ({ children }) => {
  return (
    <AuthenticationPageStyle>
      <div className="container">
        <NavLink to="/">
          <img
            srcSet="/monkey-logo.png 2x"
            alt="monkey-blogging"
            className="logo"
          />
        </NavLink>
        <h1 className="heading">Monkey blogging</h1>
      </div>
      {children}
    </AuthenticationPageStyle>
  );
};

export default AuthenticationPage;
