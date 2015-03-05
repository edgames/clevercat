// sample callback 
var info;

function foo(data){
    console.log(data);
    info = data;
}

//var SERVER_HOST = "http://techcafe-server.herokuapp.com"
var SERVER_HOST = "http://ltool.qatar.cmu.edu:3333";
var initObj = {};

/***************************** API Calls ************************************/

function init(callback, developerId, gameId){

    // If the client is signed in as a student, the assignment and student ID for the session will be 
    // retrieved from the current page URL, http://......?asstId=...&studentId=...., which is set 
    // by the student portal when it redirects to the game. 
    // If the testing flag is set to true, a test assignment/student set will be retrieved from 
    // the database for the session.
    var query = parseQueryString(window.location.search.substring(1));
    var asstId = query.asstId;
    var studentId = query.studentId;

    if (developerId === undefined) {
        alert("Developer ID not provided to init, aborting.");
        return;
    }
    if (gameId === undefined) {
        alert("Game ID not provided to init, aborting.");
        return;
    }

    $.ajax({
        type: "get",
        url: SERVER_HOST + "/init",
        data : {
            asstId : asstId,
            gameId : gameId,
            studentId : studentId,
            developerId: developerId
        },
        xhrFields : {
            withCredentials : true
        },
        success: function (data) {
          if (data !== undefined && data.initObj !== undefined) {
              var resources = data.initObj.resources;
              for (var resource in resources) {
                  if (resources.hasOwnProperty(resource)) {
                      resources[resource].url = makeResourceDataUrl(resources[resource].resourceDataId);
                  }
              }
              initObj = data.initObj;
          }
          callback(data);
        }
    });


    // From http://www.joezimjs.com/javascript/3-ways-to-parse-a-query-string-in-a-url/
    function parseQueryString (queryString){
        var params = {}, queries, temp, i, l;
     
        // Split into key/value pairs
        queries = queryString.split("&");
     
        // Convert the array of strings into an object
        for ( i = 0, l = queries.length; i < l; i++ ) {
            temp = queries[i].split('=');
            params[temp[0]] = temp[1];
        }
     
        return params;
    }

    // Use this to construct a URL to a media resource that has been uploaded.
    function makeResourceDataUrl(resourceDataId) {
        return SERVER_HOST + "/resourcedata/" + resourceDataId;
    }
}

function addStudentAnswers(answers, timeElapsed, callback){

    if (answers === undefined ||
        !isArray(answers)) {
        console.log("Answers is not an array or undefined, answer not sent.");
        return;
    }

    for (var i = 0; i < answers.length; i++) {
        if (!isValidAnswer(answers[i])) {
            console.log("Answer not sent.");
            return;
        }        
    }

    $.ajax({
        type: "post",
        url: SERVER_HOST + "/answers",
        contentType: 'application/json',
        data: JSON.stringify({
            answers: answers,
        }),
        xhrFields : {
            withCredentials : true
        },
        success: function(data){
          callback(data);
        }
    });
}

function updateGameData(gameData, callback){

    $.ajax({
        type: "put",
        url: SERVER_HOST + "/gameData",
        contentType: 'application/json',
        data: JSON.stringify({
            gameData : {
                gameId : initObj.gameId,
                studentId : initObj.studentId,
                data: gameData
            }
        }),
        xhrFields :{
            withCredentials : true
        },
        success: function(data){
          callback(data);
        }
    });
}

function getGameData(callback) {

    $.ajax({
        type: "get",
        url: SERVER_HOST + "/gameData",
        data: {
            gameId: initObj.gameId,
            studentId : initObj.studentId,
            testing: initObj.testing
        },
        xhrFields :{
            withCredentials : true
        },
        success: function(data) {
          callback(data);
        }
    });
}

/********************************  Helpers  *************************************/

function isValidAnswer(answer) {

    var valid = true;
    console.log(answer);

    if (answer.choice === undefined || 
        !isArray(answer.choice) ||
        !validChoices(answer.choice)) {
        console.log("Answer choice not formatted correctly");
        valid = false;
    }
    if (!isHexString(answer.studentId)) {
        console.log("studentId not formatted correctly");
        valid = false;
    }
    if (!isHexString(answer.questionId)) {
        console.log("questionId not formatted correctly");
        valid = false;
    }
    if (!isHexString(answer.assignmentId)) {
        console.log("assignmentId is not formatted correctly");
        valid = false;
    }
    if (!isDate(answer.dateAttempted)) {
        console.log("dateAttempted is not formatted correctly");
        valid = false;
    }
    if (answer.correct === undefined || typeof(answer.correct) !== "boolean") {
        console.log("correct not formatted correctly");
        valid = false;
    }
    if (answer.timeTaken === undefined || typeof(answer.timeTaken) !== "number") {
        console.log("timeTaken not formatted correctly");
        valid = false;
    }

    return valid;

    function isHexString(hs) {
        return (hs !== undefined) &&
               (typeof(hs) === "string") && 
               (!isNaN(parseInt(hs, 16))) &&
               hs.length === 24;
    }

    function isDate(date) {
        return (date !== undefined) && (Object.prototype.toString.call(date) === '[object Date]') && (date.toString() !== 'Invalid Date');
    }

    function validChoices(choice) {
        for (var i = 0; i < choice.length; i++) {
            if (choice[i].text === undefined && choice[i].resourceId === undefined) {
                return false;
            }
        }
        return true;
    }
}

function makeAnswer(questionId, choice, correct, timeTaken){

    if (choice !== undefined && !isArray(choice)) {
        choice = [choice];
    }

    var answer = {
        studentId : initObj.studentId,
        questionId : questionId,
        assignmentId : initObj.assignmentId, 
        dateAttempted : new Date(),
        choice : choice,
        correct : correct,
        timeTaken : timeTaken
    };
    
    if (isValidAnswer(answer)) {
        return answer;
    } 

    console.log("An answer object will not be made.");
}

/********************************  Utils  *************************************/

// From http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
function isArray(o) {
    return Object.prototype.toString.call(o) === '[object Array]';
}
