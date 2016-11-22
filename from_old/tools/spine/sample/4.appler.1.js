/**
 * Created with JetBrains WebStorm.
 * User: gbox3d
 * Date: 13. 8. 19.
 * Time: 오후 3:10
 * To change this template use File | Settings | File Templates.
 */


var spine_data_src = {
    "bones": [
        { "name": "root" }
    ],
    "slots": [
        { "name": "mon1", "bone": "root", "attachment": "mn_0_08" }
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
                        { "time": 0.6666, "name": "mn_0_06" },
                        { "time": 1.6666, "name": "mn_0_08" },
                        { "time": 3, "name": "mn_0_08" }
                    ]
                }
            }
        }
    }
};


var Smgr = new Pig2d.SceneManager({
    container : $('#sprite_window')[0]
});

//solt모델 생성을 위한 인자값 추출하기
var ani_obj =  Pig2d.util.spine.extractAnimation({
    spine_data : spine_data_src, //스파인 툴 데이터
    slot_name : 'mon1',     //추출해낼 슬롯이름
    base_url : '../../res/shanny/mon_0', //텍스춰 경로명
    img_type : 'png' //텍스춰 파일 타입

});

console.log(ani_obj);

//노드 생성
var node = new Pig2d.node({
    el : $('<div></div>')
});

//스파인툴의 슬롯정보로 스프라이트 만들기
var model = new Pig2d.SlotSpriteModel( {
        data : ani_obj
    }
);

//상호 연결
model.set({node:node});
node.set({model: model});

node.get('model')
    .setPosition(160,120)
    .setFrame(0);

Smgr.add(node);
Smgr.updateAll();


//////////
//60프레임

var applier = node.get('model').getAnimation_applier({
    startFrame:0
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

        applier(deltaTime);

        Smgr.updateAll();
        requestAnimationFrame(loop);

    }

);

