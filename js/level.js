function generateWorld2Map(level) {
    if (level === 4) return generateLevel2_4Map();
    if (level === 3) return generateLevel2_3Map();
    if (level === 2) return generateLevel2_2Map();
    return generateLevel2_1Map();
}

// ============================================================
// World 2-1: Overworld Plus — red koopas, wider pits, denser enemies
// ============================================================
function generateLevel2_1Map() {
    const W = 230;
    const H = 15;
    const level = Array(H).fill(null).map(() => Array(W).fill(0));
    const Q = 3;
    const B = 2;
    const HIDE = 14;

    const fill = (r1, c1, r2, c2, type) => {
        for (let r = r1; r <= r2; r++)
            for (let c = c1; c <= c2; c++)
                if (r >= 0 && r < H && c >= 0 && c < W) level[r][c] = type;
    };

    const pipe = (topRow, col) => {
        level[topRow][col] = 4; level[topRow][col + 1] = 5;
        for (let r = topRow + 1; r < 12; r++) { level[r][col] = 6; level[r][col + 1] = 7; }
    };

    // === GROUND ===
    fill(12, 0, 14, W - 1, 1);

    // === PITS (8 pits, 2-3 cols wide) ===
    const pits = [[30,31],[50,52],[72,73],[95,96],[118,120],[140,141],[165,167],[190,191]];
    for (const [s, e] of pits) {
        for (let c = s; c <= e; c++) { level[12][c] = 0; level[13][c] = 0; level[14][c] = 0; }
    }

    // === SECTION 1: Quick intro (cols 0-28) ===
    level[9][10] = Q;
    fill(9, 14, 9, 16, B);
    level[9][15] = Q;
    level[5][10] = HIDE; // 1UP hidden
    pipe(9, 22);

    // === SECTION 2: First pit zone + platforms (cols 29-50) ===
    fill(9, 34, 9, 36, B);
    level[9][35] = Q;
    fill(7, 40, 7, 43, B);
    level[7][41] = Q;
    level[7][42] = Q;
    pipe(9, 45);

    // === SECTION 3: Wide pit + brick bridge (cols 51-70) ===
    fill(9, 55, 9, 57, B);
    level[9][56] = Q;
    level[5][56] = Q; // fire flower
    fill(9, 60, 9, 63, B);
    level[9][61] = Q;

    // === SECTION 4: Pipe + staircase (cols 71-93) ===
    pipe(9, 75);
    fill(9, 80, 9, 83, B);
    level[9][81] = Q;
    level[9][82] = Q;
    fill(9, 87, 9, 90, B);
    level[9][88] = Q; level[9][89] = Q;

    // === SECTION 5: Brick run + enemies zone (cols 94-117) ===
    fill(9, 97, 9, 100, B);
    level[9][98] = Q; level[9][99] = Q;
    fill(7, 103, 7, 105, B);
    level[7][104] = Q;
    fill(9, 108, 9, 110, B);
    level[9][109] = Q;
    fill(9, 113, 9, 115, B);
    level[9][114] = Q;
    level[5][104] = HIDE; // star

    // === SECTION 6: Platform challenge (cols 118-139) ===
    fill(9, 121, 9, 123, B);
    level[9][122] = Q;
    fill(9, 126, 9, 128, B);
    level[9][127] = Q;
    fill(9, 132, 9, 135, B);
    level[9][133] = Q; level[9][134] = Q;
    pipe(9, 138);

    // === SECTION 7: Final stretch (cols 140-189) ===
    fill(9, 145, 9, 147, B);
    level[9][146] = Q;
    fill(7, 152, 7, 155, B);
    level[7][153] = Q; level[7][154] = Q;
    fill(9, 160, 9, 162, B);
    level[9][161] = Q;
    fill(9, 170, 9, 172, B);
    level[9][171] = Q;
    level[5][170] = Q; // high question

    // === SECTION 8: Final staircase + flagpole (cols 190-230) ===
    for (let s = 0; s < 10; s++) {
        for (let r = 11 - s; r < 12; r++) {
            if (r >= 0) level[r][195 + s] = B;
        }
    }

    // Flagpole
    for (let row = 4; row < 12; row++) level[row][208] = 9;

    // Castle
    fill(8, 213, 11, 225, B);
    for (let c = 213; c <= 225; c += 2) level[7][c] = B;
    fill(6, 215, 6, 223, B);
    level[11][218] = 0; level[11][219] = 0;
    level[10][218] = 0; level[10][219] = 0;

    // Extra ground blocks around castle
    fill(12, 210, 14, W - 1, B);

    return level;
}

