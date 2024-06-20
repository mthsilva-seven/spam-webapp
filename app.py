from flask import Flask, jsonify, request, send_file
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_marshmallow import Marshmallow
from flask_cors import CORS
from io import BytesIO
import pandas as pd
from sqlalchemy import func



app = Flask(__name__)
CORS(app)

app.debug=True

# Database configuration                
                                                     #user:password@dblocation/dbname                                  
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:admin@192.168.88.215:5432/posicoesdb'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db=SQLAlchemy(app)

ma=Marshmallow(app)

class Setor(db.Model):
    __tablename__ = 'setor'
    setor_id = db.Column(db.Integer, primary_key=True)
    codigo = db.Column(db.String())
    setor = db.Column(db.String())
    subsetor = db.Column(db.String())
    segmento = db.Column(db.String())
    empresa = db.Column(db.String())
    ticker = db.Column(db.String())
        
    def __init__(self, codigo, setor, subsetor, segmento, empresa, ticker):
        self.codigo = codigo
        self.setor = setor
        self.subsetor = subsetor
        self.segmento = segmento
        self.empresa = empresa
        self.ticker = ticker

class SetorSchema(ma.Schema):
    class Meta:
        fields = ('setor_id', 'codigo', 'setor', 'subsetor', 'segmento', 'empresa', 'ticker')

setor_schema = SetorSchema()
setores_schema = SetorSchema(many=True)

class Exposicao_Empresa(db.Model):
    __tablename__ = 'exposicao_empresa'
    empresa_id = db.Column(db.Integer, primary_key=True)
    nome_empresa = db.Column(db.String())
    estado_exposto = db.Column(db.String())
        
    def __init__(self, nome_empresa, estado_exposto):
        self.nome_empresa = nome_empresa
        self.estado_exposto = estado_exposto

class EmpresaSchema(ma.Schema):
    class Meta:
        fields = ('empresa_id', 'nome_empresa', 'estado_exposto')

exposicao_empresa_schema = EmpresaSchema()
exposicoes_empresas_schema = EmpresaSchema(many=True)


@app.route('/')
def hello_world():
    return "<p>Hello, World!</p>"

@app.route('/listsetores', methods=['GET'])
def listsetores():
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 10, type=int)
    search = request.args.get('search', '', type=str)

    query = Setor.query

    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            Setor.codigo.ilike(search_filter) |
            Setor.setor.ilike(search_filter) |
            Setor.subsetor.ilike(search_filter) |
            Setor.segmento.ilike(search_filter) |
            Setor.empresa.ilike(search_filter) |
            Setor.ticker.ilike(search_filter)
        )

    pagination = query.order_by(Setor.setor_id).paginate(page=page, per_page=limit, error_out=False)
    setores = pagination.items
    result = setores_schema.dump(setores)

    return jsonify({
        'setores': result,
        'totalCount': pagination.total,
        'page': pagination.page,
        'pages': pagination.pages,
        'per_page': pagination.per_page,
    })
    #return jsonify(result)

@app.route('/listempresas', methods=['GET'])
def listempresas():
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 10, type=int)
    search = request.args.get('search', '', type=str)

    query = Exposicao_Empresa.query

    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            Exposicao_Empresa.nome_empresa.ilike(search_filter) |
            Exposicao_Empresa.estado_exposto.ilike(search_filter) 
        )

    pagination = query.order_by(Exposicao_Empresa.empresa_id).paginate(page=page, per_page=limit, error_out=False)
    empresas_exposicao = pagination.items
    result = exposicoes_empresas_schema.dump(empresas_exposicao)

    return jsonify({
        'empresas_exposicao': result,
        'totalCount': pagination.total,
        'page': pagination.page,
        'pages': pagination.pages,
        'per_page': pagination.per_page,
    })
    #return jsonify(result)

@app.route('/setordetails/<id>', methods=['GET'])
def setordetails(id):
    setor = Setor.query.get(id)
    return setor_schema.jsonify(setor)

