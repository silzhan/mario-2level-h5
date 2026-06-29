class Music {
    constructor() {
        this.ctx = null;
        this.playing = false;
        this.gainNode = null;
        this.currentSong = null;
    }

    init() {
        if (this.ctx) return;
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.gainNode = this.ctx.createGain();
            this.gainNode.gain.value = 0.3;
            this.gainNode.connect(this.ctx.destination);
        } catch(e) {}
    }

    playNote(freq, startTime, duration, type) {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type || 'square';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.12, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        osc.connect(gain);
        gain.connect(this.gainNode);
        osc.start(startTime);
        osc.stop(startTime + duration);
    }

    playMelody(notes, bpm, loop, type) {
        this.stop();
        this.init();
        this.playing = true;
        const beat = 60 / bpm;
        const totalDuration = notes.reduce((sum, n) => sum + n[1], 0);
        let offset = 0;

        const scheduleNotes = () => {
            const now = this.ctx.currentTime;
            offset = 0;
            for (const [freq, dur] of notes) {
                if (freq > 0) this.playNote(freq, now + offset, dur, type);
                offset += dur;
            }
            if (loop) {
                this.loopTimer = setTimeout(scheduleNotes, offset * 1000);
            }
        };
        scheduleNotes();
    }

    // === BGM for World 2 ===
    playOverworld() {
        if (this.currentSong === 'overworld') return;
        this.currentSong = 'overworld';
        const bpm = 200;
        const beat = 60 / bpm;
        const notes = [
            [659.25, beat],[659.25, beat],[0, beat],[659.25, beat],
            [0, beat],[523.25, beat],[659.25, beat],[0, beat],
            [783.99, beat*2],[0, beat],[392, beat*2],[0, beat*2],
            [523.25, beat],[0, beat],[392, beat*2],
            [0, beat],[329.63, beat*2],[0, beat],
            [440, beat],[0, beat],[493.88, beat],[0, beat],
            [466.16, beat],[440, beat],[0, beat],
            [392, beat],[659.25, beat],[0, beat],
            [783.99, beat*2],[0, beat*2],
            [440, beat*2],[0, beat],[293.66, beat*2],[0, beat*2]
        ];
        this.playMelody(notes, bpm, true);
    }

    playUnderwater() {
        if (this.currentSong === 'underwater') return;
        this.currentSong = 'underwater';
        const bpm = 160;
        const beat = 60 / bpm;
        const notes = [
            [523.25, beat*1.5],[0, beat*0.5],[659.25, beat],[0, beat],
            [783.99, beat*1.5],[0, beat*0.5],[659.25, beat],[0, beat],
            [523.25, beat*1.5],[0, beat*0.5],[659.25, beat],[0, beat],
            [783.99, beat*1.5],[0, beat*0.5],[1046.5, beat],[0, beat],
            [783.99, beat],[659.25, beat],[523.25, beat*2],[0, beat],
            [587.33, beat*1.5],[0, beat*0.5],[523.25, beat],[0, beat],
            [0, beat*2]
        ];
        this.playMelody(notes, bpm, true, 'sine');
    }

    playNight() {
        if (this.currentSong === 'night') return;
        this.currentSong = 'night';
        const bpm = 180;
        const beat = 60 / bpm;
        const notes = [
            [392, beat*1.5],[0, beat*0.5],[440, beat],[0, beat],
            [523.25, beat*1.5],[0, beat*0.5],[440, beat],[0, beat],
            [392, beat*1.5],[0, beat*0.5],[349.23, beat],[0, beat],
            [329.63, beat*2],[0, beat*2],
            [349.23, beat],[392, beat],[0, beat*2],
            [440, beat*1.5],[0, beat*0.5],[523.25, beat],[0, beat],
            [440, beat*1.5],[0, beat*0.5],[392, beat],[0, beat],
            [329.63, beat*2],[0, beat],
            [0, beat*3]
        ];
        this.playMelody(notes, bpm, true, 'triangle');
    }

    playCastle() {
        if (this.currentSong === 'castle') return;
        this.currentSong = 'castle';
        const bpm = 200;
        const beat = 60 / bpm;
        const notes = [
            [196, beat],[196, beat],[220, beat],[220, beat],
            [261.63, beat],[261.63, beat],[293.66, beat*2],
            [261.63, beat],[261.63, beat],[220, beat],[220, beat],
            [196, beat*2],[0, beat*2],
            [196, beat],[196, beat],[220, beat],[220, beat],
            [261.63, beat*2],[293.66, beat*2],
            [349.23, beat*2],[329.63, beat*2],
            [293.66, beat*2],[261.63, beat*2]
        ];
        this.playMelody(notes, bpm, true);
    }

    playBoss() {
        if (this.currentSong === 'boss') return;
        this.currentSong = 'boss';
        const bpm = 220;
        const beat = 60 / bpm;
        const notes = [
            [349.23, beat*0.5],[392, beat*0.5],[349.23, beat*0.5],[392, beat*0.5],
            [349.23, beat],[349.23, beat],[349.23, beat*2],
            [293.66, beat*0.5],[329.63, beat*0.5],[293.66, beat*0.5],[329.63, beat*0.5],
            [293.66, beat],[293.66, beat],[293.66, beat*2],
            [261.63, beat*0.5],[293.66, beat*0.5],[261.63, beat*0.5],[293.66, beat*0.5],
            [261.63, beat*2],[0, beat*2]
        ];
        this.playMelody(notes, bpm, true);
    }

    stop() {
        this.playing = false;
        this.currentSong = null;
        if (this.loopTimer) { clearTimeout(this.loopTimer); this.loopTimer = null; }
    }

    pause() { this.stop(); }
    resume() { /* will auto-restart via game loop */ }

    // === Sound effects ===
    jump() { this.init(); if (!this.ctx) return; const o=this.ctx.createOscillator(); const g=this.ctx.createGain(); o.type='square'; o.frequency.setValueAtTime(400,this.ctx.currentTime); o.frequency.exponentialRampToValueAtTime(600,this.ctx.currentTime+0.1); g.gain.setValueAtTime(0.1,this.ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001,this.ctx.currentTime+0.12); o.connect(g); g.connect(this.gainNode); o.start(); o.stop(this.ctx.currentTime+0.12); }
    coin() { this.init(); if (!this.ctx) return; const t=this.ctx.currentTime; this.playNote(988, t, 0.05); this.playNote(1319, t+0.05, 0.1); }
    powerup() { this.init(); if (!this.ctx) return; const t=this.ctx.currentTime; this.playNote(523, t, 0.08); this.playNote(659, t+0.08, 0.08); this.playNote(784, t+0.16, 0.08); this.playNote(1047, t+0.24, 0.15); }
    hurt() { this.init(); if (!this.ctx) return; const t=this.ctx.currentTime; this.playNote(200, t, 0.15); this.playNote(150, t+0.15, 0.15); }
    die() { this.init(); if (!this.ctx) return; const t=this.ctx.currentTime; this.playNote(400, t, 0.2); this.playNote(350, t+0.2, 0.2); this.playNote(300, t+0.4, 0.2); this.playNote(200, t+0.6, 0.4); }
    levelClear() { this.init(); if (!this.ctx) return; const t=this.ctx.currentTime; this.playNote(523, t, 0.1); this.playNote(659, t+0.1, 0.1); this.playNote(784, t+0.2, 0.1); this.playNote(1047, t+0.3, 0.2); this.playNote(784, t+0.5, 0.1); this.playNote(1047, t+0.6, 0.3); }
    fireball() { this.init(); if (!this.ctx) return; const t=this.ctx.currentTime; this.playNote(800, t, 0.05); this.playNote(1200, t+0.02, 0.08); }
    oneUp() { this.init(); if (!this.ctx) return; const t=this.ctx.currentTime; this.playNote(523, t, 0.1); this.playNote(659, t+0.1, 0.1); this.playNote(784, t+0.2, 0.15); this.playNote(1047, t+0.3, 0.2); }
    swim() { this.init(); if (!this.ctx) return; const t=this.ctx.currentTime; const o=this.ctx.createOscillator(); const g=this.ctx.createGain(); o.type='sine'; o.frequency.setValueAtTime(300, t); o.frequency.exponentialRampToValueAtTime(500, t+0.05); g.gain.setValueAtTime(0.06, t); g.gain.exponentialRampToValueAtTime(0.001, t+0.08); o.connect(g); g.connect(this.gainNode); o.start(); o.stop(t+0.08); }
    axeGrab() { this.init(); if (!this.ctx) return; const t=this.ctx.currentTime; this.playNote(1000, t, 0.15); this.playNote(800, t+0.15, 0.15); }
    bridgeBreak() { this.init(); if (!this.ctx) return; for (let i=0; i<5; i++) { this.playNote(100-i*15, this.ctx.currentTime+i*0.1, 0.08); } }
    bowserFall() { this.init(); if (!this.ctx) return; const t=this.ctx.currentTime; this.playNote(200, t, 0.5); this.playNote(100, t+0.5, 0.5); }
}