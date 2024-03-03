import CandidateSearch from './CandidateSearch';
import { createContext, useState } from 'react';

interface ScreenContextType {
  screen: JSX.Element;
  switchScreen: (newScreen: JSX.Element) => void;
}

export const ScreenContext = createContext<ScreenContextType>({
  screen: <></>,
  switchScreen: () => {},
});

const HRDashboard: React.FC = () => {
  const [screen, setScreen] = useState<JSX.Element>(<CandidateSearch />);

  const switchScreen = (newScreen: JSX.Element): void => {
    setScreen(newScreen);
  };

  return (
    <ScreenContext.Provider value={{ screen, switchScreen }}>
      {screen}
    </ScreenContext.Provider>
  );
};

export default HRDashboard;
