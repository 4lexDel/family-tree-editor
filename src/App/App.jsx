import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FamilyPage from '../pages/FamilyPage';
import './app.css';
import Header from '../shared/components/Header/Header';
import ImportPage from '../pages/ImportPage';
import HomePage from '../pages/HomePage';

const App = () => {
  return (
    <div className='app'>
      <Router>
        <Header></Header>
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/home" element={<HomePage />}></Route>
          <Route path="/import" element={<ImportPage />}></Route>
          <Route path="/family" element={<FamilyPage />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;



// https://codesandbox.io/p/sandbox/drag-and-drop-files-react-js-tailwind-72rmp7?file=%2Fsrc%2FApp.js%3A8%2C5

// BUGS :
// PARTER SKIP DURING LAST GEN