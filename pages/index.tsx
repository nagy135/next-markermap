import type { NextPage } from "next";
import Map from "../components/map";
import Layout from "../components/layout";

const Home: NextPage = () => {
  return (
    <Layout>
      <Map />
    </Layout>
  );
};

export default Home;
