import fs from 'fs';
import path from 'path';

const createRequiredDirectories = () => {
    const dirs = [
        'public/uploads',
        'logs'
    ];

    dirs.forEach(dir => {
        const dirPath = path.join(process.cwd(), dir);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
            console.log(`Created directory: ${dirPath}`);
        }
    });
};

export default createRequiredDirectories;
