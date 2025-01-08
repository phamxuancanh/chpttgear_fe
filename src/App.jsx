// src/App.js
import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store"; // Adjust the path as necessary
import AppRouter from "./routers/AppRouter"; // Import your router
import { Helmet } from "react-helmet";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Helmet>
          <title>Graduate Project</title>
          <link rel="shortcut icon" href="./logo.webp" />
        </Helmet>
        <AppRouter />
        <ToastContainer
          position="bottom-right"
          autoClose={2000} // Auto-close after 2 seconds
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce} // Correctly use Bounce as a component
        />
      </PersistGate>
    </Provider>
  );
}

export default App;