// ============================================================
// World 2-2: Underwater — swimming, blooper, cheep-cheep
// ============================================================
function generateLevel2_2Map() {
    const W = 220;
    const H = 15;
    const level = Array(H).fill(null).map(() => Array(W).fill(0));
    const WB = 24; // water brick
    const WQ = 25; // water question block
    const WF = 27; // water floor
    const HIDE = 14;

    const fill = (r1, c1, r2, c2, type) => {
        for (let r = r1; r <= r2; r++)
            for (let c = c1; c <= c2; c++)
                if (r >= 0 && r < H && c >= 0 && c < W) level[r][c] = type;
    };

    const pipe = (topRow, col) => {
        level[topRow][col] = 4; level[topRow][col + 1] = 5;
        for (let r = topRow + 1; r < 12; r++) { level[r][col] = 6; level[r][col + 1] = 7; }
    };

    // === BOTTOM FLOOR (rows 12-14) ===
    fill(12, 0, 14, W - 1, WF);

    // === BRICK PLATFORMS (suspended in water) ===

    // Section 1: Intro area (cols 0-30)
    fill(10, 5, 10, 8, WB);
    level[10][6] = WQ;
    fill(10, 15, 10, 18, WB);
    level[10][16] = WQ;
    fill(8, 20, 8, 23, WB);
    level[8][21] = WQ;
    fill(7, 26, 7, 28, WB);
    level[7][27] = WQ;

    // Section 2: Mid platforms (cols 31-70)
    fill(10, 35, 10, 38, WB);
    level[10][36] = WQ;
    fill(8, 42, 8, 45, WB);
    level[8][43] = WQ;
    fill(10, 48, 10, 51, WB);
    level[10][49] = WQ;
    fill(7, 52, 7, 54, WB);
    level[7][53] = WQ;
    fill(5, 55, 5, 58, WB);
    level[5][56] = WQ;
    level[5][57] = WQ;
    fill(10, 60, 10, 63, WB);
    level[10][61] = WQ;
    pipe(10, 65);

    // Section 3: Dense platforms (cols 71-120)
    fill(10, 75, 10, 78, WB);
    level[10][76] = WQ;
    fill(8, 80, 8, 83, WB);
    level[8][81] = WQ;
    fill(6, 85, 6, 88, WB);
    level[6][86] = WQ; level[6][87] = WQ;
    fill(10, 90, 10, 93, WB);
    level[10][91] = WQ;
    fill(8, 95, 8, 98, WB);
    level[8][96] = WQ;
    fill(6, 100, 6, 103, WB);
    level[6][101] = WQ;
    fill(4, 105, 4, 108, WB);
    level[4][106] = WQ; level[4][107] = WQ;
    fill(10, 110, 10, 113, WB);
    level[10][111] = WQ;
    pipe(10, 115);

    // Narrow corridor
    fill(10, 118, 10, 122, WB);
    level[8][120] = WB; level[8][121] = WB;

    // Section 4: Advanced platforms (cols 121-170)
    fill(10, 125, 10, 128, WB);
    level[10][126] = WQ;
    fill(8, 130, 8, 133, WB);
    level[8][131] = WQ;
    fill(6, 135, 6, 138, WB);
    level[6][136] = WQ;
    fill(10, 140, 10, 143, WB);
    level[10][141] = WQ;
    fill(8, 145, 8, 148, WB);
    level[8][146] = WQ;
    fill(5, 150, 5, 153, WB);
    level[5][151] = WQ; level[5][152] = WQ;
    level[3][155] = WB; level[3][156] = WB;
    fill(10, 158, 10, 161, WB);
    level[10][159] = WQ;

    // Section 5: Final stretch (cols 171-220)
    fill(10, 175, 10, 178, WB);
    level[10][176] = WQ;
    fill(8, 180, 8, 183, WB);
    level[8][181] = WQ;
    fill(6, 185, 6, 188, WB);
    level[6][186] = WQ; level[6][187] = WQ;
    fill(10, 190, 10, 193, WB);
    level[10][191] = WQ;
    fill(8, 195, 8, 198, WB);
    level[8][196] = WQ;

    // Flagpole (underwater)
    for (let row = 4; row < 12; row++) level[row][205] = 9;

    // Castle
    fill(8, 210, 11, 220, WB);
    for (let c = 210; c <= 220; c += 2) level[7][c] = WB;
    fill(6, 212, 6, 218, WB);
    level[11][215] = 0; level[11][216] = 0;
    level[10][215] = 0; level[10][216] = 0;

    // Hidden blocks
    level[3][50] = HIDE;
    level[4][100] = HIDE;
    level[3][145] = HIDE;

    return level;
}

