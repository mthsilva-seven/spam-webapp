import React from 'react';

function PowerBiPage() {
    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh', padding: '0', margin: '0', marginTop: '5vh'}}>
            <iframe 
                title="BI_Carteira" 
                style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%' }} 
                src="https://app.powerbi.com/reportEmbed?reportId=06f5e4e0-5bee-43ef-96ae-0dd927c00808&autoAuth=true&ctid=af671805-3040-4d6e-8ff2-a540c880a8fb"
                frameborder="0" 
                allowFullScreen="true">
            </iframe>
        </div>
    );
}

export default PowerBiPage;