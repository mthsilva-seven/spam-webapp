import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './pages.css';


export default function CreateUserPage() {

    const navigate = useNavigate();

    const [inputs, setInputs] = useState({
        codigo: '',
        setor: '',
        subsetor: '',
        segmento: '',
        empresa: '',
        ticker: ''
    });

    const [sectors, setSectors] = useState([]);
    const [subsectors, setSubsectors] = useState([]);
    const [segmentos, setSegmentos] = useState([]);


    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs( values => ({ ...values, [name]: value }));
        console.log(inputs);
        if (name === 'setor') {
            fetchSubsectors(value);
        } else if (name === 'subsetor') {
            fetchSegmentos(inputs.setor, value);
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        axios.post('http://127.0.0.1:5000/setoradd', inputs).then(function (response) {
            console.log(response.data);
            navigate('/');
        });
    }

    useEffect(() => {
        fetchSectors();
    }, []);

    const fetchSectors = () => {
        axios.get('http://127.0.0.1:5000/get_setor')
            .then(response => {
                setSectors(response.data.setorOptions);
            })
            .catch(error => {
                console.error('Error fetching sectors:', error);
            });
    };

    const fetchSubsectors = (selectedSetor) => {
        axios.get('http://127.0.0.1:5000/get_subsetor', { params: { setor: selectedSetor } })
            .then(response => {
                setSubsectors(response.data.subsetorOptions);
            })
            .catch(error => {
                console.error('Error fetching subsectors:', error);
            });
    };

    const fetchSegmentos = (selectedSetor, selectedSubsetor) => {
        axios.get('http://127.0.0.1:5000/get_segmento', { params: { setor: selectedSetor, subsetor: selectedSubsetor } })
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
                        <h1>Adicionar Setor</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Codigo</label>
                                <input type="text" className="form-control" name='codigo' onChange={handleChange}/>
                            </div>
                            <div className="form-group">
                                <label>Setor</label>
                                <select className="form-control" name='setor' value={inputs.setor} onChange={handleChange}>
                                    <option value="">Selecione o Setor</option>
                                    {sectors.map(sector => (
                                        <option key={sector} value={sector}>{sector}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Subsetor</label>
                                <select className="form-control" name='subsetor' value={inputs.subsetor} onChange={handleChange}>
                                    <option value="">Selecione o Subsetor</option>
                                    {subsectors.map(subsector => (
                                        <option key={subsector} value={subsector}>{subsector}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Segmento</label>
                                <select className="form-control" name='segmento' value={inputs.segmentos} onChange={handleChange}>
                                    <option value="">Selecione o Segmento</option>
                                    {segmentos.map(segmentos => (
                                        <option key={segmentos} value={segmentos}>{segmentos}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Empresa</label>
                                <input type="text" className="form-control" name='empresa' onChange={handleChange}/>
                            </div>
                            <div className="form-group">
                                <label>Ticker</label>
                                <input type="text" className="form-control" name='ticker' onChange={handleChange}/>
                            </div>
                            <div className="form-group">
                                <button type="submit" className="btn btn-primary" name='add'>Adicionar</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="col-2"></div>
            </div>
        </div>
    );
}
