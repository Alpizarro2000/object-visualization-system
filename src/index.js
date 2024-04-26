import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./js/App";
import 'aframe';

const element = document.getElementById('root');
const root = createRoot(element);

root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
);