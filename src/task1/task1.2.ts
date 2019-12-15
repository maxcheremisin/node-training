import path from 'path';
import csv from 'csvtojson';
import {promises as fs, createReadStream, existsSync} from 'fs';

console.log('task 1.2');

const pathToTxt = path.join(__dirname, './assets/task1/task1.2.txt');
const pathToCsv = path.join(__dirname, './assets/task1/task1.2.csv');

function serializeCsvLine(value: unknown) {
    return `${JSON.stringify(value)}\n`;
}

const converter = csv({needEmitAll: false});

const csvStream = createReadStream(pathToCsv);

csvStream.on('error', error => console.error(error));

(async () => {
    try {
        if (existsSync(pathToTxt)) {
            await fs.unlink(pathToTxt);
            console.log('File successfully deleted');
        }

        await converter.fromStream(csvStream).subscribe(chunk => fs.appendFile(pathToTxt, serializeCsvLine(chunk), 'utf-8'));
        console.log('File successfully written');
    } catch (error) {
        console.error(error);
    }

    process.exit();
})();
