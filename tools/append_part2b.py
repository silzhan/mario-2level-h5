import os

path = r"E:/github/mario-2level-h5/js/renderer.js"

remaining = """

    drawKoopa(enemy,cameraX){
        if(!enemy.alive)return;const x=enemy.x-cameraX,y=enemy.y;if(x<-32||x>CONFIG.SCREEN_WIDTH+32)return;const isR=enemy.color==='red';
        if(enemy.isShell){const sc=isR?'#e80000':'#00a800',sl=isR?'#ff4848':'#00e800';this.ctx.fillStyle=sc;this.ctx.fillRect(x+2,y+2,24,20);this.ctx.fillStyle=sl;this.ctx.fillRect(x+4,y+4,8,6);this.ctx.fillRect(x+14,y+4,8,6);this.ctx.fillStyle=isR?'#a00000':'#006800';this.ctx.fillRect(x+2,y+16,24,4);this.ctx.fillStyle='#f8d870';this.ctx.fillRect(x+6,y+18,16,4);if(enemy.shellMoving){const so=Math.floor(this.animTimer/2)%4;this.ctx.fillStyle='#fff';this.ctx.fillRect(x+6+so*4,y+8,3,3);}}
        else{this.ctx.save();if(enemy.velX>0){this.ctx.translate(x+enemy.width/2,0);this.ctx.scale(-1,1);this.ctx.translate(-(x+enemy.width/2),0);}const sc=isR?'#e80000':'#00a800',sl=isR?'#ff4848':'#00e800',sk='#f8d870';this.ctx.fillStyle=sc;this.ctx.fillRect(x+4,y+10,20,16);this.ctx.fillStyle=sl;this.ctx.fillRect(x+6,y+12,6,5);this.ctx.fillRect(x+14,y+12,6,5);this.ctx.fillStyle=sk;this.ctx.fillRect(x+2,y,14,12);this.ctx.fillStyle='#000';this.ctx.fillRect(x+4,y+3,3,3);const wf=Math.floor(this.animTimer/10)%2;this.ctx.fillStyle=sk;if(wf===0){this.ctx.fillRect(x+6,y+28,6,8);this.ctx.fillRect(x+16,y+30,6,6);}else{this.ctx.fillRect(x+6,y+30,6,6);this.ctx.fillRect(x+16,y+28,6,8);}this.ctx.restore();}
    }

    drawParatroopa(enemy,cameraX){
        if(!enemy.alive)return;if(!enemy.hasWings){this.drawKoopa(enemy,cameraX);return;}const x=enemy.x-cameraX,y=enemy.y;if(x<-32||x>CONFIG.SCREEN_WIDTH+32)return;const isR=enemy.color==='red',sc=isR?'#e80000':'#00a800',sl=isR?'#ff4848':'#00e800',sk='#f8d870';const flap=Math.floor(this.animTimer/4)%2===0;
        this.ctx.fillStyle='#fff';if(flap){this.ctx.fillRect(x-4,y+6,8,12);this.ctx.fillRect(x+enemy.width-4,y+6,8,12);}else{this.ctx.fillRect(x-2,y+10,6,8);this.ctx.fillRect(x+enemy.width-4,y+10,6,8);}
        this.ctx.fillStyle='#ccc';this.ctx.fillRect(x-2,y+8,4,2);this.ctx.fillRect(x+enemy.width-2,y+8,4,2);this.ctx.fillStyle=sc;this.ctx.fillRect(x+4,y+14,20,16);this.ctx.fillStyle=sl;this.ctx.fillRect(x+6,y+16,6,5);this.ctx.fillRect(x+14,y+16,6,5);this.ctx.fillStyle=sk;this.ctx.fillRect(x+2,y+2,14,12);this.ctx.fillStyle='#000';this.ctx.fillRect(x+4,y+5,3,3);this.ctx.fillStyle=sk;this.ctx.fillRect(x+6,y+32,6,6);this.ctx.fillRect(x+16,y+32,6,6);
    }

    drawBlooper(enemy,cameraX){const x=enemy.x-cameraX,y=enemy.y;if(x<-32||x>CONFIG.SCREEN_WIDTH+32)return;const bb=Math.sin(this.animTimer*0.08)*2;this.ctx.fillStyle='#f5deb3';this.ctx.fillRect(x+4,y+bb,enemy.width-8,16);this.ctx.fillStyle='#ddd0a8';this.ctx.fillRect(x+2,y+12+bb,enemy.width-4,10);this.ctx.fillStyle='#000';this.ctx.fillRect(x+8,y+4+bb,3,3);this.ctx.fillRect(x+16,y+4+bb,3,3);const sw=Math.sin(this.animTimer*0.1)*2;this.ctx.fillStyle='#f5deb3';this.ctx.fillRect(x+2+sw,y+22+bb,4,8);this.ctx.fillRect(x+8+sw,y+24+bb,4,8);this.ctx.fillRect(x+14-sw,y+24+bb,4,8);this.ctx.fillRect(x+20-sw,y+22+bb,4,8);}

    drawCheepCheep(enemy,cameraX){const x=enemy.x-cameraX,y=enemy.y;if(x<-32||x>CONFIG.SCREEN_WIDTH+32)return;const bc=enemy.color==='red'?'#cc3333':'#888888',lc=enemy.color==='red'?'#ee4444':'#aaaaaa';this.ctx.fillStyle=bc;this.ctx.fillRect(x+2,y+4,enemy.width-4,12);this.ctx.fillStyle=lc;this.ctx.fillRect(x+4,y+2,enemy.width-8,6);this.ctx.fillStyle='#000';const ex=enemy.facingRight?x+16:x+6;this.ctx.fillRect(ex,y+6,3,3);const wobble=Math.sin(this.animTimer*0.1)*2;this.ctx.fillStyle=bc;const tx=enemy.facingRight?x-4+wobble:x+enemy.width-2+wobble;this.ctx.fillRect(tx,y+6,6,8);}

    drawHammerBro(enemy,cameraX){
        if(!enemy.alive)return;const x=enemy.x-cameraX,y=enemy.y;if(x<-32||x>CONFIG.SCREEN_WIDTH+32)return;
        this.ctx.save();if(!enemy.facingRight){this.ctx.translate(x+enemy.width/2,0);this.ctx.scale(-1,1);this.ctx.translate(-(x+enemy.width/2),0);}
        this.ctx.fillStyle='#00a800';this.ctx.fillRect(x+4,y+16,20,18);this.ctx.fillStyle='#00e800';this.ctx.fillRect(x+6,y+18,6,6);this.ctx.fillRect(x+14,y+18,6,6);this.ctx.fillStyle='#006800';this.ctx.fillRect(x+4,y+30,20,4);this.ctx.fillStyle='#f8d870';this.ctx.fillRect(x+2,y+4,18,14);this.ctx.fillStyle='#000';this.ctx.fillRect(x+5,y+7,3,4);this.ctx.fillStyle='#fff';this.ctx.fillRect(x+2,y+14,14,4);this.ctx.fillStyle='#f8d870';this.ctx.fillRect(x,y+18,6,10);this.ctx.fillRect(x+22,y+18,6,10);this.ctx.fillStyle='#8b4513';const wf=Math.floor(this.animTimer/12)%2;this.ctx.fillRect(x+6,y+36,6,8-wf*2);this.ctx.fillRect(x+16,y+36,6,6+wf*2);
        this.ctx.restore();
    }

    drawHammer(h,cameraX){
        if(!h.alive)return;const x=h.x-cameraX,y=h.y;if(x<-16||x>CONFIG.SCREEN_WIDTH+16)return;
        this.ctx.save();this.ctx.translate(x+h.width/2,y+h.height/2);this.ctx.rotate((h.animTimer*0.4)%(Math.PI*2));
        this.ctx.fillStyle='#8b4513';this.ctx.fillRect(-2,-2,4,12);this.ctx.fillStyle='#888';this.ctx.fillRect(-7,-7,14,8);this.ctx.fillStyle='#aaa';this.ctx.fillRect(-7,-7,14,2);this.ctx.fillStyle='#555';this.ctx.fillRect(-7,-1,14,2);
        this.ctx.restore();
    }

    drawMushroom(mushroom,cameraX){
        if(!mushroom.alive)return;const x=mushroom.x-cameraX,y=mushroom.y;if(x<-32||x>CONFIG.SCREEN_WIDTH+32)return;
        if(mushroom.type==='1up'){this.ctx.fillStyle='#00a800';this.ctx.fillRect(x+4,y,20,12);this.ctx.fillStyle='#fff';this.ctx.fillRect(x+8,y+2,4,4);this.ctx.fillRect(x+16,y+2,4,4);this.ctx.fillStyle='#fca';this.ctx.fillRect(x+4,y+12,20,10);this.ctx.fillStyle='#000';this.ctx.fillRect(x+8,y+14,3,3);this.ctx.fillRect(x+17,y+14,3,3);this.ctx.fillStyle='#6b3410';this.ctx.fillRect(x+6,y+22,6,6);this.ctx.fillRect(x+16,y+22,6,6);}
        else if(mushroom.type==='fire'){const pc=Math.floor(this.animTimer/8)%2===0?'#ff8800':'#ffcc00';this.ctx.fillStyle='#00a800';this.ctx.fillRect(x+11,y+14,6,14);this.ctx.fillStyle=pc;this.ctx.fillRect(x+4,y,6,6);this.ctx.fillRect(x+18,y,6,6);this.ctx.fillRect(x+4,y+8,6,6);this.ctx.fillRect(x+18,y+8,6,6);this.ctx.fillStyle='#fff';this.ctx.fillRect(x+10,y+4,8,8);this.ctx.fillStyle='#000';this.ctx.fillRect(x+11,y+6,2,2);this.ctx.fillRect(x+15,y+6,2,2);}
        else if(mushroom.type==='star'){const flash=Math.floor(this.animTimer/4)%2===0;this.ctx.fillStyle=flash?'#ffee00':'#ff8800';this.ctx.fillRect(x+10,y,8,4);this.ctx.fillRect(x+6,y+4,16,4);this.ctx.fillRect(x+2,y+8,24,6);this.ctx.fillRect(x+6,y+14,16,4);this.ctx.fillRect(x+4,y+18,6,6);this.ctx.fillRect(x+18,y+18,6,6);this.ctx.fillStyle='#000';this.ctx.fillRect(x+10,y+10,2,2);this.ctx.fillRect(x+16,y+10,2,2);}
        else if(this.mushroomSprite){this.ctx.imageSmoothingEnabled=false;this.ctx.drawImage(this.mushroomSprite,x,y,28,28);this.ctx.imageSmoothingEnabled=true;}
        else{this.ctx.fillStyle='#e52521';this.ctx.fillRect(x+4,y,20,12);this.ctx.fillStyle='#fff';this.ctx.fillRect(x+8,y+2,4,4);this.ctx.fillRect(x+16,y+2,4,4);this.ctx.fillStyle='#fca';this.ctx.fillRect(x+4,y+12,20,10);this.ctx.fillStyle='#000';this.ctx.fillRect(x+8,y+14,3,3);this.ctx.fillRect(x+17,y+14,3,3);this.ctx.fillStyle='#6b3410';this.ctx.fillRect(x+6,y+22,6,6);this.ctx.fillRect(x+16,y+22,6,6);}
    }

    drawCoin(coin,cameraX){
        if(coin.collected&&!coin.isPopCoin)return;const x=coin.x-cameraX,y=coin.y+(coin.isPopCoin?0:coin.bobOffset),w=coin.width,h=coin.height;if(x<-16||x>CONFIG.SCREEN_WIDTH+16)return;
        this.ctx.save();if(coin.isPopCoin)this.ctx.globalAlpha=Math.max(0,1-coin.popLife/coin.popMaxLife);
        const sx=Math.cos(this.animTimer*0.15),cx=x+w/2,cy=y+h/2;this.ctx.translate(cx,0);this.ctx.scale(sx,1);this.ctx.translate(-cx,0);
        this.ctx.fillStyle='#ffd700';this.ctx.beginPath();this.ctx.ellipse(cx,cy,w/2,h/2,0,0,Math.PI*2);this.ctx.fill();this.ctx.strokeStyle='#b8860b';this.ctx.lineWidth=2;this.ctx.stroke();
        this.ctx.fillStyle='#fff5a0';this.ctx.beginPath();this.ctx.ellipse(cx-2,cy-3,w/5,h/4,0,0,Math.PI*2);this.ctx.fill();
        this.ctx.restore();
    }

    drawElevator(elev,cameraX){const x=elev.x-cameraX,y=elev.y;if(x<-32||x>CONFIG.SCREEN_WIDTH+32)return;const w=elev.width,h=elev.height;this.ctx.fillStyle='#8a8a8a';this.ctx.fillRect(x,y,w,h);this.ctx.fillStyle='#aaaaaa';this.ctx.fillRect(x,y,w,3);this.ctx.fillStyle='#6a6a6a';this.ctx.fillRect(x,y+h-2,w,2);this.ctx.fillStyle='#555';for(let rx=x+8;rx<x+w-8;rx+=16)this.ctx.fillRect(rx,y+4,4,4);this.ctx.fillStyle='#444';this.ctx.fillRect(x+w/2-1,0,2,y);}

    drawMovingPlatform(plat,cameraX){const x=plat.x-cameraX,y=plat.y;if(x<-32||x>CONFIG.SCREEN_WIDTH+32)return;const w=plat.width,h=plat.height;this.ctx.fillStyle='#d4a020';this.ctx.fillRect(x,y,w,h);this.ctx.fillStyle='#ffcc44';this.ctx.fillRect(x,y,w,3);this.ctx.fillStyle='#8a6010';this.ctx.fillRect(x,y+h-2,w,2);this.ctx.fillStyle='#aa7818';const ay=y+h/2-1;if(plat.moveType==='horizontal'||plat.moveType==='diagonal'){this.ctx.fillRect(x+4,ay,4,2);this.ctx.fillRect(x+w-8,ay,4,2);}if(plat.moveType==='vertical'||plat.moveType==='diagonal'){this.ctx.fillRect(x+w/2-1,y+2,2,4);this.ctx.fillRect(x+w/2-1,y+h-6,2,4);}}

    drawLiftPlatform(plat,cameraX){const x=plat.x-cameraX,y=plat.y;if(x<-32||x>CONFIG.SCREEN_WIDTH+32)return;const w=plat.width,h=plat.height;this.ctx.fillStyle=plat.platformColor||'#aa8833';this.ctx.fillRect(x,y,w,h);this.ctx.fillStyle='#ccaa55';this.ctx.fillRect(x,y,w,3);this.ctx.fillStyle='#887722';this.ctx.fillRect(x,y+h-2,w,2);this.ctx.fillStyle='#996622';for(let rx=x+6;rx<x+w-6;rx+=12)this.ctx.fillRect(rx,y+4,2,h-6);}

    drawFallingPlatform(fp,cameraX){const x=fp.x-cameraX+(fp.shakeOffsetX||0),y=fp.y;if(x<-32||x>CONFIG.SCREEN_WIDTH+32)return;const w=fp.width,h=fp.height,falling=fp.state==='falling';this.ctx.fillStyle=falling?'#c04020':'#e07030';this.ctx.fillRect(x,y,w,h);this.ctx.fillStyle=falling?'#e08060':'#f09060';this.ctx.fillRect(x,y,w,3);this.ctx.fillStyle='#802818';this.ctx.fillRect(x,y+h-2,w,2);this.ctx.fillStyle='#601810';for(let cx=x+8;cx<x+w-6;cx+=14){this.ctx.fillRect(cx,y+4,1,h-6);this.ctx.fillRect(cx+2,y+5,1,h-8);}}

    drawSpringboard(sb,cameraX){const x=sb.x-cameraX,y=sb.y;if(x<-24||x>CONFIG.SCREEN_WIDTH+24)return;const w=sb.width,h=sb.height;this.ctx.fillStyle='#444';this.ctx.fillRect(x+2,y+h-4,w-4,4);this.ctx.fillStyle='#dc3232';const coils=h>14?4:2,coilH=(h-6)/coils;for(let i=0;i<coils;i++){const ccy=y+2+i*coilH;this.ctx.fillRect(x+4,ccy,w-8,Math.max(2,coilH-2));}this.ctx.fillStyle='#ff6060';this.ctx.fillRect(x+4,y+2,w-8,2);this.ctx.fillStyle='#a01818';this.ctx.fillRect(x+4,y+h-6,w-8,2);}

    drawPiranhaPlant(plant,cameraX){
        if(!plant.alive||plant.state==='hidden')return;const x=plant.x-cameraX,y=plant.y,w=plant.width,h=plant.height,clipY=plant.pipeTopY;if(x<-32||x>CONFIG.SCREEN_WIDTH+32)return;
        this.ctx.save();this.ctx.beginPath();this.ctx.rect(x-4,0,w+8,clipY+4);this.ctx.clip();
        const stemW=10,stemX=x+(w-stemW)/2;this.ctx.fillStyle='#00a800';this.ctx.fillRect(stemX,y+12,stemW,h-12);this.ctx.fillStyle='#00e800';this.ctx.fillRect(stemX+2,y+12,3,h-12);
        const hdW=24,hdH=14,hdX=x,hdY=y;this.ctx.fillStyle='#e80000';this.ctx.fillRect(hdX,hdY,hdW,hdH);this.ctx.fillStyle='#ff4848';this.ctx.fillRect(hdX+2,hdY+2,hdW-4,4);
        this.ctx.fillStyle='#fff';this.ctx.fillRect(hdX+4,hdY+4,4,3);this.ctx.fillRect(hdX+16,hdY+4,4,3);this.ctx.fillStyle='#000';this.ctx.fillRect(hdX+8,hdY+8,3,3);this.ctx.fillRect(hdX+14,hdY+8,3,3);
        this.ctx.fillStyle='#00e800';this.ctx.fillRect(hdX+4,hdY+hdH-6,4,2);this.ctx.fillRect(hdX+16,hdY+hdH-6,4,2);
        this.ctx.restore();
    }

    drawFireball(fb,cameraX){
        if(!fb.alive)return;const x=fb.x-cameraX,y=fb.y;if(x<-16||x>CONFIG.SCREEN_WIDTH+16)return;
        const fc=Math.floor(this.animTimer/4)%2===0?'#ff8800':'#ffcc00';this.ctx.fillStyle=fc;this.ctx.beginPath();this.ctx.arc(x+fb.width/2,y+fb.height/2,6,0,Math.PI*2);this.ctx.fill();
        this.ctx.fillStyle='#ff4400';this.ctx.beginPath();this.ctx.arc(x+fb.width/2-3,y+fb.height/2+2,2,0,Math.PI*2);this.ctx.fill();
        this.ctx.fillStyle='rgba(255,136,0,0.2)';this.ctx.beginPath();this.ctx.arc(x+fb.width/2,y+fb.height/2,14,0,Math.PI*2);this.ctx.fill();
    }

    drawPodoboo(pod,cameraX){
        const x=pod.x-cameraX,y=pod.y;if(x<-32||x>CONFIG.SCREEN_WIDTH+32)return;const w=pod.width,h=pod.height;
        const glow=Math.sin(this.animTimer*0.1)*0.1+0.2;this.ctx.fillStyle='rgba(255,136,0,'+glow+')';this.ctx.beginPath();this.ctx.arc(x+w/2,y+h/2,24,0,Math.PI*2);this.ctx.fill();
        this.ctx.fillStyle='#e80000';this.ctx.beginPath();this.ctx.ellipse(x+w/2,y+h-6,w/2,h/3,0,Math.PI,0);this.ctx.fill();
        this.ctx.fillStyle='#ff3030';this.ctx.beginPath();this.ctx.ellipse(x+w/2,y+h-8,w/3,h/4,0,Math.PI,0);this.ctx.fill();
        this.ctx.fillStyle='#aa0000';this.ctx.beginPath();this.ctx.ellipse(x+w/2,y+h-3,w/4,h/5,0,Math.PI,0);this.ctx.fill();
        this.ctx.fillStyle='#ff8800';this.ctx.fillRect(x+w/2-2,y+2,4,8);
    }

    drawFireBar(fb,cameraX){const x=fb.x-cameraX,y=fb.y;if(x<-32||x>CONFIG.SCREEN_WIDTH+32)return;const segments=fb.segments||8;for(let i=0;i<segments;i++){const angle=(this.animTimer*0.06+i*(Math.PI*2/segments))+fb.phase||0;const sx=x+Math.cos(angle)*fb.length||64,sy=y+Math.sin(angle)*fb.length||64;const fc=Math.floor(this.animTimer/6+i)%2===0?'#ff8800':'#ffcc00';this.ctx.fillStyle='#888';this.ctx.fillRect(sx-4,sy-4,8,8);this.ctx.fillStyle=fc;this.ctx.beginPath();this.ctx.arc(sx,sy,5,0,Math.PI*2);this.ctx.fill();this.ctx.fillStyle='#ff4400';this.ctx.beginPath();this.ctx.arc(sx-1,sy-1,2,0,Math.PI*2);this.ctx.fill();}}

    drawBowser(bowser,cameraX){
        if(!bowser.alive)return;const x=bowser.x-cameraX,y=bowser.y;if(x<-48||x>CONFIG.SCREEN_WIDTH+48)return;
        this.ctx.save();if(!bowser.facingRight){this.ctx.translate(x+bowser.width/2,0);this.ctx.scale(-1,1);this.ctx.translate(-(x+bowser.width/2),0);}
        const w=bowser.width,h=bowser.height,breath=Math.sin(this.animTimer*0.06)*2;
        this.ctx.fillStyle='#d4a020';this.ctx.fillRect(x+4,y+20+breath,w-8,16);
        this.ctx.fillStyle='#00a800';this.ctx.fillRect(x+2,y+34+breath,w-4,22);this.ctx.fillStyle='#00e800';this.ctx.fillRect(x+4,y+36+breath,4,6);this.ctx.fillRect(x+w-8,y+36+breath,4,6);
        this.ctx.fillStyle='#000';this.ctx.fillRect(x+4,y+54+breath,4,8);this.ctx.fillRect(x+w-8,y+54+breath,4,8);
        this.ctx.fillStyle='#c04020';this.ctx.fillRect(x+2,y+18+breath,w-4,14);this.ctx.fillStyle='#ff0000';this.ctx.fillRect(x,y+20+breath,4,6);this.ctx.fillRect(x+w-4,y+20+breath,4,6);
        this.ctx.fillStyle='#ffcc00';this.ctx.fillRect(x+10,y+12+breath,24,10);this.ctx.fillRect(x+10,y+4,24,10);
        this.ctx.fillStyle='#fff';this.ctx.fillRect(x+14,y+6,6,4);this.ctx.fillRect(x+24,y+6,6,4);
        this.ctx.fillStyle='#000';this.ctx.fillRect(x+16,y+8,3,2);this.ctx.fillRect(x+26,y+8,3,2);
        this.ctx.fillStyle='#000';this.ctx.fillRect(x+14,y+16,6,3);this.ctx.fillRect(x+24,y+16,6,3);
        this.ctx.fillStyle='#e80000';this.ctx.fillRect(x+4,y,4,6);this.ctx.fillRect(x+w-8,y,4,6);this.ctx.fillStyle='#ff4848';this.ctx.fillRect(x+4,y-2,4,4);this.ctx.fillRect(x+w-8,y-2,4,4);
        this.ctx.fillStyle='#d4a020';this.ctx.fillRect(x-2,y+30+breath,4,12);this.ctx.fillRect(x+w-2,y+30+breath,4,12);
        this.ctx.fillStyle='#000';this.ctx.fillRect(x-2,y+40+breath,4,4);this.ctx.fillRect(x+w-2,y+40+breath,4,4);
        const bc=Math.floor(this.animTimer/10)%2===0?'#ffcc00':'#ff8800';this.ctx.fillStyle=bc;this.ctx.fillRect(x+4,y+8+breath,4,2);this.ctx.fillRect(x+w-8,y+8+breath,4,2);
        if(bowser.isFire){this.ctx.fillStyle='rgba(255,136,0,0.15)';this.ctx.beginPath();this.ctx.arc(x+w/2,y+12,20+Math.sin(this.animTimer*0.1)*5,0,Math.PI*2);this.ctx.fill();}
        this.ctx.restore();
    }
}
"""
with open(path, 'a', encoding='utf-8') as f:
    f.write(remaining)
print("Part 2b done")
