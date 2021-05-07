//yarn add express, add middlewares, rotas etc
//yarn add uuidv4 universal unique id.
const express = require('express');
const { uuid, isUuid } = require('uuidv4');
/*
HTTP  MAIN METHODS:
GET : Buscar informações do backend.
POST : Criar uma informação no back-end
PUT : Alterar uma informação no back-end (pode ser patch também para atualizar
  uma informação em específico.)
DELETE: Quando formos deletar uma informação do back-end
*/
/* Tipos de parametros
  Query params: Filtros e paginação (listagem de projetos específicos) 
  ?title=TituloReact&owner=MateusPeq 
  Route params: Identificar recursos quando atualizar ou deletar, ID.
  Request body: Conteúdo na hora de criar ou editar um recurso.(JSON)
*/
/* MIDDLEWARE
  Interceptador de requisições, ele pode interomper uma requisição,
  alterar dados da requisição.
*/
const app = express();
app.use(express.json());
const projects = [];
//O middleware será configurado para ser disparado em todas as requisições.
function logRequests(request, response,next ){
  const {method, url}  = request;
  const logLabel = `[{${method.toUpperCase()}}] ${url}`; 
  console.log(logLabel);
  console.time(logLabel);
   next();
  console.timeEnd(logLabel);
} 
function validateProjectId(request,response,next){
  const {id} = request.params;

  if(!isUuid(id)){
    return response.status(400).json({ Error: 'Invalid project ID.'});
    //Nesse return sem o next o middleware interrompe a requisição.
  }
  return next();
}
//Os middleware podem ser passados como parametros para funcoes, e quantos 
// quiser.
app.use(logRequests);
app.use('/projects/:id',validateProjectId);
//Determinadoo a rota e seu retorno. response da a resposta para o frontend 
app.get('/projects', (request, response ) => {
 const { title } =  request.query;
 //montando o filtro de pesquisa para o GET
  const results = title
  ? projects.filter(project => project.title.includes(title))
  :projects;
  return response.json(results );
});
app.post('/projects', (request, response ) => {
  const {title, owner } = request.body ;

  const project  = {id: uuid(),title,owner};
  //Jogando o projeto para o final do array Projects = []
  projects.push(project);   

  return response.json(project);
});
app.put('/projects/:id', (request, response ) => {
  const { id } = request.params;  
  const {title, owner } = request.body ;
  //Função find para percorrer o array de projetos
  // project => project.id == id se os ids são iguais.
  const projectIndex = projects.findIndex(project => project.id == id);
  if(projectIndex <  0){
    return response.status(400).json({ error: 'Project not found.'})
  };

  const project = {
    id,
    title,
    owner,
  };
  projects[projectIndex] = project;
  return response.json(project);

});
  app.delete('/projects/:id', (request, response ) => {
    const { id } = request.params;  
    const projectIndex = projects.findIndex(project => project.id == id);
    if(projectIndex <  0){
      return response.status(400).json({ error: 'Project not found.'})
    };
    projects.splice(projectIndex,1);
    return response.status(204).send();
});

//Determinando a porta
//Arrow function para retornar mensagem toda vez que o servidor for ao ar.
//Inserir emoji windows+. 
app.listen(3333, () =>{
  console.log('🎈Back-end has been started🎈');
  
});
