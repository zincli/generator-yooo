/**
 * @author 锂锌 <zinc.lx@alibaba-inc.com>
 */
var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
    constructor: function () {
        generators.Base.apply(this, arguments);

        this.config.save();
    },

    initializing: function () {

    },

    prompting: function () {
        var done = this.async();

        var prompts = [{
            type    : 'input',
            name    : 'name',
            message : 'What is your name?'
        }];

        this.prompt(prompts, function (answers) {

            this.log('Hello, ' + answers.name);

            done();
        }.bind(this));
    },

    writing: function () {

    }
});