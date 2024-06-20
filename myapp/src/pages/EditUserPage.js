import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import './pages.css';

export default function EditUserPage() {

    const navigate = useNavigate();

    const [inputs, setInputs] = useState([]);

    const {id} = useParams();

    useEffect(() => {
        getSetores();
    }, []);

    function getSetores() {
        axios.get(`http://127.0.0.1:5000/setordetails/${id}`).then(function (response) {
            console.log(response.data);
            setInputs(response.data);
        });
    }

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;  
        setInputs( values => ({ ...values, [name]: value })); 
    }

    const handleSubmit = (event) => { 
        event.preventDefault();
        axios.put(`http://127.0.0.1:5000/setorupdate/${id}`, inputs).then(function (response) {
            console.log(response.data);
            navigate('/');
        });
    }

    const [sectors, setSectors] = useState([]);
    const [subsectors, setSubsectors] = useState([]);
    const [segmentos, setSegmentos] = useState([]);

    useEffect(() => {
        fetchSectors();
        fetchSubsectors();
        fetchSegmentos();
    }, []);

    const fetchSectors = () => {
        axios.get('http://127.0.0.1:5000/get_setor_all')
            .then(response => {
                setSectors(response.data.setorOptions);
            })
            .catch(error => {
                console.error('Error fetching sectors:', error);
            });
    };

    const fetchSubsectors = () => {
        axios.get('http://127.0.0.1:5000/get_subsetor_all')
            .then(response => {
                setSubsectors(response.data.subsetorOptions);
            })
            .catch(error => {
                console.error('Error fetching subsectors:', error);
            });
    };

    const fetchSegmentos = () => {
        axios.get('http://127.0.0.1:5000/get_segmento_all')
            .then(response => {
                setSegmentos(response.data.setorOptions);
            })
            .catch(error => {
                console.error('Error fetching segmentos:', error);
            });
    };

    return (
        <div>
            <div className="container h-100">
                <div className="row">
                    <div className="col-2"></div>
                    <div className="col-8 setor-table">
                        <h1>Editar Usuário</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Codigo</label>
                                <input type="text" className="form-control" name='codigo' value={inputs.codigo} onChange={handleChange}/>
                            </div>
                            <div className="form-group">
                                <label>Setor</label>
                                <select className="form-control" name='setor' value={inputs.setor} onChange={handleChange}>
                                    <option value="">Selecione o Setor</option>
                                    {sectors && sectors.map(sector => (
                                        <option key={sector} value={sector}>{sector}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Subsetor</label>
                                <select className="form-control" name='subsetor' value={inputs.subsetor} onChange={handleChange}>
                                    <option value="">Selecione o Subsetor</option>
                                    {subsectors && subsectors.map(subsector => (
                                        <option key={subsector} value={subsector}>{subsector}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Segmento</label>
                                <select className="form-control" name='segmento' value={inputs.segmento} onChange={handleChange}>
                                    <option value="">Selecione o Segmento</option>
                                    {segmentos && segmentos.map(segmento => (
                                        <option key={segmento} value={segmento}>{segmento}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Empresa</label>
                                <input type="text" className="form-control" name='empresa' value={inputs.empresa} onChange={handleChange}/>
                            </div>
                            <div className="form-group">
                                <label>Ticker</label>
                                <input type="text" className="form-control" name='ticker' value={inputs.ticker} onChange={handleChange}/>
                            </div>
                            <div className="form-group">
                                <button type="submit" className="btn btn-primary" name='update'>Salvar</button>
                            </div>
                        </form>
                    </div>
                    <div className="col-2"></div>   
                </div>
            </div>
        </div>
    );
}