@app.route('/setorupdate/<id>', methods=['PUT'])
def setorupdate(id):
    setor_id = Setor.query.get(id)
    codigo = request.json.get('codigo', None)
    setor = request.json.get('setor', None)
    subsetor = request.json.get('subsetor', None)
    segmento = request.json.get('segmento', None)
    empresa = request.json.get('empresa', None)
    ticker = request.json.get('ticker', None)


    setor_id.codigo = codigo
    setor_id.setor = setor 
    setor_id.subsetor = subsetor
    setor_id.segmento = segmento    
    setor_id.empresa = empresa
    setor_id.ticker = ticker

    db.session.commit()

    return setor_schema.jsonify(setor_id)

@app.route('/empresadetails/<id>', methods=['GET'])
def empresadetails(id):
    empresa = Exposicao_Empresa.query.get(id)
    return exposicao_empresa_schema.jsonify(empresa)

@app.route('/empresaupdate/<id>', methods=['PUT'])
def empresaupdate(id):
    empresa_id = Exposicao_Empresa.query.get(id)
    empresa = request.json.get('nome_empresa', None)
    estado_exposto = request.json.get('estado_exposto', None)


    empresa_id.nome_empresa = empresa
    empresa_id.estado_exposto = estado_exposto 
    
    db.session.commit()

    return exposicao_empresa_schema.jsonify(empresa_id)



@app.route('/setordelete/<id>', methods=['DELETE'])
def setordelete(id):
    setor = Setor.query.get(id)
    db.session.delete(setor)
    db.session.commit()
    return setor_schema.jsonify(setor)

@app.route('/empresadelete/<id>', methods=['DELETE'])
def empresadelete(id):
    empresa = Exposicao_Empresa.query.get(id)
    db.session.delete(empresa)
    db.session.commit()
    return exposicao_empresa_schema.jsonify(empresa)

@app.route('/setoradd', methods=['POST'])
def setoradd():
    codigo = request.json.get('codigo', None)
    setor = request.json.get('setor', None)
    subsetor = request.json.get('subsetor', None)
    segmento = request.json.get('segmento', None)
    empresa = request.json.get('empresa', None)
    ticker = request.json.get('ticker', None)


    setores = Setor(codigo, setor, subsetor, segmento, empresa, ticker)
    db.session.add(setores)
    db.session.commit()

    return setor_schema.jsonify(setores)


@app.route('/empresaadd', methods=['POST'])
def empresaadd():
    nome_empresa = request.json.get('nome_empresa', None)
    exposicao = request.json.get('exposicao', None)


    exposicoes_empresas_schema = Exposicao_Empresa(nome_empresa, exposicao)
    db.session.add(exposicoes_empresas_schema)
    db.session.commit()

    return exposicao_empresa_schema.jsonify(exposicoes_empresas_schema)



@app.route('/setordownload', methods=['GET'])
def setordownload():
    setores = Setor.query.all()
    result = setores_schema.dump(setores)
    
    # Convert the result to a pandas DataFrame
    df = pd.DataFrame(result)
    
    # Create an Excel file in memory
    output = BytesIO()
    writer = pd.ExcelWriter(output, engine='xlsxwriter')
    df.to_excel(writer, index=False, sheet_name='Setores')
    writer.close()
    output.seek(0)
    
    # Send the Excel file as a response
    return send_file(output, download_name="setores.xlsx", as_attachment=True)

# Get the distinct setor values from the database
@app.route('/get_setor', methods=['GET'])
def get_setor():
    # Perform the SELECT DISTINCT query
    distinct_setores = db.session.query(Setor.setor).distinct().all()
    
    # Extract the 'setor' values from the query result
    setor_list = [setor[0] for setor in distinct_setores if setor[0] is not None]
    
    # Remove 'Outros' if it exists in the list
    if 'Outros' in setor_list:
        setor_list.remove('Outros')

    # Sort the list alphabetically
    setor_list.sort()

    # Append 'Outros' to the end of the list
    setor_list.append('Outros')

    # Return the results as JSON
    return jsonify({"setorOptions": setor_list})

