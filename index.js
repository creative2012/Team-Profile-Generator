const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./src/page-template.js");

let id = 1;

// TODO: Write Code to gather information about the development team members, and render the HTML file.
// array of questions for user
const questions = [
    {
        type: 'list',
        message: "Choose an employee Type:",
        name: 'type',
        choices: ['Intern', 'Engineer'],
        when:  () => id > 1 
    },
    {
        type: 'input',
        message: "What is their name?",
        name: 'name',
        when:  () => id > 1 
    },
    {
        type: 'input',
        message: "What is the Managers name?",
        name: 'name',
        when:  () => id === 1 
    },
    {
        type: 'input',
        message: "What is their Email Address",
        name: 'email'
    },
    {
        type: 'input',
        message: "What school did they attend?",
        name: 'school',
        when: (answers) => answers.type === 'Intern'
    },
    {
        type: 'input',
        message: "What is their github user name?",
        name: 'github',
        when: (answers) => answers.type === 'Engineer'
    },
    {
        type: 'input',
        message: "What is their office number?",
        name: 'number',
        when:  () => id === 1 
    },
    {
        type: "confirm",
        message: "Would you like to add another team member?",
        name: 'addingMoreMembers',
        when:  () => id > 1 

    },

];
const getTeamMembers = {

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
                if(id == 1){
                    answers.type = 'Manager';
                    answers.addingMoreMembers = true;
                    console.log('Please add members of the Team:')
                }
                 answers.id = id;
                 if (!answers.addingMoreMembers) {
                    this.createTeamMember(answers.type, answers);
                    console.log(this.allMembers)
                    return answers;
                   } else {
                    this.createTeamMember(answers.type, answers);
                    id = id + 1;
                    return this.data();
                   }
             });
     
     },
     createTeamMember(type, data){

        let teamMember = false;

        if(type === 'Manager'){
            teamMember = new Manager(data.name, data.id, data.email, data.number);
        }
        if(type === 'Intern'){
            teamMember = new Intern(data.name, data.id, data.email, data.school);
        }
        if(type === 'Engineer'){
            teamMember = new Engineer(data.name, data.id, data.email, data.github);
        }

        if(teamMember){
            this.allMembers.push(teamMember);
        }
        

     }

}


// function getTeamMemberData(id) {
//    return inquirer
//     //ask user a set of questions and get responses
//         .prompt(questions)
//         .then((answers) => {
//             answers.id = id
//             if (!answers.addingMoreMembers) {
//                 return answers;
                
//               } else {

//                 return getTeamMemberData(id++);
//               }
//         });

// }

// function call to initialize program
getTeamMembers.welcomeMsg;
getTeamMembers.data(id);