// ============================================================
// World 2-3: Night Overworld — lift platforms, paratroopas
// ============================================================
function generateLevel2_3Map() {
    const W = 230;
    const H = 15;
    const level = Array(H).fill(null).map(() => Array(W).fill(0));
    const Q = 3;
    const B = 2;
    const HIDE = 14;
    const LP = 26;   // lift platform marker

    const fill = (r1, c1, r2, c2, type) => {
        for (let r = r1; r <= r2; r++)
            for (let c = c1; c <= c2; c++)
                if (r >= 0 && r < H && c >= 0 && c < W) level[r][c] = type;
    };

    const pipe = (topRow, col) => {
        level[topRow][col] = 4; level[topRow][col + 1] = 5;
        for (let r = topRow + 1; r < 12; r++) { level[r][col] = 6; level[r][col + 1] = 7; }
    };

    // === GROUND (60% coverage — more gaps for platform sections) ===
    fill(12, 0, 14, 38, 1);          // Section 1 intro ground
    fill(12, 58, 14, 75, 1);         // Section 2
    fill(12, 110, 14, 128, 1);       // Section 3
    fill(12, 155, 14, 165, 1);       // Section 4
    fill(12, 205, 14, W - 1, 1);     // Flagpole area

    // === GROUND GAPS (platform sections — filled with lift platforms) ===
    // Gap 1: cols 39-57 (teaching zone)
    // Gap 2: cols 76-109 (challenge zone)
    // Gap 3: cols 129-154 (mixed zone)
    // Gap 4: cols 166-204 (sprint zone)

    // === PIPES ===
    pipe(9, 12);
    pipe(9, 65);
    pipe(9, 118);
    pipe(9, 158);

    // === SECTION 1: Teaching intro (cols 0-38) ===
    level[9][8] = Q;
    fill(9, 15, 9, 18, B);
    level[9][16] = Q;
    level[5][15] = HIDE; // 1UP
    fill(9, 22, 9, 25, B);
    level[9][23] = Q;
    fill(9, 30, 9, 33, B);
    level[9][31] = Q; level[9][32] = Q;

    // Lift platform markers for Section 1 teaching zone (cols 39-57)
    level[8][42] = LP;
    level[8][46] = LP;
    level[8][50] = LP;

    // === SECTION 2: Challenge zone platforms (cols 58-75 ground + 76-109 gap) ===
    fill(9, 60, 9, 62, B);
    level[9][61] = Q;
    level[5][61] = Q; // fire flower

    // Lift markers (cols 76-109)
    level[8][80] = LP;
    level[8][85] = LP;
    level[8][90] = LP;
    level[7][96] = LP;
    level[7][102] = LP;

    // === SECTION 3: Mixed zone (cols 110-128 ground + 129-154 gap) ===
    fill(9, 114, 9, 116, B);
    level[9][115] = Q;
    fill(7, 120, 7, 123, B);
    level[7][121] = Q; level[7][122] = Q;

    // Lift markers (cols 129-154)
    level[8][132] = LP;
    level[8][136] = LP;
    level[7][140] = LP;
    level[7][144] = LP;
    level[8][148] = LP;
    level[8][152] = LP;

    // === SECTION 4: Sprint zone (cols 155-165 ground + 166-204 gap) ===
    fill(9, 160, 9, 163, B);
    level[9][161] = Q;
    level[5][162] = HIDE; // star

    // Lift markers (cols 166-204)
    level[8][172] = LP;
    level[8][178] = LP;
    level[8][184] = LP;
    level[7][192] = LP;
    level[7][196] = LP;

    // === FLAGPOLE ===
    for (let row = 4; row < 12; row++) level[row][210] = 9;

    // === CASTLE ===
    fill(8, 215, 11, 228, B);
    for (let c = 215; c <= 228; c += 2) level[7][c] = B;
    fill(6, 217, 6, 226, B);
    level[11][220] = 0; level[11][221] = 0;
    level[10][220] = 0; level[10][221] = 0;

    return level;
}

