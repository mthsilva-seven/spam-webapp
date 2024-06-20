import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Select from 'react-select';
import './pages.css';


// Define the options for the states
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

export default function CreateEmpresa() {

    const [selectedState, setSelectedStates] = useState([]);
    const navigate = useNavigate();

    const [nome_empresa, setNomeEmpresa] = useState('');

    const handleNomeEmpresaChange = (event) => {
        setNomeEmpresa(event.target.value);
    };

    const [inputs, setInputs] = useState({
        nome_empresa: '',
        exposicao: ''
    });
    

    const handleStateChange = (selectedOptions) => {
        setSelectedStates(selectedOptions);
        // If you want to store the selected states in the 'inputs' state as well:
        setInputs(values => ({ ...values, exposicao: selectedOptions.map(option => option.value),  nome_empresa: nome_empresa}));
    };


    const handleSubmit = (event) => {
        event.preventDefault();

        axios.post('http://127.0.0.1:5000/empresaadd', inputs).then(function (response) {
            console.log(response.data);
            navigate('/exposicaoEmpresas');
        });
    }



    return (
        <div>
            <div className="container h-100">
                <div className="row">
                    <div className="col-2"></div>
                    <div className="col-8 setor-table">
                        <h1>Adicionar Empresa</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Empresa</label>
                                <input type="text" className="form-control" name='nome_empresa' value={nome_empresa} onChange={handleNomeEmpresaChange}/>
                            </div>
                            <div className="form-group">
                                <label>Exposição</label>
                                <Select
                                    isMulti
                                    name="exposicao"
                                    options={stateOptions}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    onChange={handleStateChange}
                                    placeholder="Selecione os estados"
                                />
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
