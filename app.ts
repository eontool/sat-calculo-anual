import * as fs from 'fs';
import * as xmlquery from 'xml-query';
import * as xmlreader from 'xml-reader';
import { promisify } from 'util';

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const add = (a, b) => a + b;
let resultados = [];

const readFiles = async () => {
  try {
    const files = await readdir(__dirname + '/files');
    return files;
  } catch{
    console.error('No files found!');
  }
}

readFiles().then((files) => {
  Promise.all(files.map(async (fileName) => {
    const content = await readFile(`${__dirname}/files/${fileName}`, 'utf8');
    const parsed = xmlreader.parseSync(content);
    impuestosRetenidos(parsed);
  })).then(() => {
    console.log('Total impuestos retenidos: ' + resultados.reduce(add));
  });
});

function impuestosRetenidos(parsed) {
  let impuesto = xmlquery(parsed).find(`cfdi:Impuestos`).attr()['totalImpuestosRetenidos'];
  if (impuesto) {
    resultados.push(Number(impuesto));
  }
  else {
    impuesto = xmlquery(parsed).find('nomina12:Deducciones').attr()['TotalImpuestosRetenidos'];
    resultados.push(Number(impuesto));
  }
}
