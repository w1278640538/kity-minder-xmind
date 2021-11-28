(function() {
    var dropDownLi = "";
    var baocunName = "";
    var jsonList;
    var iffiles = 0;
    $.ajax({
        type: "POST",
        url: "./bower_components/php/index.php",
        data: "data=9918175",
        async: false,
        // dataType: "json",
        success: function(message) {
            var obj = JSON.parse(message);
            for (var i = 0; i < obj.length; i++) {
                dropDownLi += '<li><a class="dropDownLis" href="#"style="display:inline-block;width:70%;">' + obj[i] + '</a><span data-aname="' + obj[i] + '" class="listSpan glyphicon glyphicon-remove" aria-hidden="true"style="cursor:pointer;width:10px;float:right;color:black;margin-right:15px;margin-top:12px"></span></li>';
            }
        }
    });
    $.ajax({
        type: "POST",
        url: "./bower_components/php/index.php",
        data: "data=6609274",
        async: false,
        success: function(message) {
            baocunName = message;
        }
    });
    var dropdown = `<div class="dropdown export" style="float:right;" data-type="json">
    <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
      存档文件
      <span class="caret"></span>
    </button>
    <ul class="dropdown-menu" id="listUl" aria-labelledby="dropdownMenu1">
      ${dropDownLi}
    </ul>
  </div>`
    var html = '';
    html += '<a class="diy export" data-type="lingcunwei">另存为</a>',
        html += '<input type="text" id="inpname"; placeholder="请输入另存名称"; style="overflow:hidden;height: 30px;widthfloat:right;">',
        html += '<a class="diy export" data-type="baocun">保存</a>',
        html += '<a class="diy export" data-type="json">导出json</a>',
        // html += '<a class="diy export" data-type="md">导出md</a>',
        html += '<a class="diy export" data-type="svg">导出svg</a>',
        // html += '<a class="diy export" data-type="km">导出km</a>',
        html += '<a class="diy export" data-type="png">导出png</a>',
        html += '<button class="diy input">',
        html += '导入<input type="file" id="fileInput">',
        html += '</button>',
        html += '<a class="diy export" data-type="xinjian">新建</a>',
        html += dropdown;
    html += '<span id="spanName" style="float:right;color:white;margin-right:20px"></span>';
    html += '<span style="float:right;color:white;">当前打开文件：</span>';

    $('.editor-title').append(html);
    $('#inpname').css({
        'overflow': 'hidden',
        'height': '30px',
        'margin-top': '5px',
        'width': '110px',
        'float': 'right',
        'color': 'black'
    })
    $('.diy').css({
        // 'height': '30px',
        // 'line-height': '30px',
        'margin-top': '0px',
        'float': 'right',
        'background-color': '#fff',
        'min-width': '60px',
        'text-decoration': 'none',
        color: '#999',
        'padding': '0 10px',
        border: 'none',
        'border-right': '1px solid #ccc',
    });
    $('.input').css({
        'overflow': 'hidden',
        'position': 'relative',
    }).find('input').css({
        cursor: 'pointer',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        display: 'inline-block',
        opacity: 0
    });
    $('.export').css('cursor', 'not-allowed');
    $(document).on('mouseover', '.export', function(event) {
        // 链接在hover的时候生成对应数据到链接中
        event.preventDefault();
        var $this = $(this),
            type = $this.data('type'),
            exportType;
        switch (type) {
            case 'km':
                exportType = 'json';
                break;
            case 'baocun':
                exportType = 'json';
                break;
            case 'lingcunwei':
                exportType = 'json';
                break;
            case 'xinjian':
                exportType = 'json';
                break;
            case 'md':
                exportType = 'markdown';
                break;
            default:
                exportType = type;
                break;
        }

        editor.minder.exportData(exportType).then(function(content) {
            var blob = new Blob([content]);
            switch (exportType) {
                case 'json':
                    // console.log($.parseJSON(content));
                    jsonList = content;
                    break;
                case 'png':
                    var arr = content.split(','),
                        mime = arr[0].match(/:(.*?);/)[1],
                        bstr = atob(arr[1]),
                        n = bstr.length,
                        u8arr = new Uint8Array(n);
                    while (n--) {
                        u8arr[n] = bstr.charCodeAt(n);
                    }
                    blob = new Blob([u8arr], { type: mime });
                    break;
                default:
                    // console.log(content);
                    break;
            }
            $this.css('cursor', 'pointer');
            if (type != "baocun" && type != "lingcunwei" && type != "xinjian") {
                var url = URL.createObjectURL(blob);
                var aLink = $this[0];
                aLink.href = url;
                aLink.download = $('#node_text1').text() + '.' + type;
            }
            // else if (type == "baocun" || type == "lingcunwei") {
            //     console.log(jsonList)
            // }
        });
    }).on('mouseout', '.export', function(event) {
        // 鼠标移开是设置禁止点击状态，下次鼠标移入时需重新计算需要生成的文件
        event.preventDefault();
        // $(this).css('cursor', 'not-allowed');
    }).on('click', '.export', function(event) {
        // 禁止点击状态下取消跳转
        var $this = $(this);
        if (this.innerHTML == "新建") {
            $.ajax({
                type: "POST",
                url: "./bower_components/php/index.php",
                data: "data=5007529",
                async: false,
                success: function(message) {
                    $jsonfile = message;
                    $('.export').css('cursor', 'default');
                    var fileType = "json";
                    var content = $jsonfile;
                    editor.minder.importData(fileType, content).then(function(data) {});
                    alert('新建未命名文件！');
                    baocunName = "未命名"
                },
                error: function(message) {
                    alert("读取失败" + JSON.stringify(message));
                }
            });
            funName();
        }
        if (this.innerHTML == "保存") { //保存
            $.ajax({
                type: "POST",
                url: "./bower_components/php/index.php",
                data: "data=1100427&jsonList=" + jsonList + "&baocunName=" + baocunName,
                // dataType: "json",
                success: function(message) {
                    if (message == baocunName) {
                        alert("保存成功！");
                        iffiles = 1;
                    } else {
                        alert('保存失败！')
                    }
                },
                error: function(message) {
                    alert("保存失败" + JSON.stringify(message));
                }
            });
            funget();
        }
        if (this.innerHTML == "另存为") { //另存为
            var inp = document.getElementById('inpname');
            var inp1 = inp.value;
            if (inp1 != "") {
                $.ajax({
                    type: "POST",
                    url: "./bower_components/php/index.php",
                    data: "data=0275791&jsonList=" + jsonList + "&inp1=" + inp1,
                    success: function(message) {
                        if (message == inp1) {
                            alert('保存成功！');
                            inp.value = "";
                        } else {
                            alert('保存失败！');
                        }
                    },
                    error: function(message) {
                        alert("保存失败" + JSON.stringify(message));
                    }
                });
                inp.style.border = "none";
                haveList();
            } else {
                inp.style.border = "1px solid red";
            }
        }
        if ($this.css('cursor') == 'not-allowed') {
            event.preventDefault();
        }
    }).on("click", ".dropDownLis", function(event) { //切换json
        qiehuanbaocun();
        baocunName = this.innerHTML;
        $.ajax({
            type: "POST",
            url: "./bower_components/php/index.php",
            data: "data=8709216&jsonName=" + this.innerHTML,
            async: false,
            success: function(message) {
                $jsonfile = message;
                $('.export').css('cursor', 'default');
                var fileType = "json";
                var content = $jsonfile;
                editor.minder.importData(fileType, content).then(function(data) {});
            },
            error: function(message) {
                alert("读取失败" + JSON.stringify(message));
            }
        });
        funget();
        funName();
    }).on("click", ".listSpan", function() { //删除列表内json
        var dataName = this.getAttribute("data-aname");
        console.log(dataName);
        if (confirm("确认删除?")) {
            $.ajax({
                type: "POST",
                url: "./bower_components/php/index.php",
                data: "data=3573971&deleteName=" + dataName,
                async: false,
                success: function(message) {
                    if (message == "1") {
                        alert("删除成功！");
                    } else if (message == "2") {
                        alert("删除失败！");
                    }
                }
            });
            haveList();
        }
    });

    function funget() { //保存打开的json
        $.ajax({
            type: "POST",
            url: "./bower_components/php/index.php",
            data: "data=4798674&baocunName=" + baocunName,
            async: false,
            success: function(message) {
                if (message == baocunName) {

                } else {
                    alert('默认保存失败！')
                }
            }
        });
    }
    // 导入
    window.onload = function() {
        $('.export').css('cursor', 'default');
        var fileInput = document.getElementById('fileInput');
        fileInput.addEventListener('change', function(e) {
            var file = fileInput.files[0],
                // textType = /(md|km)/,
                fileType = file.name.substr(file.name.lastIndexOf('.') + 1);
            switch (fileType) {
                case 'md':
                    fileType = 'markdown';
                    break;
                case 'km':
                case 'json':
                    fileType = 'json';
                    break;
                default:
                    console.log("File not supported!");
                    alert('只支持.km、.md、.json文件');
                    return;
            }
            var reader = new FileReader();
            reader.onload = function(e) {
                var content = reader.result;
                editor.minder.importData(fileType, content).then(function(data) {
                    $(fileInput).val('');
                });
            }
            reader.readAsText(file);
            var filename = file.name;
            baocunName = filename.substring(0, filename.indexOf('.'));
            funName();
        });
    }
    $.ajax({
        type: "POST",
        url: "./bower_components/php/index.php",
        data: "data=8709216&jsonName=" + baocunName,
        success: function(message) {
            $jsonfile = message;
            $('.export').css('cursor', 'default');
            var fileType = "json";
            var content = $jsonfile;
            editor.minder.importData(fileType, content).then(function(data) {});
        },
        error: function(message) {
            alert("读取失败" + JSON.stringify(message));
        }
    });

    function funName() {
        var spanName = document.getElementById('spanName');
        spanName.innerHTML = baocunName;
    }
    funName();

    function qiehuanbaocun() {
        $.ajax({
            type: "POST",
            url: "./bower_components/php/index.php",
            data: "data=1100427&jsonList=" + jsonList + "&baocunName=" + baocunName,
            async: false,
            success: function(message) {},
            error: function(message) {
                alert("保存失败" + JSON.stringify(message));
            }
        });
    }

    function haveList() {
        var listUl = document.getElementById('listUl');
        listUl.innerHTML = "";
        dropDownLi = "";
        $.ajax({
            type: "POST",
            url: "./bower_components/php/index.php",
            data: "data=9918175",
            async: false,
            // dataType: "json",
            success: function(message) {
                var obj = JSON.parse(message);
                for (var i = 0; i < obj.length; i++) {
                    dropDownLi += '<li><a class="dropDownLis" href="#"style="display:inline-block;">' + obj[i] + '</a><span data-aname="' + obj[i] + '" class="listSpan glyphicon glyphicon-remove" aria-hidden="true"style="cursor:pointer;width:10px;float:right;color:black;margin-right:15px;margin-top:12px"></span></li>';
                }
            }
        });
        listUl.innerHTML = dropDownLi;
    }
    $(document).on('click', '#butDivInp', function(event) {
        var state = this.checked;
        $.ajax({
            type: "POST",
            url: "./bower_components/php/index.php",
            data: "data=5515274&state=" + state,
            success: function(message) {

            }
        });
    });

    var into, seconds;

    (function() {
        var butDivInp = document.getElementById('butDivInp')
            // console.log(butDivInp.checked);
        $.ajax({
            type: "POST",
            url: "./bower_components/php/index.php",
            data: "data=5015089",
            success: function(message) {
                if (message == "true") {
                    butDivInp.checked = "true";
                    timetoin();
                } else {
                    butDivInp.checked = ""
                }
            }
        });
    })();

    function ckockint() {
        $(document).on('click', '#butDivInp', function() {
            var state = this.checked;
            if (state != "") {
                timetoin();
            }
            if (state == "") {
                var daojishi = document.getElementById('daojishi');
                window.clearInterval(seconds)
                window.clearInterval(into)
                daojishi.innerHTML = ""
            }
        })
    }
    ckockint()

    function timetoin() {
        var exportType = "json";
        editor.minder.exportData(exportType).then(function(content) {
            jsonList = content;
            timein(jsonList)
        })
        into = window.setInterval(function() {
            if (seconds != "") {
                window.clearInterval(seconds)
            }
            editor.minder.exportData(exportType).then(function(content) {
                jsonList = content;
                timein(jsonList)
            })
        }, 122000)
    }

    function timein(jsonList) {
        var daojishi = document.getElementById('daojishi');
        $.ajax({
            type: "POST",
            url: "./bower_components/php/index.php",
            data: "data=1100427&jsonList=" + jsonList + "&baocunName=" + baocunName,
            // dataType: "json",
            success: function(message) {
                if (message == baocunName) {
                    console.log("保存成功！")
                    var time = 120,
                        daojishitime;
                    seconds = window.setInterval(function() {
                        if (time >= 120) {
                            if ((time - 120) >= 10) {
                                daojishitime = '02:' + (time - 120)
                            }
                            if ((time - 120) < 10) {
                                daojishitime = '02:0' + (time - 120)
                            }
                        } else if (time >= 60) {
                            if ((time - 60) >= 10) {
                                daojishitime = '01:' + (time - 60)
                            }
                            if ((time - 60) < 10) {
                                daojishitime = '01:0' + (time - 60)
                            }
                        } else if (time >= 1) {
                            if (time >= 10) {
                                daojishitime = '00:' + time
                            }
                            if (time < 10) {
                                daojishitime = '00:0' + time
                            }
                        } else if (time == 0) {
                            daojishitime = "已保存"
                        }
                        time--;
                        daojishi.innerHTML = daojishitime
                    }, 1000)
                } else {
                    console.log("保存失败！")
                    seconds = "";
                }
            },
            error: function(message) {
                seconds = "";
                alert("自动保存失败" + JSON.stringify(message));
            }
        });
    }
})();