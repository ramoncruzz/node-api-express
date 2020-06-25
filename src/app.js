const express = require('express');
const fs = require('fs');
const util = require('util');
const winston = require('winston');
const gradesRouter = require('./grades');

const app = express();
const exists = util.promisify(fs.exists);
const writeFile = util.promisify(fs.writeFile);

const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({level, message, label, timestamp})=>{
    return `${timestamp} # [${label}] # ${level}: ${message}`;
});
global.fileName = 'grades.json';

app.use(express.json()); // informa que o expresse deve reconhecer as requisicoes que chegarem como objeto JSON
app.use(express.static('public'));
app.use('/images', express.static('public'));
app.use('/grade', gradesRouter);

 global.logger = winston.createLogger({
    level: 'silly',
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({filename: 'logs/grades-control-api.log'})
    ],
    format: combine(
        label({label: 'grades-control-api'}),
        timestamp(),
        myFormat
    )
});

const init =async () =>{
try {
        const fileExists = await exists(global.fileName);
        if(!fileExists){
            const initalJson ={
                nextId: 1,
                grades: []
            };
            await writeFile(global.fileName, JSON.stringify(initalJson));
        }
        global.logger.info('Api iniciada');
    } catch (error) {
        logger.error(error);
    }
}

app.listen(3030, init);
