const express = require('express');
const courses = require('../public/data/courses20-21.json');


const app = express.Router();

function digitsOf(s){
  let i=0;
  const ds="0123456789"
  for (i=0; i<s.length; i++){
    if (!ds.includes(s[i])) {
      break;
    } 
  }
  return s.slice(0,i);
}
function cleanCourses(){
  for (c of courses){
    let n = c.coursenum;
    let m = digitsOf(c.coursenum);
    let a = n.slice(m.length);
    c.coursenum=m;
    c.suffix=a;
  }
}

cleanCourses();

const coursesBySubject={};

function initDictionaries() {
  for (c of courses){
    if (c.independent_study){
      continue;
    }
    let cbs = coursesBySubject[c['subject']];
    let instr = c['instructor'];
    let email = instr?instr[2]:'noemail';
    let cbe = coursesByEmail[email]
    if (cbs) {
      cbs = cbs.push(c);
    } else {
      coursesBySubject[c['subject']] = [c];
    }
    if (cbe) {
      cbe = cbe.push(c);
    } else {
      coursesByEmail[email] = [c];
    }
  }
}

let coursesByEmail={}


initDictionaries();
for (s in coursesByEmail){
  //console.log(s+" "+coursesByEmail[s].length);
}

/* GET home page. */
app.get('/', function(req, res, next) {
  res.render('index');
});

app.get('/courses',
  (req,res,next) => {
    try{
      console.log('num courses='+courses.length);
      res.json(courses[1000]);
    } catch(e){
      next(e);
    }
  }
)

app.get('/coursesBySubject/:subject',
  (req,res,next) => {
    try{
      res.json(coursesBySubject[req.params.subject]);
    } catch(e){
      next(e);
    }
  }
)

app.get('/coursesByEmail/:email',
  (req,res,next) => {
    try{
      res.json(coursesByEmail[req.params.email+"@brandeis.edu"]);
    } catch(e){
      next(e);
    }
  }
)

module.exports = app;
