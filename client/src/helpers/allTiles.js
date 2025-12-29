export default class TileMapper {
  static getTileType(uid) {
    if (uid < 136) {
      return Math.floor(uid / 4);
    }
    return 34 + (uid - 136);
  }

  static getSpriteKey(uid) {
    const type = this.getTileType(uid);

    // Balls (0-8) -> balls1..balls9
    if (type <= 8) return `balls${type + 1}`;

    // Sticks (9-17) -> sticks1..sticks9 (Note: client assets use 'sticks', code used 'sticks1')
    // Adjusting to original asset names seen in previous file: "sticksChicken" for 1?
    // Checking original allTiles: "sticksChicken", then sticks2-9.
    if (type === 9) return "sticksChicken";
    if (type <= 17) return `sticks${(type - 9) + 1}`;

    // Maahn (18-26) -> maahn1..maahn9
    if (type <= 26) return `maahn${(type - 18) + 1}`;

    // Winds (27-30) -> windEast, windSouth, windWest, windNorth
    if (type === 27) return "windEast";
    if (type === 28) return "windSouth";
    if (type === 29) return "windWest";
    if (type === 30) return "windNorth";

    // Dragons (31-33) -> dragonRed, dragonGreen, dragonWhite
    if (type === 31) return "dragonRed";
    if (type === 32) return "dragonGreen";
    if (type === 33) return "dragonWhite";

    // Flowers (34-37) -> flowerA..D
    if (type === 34) return "flowerA"; 
    if (type === 35) return "flowerB";
    if (type === 36) return "flowerC";
    if (type === 37) return "flowerD";

    // Seasons (38-41) -> season1..4
    if (type === 38) return "season1";
    if (type === 39) return "season2";
    if (type === 40) return "season3";
    if (type === 41) return "season4";

    return "tileBack"; 
  }
}
