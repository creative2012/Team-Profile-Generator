const Employee = require("./Employee");
// TODO: Write code to define and export the Engineer class.  HINT: This class should inherit from Employee.
class Engineer extends Employee {
    constructor(name, id, email, gitHub ){
        super(name, id, email)
        this.role = "Engineer";
        this.github = gitHub;
    }
    getGithub(){
        return "GitHubUser";
    }

}

module.exports = Engineer;