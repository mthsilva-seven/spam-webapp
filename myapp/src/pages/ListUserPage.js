import React, { useEffect, useState } from "react";
import axios from 'axios'
import {Link} from 'react-router-dom';
import Pagination from "react-js-pagination";
import './pages.css';

import { Card, Typography } from "@material-tailwind/react";



export default function ListUserPage() {
  const [setores, setSetores] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [totalItemsCount, setTotalItemsCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsCountPerPage = 10; // Change this to the number of items you want per page


  useEffect(() => {
    getSetores();
  }, [activePage, searchTerm]);

  function getSetores() {
    axios.get('http://127.0.0.1:5000/listsetores', {
      params: {
        page: activePage,
        limit: itemsCountPerPage,
        search: searchTerm
      }
      
    }).then(response => {
      setSetores(response.data.setores);
      setTotalItemsCount(response.data.totalCount);
    });
  }

  function deleteSetor(id) {
    axios.delete(`http://127.0.0.1:5000/setordelete/${id}`).then(function (response) {
        console.log(response.data);
        getSetores();
    });
    alert("Setor Deletado com Sucesso!");
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
      link.setAttribute('download', 'setores.xlsx'); // Set the file name
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
        <h1 className="mb-4">Setor</h1>
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
            <button onClick={handleDownload} className="btn btn-primary mr-2">Download Setores</button>
            <button className="btn btn-success"><Link to='/addnewsetor' className="addsector">Adicionar Setor</Link></button>
            </div>
        </div>
        <div className="table-responsive">
            <table className='table table-bordered table-striped'>
                <thead className="thead-light">
                    <tr>
                        <th>#</th>
                        <th>Codigo</th>
                        <th>Setor</th>
                        <th>Subsetor</th>
                        <th>Segmento</th>
                        <th>Empresa</th>
                        <th>Ticker</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {setores.map((setor, key) => 
                        <tr key={key}>
                            <td>{setor.setor_id}</td>
                            <td>{setor.codigo}</td>
                            <td>{setor.setor}</td>
                            <td>{setor.subsetor}</td>
                            <td>{setor.segmento}</td>
                            <td>{setor.empresa}</td>
                            <td>{setor.ticker}</td>
                            <td>
                                <Link to={`/setor/${setor.setor_id}/edit`} className="btn btn-primary mr-2 download-buttons">Editar</Link>
                                <button onClick={() => deleteSetor(setor.setor_id)} className="btn btn-danger download-buttons">Deletar</button>
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