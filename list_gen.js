import {LEX} from './bases072124.js';

//let words = [];
let dictWords = [];
let count = 0;

for (let i=0; i<LEX.length; i++){
    let headword = LEX[i].headword.replace(/[^0-9a-z\-]/gi, '')
    if(headword.length == 6){
        if(!LEX[i].pos.includes("VERB") && !LEX[i].pos.includes("ROOT") && !LEX[i].pos.includes("PROPER NOUN")){
            dictWords.push({"UUID":LEX[i].UUID, "word":LEX[i].headword, "ipa":LEX[i].ipa, "gloss":LEX[i].gloss, "pos":LEX[i].pos})
            count++;
        }
    }
}

const obj = {dictWords};

const fs = await import('fs');
fs.writeFile("./6_letter_words.txt", JSON.stringify(obj), function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("total = " + dictWords.length + ";");
});

//Access object like this:
//fs.readFile('/Users/Andreas/Desktop/NODE/myproject/files/test.txt', 'utf8', function(err, data) {
//	const obj = JSON.parse(data)
//
//	console.log("The data from the file is: " + obj)
//})