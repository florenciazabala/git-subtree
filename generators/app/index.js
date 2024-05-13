"use strict";
const Generator = require("yeoman-generator");
const path = require('path');
const fs = require("fs");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.configOptions = this.options.configOptions || {};
  }

  initializing() {
    const readFile = function (file) {
      return fs.readFileSync(file).toString();
    };
    this.log(readFile('resources/banner.txt'));
    this.log("Generating Spring Boot Application");
  }

  prompting() {
    const prompts = [
      {
        type: "string",
        name: "appName",
        message: "What is the application name?-",
        default: "myservice"
      },
      {
        type: "list",
        name: "appType",
        message: "Do you want to use WebMVC or WebFlux?",
        choices: [
          {
            value: "webmvc",
            name: "WebMVC"
          },
          {
            value: "webflux",
            name: "WebFlux"
          }
        ],
        default: "webmvc"
      }
    ];

    return this.prompt(prompts).then(answers => {
      Object.assign(this.configOptions,answers);
    });
  }

  writing() {

    this.fs.copy(
      path.join(__dirname, '../../node_modules/gateway-ip-whitelist/**'),
      this.destinationPath('seed')
    );

    this.fs.copyTpl(
      this.templatePath("../../../seed/templates/pom.xml.tpl"),
      this.destinationPath("seed/pom.xml"),
      {
        appName: this.configOptions.appName,
        appType: this.configOptions.appType
      }
    );
    
  }

  end() {
    this.log(`Application ${this.appName} generated successfully`);
  }
};