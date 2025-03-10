import { app, BrowserWindow } from "electron";
import userIPCs from "./IPCs/user";

const createMainWindow = (): void => {
    const mainWindow = new BrowserWindow({
        title: "My manager",
        width: 1200,
        height: 800,
        webPreferences: {
            preload: __dirname + "/preload.js",
            contextIsolation: false,
            nodeIntegration: false,
            enableBlinkFeatures: "",
        },
        show: false
    });

    console.log(process.env.NODE_ENV);

    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL("http://localhost:5173/");
    } else {
        console.log({ appPath: app.getAppPath() });
        mainWindow.loadFile("./dist-renderer/index.html");
    }
    mainWindow.on("ready-to-show", () => mainWindow.show());
}

app.whenReady().then(() => {
    createMainWindow();
    app.on("activate", () => (BrowserWindow.getAllWindows().length === 0 && createMainWindow()));
    app.on("window-all-closed", () => process.platform !== "darwin" && app.quit());
    userIPCs();
});