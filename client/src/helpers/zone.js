export default class Zone {
    // sets a zone for the discarded tiles
    // the tiles will be revealed to everyone here and will lock in place
    constructor(scene) {
        this.renderZone = () => {
            let dropZone = scene.add.zone(700, 600, 800, 500)
            .setRectangleDropZone(800, 500);

            dropZone.setData({ cards: -1 });
            return dropZone;
        }
        this.renderOutline = (dropZone) => {
            let dropZoneOutline = scene.add.graphics();
            dropZoneOutline.lineStyle(10, 0x000000);

            let dropZoneWidth = dropZone.input.hitArea.width
            let dropZoneHeight = dropZone.input.hitArea.height
            dropZoneOutline.strokeRect(
                dropZone.x - dropZoneWidth/2, dropZone.y - dropZoneHeight/2, dropZoneWidth, dropZoneHeight
                )
        }
    }
}