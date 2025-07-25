import App from "@/app";
import { HelmetProvider } from "@dr.pogodin/react-helmet";
import ReactDOM from "react-dom/client";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <HelmetProvider>
        <App />
    </HelmetProvider>,
);
