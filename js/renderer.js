class Renderer {
    constructor(ctx) {
        this.ctx = ctx;
        this.sprites = {};
        this.loaded = false;
        this.animTimer = 0;
        this.currentLevel = 1;
        this.theme = null;
        this.mushroomSprite = null;
        this.bubbleSystem = new BubbleSystem(20);
    }

    async loadSprites() {
        const spriteList = {
            'mario-idle':'img/mario-idle.png','mario-walk':'img/mario-walk.png','mario-jump':'img/mario-jump.png',
            'goomba':'img/goomba.png','coin':'img/coin.png','ground':'img/ground.png','brick':'img/brick.png',
            'stair':'img/stair.png','question':'img/question-block.png','used':'img/used-block.png','pipe':'img/pipe.png',
        };
        const promises = Object.entries(spriteList).map(([n,s])=>new Promise(r=>{const i=new Image();i.onload=()=>{this.sprites[n]=i;r()};i.onerror=r;i.src=s}));
        await Promise.all(promises);
        this.loaded = true;
        this.mushroomSprite = this.generateMushroomSprite();
    }

    generateMushroomSprite() {
        const c=document.createElement('canvas');c.width=16;c.height=16;const g=c.getContext('2d');
        const R='#e52521',W='#fff',S='#f8d8b0',B='#000';
        g.fillStyle=R;g.fillRect(5,0,6,1);g.fillRect(3,1,10,1);
        g.fillRect(2,2,12,1);g.fillStyle=W;g.fillRect(2,2,3,1);g.fillStyle=R;g.fillRect(5,2,6,1);g.fillStyle=W;g.fillRect(11,2,3,1);
        g.fillStyle=R;g.fillRect(1,3,14,1);g.fillStyle=W;g.fillRect(1,3,4,1);g.fillStyle=R;g.fillRect(5,3,6,1);g.fillStyle=W;g.fillRect(11,3,4,1);
        g.fillStyle=R;g.fillRect(1,4,14,1);g.fillStyle=W;g.fillRect(1,4,4,1);g.fillStyle=R;g.fillRect(5,4,6,1);g.fillStyle=W;g.fillRect(11,4,4,1);
        g.fillStyle=R;g.fillRect(0,5,16,1);g.fillRect(0,6,16,1);g.fillRect(1,7,14,1);g.fillRect(2,8,12,1);
        g.fillStyle=S;g.fillRect(5,9,6,1);g.fillRect(4,10,8,1);g.fillStyle=B;g.fillRect(6,10,1,1);g.fillStyle=S;g.fillRect(7,10,2,1);g.fillStyle=B;g.fillRect(9,10,1,1);
        g.fillStyle=S;g.fillRect(4,11,8,1);g.fillStyle=B;g.fillRect(6,11,1,1);g.fillStyle=S;g.fillRect(7,11,2,1);g.fillStyle=B;g.fillRect(9,11,1,1);
        g.fillStyle=S;g.fillRect(5,12,6,1);g.fillStyle=W;g.fillRect(4,13,8,1);g.fillRect(3,14,10,1);g.fillRect(3,15,10,1);
        return c;
    }

    setLevel(level){this.currentLevel=level;}

    clear(cameraX){
        this.animTimer++;const l=this.currentLevel;
        if(l===4){
            this.ctx.fillStyle='#000';this.ctx.fillRect(0,0,CONFIG.SCREEN_WIDTH,CONFIG.SCREEN_HEIGHT);
            const g=this.ctx.createLinearGradient(0,CONFIG.SCREEN_HEIGHT-120,0,CONFIG.SCREEN_HEIGHT);
            g.addColorStop(0,'rgba(200,30,0,0)');g.addColorStop(1,'rgba(200,30,0,0.15)');
            this.ctx.fillStyle=g;this.ctx.fillRect(0,CONFIG.SCREEN_HEIGHT-120,CONFIG.SCREEN_WIDTH,120);
            if(cameraX!==undefined)for(let i=0;i<6;i++){
                const tx=i*200-(cameraX%200)+80,ty=60,f=Math.sin(this.animTimer*0.2+i*1.5)*3;
                this.ctx.fillStyle='rgba(255,136,0,0.08)';this.ctx.beginPath();this.ctx.arc(tx,ty+f,30,0,Math.PI*2);this.ctx.fill();
            }
        }else if(l===2){
            const g=this.ctx.createLinearGradient(0,0,0,CONFIG.SCREEN_HEIGHT);
            g.addColorStop(0,'#001a33');g.addColorStop(0.3,'#002244');g.addColorStop(0.6,'#003355');g.addColorStop(1,'#004466');
            this.ctx.fillStyle=g;this.ctx.fillRect(0,0,CONFIG.SCREEN_WIDTH,CONFIG.SCREEN_HEIGHT);
            if(cameraX!==undefined)for(let i=0;i<6;i++){
                const rx=i*180+Math.sin(this.animTimer*0.005+i)*30-(cameraX*0.05%180);
                this.ctx.fillStyle='rgba(180,220,255,0.03)';this.ctx.beginPath();this.ctx.moveTo(rx,0);this.ctx.lineTo(rx+30,0);
                this.ctx.lineTo(rx+60,CONFIG.SCREEN_HEIGHT);this.ctx.lineTo(rx-20,CONFIG.SCREEN_HEIGHT);this.ctx.closePath();this.ctx.fill();
            }
            this.bubbleSystem.update();
            for(const b of this.bubbleSystem.getBubbles()){
                this.ctx.fillStyle='rgba(200,230,255,'+b.alpha*0.5+')';this.ctx.beginPath();this.ctx.arc(b.x,b.y,b.size,0,Math.PI*2);this.ctx.fill();
            }
        }else if(l===3){
            this.ctx.fillStyle='#0a0a2a';this.ctx.fillRect(0,0,CONFIG.SCREEN_WIDTH,CONFIG.SCREEN_HEIGHT);
            if(cameraX!==undefined){
                for(let i=0;i<30;i++){const sx=(i*137+50)%CONFIG.SCREEN_WIDTH,sy=(i*97+30)%~~(CONFIG.SCREEN_HEIGHT*0.55);const f=Math.sin(this.animTimer*0.03+i*2.3)>0.2?1:0.3,s=1+i%2;this.ctx.fillStyle='rgba(255,255,255,'+(0.2+f*0.8)+')';this.ctx.fillRect(sx,sy,s,s);}
                const mx=CONFIG.SCREEN_WIDTH-120,my=50;
                this.ctx.fillStyle='#ffffcc';this.ctx.beginPath();this.ctx.arc(mx,my,28,0,Math.PI*2);this.ctx.fill();
                this.ctx.fillStyle='#0a0a2a';this.ctx.beginPath();this.ctx.arc(mx+8,my-4,24,0,Math.PI*2);this.ctx.fill();
                this.ctx.fillStyle='rgba(255,255,200,0.05)';this.ctx.beginPath();this.ctx.arc(mx,my,60,0,Math.PI*2);this.ctx.fill();
                this.ctx.fillStyle='#0d0d1a';for(let i=0;i<5;i++){const hx=i*350-(cameraX*0.1%350),hy=CONFIG.SCREEN_HEIGHT-40;this.ctx.beginPath();this.ctx.arc(hx+50,hy,60,Math.PI,0);this.ctx.arc(hx+120,hy,45,Math.PI,0);this.ctx.fill();}
            }
            this.ctx.fillStyle='rgba(0,0,0,0.2)';this.ctx.fillRect(0,CONFIG.SCREEN_HEIGHT-48,CONFIG.SCREEN_WIDTH,48);
        }else if(l===1){
            this.ctx.fillStyle='#5c94fc';this.ctx.fillRect(0,0,CONFIG.SCREEN_WIDTH,CONFIG.SCREEN_HEIGHT);
            if(cameraX!==undefined){
                const cp=cameraX*0.15;this.ctx.fillStyle='rgba(255,255,255,0.9)';for(let i=0;i<4;i++){const cx=i*400-(cp%400)+50,cy=60+(i%3)*50;this.ctx.beginPath();this.ctx.arc(cx,cy,28,0,Math.PI*2);this.ctx.arc(cx+30,cy-6,32,0,Math.PI*2);this.ctx.arc(cx+60,cy,26,0,Math.PI*2);this.ctx.fill();}
                const mp=cameraX*0.3;for(let i=0;i<5;i++){const mx=i*480-(mp%480),my1=CONFIG.SCREEN_HEIGHT-120;this.ctx.fillStyle='#4a8c4a';this.ctx.beginPath();this.ctx.moveTo(mx,my1+40);this.ctx.lineTo(mx+60,my1-40);this.ctx.lineTo(mx+120,my1+40);this.ctx.closePath();this.ctx.fill();this.ctx.fillStyle='#3a7c3a';this.ctx.beginPath();this.ctx.moveTo(mx+20,my1+40);this.ctx.lineTo(mx+60,my1-40);this.ctx.lineTo(mx+60,my1+40);this.ctx.closePath();this.ctx.fill();}
                const bp=cameraX*0.5;for(let i=0;i<10;i++){const bx=i*220-(bp%220)+50,by2=CONFIG.SCREEN_HEIGHT-88;this.ctx.fillStyle='#2e8b2e';this.ctx.beginPath();this.ctx.arc(bx,by2,12,Math.PI,0);this.ctx.arc(bx+16,by2-2,10,Math.PI,0);this.ctx.arc(bx+30,by2,12,Math.PI,0);this.ctx.fill();this.ctx.fillRect(bx-12,by2,54,6);}
            }
        }
    }

    drawTiles(levelMap,cameraX,flagY){
        this.animTimer++;const startCol=Math.max(0,Math.floor(cameraX/CONFIG.TILE_SIZE));const endCol=Math.min(levelMap[0].length,Math.ceil((cameraX+CONFIG.SCREEN_WIDTH)/CONFIG.TILE_SIZE)+1);const l=this.currentLevel;let fpc=-1;
        for(let r=0;r<levelMap.length;r++)for(let c=startCol;c<endCol;c++){const t=levelMap[r][c];if(t===0)continue;if(t===9)fpc=c;const tx=c*CONFIG.TILE_SIZE-cameraX,ty=r*CONFIG.TILE_SIZE,T=CONFIG.TILE_SIZE;if(l===4)this.drawCastleTile(t,tx,ty,T,levelMap,r,c);else if(l===2)this.drawWaterTile(t,tx,ty,T,levelMap,r,c);else if(l===3)this.drawNightTile(t,tx,ty,T,levelMap,r,c);else this.drawOverworldTile(t,tx,ty,T,levelMap,r,c);}
        if(flagY!==undefined&&fpc>=0){const px=fpc*CONFIG.TILE_SIZE-cameraX;if(px>-CONFIG.TILE_SIZE&&px<CONFIG.SCREEN_WIDTH+CONFIG.TILE_SIZE){this.ctx.fillStyle='#228b22';this.ctx.beginPath();this.ctx.moveTo(px+18,flagY+2);this.ctx.lineTo(px+30,flagY+10);this.ctx.lineTo(px+18,flagY+18);this.ctx.closePath();this.ctx.fill();}}
    }

    drawOverworldTile(tile,tx,ty,T,lm,r,c){
        if(tile===26||tile===18)return;
        switch(tile){
            case 1:
                if(r===0||lm[r-1][c]===0){this.ctx.fillStyle='#4cad4c';this.ctx.fillRect(tx,ty,T,T);this.ctx.fillStyle='#5cbf5c';this.ctx.fillRect(tx,ty,T,6);this.ctx.fillStyle='#3d8b3d';for(let gx=tx+2;gx<tx+T;gx+=6)this.ctx.fillRect(gx,ty+6,2,4);this.ctx.fillStyle='#c8641e';this.ctx.fillRect(tx,ty+14,T,T-14);}
                else{this.ctx.fillStyle='#c8641e';this.ctx.fillRect(tx,ty,T,T);this.ctx.fillStyle='#b5571a';this.ctx.fillRect(tx+4,ty+4,8,8);this.ctx.fillRect(tx+18,ty+16,10,8);}
                break;
            case 2:
                this.ctx.fillStyle='#c84c0c';this.ctx.fillRect(tx,ty,T,T);this.ctx.fillStyle='#e09050';this.ctx.fillRect(tx,ty,T,2);this.ctx.fillRect(tx,ty,2,T/2);this.ctx.fillRect(tx+T/2,ty+T/2,2,T/2);
                this.ctx.fillStyle='#983808';this.ctx.fillRect(tx,ty+T/2-1,T,2);this.ctx.fillRect(tx+T/2-1,ty,2,T/2);this.ctx.fillRect(tx+T-1,ty+T/2,1,T/2);this.ctx.fillRect(tx-1,ty+T/2,1,T/2);
                break;
            case 3:{
                const p=Math.sin(this.animTimer*0.08)*0.1+0.9;
                this.ctx.fillStyle='rgb('+Math.floor(255*p)+','+Math.floor(200*p)+',0)';this.ctx.fillRect(tx,ty,T,T);
                this.ctx.fillStyle='#b8860b';this.ctx.fillRect(tx,ty,T,2);this.ctx.fillRect(tx,ty,2,T);this.ctx.fillRect(tx+T-2,ty,2,T);this.ctx.fillRect(tx,ty+T-2,T,2);
                this.ctx.fillStyle='#fff';this.ctx.font='bold 18px monospace';this.ctx.textAlign='center';this.ctx.textBaseline='middle';this.ctx.fillText('?',tx+T/2,ty+T/2+1);
                this.ctx.fillStyle='#8b6914';this.ctx.fillRect(tx+4,ty+4,3,3);this.ctx.fillRect(tx+T-7,ty+4,3,3);this.ctx.fillRect(tx+4,ty+T-7,3,3);this.ctx.fillRect(tx+T-7,ty+T-7,3,3);
                break;
            }
            case 4:this.ctx.fillStyle='#2e8b2e';this.ctx.fillRect(tx,ty+8,T*2,T*2-8);this.ctx.fillStyle='#3cb43c';this.ctx.fillRect(tx+4,ty+8,8,T*2-8);this.ctx.fillStyle='#1a6b1a';this.ctx.fillRect(tx+T*2-6,ty+8,6,T*2-8);this.ctx.fillStyle='#2e8b2e';this.ctx.fillRect(tx-4,ty,T*2+8,12);this.ctx.fillStyle='#3cb43c';this.ctx.fillRect(tx-4,ty,T*2+8,3);this.ctx.fillStyle='#1a6b1a';this.ctx.fillRect(tx-4,ty+9,T*2+8,3);break;
            case 5:break;
            case 6:this.ctx.fillStyle='#2e8b2e';this.ctx.fillRect(tx,ty,T,T);this.ctx.fillStyle='#3cb43c';this.ctx.fillRect(tx+4,ty,8,T);this.ctx.fillStyle='#1a6b1a';this.ctx.fillRect(tx+T-4,ty,4,T);break;
            case 7:this.ctx.fillStyle='#2e8b2e';this.ctx.fillRect(tx,ty,T,T);this.ctx.fillStyle='#1a6b1a';this.ctx.fillRect(tx,ty,4,T);this.ctx.fillStyle='#3cb43c';this.ctx.fillRect(tx+T-12,ty,8,T);break;
            case 8:this.ctx.fillStyle='#8b7355';this.ctx.fillRect(tx,ty,T,T);this.ctx.fillStyle='#6b5335';this.ctx.fillRect(tx,ty,T,2);this.ctx.fillRect(tx,ty,2,T);this.ctx.fillRect(tx+T-2,ty,2,T);this.ctx.fillRect(tx,ty+T-2,T,2);this.ctx.fillStyle='#a08060';this.ctx.fillRect(tx+4,ty+4,T-8,T-8);break;
            case 9:this.ctx.fillStyle='#aaaaaa';this.ctx.fillRect(tx+14,ty,4,T);if(r===4){this.ctx.fillStyle='#ffd700';this.ctx.beginPath();this.ctx.arc(tx+16,ty+4,4,0,Math.PI*2);this.ctx.fill();}break;
            case 14:break;
            case 15:{
                this.ctx.fillStyle='#c84c0c';this.ctx.fillRect(tx,ty,T,T);this.ctx.fillStyle='#e09050';this.ctx.fillRect(tx,ty,T,2);this.ctx.fillRect(tx,ty,2,T/2);this.ctx.fillRect(tx+T/2,ty+T/2,2,T/2);
                this.ctx.fillStyle='#983808';this.ctx.fillRect(tx,ty+T/2-1,T,2);this.ctx.fillRect(tx+T/2-1,ty,2,T/2);const sh=Math.sin(this.animTimer*0.06)*0.15+0.15;
                this.ctx.fillStyle='rgba(255,215,0,'+sh+')';this.ctx.fillRect(tx+4,ty+4,T-8,T-8);break;
            }
            case 19:this.ctx.fillStyle='#606060';this.ctx.fillRect(tx,ty,T,T);this.ctx.fillStyle='#787878';this.ctx.fillRect(tx,ty,T,2);this.ctx.fillRect(tx,ty,2,T/2);this.ctx.fillRect(tx+T/2,ty+T/2,2,T/2);this.ctx.fillStyle='#484848';this.ctx.fillRect(tx,ty+T/2-1,T,2);this.ctx.fillRect(tx+T/2-1,ty,2,T/2);this.ctx.fillRect(tx+T-1,ty+T/2,1,T/2);if((c+r)%7===0){this.ctx.fillStyle='rgba(180,40,20,0.15)';this.ctx.fillRect(tx+4,ty+4,T-8,T-8);}break;
            case 20:this.ctx.fillStyle='#3a3a3a';this.ctx.fillRect(tx,ty,T,T);this.ctx.fillStyle='#505050';this.ctx.fillRect(tx,ty,T,2);this.ctx.fillRect(tx,ty,2,T);this.ctx.fillStyle='#2a2a2a';this.ctx.fillRect(tx+T-2,ty,2,T);this.ctx.fillRect(tx,ty+T-2,T,2);this.ctx.fillStyle='#454545';for(let d=0;d<T;d+=8)this.ctx.fillRect(tx+d,ty+d,2,2);break;
            case 21:this.ctx.fillStyle='#8b5e3c';this.ctx.fillRect(tx,ty,T,T);this.ctx.fillStyle='#a07050';this.ctx.fillRect(tx,ty,T,3);this.ctx.fillStyle='#6b3e1c';this.ctx.fillRect(tx,ty+T-2,T,2);this.ctx.fillStyle='#7a5030';this.ctx.fillRect(tx+10,ty+4,1,T-6);this.ctx.fillRect(tx+22,ty+4,1,T-6);this.ctx.fillStyle='#888';this.ctx.fillRect(tx+2,ty+4,2,2);this.ctx.fillRect(tx+T-4,ty+4,2,2);break;
            case 22:this.ctx.fillStyle='#666';this.ctx.fillRect(tx+8,ty+T-8,T-16,8);this.ctx.fillStyle='#888';this.ctx.fillRect(tx+10,ty+T-8,T-20,2);this.ctx.fillStyle='#8b4513';this.ctx.fillRect(tx+T/2-2,ty+4,4,T-12);this.ctx.fillStyle='#c0c0c0';this.ctx.fillRect(tx+T/2-10,ty+2,20,8);this.ctx.fillStyle='#e0e0e0';this.ctx.fillRect(tx+T/2-8,ty+3,16,3);this.ctx.fillStyle='#999';this.ctx.fillRect(tx+T/2-10,ty+8,20,2);const gl=Math.sin(this.animTimer*0.1)*0.3+0.3;this.ctx.fillStyle='rgba(255,255,255,'+gl+')';this.ctx.fillRect(tx+T/2-6,ty+4,4,2);break;
            case 23:{this.ctx.fillStyle='#666';this.ctx.fillRect(tx+T/2-3,ty+T/2,6,T/2);const ff=Math.floor(this.animTimer/6)%3,fh=8+ff*2,fw=6-ff;this.ctx.fillStyle='#ff8800';this.ctx.fillRect(tx+T/2-fw/2,ty+T/2-fh,fw,fh);this.ctx.fillStyle='#ffcc00';this.ctx.fillRect(tx+T/2-1,ty+T/2-fh+2,2,fh-4);this.ctx.fillStyle='rgba(255,136,0,0.15)';this.ctx.beginPath();this.ctx.arc(tx+T/2,ty+T/2-fh/2,12,0,Math.PI*2);this.ctx.fill();break;}
        }
    }

    drawWaterTile(tile,tx,ty,T,lm,r,c){
        if(tile===27){this.ctx.fillStyle='#004466';this.ctx.fillRect(tx,ty,T,T);this.ctx.fillStyle='#005577';this.ctx.fillRect(tx,ty,T,4);this.ctx.fillStyle='#003355';this.ctx.fillRect(tx+4,ty+10,8,6);this.ctx.fillRect(tx+18,ty+20,10,6);if((c+r*3)%5===0){const sway=Math.sin(this.animTimer*0.04+c*0.5)*3;this.ctx.fillStyle='#006644';this.ctx.fillRect(tx+12+sway,ty-14,5,16);this.ctx.fillStyle='#008855';this.ctx.fillRect(tx+14+sway,ty-20,3,10);}return;}
        if(tile===24){this.ctx.fillStyle='#006688';this.ctx.fillRect(tx,ty,T,T);this.ctx.fillStyle='#0088aa';this.ctx.fillRect(tx,ty,T,2);this.ctx.fillRect(tx,ty,2,T/2);this.ctx.fillRect(tx+T/2,ty+T/2,2,T/2);this.ctx.fillStyle='#004466';this.ctx.fillRect(tx,ty+T/2-1,T,2);this.ctx.fillRect(tx+T/2-1,ty,2,T/2);this.ctx.fillStyle='#003355';this.ctx.fillRect(tx+T-1,ty+T/2,1,T/2);this.ctx.fillRect(tx-1,ty+T/2,1,T/2);return;}
        if(tile===25){this.ctx.fillStyle='#0077aa';this.ctx.fillRect(tx,ty,T,T);this.ctx.fillStyle='#0099cc';this.ctx.fillRect(tx,ty,T,2);this.ctx.fillRect(tx,ty,2,T);this.ctx.fillRect(tx+T-2,ty,2,T);this.ctx.fillRect(tx,ty+T-2,T,2);this.ctx.fillStyle='#ffcc00';this.ctx.font='bold 18px monospace';this.ctx.textAlign='center';this.ctx.textBaseline='middle';this.ctx.fillText('?',tx+T/2,ty+T/2+1);return;}
        if(tile===14||tile===9)return;
        if(tile>=4&&tile<=7){this.ctx.fillStyle='#0088aa';this.ctx.fillRect(tx,ty,T,T);if(tile===4||tile===5){this.ctx.fillStyle='#00aacc';this.ctx.fillRect(tx,ty,T,4);}if(tile===4||tile===6){this.ctx.fillStyle='#00aacc';this.ctx.fillRect(tx,ty,4,T);}return;}
        if(tile===8||tile===15||tile===2||tile===3)this.drawOverworldTile(tile,tx,ty,T,lm,r,c);
    }


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
