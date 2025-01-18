import { registerRootComponent } from "expo";

import App from "./App";
import { AppContextProvider } from "./store/app-context";
import { UserProvider } from "./store/user-context";
import { NavigationContainer } from "@react-navigation/native";

const MainApp = () => {
  return (
    <AppContextProvider>
      <UserProvider>
        <NavigationContainer>
          <App />
        </NavigationContainer>
      </UserProvider>
    </AppContextProvider>
  );
};
registerRootComponent(MainApp);
