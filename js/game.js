class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.state = new GameState();
        this.renderer = new Renderer(this.ctx);
        this.scoreElement = document.getElementById('score');
        this.coinsElement = document.getElementById('coins');
        this.worldElement = document.getElementById('world');
        this.timeElement = document.getElementById('time');
        this.livesElement = document.getElementById('lives');
        this.overlay = document.getElementById('overlay');
        this.overlayText = document.getElementById('overlayText');
        this.subText = document.getElementById('subText');
        this.input = new InputHandler(this.canvas);
        this.cameraX = 0;
        this.levelWidth = 210 * CONFIG.TILE_SIZE;
        this.titleScreen = document.getElementById('titleScreen');
        this.started = false;
        this.paused = false;
        this.selectedLevel = 1;
        this.isWaterLevel = false;
        this.liftPlatforms = [];
        this.bloopers = [];
        this.cheepCheeps = [];
        this.init();
    }

    async init() {
        document.querySelectorAll('.level-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectedLevel = parseInt(btn.dataset.level);
                this.startGame();
            });
        });
        document.addEventListener('keydown', (e) => {
            if (!this.started && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); this.selectedLevel = 1; this.startGame(); }
            if (!this.started) { const n = parseInt(e.key); if (n >= 1 && n <= 4) { this.selectedLevel = n; this.startGame(); } }
            if (e.key === 'p' || e.key === 'P') { if (this.started) this.togglePause(); e.preventDefault(); }
            if (e.key === 'Escape') { if (this.started) { this.started = false; this.titleScreen.style.display = 'flex'; if (window.music) music.stop(); } e.preventDefault(); }
        });
        window.music = new Music();
    }

    startGame() {
        if (this.started) return;
        this.started = true;
        this.titleScreen.style.display = 'none';
        this.state.currentLevel = this.selectedLevel;
        this.renderer.loadSprites().then(() => {
            this.titleScreen.style.display = 'none';
            this.reset();
            this.gameLoop();
            this.playLevelMusic();
        });
    }

    playLevelMusic() {
        if (window.music) {
            if (this.state.currentLevel === 4) window.music.playCastle();
            else if (this.state.currentLevel === 2) window.music.playUnderwater();
            else if (this.state.currentLevel === 3) window.music.playNight();
            else window.music.playOverworld();
        }
    }

    reset() {
        this.state.state = this.state.PLAYING;
        this.paused = false;
        this.overlay.style.display = 'none';
        this.isWaterLevel = (this.state.currentLevel === 2);
        const spawnY = this.isWaterLevel ? 6 * CONFIG.TILE_SIZE : 11 * CONFIG.TILE_SIZE;
        this.player = new Mario(3 * CONFIG.TILE_SIZE, spawnY);
        this.player.isInvincible = true;
        this.player.invincibleTimer = 180;
        this.input.setPlayer(this.player);
        this.input.setResetCallback(() => this.reset());
        this.enemies = []; this.coins = []; this.mushrooms = [];
        this.fireballs = []; this.fireworks = []; this.hammers = [];
        this.multiCoinHits = {};
        this.timeLeft = this.state.currentLevel === 3 ? 450 * 60 : 400 * 60;
        if (this.lives === undefined) this.lives = 3;
        this.activatedHiddenBlocks = new Set();
        this.piranhaPlants = []; this.movingPlatforms = [];
        this.fallingPlatforms = []; this.springboards = [];
        this.podoboos = []; this.fireBars = [];
        this.bowser = null; this.bossRoom = false;
        this.bossTriggered = false; this.bridgeCollapsed = false;
        this.bridgeCollapseIndex = 0; this.bridgeCollapseTimer = 0;
        this.princessMessage = false; this.princessTimer = 0;
        this.scorePopups = [];
        this.liftPlatforms = []; this.bloopers = []; this.cheepCheeps = [];
        this.buildLevel();
        this.setupLiftPlatforms();
        this.spawnEnemies(); this.spawnCoins();
        this.spawnPiranhaPlants(); this.setupPodoboos(); this.setupFireBars();
        this.cameraX = 0;
        this.updateWorldDisplay();
    }
    buildLevel() {
        this.tiles = [];
        this.levelMap = generateWorld2Map(this.state.currentLevel);
        this.levelWidth = this.levelMap[0].length * CONFIG.TILE_SIZE;
        this.renderer.setLevel(this.state.currentLevel);
        for (let r=0;r<this.levelMap.length;r++) for (let c=0;c<this.levelMap[r].length;c++) {
            const t=this.levelMap[r][c];
            if(t!==0&&t!==26) this.tiles.push({x:c*CONFIG.TILE_SIZE,y:r*CONFIG.TILE_SIZE,width:CONFIG.TILE_SIZE,height:CONFIG.TILE_SIZE,type:t});
        }
    }
    setupLiftPlatforms(){
        if(this.state.currentLevel!==3)return;
        const T=CONFIG.TILE_SIZE,cs=[
            {c:42,r:8,w:2,ty:'v',sp:0.8,rn:3},{c:46,r:8,w:2,ty:'v',sp:1.0,rn:3},{c:50,r:8,w:2,ty:'v',sp:0.7,rn:4},
            {c:80,r:8,w:2,ty:'h',sp:1.2,rn:4},{c:85,r:8,w:2,ty:'h',sp:1.5,rn:5},{c:90,r:8,w:2,ty:'h',sp:1.0,rn:4},
            {c:96,r:7,w:2,ty:'v',sp:1.3,rn:4},{c:102,r:7,w:2,ty:'v',sp:1.1,rn:3},
            {c:132,r:8,w:2,ty:'v',sp:1.0,rn:4},{c:136,r:8,w:2,ty:'h',sp:1.3,rn:5},{c:140,r:7,w:2,ty:'v',sp:1.4,rn:4},
            {c:144,r:7,w:2,ty:'h',sp:1.6,rn:5},{c:148,r:8,w:2,ty:'v',sp:1.2,rn:3},{c:152,r:8,w:2,ty:'h',sp:1.5,rn:4},
            {c:172,r:8,w:2,ty:'v',sp:1.8,rn:4},{c:178,r:8,w:2,ty:'v',sp:2.0,rn:5},{c:184,r:8,w:2,ty:'v',sp:1.5,rn:3},
            {c:192,r:7,w:2,ty:'v',sp:2.2,rn:4},{c:196,r:7,w:2,ty:'v',sp:1.9,rn:4}
        ];
        for(const cg of cs){
            const x=cg.c*T,y=cg.r*T,p={speed:cg.sp,color:'#aa8833'};
            if(cg.ty==='v'){p.minY=y;p.maxY=y+cg.rn*T}else{p.minX=x;p.maxX=x+cg.rn*T}
            this.liftPlatforms.push(new LiftPlatform(x,y,cg.w,cg.ty==='v'?'vertical':'horizontal',p));
        }
    }
    spawnEnemies(){
        const lv=this.state.currentLevel,T=CONFIG.TILE_SIZE;
        if(lv===1){
            [12,16,20,35,40,55,60,65,80,85,98,105,110,122,125,130,145,150,160,175].forEach(c=>this.enemies.push(new Goomba(c*T,11*T)));
            [25,45,70,100,135,155].forEach(c=>this.enemies.push(new Koopa(c*T,10*T,'green')));
            [32,52,78,115,140,165].forEach(c=>this.enemies.push(new Koopa(c*T,10*T,'red')));
        }else if(lv===2){
            [40,70,100,130,160,190].forEach(c=>this.bloopers.push(new Blooper(c*T,5*T+Math.random()*3*T)));
            [25,35,45,55,65,75,85,95,105,115,125,135,145,155,165,175,185,195].forEach((c,i)=>{
                this.cheepCheeps.push(new CheepCheep(c*T,4*T+(i%5)*T,i%3===0?'gray':'red'));
            });
        }else if(lv===3){
            [10,15,25,35,60,62,68,112,115,120,125,158,160,162].forEach(c=>this.enemies.push(new Goomba(c*T,11*T)));
            [30,70,118,163].forEach(c=>this.enemies.push(new Koopa(c*T,10*T,'green')));
            [28,65,116,165].forEach(c=>this.enemies.push(new Koopa(c*T,10*T,'red')));
            this.enemies.push(new Paratroopa(82*T,5*T,'green','vertical'));
            this.enemies.push(new Paratroopa(92*T,6*T,'green','vertical'));
            this.enemies.push(new Paratroopa(140*T,5*T,'red','horizontal'));
            this.enemies.push(new Paratroopa(150*T,4*T,'green','vertical'));
            this.enemies.push(new Paratroopa(180*T,5*T,'green','vertical'));
            this.enemies.push(new Paratroopa(195*T,4*T,'red','horizontal'));
        }else if(lv===4){
            [10,15,24,35,42,55,65,72,82,95,105,115,122,135,142].forEach(c=>this.enemies.push(new Goomba(c*T,11*T)));
            [20,40,60,85,110,130].forEach(c=>this.enemies.push(new Koopa(c*T,10*T,'green')));
            [28,50,75,100,125].forEach(c=>this.enemies.push(new Koopa(c*T,10*T,'red')));
            this.enemies.push(new Paratroopa(65*T,5*T,'green','vertical'));
            this.enemies.push(new Paratroopa(110*T,4*T,'red','horizontal'));
            this.enemies.push(new HammerBro(70*T,6*T));
            this.enemies.push(new HammerBro(105*T,5*T));
            this.enemies.push(new HammerBro(140*T,5*T));
        }
    }
    spawnCoins(){
        const T=CONFIG.TILE_SIZE,lv=this.state.currentLevel,ad=ps=>ps.forEach(([r,c])=>this.coins.push(new Coin(c*T+8,r*T+4,false)));
        if(lv===1)ad([[8,14],[8,18],[8,22],[7,40],[7,43],[8,55],[8,62],[8,80],[8,98],[8,109],[8,122],[8,134],[8,146],[8,161],[8,171]]);
        else if(lv===2)ad([[9,6],[8,16],[7,21],[9,36],[7,43],[6,53],[7,54],[9,61],[7,82],[6,86],[9,91],[7,96],[5,106],[9,111],[8,131],[6,136],[7,146],[5,152],[9,159],[7,182],[6,186],[9,191],[7,196]]);
        else if(lv===3)ad([[8,16],[8,23],[8,32],[7,42],[7,46],[6,81],[6,86],[6,91],[6,97],[6,103],[7,133],[7,137],[7,140],[7,145],[7,149],[7,153],[8,173],[8,179],[8,185],[7,193],[7,197]]);
        else if(lv===4)ad([[8,6],[8,10],[8,43],[8,55],[6,68],[6,70],[8,81],[8,93],[8,98],[6,138],[6,150]]);
    }
    spawnPiranhaPlants(){
        const lv=this.state.currentLevel,ad=ps=>ps.forEach(([c,r])=>this.piranhaPlants.push(new PiranhaPlant(c,r)));
        if(lv===1)ad([[22,9],[45,9],[75,9],[138,9]]);else if(lv===3)ad([[12,9],[65,9],[118,9],[158,9]]);else if(lv===2)ad([[65,9],[115,9]]);else if(lv===4)ad([[14,9],[148,9]]);
    }
    setupPodoboos(){if(this.state.currentLevel!==4)return;const T=CONFIG.TILE_SIZE;for(const c of[19,31,51,77,89,101,109,117,146])this.podoboos.push(new Podoboo(c*T,12*T,12*T-160));}
    setupFireBars(){if(this.state.currentLevel!==4)return;const T=CONFIG.TILE_SIZE;this.fireBars.push(new FireBar(42*T+16,8*T,5,80,0.04,true));this.fireBars.push(new FireBar(52*T+16,9*T,4,64,0.045,false));this.fireBars.push(new FireBar(102*T+16,9*T,5,80,0.05,true));this.fireBars.push(new FireBar(113*T+16,9*T,5,80,0.04,false));this.fireBars.push(new FireBar(125*T+16,9*T,6,96,0.055,true));}
    getPowerUpType(row,col){
        const lv=this.state.currentLevel;
        if(lv===1){if(row===5&&col===56||row===7&&col===104)return'fire';if(row===5&&col===104)return'star';if(row===5&&col===10)return'1up';return'super';}
        if(lv===2){if(row===5&&col===56||row===4&&col===106)return'fire';if(row===4&&col===100)return'star';if(row===3&&col===50||row===3&&col===145)return'1up';return'super';}
        if(lv===3){if(row===5&&col===61)return'fire';if(row===5&&col===162)return'star';if(row===5&&col===15)return'1up';return'super';}
        if(lv===4){if(row===9&&col===43||row===9&&col===55)return'fire';if(row===4&&col===148)return'star';if(row===4&&col===69)return'1up';return'super';}
        return'super';
    }
    collides(a,b){return a.x<b.x+b.width&&a.x+a.width>b.x&&a.y<b.y+b.height&&a.y+a.height>b.y;}
    spawnScorePopup(x,y,s){this.scorePopups.push({x,y:y-24,text:'+'+s,life:0,maxLife:45});}
    updateCamera(){const tx=this.player.x-CONFIG.SCREEN_WIDTH/3;this.cameraX+=(tx-this.cameraX)*0.1;if(this.cameraX<0)this.cameraX=0;if(this.cameraX>this.levelWidth-CONFIG.SCREEN_WIDTH)this.cameraX=this.levelWidth-CONFIG.SCREEN_WIDTH;}
    nextLevel(){if(this.state.currentLevel>=this.state.totalLevels){this.showOverlay('YOU WIN!','Final Score: '+this.player.score,true);if(window.music)music.stop();return;}this.state.currentLevel++;this.state.state=this.state.LEVEL_TRANSITION;this.showOverlay('WORLD 2-'+this.state.currentLevel,'Get Ready!',false);if(window.music)music.stop();setTimeout(()=>{this.hideOverlay();this.reset();this.playLevelMusic();},2000);}
    playAgain(){this.lives=3;this.reset();if(window.music){music.stop();this.playLevelMusic();}}
    togglePause(){if(this.state.state===this.state.LEVEL_TRANSITION)return;this.paused=!this.paused;}
    updateWorldDisplay(){if(this.worldElement)this.worldElement.textContent=this.state.getWorldLabel();this.updatePowerDisplay();}
    updatePowerDisplay(){const el=document.getElementById('power');if(!el)return;if(this.player&&this.player.isFire){el.textContent='\u25cf FIRE';el.style.color='#ff8800';}else if(this.player&&this.player.isStar){el.textContent='\u2605 STAR';el.style.color='#ffee00';}else if(this.player&&this.player.isBig){el.textContent='\u25cf SUPER';el.style.color='#ff6b6b';}else el.textContent='';}
    spawnFirework(x,y){const ps=[],cs=['#ff0000','#ffff00','#00ff00','#ff8800','#ffffff','#ff69b4'];for(let i=0;i<20;i++){const a=(i/20)*Math.PI*2,s=2+(i%3);ps.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,color:cs[i%cs.length],life:50+(i%3)*10});}this.fireworks.push({particles:ps});}
    showOverlay(text,sub,showBtn){this.overlayText.textContent=text;this.subText.textContent=sub;this.overlay.style.display='flex';const btn=document.getElementById('playAgainBtn');if(btn)btn.style.display=showBtn?'inline-block':'none';}
    hideOverlay(){this.overlay.style.display='none';}
    playerHurt(){if(this.player.isInvincible)return;if(this.player.isBig){this.player.shrink();this.player.invincibleTimer=120;if(window.music)music.hurt();}else this.playerDie();}
    playerDie(){this.player.alive=false;this.player.velY=-10;this.state.state=this.state.DEAD;if(window.music){music.stop();music.die();}}
    processBlockHit(tile){
        const row=Math.floor(tile.y/CONFIG.TILE_SIZE),col=Math.floor(tile.x/CONFIG.TILE_SIZE),key=row+'-'+col,type=tile.type;
        if((type===2||type===19)&&this.player.isBig){tile.type=0;this.levelMap[row][col]=0;this.player.score+=50;this.spawnScorePopup(tile.x+CONFIG.TILE_SIZE/2,tile.y,50);if(window.music)music.coin();}
        else if(type===14&&!this.activatedHiddenBlocks.has(key)){this.activatedHiddenBlocks.add(key);tile.type=8;this.levelMap[row][col]=8;this.coins.push(new Coin(tile.x+4,tile.y-30,true));this.player.coins++;this.player.score+=200;if(window.music)music.coin();const pt=this.getPowerUpType(row,col);if(pt)this.mushrooms.push(new Mushroom(tile.x,tile.y,pt,this.isWaterLevel));}
        else if(type===15){if(!this.multiCoinHits[key])this.multiCoinHits[key]=0;this.multiCoinHits[key]++;this.coins.push(new Coin(tile.x+4,tile.y-30,true));this.player.coins++;this.player.score+=200;if(window.music)music.coin();if(this.multiCoinHits[key]>=8){tile.type=8;this.levelMap[row][col]=8;}}
        else if(type===3){tile.type=8;this.levelMap[row][col]=8;this.coins.push(new Coin(tile.x+4,tile.y-30,true));this.player.coins++;this.player.score+=200;if(window.music)music.coin();const pt=this.getPowerUpType(row,col);if(pt)this.mushrooms.push(new Mushroom(tile.x,tile.y,pt,this.isWaterLevel));}
    }
    updateFlagpoleAnimation(){const fa=this.flagAnim;if(!fa)return;if(fa.phase==='slide'){fa.timer++;this.player.y+=3;const gy=12*CONFIG.TILE_SIZE-this.player.height;if(this.player.y>=gy){this.player.y=gy;this.player.onGround=true;fa.phase='walk';fa.timer=0;}}else if(fa.phase==='walk'){this.player.velX=2;this.player.x+=2;this.player.y=12*CONFIG.TILE_SIZE-this.player.height;this.player.onGround=true;this.player.facingRight=true;if(this.player.x>=fa.castleX){fa.phase='fireworks';fa.timer=180;this.player.velX=0;if(window.music)music.levelClear();}}else if(fa.phase==='fireworks'){fa.timer--;if(fa.timer%30===0&&fa.timer>0)this.spawnFirework(fa.castleX-100+(fa.timer*7)%200,150+(fa.timer*3)%100);for(const fw of this.fireworks){for(const p of fw.particles){p.x+=p.vx;p.y+=p.vy;p.vy+=0.05;p.life--;}fw.particles=fw.particles.filter(p=>p.life>0);}this.fireworks=this.fireworks.filter(fw=>fw.particles.length>0);if(fa.timer<=0)this.nextLevel();}}
    triggerBridgeCollapse(){this.bridgeCollapsed=true;this.bridgeCollapseIndex=0;this.bridgeCollapseTimer=0;this.player.isInvincible=true;this.player.invincibleTimer=180;if(this.bowser)this.bowser.velX=0;this.levelMap[10][194]=0;this.tiles=this.tiles.filter(t=>!(t.type===22&&Math.floor(t.x/CONFIG.TILE_SIZE)===194));if(window.music){music.stop();music.axeGrab();setTimeout(()=>{if(window.music)music.bridgeBreak();},200);}}
    updateBridgeCollapse(){this.bridgeCollapseTimer++;if(this.bridgeCollapseTimer%3===0&&this.bridgeCollapseIndex<31){const col=188-this.bridgeCollapseIndex;if(col>=158){this.levelMap[11][col]=0;this.tiles=this.tiles.filter(t=>!(t.type===21&&Math.floor(t.x/CONFIG.TILE_SIZE)===col));this.bridgeCollapseIndex++;}}if(this.bowser&&this.bowser.alive&&!this.bowser.falling&&this.bridgeCollapseIndex>10){this.bowser.startFalling();if(window.music)music.bowserFall();}if(this.bowser&&this.bowser.falling&&this.bowser.y>16*CONFIG.TILE_SIZE){this.bowser.alive=false;this.princessMessage=true;this.princessTimer=0;this.player.velX=0;this.player.x=192*CONFIG.TILE_SIZE;this.player.facingRight=true;if(window.music)music.levelClear();}}
    update(){
        if(this.state.state===this.state.LEVEL_TRANSITION){this.updateCamera();return;}
        if(this.state.state===this.state.DEAD){this.player.update(this.input.keys,this.tiles,this.isWaterLevel);this.updatePowerDisplay();if(this.player.y>this.levelMap.length*CONFIG.TILE_SIZE+100){this.lives--;if(this.lives>0)this.reset();else{this.state.state=-1;this.showOverlay('GAME OVER','Final Score: '+this.player.score,true);if(window.music)music.stop();}}return;}
        if(this.state.state===this.state.FLAGPOLE){this.updateFlagpoleAnimation();this.updateCamera();this.scoreElement.textContent=this.player.score;this.coinsElement.textContent=this.player.coins;this.updatePowerDisplay();return;}
        if(this.state.state!==this.state.PLAYING)return;
        this.player.update(this.input.keys,this.tiles,this.isWaterLevel);this.updateCamera();
        for(const p of this.liftPlatforms){p.update();if(p.isPlayerOnTop(this.player)){this.player.y=p.y-this.player.height;this.player.x+=p.getDeltaX();this.player.y+=p.getDeltaY();this.player.velY=0;this.player.onGround=true;}}
        const pb=this.player.getBounds();
        if(this.state.currentLevel===4){
            if(!this.bossTriggered&&this.player.x>=152*CONFIG.TILE_SIZE){this.bossTriggered=true;this.bossRoom=true;this.bowser=new Bowser(175*CONFIG.TILE_SIZE,9*CONFIG.TILE_SIZE);this.bowser.setBridgeRange(158*CONFIG.TILE_SIZE,188*CONFIG.TILE_SIZE);if(window.music&&typeof music.playBoss==='function'){music.stop();music.playBoss();}}
            for(const p of this.podoboos)p.update();for(const f of this.fireBars)f.update();if(this.bowser&&this.bowser.alive)this.bowser.update(this.tiles);
            for(const p of this.podoboos){if(!p.alive||p.state==='waiting')continue;if(this.collides(pb,p.getBounds()))this.playerDie();}
            for(const f of this.fireBars){for(let i=0;i<f.numBalls;i++){if(this.collides(pb,f.getBallBounds(i)))this.playerHurt();}}
            if(this.bowser&&this.bowser.alive&&!this.bowser.falling){if(this.collides(pb,this.bowser.getBounds()))this.playerHurt();for(const fb of this.bowser.fireballs){if(!fb.alive)continue;if(this.collides(pb,fb.getBounds())){this.playerHurt();fb.alive=false;}}}
            if(!this.bridgeCollapsed&&this.player.x>=194*CONFIG.TILE_SIZE-8)this.triggerBridgeCollapse();
            if(this.bridgeCollapsed&&!this.princessMessage)this.updateBridgeCollapse();
            if(this.princessMessage){this.princessTimer++;this.player.velX=0;if(this.princessTimer>300){this.showOverlay('THANK YOU MARIO!','But our princess is in another castle!',true);this.state.state=this.state.WIN;if(window.music){music.stop();music.levelClear();}}}
            const pc=Math.floor((this.player.x+this.player.width/2)/CONFIG.TILE_SIZE),pr=Math.floor((this.player.y+this.player.height)/CONFIG.TILE_SIZE);
            if(pr>=0&&pr<this.levelMap.length&&pc>=0&&pc<this.levelMap[0].length)if(isLavaTile(this.levelMap[pr][pc])&&this.state.state===this.state.PLAYING)this.playerDie();
        }
        if(this.player.invincibleTimer>0)this.player.invincibleTimer--;else this.player.isInvincible=false;
        if(this.player.hitTile)this.processBlockHit(this.player.hitTile);
        if(this.player.isFire&&this.input.keys.fire&&this.player.fireballCooldown<=0&&this.fireballs.length<2){const fx=this.player.facingRight?this.player.x+this.player.width:this.player.x-10;this.fireballs.push(new Fireball(fx,this.player.y+10,this.player.facingRight));this.player.fireballCooldown=15;if(window.music)music.fireball();}
        this.fireballs=this.fireballs.filter(f=>f.update(this.tiles,this.isWaterLevel));
        this.enemies=this.enemies.filter(e=>{if(e.type==='hammerbro')e.setFacing(this.player.x);const a=e.update(this.tiles);if(a&&e.pendingHammer){this.hammers.push(e.pendingHammer);e.pendingHammer=null;}return a;});
        this.bloopers=this.bloopers.filter(b=>b.update(this.tiles,this.player.x,this.player.y));
        this.cheepCheeps=this.cheepCheeps.filter(c=>c.update(this.tiles));
        this.hammers=this.hammers.filter(h=>h.update());for(const h of this.hammers){if(this.collides(pb,h.getBounds())&&!this.player.isInvincible&&!this.player.isStar){this.playerHurt();h.alive=false;break;}}
        this.piranhaPlants.forEach(p=>p.update(this.player.x,this.player.y));
        this.mushrooms=this.mushrooms.filter(m=>m.update(this.tiles));
        this.coins.forEach(c=>c.update());this.coins=this.coins.filter(c=>!c.collected||c.isPopCoin);
        this.mushrooms.forEach(m=>{if(!m.alive||m.emerging)return;if(this.collides(pb,m.getBounds())){m.alive=false;if(m.type==='1up'){if(window.music)music.oneUp();this.lives++;}else if(m.type==='fire'){this.player.becomeFire();if(window.music)music.powerup();this.player.score+=1000;}else if(m.type==='star'){this.player.becomeStar();if(window.music)music.powerup();this.player.score+=1000;}else{if(!this.player.isBig)this.player.becomeBig();this.player.score+=1000;if(window.music)music.powerup();}this.spawnScorePopup(m.x,m.y,1000);}});
        this.coins.forEach(c=>{if(!c.collected&&!c.isPopCoin&&this.collides(pb,c.getBounds())){c.collected=true;this.player.coins++;this.player.score+=100;this.spawnScorePopup(c.x,c.y,100);if(window.music)music.coin();}});
        this.enemies.forEach(enemy=>{if(!enemy.alive)return;const eb={x:enemy.x,y:enemy.y,width:enemy.width,height:enemy.height};if(this.collides(pb,eb)){const pf=this.player.prevY+(this.player.prevHeight||this.player.height),em=eb.y+eb.height*0.35;
            if(enemy.type==='koopa'&&enemy.isShell){if(this.player.velY>0&&pf<=em){if(enemy.shellMoving){enemy.shellMoving=false;enemy.velX=0;enemy.shellTimer=0;}else enemy.kick(this.player.x<enemy.x);this.player.velY=-8;this.player.score+=200;this.spawnScorePopup(enemy.x,enemy.y,200);}else if(enemy.shellMoving&&!this.player.isInvincible&&!this.player.isStar)this.playerHurt();return;}
            if(this.player.velY>0&&pf<=em){enemy.squish();this.player.velY=-8;this.player.score+=200;this.spawnScorePopup(enemy.x,enemy.y,200);if(window.music)music.coin();}else if(!this.player.isInvincible&&!this.player.isStar)this.playerHurt();}});
        this.enemies.forEach(shell=>{if(!shell.alive||shell.type!=='koopa'||!shell.isShell||!shell.shellMoving)return;const sb={x:shell.x,y:shell.y,width:shell.width,height:shell.height};this.enemies.forEach(other=>{if(other===shell||!other.alive)return;if(other.type==='koopa'&&other.isShell)return;if(this.collides(sb,{x:other.x,y:other.y,width:other.width,height:other.height})){other.alive=false;this.player.score+=200;this.spawnScorePopup(other.x,other.y,200);}});});
        this.fireballs.forEach(fb=>{if(!fb.alive)return;const fb2=fb.getBounds();this.enemies.forEach(enemy=>{if(!enemy.alive)return;if(enemy.type==='koopa'&&enemy.isShell&&!enemy.shellMoving)return;if(this.collides(fb2,{x:enemy.x,y:enemy.y,width:enemy.width,height:enemy.height})){if(enemy.squish)enemy.squish();enemy.alive=false;fb.alive=false;this.player.score+=200;this.spawnScorePopup(enemy.x,enemy.y,200);}});});
        if(this.player.isStar){this.enemies.forEach(enemy=>{if(!enemy.alive)return;if(this.collides(pb,{x:enemy.x,y:enemy.y,width:enemy.width,height:enemy.height})){enemy.alive=false;this.player.score+=200;this.spawnScorePopup(enemy.x,enemy.y,200);}});}
        this.piranhaPlants.forEach(plant=>{const pb2=plant.getBounds();if(!pb2)return;if(this.collides(pb,pb2)){if(this.player.isStar){plant.alive=false;this.player.score+=200;}else if(!this.player.isInvincible)this.playerHurt();}});
        if(this.player.y>this.levelMap.length*CONFIG.TILE_SIZE&&this.state.state===this.state.PLAYING)this.playerDie();
        if(this.state.state===this.state.PLAYING){const pb3=this.player.getBounds();for(const tile of this.tiles){if(tile.type===9&&this.collides(pb3,tile)){const fc=Math.floor(tile.x/CONFIG.TILE_SIZE),hb=Math.max(0,Math.floor((12*CONFIG.TILE_SIZE-this.player.y)/CONFIG.TILE_SIZE)*100),tb=Math.ceil(this.timeLeft/60)*50;this.player.score+=hb+1000+tb;this.player.velX=0;this.player.velY=0;this.player.x=fc*CONFIG.TILE_SIZE+2;this.player.facingRight=true;this.flagAnim={phase:'slide',timer:0,flagCurrentY:4*CONFIG.TILE_SIZE,flagEndY:11*CONFIG.TILE_SIZE,groundY:12*CONFIG.TILE_SIZE-this.player.height,castleX:(fc+8)*CONFIG.TILE_SIZE,heightBonus:hb};this.state.state=this.state.FLAGPOLE;break;}}}
        for(const p of this.scorePopups){p.y-=1.5;p.life++;}this.scorePopups=this.scorePopups.filter(p=>p.life<p.maxLife);
        this.scoreElement.textContent=this.player.score;this.coinsElement.textContent=this.player.coins;
        this.timeLeft--;if(this.timeLeft<=0){this.timeLeft=0;this.playerDie();}this.timeElement.textContent=Math.ceil(this.timeLeft/60);this.livesElement.textContent=this.lives;this.updatePowerDisplay();
    }
    draw(){
        this.renderer.clear(this.cameraX);
        const fy=this.flagAnim?this.flagAnim.flagCurrentY:4*CONFIG.TILE_SIZE;
        this.renderer.drawTiles(this.levelMap,this.cameraX,fy);
        this.coins.forEach(c=>this.renderer.drawCoin(c,this.cameraX));this.mushrooms.forEach(m=>this.renderer.drawMushroom(m,this.cameraX));
        this.enemies.forEach(e=>{if(e.type==='koopa')this.renderer.drawKoopa(e,this.cameraX);else if(e.type==='paratroopa')this.renderer.drawParatroopa(e,this.cameraX);else if(e.type==='hammerbro')this.renderer.drawHammerBro(e,this.cameraX);else this.renderer.drawGoomba(e,this.cameraX);});
        this.bloopers.forEach(b=>this.renderer.drawBlooper(b,this.cameraX));
        this.cheepCheeps.forEach(c=>this.renderer.drawCheepCheep(c,this.cameraX));
        this.hammers.forEach(h=>this.renderer.drawHammer(h,this.cameraX));
        this.liftPlatforms.forEach(p=>this.renderer.drawLiftPlatform(p,this.cameraX));
        this.piranhaPlants.forEach(p=>this.renderer.drawPiranhaPlant(p,this.cameraX));
        this.fireballs.forEach(f=>this.renderer.drawFireball(f,this.cameraX));
        if(this.state.currentLevel===4){this.podoboos.forEach(p=>this.renderer.drawPodoboo(p,this.cameraX));this.fireBars.forEach(f=>this.renderer.drawFireBar(f,this.cameraX));if(this.bowser)this.renderer.drawBowser(this.bowser,this.cameraX);}
        this.renderer.drawMario(this.player,this.cameraX);
        for(const p of this.scorePopups){const px=p.x-this.cameraX,alpha=1-p.life/p.maxLife;this.ctx.globalAlpha=Math.max(0,alpha);this.ctx.font='bold 14px monospace';this.ctx.textAlign='center';this.ctx.strokeStyle='#000';this.ctx.lineWidth=3;this.ctx.strokeText(p.text,px,p.y);this.ctx.fillStyle='#fff';this.ctx.fillText(p.text,px,p.y);}
        this.ctx.globalAlpha=1;this.ctx.textAlign='left';
        for(const fw of this.fireworks){for(const p of fw.particles){const px=p.x-this.cameraX,alpha=p.life/60;this.ctx.globalAlpha=Math.max(0,alpha);this.ctx.fillStyle=p.color;const sz=3+alpha*3;this.ctx.fillRect(px-sz/2,p.y-sz/2,sz,sz);}}this.ctx.globalAlpha=1;
        if(this.paused){this.ctx.fillStyle='rgba(0,0,0,0.55)';this.ctx.fillRect(0,0,CONFIG.SCREEN_WIDTH,CONFIG.SCREEN_HEIGHT);this.ctx.fillStyle='#ffffff';this.ctx.font='bold 48px monospace';this.ctx.textAlign='center';this.ctx.fillText('PAUSED',CONFIG.SCREEN_WIDTH/2,CONFIG.SCREEN_HEIGHT/2-10);this.ctx.font='18px monospace';this.ctx.fillStyle='#dddddd';this.ctx.fillText('Press P to resume',CONFIG.SCREEN_WIDTH/2,CONFIG.SCREEN_HEIGHT/2+24);this.ctx.textAlign='left';}
        if(this.princessMessage&&this.state.currentLevel===4)this.drawPrincessMessage();
    }
    drawPrincessMessage(){
        this.ctx.fillStyle='rgba(0,0,0,0.7)';this.ctx.fillRect(0,0,CONFIG.SCREEN_WIDTH,CONFIG.SCREEN_HEIGHT);
        const tx=CONFIG.SCREEN_WIDTH/2-30,ty=CONFIG.SCREEN_HEIGHT/2-60;
        this.ctx.fillStyle='#fff';this.ctx.fillRect(tx,ty,60,30);
        this.ctx.fillStyle='#e52521';this.ctx.fillRect(tx+5,ty+2,12,12);this.ctx.fillRect(tx+30,ty+2,12,12);this.ctx.fillRect(tx+18,ty+10,10,10);
        this.ctx.fillStyle='#fca';this.ctx.fillRect(tx+10,ty+30,40,25);
        this.ctx.fillStyle='#000';this.ctx.fillRect(tx+16,ty+36,4,4);this.ctx.fillRect(tx+38,ty+36,4,4);
        this.ctx.fillStyle='#fff';this.ctx.fillRect(tx+15,ty+55,30,20);
        this.ctx.fillStyle='#4444cc';this.ctx.fillRect(tx+15,ty+60,30,15);
        this.ctx.fillStyle='#ffffff';this.ctx.font='bold 16px monospace';this.ctx.textAlign='center';
        this.ctx.fillText('THANK YOU MARIO!',CONFIG.SCREEN_WIDTH/2,CONFIG.SCREEN_HEIGHT/2+60);
        this.ctx.fillText('But our princess is in',CONFIG.SCREEN_WIDTH/2,CONFIG.SCREEN_HEIGHT/2+82);
        this.ctx.fillText('another castle!',CONFIG.SCREEN_WIDTH/2,CONFIG.SCREEN_HEIGHT/2+100);
        this.ctx.textAlign='left';
    }
    gameLoop(){
        const renderInterval=1000/CONFIG.FPS,physicsStep=1000/60;let acc=0,lastTime=0,lastRender=0;
        const loop=(ts)=>{if(lastTime===0)lastTime=ts;
            if(this.paused){acc=0;lastTime=ts;}else{acc+=ts-lastTime;lastTime=ts;while(acc>=physicsStep){try{this.update();}catch(e){console.error('Update error:',e);acc=0;break;}acc-=physicsStep;}}
            if(ts-lastRender>=renderInterval){lastRender=ts;this.draw();}
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
    console.log('Super Mario World 2 - HTML5 Edition Loaded!');
});