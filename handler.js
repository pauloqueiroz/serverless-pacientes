'use strict';

const pacientes = [
  { id: 1, nome: 'Maria', dataNascimento: '1984-11-01' },
  { id: 2, nome: 'Joao', dataNascimento: '1980-01-16' },
  { id: 3, nome: 'Jose', dataNascimento: '1998-06-06' }
]


module.exports.listarPacientes = async (event) => {
  console.log(event)
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        pacientes
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};


module.exports.obterPaciente = async (event) => {
  const { pacienteId } = event.pathParameters;
  const paciente = pacientes.find((paciente) => paciente.id == pacienteId);
  if(!paciente){
    return {
      statusCode: 404,
      body: JSON.stringify({error: "Paciente não encontrado"}, null,2)
    };
  }
  return {
    statusCode: 200,
    body: JSON.stringify(paciente, null, 2)
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};


module.exports.cadastrarPaciente = async (event) => {
  
  const timestamp = new Date().getTime();

  let dados = JSON.parse(event.body);

  const { nome, data_nascimento, email, telefone } = dados;

  const paciente = {
    paciente_id: uuidv4(),
    nome,
    data_nascimento,
    email,
    telefone,
    status: true,
    criado_em: timestamp,
    atualizado_em: timestamp,
  };

  try {

    await dynamoDb
      .put({
        TableName: "PACIENTES",
        Item: paciente,
      })
      .promise();

    return {
      statusCode: 201,
    };
  } catch (err) {
    console.log("Error", err);
    return {
      statusCode: err.statusCode ? err.statusCode : 500,
      body: JSON.stringify({
        error: err.name ? err.name : "Exception",
        message: err.message ? err.message : "Unknown error",
      }),
    };
  }
};