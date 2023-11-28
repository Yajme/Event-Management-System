# Event-Management-System

## Overview

<p>
  An online event calendar system is crucial for modern tertiary institutions to effectively communicate and engage with students. Traditional methods of disseminating information, such as newspapers and flyers, are no longer efficient due to technological advancements. An online event calendar centralizes all event and announcement information, making it easily accessible to students. Moreover, the system can personalize information delivery based on individual interests, reducing confusion and boosting participation.
</p>

## Installation

Core Feature: 
* Node JS

If you haven't installed one, install [here](https://nodejs.org/en/)

> After installing Node JS initialize node modules by executing command in VS code terminal

> Copy command below:
```npm
npm init -y
```
> For example

```npm
C:\Event-Management-System> npm init -y
```

What command do:
The npm init -y command is used to initialize a new Node.js project. The -y flag tells the npm init command to automatically accept all of the default options, which means that you will not be prompted to enter any information.

### Packages required:
+ Express
+ Express session
+ Express flash
+ body-parser
+ connect-flash
+ cookie-parser
+ cors
+ ejs
+ mysql2
+ nodemon(For developers)
+ popups

### Installation of packages
> For faster installation of packages execute the powershell command by typing the command below:

Copy Command:
```powershell
.\Installation.ps1
```

>For example

```powershell
C:\Event-Management-System> .\Installation.ps1
```

Alternatively you can manually copy and paste the actual installation command below:
```bash
npm install express express-session express-flash body-parser connect-flash cookie-parser cors ejs mysql2 nodemon popups
```




## Usage

> To run the web application simply run it using terminal command below:<br><br>

`If you are using windows`

```powershell
.\start.ps1
```

**For example**
```powershell
C:\Event-Management-System>.\start.ps1
```

Alternatively you can run the web app by typing:<br>
`If you are using Linux/Mac`
```
nodemon index.js
```
For example
```sh
$ nodemon index.js
```

Just make sure you are in the directory of the repository before executing the command.

### Accessing the app
(Local server only!) <br>
You can directly access the web application by typing `localhost:8080/admin`
![image](https://github.com/Yajme/Event-Management-System/assets/88352665/cae5935f-55e3-4f60-a534-a8270f19c5ea)

If you want your users to access the web app, you can direct them to `localhost:8080/student`

## Developers
* [Yajme](https://github.com/Yajme)
* [llenny18](https://github.com/llenny18)
* [AliHaruto](https://github.com/AliHaruto)
* [DzeyEm](https://github.com/DzeyEm)
