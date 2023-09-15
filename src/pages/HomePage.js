import { signOut } from "firebase/auth";
import React from "react";

import styled from "styled-components";

import Layout from "../components/layout/Layout";
import Banner from "../components/layout/Banner";
import HomeFeature from "../modul/home/HomeFeature";
import HomeNewest from "../modul/home/HomeNewest";

const HomePageStyles = styled.header``;

const HomePage = () => {
  //   const handleSignOut = () => {
  //     signOut(auth);
  //   };
  return (
    <HomePageStyles>
      <Layout>
        <Banner></Banner>
        <HomeFeature></HomeFeature>
        <HomeNewest></HomeNewest>
      </Layout>
    </HomePageStyles>
  );
};

export default HomePage;
