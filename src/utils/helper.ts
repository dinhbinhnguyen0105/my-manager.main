import * as fs from 'fs';
import * as path from 'path';

// ...existing code...

const configPath = path.join(__dirname, "..", "bin", "config.txt");

function readConfigFile(keyword: string): string | null {
    try {
        const data = fs.readFileSync(configPath, 'utf8');
        const lines = data.split('\n');
        for (const line of lines) {
            const [key, value] = line.split('=');
            if (key && value && key.trim() === keyword) {
                return value.trim().replace(/"/g, '');
            }
        }
        return null;
    } catch (err) {
        console.error(`Error reading config file: ${err}`);
        return null;
    }
}

export {
    readConfigFile,
};