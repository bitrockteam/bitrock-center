import { RouterProvider } from "react-router-dom";
import Sidebar from "./components/sidebar";
import { useAuth } from "./context/AuthProvider";
import { ThemeProvider } from "./context/ThemeProvider";
import { router } from "./router";

function App() {
  const { isLogged } = useAuth();
  return (
    <ThemeProvider>
      <div className="flex h-screen">
        {isLogged && <Sidebar />}
        <div className="flex-1 overflow-auto">
          <main className="container py-4 mx-auto px-4 h-full">
            <RouterProvider router={router} />
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
