let gameSeq = [];
let userSeq = [];
let participants = [];
let btns = ["red", "purple", "green", "yellow"];
let started = false;
let level = 0;
let h2 = document.querySelector("h2");

// form
document.getElementById('form').addEventListener('submit', function(e) {
    e.preventDefault();
    document.querySelector('.form-container').style.display = 'none';
    if (!started) {
        started = true;
        levelUp();
    }
});

function gameFlash(btn){
    btn.classList.add("flash");
    setTimeout(function() {
        btn.classList.remove("flash");
    }, 250);
}

function userFlash(btn){
    btn.classList.add("userflash");
    setTimeout(function() {
        btn.classList.remove("userflash");
    }, 250);
}

function levelUp(){
    userSeq = [];
    level++;
    h2.innerText = `Level ${level}`;

    let randIdx = Math.floor(Math.random()*4);
    let randColor = btns[randIdx];
    let randBtn = document.querySelector(`.${randColor}`);
    gameSeq.push(randColor);
    console.log(gameSeq);
    gameFlash(randBtn);
}

function checkAns(idx){
    if(userSeq[idx] === gameSeq[idx]){
        if(userSeq.length === gameSeq.length){
            setTimeout(levelUp,1000);
        }
    }else {
        h2.innerHTML =`GAME OVER!! Your score was <b>${level}</b>`;
        document.body.style.backgroundColor = "red";
        
        // Background color white after 250ms
        setTimeout(function(){
            document.body.style.backgroundColor = "white";
        }, 250);

        // Show form popup after 500ms (slightly after background turns white)
        setTimeout(function(){
            document.querySelector('.form-container').style.display = 'flex';
        }, 500);

        // get name from input
        let name = document.getElementById('name').value || 'Unknown';
        addParticipant(name, level);

        reset();
    }
}

function btnPress(){
    // console.log(this);
    let btn = this;
    userFlash(btn);
    userColor = btn.getAttribute("id");
    userSeq.push(userColor);
    checkAns(userSeq.length-1);
}

let allBtns = document.querySelectorAll(".btn");
for(btn of allBtns){
    btn.addEventListener("click", btnPress);
}

function reset(){
    started = false;
    gameSeq = [];
    userSeq = [];
    level = 0;
}

// Load participants from localStorage on page load
window.onload = function() {
    let saved = localStorage.getItem('participants');
    if (saved) {
        participants = JSON.parse(saved);
        updateScoreboard();
    }
};

// Scoreboard functionality
function addParticipant(name, score) {
    participants.push({name,score});
    localStorage.setItem('participants', JSON.stringify(participants)); // Save to localStorage
    updateScoreboard();
}
function updateScoreboard() {
    // Sort participants by score in descending order
    let sorted = [...participants].sort((a, b) => b.score - a.score);
    // highest score
    let highest = sorted.length ? sorted[0].score : 0;
    document.getElementById('highest-score').innerText = `Highest Score: ${highest}`;
    // scoreboard html
    let html = '';
    sorted.forEach((p,i)=>{
        let pos = '';
        if (i === 0) pos = ' 🥇 1st';
        else if (i === 1) pos = ' 🥈 2nd';
        else if (i === 2) pos = ' 🥉 3rd';
        html += `<div class="participant-record">${p.name}: ${p.score}${pos}</div>`;
    });
    document.querySelector('.scoreboard').innerHTML = html;
}
