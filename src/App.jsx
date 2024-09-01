import "react-image-crop/dist/ReactCrop.css";
import Switch from "./Switch";
import AuthContext, { AuthProvider } from "./context/AuthProvider";
import SideNav from "./comps/SideNav";
import Navbar from "./comps/Navbar";
import { useContext, useState } from "react";

function App() {
  const { auth } = useContext(AuthContext);
  // const [theme, setTheme] = useState("cupcake");
  // const toggleTheme = () => {
  //   setTheme((prevTheme) => (prevTheme === "cupcake" ? "synthwave" : "cupcake"));
  // };

  return (
    <AuthProvider>
      {/* <Layout> */}
      <Navbar />
      <SideNav />
      <Switch />
      {/* </Layout> */}
    </AuthProvider>
  );
}

export default App;
