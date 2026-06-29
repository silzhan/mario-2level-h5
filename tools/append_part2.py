import os

path = r"E:/github/mario-2level-h5/js/renderer.js"

remaining = """

    drawNightTile(tile,tx,ty,T,lm,r,c){
        if(tile===26||tile===9)return;
        switch(tile){
            case 1:if(r===0||lm[r-1][c]===0){this.ctx.fillStyle='#3a5a2a';this.ctx.fillRect(tx,ty,T,T);this.ctx.fillStyle='#4a6a3a';this.ctx.fillRect(tx,ty,T,6);this.ctx.fillStyle='#5a3a1a';this.ctx.fillRect(tx,ty+14,T,T-14);}else{this.ctx.fillStyle='#5a3a1a';this.ctx.fillRect(tx,ty,T,T);this.ctx.fillStyle='#4a2a0a';this.ctx.fillRect(tx+4,ty+4,8,8);this.ctx.fillRect(tx+18,ty+16,10,8);}break;
            case 2:this.ctx.fillStyle='#886622';this.ctx.fillRect(tx,ty,T,T);this.ctx.fillStyle='#997733';this.ctx.fillRect(tx,ty,T,2);this.ctx.fillRect(tx,ty,2,T/2);this.ctx.fillRect(tx+T/2,ty+T/2,2,T/2);this.ctx.fillStyle='#775510';this.ctx.fillRect(tx,ty+T/2-1,T,2);this.ctx.fillRect(tx+T/2-1,ty,2,T/2);break;
            case 3:this.ctx.fillStyle='#aa8833';this.ctx.fillRect(tx,ty,T,T);this.ctx.fillStyle='#ccaa55';this.ctx.fillRect(tx,ty,T,2);this.ctx.fillRect(tx,ty,2,T);this.ctx.fillRect(tx+T-2,ty,2,T);this.ctx.fillRect(tx,ty+T-2,T,2);this.ctx.fillStyle='#ffdd66';this.ctx.font='bold 18px monospace';this.ctx.textAlign='center';this.ctx.textBaseline='middle';this.ctx.fillText('?',tx+T/2,ty+T/2+1);break;
            case 4:this.ctx.fillStyle='#1a4a2a';this.ctx.fillRect(tx,ty+8,T*2,T*2-8);this.ctx.fillStyle='#2a5a3a';this.ctx.fillRect(tx-4,ty,T*2+8,12);this.ctx.fillStyle='#3a6a3a';this.ctx.fillRect(tx-4,ty,T*2+8,3);break;
            case 6:case 7:this.ctx.fillStyle='#1a4a2a';this.ctx.fillRect(tx,ty,T,T);break;
            case 8:this.ctx.fillStyle='#665544';this.ctx.fillRect(tx,ty,T,T);this.ctx.fillStyle='#554433';this.ctx.fillRect(tx,ty,T,2);this.ctx.fillRect(tx,ty,2,T);this.ctx.fillRect(tx+T-2,ty,2,T);break;
            case 14:break;
            case 15:{const sh=Math.sin(this.animTimer*0.06)*0.1+0.1;this.ctx.fillStyle='#886622';this.ctx.fillRect(tx,ty,T,T);this.ctx.fillStyle='#997733';this.ctx.fillRect(tx,ty,T,2);this.ctx.fillStyle='rgba(255,215,0,'+sh+')';this.ctx.fillRect(tx+4,ty+4,T-8,T-8);break;}
        }
    }

    drawCastleTile(tile,tx,ty,T,lm,r,c){
        switch(tile){
            case 18:{const wv=Math.sin(this.animTimer*0.08+c*0.5)*3;const rr=200+Math.floor(Math.sin(this.animTimer*0.05+c)*30),gg=40+Math.floor(Math.sin(this.animTimer*0.07+c*0.3)*20);
                this.ctx.fillStyle='rgb('+rr+','+gg+',0)';this.ctx.fillRect(tx,ty,T,T);if(r===12||lm[r-1][c]!==18){this.ctx.fillStyle='#ff6600';this.ctx.fillRect(tx,ty+wv,T,6);this.ctx.fillStyle='#ffaa00';this.ctx.fillRect(tx+4,ty+wv+1,T-8,3);}if(r===14){this.ctx.fillStyle='rgba(0,0,0,0.3)';this.ctx.fillRect(tx,ty,T,T);}break;}
            case 19:this.ctx.fillStyle='#606060';this.ctx.fillRect(tx,ty,T,T);this.ctx.fillStyle='#787878';this.ctx.fillRect(tx,ty,T,2);this.ctx.fillRect(tx,ty,2,T/2);this.ctx.fillRect(tx+T/2,ty+T/2,2,T/2);this.ctx.fillStyle='#484848';this.ctx.fillRect(tx,ty+T/2-1,T,2);this.ctx.fillRect(tx+T/2-1,ty,2,T/2);this.ctx.fillRect(tx+T-1,ty+T/2,1,T/2);if((c+r)%7===0){this.ctx.fillStyle='rgba(180,40,20,0.15)';this.ctx.fillRect(tx+4,ty+4,T-8,T-8);}break;
            case 20:this.ctx.fillStyle='#3a3a3a';this.ctx.fillRect(tx,ty,T,T);this.ctx.fillStyle='#505050';this.ctx.fillRect(tx,ty,T,2);this.ctx.fillRect(tx,ty,2,T);this.ctx.fillStyle='#2a2a2a';this.ctx.fillRect(tx+T-2,ty,2,T);this.ctx.fillRect(tx,ty+T-2,T,2);this.ctx.fillStyle='#454545';for(let d=0;d<T;d+=8)this.ctx.fillRect(tx+d,ty+d,2,2);break;
            case 21:this.ctx.fillStyle='#8b5e3c';this.ctx.fillRect(tx,ty,T,T);this.ctx.fillStyle='#a07050';this.ctx.fillRect(tx,ty,T,3);this.ctx.fillStyle='#6b3e1c';this.ctx.fillRect(tx,ty+T-2,T,2);this.ctx.fillStyle='#7a5030';this.ctx.fillRect(tx+10,ty+4,1,T-6);this.ctx.fillRect(tx+22,ty+4,1,T-6);this.ctx.fillStyle='#888';this.ctx.fillRect(tx+2,ty+4,2,2);this.ctx.fillRect(tx+T-4,ty+4,2,2);break;
            case 22:this.ctx.fillStyle='#666';this.ctx.fillRect(tx+8,ty+T-8,T-16,8);this.ctx.fillStyle='#888';this.ctx.fillRect(tx+10,ty+T-8,T-20,2);this.ctx.fillStyle='#8b4513';this.ctx.fillRect(tx+T/2-2,ty+4,4,T-12);this.ctx.fillStyle='#c0c0c0';this.ctx.fillRect(tx+T/2-10,ty+2,20,8);this.ctx.fillStyle='#999';this.ctx.fillRect(tx+T/2-10,ty+8,20,2);break;
            case 23:{this.ctx.fillStyle='#666';this.ctx.fillRect(tx+T/2-3,ty+T/2,6,T/2);const ff=Math.floor(this.animTimer/6)%3,fh=8+ff*2,fw=6-ff;this.ctx.fillStyle='#ff8800';this.ctx.fillRect(tx+T/2-fw/2,ty+T/2-fh,fw,fh);this.ctx.fillStyle='#ffcc00';this.ctx.fillRect(tx+T/2-1,ty+T/2-fh+2,2,fh-4);break;}
            case 2:case 3:case 8:this.drawOverworldTile(tile,tx,ty,T,lm,r,c);break;
        }
    }

    getMarioSprite(player){
        if(!this.loaded)return null;
        if(player.isSwimming)return Math.floor(this.animTimer/10)%2===0?this.sprites['mario-jump']||null:this.sprites['mario-idle']||null;
        if(!player.onGround)return this.sprites['mario-jump']||null;
        if(Math.abs(player.velX)>0.5)return Math.floor(this.animTimer/8)%2===0?this.sprites['mario-walk']||null:this.sprites['mario-idle']||null;
        return this.sprites['mario-idle']||null;
    }

    drawMario(player,cameraX){
        if(player.isInvincible&&player.invincibleTimer>0&&!player.isStar&&Math.floor(player.invincibleTimer/4)%2===0)return;
        const x=player.x-cameraX,y=player.y;
        if(!player.alive){const w=28,h=32,MR='#e52521',MS='#f8d8b0',MB='#3030e0';this.ctx.fillStyle=MR;this.ctx.fillRect(x+8,y+12,12,10);this.ctx.fillRect(x,y+4,6,10);this.ctx.fillRect(x+w-6,y+4,6,10);this.ctx.fillStyle=MS;this.ctx.fillRect(x+8,y+4,12,8);this.ctx.fillRect(x+2,y,4,6);this.ctx.fillRect(x+w-6,y,4,6);this.ctx.fillStyle='#000';this.ctx.fillRect(x+11,y+6,2,2);this.ctx.fillRect(x+15,y+6,2,2);this.ctx.fillStyle=MB;this.ctx.fillRect(x+4,y+22,8,10);this.ctx.fillRect(x+w-12,y+22,8,10);this.ctx.fillStyle=MS;this.ctx.fillRect(x+4,y+28,8,4);this.ctx.fillRect(x+w-12,y+28,8,4);return;}
        this.ctx.save();if(!player.facingRight){const fx=player.isBig&&!player.isDucking?x+14:x+player.width/2;this.ctx.translate(fx,0);this.ctx.scale(-1,1);this.ctx.translate(-fx,0);}
        const sprite=this.getMarioSprite(player);
        if(player.isBig&&!player.isDucking){
            if(sprite){this.ctx.imageSmoothingEnabled=false;this.ctx.drawImage(sprite,x-7,y,42,42);this.ctx.imageSmoothingEnabled=true;}
            else{this.ctx.fillStyle='#e52521';this.ctx.fillRect(x,y,32,32);this.ctx.fillStyle='#f8d8b0';this.ctx.fillRect(x+6,y+8,20,8);this.ctx.fillStyle='#3030e0';this.ctx.fillRect(x+5,y+32,11,6);this.ctx.fillRect(x+16,y+32,11,6);}
        }else if(player.isDucking&&player.isBig){
            if(this.sprites['mario-idle']){this.ctx.imageSmoothingEnabled=false;this.ctx.drawImage(this.sprites['mario-idle'],x-7,y,42,30);this.ctx.imageSmoothingEnabled=true;}
            else{this.ctx.fillStyle='#e52521';this.ctx.fillRect(x,y,player.width,player.height);}
        }else{
            if(sprite){this.ctx.imageSmoothingEnabled=false;this.ctx.drawImage(sprite,x-2,y-2,CONFIG.TILE_SIZE,CONFIG.TILE_SIZE);this.ctx.imageSmoothingEnabled=true;}
            else{this.ctx.fillStyle='#e52521';this.ctx.fillRect(x,y,player.width,player.height);this.ctx.fillStyle='#f8d8b0';this.ctx.fillRect(x+4,y+4,player.width-8,10);this.ctx.fillStyle='#3030e0';this.ctx.fillRect(x+2,y+14,player.width-4,12);}
        }
        if(player.isStar){const sc=['#ff0000','#00ff00','#0088ff','#ffff00','#ff00ff'];const ci=Math.floor(this.animTimer/4)%sc.length;this.ctx.globalCompositeOperation='source-atop';this.ctx.fillStyle=sc[ci];this.ctx.globalAlpha=0.4;this.ctx.fillRect(x-10,y-5,player.width+20,player.height+10);this.ctx.globalAlpha=1;this.ctx.globalCompositeOperation='source-over';}
        this.ctx.restore();
    }

    drawGoomba(enemy,cameraX){
        if(!enemy.alive&&!enemy.squished)return;const x=enemy.x-cameraX,y=enemy.y;if(x<-32||x>CONFIG.SCREEN_WIDTH+32)return;
        if(this.sprites.goomba){this.ctx.imageSmoothingEnabled=false;if(enemy.squished)this.ctx.drawImage(this.sprites.goomba,x-1,y+enemy.height-10,enemy.width+2,10);else{const wobble=Math.sin(this.animTimer*0.15)*1;this.ctx.drawImage(this.sprites.goomba,x-1,y+wobble,enemy.width+2,enemy.height);}this.ctx.imageSmoothingEnabled=true;}
        else{if(enemy.squished){this.ctx.fillStyle='#b4641e';this.ctx.fillRect(x,y+14,enemy.width,14);}else{this.ctx.fillStyle='#b4641e';this.ctx.fillRect(x+2,y+4,enemy.width-4,16);this.ctx.fillStyle='#c8742e';this.ctx.fillRect(x+4,y+2,enemy.width-8,6);this.ctx.fillStyle='#000';this.ctx.fillRect(x+8,y+8,3,3);this.ctx.fillRect(x+16,y+8,3,3);this.ctx.fillStyle='#000';this.ctx.fillRect(x+2,y+20,8,8);this.ctx.fillRect(x+18,y+20,8,8);}}
    }
"""
with open(path, 'a', encoding='utf-8') as f:
    f.write(remaining)
print("Part 2a done")
