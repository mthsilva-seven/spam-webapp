import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import './pages.css';
import Select from 'react-select';

const stateOptions = [
    { value: 'AC', label: 'AC' },
    { value: 'AL', label: 'AL' },
    { value: 'AP', label: 'AP' },
    { value: 'AM', label: 'AM' },
    { value: 'BA', label: 'BA' },
    { value: 'CE', label: 'CE' },
    { value: 'DF', label: 'DF' },
    { value: 'ES', label: 'ES' },
    { value: 'GO', label: 'GO' },
    { value: 'MA', label: 'MA' },
    { value: 'MT', label: 'MT' },
    { value: 'MS', label: 'MS' },
    { value: 'MG', label: 'MG' },
    { value: 'PA', label: 'PA' },
    { value: 'PB', label: 'PB' },
    { value: 'PR', label: 'PR' },
    { value: 'PE', label: 'PE' },
    { value: 'PI', label: 'PI' },
    { value: 'RJ', label: 'RJ' },
    { value: 'RN', label: 'RN' },
    { value: 'RS', label: 'RS' },
    { value: 'RO', label: 'RO' },
    { value: 'RR', label: 'RR' },
    { value: 'SC', label: 'SC' },
    { value: 'SP', label: 'SP' },
    { value: 'SE', label: 'SE' },
    { value: 'TO', label: 'TO' }
];

export default function EditUserPage() {

    const [selectedState, setSelectedStates] = useState([]);
    const navigate = useNavigate();

    const [inputs, setInputs] = useState([]);

    const {id} = useParams();

    useEffect(() => {
        getEmpresas();
    }, []);

    function getEmpresas() {
        axios.get(`http://127.0.0.1:5000/empresadetails/${id}`).then(function (response) {
            console.log(response.data);
            setInputs(response.data);
        });
    }

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;  
        setInputs( values => ({ ...values, [name]: value })); 
    }


    const handleStateChange = (selectedOptions) => {
        setSelectedStates(selectedOptions);
        // If you want to store the selected states in the 'inputs' state as well:
        setInputs(values => ({ ...values, estado_exposto: selectedOptions.map(option => option.value)}));
    };

    const handleSubmit = (event) => { 
        event.preventDefault();
        axios.put(`http://127.0.0.1:5000/empresaupdate/${id}`, inputs).then(function (response) {
            console.log(response.data);
            navigate('/exposicaoEmpresas');
        });
    }

    const [states, setStates] = useState(stateOptions);
    
    // useEffect(() => {
    //     fetchSectors();
    // }, []);

    // const fetchSectors = () => {
    //     axios.get('http://127.0.0.1:5000/get_setor_all')
    //         .then(response => {
    //             setSectors(response.data.setorOptions);
    //         })
    //         .catch(error => {
    //             console.error('Error fetching sectors:', error);
    //         });
    // };
    //let estado_exposto = inputs.estado_exposto ? inputs.estado_exposto.replace(/[{}]/g, '').split(',').join(' ') : '';

    return (
        <div>
            <div className="container h-100">
                <div className="row">
                    <div className="col-2"></div>
                    <div className="col-8 setor-table">
                        <h1>Editar Usuário</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Empresa</label>
                                <input type="text" className="form-control" name='nome_empresa' value={inputs.nome_empresa} onChange={handleChange}/>
                            </div>
                            <div className="form-group">
                                <label>Exposição</label>
                                <Select
                                    isMulti
                                    name="estado_exposto"
                                    options={stateOptions}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    onChange={handleStateChange}
                                    placeholder="Selecione os estados"
                                    value={inputs.estado_exposto ? stateOptions.filter(option => inputs.estado_exposto.includes(option.value)) : []}
                                />
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