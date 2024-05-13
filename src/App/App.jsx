import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FamilyPage from '../pages/FamilyPage';
import './app.css';
import Header from '../shared/components/Header/Header';
import ImportPage from '../pages/ImportPage';
import HomePage from '../pages/HomePage';

const App = () => (
  <div className='app'>
    <Router>  
        <Header></Header>      
        <Routes>
        <Route path="/" element={<HomePage/>}></Route>
        <Route path="/home" element={<HomePage/>}></Route>
        <Route path="/import" element={<ImportPage/>}></Route>
        <Route path="/family" element={<FamilyPage/>}></Route>
        </Routes>
    </Router>    
  </div>
);

export default App;

// FEATURES
// PARENT UNIQUE
// BUG CENTERING END MULTIPLE CHILDREN (PREPARE BROTHER/SISTER)
// BUG CHANGEMENT DE MARGE