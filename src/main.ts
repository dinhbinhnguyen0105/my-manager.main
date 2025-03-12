import { app, BrowserWindow } from "electron";
import userIPCs from "./IPCs/user";
import path from "path";
import settingIPCs from "./IPCs/setting";
import actionIPCs from "./IPCs/action";

const createMainWindow = (): void => {
    const preloadPath = path.resolve(app.getAppPath(), "dist-electron", "preload.js");
    const mainWindow = new BrowserWindow({
        title: "My manager",
        width: 1200,
        height: 800,
        webPreferences: {
            preload: preloadPath,
            contextIsolation: true,
            nodeIntegration: false,
            enableBlinkFeatures: "",
        },
        show: false
    });

    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL("http://localhost:5173/");
    } else {
        console.log({ appPath: app.getAppPath() });
        mainWindow.loadFile("./dist-renderer/index.html");
    }
    mainWindow.on("ready-to-show", () => mainWindow.show());
    mainWindow.webContents.on("did-fail-load", (event, errorCode, errorDescription) => {
        console.error("Cannot load script:", errorDescription);
    });

}

app.whenReady().then(() => {
    createMainWindow();
    app.on("activate", () => (BrowserWindow.getAllWindows().length === 0 && createMainWindow()));
    app.on("window-all-closed", () => process.platform !== "darwin" && app.quit());
    userIPCs();
    settingIPCs();
    actionIPCs();
});