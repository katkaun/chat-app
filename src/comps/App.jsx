import "react-image-crop/dist/ReactCrop.css";
import Switch from "../Switch";
import { AuthProvider } from "../context/AuthProvider";
import Layout from "./ui/Layout";


function App() {
  return (
    <AuthProvider>

        <Layout>
          <Switch />
        </Layout>

    </AuthProvider>
  );
}

export default App;

