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
        validate: (name) => {
            if(name.toString().length < 1){
                return 'Please enter a value';
            } return true;
        },
        when: (answers) => runType != 1 && answers.type != 'Finish building the team'
    },
    {
        type: 'input',
        message: "What is the Managers name?",
        name: 'name',
        validate: (name) => {
            if(name.toString().length < 1){
                return 'Please enter a value';
            } return true;
        },
        when: () => runType === 1
    },
    {
        type: 'input',
        message: "What is their ID?",
        name: 'id',
        validate: (id) => {
            if(id.toString().length < 1){
                return 'Please enter a value';
            } return true;
        },
        when: (answers) => answers.type != 'Finish building the team'
    },
    {
        type: 'input',
        message: "What is their Email Address?",
        name: 'email',
        validate: (email) => {
            // Regex mail check (return true if valid mail)
            if (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
                return true;
            } return 'please enter a valid email address';

        },
        when: (answers) => answers.type != 'Finish building the team'
    },
    {
        type: 'input',
        message: "What school did they attend?",
        name: 'school',
        validate: (school) => {
            if(school.toString().length < 1){
                return 'Please enter a value';
            } return true;
        },
        when: (answers) => answers.type === 'Add Intern'
    },
    {
        type: 'input',
        message: "What is their github user name?",
        name: 'github',
        validate: (github) => {
            if(github.toString().length < 1){
                return 'Please enter a value';
            } return true;
        },
        when: (answers) => answers.type === 'Add Engineer'
    },
    {
        type: 'input',
        message: "What is their office number?",
        name: 'number',
        validate: (number) => {
            if (isNaN(number) || number.toString().length < 11) {
                return 'Please enter a valid phone number';
            } return true;

        },
        when: () => runType === 1
    },

];
const teamMembers = {

    data: [],
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
            this.data.push(teamMember);
        }


    }

}
function promptUser() {
    //ask user a set of questions and get responses
    return inquirer.prompt(questions).then((answers) => {
        if (runType === 1) {
            answers.type = 'Manager';
        }
        if (answers.type === 'Finish building the team') {
            teamMembers.createTeamMember(answers.type, answers);
            return true;
        } else {
            runType === 1 ?  runType = 2 : '';
            teamMembers.createTeamMember(answers.type, answers);
            console.log(
                `\n----------------------
                \nTeam Menu
                \n----------------------\n`);
            return promptUser();
        }
    });
}

function init() {
    console.log(
        `\n----------------------
    \nLets Build your Team!
    \n----------------------\n`),
        promptUser().then((complete) => {
            if (complete) {
                let html = render(teamMembers.data);
                //write html file
                fs.writeFile(outputPath, html, err => {
                    if (err) {
                        console.error(err);
                    } else {
                        //alert all went well
                        console.log(`Your Page has Been Created`);
                    }
                });

            }
        });
}
// function call to initialize program
init();