/**
 * Created by gbox3d on 2013. 12. 19..
 */

Pig2d.SpriteModel.fixedCanvas = Pig2d.SpriteModel.extend({

    initialize: function(param) {

        this.attributes.data.canvas_size = param.canvas_size;

        if(this.attributes.data.canvas_size == undefined) {

            this.attributes.data.canvas_size = {
                width : 64,
                height: 64
            }

        }

        Pig2d.SpriteModel.prototype.initialize.call(this,param);

    },
    changeDress : function(param) {

        this.attributes.imgObj = param.texture;
        this.attributes.data = param.animation;

        var sheet = this.get('sheet');

        this.setFrame(this.attributes.currentFrame);

    },
    applyAnimation : function(delataTick) {

        if(this.attributes.AnimationStatus == 'play') {

            this.attributes.currentTick += delataTick;
            var frameindex =  this.attributes.currentFrame;
            var Ani_data = this.get('data');

            var delay = 300;
            if(frameindex >= 0) {
                delay = Ani_data.frames[frameindex].delay / 1000;
            }

            if(this.attributes.currentTick > delay) {

                //틱리셋
                this.attributes.currentTick = 0;

                if(frameindex < 0) { //공백프레임부터 시작했으면..
                    frameindex = this.attributes.startFrame;
                }
                else {
                    ++frameindex;
                }

                if(frameindex > this.attributes.endFrame) {//마지막 프레임이면

                    if(this.attributes.isAnimationLoop) {
                        frameindex = this.attributes.startFrame;
                        this.setFrame(frameindex);
                    }
                    else {
                        this.attributes.AnimationStatus = 'stop';
                        frameindex = this.attributes.endFrame;
                    }


                    if(this.attributes.AnimationEndCallback != undefined) {

                        this.attributes.AnimationEndCallback.bind(this)();

                    }

                }
                else {
                    this.setFrame(frameindex);
                }
            }
        }


    },

    destroy : function() {
        //슈퍼 클래싱
        Pig2d.SpriteModel.prototype.destroy.call(this);
    }


});