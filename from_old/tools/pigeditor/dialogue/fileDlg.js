/**
 * Created by gbox3d on 2014. 1. 12..
 */


theApp.fileDlg = function(option) {

    var _theApp={};
    _theApp.baseUrl = theApp.webDosUrl;
    _theApp.currentPath = '/';

    _theApp.UIElement = {};
    _theApp.UIElement.listFile = document.querySelector(option.container + ' .file-list');
    _theApp.UIElement.inpFileName = document.querySelector(option.container +' .file-listview .file-name');


    var passwd = '1234'

    this.selectCallBack = null;


    //파일 오픈
    document.querySelector('.file-listview .btn-sel').addEventListener('click',
        (function(e) {
            var filename = _theApp.UIElement.inpFileName.value;

            if(filename[filename.length-1] == '/') { //디랙토리일경우

                _theApp.currentPath += filename;
                catalogFileList(_theApp.currentPath);

            }
            else { //파일이면

                theApp.UIelements.fileSelectDialogue.style.display = 'none';
                theApp.UIelements.fileSelectDialogue.style.zIndex = 10;

                this.selectCallBack({
                    select_file : _theApp.UIElement.inpFileName.value,
                    path : _theApp.currentPath
                });

            }
        }).bind(this)
    );
    //취소
    document.querySelector('.file-listview .btn-cancel').addEventListener('click',function(e) {

            //창닫기
            theApp.UIelements.fileSelectDialogue.style.display = 'none';
            theApp.UIelements.fileSelectDialogue.style.zIndex = 10;

        }
    )

    //한단계 위로 나가기
    document.querySelector('.file-listview .btn-go-parent-dir').addEventListener('click',function(e) {

        console.log(_theApp.currentPath);

        //루트가 아닐경우
        if(_theApp.currentPath.length > 1 ) {
            _theApp.currentPath = _theApp.currentPath.slice(0,_theApp.currentPath.length-1);

            //console.log(theApp.currentPath.lastIndexOf('/'));
            //console.log(theApp.currentPath);

            _theApp.currentPath = _theApp.currentPath.slice(0,_theApp.currentPath.lastIndexOf('/') + 1);

            catalogFileList(_theApp.currentPath);

        }

    });

    //홈으로가기(root)
    document.querySelector('.file-listview .btn-go-home-dir').addEventListener('click',function(e) {

        _theApp.currentPath = '/';
        catalogFileList(_theApp.currentPath);

    });

    //파일목록 처리
    function catalogFileList(directory) {

        console.log(directory);

        var param = {
            password : passwd,
            path : directory
        }

        $.ajax({
            url:  _theApp.baseUrl + '/catalog',
            type: 'POST',
            processData: false,
            data: JSON.stringify(param),
            success: function(data, textStatus, jqXHR) {

                console.log('success receive  data');
                console.log( data );

                var dataObj = JSON.parse(data);

                if(dataObj.result == 'ok' ||
                    dataObj.result == 'emptyFolder') {
                    //리스트 클리어
                    while(_theApp.UIElement.listFile.firstChild) {

                        var element = _theApp.UIElement.listFile.firstChild;
                        _theApp.UIElement.listFile.removeChild(element);
                    }

                    var file_list = dataObj.data || [];


                    for(var i=0; i< file_list.length;i++) {

                        var item = document.createElement('li');

                        //파일이면..
                        if(file_list[i].type == 0) {

                            item.innerText = file_list[i].name;
                            item.file_info = file_list[i];

                            //파일 선택
                            item.addEventListener('click',function(e) {
                                _theApp.UIElement.inpFileName.value = this.file_info.name;
                            });//addEventListener end

                        }
                        else {
                            //디랙토리일경우
                            var name_item = document.createElement('span');
                            name_item.innerText = '[' + file_list[i].name + ']';
                            name_item.file_info = file_list[i];
                            name_item.style.backgroundColor = '#888';

                            //디랙토리 열기
                            name_item.addEventListener('click',function(e) {

                                _theApp.UIElement.inpFileName.value = this.file_info.name + '/';

                                //theApp.currentPath += this.file_info.name + '/';
                                //catalogFileList(theApp.currentPath);

                            });

                            item.appendChild(name_item);
                        }

                        _theApp.UIElement.listFile.appendChild(item);
                    }

                }


            },
            complete: function(jqXHR, textStatus) {
                console.log('complete');

            },
            error: function(qXHR, textStatus, errorThrown) {
                console.log('error');
            }
        });

    }

    catalogFileList(_theApp.currentPath);

    this.setCurrentPass = function(path) {

        _theApp.currentPath = path;
        catalogFileList(_theApp.currentPath);
    }

}

theApp.fileDlg.prototype.Open = function(option) {

    theApp.UIelements.fileSelectDialogue.style.display = 'block';
    theApp.UIelements.fileSelectDialogue.style.zIndex = 10;

    this.selectCallBack =  option.selectCallBack;
    this.setCurrentPass(option.currentPath);
}





