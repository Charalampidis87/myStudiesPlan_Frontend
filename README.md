# myStudiesPlan_Frontend
**myStudiesPlan is an Web application, designed for personalized student support in designing and following their curriculum. The application implements functions such as course selection while respecting curriculum constraints, major and specialization selection scenarios, exams, grades and GPA.**
>myStudiesPlan operates at [mystudiesplan.di.uoa.gr](https://mystudiesplan.di.uoa.gr) for [Department of Informatics and Telecommunications](https://www.di.uoa.gr) of [National and Kapodistrian University of Athens](https://www.uoa.gr).

![Welcome Screen](https://github.com/Charalampidis87/myStudiesPlan_Frontend/blob/main/Assets/Welcome_Screen.png)
![Main Screen](https://github.com/Charalampidis87/myStudiesPlan_Frontend/blob/main/Assets/Main_Screen.png)

## Pre-requirements

To **compile** this project, you will need:
- [Node.js](https://nodejs.org/en/)
- npm
- [Angular](https://angular.io/guide/setup-local)

	**Note:** When installing Node.js, npm is automatically installed too.

To **run** this project, you will need:
- [Apache Tomcat Web server](https://tomcat.apache.org/download-90.cgi) (`Tomcat 9` or other web server engine)

**Optional**
- [myStudiesPlan_Backend](https://github.com/Charalampidis87/myStudiesPlan_Backend) (Backend service is optional but the majority of Frontend functions require it)
- [Certbot](https://certbot.eff.org/instructions) (Automate Let's Encrypt TLS Certificate issuance, installation and renewal)

## Compiling and starting the server
Run `ng build ---prod` to produce `/mystudiesplan-web/mystudiesplan-web_export/*.*`.
Feed `*.*` files to web server engine to run myStudiesPlan web app frontend service.
___
> You can find full documentation [here](https://github.com/Charalampidis87/myStudiesPlan_Frontend/blob/main/Assets/myStudiesPlan_Thesis.pdf) and [here](https://pergamos.lib.uoa.gr/uoa/dl/object/3294663) (*available only in **Greek***)