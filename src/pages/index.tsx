import Layout from "@/hocs/Layout";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

export const Home = (props) => {
  return (
    <Layout title="Home" description="Home">
      <div>Home</div>;
    </Layout>
  );
};

export default Home;
