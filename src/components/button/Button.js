import React from "react";
import styled, { css } from "styled-components";
import LoadingSpinner from "../loading/LoadingSpinner";
import { string } from "prop-types";
import { NavLink } from "react-router-dom";

const ButtonStyles = styled.button`
  padding: 20px;
  cursor: pointer;
  line-height: 1;
  color: white;
  border-radius: 8px;
  font-weight: 600;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${(props) => props.height || "70px"};

  ${(props) =>
    props.kind === "secondary" &&
    css`
      background-color: white;
      color: ${(props) => props.theme.primary};
    `};
  ${(props) =>
    props.kind === "primary" &&
    css`
      color: white;
      background-image: linear-gradient(
        to right bottom,
        ${(props) => props.theme.primary},
        ${(props) => props.theme.secondary}
      );
    `};

  ${(props) =>
    props.kind === "ghost" &&
    css`
      color: ${(props) => props.theme.threeColor};
      background-color: rgba(29, 192, 113, 0.1);
    `};

  &:disabled {
    opacity: 0.5;
    pointer-events: none;
  }
`;
const Button = ({
  type = "button",
  onClick = () => {},
  children,
  kind = "primary",
  ...props
}) => {
  // tạo 1 prop isLoading -> sinh ra 1 loading truyền vào Button trang SignupPage
  const { isLoading, to } = props;

  const child = !!isLoading ? <LoadingSpinner></LoadingSpinner> : children;

  if (to !== "" && typeof to === "string") {
    return (
      <NavLink to={to} style={{ display: "inline-block" }}>
        <ButtonStyles {...props} kind={kind} type={type} onClick={onClick}>
          {child}
        </ButtonStyles>
      </NavLink>
    );
  }
  // !!isLoading biến number hay string thành kiểu boolean

  return (
    <ButtonStyles {...props} type={type} kind={kind} onClick={onClick}>
      {child}
    </ButtonStyles>
  );
};

export default Button;
