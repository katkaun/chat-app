import Switch from "../Switch";
import { AuthProvider } from "../context/AuthProvider";
import Layout from "./Layout";

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