@app.route('/get_subsetor', methods=['GET'])
def get_subsetor():
    # Get the 'setor' parameter from the query string
    selected_setor = request.args.get('setor', None)
    
    if selected_setor:
        # Perform the SELECT DISTINCT query with a filter for the selected setor
        distinct_subsetores = db.session.query(Setor.subsetor).filter(Setor.setor == selected_setor).distinct().all()
    else:
        # If no setor is provided, return an empty list or handle as needed
        return jsonify({"subsetorOptions": []})
    
    # Extract the 'subsetor' values from the query result
    subsetor_list = [subsetor[0] for subsetor in distinct_subsetores if subsetor[0] is not None]

    # Remove 'Outros' if it exists in the list
    if 'Outros' in subsetor_list:
        subsetor_list.remove('Outros')

    # Sort the list alphabetically
    subsetor_list.sort()

    # Append 'Outros' to the end of the list
    subsetor_list.append('Outros')
    
    # Return the results as JSON
    return jsonify({"subsetorOptions": subsetor_list})

# Get the distinct segmento values from the database
@app.route('/get_segmento', methods=['GET'])
def get_segmento():
    # Get the parameters setor and subsetor from the query string
    selected_setor = request.args.get('setor', None)
    selected_subsetor = request.args.get('subsetor', None)

    if selected_setor and selected_subsetor:
        # Perform the SELECT DISTINCT query with filters for setor and subsetor
        distinct_segmento = db.session.query(Setor.segmento).filter(Setor.setor == selected_setor).filter(Setor.subsetor == selected_subsetor).distinct().all()
    else:
        # If setor or subsetor is not provided, return an empty list or handle as needed
        return jsonify({"segmentoOptions": []})

    
    # Extract the 'setor' values from the query result
    segmento_list = [segmento[0] for segmento in distinct_segmento if segmento[0] is not None]

    # Remove 'Outros' if it exists in the list
    if 'Outros' in segmento_list:
        segmento_list.remove('Outros')

    # Sort the list alphabetically
    segmento_list.sort()

    # Append 'Outros' to the end of the list
    segmento_list.append('Outros')
    
    # Return the results as JSON
    return jsonify({"setorOptions": segmento_list})



# Get the distinct setor values from the database
@app.route('/get_setor_all', methods=['GET'])
def get_setor_all():
    # Perform the SELECT DISTINCT query
    distinct_setores = db.session.query(Setor.setor).distinct().all()
    
    # Extract the 'setor' values from the query result
    setor_list = [setor[0] for setor in distinct_setores if setor[0] is not None]
    
    # Remove 'Outros' if it exists in the list
    if 'Outros' in setor_list:
        setor_list.remove('Outros')

    # Sort the list alphabetically
    setor_list.sort()

    # Append 'Outros' to the end of the list
    setor_list.append('Outros')

    # Return the results as JSON
    return jsonify({"setorOptions": setor_list})



@app.route('/get_subsetor_all', methods=['GET'])
def get_subsetor_all():
    # Perform the SELECT DISTINCT query with a filter for the selected setor
    distinct_subsetores = db.session.query(Setor.subsetor).distinct().all()

    # Extract the 'subsetor' values from the query result
    subsetor_list = [subsetor[0] for subsetor in distinct_subsetores if subsetor[0] is not None]

    # Remove 'Outros' if it exists in the list
    if 'Outros' in subsetor_list:
        subsetor_list.remove('Outros')

    # Sort the list alphabetically
    subsetor_list.sort()

    # Append 'Outros' to the end of the list
    subsetor_list.append('Outros')
    
    # Return the results as JSON
    return jsonify({"subsetorOptions": subsetor_list})

# Get the distinct segmento values from the database
@app.route('/get_segmento_all', methods=['GET'])
def get_segmento_all():
    # Perform the SELECT DISTINCT query with filters for setor and subsetor
    distinct_segmento = db.session.query(Setor.segmento).distinct().all()
    
    # Extract the 'setor' values from the query result
    segmento_list = [segmento[0] for segmento in distinct_segmento if segmento[0] is not None]

    # Remove 'Outros' if it exists in the list
    if 'Outros' in segmento_list:
        segmento_list.remove('Outros')

    # Sort the list alphabetically
    segmento_list.sort()

    # Append 'Outros' to the end of the list
    segmento_list.append('Outros')
    
    # Return the results as JSON
    return jsonify({"setorOptions": segmento_list})