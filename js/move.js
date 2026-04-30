var repeat=1 //Ingrese 0 para que corra una sola vez y se detenga,de lo contrario, ingrese 1
var title=document.title
var leng=title.length
var start=1
function titlemove() {
mueve=title.substring(start, leng) + title.substring(0, start);
document.title = mueve;
start++;
if (start==leng+1) {
start=0
if (repeat==0)
return
}
setTimeout("titlemove()",220)
}
if (document.title){
titlemove();
}


