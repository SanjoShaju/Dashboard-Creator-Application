# Dashboard Creator Application #
This is a Electron JS Application that lets users create customized dashboards for their data.
## How to set up ##
- Just run Setup.exe to install the application on you computer.
> Note -> This setup is only for windows 64 bit version. Also I haven't made certificates for the application, so windows defender will show Security warnings.
- or in Sorce_code folder npm command to start the application
```sh
$ npm start
```
------
## Source code ##
The source code contains :
- __main.js__ - Electron apps main file. This is what calls the other html files.
- __src/index.html__ - The starting page of the application.
- __open_new.html__ - Upload new data or load previously created dashboards.
- __tools_tab.html__ - Tools menu which includes options to create charts, tables, notes etc.

## Dependencies or  open-source frameworks used ##
- Electron JS
- SQLite
- Bootstarp
- jQuery
- Chart JS