// ============================================================
// World 2-4: Castle 2 — faster Bowser, more fire bars, hammer bros
// ============================================================
function generateLevel2_4Map() {
    const W = 200;
    const H = 15;
    const level = Array(H).fill(null).map(() => Array(W).fill(0));
    const CB = 19;  // castle brick
    const UB = 20;  // unbreakable
    const BK = 2;   // breakable brick
    const LV = 18;  // lava
    const BR = 21;  // bridge
    const AX = 22;  // axe
    const Q = 3;
    const HIDE = 14;
    const TORCH = 23;

    const fill = (r1, c1, r2, c2, type) => {
        for (let r = r1; r <= r2; r++)
            for (let c = c1; c <= c2; c++)
                if (r >= 0 && r < H && c >= 0 && c < W) level[r][c] = type;
    };

    const lavaPit = (startCol, endCol) => {
        for (let c = startCol; c <= endCol; c++) {
            level[12][c] = 0;
            level[13][c] = LV;
            level[14][c] = LV;
        }
    };

    const stairsRight = (startCol, steps) => {
        for (let s = 0; s < steps; s++)
            for (let r = 11 - s; r < 12; r++)
                if (r >= 0) level[r][startCol + s] = CB;
    };

    const stairsDown = (startCol, steps) => {
        for (let s = 0; s < steps; s++)
            for (let r = 12 - steps + s; r < 12; r++)
                if (r >= 0) level[r][startCol + s] = CB;
    };

    // === CEILING (rows 0-1) ===
    fill(0, 0, 1, W - 1, CB);

    // === FLOOR (rows 12-14) ===
    fill(12, 0, 14, W - 1, CB);

    // =====================================================
    // SECTION 1: Entrance corridor (cols 0-28)
    // =====================================================
    level[4][6] = Q;
    level[4][10] = Q;
    level[4][14] = Q;
    fill(9, 8, 9, 12, CB);
    level[9][10] = Q;

    // Lava pit 1
    lavaPit(18, 20);
    fill(10, 19, 10, 19, CB);
    stairsRight(22, 3);

    // =====================================================
    // SECTION 2: Lava + stairs (cols 29-60)
    // =====================================================
    lavaPit(30, 32);
    fill(10, 31, 10, 31, CB);
    lavaPit(38, 40);
    stairsRight(34, 3);
    fill(9, 42, 9, 45, CB);
    level[9][43] = Q; level[9][44] = Q;
    fill(2, 42, 4, 58, CB); // Narrow corridor ceiling
    lavaPit(50, 52);
    fill(10, 51, 10, 51, CB);
    level[9][55] = Q;
    fill(9, 57, 9, 59, CB);

    // =====================================================
    // SECTION 3: Multi-level (cols 61-95)
    // =====================================================
    fill(2, 61, 4, 60, 0);
    stairsRight(62, 4);
    fill(7, 66, 7, 72, CB);
    level[7][68] = Q; level[7][70] = Q;
    level[4][69] = HIDE; // 1UP
    stairsDown(73, 4);
    fill(9, 66, 9, 72, UB);
    lavaPit(76, 78);
    fill(10, 77, 10, 77, CB);
    level[9][81] = Q;
    fill(9, 83, 9, 85, CB);
    level[9][84] = BK;
    lavaPit(88, 90);
    fill(10, 89, 10, 89, CB);
    level[9][92] = Q;
    fill(9, 94, 9, 95, CB);

    // =====================================================
    // SECTION 4: Fire bar gauntlet (cols 96-130)
    // =====================================================
    fill(2, 96, 4, 130, CB);
    lavaPit(100, 102);
    lavaPit(108, 110);
    lavaPit(116, 118);
    lavaPit(124, 126);
    fill(10, 101, 10, 101, CB);
    fill(10, 109, 10, 109, CB);
    fill(10, 117, 10, 117, CB);
    level[9][98] = Q;
    fill(9, 104, 9, 106, CB);
    level[9][105] = Q;
    level[9][112] = BK; level[9][113] = BK;
    level[9][120] = Q;
    fill(9, 122, 9, 123, CB);
    level[9][128] = Q;

    // =====================================================
    // SECTION 5: Pre-boss corridor  (cols 131-150)
    // =====================================================
    fill(2, 131, 4, 130, 0);
    stairsRight(132, 4);
    fill(6, 136, 6, 140, CB);
    level[6][138] = Q;
    stairsDown(141, 4);
    lavaPit(145, 147);
    fill(10, 146, 10, 146, CB);
    level[9][149] = Q;
    level[4][148] = HIDE; // star

    // =====================================================
    // SECTION 6: Boss room (cols 151-199)
    // =====================================================
    for (let r = 2; r <= 11; r++)
        for (let c = 152; c <= 199; c++)
            level[r][c] = 0;

    fill(12, 152, 14, 199, CB);
    fill(0, 152, 1, 199, CB);

    // Lava pool (longer bridge than 1-4)
    for (let c = 158; c <= 190; c++) {
        level[12][c] = LV;
        level[13][c] = LV;
        level[14][c] = LV;
    }

    // Bridge
    fill(11, 158, 11, 188, BR);
    fill(11, 152, 11, 157, CB);
    fill(11, 189, 11, 199, CB);

    // Axe
    level[10][194] = AX;

    // Boss room walls
    fill(2, 152, 11, 153, CB);
    fill(2, 198, 11, 199, CB);

    // Decorative pipes
    const pipe = (topRow, col) => {
        level[topRow][col] = 4; level[topRow][col + 1] = 5;
        for (let r = topRow + 1; r < 12; r++) { level[r][col] = 6; level[r][col + 1] = 7; }
    };
    pipe(10, 14);
    pipe(10, 148);

    // Torches
    [4, 18, 32, 44, 60, 80, 100, 120, 140].forEach(c => { level[4][c] = TORCH; });
    [50, 64, 84, 104, 124].forEach(c => { level[5][c] = TORCH; });

    return level;
}