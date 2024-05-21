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

// FEATURES
// BUG CENTERING END MULTIPLE CHILDREN (PREPARE BROTHER/SISTER)


// https://codesandbox.io/p/sandbox/drag-and-drop-files-react-js-tailwind-72rmp7?file=%2Fsrc%2FApp.js%3A8%2C5

/**

import React from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const App = () => {
  // Fonction pour afficher la modal de confirmation de suppression
  const showDeleteConfirmation = () => {
    MySwal.fire({
      title: 'Êtes-vous sûr?',
      text: "Cette action est irréversible!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        MySwal.fire(
          'Supprimé!',
          'Votre fichier a été supprimé.',
          'success'
        );
      }
    });
  };

  // Fonction pour afficher la modal d'information
  const showInformationModal = () => {
    MySwal.fire({
      title: 'Information',
      text: 'Voici une information importante!',
      icon: 'info',
      confirmButtonText: 'OK'
    });
  };

  return (
    <div>
      <button onClick={showDeleteConfirmation}>Supprimer</button>
      <br />
      <button onClick={showInformationModal}>Information</button>
    </div>
  );
};

export default App;

 */