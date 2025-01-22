import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Helmet } from "react-helmet";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRouter from "./routers/AppRouter";
import { store, persistor } from "./redux/store";
import { reload } from "./utils/functions"

import ErrorBoundary from "./components/ErrorBoundary";
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
          <ErrorBoundary onReset={reload}>
            <AppRouter />
          </ErrorBoundary>
          <ToastContainer
            position="bottom-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition={Bounce}
          />
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;