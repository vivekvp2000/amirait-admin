import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";

// Google Font
import "@fontsource/jost"; // Defaults to weight 400
import "@fontsource/jost/300.css"; // Light weight
import "@fontsource/jost/700.css"; // Bold weight
// Google Font

// Create a client
// const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <StrictMode>
      {/* <QueryClientProvider client={queryClient}> */}
      <ThemeProvider>
        <App />
      </ThemeProvider>
      {/* </QueryClientProvider> */}
    </StrictMode>
  </BrowserRouter>
);
