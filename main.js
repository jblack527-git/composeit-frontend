const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

let mainWindow;
let serverProcess;

function showFatalError(title, error) {
    console.error(title, error);
    dialog.showErrorBox(title, error.toString());
    if (serverProcess) {
        serverProcess.kill();
    }
    app.quit();
}

async function startServer() {
    try {
        console.log('Starting server...');
        
        // Get the JAR path
        const jarPath = path.join(process.resourcesPath, 'static', 'backend-0.0.1-SNAPSHOT.jar');
        console.log('JAR Path:', jarPath);

        if (!fs.existsSync(jarPath)) {
            throw new Error(`JAR not found at: ${jarPath}`);
        }
        console.log('JAR file found, size:', fs.statSync(jarPath).size, 'bytes');

        // Start the server process
        console.log('Starting Java process with command: java -jar', jarPath);
        serverProcess = spawn('java', ['-jar', jarPath], {
            stdio: ['pipe', 'pipe', 'pipe']
        });

        serverProcess.stdout.on('data', (data) => {
            console.log('Server output:', data.toString());
        });

        serverProcess.stderr.on('data', (data) => {
            console.error('Server error:', data.toString());
        });

        serverProcess.on('error', (err) => {
            throw new Error(`Failed to start server: ${err.message}`);
        });

        // Wait a few seconds for the server to start
        await new Promise(resolve => setTimeout(resolve, 3000));
        return true;

    } catch (err) {
        showFatalError('Server Start Error', err);
        return false;
    }
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.loadURL('http://localhost:8080');
}

app.whenReady().then(async () => {
    try {
        console.log('Electron app is ready');
        const serverStarted = await startServer();
        if (serverStarted) {
            console.log('Server started, creating window');
            createWindow();
        }
    } catch (err) {
        showFatalError('Startup Error', err);
    }
});

app.on('window-all-closed', () => {
    console.log('All windows closed, cleaning up...');
    if (serverProcess) {
        serverProcess.kill();
    }
    app.quit();
});

process.on('uncaughtException', (error) => {
    showFatalError('Uncaught Exception', error);
});

process.on('unhandledRejection', (error) => {
    showFatalError('Unhandled Promise Rejection', error);
});