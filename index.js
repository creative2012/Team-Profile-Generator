const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./src/page-template.js");

//intial runType of 1 allows the user to select a manager for the team,
//after inital run the runType will change to 2 and allow the user to add other team member types
let runType = 1;

// TODO: Write Code to gather information about the development team members, and render the HTML file.
// array of questions for user
const questions = [
    {
        type: 'list',
        message: "Choose an option:",
        name: 'type',
        choices: ['Add Intern', 'Add Engineer', 'Finish building the team'],
        when: () => runType != 1
    },
    {
        type: 'input',
        message: "What is their name?",
        name: 'name',
        when: (answers) => runType != 1 && answers.type != 'Finish building the team'
    },
    {
        type: 'input',
        message: "What is the Managers name?",
        name: 'name',
        when: () => runType === 1
    },
    {
        type: 'input',
        message: "What is their ID?",
        name: 'id',
        when: (answers) => answers.type != 'Finish building the team'
    },
    {
        type: 'input',
        message: "What is their Email Address?",
        name: 'email',
        when: (answers) => answers.type != 'Finish building the team'
    },
    {
        type: 'input',
        message: "What school did they attend?",
        name: 'school',
        when: (answers) => answers.type === 'Add Intern'
    },
    {
        type: 'input',
        message: "What is their github user name?",
        name: 'github',
        when: (answers) => answers.type === 'Add Engineer'
    },
    {
        type: 'input',
        message: "What is their office number?",
        name: 'number',
        when: () => runType === 1
    },

];
const  getTeamMembers = {

    welcomeMsg: console.log(
        `\n----------------------
        \nLets Build your Team!
        \n----------------------\n`),
    allMembers: [],
    data() {
        return inquirer
            //ask user a set of questions and get responses
            .prompt(questions)
            .then((answers) => {
                if (runType === 1) {
                    answers.type = 'Manager';
                }
                if (answers.type === 'Finish building the team') {
                    this.createTeamMember(answers.type, answers);
                    console.log(this.allMembers);
                } else {
                    console.log(
                        `\n----------------------
                        \nTeam Menu
                        \n----------------------\n`);
                    runType = 2;
                    this.createTeamMember(answers.type, answers);
                    return this.data();
                }
            });

    },
    createTeamMember(type, data) {

        let teamMember = false;

        if (type === 'Manager') {
            teamMember = new Manager(data.name, data.id, data.email, data.number);
        }
        if (type === 'Add Intern') {
            teamMember = new Intern(data.name, data.id, data.email, data.school);
        }
        if (type === 'Add Engineer') {
            teamMember = new Engineer(data.name, data.id, data.email, data.github);
        }

        if (teamMember) {
            this.allMembers.push(teamMember);
        }


    }

}

// function call to initialize program
getTeamMembers.welcomeMsg;
getTeamMembers.data();