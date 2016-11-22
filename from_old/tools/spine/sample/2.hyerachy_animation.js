/**
 * Created with JetBrains WebStorm.
 * User: gbox3d
 * Date: 13. 8. 19.
 * Time: 오후 1:43
 * To change this template use File | Settings | File Templates.
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

var dataset2 = {
    "bones": [
        { "name": "root" }
    ],
    "slots": [
        { "name": "mon1", "bone": "root", "attachment": "mn_0_00" }
    ],
    "skins": {
        "default": {
            "mon1": {
                "mn_0_00": { "x": -16.7, "y": 26.9, "width": 85, "height": 56 },
                "mn_0_06": { "x": -18.22, "y": 25.38, "width": 105, "height": 52 },
                "mn_0_08": { "x": -18, "y": 46, "width": 102, "height": 92 }
            }
        }
    },
    "animations": {
        "animation": {
            "slots": {
                "mon1": {
                    "attachment": [
                        { "time": 0, "name": "mn_0_00" },
                        { "time": 0.1666, "name": "mn_0_06" },
                        { "time": 0.3333, "name": "mn_0_08" }
                    ]
                }
            }
        }
    }
};


var Smgr = new Pig2d.SceneManager({
    container : $('#sprite_window')[0]
});

var node = Pig2d.util.createSlotSprite({
    spine_data : spine_data_src,
    slot_name : 'ef1',
    base_url : '../../res/effect_test',
    img_type : 'png'

});

node.get('model')
    .setFrame(0)
    .setPosition(160,120);

Smgr.add(node);

var node2 = Pig2d.util.createSlotSprite({
    spine_data : dataset2,
    slot_name : 'mon1',
    base_url : '../../res/shanny/mon_0',
    img_type : 'png'

});

node2.get('model').setPosition(0,0)
    .setFrame(0);
node2.set("name","body");

node.add(node2);

setInterval(function() {

    node.get('model')
        .nextFrame();
    node.update(true);

    node2.get('model')
        .nextFrame();
    node2.update(true);

},300);


Smgr.updateAll();


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



