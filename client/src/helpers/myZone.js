export default class MyZone {
    constructor(scene){
        this.renderMyZone = () => {
            let myDropZone = scene.add.zone(700, 920, 800, 100)
            .setRectangleDropZone(800, 100);

            myDropZone.setData({ cards: -1 });
            return myDropZone;
        };
        this.renderOutline = (myDropZone) => {
            let myDropZoneOutline = scene.add.graphics();
            myDropZoneOutline.lineStyle(5, 0x964000);

            let myDropZoneWidth = myDropZone.input.hitArea.width
            let myDropZoneHeight = myDropZone.input.hitArea.height
            myDropZoneOutline.strokeRect(
                myDropZone.x - myDropZoneWidth/2, myDropZone.y - myDropZoneHeight/2, myDropZoneWidth, myDropZoneHeight
            )
        }
    }
}