const electron = require("electron");
const url = require("url");
const path = require("path");

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addItemWindow;

//set ENV
process.env.NODE_ENV = 'production';

//Listen for app to be ready
app.on("ready", () => {
  // create a new windows object
  mainWindow = new BrowserWindow({});
  // loading the html file in our main window
  mainWindow.loadURL(
    url.format({
      pathname: path.join(
        "/run/media/basanta/Backup/Projects & Documents/Electron projects/shopping-list",
        "mainWinow.html"
      ),
      protocal: "file:",
      slashes: true,
    })
  );

  // app listen to close
  app.on("closed", () => {
    app.quit();
  });

  //Building a menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  // Insert the menu
  Menu.setApplicationMenu(mainMenu);
});

// Handle create add window
const createAddWindow = () => {
  // create a new window
  addItemWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: "Add Shopping List Item",
  });

  addItemWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "addWindow.html"),
      protocal: "file:",
      slashes: true,
    })
  );

  // Garbage Collection handle
  addItemWindow.on("closed", () => {
    addItemWindow = null;
  });
};

//catch item:add
ipcMain.on("item:add", (event, item) => {
  mainWindow.webContents.send("item:add", item);
  addItemWindow.close();
});

//creating a menu Template
const mainMenuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "Add Item",
        click: () => {
          createAddWindow();
        },
      },
      {
        label: "Clear Items",
        click: () => {
            mainWindow.webContents.send('item:clear');
        }
      },
      {
        label: "Quit",
        accelerator: process.platform == "linux" ? "Ctrl+Q" : "Command+Q",
        click: () => {
          app.quit();
        },
      },
    ],
  },
];

// If mac, add empty object to menu
if (process.platform == "darwin") {
  mainMenuTemplate.unshift({});
}

// Add developer tools only when not in production
if (process.env.NODE_ENV !== "production") {
  mainMenuTemplate.push({
    label: "Developer Tools",
    submenu: [
      {
        label: "Toggle DevTools",
        accelerator: process.platform == "darwin" ? "Command+I" : "Ctrl+I",
        click: (item, focusedWindow) => {
          focusedWindow.toggleDevTools();
        },
      },
      {
        role: "reload",
      },
    ],
  });
}
