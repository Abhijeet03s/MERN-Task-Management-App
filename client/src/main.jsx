import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Toaster } from "sonner";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        richColors
        position="bottom-right"
        theme="dark"
        expand={true}
        duration={2000}
        toastOptions={{
          style: {
            borderRadius: "0.75rem",
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.4)",
            fontSize: "0.925rem",
            padding: "0.75rem 1rem",
          },
          className: "font-sans",
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
