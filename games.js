/* drawing menu */
function menu() {
    mode = 0;
    inittile(3);
    writetile();
    if($.cookie('highscore') == undefined){
	$.cookie( 'highscore', 0 );
    }
}

/* drawing success */
function success() {
    mode = 2;
}

/* rand tile */
function randtile (){
    if(mode == 0) return;
    do {
	for(var i = 0; i < tilelen * 2; i++){
	    var x = Math.floor( Math.random() * (tilelen - 1) );
	    var y = Math.floor( Math.random() * (tilelen - 1) );
	    reversetile(x, y);
	}
    } while (checktile() == true); 
}

/* drawing tile */
function writetile (){
    if ( ! canvas || ! canvas.getContext ) { return false; }
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,canvas.width, canvas.height);
    for(var i = 0; i < tilelen; i++){
	for(var j = 0; j < tilelen; j++){
	    if(tile[i][j] == 0) {
		ctx.fillStyle = '#98fb98';
	    }
	    else {
		ctx.fillStyle = '#ffa500';
	    }
	    ctx.fillRect((tileside+tilespace)*i, (tileside+tilespace)*j, tileside, tileside);
	}
    }
}

/* init tile */
function inittile (n){
    tilelen = n;
    tileside = (canvas.width-tilespace*tilelen) / tilelen;
    tile = new Array();
    for(var i = 0; i < tilelen; i++){
	tile[i] = new Array();
	for(var j = 0; j < tilelen; j++){
	    tile[i][j] = 0;
	}
    }
    randtile();
    writetile();
}

/* reverse tile color */
function reversetile (i, j){
    if(mode == 0) return;
    tile[i][j] = tile[i][j] ^ 1;
    if(i-1 >= 0){
	tile[i-1][j] = tile[i-1][j] ^ 1;
    }
    if(j-1 >= 0){
	tile[i][j-1] = tile[i][j-1] ^ 1;
    }
    if(j+1 < tilelen){
	tile[i][j+1] = tile[i][j+1] ^ 1;
    }
    if(i+1 < tilelen){
	tile[i+1][j] = tile[i+1][j] ^ 1;
    }
    //console.log("%d %d", i, j);
}

/* check tile color */
function checktile (){
    var ans = true;
    for(var i = 0; i < tilelen; i++){
	for(var j = 0; j < tilelen; j++) {
	    if(tile[0][0] != tile[i][j]) ans = false;	    
	}
    }
    return ans;
}

/* onclock function */
function onClick(e) {
    var highscorehtml = document.getElementById("highscore");
    var scorehtml = document.getElementById("score");
    var remainhtml = document.getElementById("remain");    
    if(mode == 0){
	mode = 1;
	score = 0;
	remain = 50;
	inittile(3);
    }
    else if(mode == 1){
	var rect = e.target.getBoundingClientRect();
	for(var i = 0; i < tilelen; i++){
	    for(var j = 0; j < tilelen; j++){
		var t = tileside+tilespace;
		if(t*i <= e.layerX && t*j <= e.layerY &&
		   e.layerX <= t*i+tileside && e.layerY <= t*j+tileside){
		    reversetile(i, j);
		}
	    }
	}
	writetile();
	var tilestat = checktile();
	remain--;
	if(tilestat == true){
	    score = score + tilelen;
	    if(score > tilelen * 10) {
		tilelen++;
	    }
	    success();	    
	}
	if(remain < 0){
	    mode = 0;
	    /* cookie */
	    if($.cookie('highscore') < score){
		$.cookie('highscore', score, { expires: 30 });
	    }
	}
    }
    else if(mode == 2){
	mode = 1;
	inittile(tilelen);
    }
    highscorehtml.innerHTML = "highscore : " + $.cookie('highscore');
    scorehtml.innerHTML = "score : " + score;
    remainhtml.innerHTML = "remain : " + remain;
}

/* onclick method */
var canvas =  document.getElementById('c1');
canvas.addEventListener('click', onClick, false);

/* variable list */
var tilelen;
var tile;
var tilespace = 2;
var tileside;
var reversenum;
var mode = 0;
var remain = 0;
var score = 0;

/* main method */
menu();

