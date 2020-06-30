const express = require('express');
const { uuid, isUuid } = require('uuidv4');
const { request } = require('express');

const app = express();

app.use(express.json());

const port = 3333;

const projects = [];

function logRequests (req, res, next) {
  const { method, url } = req;

  const logLabel = `[${method.toLocaleUpperCase()}] ${url}`

  console.log(logLabel);

return next();
};

function validateProjectId (req, res, next) {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ error: 'ID invalido!' }) 
  }
return next();
};

app.use(logRequests);
app.use('/projects/:id', validateProjectId);

app.get('/', (req, res) => json({message: 'Hello World!'}));

app.get('/projects', (req, res) => {
  const { title } = req.query

const results = title ? projects.filter(project => project.title.includes(title)) : projects;
  
res.json(results);
});

app.post('/projects', (req, res) => {
  const { title, omwer } = req.body

  const project = { id: uuid(), title, omwer };

  projects.push(project);
  
  return res.json(project);
});

app.put('/projects/:id', (req, res) => {
  const { id } = req.params;
  const { title, owner } = req.body

  const projectIndex = projects.findIndex(project =>  project.id === id);
  if (projectIndex < 0 ) {
    return res.status(400).json({ error: 'Projeto não encontrado!' })
  }
  const project = {
    id,
    title,
    owner,
  }

  projects[projectIndex] = project
  
  res.status(200).json(project);
});

app.delete('/projects/:id', (req, res) => {
  const { id } = req.params;
  const projectIndex = projects.findIndex(project =>  project.id === id);

  if (projectIndex < 0 ) {
    return res.status(400).json({ error: 'Projeto não encontrado!' })
  }
  
  projects.splice(projectIndex, 1);

  res.status(204).send();
});

app.listen(port, () => {
  console.log('back-end started!')
});