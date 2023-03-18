// Requiring modules
const express = require('express')
const app = express();
const mongoose = require("mongoose");
const bodyParser = require('body-parser')
app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

// Connecting to database
main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/todolistdbs',{ useNewUrlParser: true, useUnifiedTopology: true,});
}

// List Model Schema
const List = new mongoose.Schema({
    task_name : String,
    task_completion : Boolean,
    task_date : Date
})

// Creating Model object
const ToDoList = mongoose.model("todolistdbs", List)


//To serve static files such as images, CSS files, and JavaScript files
app.use(express.static(__dirname + '/public'));

// Set the view engine to ejs
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    // Render Date
    let newdate = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    let today = newdate.toLocaleDateString('en-US', options);

    // Render Database Items
    try{
        const list = await ToDoList.find({});
        res.render('index', {date:today, list:list});
    } catch(err){
        console.log(err);
    }
    
})
app.post('/', (req, res) => {
    let task = req.body.name;
    // let id = req.User._id;
    let currentDate= new Date;
    
    if(task.length > 0){
        let newTask = new ToDoList({task_name: task, task_date: currentDate ,task_completion: false})
        newTask.save();
        res.redirect('/');
    }
})
app.listen(3000, function(){
    console.log("Server is running on port 3000")
})