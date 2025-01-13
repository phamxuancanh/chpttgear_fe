import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Helmet } from "react-helmet";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRouter from "./routers/AppRouter";
import { store, persistor } from "./redux/store";

const queryClient = new QueryClient();

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <Helmet>
            <title>CHPTT GEAR</title>
            <link rel="shortcut icon" href="./logo192.png" />
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
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;