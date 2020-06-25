const express = require('express');
const fs = require('fs');
const util = require('util');

const promisify = util.promisify;


const router = express.Router();
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

router.post('/', async(req, res)=>{
  try {
      let grade = req.body;
      const data = JSON.parse(await readFile(global.__filename, 'utf8'));
      grade = { id: data.nextId++, ...grade, timestamp: new Date() };
      data.grades.push(grade);
      await writeFile(global.__filename, JSON.stringify(data));

      res.end();
      logger.info(`POST /grade - " ${JSON.stringify(grade)}`);
  } catch (error) {
      res.status(400).send({error: error.message});
  }  
});

module.exports = router;