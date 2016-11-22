/**
 * Created by gbox3d on 13. 10. 4..
 */


//스파인 슬롯을 이용한 애니메이션
Pig2d.SlotSpriteModel = Pig2d.model.extend( {
    initialize: function(param) {

        Pig2d.model.prototype.initialize.call(this);
        this.attributes.currentFrame = 0;

        var element = document.createElement('div');

        element.classList.add('pig2d-sprite-frame');

        this.get('element').appendChild(element);



    } ,
    updateCSS : function () {
        return Pig2d.model.prototype.updateCSS.call(this);
    },
    setFrame : function(index)  {

        //프레임 노드 얻기
        var element = this.get('element').querySelector('.pig2d-sprite-frame');
        var imglist = this.get('data').img_list;

        //프레인 노드 내의 자식노드 모두 없애기
        //이 방법이 가장 빠르다.
        //출처 : http://jsperf.com/innerhtml-vs-removechild
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }

        var imgElem = imglist[this.get('data').animation[index].name];

        element.appendChild( imgElem);

        this.attributes.currentFrame = index;

        return this;
    },
    nextFrame : function() {

        this.attributes.currentFrame++;

        this.attributes.currentFrame %= this.get('data').animation.length;

        this.setFrame(this.attributes.currentFrame);

        return this;

    },
    getAnimation_applier : function(param) {

        var accTick = 0;
        var startFrame = param.startFrame ? param.startFrame:0 ;
        var endFrame = param.endFrame ? param.endFrame : this.get('data').animation.length -1;

        var model = this;

        return function(deltaTime) {

            //var deltaTime = mytimer.getDeltaTime();
//            framerate_info.innerText = 1.0 / deltaTime;

            accTick += deltaTime;

            var ani = model.get('data').animation;

            var cuurentframe = model.get('currentFrame');

            if(param.keyFrame) {
                if(cuurentframe == param.keyFrame) {
                    param.callbackKeyFrame(model);
                }
            }

            var nextframe = (cuurentframe + 1);

            if(nextframe >= endFrame) {  //마지막프레임까지 진행되면...

//                console.log( nextframe + ',' +accTick);
                if( ani[nextframe].time < accTick) {
                    accTick = 0
                    model.setFrame(startFrame);
                    nextframe = startFrame;
                }
            }
            else {
                if( ani[nextframe].time < accTick) {

//                    console.log(nextframe);

                    model.nextFrame();
                }
            }

        }

    },
    clone : function() {

        var clone_model  = Backbone.Model.prototype.clone.call(this);

        //딥 클로닝

        var result_obj = {
            img_list : {}
        };

        var ani_obj = clone_model.get('data');

        for(var key in ani_obj.img_list) {

            result_obj.img_list[key] = ani_obj.img_list[key].cloneNode(true);

        }

        result_obj.animation = ani_obj.animation;

        clone_model.set({
            data : result_obj
        });


        return clone_model;
    }


});
//end of slot sprite model
///

////////////////
Pig2d.util.createSlotSprite = function(param) {

    var ani_obj =  Pig2d.util.spine.extractAnimation({
        spine_data : param.spine_data,
        slot_name  : param.slot_name,
        base_url   : param.base_url,
        img_type   : param.img_type,
        loadComplete : param.loadComplete
    });

    var node = new Pig2d.node();

    var model = new Pig2d.SlotSpriteModel({
        data : ani_obj
    });

    node.set({ model : model});

    return node;
};


Pig2d.util.spine = {
    /*

     반환 형식
     {
     img_list :{}
     animation :{}
     }
     */
    extractAnimation : function (param) {

        //default 를 키워드로 인식하는 번역기가 종종 있음
        var imagelist = param.spine_data.skins.default[param.slot_name];

        var result_obj = {
            img_list : {}
        };


        var imagelist_count = 0;
        for(var key in imagelist ) {
            imagelist_count++;
        }

        var counter = 0;
        for(var key in imagelist ) {

            //이미지 객체 만들기
            var imgobj = new Image();

            imgobj.onload = function() {

                counter++;
                //console.log(imagelist);

                if(counter == imagelist_count) {
                    if(param.loadComplete) {
                        param.loadComplete(result_obj);
                    }
                }
                else {
                    if(param.loadProgress) {
                        var evt = {
                            img : imgobj,
                            count : counter,
                            total_count : imagelist_count
                        }
                        param.loadProgress(evt);
                    }
                }
            };

            imgobj.src = param.base_url + '/' + key + '.' + param.img_type;
            imgobj.style.position = 'absolute';

            //console.log(imagelist[key].x);

            var cx = imagelist[key].x || 0;
            var cy = imagelist[key].y || 0;

            var dx = cx - (imagelist[key].width/2);
            var dy = -((imagelist[key].height/2) + cy );

            var cssstr =  'translate('+ dx  + 'px,'+ dy +'px)';

            //크로스 브라우져를 위해서
            imgobj.style.WebkitTransform = cssstr;
            imgobj.style.MozTransform = cssstr;
            imgobj.style.oTransform = cssstr;
            imgobj.style.Transform = cssstr;

            result_obj.img_list[key] = imgobj;

        }

        result_obj.animation = param.spine_data.animations.animation.slots[param.slot_name].attachment;

        return result_obj;

    }


}