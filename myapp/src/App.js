import React, {  } from 'react';

import {BrowserRouter, Routes, Route} from 'react-router-dom';

import ListUserPage from './pages/ListUserPage';
import CreateUserPage from './pages/CreateUserPage';
import EditUserPage from './pages/EditUserPage';
import PowerBiPage from './pages/PowerBiPage';
import NavbarComponent from './components/NavbarComponent';
import ExposicaoEmpresas from './pages/ExposicaoEmpresas';
import CreateEmpresa from './pages/CreateEmpresa';
import EditEmpresaPage from './pages/EditEmpresaPage';


function App() {
  return (
    <div className="vh-100 gradient-custom">
      <div className='container' style={{marginTop: '40px'}}>
        <BrowserRouter>
        <NavbarComponent />
          <Routes>
            <Route path='/' element={<ListUserPage />} />
            <Route path='/addnewsetor' element={<CreateUserPage/>}/>
            <Route path='setor/:id/edit' element={<EditUserPage/>}/>
            <Route path='empresa/:id/edit' element={<EditEmpresaPage/>}/>
            <Route path='/powerbi' element={<PowerBiPage/>}/>
            <Route path='/setordownload' element={<ListUserPage/>}/>
            <Route path='/exposicaoEmpresas' element={<ExposicaoEmpresas/>}/>
            <Route path='/addnewempresa' element={<CreateEmpresa/>}/>
          </Routes>
        </BrowserRouter>
        
      </div>
        
    </div>
    
  );
}

export default App;
