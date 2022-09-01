import type { NextPage } from "next";
import HeaderIndex from "../components/Header/Header.Index";
import ManagerIndex from "../components/Manager/Manager.Index";

const Home: NextPage = (): JSX.Element => {
  return (
    <>
      <HeaderIndex/>
      <ManagerIndex/>
    </>
  );
};

export default Home;
