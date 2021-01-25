export default class Zone {
    constructor(scene) {
        this.renderZone = () => {
            let dropZone = scene.add.zone(700, 375, 900, 250)
            .setRectangleDropZone(900, 250);

            dropZone.setData({ cards: 0 });
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