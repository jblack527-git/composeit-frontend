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

        // Get the JAR path — dev vs packaged differ
        const jarPath = app.isPackaged
            ? path.join(process.resourcesPath, 'static', 'backend-0.0.1-SNAPSHOT.jar')
            : path.join(__dirname, '..', 'backend', 'build', 'libs', 'backend-0.0.1-SNAPSHOT.jar');
        console.log('JAR Path:', jarPath);

        if (!fs.existsSync(jarPath)) {
            throw new Error(`JAR not found at: ${jarPath}`);
        }
        console.log('JAR file found, size:', fs.statSync(jarPath).size, 'bytes');

        console.log('Starting Java process with command: java -jar', jarPath);
        serverProcess = spawn('java', ['-jar', jarPath], {
            stdio: ['pipe', 'pipe', 'pipe']
        });

        serverProcess.stderr.on('data', (data) => {
            console.error('Server error:', data.toString());
        });

        serverProcess.on('error', (err) => {
            throw new Error(`Failed to start server: ${err.message}`);
        });

        // Wait for Spring Boot to log the port it bound to.
        // With server.port=0 the OS picks a free port; Spring Boot announces it as:
        // "Tomcat started on port 54321 (http) ..."
        const port = await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('Server did not start within 30 seconds'));
            }, 30000);

            serverProcess.stdout.on('data', (data) => {
                const output = data.toString();
                console.log('Server output:', output);
                const match = output.match(/Tomcat started on port[s]?\s+(\d+)/);
                if (match) {
                    clearTimeout(timeout);
                    resolve(parseInt(match[1], 10));
                }
            });

            serverProcess.on('exit', (code) => {
                clearTimeout(timeout);
                reject(new Error(`Server exited unexpectedly with code ${code}`));
            });
        });

        console.log(`Server ready on port ${port}`);
        return port;

    } catch (err) {
        showFatalError('Server Start Error', err);
        return null;
    }
}

function createWindow(port) {
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

    mainWindow.loadURL(`http://localhost:${port}`);
}

app.whenReady().then(async () => {
    try {
        console.log('Electron app is ready');
        const port = await startServer();
        if (port) {
            console.log(`Server started on port ${port}, creating window`);
            createWindow(port);
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