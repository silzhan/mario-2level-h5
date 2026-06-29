const CONFIG = {
    TILE_SIZE: 32,
    SCREEN_WIDTH: 800,
    SCREEN_HEIGHT: 600,
    GRAVITY: 0.55,
    PLAYER_SPEED: 3.5,
    RUN_SPEED: 5.5,
    JUMP_FORCE: -11.5,
    MAX_FALL_SPEED: 15,
    FRICTION: 0.82,
    FPS: 40,

    // === World 2: Swimming Physics ===
    WATER_GRAVITY: 0.15,
    SWIM_UP_FORCE: -7.0,
    SWIM_HOLD_FORCE: -4.0,
    WATER_FRICTION: 0.90,
    WATER_MAX_FALL: 4.0,
    WATER_H_SPEED: 2.8,
    WATER_RUN_SPEED: 3.5,
    WATER_H_MAX: 5.0,
    SWIM_HOLD_MIN: -2,

    // === World 2: Lift Platform ===
    LIFT_VERTICAL_SPEED: 1.0,
    LIFT_HORIZONTAL_SPEED: 1.5,
};

const SOLID_TILES = [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 19, 20, 21, 22, 24, 25, 27];
const LAVA_TILES = [18];
const WATER_TILES = [24, 25, 27];

function isSolidTile(type) {
    return SOLID_TILES.includes(type);
}

function isLavaTile(type) {
    return LAVA_TILES.includes(type);
}

function isWaterTile(type) {
    return WATER_TILES.includes(type);
}

const COLORS = {
    SKY: '#5c94fc',
    GROUND: '#c8641e',
    GROUND_TOP: '#32cd32',
    BRICK: '#b8860b',
    QUESTION: '#ffd700',
    USED: '#8b7355',
    PIPE: '#32cd32',
    MARIO_RED: '#dc3232',
    MARIO_SKIN: '#fac8a8',
    MARIO_BLUE: '#3232dc',
    GOOMBA: '#b4641e',
    COIN: '#ffd700',
    WHITE: '#ffffff',
    BLACK: '#000000',
    UG_BG: '#000000',
    UG_GROUND: '#6b4c2a',
    UG_GROUND_DARK: '#5a3d20',
    UG_BRICK: '#4a8cad',
    UG_BRICK_LIGHT: '#5ea8c8',
    UG_BRICK_DARK: '#356a85',
    UG_CEILING: '#3a3a3a',
    UG_CEILING_LIGHT: '#4a4a4a',
    SKY_BG: '#87CEEB',
    TREE_GREEN: '#2d8b2d',
    TREE_GREEN_LIGHT: '#3da83d',
    TREE_TRUNK: '#8B4513',
    BRIDGE: '#a0522d',
    BRIDGE_DARK: '#6b3410',
    BRIDGE_NAIL: '#888888',
    CASTLE_BG: '#000000',
    CASTLE_BRICK: '#606060',
    CASTLE_BRICK_LIGHT: '#787878',
    CASTLE_BRICK_DARK: '#484848',
    CASTLE_UNBREAKABLE: '#3a3a3a',
    CASTLE_UNBREAKABLE_LIGHT: '#505050',
    CASTLE_LAVA: '#e03000',
    CASTLE_LAVA_LIGHT: '#ff6600',
    CASTLE_LAVA_BRIGHT: '#ffaa00',
    CASTLE_BRIDGE: '#8b5e3c',
    CASTLE_BRIDGE_DARK: '#6b3e1c',
    CASTLE_TORCH: '#ff8800',
    CASTLE_TORCH_BRIGHT: '#ffcc00',
    CASTLE_AXE_METAL: '#c0c0c0',
    CASTLE_AXE_HANDLE: '#8b4513',

    // === World 2: Underwater Colors ===
    WATER_BG_DEEP: '#003366',
    WATER_BG_MID: '#004488',
    WATER_BG_SHALLOW: '#0066aa',
    WATER_BRICK: '#0077aa',
    WATER_BRICK_LIGHT: '#0099cc',
    WATER_BRICK_DARK: '#005577',
    WATER_QUESTION: '#0088bb',
    WATER_QUESTION_GOLD: '#ffcc00',
    WATER_FLOOR: '#004488',
    WATER_SEAWEED: '#008866',

    // === World 2: Night Overworld Colors ===
    NIGHT_SKY: '#1a1a3a',
    NIGHT_SKY_MID: '#2a1a4a',
    NIGHT_GROUND: '#5a3a1a',
    NIGHT_GROUND_DARK: '#4a2a0a',
    NIGHT_BRICK: '#886622',
    NIGHT_QUESTION: '#aa8833',
    NIGHT_PIPE: '#226644',
    NIGHT_GRASS: '#1a441a',
    NIGHT_LIFT: '#aa8833',
    NIGHT_STAR: '#ffffff',
    NIGHT_MOON: '#ffffcc',

    // === World 2: Castle 2 Colors ===
    CASTLE2_BRICK: '#606060',
    CASTLE2_BRICK_LIGHT: '#787878',
    CASTLE2_BRICK_DARK: '#484848',
    CASTLE2_UNBREAKABLE: '#3a3a3a',
    CASTLE2_RED: '#6a2020',
};