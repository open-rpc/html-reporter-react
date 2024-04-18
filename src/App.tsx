import 'react';
import { createTheme, MantineProvider } from '@mantine/core';
import { Route, Switch, Router } from 'wouter';
import { useHashLocation } from "wouter/use-hash-location";
import Home from './Home';
import Details from './Details';

const theme = createTheme({
  /** Put your mantine theme override here */
});

function App() {
  return (
    <>
      <Router hook={useHashLocation}>
        <MantineProvider theme={theme}>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/details/:id" component={Details} />

            {/* Default route in a switch */}
            <Route>404: No such page!</Route>
          </Switch>
        </MantineProvider>
      </Router>
    </>
  );
}

export default App;
