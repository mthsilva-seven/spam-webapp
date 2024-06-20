import React, { useEffect, useState } from "react";
import axios from 'axios'
import {Link} from 'react-router-dom';
import Pagination from "react-js-pagination";
import './pages.css';

import { Card, Typography } from "@material-tailwind/react";



export default function ExposicaoEmpresas() {
  const [empresas, setEmpresas] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [totalItemsCount, setTotalItemsCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsCountPerPage = 10; // Change this to the number of items you want per page


  useEffect(() => {
    getEmpresas();
  }, [activePage, searchTerm]);

  function getEmpresas() {
    axios.get('http://127.0.0.1:5000/listempresas', {
      params: {
        page: activePage,
        limit: itemsCountPerPage,
        search: searchTerm
      }
      
    }).then(response => {
      setEmpresas(response.data.empresas_exposicao);
      setTotalItemsCount(response.data.totalCount);
    });
  }

  function deleteEmpresa(id) {
    axios.delete(`http://127.0.0.1:5000/empresadelete/${id}`).then(function (response) {
        console.log(response.data);
        getEmpresas();
    });
    alert("Empresa Deletada com Sucesso!");
  }

  const handleDownload = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/setordownload', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'empresas.xlsx'); // Set the file name
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('There was an error!', error);
    }
  };
 


  return (
    <div id='home' className="setorTable">
    <div className="container mt-5">
        <h1 className="mb-4">Exposicao Empresas</h1>
        <div className="d-flex justify-content-between mb-4">
            <div className="d-flex searchBar">
              <input
                type="text"
                className="form-control"
                placeholder="Pesquisar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
            <div className="top-buttons table-buttons">
            {/* <button onClick={handleDownload} className="btn btn-primary mr-2">Download Exposicao Empresas</button> */}
            <button className="btn btn-success"><Link to='/addnewempresa' className="addsector">Adicionar Empresas</Link></button>
            </div>
        </div>
        <div className="table-responsive">
            <table className='table table-bordered table-striped'>
                <thead className="thead-light">
                    <tr>
                        <th>#</th>
                        <th>Empresa</th>
                        <th>Exposição</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {empresas.map((empresa, key) => 
                        <tr key={key}>
                            <td>{empresa.empresa_id}</td>
                            <td>{empresa.nome_empresa}</td>
                            <td>{empresa.estado_exposto.replace(/[{}]/g, '')}</td>
                            <td style={{textAlign: "center", display: "flex", justifyContent: "center"}}>
                                <Link to={`/empresa/${empresa.empresa_id}/edit`} className="btn btn-primary mr-2 download-buttons" style={{width: "50%"}}>Editar</Link>
                                <button onClick={() => deleteEmpresa(empresa.empresa_id)} className="btn btn-danger download-buttons" style={{width: "50%"}}>Deletar</button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
        <div className="d-flex justify-content-center mt-4">
            <Pagination
                activePage={activePage}
                itemsCountPerPage={itemsCountPerPage}
                totalItemsCount={totalItemsCount}
                pageRangeDisplayed={5}
                onChange={(pageNumber) => setActivePage(pageNumber)}
            />
        </div>
    </div>
</div>
  );
}