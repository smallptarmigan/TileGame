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
    writetile();
}

/* drawing result */
function result() {
    mode = 3;
    writetile();
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
    if(mode == 0){
	for(var i = 0; i < tilelen; i++){
	    var j = 1;
	    var text;
	    var memo;
	    switch (i) {
	    case 0:
		text = "ランキングモード";
		memo = "(next update)";
		break;
	    case 1:
		text = "タイムアタックモード";
		memo = "(next update)";
		break;
	    case 2:
		text = "エフェクティブモード";
		memo = "";
		break;
	    }
	    ctx.fillStyle = '#ffa500';
	    ctx.font = "bold 15px 'ＭＳ Ｐゴシック'";
	    ctx.fillText(text, (tileside+tilespace)*i+20, (tileside+tilespace)*j+85);
	    ctx.fillText(memo, (tileside+tilespace)*i+20, (tileside+tilespace)*j+85+15);
	}
    }
    if(mode == 2){
	var text = 'CLEAR! click to next';
	if(tile[0][0] == 1) {
	    ctx.fillStyle = '#98fb98';
	}
	else {
	    ctx.fillStyle = '#ffa500';
	}
	ctx.font = "30px 'Times New Roman'";
	ctx.fillText(text, 110, 260);	
    }
    if(mode == 3){
	var text = 'Result Score';
	ctx.fillStyle = '#000000';
	ctx.font = "30px 'Times New Roman'";
	ctx.fillText(text, 175, 250);
	ctx.fillText(score, 240, 280);
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
	var t = tileside+tilespace;
	if(t*2 <= e.layerX && t*1 <= e.layerY &&
           e.layerX <= t*2+tileside && e.layerY <= t*1+tileside){
	    mode = 1;
	    score = 0;
	    remain = 50;
	    inittile(3);
	    highscorehtml.innerHTML = "highscore : " + $.cookie('highscore');
	    scorehtml.innerHTML = "score : " + score;
	}
	remainhtml.innerHTML = "remain : " + remain;	    
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
	    success();	    
	    if(score > tilelen * 10) {
		tilelen++;
	    }

	}
	if(remain <= 0){
	    mode = 0;
	    /* cookie */
	    if($.cookie('highscore') < score){
		$.cookie('highscore', score, { expires: 30 });
	    }
	    result();
	}
	highscorehtml.innerHTML = "highscore : " + $.cookie('highscore');
	scorehtml.innerHTML = "score : " + score;
	remainhtml.innerHTML = "remain : " + remain;
    }
    else if(mode == 2){
	mode = 1;
	inittile(tilelen);
    }
    else if(mode == 3){
	mode = 0;
	menu();
    }
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

