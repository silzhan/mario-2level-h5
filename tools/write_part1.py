import sys

path = r"E:/github/mario-2level-h5/js/renderer.js"

# Read the reference renderer and combine with World 2 additions
parts = []

# ============ PART 1: Class header, sprite loading, clear, drawTiles, tile drawers ============
parts.append('''class Renderer {
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
''')
with open(path,'w') as f:
    f.write(parts[0])
print("Part 1 written", len(parts[0]), "bytes")