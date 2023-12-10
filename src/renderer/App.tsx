import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

import MainPageComponent from './MainPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPageComponent />} />
      </Routes>
    </Router>
  );
};

export default App;
