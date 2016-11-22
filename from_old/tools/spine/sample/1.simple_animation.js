/**
 * Created with JetBrains WebStorm.
 * User: gbox3d
 * Date: 13. 8. 19.
 * Time: 오전 10:57
 * To change this template use File | Settings | File Templates.
 */


/*
 간단한 애니메이션 샘플
 */

var spine_data_src = {
    "bones": [
        { "name": "root" }
    ],
    "slots": [
        { "name": "ef1", "bone": "root", "attachment": "e_0_6" }
    ],
    "skins": {
        "default": {
            "ef1": {
                "e_0_0": { "x": -2.3, "y": 31.48, "width": 183, "height": 163 },
                "e_0_1": { "x": -38.01, "y": 60.28, "width": 238, "height": 220 },
                "e_0_2": { "x": -40.31, "y": 60.28, "width": 258, "height": 215 },
                "e_0_3": { "x": -52.6, "y": 34.55, "width": 299, "height": 174 },
                "e_0_4": { "x": -48.38, "y": 37.24, "width": 309, "height": 164 },
                "e_0_5": { "x": -39.93, "y": 39.93, "width": 285, "height": 166 },
                "e_0_6": { "x": -26.11, "y": 16.51, "width": 246, "height": 114 }
            }
        }
    },
    "events": {},
    "animations": {
        "animation": {
            "slots": {
                "ef1": {
                    "attachment": [
                        { "time": 0, "name": "e_0_0" },
                        { "time": 0.0333, "name": "e_0_1" },
                        { "time": 0.0666, "name": "e_0_2" },
                        { "time": 0.1, "name": "e_0_3" },
                        { "time": 0.1333, "name": "e_0_4" },
                        { "time": 0.1666, "name": "e_0_5" },
                        { "time": 0.2, "name": "e_0_6" }
                    ],
                    "color": [
                        { "time": 0.0333, "color": "ffffffff", "curve": "stepped" },
                        { "time": 0.0666, "color": "ffffffff", "curve": "stepped" },
                        { "time": 0.2, "color": "ffffffff" }
                    ]
                }
            }
        }
    }
};


var Smgr = new Pig2d.SceneManager({
    container : document.querySelector('#sprite_window')
});

var node = Pig2d.util.createSlotSprite({
    spine_data : spine_data_src,
    slot_name : 'ef1',
    base_url : '../../res/effect_test',
    img_type : 'png',
    loadComplete : function() {   //로딩이 모두 완료 되면 호출됨
        console.log('load complete');
        node.get('model')
            .setFrame(0)
            .setPosition(160,120);

        setInterval(function() {

            node.get('model')
                .nextFrame();
            node.update(true);

        },300);

        Smgr.add(node);
    }
});


var frame_total = 0;
var loop_count = 0;
var framerate_info = document.querySelector("#text-framerate-info");
var mytimer = new gbox3d.core.Timer();

requestAnimationFrame(
    function loop() {

        var deltaTime = mytimer.getDeltaTime();

        frame_total += Math.round(1.0 / deltaTime);
        loop_count++;

        framerate_info.innerText = Math.round(frame_total / loop_count);


        Smgr.updateAll();
        requestAnimationFrame(loop);

    }

);

