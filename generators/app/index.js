/**
 * @author 锂锌 <zinc.lx@alibaba-inc.com>
 */
var generators = require('yeoman-generator');
var fs = require('fs');

var saveAnswers = function (answers, data) {
    for(var k in answers){
        if(answers.hasOwnProperty(k)){
            data[k] = answers[k];
        }
    }

    if(answers.name){
        data.name = (answers.name.match(/^generator-/) ? '' : 'generator-') +
            answers.name;
    }
};

module.exports = generators.Base.extend({
    constructor: function () {
        generators.Base.apply(this, arguments);

        this.option('generators', {
            desc: 'if wrap main and sub generator in generators directory',
            type: Boolean,
            defaults: true
        });

        this.generatorsPath = this.options.generators ? 'generators/' : '';

        //save status
        this.data = {
            hasPackageJson: false
        };

        this.config.save();
        this.log('yooo');
    },

    initializing: function () {
        this.log('checking...');

        this.data.hasPackageJson = fs.existsSync(this.destinationPath('package.json'));
        this.log((this.data.hasPackageJson ? '' : 'not ') + 'found package.json.');
    },
    
    prompting: function () {
        var done = this.async();

        var prompts = [{
            type    : 'confirm',
            name    : 'isFirstTime',
            message : 'Is this your first time using yo?'
        }, {
            type    : 'rawlist',
            name    : 'tryRawlist',
            message : '请选择你要使用的语言',
            choices : ['中文', 'English', '日本语', '维语'],
            default : 1
        }];

        var promptsForPackageJson = [{
            type    : 'input',
            name    : 'name',
            message : 'Your generator\'s name, will be auto prefixed with "generator-"',
            default : this.appname.replace(/\s+/g, '-'),
            validate: function (value) {
                return !/\s+/.test(value) || 'could\'nt have blanks in project name'
            }
        },{
            type: 'input',
            name: 'version',
            message: 'Your generator\'s version',
            default: '0.1.0',
            validate: function (value) {
                return /^(\d+\.){2}\d+$/.test(value) || 'version should match major.minor.patch';
            }
        }, {
            type: 'input',
            name: 'desc',
            message: 'Your generator\'s description',
            default: 'a learning demo for yo'
        }, {
            type: 'input',
            name: 'author',
            message: 'Your contact information as an author'
        }];

        if(!this.data.hasPackageJson){
            Array.prototype.unshift.apply(prompts, promptsForPackageJson);
        }

        this.prompt(prompts, function (answers) {
            saveAnswers(answers, this.data);

            this.log('your project name is ' + this.data.projectName);
            this.log('this is ' + (answers.isFirstTime ? '' : 'not ') + 'your first time using yo, ok, I\'m just asking');

            done();
        }.bind(this));
    },

    writing: {
        packageJSON: function () {
            if(!this.data.hasPackageJson){
                this.template('package.json', 'package.json', this.data);
            }
        },
        indexJs: function () {
            this.fs.copy(this.templatePath('index.js'), this.destinationPath(this.generatorsPath + 'app/index.js'));
        }
    }
});