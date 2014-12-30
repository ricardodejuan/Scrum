Scrum = MEAN.JS + Socket.IO
===

## Prerequisites
* Node.js - [Download & Install Node.js](http://www.nodejs.org/download/) and the npm package manager.
* MongoDB - [Download & Install MongoDB](http://www.mongodb.org/downloads), and make sure it's running on the default port (27017).
* Bower -
```
$ npm install -g bower
```
* Grunt - 
```
$ sudo npm install -g grunt-cli
```

## Quick Install
```
$ npm install
```
```
$ bower install
```

## Running Your Application
```
$ grunt
```

## Running in a secure environment
To run your application in a secure manner you'll need to use OpenSSL and generate a set of self-signed certificates. Unix-based users can use the following command:
```bash
$ sh ./scripts/generate-ssl-certs.sh
```
## Running Your Application in secure environment
```
$ grunt secure
```

## Live Example
[https://scrumagile.herokuapp.com](https://scrumagile.herokuapp.com).
