/* drawing menu */
function menu() {
    mode = 0;
    inittile(3);
    writetile();
    if($.cookie('highscore_en') == undefined){
	$.cookie( 'highscore_en', 0 );
    }
    if($.cookie('highscore_eh') == undefined){
	$.cookie( 'highscore_eh', 0 );
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
	    for(var j = 0; j < tilelen; j++){
		var text;
		var memo;
		switch (i*10+j) {
		case 1:
		    text = "ランキングモード";
		    memo = "(next update)";
		    break;
		case 11:
		    text = "タイムアタックモード";
		    memo = "(next update)";
		    break;
		case 21:
		    text = "エフェクティブモード";
		    memo = "ノーマル";
		    break;
		case 22:
		    text = "エフェクティブモード";
		    memo = "ハード";
		    break;
		default:
		    text = "";
		    memo = "";
		}
		ctx.fillStyle = '#ffa500';
		ctx.font = "bold 15px 'ＭＳ Ｐゴシック'";
		ctx.fillText(text, (tileside+tilespace)*i+20, (tileside+tilespace)*j+85);
		ctx.fillText(memo, (tileside+tilespace)*i+20, (tileside+tilespace)*j+85+15);
	    }
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
    var basetile = Math.floor(Math.random() * 2);
    turn = Math.floor(Math.random() * 2);
    for(var i = 0; i < tilelen; i++){
	tile[i] = new Array();
	for(var j = 0; j < tilelen; j++){
	    /* set backcolor mainmenu */
	    if(mode == 0){
		tile[i][j] = 0;
	    }
	    else {
		tile[i][j] = basetile;
	    }
	}
    }
    randtile();
    if(level == 0){
	turn = 0;
    }
    else if(level == 1){
	turn = turn ^ 1;
    }
    writetile();
}

/* reverse tile color */
function reversetile (i, j){
    if(mode == 0) return;
    if(turn == 0){
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
	if(level == 1){
	    turn = turn ^ 1;
	}
    }
    else if(turn == 1){
	tile[i][j] = tile[i][j] ^ 1;
	if(i-1 >= 0){
	    tile[i-1][j] = tile[i-1][j] ^ 1;
	    if(j-1 >= 0){
		tile[i-1][j-1] = tile[i-1][j-1] ^ 1;
	    }
	}
	if(j-1 >= 0){
	    tile[i][j-1] = tile[i][j-1] ^ 1;
	    if(i+1 < tilelen){
		tile[i+1][j-1] = tile[i+1][j-1] ^ 1;
	    }
	}
	if(j+1 < tilelen){
	    tile[i][j+1] = tile[i][j+1] ^ 1;
	    if(i-1 >= 0){
		tile[i-1][j+1] = tile[i-1][j+1] ^ 1;
	    }
	}
	if(i+1 < tilelen){
	    tile[i+1][j] = tile[i+1][j] ^ 1;
	    if(j+1 < tilelen){
		tile[i+1][j+1] = tile[i+1][j+1] ^ 1;
	    }
	}
	if(level == 1){
	    turn = turn ^ 1;
	}
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
    var turnhtml = document.getElementById("turn");
    var twitterbutton = document.getElementById("twitter");
    var tempcookie = 0;
    
    if(level == 0){
	tempcookie = $.cookie('highscore_en');
    }
    else if(level == 1){
	tempcookie = $.cookie('highscore_eh');
    }
    
    /* console.log("%d %d", e.offsetX, e.offsetY); */
    if(mode == 0){
	var t = tileside+tilespace;
	/* effect mode normal */
	if(t*2 <= e.offsetX && t*1 <= e.offsetY &&
           e.offsetX <= t*2+tileside && e.offsetY <= t*1+tileside){
	    mode = 1;
	    level = 0;
	    score = 0;
	    remain = 50;
	    inittile(3);
	    twitterbutton.innerHTML = "";
	    highscorehtml.innerHTML = "highscore : " + tempcookie;
	    scorehtml.innerHTML = "score : " + score;
	    turnhtml.innerHTML = "turn :" + (turn == 0 ? "4近傍" : "8近傍");
	    remainhtml.innerHTML = "remain : " + remain;   
	}
	/* effect mode hard */
	if(t*2 <= e.offsetX && t*2 <= e.offsetY &&
           e.offsetX <= t*2+tileside && e.offsetY <= t*2+tileside){
	    mode = 1;
	    level = 1;
	    score = 0;
	    remain = 50;
	    inittile(4);
	    twitterbutton.innerHTML = "";
	    highscorehtml.innerHTML = "highscore : " + tempcookie;
	    scorehtml.innerHTML = "score : " + score;
	    turnhtml.innerHTML = "turn :" + (turn == 0 ? "4近傍" : "8近傍");
	    remainhtml.innerHTML = "remain : " + remain;
	}
    }
    else if(mode == 1){
	var rect = e.target.getBoundingClientRect();
	for(var i = 0; i < tilelen; i++){
	    for(var j = 0; j < tilelen; j++){
		var t = tileside+tilespace;
		if(t*i <= e.offsetX && t*j <= e.offsetY &&
		   e.offsetX <= t*i+tileside && e.offsetY <= t*j+tileside){
		    reversetile(i, j);
		}
	    }
	}
	writetile();
	var tilestat = checktile();
	remain--;
	if(tilestat == true){
	    score = score + tilelen;
	    remain = remain + tilelen + 1;
	    success();
	    if(score > 21) {
		tilelen = 4;
	    }
	    if(score > 49) {
		tilelen = 5;
	    }
	    if(score > 84) {
		tilelen = 6;
	    }
	}
	if(remain <= 0){
	    mode = 0;
	    /* cookie */
	    if(level == 0){
		if(tempcookie < score){
		    $.cookie('highscore_en', score, { expires: 30 });
		}
	    }
	    if(level == 1){
		if(tempcookie < score){
		    $.cookie('highscore_eh', score, { expires: 30 });
		}
	    }
	    result();
	    var twittertext = twtextout();
	    twitterbutton.innerHTML = twittertext;	    
	}	
	highscorehtml.innerHTML = "highscore : " + tempcookie;
	scorehtml.innerHTML = "score : " + score;
	turnhtml.innerHTML = "turn :" + (turn == 0 ? "4近傍" : "8近傍");
	remainhtml.innerHTML = "remain : " + remain;
    }
    else if(mode == 2){
	mode = 1;
	inittile(tilelen);
    }
    else if(mode == 3){
	mode = 0;
	twitterbutton.innerHTML = "";	    
	menu();
    }
}

/* twitter data frame */
!function(d,s,id){
    var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';
    if(!d.getElementById(id)){
	js=d.createElement(s);
	js.id=id;js.src=p+'://platform.twitter.com/widgets.js';
	fjs.parentNode.insertBefore(js,fjs);
    }
}(document, 'script', 'twitter-wjs');
    
/* twitter text make */
function twtextout() {
    var comment = "";
    var selectlevel = "";
    if(level == 0){
	selectlevel = "[エフェクティブモード(ノーマル)]";
	if(score > 100){
	    comment = "マジですか！？プロですわ～";
	}
	else if(score > 70){
	    comment = "なかなかいい感じ～♪";
	}
	else if(score > 50){
	    comment = "もうひと頑張り！";
	}
	else {
	    comment = "もういっちょ！";
	}
    }
    if(level == 1){
	selectlevel = "[エフェクティブモード(ハード)]";
	if(score > 50){
	    comment = "糞なゲームで申し訳ございません";
	}
	else if(score > 30){
	    comment = "やりこんでいただき大変感謝しております…";
	}
	else {
	    comment = "かなり難しいですよね…";
	}
    }
    var out = '<p>結果をツイート</p><iframe src="https://platform.twitter.com/widgets/tweet_button.html?size=l&url=https%3A%2F%2Fdsmpt.info%2Fgame%2Ftile&related=twitterapi%2Ctwitter&text='+'I got score '+score+'!! '+selectlevel+'&hashtags=タイル張り職人" width="140" height="40" title="Twitter Tweet Button" style="border: 0; overflow: hidden;"></iframe>';
    return out;
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
var level = 0;
var remain = 0;
var turn = 0;
var score = 0;

/* main method */
menu();

