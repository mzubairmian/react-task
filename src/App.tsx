// App.tsx
import React from "react";
import { Container, Grid } from "semantic-ui-react";
import { AppProvider } from "./AppContext";
import FactForm from "./components/FactForm";
import FactList from "./components/FactList";

// index.tsx or App.tsx
import "semantic-ui-css/semantic.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { ToastContainer } from "react-toastify";

const App: React.FC = () => {
  return (
    <AppProvider>
      <Container fluid className="app-container">
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column width={6}>
              <FactForm />
            </Grid.Column>
            <Grid.Column width={8}>
              <FactList />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar
      />
    </AppProvider>
  );
};

export default App;
