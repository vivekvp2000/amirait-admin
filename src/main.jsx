import { ToastContainer } from "react-toastify";
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
import { Provider } from "react-redux";
import store from "./store/store";
// Google Font

// Toast Css
import "react-toastify/dist/ReactToastify.css";
// Toast Css

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider>
          <App />
          <ToastContainer />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
