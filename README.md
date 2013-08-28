pig2d
=====

fast and light weight html5 2d game engine

이 엔진은 세가지 기본 구성요소인 
node , model , scenemanager
 로 이루어져 있습니다.

씬매니져를 만들고 노드를 만들어서 씬매니져에 추가 시켜는 형식으로 사용합니다.

1. 씬매니져 생성

    //씬메니져 생성하기
    var Smgr = new Pig2d.SceneManager({
        container : document.querySelector('.pig2d-fullscreen')
    });

2. 노드생성

    var node = new Pig2d.node();
    var model = new Pig2d.model();
    var element = document.createElement('p');
    element.innerText = 'hello pig2d';
    element.style.backgroundColor = 'yellow';

    model.get('element').appendChild(element);
    model.setPosition(100,100);

    node.set({model : model});

    Smgr.add(node);
    
3. game loop

    requestAnimationFrame(
      function loop() {
      	Smgr.updateAll();
        
      }
            
    );




