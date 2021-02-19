/*
 *
 *    ■ c r a w c . n e t ■
 *    c ◿ □ ▭ ◁ ○ ▷ ▭ □ ◺ c
 *    r □ ◇ △ ◇ ▽ ◇ △ ◇ □ r
 *    a ▯ ◁ ○ ▷ ✜ ◁ ○ ▷ ▯ a
 *    w △ ◇ ▽ ◇ △ ◇ ▽ ◇ △ w
 *    c ○ ▷ ✜ ◁ ❂ ▷ ✜ ◁ ○ c
 *    . ▽ ◇ △ ◇ ▽ ◇ △ ◇ ▽ .
 *    n ▯ ◁ ○ ▷ ✜ ◁ ○ ▷ ▯ n
 *    e □ ◇ ▽ ◇ △ ◇ ▽ ◇ □ e
 *    t ◹ □ ▭ ◁ ○ ▷ ▭ □ ◸ t
 *    ■ c r a w c . n e t ■
 *
 *
 */


function t(temp, lang) {
    
    if (typeof lang == 'undefined')
        lang = $(location).attr('pathname').replaceArray({'/':'', 'readonly':''});

    var obj = {
        "%%crawcat%%": {
            'ru': "кравкот",
            'en': "crawcat"
        },
        "%%Draw%%": {
            'ru': 'Рисовач',
            'en': 'Draw'
        }
    };

    var regex;
	var text = temp;
    for (var i in obj) {
        regex = new RegExp(i, "gi");
        text = text.replace(regex, obj[i][lang]);
    }

    return text.replace(new RegExp("%%([^%]+)%%", "gi"),"$1");
}



 function strpos( haystack, needle, offset){	
	var i = haystack.indexOf( needle, offset );
	return i >= 0 ? i : false;
}      
                            
function isset(v) {
    return typeof(v) !== 'undefined';
}
 
 function remove_popup() {
    $('.blackout').remove(); 
 }
 
 function back_to_rooms($popup) {
    $popup.remove();
    $('.blackout .popup.poprooms:hidden').show();
 }
 
 function createRoom() {
    $('.blackout .popup').hide();
    $('.blackout').prepend(
            '<div class="popup" style="min-width:55em">'+
                '<div class="popup-x glyphicon glyphicon-remove" onclick="back_to_rooms($(this).parent())"></div>'+
                '<h3>create room</h3>'+
                '<div class="new-room-form">'+
                    '<input type="text" id="newroomname" class="form-control" placeholder="Room name">'+
                    '<input type="hidden" name="password"  id="roomspassword" val="">'+
                    '<textarea id="newsmessage" class="form-control" placeholder="Welcome"></textarea>'+
                    '<div class="clr0"><span>background</span><input id="newscolor" class="form form-control formcolor" style="width:100px;" type="text" value="#111111"><span>text</span><input id="newstextcolor" class="form form-control formcolor" style="width:100px;" type="text" value="#fafafa"></div>'+
                    '<button class="newroombtn btn btn-primary">Создать</button>'+
                    '<div class="add-lock"><input id="showbroadcast" type="checkbox"><label for="showbroadcast">set password</label></div>'+
                '</div>'+
            '</div>'
    );
    
    $('#newsmessage').summernote({lang: 'en-US', height:300});
    $('.note-editable').trigger('focus');
    $('#newsmessage').focus();
    $('#newscolor').colorpicker();
    $('#newscolor').colorpicker().on('changeColor', function(ev){
        $('.blackout .popup #newscolor').val(ev.color.toHex());
    });
    $('#newstextcolor').colorpicker();
    $('#newstextcolor').colorpicker().on('changeColor', function(ev){
        $('.blackout .popup #newstextcolor').val(ev.color.toHex());
    });
    
    $('.blackout .popup .newroombtn').click(function() {
        socket.send(JSON.stringify({
            act: 'newroom',
            room_name: $('#newroomname').val(),
            password: $('#roomspassword').val(),
            lang: $(location).attr('pathname').replaceArray({'/':'', 'readonly':''})
        }));
    });
    
    $("#showbroadcast").change(function() {
        if(this.checked) {
            $('#roomspassword').val(prompt("Enter the password of your room"));
        } else {
            $('#roomspassword').val("");
        }
    });
    
    
}

function save_settings() {
    
    socket.send(JSON.stringify({
        act: 'save_settings',
        enabled: $('#audionote').prop("checked"),
        dark: $('#darktheme').prop("checked")
    }));
    
    if ($('#audionote').prop("checked")) {
        window.audio = 1;
    } else {
        window.audio = 0;
    }
}

function settings() {
    
    var checked = '';
    if (window.audio) checked = 'checked="checked"';
    
    $('body').prepend($('<div class="blackout">'))
    $('.blackout').prepend(
            '<div class="popup" style="min-width:300px">'+
                '<div class="popup-x glyphicon glyphicon-remove" onclick="$(\'.blackout\').remove();"></div>'+
                '<h3>settings</h3>'+
                '<div class="new-room-form">'+
                    '<div style="margin-left:10px"><input id="audionote" type="checkbox" '+checked+'><label for="audionote">Audio notifications</label></div>'+
                    '<div style="margin-left:10px"><input id="darktheme" type="checkbox" '+($('html').hasClass('dark') ? 'checked="checked"' : "")+'><label for="darktheme">Dark theme</label></div>'+
                    '<button class="btn btn-primary" style="margin-top: 12px;" onclick="save_settings(); $(\'.blackout\').remove();">Сохранить</button>'+
                '</div>'+
            '</div>'
    );
    
    $('#darktheme').change(function(){
        $('html').toggleClass('dark');
    });
    
}

function japanse () {
    $('body').prepend($('<div class="blackout">'))
    $('.blackout').prepend(
            '<div class="popup" style="min-width:300px;width: 800px;z-index:2000;">'+
                '<div class="popup-x glyphicon glyphicon-remove" onclick="$(\'.blackout\').remove();"></div>'+
                '<h3>Jemoticons</h3>'+
                '<iframe id="frame-wr" style="width:100%;height:480px;box-shadow: 0 0 0 4px #1e314f;border: none;" src="https://crawc.net:9000/en/"></iframe>'+
            '</div>'
    );
    
};

function draw () {
    $('body').prepend($('<div class="blackout draw" onclick="$(\'.blackout\').remove();" style="'+$(".flag:not(.fgray)").attr('style')+'">'))
    $('.blackout').prepend(
            '<div class="popup" style="min-width:300px;width:1280px;z-index:2000;padding:0;background:none;">'+
                '<iframe id="frame-wr" style="width:100%;height:800px;border: none;" src="https://www.pixilart.com/draw"></iframe>'+
            '</div>'
    );
    
};

function showRooms() {
    $('body').prepend(
            '<div class="blackout">'+
                '<div class="popup poprooms" style="min-width:640px">'+
                    '<div class="popup-x glyphicon glyphicon-remove" onclick="remove_popup()"></div>'+
                    '<h3>Rooms</h3>'+
                    '<div class="rooms-search">'+
                            '<input type="text" class="form-control rooms-search-input">'+
                        '<span>поиск</span>'+
                    '</div>'+
                    '<div class="rooms-area">'+
                        '<center class="rooms-loading"><img src="img/spin.gif" style="width:36px;margin:12px 0 16px 0;"></center>'+
                        '<div class="rooms-list"></div>'+
                    '</div>'+
                    '<div class="rooms-pages"></div>'+
                    '<div class="newroom">create room</div>'+
                '</div>'+
            '</div>'
    );
    $(document).on('click touchstart', '.newroom', function() {createRoom();})
    
    
    getRooms($('.rooms-search-input').val(), 0); 
    
    $('.rooms-search-input').keyup(function() {
        getRooms($(this).val(), 0);
        
    });
    
}

String.prototype.replaceArray = function(obj) {
    var replaceString = this;
    var regex;
    for (var i in obj) {
        regex = new RegExp(i, "gi");
        replaceString = replaceString.replace(regex, obj[i]);
    }
    return replaceString;
}

function getRooms(q, page){
    
    if(!page) page=0;
    
    var lang = $(location).attr('pathname').replaceArray({'/':'', 'readonly':''});
    
    $.ajax({
        
        url: '/act',
        type: 'POST',
        dataType: 'json',
        data: {act:'get_rooms', q:q, page:page, lang:lang},        
        success: function (data) {
            console.log('get-rooms');
            $('.rooms-loading').hide();
            $('.rooms-list').html('');
            
            if (data.success == 0) {
                $('.rooms-list').append(
                    '<div class="message message-err">'+
                        'I can\'t get rooms list'+
                    '</div>'
                );
            } else if (!data.rooms.length) {
                $('.rooms-list').append(
                    '<div class="message">'+
                        'Your search did not match'+
                    '</div>'
                );
            }
            
            for (var key in data.rooms) {
                var lock = '';
                if (data.rooms[key]['locked'])
                    lock = '<span class="glyphicon glyphicon-lock lock"></span>'
                
                ochoba = data.rooms[key]['room_id'] == 39 ? '<div class="center-new-ochoba">(основная комната)</div>' : '';
                img = data.rooms[key]['img'] ? '<img src="'+data.rooms[key]['img']+'">' : '';
                bm = (data.rooms[key]['bm'] ? '<span class="bm">NEW</span>' : '');
                $('.rooms-list').append(
                        '<div class="room-item-new" data-roomid="'+data.rooms[key]['room_id']+'">'+
                            '<div class="right-new">'+bm+'<span>'+data.rooms[key]['mcnt']+'</span>'+data.rooms[key]['cnt']+'</div>'+
                            '<div class="left-new">'+data.rooms[key]['room_id']+'</div>'+
                                ochoba + img +
                            '<div class="center-new">'+lock+data.rooms[key]['room']+'</div>'+
                        '</div>'
                );
            };
            
            $('.room-item-new').mousemove(function(e) {
                roomPreview($(this), e);
            });
            
            $('.room-item-new').mouseout(function() {
                $(this).find('img').hide();
            })
                        
            $('.room-item-new').click(function() {
                hash = '#'+($(this).find('.center-new').text());
                hash = hash.replaceArray({':':'', ' ':'_'});
                if (!$('#tabroom'+$(this).data('roomid')).length) {
                    
                    if ($(this).find('.lock').length)
                        location.hash = hash+':'+prompt('Enter the password');
                    else
                        location.hash = hash;
                    
                }
                else {
                    $('#tabroom'+$(this).data('roomid')).click();
                    $('.blackout').remove();
                }
                
            });
            
            if (data.page > data.pages_count-1) data.page = data.pages_count-1;
            
            $('.rooms-pages').html(pagination(data.page, data.pages_count));
            $('.rooms-pages .page:not(.selected)').bind('click touchstart', function() {
                getRooms($('.rooms-search-input').val(), $(this).data('page'));
            });
            $('.rooms-pages .page-input').keydown(function(e) {                
                if (e.which >= 48 && e.which <= 57 || e.which >= 96 && e.which <= 105 || e.which == 8 || e.which == 37 || e.which == 39 || e.which == 13) {
                    if (e.which == 13) getRooms($('.rooms-search-input').val(), parseInt($(this).val())-1);
                    return true;
                }
                else return false;
            });
            if ($('.popup').length) {
                var popup_offset_top = $('.popup').offset().top;
                $('.popup').css({'transform':'translateX(-50%) translateZ(0)', top:popup_offset_top+'px'});
            }
        }
    });
}

function enterTheRoom(room_id, password) {
    
    if ($('#tabroom'+room_id).length) {
        $('#tabroom'+room_id).click();
        remove_popup();
    } else {
        socket.send(JSON.stringify({
            act: 'enter_the_room',
            room_id: room_id,
            password: password,
            mob: $('body').hasClass('mobile')
        }));
    }
}

function addDialog(user, active) {
    
    if (!$('#tabdialog'+user.user_id).length) {
        console.log(user.user_name);
        if (typeof user.user_name == 'undefined') {
            $.get( "/uin/"+user.user_id, function( data ) {
                user.user_name = data;
                addTab(user.user_id, user.user_name, 0, active);
                addArea({area_type:'dialog', dialog_info:{user_id:user.user_id}}, active);
                $('#dialog'+user.user_id+' .msg-area').focus();
            });
        } else {
            addTab(user.user_id, user.user_name, 0, active);
            addArea({area_type:'dialog', dialog_info:{user_id:user.user_id}}, active);
            $('#dialog'+user.user_id+' .msg-area').focus();
        }
    } else {
        $('#tabdialog'+user.user_id).click();
    }
}

function expand_bc() {
    
   
    
    $('.closeanketa:visible:not(.glyphicon-plus)').click();
    
    $('body').dblclick(function() {
        if(!$(event.target).is(".bc")) {
            if ($('.bc.expanded:visible').length && !$('.bc.expanded:visible').is(':hover'))
                $('.bc.expanded:visible').removeClass('expanded');
        }
    });
    
    $('.anketamin:visible').click(function() {
        if(!$(event.target).is(".bc")) {
            $('.bc.expanded:visible').removeClass('expanded');
        }
    });
    
    /*
    $(this).dblclick(function() {
        if ($(this).hasClass('expanded')) {
            $('.bc.expanded:visible').removeClass('expanded');
        }
    })*/
    
    if ($('.bc.expanded:visible').length == 0) {
        $(this).addClass('expanded');
    } else if ($(this).hasClass('expanded')) {
        //$('.bc.expanded:visible').removeClass('expanded');
    } else {
        $('.bc.expanded:visible').removeClass('expanded');
        $(this).addClass('expanded');
    }
    

}

function move_bc() {
    console.log('move_bc');
    if ($('.mybcbc.bcbc:visible').length) $('.mybcbc.bcbc:visible').sortable({revert:true, handle:'.bcmove', update: function(event, ui) {
        var numeration = [];
        $('.mybcbc.bcbc:visible .bc').each(function(index) {
            numeration[index]=$(this).attr('data-id')
        }).promise().done( function(){ 
            socket.send(JSON.stringify({
                act: 'ordes',
                room_id: $('.tab.room.active').attr('data-id'),
                numeration:numeration
            }));
        } );;
        
        
        
     }});
}

function startrecord(mediaRecorder){
    mediaRecorder.start();
    //$(".crawcat").before('<div class="record"><div style="color: #112727;">Говорите в кота</div><b id="rec_time" class="rec_time">0</b> <b>сек</b><span class="meow">▸</span></div>');
    $('#rec').addClass('hover');
    
}
function stoprecord(mediaRecorder) {
    mediaRecorder.stop();
    $('#rec').removeClass('hover');
    //$('.record').remove();
}

async function sendVoice(form) {
    
    let promise = await fetch('/voice', {
        method: 'POST',
        body: JSON.stringify(form)});
    if (promise.ok) {
    
        /*
        let response =  await promise.json();
        console.log(response.data);
        let audio = document.createElement('audio');
        audio.src = response.data;
        audio.controls = true;
        audio.autoplay = true;
        document.querySelector('#messages').appendChild(audio);
        */
    }
    
}

function addRoom(room) {
    clicker = window.user_id;
    c = 1;
    remove_popup();
    addTab(room.info.room_id, room.info.room_name, 1, 1);
    addArea({area_type:'room', room_info:{room_id:room.info.room_id, room_admin:room.info.room_admin}}, 1);
    for (var i in room.messages) {
        addMessage('append', {to:'room', id:room.info.room_id}, room.messages[i], 1);
    }
    for (var i in room.broadcast) {
        msgarr = splitMessage(room.broadcast[i].message);
        $('#broadcastarearoom'+room.broadcast[i].room_id+' .bcbc').append('<div class="bc" id="bc'+room.broadcast[i].id+'" data-id="'+room.broadcast[i].id+'" data-b="'+room.broadcast[i].color+'" data-t="'+room.broadcast[i].textcolor+'" style="background:'+room.broadcast[i].color+';color:'+room.broadcast[i].textcolor+'"><span class="visible">'+msgarr['min']+'</span><span class="hidden">'+msgarr['full']+'</span>'+'<div class="myedit glyphicon glyphicon-edit"></div><div class="mydel glyphicon glyphicon-remove"></div><div class="bcmove"><span class="glyphicon glyphicon-resize-vertical" aria-hidden="true"></span><span class="glyphicon glyphicon-resize-vertical" aria-hidden="true"></span></div></div>');
        $('#bc'+room.broadcast[i].id).click(expand_bc);
        $('#bc'+room.broadcast[i].id+' .bcmove').mousedown(move_bc);
        $('#bc'+room.broadcast[i].id+' .bcmove').click(function() {return false});
        if (i == 0) $('#bc'+room.broadcast[i].id).click();
    }
    
    
    
    $('.mydel').click(function() {
        //$(this).parent('.bc').click();
        if (confirm('Are you sure you want to delete this news?')) {
            socket.send(JSON.stringify({
                act: 'delbroadcast',
                room_id: room.info.room_id,
                message_id: $(this).parent('.bc').data('id'),
            }));
        }
        return false;
    })
    
            $('#broadcastarearoom'+room.info.room_id+'').append('<a id="crawcat" class="crawcat" onclick="javascript:invert = $(\'html\').hasClass(\'dark\') ? \'invert(1)\' : \'\';clicker_s = rand(360);saturate=1;$(\'body\').css({\'filter\': \'hue-rotate(\''+'+clicker_s+'+'\'deg) saturate(\'+saturate+\')\'}); $(stop).css({\'filter\': \'hue-rotate(-\'+(clicker_s)+\'deg) saturate(\'+(2-saturate)+\') \'+invert})"><p style="margin-top:16px;padding:10px;width:92px;line-height:18px;white-space:pre;font-family:monospace;text-align:center;cursor:default;font-size:14px;position:absolute;margin-left:16px;right:0;margin-top:50px;">|\\ _ /|<br>! O O !<br>&gt; =I= &lt;<br>'+t('%%crawcat%%')+'</p></a>')
    
    if (window.user_id ==room.info.creator_id) {
        stop=".flag, .avatar, .yavatar, img, iframe";
        
        $('#broadcastarearoom'+room.info.room_id+' .bcbc').addClass('mybcbc');
        $('#broadcastarearoom'+room.info.room_id+' .mydel, #broadcastarearoom'+room.info.room_id+' .myedit').show();
        $('#broadcastarearoom'+room.info.room_id+' .myedit').click(function() {myedit_click($(this).parent().data('id'), $(this).parent().children('.hidden').html(), $(this).parent().attr('data-b'), $(this).parent().attr('data-t'));return false;});
        $('#broadcastarearoom'+room.info.room_id+'').append('<a class="cssbtn btn btn-default">Options</a><div class="broadcastbtn"><a class="btn btn-default">Add news</a></div>');
        $('#room'+room.info.room_id+' .broadcastbtn a').click(function() {

            $('body').prepend(
                '<div class="blackout">'+
                    '<div class="popup" style="width:55em">'+
                        '<div class="popup-x glyphicon glyphicon-remove" onclick="remove_popup()"></div>'+
                        '<h3>Adding news</h3>'+
                        '<form method="post" style="margin-bottom:20px;"><textarea id="newsmessage"  class="form form-control" style="resize:vertical;margin-bottom:15px;background:#fafafa;color:#333333;"></textarea></form>'+
                        '<input id="newsbtn" class="btn btn-primary" style="float:right;" type="button" value="Broadcast">'+
                        '<div class="clr0"><span>background</span><input id="newscolor" class="form form-control formcolor" style="width:100px;" type="text" value="#fafafa"><span>text</span><input id="newstextcolor" class="form form-control formcolor" style="width:100px;" type="text" value="#333333"></div>'+
                    '</div>'+
                '</div>'
            );
    
            $('#newsmessage').summernote({lang: 'en-US', height:300});
            $('.note-editable').trigger('focus');
            $('#newsmessage').focus();
            $('#newscolor').colorpicker();
            $('#newscolor').colorpicker().on('changeColor', function(ev){
                $('.blackout .popup #newscolor').val(ev.color.toHex());
                $('.blackout .popup textarea').css("background", ev.color.toHex());
            });
            $('#newstextcolor').colorpicker();
            $('#newstextcolor').colorpicker().on('changeColor', function(ev){
                $('.blackout .popup #newstextcolor').val(ev.color.toHex());
                $('.blackout .popup textarea').css("color", ev.color.toHex());
            });
            $('#newsbtn').click(function() {
                socket.send(JSON.stringify({
                    act: 'broadcast',
                    room_id: $('.area:visible').data('id'),
                    message: $('#newsmessage').summernote('code'),
                    color: $('#newscolor').val(),
                    textcolor: $('#newstextcolor').val(),
                }));
                $('.blackout').remove();
            })
        })
        $('#room'+room.info.room_id + ' a.cssbtn').click(function() {
            
            $.get( "/roomstyle/"+room.info.room_id+".css", function( data ) {
                $('body').prepend(
                '<div class="blackout opts'+window.user_id+'">'+
                    '<div class="popup" style="width:55em">'+
                        '<div class="popup-x glyphicon glyphicon-remove" onclick="remove_popup()"></div>'+
                        '<h3>Edit rooms options</h3>'+
                        '<table style="width:100%;margin-bottom:16px;"><tr><td class="tod" style="width:100px;">Room name:</td><td><input style="width:90%;" type="text" id="roomname" class="form form-control" value="'+$('.tab.room.active .tab-title').html()+'"></td><td class="tod" style="width:100px;">CSS Styles:</td></tr></table>'+
                        '<form method="post" style="margin-bottom:20px;"><textarea id="csscode"  class="form form-control" style="resize:vertical;margin-bottom:15px;background:#fafafa;color:#333333;">'+data+' </textarea></form>'+
                        '<input id="csssavebtn" class="btn btn-primary" style="float:right;" type="button" value="Save">'+
                        '<input type="text" class="form form-control" id="roompwd" value="'+$('.tab.room.active').attr('data-pass')+'"><span style="    position: relative;top: 6px;left: 16px;"> - password</span>'+
                    '</div>'+
                '</div>'
                );
                
                $('#csscode').summernote({lang: 'en-US', height:300, callbacks: {
                    onInit: function() {
                        $("div.note-editor button.btn-codeview").click();
                        $('.note-toolbar').hide();
                    }
                }});
                $('.note-editable').trigger('focus');
                $('#csscode').focus();
                $('#csssavebtn').click(function() {
                    socket.send(JSON.stringify({
                        act: 'savecss',
                        room_id: $('.area:visible').data('id'),
                        csscode: $('#csscode').summernote('code'),
                        newname: $('#roomname').val(),
                        pwd:$('#roompwd').val()
                    }));
                })
            });
            
            
        });
        
    }
    
        $('#broadcastarearoom'+room.info.room_id).append(
            '<div class="wrapper">'+
            '<article>'+
            '<div id="share">'+
                    '<div class="like">LIKE</div>'+
                    '<div class="social" data-url="https://crawc.net/'+window.lang+'/'+window.location.hash+'" data-title="Чат '+$('#tabroom'+room.info.room_id+' .tab-title').text()+'" >'+
                            '<a class="push facebook" data-id="fb"><i class="fa fa-facebook"></i></a>'+
                            '<a class="push twitter" data-id="tw"><i class="fa fa-twitter"></i></a>'+
                            '<a class="push vkontakte" data-id="vk"><i class="fa fa-vk"></i></a>'+
                            '<a class="push odnoklassniki" data-id="ok"><i class="fa fa-odnoklassniki"></i></a>'+
                    '</div>'+
            '</div>'+
            '</article>'+
            '</div>'
    );
    
    
   $('.social a').on('click', function() {
    	var id = $(this).data('id');
    	if(id) {
    		var data = $(this).parent('.social');
    		var url = data.data('url') || location.href, title = data.data('title') || '', desc = data.data('desc') || '';
    		Shares.share(id, url, title, desc);
    	}
    });
    $(document).on("touchstart", '.social a', function() {
        var id = $(this).data('id');
    	if(id) {
    		var data = $(this).parent('.social');
    		var url = data.data('url') || location.href, title = data.data('title') || '', desc = data.data('desc') || '';
    		Shares.share(id, url, title, desc);
    	}
    });
    
    
    for (var i in room.users) {
        addUser(room.info.room_id, room.users[i], 0);
    }
    
    $( '#room'+room.info.room_id+' td.input .resize-y').resizable({handles: 'n'});
    $('#room'+room.info.room_id+' .msg-area').focus();
}

function myedit_click(id, content, b, t) {
    $('body').prepend(
        '<div class="blackout">'+
            '<div class="popup" style="width:55em">'+
                '<div class="popup-x glyphicon glyphicon-remove" onclick="remove_popup()"></div>'+
                '<h3>Editting news</h3>'+
                '<form method="post" style="margin-bottom:20px;"><input id="newsid" value="'+id+'" type="hidden"><textarea id="newsmessage"  class="form form-control" style="resize:vertical;margin-bottom:15px;background:#fafafa;color:#222;">'+content+'</textarea></form>'+
                '<input id="newsbtn" class="btn btn-primary" style="float:right;" type="button" value="Edit news">'+
                '<div class="clr0"><span>background</span><input id="newscolor" class="form form-control formcolor" style="width:100px;" type="text" value="'+b+'"><span>text</span><input id="newstextcolor" class="form form-control formcolor" style="width:100px;" type="text" value="'+t+'"></div>'+
            '</div>'+
        '</div>'
    );
    
    $('#newsmessage').summernote({lang: 'en-US', height:300});
    $('.note-editable').trigger('focus');
    $('#newsmessage').focus();
    $('#newscolor').colorpicker();
    $('#newscolor').colorpicker().on('changeColor', function(ev){
        $('.blackout .popup #newscolor').val(ev.color.toHex());
        $('.blackout .popup textarea').css("background", ev.color.toHex());
    });
    $('#newstextcolor').colorpicker();
    $('#newstextcolor').colorpicker().on('changeColor', function(ev){
        $('.blackout .popup #newstextcolor').val(ev.color.toHex());
        $('.blackout .popup textarea').css("color", ev.color.toHex());
    });
    $('#newsbtn').click(function() {
        socket.send(JSON.stringify({
            act: 'broadcast_edit',
            rmid: id,
            room_id: $('.area:visible').data('id'),
            message: $('#newsmessage').summernote('code'),
            b: $('#newscolor').val(),
            t: $('#newstextcolor').val(),
        }));
        //$('.blackout').remove();
    })
}

function addTab(id, tab_title, is_room, is_active) {
    
    $('#usercss').remove();
    if(is_room) $('head').append('<link id="usercss" rel="stylesheet" href="/roomstyle/'+id+'.css">');
    
    var tab_id = is_room ? 'tabroom'+id : 'tabdialog'+id;    
    var tab_container = is_room ? '.tabsrooms' : '.tabsdialogs';
    var tab_type = is_room ? 'room' : 'dialog';
    var tab_content = is_room ? tab_title : 'Private <span class="nn">'+tab_title+'</span>'
    var tab_active = is_active ? 'active' : 'not-active';    
    if (is_active) $('.top .tab.active:not(#'+tab_id+')').removeClass('active').addClass('not-active');
    
    if(location.hash.indexOf(':') > -1)
        pass = location.hash.split(':')[1]
    else pass='';
    $(tab_container).append(
            '<div id="'+tab_id+'" class="tab '+tab_type+' '+tab_active+'" data-id="'+id+'" data-pass="'+decodeURIComponent(pass)+'">'+
                '<span class="tab-title">'+tab_content+'</span>'+
                '<span class="tab-title-alpha-bold">'+tab_content+'</span>'+
                '<span class="x glyphicon glyphicon-remove"></span>'+
            '</div>'
    );
    
    $('#'+tab_id).click(function() {
        if (is_room){
            hash = '#'+$(this).find('.tab-title').html();
            location.hash = hash.replaceArray({':':'', ' ':'_'});
            $('.right').show();
            $('.users').hide();
            $('#usersroom'+id).show();
            $('#usercss').remove();
            $('head').append('<link id="usercss" rel="stylesheet" href="/roomstyle/'+id+'.css">');
        } else {
            location.hash='#@'+tab_title.replaceArray({' ':'_'});
            $('.right').hide();
            $('.users').hide();
            $('#usercss').remove();
        }
        // Переключаем вкладку
        $('.top .tab.active').not($(this)).removeClass('active').addClass('not-active');
        $(this).addClass('active').removeClass('not-active');
        // Переключаем рабочую область
        $('.mc .area:not(#'+tab_type+id+')').hide();
        $('#'+tab_type+id).show();
        gpGalleryRefresh();
        $('#'+tab_type+id+' .msg-area').focus();
        
        if ($('#'+tab_id).hasClass('dialog')) {
            get_anketa($('#'+tab_id).data('id'), 1);
        }
        if (is_room){
            anketa_new({simple: 1, visa:1});
        }
        readNews();
    });
    
    $('#'+tab_id+' .x').click(function() {
        window.thisx = $(this);
        $.each(localStorage, function(i, v) {
          if (i[0]=='#') {
            console.log('i', i)
            close_private=false;
            if (i.indexOf('#@') == 0) {
                if (('#@'+window.thisx.prev().find('span').html()).replaceArray({' ':'_'}) == i)
                    close_private=true;
            }
            if(i.indexOf('#'+window.thisx.prev().html().replaceArray({' ':'_'})+':') == 0 || i == ('#'+window.thisx.prev().html()).replaceArray({' ':'_'}) || close_private) {
                console.log('remove', i)
                window.localStorage.removeItem(i);
                //window.thisx.parent().remove();
                //return false;
            }
          }
        });
        var $tab = $(this).parent();
        var tab_type = '';
        var id = $($tab).data('id');
        if ($($tab).hasClass('room')) tab_type = 'room';
        else if ($($tab).hasClass('dialog')) tab_type = 'dialog';
        closeTab(tab_type+id);
        if (tab_type == 'room') {
            socket.send(JSON.stringify({
                act: 'leave_the_room',
                room_id: id
            }));
        } else {
            closeTab(tab_type+id);
        }
        $('#usercss').remove();
        return false;
    })
}

function insertAtCursor(myField, myValue) {
    //IE support
    if (document.selection) {
        myField.focus();
        sel = document.selection.createRange();
        sel.text = myValue;
    }
    //MOZILLA and others
    else if (myField.selectionStart || myField.selectionStart == '0') {
        var startPos = myField.selectionStart;
        var endPos = myField.selectionEnd;
        myField.value = myField.value.substring(0, startPos)
            + myValue
            + myField.value.substring(endPos, myField.value.length);
    } else {
        myField.value += myValue;
    }
}

function addArea(area_info, active) {
    
    /*
     * area_info = {
     *     area_type: 'room',
     *     room_info: {room_id:integer, room_admin:boolean},
     *     dialog_info: {user_id:integer}
     * }
     * 
     */
    
    if (area_info.area_type == 'room') {
        var is_room = true;
        var data_id = area_info.room_info.room_id;
        var area_id = 'room'+area_info.room_info.room_id;
        var area_class='area-room';
        var html_users = '<td class="users offset-right"></td>';
        var html_broadcast = '<div class="broadcast-area"><div class="broadcast"></div></div>';
        var offset_right = '<td class="offset-right"></td>';
    } else {
        var is_room = false;
        var data_id = area_info.dialog_info.user_id;
        var area_id = 'dialog'+area_info.dialog_info.user_id;
        var area_class='area-dialog';
        var html_users = '';
        var html_broadcast = '<div class="broadcast-area"><div class="broadcast"></div></div>';
        var offset_right = ''
    }
    
    if (active) {
        var style_hide = '' 
        $('.area').hide();
    } else {
        var style_hide = 'style="display:none;"';
    }
    $('.msg').before(
            '<div id="'+area_id+'" class="area '+area_class+'" data-id="'+data_id+'" '+style_hide+'><div class="messages"></div><div class="invishover"></div><div class="broadcast" id="broadcast'+area_id+'">'+
            
            '<div class="broadcastarea" id="broadcastarea'+area_id+'">'+
                '<div id="bcbc'+area_id+'" class="bcbc"></div>'+
            '</div>'+
            
            '</div></div>'
    );
    
    
    $('.messages:visible').mouseup(function(e) {
        
        $('.qt').remove();
        
        window.selectedtxt = '';
        if (window.getSelection)
        {
           window.selectedtxt = window.getSelection();
        }
        else if (document.getSelection)
        {
           window.selectedtxt = document.getSelection();
        }
        else if (document.selection)
        {
           window.selectedtxt = document.selection.createRange().text;
        }
        
        var cursorx = (window.Event) ? e.pageX : event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
        if (cursorx < 100) cursorx = 100;
        var cursory = (window.Event) ? e.pageY : event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
        
        
        if (window.selectedtxt.toString().length) {
            console.log(selectedtxt);
            $('body').prepend('<div class="qt" style="cursor:pointer;font-size:14px;border-radius: 4px; padding: 4px 10px;z-index:50;font-weight:bold;position:absolute;top:'+(cursory-44)+'px;left:'+(cursorx-60)+'px;background:#fff;box-shadow:0px 1px 3px #0008;">get quote <span style="font-size:12px;" class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span></div>');
            $('.qt').mousedown(function() {
                
                $('#msgtxt').val('>>'+window.selectedtxt+'\n').focus();
                
                $(this).remove();
                return false;
                
            });
        }
    });
    
    
    $('.right .users').hide();
    if(is_room) {
        $('.right').show();
        $('.mc .right').append('<div class="users" id="users'+area_id+'"></div>');
    } else {
        $('.right').hide();
    }
    
    if (area_info.area_type != 'room') {
        if ($('#'+area_id+':visible').length) {
            get_anketa(data_id, 1);
        }
    }
    
    $('#'+area_id+' .send-btn').click(function() {
        
        
        
        var $input = $('#'+area_id+' .msg-area');
        if (area_class == 'area-room') var to = {to: 'room', id: data_id}
        else if (area_class == 'area-dialog') var to = {to: 'dialog', id: data_id}
        socket.send(JSON.stringify(
            { act:'send_message', to:to, message:$input.val() }
        ));
        $input.val('');
        $input.focus();
    });
    
    $('#'+area_id+' .btn-smiles').click(function() {
        $(this).toggleClass('open');
        if (typeof window.orientation == 'undefined') 
            $('#'+area_id+' .msg-area').focus();
        else {
            return false;
        }
    });

    $('#'+area_id+' .btn-smiles .smile').click(function() {
        insertAtCursor($('#'+ara_id+' .msg-area')[0], ' '+$(this).attr('data-code')+' ')
        $('#'+area_id+' .btn-smiles').toggleClass('open');
        $('#'+area_id+' .msg-area').focus();
        return false;
    });
    
    if (is_room) anketa_new({simple: 1});
    
    $('#'+area_id+' .messages').scroll(function() {
        readNews();
    });
}

function splitMessage(message) {
    
    
    var message_full = message;
    message = $('<div>'+message+'</div>').text();
    console.log(message, message.length > 32);
    
    var arr = new Array();
    console.log(message_full);
    if (true) {
        arr = message_full.split('<br />');
        arr[0] = $('<div>'+arr[0]+'</div>').text();
        console.log('arr',arr);
        if (arr[0].length > 32) {
            arr[0] = arr[0].substr(0, 32)+'...';
        }
        arr['min'] = arr[0];
        arr['full'] = message_full;
    } else if (message.split('<br>').length > 1) {
        arr = message.split('<br>');
        arr['min'] = arr[0];
        arr['full'] = message_full;
    } else {
        arr['min'] = message;
        arr['full'] = message_full;
    }
    return arr;
};

function send_lrm(user_id, message_id) {
    console.log(user_id, message_id);
    socket.send(JSON.stringify({
        act: 'lrm',
        user_id: user_id,
        message_id: message_id,
    }));
}

function playnote(my_message, audio) {
    if (!isset(audio)) audio = window.myAudio; 
    else audio = window.myAudioErr;
    
    if(window.audio && !my_message && !$('#mainloader').length) {
        console.log('window.myAudio.play')
        audio.play();
        setTimeout(function() {
            audio.pause();
            audio.currentTime = 0;
        }, 1000);
    }
}

function notemsg() {
    
    href = $('link[rel="shortcut icon"]').attr('href')
    if (href=='/favicony.ico') $('link[rel="shortcut icon"]').attr('href', '/favicon.ico');
    else $('link[rel="shortcut icon"]').attr('href', '/favicony.ico')
    
}

function addMessage(mode, to, message, scroll) {
    
    
     
    if ($.inArray(message.user_id, window.ignore_list) >= 0) return;
    
        
    var my_message = (message.user_id == window.user_id) ? 'my-message' : '';
    
    var data_id = 'data-id="'+message.id+'"';
    if (to.to == 'room') {
        var message_id = 'r'+to.id+'m'+message.id;
        var area_id = 'room'+to.id;
        if ($('#'+message_id).length > 0) return false;
    }
    else if (to.to == 'dialog') {
        if (my_message) {
            var message_id = 'd'+to.id+'m'+message.id;
            var area_id = 'dialog'+to.id
        } else {
            var message_id = 'd'+message.user_id+'m'+message.id;
            var area_id = 'dialog'+message.user_id
        }
    }
    
    if (to.to == 'dialog', !$('#'+area_id).length) {
        addDialog({user_id:message.user_id, user_name:message.user_name}, 0);
    }
    
    var $messages = $('#'+area_id+' .messages');
    if (scroll || my_message || isScrolledToBottom($messages))
        var scroll = true;
    else scroll = false;
    
    console.log('scroll', scroll)
    
    var caret = '<span class="caret"></span>';
    
    //message.date = '2020-04-28 00:50:03';
    var todat = new Date();
    var month = todat.getMonth()+1;
    var day = todat.getDate();
    var dayy = todat.getDate()-1;
    if (month < 10) month = '0'+month.toString();
    if (day < 10) day = '0'+day.toString();
    if (dayy < 10) dayy = '0'+dayy.toString();
    var today = todat.getFullYear()+'-'+month+'-'+day;
    var yesterday = todat.getFullYear()+'-'+month+'-'+dayy;
    console.log(message);
    if (typeof message.date == 'undefined') message.date='0000-00-00 00:00:00';
    message.day = message.date.substr(8, 2)+'.'+message.date.substr(5, 2);
    message.time = message.date.substr(11,5);
    message.onlydate = message.date.substr(0, 10);
    
    if (message.onlydate == today) message.day = 'today';
    else if (message.onlydate == yesterday) message.day = 'yesterday';
    
    if (!message.isbroadcast) {
        
        var abook = message.user_sex ? 'am' : 'af';
        
        console.log(to, message);
        if ($('#'+area_id+' .messages .message:last').data('uid')!=message.user_id || $('#'+area_id+' .messages .message:last').data('day') != message.onlydate) {
            $('#'+area_id+' .messages')[mode](
                '<div id="'+message_id+'" class="message '+my_message+' mu'+message.user_id+'" data-uid="'+message.user_id+'" data-day="'+message.onlydate+'">'+
                    '<div class="dtd">'+message.day+'</div>'+
                    '<div class="author-area">'+
                        '<div class="avatar" style="background:url(\'/img/user'+message.user_id+'/avatar.gif\');"></div>'+
                        '<button class="btn btn-user user'+message.user_id+' dropdown-toggle" data-user-id="'+message.user_id+'" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span class="user-name">'+message.user_name+'</span>'+caret+'</button>'+
                        '<a class="answer '+abook+'" onclick="copyName($(this), \''+message.user_name+'\')">answer <span style="font-size:12px;" class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span></a>'+
                    '</div>'+
                    '<div class="separator"></div>'+
                    '<div class="dtt dttstart">'+message.time+'</div><div class="msg-content" '+data_id+'>'+message.message+'</div>'+
                    '<div class="separator"></div>'+
                '</div>'
            );
            
            
        } else {
            if ($('#'+area_id+' .messages .message .msg-content:last').data('id') != message.id)
                $('#'+area_id+' .messages .message:last').append('<div class="update"><div class="dtt">'+message.time+'</div><div id="'+message_id+'" class="msg-content" '+data_id+'>'+message.message+'</div><div class="separator"></div></div>')
        }
        
        if(message.user_id == window.user_id) {
            $('#msgtxt').val('');
            $('#msgtxt').focus();
        }
        
        if ($('#'+area_id).is(':hidden') || !scroll) {
            $('link[rel="shortcut icon"]').attr('href', '/favicony.ico');
            window.ntmsg = setInterval(notemsg, 500);
            
            var $news = $('#tab'+area_id+' .news');
            if ($news.length) $news.html(parseInt($news.html())+1);
            else $('#tab'+area_id+' .x').before('<span class="news">1</span>');
            title();
        } else if (to.to == 'dialog' && $('#'+area_id).is(':visible') && scroll) {
            send_lrm($('#'+area_id+':visible').data('id'), message.id);
        }
        
        console.log('message', message);
        playnote(my_message);
        
    } else {
        msgarr = splitMessage(message.message);
        console.log('#broadcastarea'+area_id);
        if ($('#broadcastarea'+area_id+' .broadcastbtn').length)
            $('#broadcastarea'+area_id+' .bcbc').append('<div class="bc" id="bc'+message.id+'" data-id="'+message.id+'" data-b="'+message.color+'" data-t="'+message.textcolor+'" style="background:'+message.color+';color:'+message.textcolor+'">'+'<span class="visible">'+msgarr['min']+'</span><span class="hidden">'+msgarr['full']+'</span>'+'<div class="myedit glyphicon glyphicon-edit"></div><div class="mydel glyphicon glyphicon-remove"></div><div class="bcmove"><span class="glyphicon glyphicon-resize-vertical" aria-hidden="true"></span><span class="glyphicon glyphicon-resize-vertical" aria-hidden="true"></span></div></div>');
       else
           $('#broadcastarea'+area_id+' .bcbc').append('<div class="bc" id="bc'+message.id+'" data-id="'+message.id+'" data-b="'+message.color+'" data-t="'+message.textcolor+'" style="background:'+message.color+';color:'+message.textcolor+'">'+message.message+'<div class="myedit glyphicon glyphicon-edit"></div><div class="mydel glyphicon glyphicon-remove"></div><div class="bcmove"><span class="glyphicon glyphicon-resize-vertical" aria-hidden="true"></span><span class="glyphicon glyphicon-resize-vertical" aria-hidden="true"></span></div></div>');
        $('#bc'+message.id).click(expand_bc);
        $('#bc'+message.id+' .bcmove').mousedown(move_bc);
        $('#bc'+message.id+' .bcmove').click(function() {return false});
        if (my_message) {
            $('#bc'+message.id+' .mydel, #bc'+message.id+' .myedit').show();
            $('#bc'+message.id+' .myedit').click(function() {myedit_click($(this).parent().data('id'), $(this).parent().children('.hidden').html(), $(this).parent().attr('data-b'), $(this).parent().attr('data-t')  );return false;});
        }
        $('.mydel').click(function() {
            if (confirm('Are you sure you want to delete this news?')) { 
                socket.send(JSON.stringify({
                    act: 'delbroadcast',
                    room_id: to.id,
                    message_id: $(this).parent('.bc').data('id'),
                }));
                console.log(JSON.stringify({
                    act: 'delbroadcast',
                    room_id: to.id,
                    message_id: $(this).parent('.bc').data('id'),
                }));
            }
            return false;
        })
    }
    
    clickUser($('#'+area_id+' .messages .message#'+message_id+' button'));
    
    if (scroll) {
        $messages.scrollTop($messages.prop("scrollHeight")+9000);
    }

    
    $('#'+message_id+' a.img img').bind('load', function() {
        if (scroll)
            $messages.scrollTop($messages.prop("scrollHeight")+9000);
    });
    
    $('#'+message_id+' a.img').click(image_click);
    
    console.log(message_id);
    if($('#'+message_id+' .run').length) {
        for (i=0;i<$('#'+message_id+' .run').length;i++) {
            $('#'+message_id+' .run:eq('+i+')').html($('#'+message_id+' .run:eq('+i+')').text()+'          ');
        }
        setInterval(function() {
            for (i=0;i<$('#'+message_id+' .run').length;i++) {
                first_char = $('#'+message_id+' .run:eq('+i+')').html().charAt(0);
                $('#'+message_id+' .run:eq('+i+')').html($('#'+message_id+' .run:eq('+i+')').html().substring(1)+first_char);
            }
        },100);
    }
    
}

function roomPreview($elm, e) {
    var cursorx = ((window.Event) ? e.pageX : event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft)) - $('.popup')[0].offsetLeft + 350;
    var cursory = ((window.Event) ? e.pageY : event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop)) - $('.popup')[0].offsetTop - 100;
    $elm.find('img').attr('style', 'left:'+cursorx+'px;top:'+cursory+'px;')
    $elm.find('img').show();
}

function aboutU(user_id){
    $('.users .user'+user_id).mousemove(function(e) {
        $('.about_u.about_body').remove();
        if ($(this).find('.about_u').html() != undefined && $(this).find('.about_u').html().length == 0 || $('.users ul.dropdown-menu:visible').length) {
            
            return false;
        }
        if(!$('.about_u.about_body').length) $('body').prepend('<div class="about_u about_body">'+$(this).find('.about_u').html()+'</div>');
        else $('.about_u.about_body').html($(this).find('.about_u').html());
        var cursorx = (window.Event) ? e.pageX : event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
        var cursory = (window.Event) ? e.pageY : event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
        $('.about_u.about_body').attr('style', 'position:absolute;left:'+(cursorx-40)+'px;top:'+(cursory+24)+'px;color:'+$(this).find('.sex').css('color')+';'+$(this).find('.sex').attr('style'));
    });
    $('.users .user'+user_id).mouseout(function(e) {
        console.log('out');
        $('.about_u.about_body').remove();
    })
    $('.users .user'+user_id).mouseup(function(e) {
        $('.about_u.about_body').remove();
    })
    
}

function addUser(room_id, user, sort) {
    
    ico = (user.ico.length == 1) ? "ico" : "";
    mob = ((user.mob || user.user_id==window.user_id && $('body').hasClass('mobile')) ? '<span class="mob"><span class="glyphicon glyphicon-phone" aria-hidden="true"></span></span>' : '');
    if (ico.length) style='style="filter:hue-rotate('+user.ico.charCodeAt(0)+'deg)"'; else style= "";
    $('#usersroom'+room_id).append(
        '<button class="btn btn-user user'+user.user_id+' dropdown-toggle" data-user-id="'+user.user_id+'" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+
            '<span class="sex '+user.sex+' '+ico+'" '+style+'>'+user.ico+'</span>'+
            '<span class="user-name">'+user.user_name+'</span>'+
            '<div class="about_u" style="display:none;">'+user.about+'</div>'+
            mob+
            '<span class="caret"></span>'+
        '</button>'
    );
    aboutU(user.user_id);
    clickUser($('#usersroom'+room_id+' .user'+user.user_id));
    
    // new sort function
    $('#usersroom'+room_id+' button').sort(function(a, b) {result=0; if ($(a).find('.sex').html()+($(a).find('.sex').hasClass('male')?'1':'0')+$(a).find('.user-name').html().toLowerCase()>$(b).find('.sex').html()+($(b).find('.sex').hasClass('male')?'1':'0')+$(b).find('.user-name').html().toLowerCase()) result=1; else result=-1; return result;}).each(function(){$('#usersroom'+room_id).append($(this));});
    
    /*
    if (sort) {
        
        var users_btns = $('#room'+room_id+' .users .btn-user');
        users_btns.sort(function (u1,u2) {
            var u1_sex = $(u1).children('.sex').hasClass('male') ? 1 : 0;
            var u2_sex = $(u2).children('.sex').hasClass('male') ? 1 : 0;
            var u1_name = $(u1).children('.user-name').html();
            var u2_name = $(u2).children('.user-name').html();
            if (u1_sex === u2_sex) {
                if (u1_name === u2_name) return 0;
                else return u1_name > u2_name ? 1 : -1;
            } else if (u1_sex < u2_sex) {
                return 1;
            } else {
                return -1;
            }
        });
        $('#room'+room_id+' .users').append(users_btns);
        
    }
    */
}

function copyName(elm, text) {
    $('#msgtxt').focus().val($('#msgtxt').val()+text+', ');
}

function clickUser($elm) {
    $elm.mouseup(function () {
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
        } else { // старый IE
            document.selection.empty();
        }
    });
    $elm.click(function() {
        console.log('clickUser');
        var user_id = $(this).data('user-id');
        var user_name = $(this).children('.user-name').html();
        var new_btn =
        '<div class="btn-group btn-user-group open">'+
          $(this)[0].outerHTML +
            '<ul class="dropdown-menu">'+
              '<li><a onclick="get_anketa('+user_id+', 0); if ($(\'.bc.expanded:visible\').length) $(\'.bc.expanded:visible\').removeClass(\'expanded\');">Profile</a></li>'+
              ( typeof user_name == 'undefined' ? '' : ('<li><a href="#@'+user_name.replaceArray({' ':'_'})+'">Open private dialog</a></li>') )+
              '<li><a onclick="$(\'.mu'+user_id+'\').hide();window.ignore_list.push('+user_id+')">Ignore</a></li>'+
              '<li role="separator" class="divider"></li>'+
              '<li><a>Abuse</a></li>'+
            '</ul>'
        '</div><div style="clear:both;"></div>';
        $(this).replaceWith(new_btn);
        
        $( "ul:visible" ).parents().map(function() {
            if ($(this).hasClass('message')) {
                if($(this).offset().top > $('.messages:visible').height()-100) {
                    $('ul:visible').parent().addClass('dropup');
                }
                return true
            } else if ($(this).hasClass('users')) {
                if($(this).offset().top > $('.users:visible').height()-100) {
                    $('ul:visible').parent().addClass('dropup');
                }
            }
        });
        
        aboutU(user_id);
        
        return false;
    });
    
}

function closeTab(id) {
    
    var tab_type = '';
    
    var prev = $('#tab'+id).prev();   
    var next = $('#tab'+id).next();
    
    if ($('#tab'+id).hasClass('room')) tab_type = 'room';
    else if ($('#tab'+id).hasClass('dialog')) tab_type = 'dialog';
    
    if (prev.length) prev.click();
    else if (next.length) next.click();
    else if (tab_type == 'dialog') $('.tab.room:first').click();
    else if (tab_type == 'room') $('.tab.dialog:first').click();
        
    $('#'+id).remove();
    $('#tab'+id).remove();
    $('#users'+id).remove();
    
    if($('.area').length == 1) $('.area').show();
}

function isScrolledToBottom($elm) {
    if (typeof $elm[0] == 'undefined') return false;
    var result = $elm[0].scrollHeight - $elm.scrollTop() - $elm.outerHeight() < 1;
    return result;
}

function readNews() {
    
    var $news = $('.tab.active .news'); 
    var $messages = $('.messages:visible .message');
    var news_count = parseInt($news.html());  
    var messages_count = $messages.length;
    var messages_scrolled_count = 0;
    var new_messages_count = 0 
    
    if (news_count) {
        
    
        $('.messages:visible .message').each(function() {
            if($(this).offset().top > $('.messages:visible').height()-$(this).height()+34) {
                new_messages_count++;
            }
        });
        
        if (news_count > new_messages_count) {
            $news.html(new_messages_count);
        }
        
        if (new_messages_count <= 0 || isScrolledToBottom($('.messages:visible'))) {
            if ($news.parents('.tab.dialog').length) {
                var user_id = $news.parents('.tab.dialog').data('id');
                send_lrm(user_id, $('#dialog'+user_id+' .message:last .msg-content:last').data('id'));
            }
            $news.remove();
            clearInterval(window.ntmsg);
            $('link[rel="shortcut icon"]').attr('href', '/favicon.ico');
        }
        
    }
    
    if($('.tab.room.active').length && (new_messages_count <= 0 || isScrolledToBottom($('.messages:visible')))    ) {
        socket.send(JSON.stringify({
            act: 'bookmark',
            room_id:$('.area-room:visible').attr('data-id'),
            message_id:$('.msg-content:visible:last').attr('data-id')
        }));
    }
    
    title();
};

function broadcast() {
    $('.broadcast:visible').prepend(
    );
}

function wallSend() {
    var last_post = $('.anketa:visible contents post:first');
    var user_id = $('.anketa:visible').data('uid');
    var content = $('.anketa:visible textarea').val();
    var post_id = last_post.length ? last_post.data('pid') : 0;
    var parent_id = 0;
    wallWrite(user_id, content, post_id, parent_id);
    $('.anketa:visible .a-write').show();
    $('.anketa:visible textarea').parent().hide();
    $('.anketa:visible textarea').val('');
    $('.anketa:visible textarea').css('height', '34px');
}

function wallWrite(user_id, content, post_id, parent_id) {
    socket.send(JSON.stringify({
        act: 'wall_write',
        data: {user_id:user_id, content:content, post_id:post_id, parent_id:parent_id}
    }));
}

function wallUpdate (data) {
    var posted;
    for (var i = 0; i < data.length; i++) {
        if (!posted) {
            posted = data[i].posted;
        } else if (posted && posted !== data[i].posted) {
            $('.anketa'+data[i].user_id+' .contents .posts').prepend('<div class="walldate">'+posted+'</span>');
            posted = data[i].posted;
        }
        $('.anketa'+data[i].user_id+' .contents .posts').prepend(
            '<div class="post">'+
                '<div class="avatar"></div>'+
                '<span class="p-author">'+data[i].name+'</span>'+
                '<span class="p-content">'+data[i].content+'</span>'+
                '<div class="separator"></div>'+
            '</div>'
        );
    }
    //$('.anketa'+data[0].user_id+' .contents .posts').prepend('<div class="walldate">'+posted+'</span>');
}

function get_anketa(user_id, for_dialog) {
    console.log('for_dialog', for_dialog)
    if (for_dialog == 1 && $('#broadcastareadialog'+user_id+' .anketa-new').length == 0 || for_dialog == 0)
    socket.send(JSON.stringify({
        act: 'anketa',
        user_id: user_id,
        visa: for_dialog
    }));
}

function textAreaAdjust(o) {
    $('#'+o.id).css('overflow-y', 'hidden');
    $('#'+o.id).css('height', '1px');
    $('#'+o.id).css('height', (2+o.scrollHeight)+"px");
    if (2+o.scrollHeight >= 154) {
        $('#'+o.id).css('overflow-y', 'auto');
    }
}

function getAge(strDate) {
    console.log('ttt', strDate);
  var arrDate = strDate.split(/\D+/g);
  var date = new Date(arrDate[2], arrDate[1] - 1, arrDate[0]);
  var now = new Date();
  var age = now.getFullYear() - date.getFullYear();
  now.setFullYear(date.getFullYear());
  if (now < date) age--;
  return (age+' years');
}

function anketa_new(data){
    
    
            
    if (!data.visa) {
        var broadcastarea = $('.broadcastarea:visible');
        if ($('.broadcastarea:visible .anketa-new').length) {
            $('.broadcastarea:visible .anketa-new').remove();
        }
    }
    
    if(!data.simple) {
        
        var bad = $('.broadcastarea:visible').attr('id');
        
        var broadcastarea = broadcastarea ? broadcastarea : $('#broadcastareadialog'+data.profile.id);
        
        if($('.mc').hasClass('hidecast')) return false;
        
        var sex = data.profile.sex == 1 ? 'm' : 'f';
        var load_photo_btn = "";    
        if(data.profile.id == window.user_id) {
            load_photo_btn = '<input type="button" class="uploadbtn btn btn-default" style="float: right;" value="Load photos">'
        }
        window['posts'+data.profile.id] = window['posts'+data.profile.id] ? ++window['posts'+data.profile.id] : 1;

        var glyphicon = (data.profile.id == window.user_id ? 'minus' : 'remove');
        
        var mine = data.profile.id == window.user_id ? 'mine' : '';
        
        console.log(data.profile);
        
        broadcastarea.prepend('<div class="anketa-new" style="background:url('+data.profile.pattern+');" data-userid="'+data.profile.id+'"><div style="background:'+data.profile.bg+'"; class="anketa-body '+sex+'">'+
        '<div class="uname"><span class="closeanketa glyphicon glyphicon-'+glyphicon+'"></span><h1>'+data.profile.name+'</h1></div>'+
            '<div class="aa-icons m"><span class="glyphicon glyphicon-envelope"></span><span class="glyphicon glyphicon-plus"></span></div>'+
            '<div class="user-info">'+
            '<div class="avatar '+mine+'" style="background-image:url(\'/img/user'+data.profile.id+'/avatar.gif?'+rand(9999999999)+'\');'+$('.flag:not(.fgray)').attr('style')+'"></div><div class="profile-info"><div class="actions"><a href="#@'+data.profile.name.replaceArray({' ':'_'})+'"">private</a><a>add</a></div><span class="field name">'+data.profile.fio+'</span><span class="field val1"><span class="info"><span class="sex '+(data.profile.sex ? 'male' : 'female')+'"></span> <span class="age" data-birth="'+data.profile.datebirth0+'">'+getAge(data.profile.datebirth)+'</span><span class="city">'+data.profile.city+'</span></span></span><div class="about">'+data.profile.aboutme+'</div></div><div></div><div style="clear:both;"></div>'+
            '</div>'+
            '<div class="wall wall2"><div id="'+broadcastarea.attr('id')+'ps'+data.profile.id+'" class="photoscroller"><div class="contents photos"></div></div>'+
            load_photo_btn+'<div style="clear:both;margin-bottom: 16px;"></div></div>'+
            '<form action="/upload" id="frm'+bad+'" class="frm" method="post" enctype="multipart/form-data" style="display:none;"><input type="hidden" name="text" value="1"><input type="file" accept="image/jpeg,image/png,image/gif" name="photos" class="filesinput" multiple="multiple"></form>'+
            '</div>'+
        '</div></div>');

        if (typeof window.orientation !== 'undefined') {
            $('.photoscroller').addClass('scrolledy');
        } else {
            elem = document.getElementById(broadcastarea.attr('id')+'ps'+data.profile.id);
    
            if (elem.addEventListener) {
                if ('onwheel' in document) {
                  // IE9+, FF17+, Ch31+
                  elem.addEventListener("wheel", onWheel);
                } else if ('onmousewheel' in document) {
                  // устаревший вариант события
                  elem.addEventListener("mousewheel", onWheel);
                } else {
                  // Firefox < 17
                  elem.addEventListener("MozMousePixelScroll", onWheel);
                }
              } else { // IE8-
                elem.attachEvent("onmousewheel", onWheel);
              }

              function onWheel(e) {

                console.log(this);
                e = e || window.event;

                // wheelDelta не даёт возможность узнать количество пикселей
                var delta = e.deltaY || e.detail || e.wheelDelta;

                var result = 0;

                result = result + delta;
                $(this).scrollTop($(this).scrollTop()+result);
                console.log(result);

                e.preventDefault ? e.preventDefault() : (e.returnValue = false);
            }




            var viewer = new TouchScroll();
            viewer.init({
                    id: broadcastarea.attr('id')+'ps'+data.profile.id,
                    draggable: true,
                    wait: false
                });
        }

        $('.anketa-new[data-userid="'+window.user_id+'"] .avatar, .anketa-new[data-userid="'+window.user_id+'"] .about, .anketa-new[data-userid="'+window.user_id+'"] .info').mousemove(function() {
            $('.anketa-new[data-userid="'+window.user_id+'"] .avatar, .anketa-new[data-userid="'+window.user_id+'"] .about, .anketa-new[data-userid="'+window.user_id+'"] .info').addClass('expanded');
            $('.anketa-new[data-userid="'+window.user_id+'"] .avatar, .anketa-new[data-userid="'+window.user_id+'"] .about, .anketa-new[data-userid="'+window.user_id+'"] .info').mouseout(function() {
                $('.anketa-new[data-userid="'+window.user_id+'"] .avatar, .anketa-new[data-userid="'+window.user_id+'"] .about, .anketa-new[data-userid="'+window.user_id+'"] .info').removeClass('expanded');
            })
        });
    
        $('.anketa-new:visible .uploadbtn').click(function() {
            $('.anketa-new:visible #frm'+bad+' .filesinput:last').click();
            $('.anketa-new:visible #frm'+bad+' .filesinput:last').change(function() {
                console.log($('.anketa-new:visible #frm'+bad+' .filesinput')[0].files);
                if ($('.anketa-new:visible #frm'+bad+' .filesinput')[0].files.length > 10) {
                    alert('Maximum 10 photos');
                } else {
                    window.uploading = $('.anketa-new:visible #frm'+bad+' .filesinput')[0].files.length;
                    $('.anketa-new:visible .uploadbtn').after('<div class="load" style="">loading</div>');
                    $('.anketa-new:visible .uploadbtn').hide();

                    $('.anketa-new:visible #frm'+bad).ajaxSubmit(
                            {  
                                success: function(data) { 
                                    console.log('data', data)
                                }
                            }
                     );
                }
            });
            });

        $('#frm'+bad).submit(function(e){
            console.log($(this).serialize());
          e.preventDefault();
          //do some verification
          $.ajax({
            url: '',
            data: $(this).serialize(),
            success: function(data)
            {
              //callback methods go right here
            }
          });
        });



        $('.tt:visible').click(function() {
            $('.tt:visible').removeClass('active');
            $(this).addClass('active');
            $('.wall:visible').hide();
            $('.anketa-new:visible .'+$(this).data('wall')).show();
        })

        $(".area-room .closeanketa, .area-room h1").click(function() {
            $('.anketa-new:visible').remove();
            anketa_new({simple: 1});
        });

        console.log({ act:'photos', user_id: data.profile.id, page:0});
        socket.send(JSON.stringify(
                { act:'photos', user_id: data.profile.id, page:0}
        ));
    
        
        
    }
    
    
    if (data.simple && !$('.anketa-new:visible').length && !$('.mc').hasClass('hidecast')) {
        broadcastarea.prepend('<div class="anketa-new anketamin"><div class="anketa-body m">'+
        '<div class="uname"><span class="closeanketa openanketa glyphicon glyphicon-plus"></span><h1>'+window.user_name+'</h1></div>'+
            '<div class="aa-icons m"><span class="glyphicon glyphicon-envelope"></span><span class="glyphicon glyphicon-plus"></span></div>'+
        '</div></div>');
        $('.area:visible .anketamin').click(function() {get_anketa(window.user_id,0); return false;});
        return false;
    }
    
    
    
    
    
    $('.avatar.mine, .info .sex, .info .age, .info .city, .about').click(function() {
        if ($('.avatar.mine').hasClass('expanded') && $('.blackout').length == 0) {
            window.avatar="";
            $('body').prepend(
                '<div class="blackout">'+
                    '<div class="popup editanketa" style="width:462px;height:554px;">'+
                        '<div class="popup-x glyphicon glyphicon-remove" onclick="$(this).parent().parent().remove();"></div>'+
                        '<h3>Edit profile</h3>'+
                        '<div id="uico" class="uico" onclick="prompt_unicode(\'Вы можете выбрать свой символ, который будет отображаться рядом с никнеймом. Таблица unicode: https://unicode-table.com\')">'+window.user_ico+'</div><div class="yavatar" style="background:url(/img/user'+user_id+'/avatar.gif?'+rand(9999999999)+');"></div>'+
                        '<input type="file" accept="image/jpeg,image/png,image/gif" id="yavaf" class="regavatar" style="display:none;" name="ava">'+
                        '<input type="hidden" id="yava" class="yinputavatar" style="display:none;" name="avatar">'+
                        '<div style="float:right;"><div class="strinfo">Your email</div><input id="yemail" class="form form-control" name="email" type="text" value="'+window.user_email+'"><br><div class="strinfo">Your sex</div>'+
                        '<div class="btn-group" role="group" aria-label="...">'+
                            '<button type="button" class="btn btn-default bb bbm">Male</button>'+
                            '<button type="button" class="btn btn-default bb bbf">Female</button>'+
                        '</div><input id="ysex" type="hidden" name="sex"></div>'+
                        '<br><div class="strinfo"  style="margin-top:150px;">Your birth date</div><input id="ybirth" class="form form-control ybirth" type="text" name="birthdate">  '+
                        '<br><div class="strinfo"">Your city</div><input id="ycity" class="form form-control ycity" name="city" type="text">'+
                        '<br><div class="strinfo">About you</div><textarea id="yabout" class="form form-control" name="aboutme"></textarea>'+
                        '<br><button type="button" class="btn btn-default ysave">Сохранить</button><div></div>'+
                    '</div>'+
                '</div>'
            );
    
            if($('.anketa-body .info .sex').hasClass('male')) { $('.editanketa .bbm').addClass('selected'); $('#ysex').val(1);}
            else if($('.anketa-body .info .sex').hasClass('female')) { $('.editanketa .bbf').addClass('selected'); $('#ysex').val(0); }
            $('#ybirth').val($('.anketa-body .info .age').data('birth'));
            $('#ybirth').datepicker({
                        format: "yyyy-mm-dd",
                        startView: 2,
                        language: "ru",
                        orientation: "bottom right",
                        daysOfWeekHighlighted: "0,6"
                });
            $('#ycity').val($('.anketa-body .info .city').html());
            $('#yabout').val($('.anketa-body .about').html());
            
            $('.editanketa .bb').click(function() {
                $('.editanketa .bb').removeClass('selected');
                $(this).addClass('selected');
                if ($(this).hasClass('bbm')) $('#ysex').val(1);
                else if ($(this).hasClass('bbf')) $('#ysex').val(0);
            })
            
            $('.yavatar').click(function() {
                $('#yavaf').click();
            });
            $('#yavaf').change(function(data) {
                readURL(this);
                console.log($('#yavaf').val());
            });
            
            $('.editanketa .ysave').click(function() {
                $.ajax({
                        url:'/act',
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            act:'edit_profile',
                            avatar:window.avatar,
                            email:$('#yemail').val(),
                            datebirth:$('#ybirth').val(),
                            city:$('#ybirth').val(),
                            aboutme:$('#yabout').val(),
                            city:$('#ycity').val(),
                            sex:$('#ysex').val(),
                            ico:$('#uico').html(),
                        },
                        success: function(data) {
                            if ($('#uico').html().length == 1) {
                                $('.user'+window.user_id+' .sex').addClass("ico");
                                $('.user'+window.user_id+' .sex').html($('#uico').html());
                                $('.user'+window.user_id+' .sex').attr('style', "filter:hue-rotate("+$('#uico').html().charCodeAt(0)+"deg);");
                                window.user_ico = $('#uico').html();
                            } else if ($('#uico').html().length == 0) {
                                $('.user'+window.user_id+' .sex').removeClass("ico");
                                $('.user'+window.user_id+' .sex').html("");
                                $('.user'+window.user_id+' .sex').attr('style', "");
                                window.user_ico = $('#uico').html();
                            }
                            window.user_email = $('#yemail').val();
                            $('.editanketa .popup-x').click();
                            get_anketa(window.user_id, 0)
                        }
                });
            })
        }
    })
    
    
}

function prompt_unicode(text) {
    var char = prompt(text);
    if (char.length == 1 || char.charAt(0)=="&" && char.charAt(char.length-1)==';' || char == "")
    $("#uico").html(char);
}

function pagination(page, pages_count) {
    
    page = parseInt(page);
    pages_count=parseInt(pages_count);
    html = $('<div class="pages"></div>');
    
    if (page == 0 || page == pages_count-1) {
        center_start = (Math.floor(pages_count/2)-2) > 1 ? Math.floor(pages_count/2)-2 : 2;
        center_end = (Math.floor(pages_count/2)+2) < pages_count ? Math.floor(pages_count/2)+2 : pages_count-1;
    } else {
        center_start = (page-2) > 1 ? page-1 : 2;
        center_end = (page+3) < pages_count ? page+3 : pages_count-1;
    }
    if(pages_count>1) {
        html.append('<div class="page rp0" data-page="0">1</div>');
        if(pages_count>5) html.append('<div class="dot">«</div>');
        for(i=center_start;i<=center_end;i++) {
            html.append('<div class="page rp'+(i-1)+'" data-page="'+(i-1)+'">'+i+'</div>');
        }
        if(pages_count-center_end+1>0) {
            if(pages_count>5) html.append('<div class="dot">»</div>');
            html.append('<div class="page rp'+(pages_count-1)+'" data-page="'+(pages_count-1)+'">'+pages_count+'</div>');
        }
        if (pages_count > 5)
            html.append('<input class="form-control page-input" type="text">');
        html.find('.rp'+(page)).addClass('selected');
    }
    
    return html.html();
}




function afterSocketConnect() {
        
    $( "td.input div" ).resizable({handles: 'n'});
    
    setInterval(function() {
        $('.mc td.input .resize-y').css('max-height', ($('.area').height()*0.4)+'px');
    }, 500);
    
    $('.allrooms').click(function() {
        showRooms();
    });
    
    $('#logout-btn').click(function() {
        
        wl = window.location.toString();
        if(wl.indexOf('readonly') >= 0) {
            window.location = wl.replaceArray({'/readonly/':'/','/readonly':'/'});
        }
        
        $.ajax({
            url:'/act',
            type: 'POST',
            dataType: 'json',
            data: {act:'logout'},
            success: function(data) {
                if (data.success == 1)
                    location.reload();
            }
        });
    });
    
    $('body').mousedown(function() {
        if ($('.btn-user:hover').length) {
            var $btn_user_group = $('.btn-user-group:not(:hover)');
            var $btn_user = $btn_user_group.children('.btn-user');
            $btn_user_group.replaceWith($btn_user);
            clickUser($btn_user);
        }
    });
    
    $('body').click(function() {
        var $btn_user_group = $('.btn-user-group');
        var $btn_user = $btn_user_group.children('.btn-user');
        $btn_user_group.replaceWith($btn_user);
        clickUser($btn_user);
    });
    
};

window.myAudio = window.myAudio ? window.myAudio : new Audio;
window.myAudio.src = "/msg.mp3";

window.myAudioErr = window.myAudioErr ? window.myAudioErr : new Audio;
window.myAudioErr.src = "/err.mp3";

function after_init() {
    
    var lang = $(location).attr('pathname').replaceArray({'/':'', 'readonly':''});
    if (window.user_name == "Guest" && hash0.length<2) {
        if (lang == 'en') enterTheRoom(75, "");
        else enterTheRoom(39, "");
    }
    //chacha.play();
    
    $('.btn-options').click(function() {
        settings();
    });
    
    $('textarea').keydown(function (e) {
        if (e.ctrlKey && e.keyCode == 13) {
             // Ctrl-Enter pressed
             insertAtCursor($('.msg textarea')[0], '\n')
             return true;
        } else if (e.shiftKey && e.keyCode == 13) {
            // Shift-Enter pressed
            return true;
        } else if (e.keyCode == 13) {
            // Send message on Enter
            $('.sendbtn').click();
            return false;
        } else {
            var d = new Date();
            if (($(this).val().length % 10) == 1) {
                socket.send(JSON.stringify(
                    { act:'keyboard', user_id:$('.tab.dialog.active').attr('data-id'), room_id:$('.tab.room.active').attr('data-id') }
                ));
            }
        }
    })
    
    $('.sendbtn').click(function() {
        
        wl = window.location.toString();
        if (wl.indexOf('readonly/') >= 0) {
            alert('Для того чтобы начать отправлять сообщения - выйдите из демо-режима и зарегистрируйтесь');
            if (confirm('Выйти из демо-режима сейчас?')) {
                window.location = wl.replace('readonly/', '');
            }
        }
        
        var $input = $('.msg textarea');
        if ($('.area:visible').hasClass('area-room')) var to = {to: 'room', id: $('.area:visible').data('id')}
        else if ($('.area:visible').hasClass('area-dialog')) var to = {to: 'dialog', id: $('.area:visible').data('id')}
        
        socket.send(JSON.stringify(
            { act:'send_message', to:to, message:$input.val() }
        ));
        //$input.val('');
        $input.focus();
    });
    
    $('.msg textarea').dblclick(function() {
        $('.msg').toggleClass('msgopen');
        $('.mc .broadcastarea').toggleClass('msgopen-fix');
    })
    
    $('.btn-smiles').click(function() {
        $(this).addClass('open');
        $('textarea:visible').focus();
       
        
        
    });     
        
    $('body').click(function(event) {
        if(!$(event.target).is(".btn-smiles.open")) {
            $(".btn-smiles:visible").removeClass('open');
        }
    });
    

    $('.btn-smiles .smile:not(.je)').click(function() {
        insertAtCursor($('.msg textarea')[0], ' '+$(this).attr('data-code')+' ')
        
    });
    
    $('.uploadicon').click(function() { 
        $('#uploadone input').click();
    });
    $('#uploadone input').change(function() {
            
            $('.uploadicon').addClass('spin');
            if ($('.uploadicon').hasClass('spin')) {
                $('#uploadone').ajaxSubmit(
                        {  

                            success: function(data) {
                                insertAtCursor($('.msg textarea')[0], ' [img]'+data+'[/img] ')
                                $('.uploadicon').removeClass('spin');
                            }
                        }
                );
            }
        });
    
    setInterval(interval, 100)
    
    $(window).bind('resize', function(event) {
        event.stopPropagation();
        if (this == event.target) {
            gpGalleryRefresh();
        }
    });
}

function gpGalleryRefresh() {
    if(!$('.anketa-new .photos:visible').length) return false;
    console.log('gpGalleryRefresh')
    $('.anketa-new .photos:visible a').each(function() {
        $(this).find('.closeimg').remove();
        $(this).find('img').attr('style', '')
        $(this).html($(this).find('div').html());

    });
    $('.anketa-new .photos:visible').gpGallery('img');
    $('.anketa-new .photos:visible img').each(function() {
        $(this).attr('style', $(this).attr('style')+$('.flag:not(.fgray)').attr('style'));
    });
    $('.anketa-new .photos:visible img').each(function() {
        if($('.anketa-new:visible').data('userid') == window.user_id) {
            $(this).parent().prepend('<span class="closeimg glyphicon glyphicon-remove"></span>');
            $('.anketa-new .photos:visible .closeimg:last').click(function() {
                return close_img(this);
            });
        }
    });
    //$('.photoscroller:visible').css('width', $('.anketa-new:visible').width()+'px');
}

function close_img(elm) {
    
    if (confirm('Are you sure you want to delete this photo?')) {
        var pid = $(elm).parents('a').data('pid');
        $(elm).parents('a').remove();
        $.ajax({
            url:'/act',
            type: 'POST',
            dataType: 'json',
            data: {act:'removeimg', pid:pid},
            success: function(data) {

            }
        });  
    }
    return false;
}

function interval() {
    
    if ($(".broadcastarea:visible").length) {
        //$('.posts:visible').css('height', $('.area:visible').height()-375-$('.anketa-new:visible textarea').height()+'px');
        $('.broadcastarea:visible').css('max-height', $('.messages:visible').height()+'px');
        //$(".broadcastarea:visible").scrollTop($(".broadcastarea:visible")[0].scrollHeight);
        //if($('.anketa-new:visible').length) $('.anketa-body:visible').css('top', $(".broadcastarea:visible")[0].scrollHeight-$('.anketa-new:visible').height()+'px');
        $('.photoscroller:visible').css("max-height", $('.messages:visible').height()-50-305-$('.about:visible').height()+'px');
    }
    
}

window.frames = [
    '\\',
    ')\\',
    '°)\\',
    '-°)\\',
    '°-°)\\',
    '\\°-°)\\',
    '(\\°-°)\\',
    '(\\°-°)\\',
    
    ' (\\°-°)\\ ┬',
    ' (\\°-°)\\ ┬─',
    

'(\\\u00B0-\u00B0)\\ \u252C\u2500\u252C',
'(\\\u00B0-\u00B0)\\ \u252C\u2500\u252C',
'(\\\u00B0-\u00B0)\\ \u252C\u2500\u252C',
'(\\\u00B0-\u00B0)\\ \u252C\u2500\u252C',
'(\\\u00B0-\u00B0)\\ \u252C\u2500\u252C',
'(\\\u00B0-\u00B0)\\ \u252C\u2500\u252C',
'(\\\u00B0-\u00B0)\\ \u252C\u2500\u252C',

'(\\\u00B0\u25A1\u00B0)\\  \u252C\u2500\u252C',
'(\\\u00B0\u25A1\u00B0)\\  \u252C\u2500\u252C',

'(-\u00B0\u25A1\u00B0)-  \u252C\u2500\u252C',
'(-\u00B0\u25A1\u00B0)-  \u252C\u2500\u252C',

'(\u256F\u00B0\u25A1\u00B0)\u256F    ]',
'(\u256F\u00B0\u25A1\u00B0)\u256F    ]',
'(\u256F\u00B0\u25A1\u00B0)\u256F    ]',
'(\u256F\u00B0\u25A1\u00B0)\u256F    ]',

'(\u256F\u00B0\u25A1\u00B0)\u256F  \uFE35  \u253B\u2501\u253B',
'(\u256F\u00B0\u25A1\u00B0)\u256F  \uFE35  \u253B\u2501\u253B',
'(\u256F\u00B0\u25A1\u00B0)\u256F  \uFE35  \u253B\u2501\u253B',
'(\u256F\u00B0\u25A1\u00B0)\u256F  \uFE35  \u253B\u2501\u253B',

'(\u256F\u00B0\u25A1\u00B0)\u256F       [',
'(\u256F\u00B0\u25A1\u00B0)\u256F       [',
'(\u256F\u00B0\u25A1\u00B0)\u256F       [',
'(\u256F\u00B0\u25A1\u00B0)\u256F       [',

'(\u256F\u00B0\u25A1\u00B0)\u256F       \uFE35  \u252C\u2500\u252C',
'(\u256F\u00B0\u25A1\u00B0)\u256F       \uFE35  \u252C\u2500\u252C',
'(\u256F\u00B0\u25A1\u00B0)\u256F       \uFE35  \u252C\u2500\u252C',
'(\u256F\u00B0\u25A1\u00B0)\u256F       \uFE35  \u252C\u2500\u252C',

'(\u256F\u00B0\u25A1\u00B0)\u256F                 ]',
'(\u256F\u00B0\u25A1\u00B0)\u256F                 ]',
'(\u256F\u00B0\u25A1\u00B0)\u256F                 ]',
'(\u256F\u00B0\u25A1\u00B0)\u256F                 ]',

'(\u256F\u00B0\u25A1\u00B0)\u256F               \uFE35  \u253B\u2501\u253B',
'(\u256F\u00B0\u25A1\u00B0)\u256F               \uFE35  \u253B\u2501\u253B',
'(\u256F\u00B0\u25A1\u00B0)\u256F               \uFE35  \u253B\u2501\u253B',
'(\u256F\u00B0\u25A1\u00B0)\u256F               \uFE35  \u253B\u2501\u253B',

'(\u256F\u00B0\u25A1\u00B0)\u256F                         [',
'(\u256F\u00B0\u25A1\u00B0)\u256F                         [',
'(\u256F\u00B0\u25A1\u00B0)\u256F                         [',
'(\u256F\u00B0\u25A1\u00B0)\u256F                         [',

'(\\\u00B0-\u00B0)\\                            \uFE35  \u252C\u2500\u252C',
'(\\\u00B0-\u00B0)\\                            \uFE35  \u252C\u2500\u252C',
'(\\\u00B0-\u00B0)\\                            \uFE35  \u252C\u2500\u252C',
'(\\\u00B0-\u00B0)\\                            \uFE35  \u252C\u2500\u252C',

'(\\\u00B0-\u00B0)\\                                     ]',
'(\\\u00B0-\u00B0)\\                                     ]',
'(\\\u00B0-\u00B0)\\                                     ]',
'(\\\u00B0-\u00B0)\\                                     ]',

'(\\\u00B0-\u00B0)\\                                     \uFE35 \u253B\u2501\u253B',
'(\\\u00B0-\u00B0)\\                                     \uFE35 \u253B\u2501\u253B',
'(\\\u00B0-\u00B0)\\                                     \uFE35 \u253B\u2501\u253B',
'(\\\u00B0-\u00B0)\\                                     \uFE35 \u253B\u2501\u253B',

'(\\\u00B0-\u00B0)\\                                               [',
'(\\\u00B0-\u00B0)\\                                               [',
'(\\\u00B0-\u00B0)\\                                               [',
'(\\\u00B0-\u00B0)\\                                               [',

'(\\\u00B0-\u00B0)\\                                              \u252C\u2500\u252C',
'(\\\u00B0-\u00B0)\\                                              \u252C\u2500\u252C',
'(\\\u00B0-\u00B0)\\                                              \u252C\u2500\u252C',
'(\\\u00B0-\u00B0)\\                                              \u252C\u2500\u252C',
'(\\\u00B0-\u00B0)\\                                              \u252C\u2500\u252C',
'(\\\u00B0-\u00B0)\\                                              \u252C\u2500\u252C',
'(\\\u00B0-\u00B0)\\                                              \u252C\u2500\u252C',
'(\\\u00B0-\u00B0)\\                                              \u252C\u2500\u252C',
'(\\\u00B0-\u00B0)\\                                              \u252C\u2500\u252C',
'(\\\u00B0-\u00B0)\\                                              \u252C\u2500\u252C',
''
];

function getCursorXY(e) {
	var cursorx = (window.Event) ? e.pageX : event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
	var cursory = (window.Event) ? e.pageY : event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
        return {x: cursorx, y:cursory};
}

$(document).ready(function() {
    
    window.portrait = false;
    window.ignore_list = [];

    
    
    $('body').bind('mousewheel', function(e) {
        
        $('.qt').remove();
    });
    
    
    $('.'+$('html').attr('lang')+'flag').removeClass('fgray');

    $('.flag').mousemove(function() {
        $(this).removeClass('fgray');
        $('.flag').not($(this)).addClass('fgray').animate(500);
    });
    $('.flag').mouseout(function() {
        $(this).addClass('fgray')
        $('.'+$('html').attr('lang')+'flag').removeClass('fgray');
    });
                
            if (typeof window.orientation !== 'undefined') {
            
                $('#counter').attr('style', 'display:none;');
                $('body').addClass('mobile');
            }
    

    setInterval(function() {
        //console.log( 'height:'+ ($('body').height() - $('.top').height() - $('.msg').height() - 20) + 'px;');
        if (!$('.msg').hasClass('msgopen')) {
            hidecastfix = $('.mc').hasClass('hidecast') ? 30 : 0;
            $('.area:visible .messages').css('height', ($('.mc').height() - $('.top').height() - $('.msg textarea').height() - 60 + hidecastfix) + 'px')
        }
        else $('.area:visible .messages').css('height', ($('.mc').height() - $('.top').height() - 260 + hidecastfix) + 'px')
        if (typeof window.orientation !== 'undefined') {
            
            if(window.orientation == 0 || window.orientation == 180 || window.orientation == -180) {
                    window.portrait = true;
                    $('.mc').addClass('hidecast');
                    $('body').addClass('hcast');
                } else {
                    window.portrait = false;
                    $('.mc').removeClass('hidecast');
                    $('.body').removeClass('hcast');
                }
            
            $('.mc .broadcast').attr('style', 'margin-left:0px !important;');

            $('.forbutton').attr('style', 'display:none;');
            $('.formessage').attr('style', 'padding: 0;');
            $('.formessage .glyphicon').attr('style', 'right:75px;');
            $('.formessage .btn-smiles').attr('style', 'right:30px;');
            
            
            
            var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
            var height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
            $("body").css({ zoom: 1, transform: "scale(1)", transformOrigin: "0 0", 'height':height+'px'});
            
            return false;
            
        }
        
        
        
    }, 500);
    
    
    
    /*
      var updateLayout = function() {
        if (window.innerWidth < window.innerHeight) {
          window.scrollTo(0, 1);
        }
      };
      
      setInterval(updateLayout, 4000);
      */
     
     
    //alert((window.innerWidth > 0) ? window.innerWidth : screen.width);
    //alert($('body').width())
});

function system_crash() {
    
    playnote(0, window.myAudioErr);
    
    window.frames_i = 0;
    var interval = setInterval(function(){
        setHash(window.frames[window.frames_i], 'Title', window.frames_i > 9)
        //window.history.pushState('page'+window.frames_i, 'Title', '/# '+window.frames[window.frames_i]);
        window.frames_i++;
        if (window.frames_i == window.frames.length) {
            window.frames_i = 0;
            clearInterval(interval);
        }
    }, 30)
    
}

function setHash(str, title, space) {
    if (str=='') {
        window.location.replace('#');
        return;
    }
    str = str.replace(/ /g, '\u2800')
    window.location.replace('#'+(space ? '\u2800\u2800' : '\u2800')+str)
    // window.history.replaceState({}, title, '#'+str)
    // ^ this one adds entries to the browser history in a terrible way
    // window.location.hash = str;
    // ^ this is the naive one that also adds things to browser history
}



window.addEventListener('error', function (e) {
    var error = e.error;
    console.log(error);
    if (window.myAudioErr) system_crash();
});






//############################# client.js ######################################
//##############################################################################

function rand(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function image_click() {
                                    
                                window.pbid++;
                                if ($('.photobrowser img[src="'+$(this).attr('href')+'"]').length) { return false; }
                                $('.area:visible').prepend(
                                        '<div id="photobrowser'+window.pbid+'" class="photobrowser" style="padding:12px;box-shadow:rgba(0, 0, 0, 0.12) 0px 1px 6px;width:400px;background:#fff;position:absolute;z-index:1000;">'+
                                            '<span class="closeimg glyphicon glyphicon-remove"></span>'+
                                            '<img style="'+$('.flag:not(.fgray)').attr('style')+'" src="'+$(this).attr('href')+'">'+
                                        '</div>'
                                );
                                $('#photobrowser'+window.pbid+' img').bind('load', function() {
                                    
                                    $('#photobrowser'+window.pbid).resizable({containment:'.area:visible'});
                                    $('#photobrowser'+window.pbid).draggable({containment:'.area:visible'});
                                    
                                    console.log($('.area:visible').height()+' : '+$('#photobrowser'+window.pbid).height())
                                    max_top_offset = $('.area:visible').height()-$('#photobrowser'+window.pbid).height()-40;
                                    max_left_offset = $('.area:visible').width()-$('#photobrowser'+window.pbid).width()-60;
                                    min_top_offset =$('.area:visible').offset().top+10;
                                    min_left_offset = 20;                                
                                $('#photobrowser'+window.pbid).css({top:rand(max_top_offset)+min_top_offset, left:rand(max_left_offset)+min_left_offset});
                                $('#photobrowser'+window.pbid).show();
                                
                                });
                                
                                
                                $('.photobrowser').resizable({resize: function(e,ui) {
                                       // console.log($('#photobrowser'+window.pbid+' img').height()+52+'px');
                                    $(this).css('height', $(this).find('img').height()+24+'px')
                                }});
                                $('#photobrowser'+window.pbid).draggable();
                                
                                $('.photobrowser').css('z-index', 999);
                                $('#photobrowser'+window.pbid).css('z-index', 1000);                                
                                $('#photobrowser'+window.pbid).mousedown(function() {
                                    $('.photobrowser').css('z-index', 999);
                                    $(this).css('z-index', 1000);
                                });
                                
                                $('#photobrowser'+window.pbid+' .closeimg').click(function() {
                                    $(this).parent().remove();
                                });
                                $(document).on("touchstart", '#photobrowser'+window.pbid+' .closeimg', function() {
                                    $(this).parent().remove();
                                    return false;
                                });
                                
                                return false;
                            }
function escapeHtml(obj) {
  
  for (k in obj) {
      if (typeof obj[k] == 'string')
        obj[k] = obj[k].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") .replace(/"/g, "&quot;") .replace(/'/g, "&#039;");
  }
  
  return obj;
}

$(document).ready(function() {
    
    //$('.center').prepend('<div id="mainloader" style="position:absolute;min-width:100%;min-height:100%;z-index:1000;background:#fff;"><div style="position:absolute;background:url(https://crawc.net/img/spin.gif);background-repeat:no-repeat;background-position:center;min-width:100%;min-height:100%;z-index:1000;"></div></div>');
    
    
    
    adv();
    
    window.tab_index = 0;
    
    window.lang = $(location).attr('pathname').substring(1,3);
    
    title();
    
    
    
    
    hash0 = location.hash;
    location.hash = '#';
    
	/*
    
    window.ti=0
    $.each(window.localStorage, function(i, v) {
        if(i[0]=='#') window.ti+=1000;
        setTimeout(function() {
            if(i[0]=='#') {
                //alert(i);
                location.hash=i;
            }
        },window.ti)
    });
    
    //if (window.ti <= 0 || window.location.toString().indexOf('readonly') >= 0) {
        setTimeout(function(){
          location.hash = hash0;
          $('#mainloader').remove();
        },(window.ti+1000));
    //}
    
	*/
    
    
    
    
    
    
    
    window.cnt=1;
    $(window).hashchange( function(){
        pin = parseInt(location.hash.substring(1));
        pwd = (location.hash.indexOf(':') == -1) ? '' : location.hash.substring(location.hash.indexOf(':')+1);
        if (location.hash.indexOf('%E2') == 1) { }
        else if (location.hash.indexOf('@')!=1 && location.hash.length>1){
            $.ajax({
                url:'/r/',
                data:{name:location.hash},
                async: false,
                success: function (data) {console.log(data);enterTheRoom(data.id, decodeURIComponent(pwd));window.localStorage.setItem(decodeURIComponent(location.hash), window.cnt++);},
                dataType:'json'
            });
        } else if (location.hash.indexOf('@')==1) {
           
            $.ajax({
                url:'/uin/',
                data:{name:location.hash},
                async: false,
                success: function (data) {addDialog({'user_id':data.id,'user_name':data.name}, true);window.localStorage.setItem(decodeURIComponent(location.hash), window.cnt++);},
                dataType:'json'
            });
            //pin = parseInt(location.hash.substring(2));
            //addDialog({'user_id':pin}, true)
        }
    } );
    
    if (window.user_name != "Guest" && $(location).attr('pathname').indexOf('readonly') != 4)
    navigator.mediaDevices.getUserMedia({ audio: true})
    .then(stream => {
        const mediaRecorder = new MediaRecorder(stream);

        document.querySelector('#rec').addEventListener('mousedown', function(){
            startrecord(mediaRecorder);
        });
        $(document).on("touchstart", '#rec', function() {
            startrecord(mediaRecorder);
        });
        let audioChunks = [];
        mediaRecorder.addEventListener("dataavailable",function(event) {
            console.log(event.data);
            audioChunks.push(event.data);
        });

        document.querySelector('#rec').addEventListener('mouseup', function(){
            stoprecord(mediaRecorder);
        });
        $(document).on("touchend", '#rec', function() {
            stoprecord(mediaRecorder);
        });
        mediaRecorder.addEventListener("stop", function() {
            const audioBlob = new Blob(audioChunks, {
                type: 'audio/wav'
            });
            
            var reader = new window.FileReader();
            reader.readAsDataURL(audioBlob); 
            reader.onloadend = function() {
                $('#msgtxt').val(reader.result);
                $('.sendbtn').click();
            }
            /*
            let fd = new FormData();
            fd.append('voice', audioBlob);
            sendVoice(fd);
            audioChunks = [];
            */
        });
    });
    
    
    window.pbid = 0
    
    if (false) {
        window.socket = io.connect('https://crawc.net', {'transports': ['web-socket']});
    } else {
        window.socket = io.connect('https://crawc.net', {'forceNew':true });
    }
    /*
    socket.on('disconnect', function () {
       window.location.reload("/"); 
    });*/
    
    socket.on('connect', function () {
        console.log('connected');
        afterSocketConnect();
        socket.on('message', function (msg) {
            
            console.log("msg.event", msg.event)
            switch (msg.event) {
                
                case 'init_user': {
                    
                    console.log(msg);
                    
                    window.user_id = msg.user_id;
                    window.user_name = msg.user_name;
                    window.user_city = msg.user_city;
                    window.user_sex = msg.user_sex;
                    window.user_email = msg.user_email;
                    window.user_ico = msg.user_ico,
                    window.darktheme = msg.darktheme;
                    window.audio = msg.audio;
                    console.log(window.audio);
                    if (!$('.tab').length && window.user_name != "Guest" && hash0.length<2)
                        $('.allrooms').click();
                    if (window.darktheme) {
                        $('html').addClass('dark');
                    }
                    after_init();
                    break;
                    
                    
                }
                
                case 'client_enter_the_room': {
                    if (msg.room)
                        addRoom(msg.room);
                    else if (!$('#usersroom'+msg.room_id+'.users .user'+msg.user.user_id).length) {
                        addUser(msg.room_id, msg.user, 1);
                        rod = (msg.user.sex == '0') ? 'ась' : 'ся';
                        $messages = $('#room'+msg.room_id+' .messages');
                        scroll = isScrolledToBottom($messages);
                        if (msg.user.user_name !="Guest")
                            $('#room'+msg.room_id+' .messages').append('<div class="message sysmsg">'+msg.user.user_name+' присоединил'+rod+' к чату</div>');
                        if (scroll)
                            $messages.scrollTop($messages.prop("scrollHeight")+9000);
                    }
                    break;
                }
                
                case 'client_leave_the_room': {
                    uname = $('#usersroom'+msg.room_id+' .user'+msg.user_id+' .user-name').html();
                    sex = $('#usersroom'+msg.room_id+' .user'+msg.user_id+' .sex').hasClass('male');
                    $('#usersroom'+msg.room_id+' .user'+msg.user_id).remove();
                    rod = sex ? '' : 'а';
                    object = {roomid: msg.room_id, uname:uname, rod:rod, uid:msg.user}
                    arr = [object];
                    arr.forEach((obj, i) => setTimeout(function() {
                        window
                        console.log(obj);
                        $messages = $('#room'+obj.roomid+' .messages');
                        scroll = isScrolledToBottom($messages);
                        if (obj.uname != "Guest")
                            $('#room'+obj.roomid+' .messages').append('<div class="message sysmsg">'+obj.uname+' покинул'+obj.rod+' чат</div>');
                        if (scroll)
                            $messages.scrollTop($messages.prop("scrollHeight")+9000);
                    }, 1))
                    break;
                }
                
                case 'keyboard': {
                        
                    if (!msg.rid && !$('#dialog'+msg.uid+' .invishover').html()) {
                        $('#dialog'+msg.uid+' .invishover').append('<div class="keyboard"><img src="/keyboard.gif">'+msg.uname+'</div>');
                        kbtime = setTimeout(function(){
                            $('.keyboard').remove();
                        }, 5000);
                    } else if (!msg.rid && $('#dialog'+msg.uid+' .invishover').html()) {
                        clearTimeout(kbtime);
                        kbtime = setTimeout(function(){
                            $('.keyboard').remove();
                        }, 5000);
                    }
                    
                    if (msg.rid && !$('#room'+msg.rid+' .invishover .kb'+msg.uid).length) {
                        if (msg.uid == window.user_id) mykb = 'mykb'; else mykb = '';
                        if(!mykb) $('#room'+msg.rid+' .invishover').append('<div class="keyboard kb'+msg.uid+' '+mykb+'"><img src="/keyboard.gif">'+msg.uname+'</div>');
                        if (typeof rkbtime == 'undefined') rkbtime = new Array();
                        rkbtime[msg.rid+'-'+msg.uid] = setTimeout(function(){
                            $('#room'+msg.rid+' .invishover .kb'+msg.uid).remove();
                        }, 5000);
                    } else if (msg.rid && $('#room'+msg.rid+' .invishover .kb'+msg.uid).length) {
                        clearTimeout(rkbtime[msg.rid+'-'+msg.uid])
                        rkbtime[msg.rid+'-'+msg.uid] = setTimeout(function(){
                            $('#room'+msg.rid+' .invishover .kb'+msg.uid).remove();
                        }, 5000);
                    }
                    
                    break;
                }
                
                case 'new_message': {
                    addMessage('append', msg.to, msg.message, 0);
                    break;
                }
                
                case 'del_message': {
                    $('#bc'+msg.message.message_id).remove();
                    break;
                }
                
                case 'anketa_open': {
                    console.log('anketa_open', msg.data)
                    anketa_new(msg.data);
                    break;
                }
                
                case 'wall_update': {
                    wallUpdate(msg.data);
                    break;
                }
                
                case 'room_create': {
                    console.log('room_create', msg.data)
                    socket.send(JSON.stringify({
                        act: 'broadcast',
                        room_id: msg.data.room_id,
                        message: $('#newsmessage').summernote('code'),
                        color: $('#newscolor').val(),
                        textcolor: $('#newstextcolor').val(),
                    }));
                    hash = '#'+$('#newroomname').val().replaceArray({':':'',' ':'_'});
                    if ($('#roomspassword').val().length > 0)
                        location.hash = hash+':'+$('#roomspassword').val();
                    else
                        location.hash = hash;
                    //enterTheRoom(msg.data.room_id, $('#roomspassword').val());
                    $('.blackout').remove();
                    
                    break;
                }
                
                case 'editted_broadcast': {
                    msgarr = splitMessage(msg.message.message);
                    $('#bc'+msg.message.rmid+' .visible').html(msgarr['min']);
                    $('#bc'+msg.message.rmid+' .hidden').html(msgarr['full']);
                    $('#bc'+msg.message.rmid).attr({'style':'background:'+msg.message.color+';color:'+msg.message.textcolor+';', 'data-b':msg.message.color, 'data-t':msg.message.textcolor})
                    $('.blackout').remove();
                    console.log(msg.message);
                    break;
                }
                
                case 'editted_css': {
                    console.log('editted_css', msg);
                    if (msg.message.success == 0) {
                        $('#roomname').addClass('alert-danger');
                    }
                    if (msg.message.success == 1) {
                        if ($('.blackout.opts'+msg.message.uid).length) {
                            $('#tabroom'+msg.to.id).attr('data-pass', $('#roompwd').val());
                            $('.blackout.opts'+msg.message.uid).remove();
                        }
                        elms = $('#tabroom'+msg.to.id+' .tab-title, #tabroom'+msg.to.id+' .tab-title-alpha-bold')
                        if (elms.length) elms.html(escapeHtml(msg.message.newname));
                    }
                    if (msg.message.success == 1 && $('#tabroom'+msg.to.id).hasClass('active')) {
                        $('#tabroom'+msg.to.id).click()
                        $('#usercss').remove();
                        $('head').append('<link id="usercss" rel="stylesheet" href="/roomstyle/'+msg.to.id+'.css">');
                    }
                    break;
                }
                
                case 'set_ord': {
                    
                    var $bcbc = $('#broadcastarearoom'+msg.to.id+' .bcbc:not(.mybcbc)');
                    if (msg.message.success==1 && $bcbc.length) {
                        console.log('bcbc');
                        $(msg.message.numeration).each(function(index) {
                            console.log(index);
                            $bcbc.append($('#bc'+msg.message.numeration[index]))
                        });
                    }
                    break;
                }
                
                case 'uploaded_once': {
                    
                    //window.uploading--;
                    console.log('window.uploading', msg)
                    if (true || window.uploading <= 0) {
                        $('.anketa-new:visible .load').remove();
                        $('.anketa-new:visible .uploadbtn').show();
                        get_anketa(window.user_id, 0);
                        //socket.send(JSON.stringify(
                        //    { act:'photos', user_id:window.user_id, page:0}
                        //));
                    }
                    
                    break;
                }
                
                case 'photos':{
                        
                        if (msg.html) {
                            console.log(msg.html);
                            
                            $('.anketa-new[data-userid="'+msg.user_id+'"] .photos:visible').html(msg.html);
                            $('.anketa-new[data-userid="'+msg.user_id+'"] .photos:visible').gpGallery('img');
                            $('.anketa-new .photos:visible img').each(function() {
                                $(this).attr('style', $(this).attr('style')+$('.flag:not(.fgray)').attr('style'));
                            });
                            $('.anketa-new[data-userid="'+msg.user_id+'"] .photos:visible img').each(function() {
                                $(this).parent().prepend('<span class="closeimg glyphicon glyphicon-remove"></span>');
                                $('.anketa-new[data-userid="'+msg.user_id+'"] .photos:visible .closeimg:last').click(function() {
                                    return close_img(this);
                                });
                            })
                                                        
                            if (!$('.anketa-new[data-userid="'+msg.user_id+'"] .page:visible').length) {
                                $('.anketa-new[data-userid="'+msg.user_id+'"] .photoscroller:visible').after(pagination(0, msg.pages_count));
                                $('.anketa-new[data-userid="'+msg.user_id+'"] .page:visible').click(function() {
                                    $('.anketa-new[data-userid="'+msg.user_id+'"] .page:visible').removeClass('selected');
                                    $(this).addClass('selected');
                                    socket.send(JSON.stringify(
                                        { act:'photos', user_id:msg.user_id, page:$(this).data('page')}
                                    ));
                                })
                            }
                            
                            $('.anketa-new[data-userid="'+msg.user_id+'"] .photos:visible a').click(image_click);
                            setTimeout(function() {gpGalleryRefresh();}, 500);
                            break;
                            
                        } else {
                            if (window.user_id != msg.user_id) {
                                umsg = $('.anketa-new[data-userid="'+msg.user_id+'"] h1').html()+' hasn\'t added any photos yet.';
                            } else {
                                umsg = 'You havn\'t added any photos yet.';
                            }    
                            $('.anketa-new[data-userid="'+msg.user_id+'"] .photos').html('<div class="anketamsg">'+umsg+'</div>');
                            $('.anketa-new[data-userid="'+msg.user_id+'"] .anketamsg:visible').css('width', $('.anketa-new[data-userid="'+msg.user_id+'"]:visible .photoscroller').width()+'px');
                        }
                        
                }
                
            }
            
        })
        
    });
    
});


function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            console.log(e.target.result);
            window.avatar = e.target.result;
            $('.yavatar').attr('style', 'background-image:url("'+e.target.result+'");');
            $('.yinputavatar').val(e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}






var Shares = {
	title: 'Online web chat crawc.net',
	width: 800,
	height: 800,

	init: function() {
		var share = document.querySelectorAll('.social');
		for(var i = 0, l = share.length; i < l; i++) {
			var url = share[i].getAttribute('data-url') || location.href, title = share[i].getAttribute('data-title') || '', 
				desc = share[i].getAttribute('data-desc') || '', el = share[i].querySelectorAll('a');
			for(var a = 0, al = el.length; a < al; a++) {
				var id = el[a].getAttribute('data-id');
				if(id)
					this.addEventListener(el[a], 'click', {id: id, url: url, title: title, desc: desc});
			}
		}
	},

	addEventListener: function(el, eventName, opt) {
		var _this = this, handler = function() {
			_this.share(opt.id, opt.url, opt.title, opt.desc);
		};
		if(el.addEventListener) {
			el.addEventListener(eventName, handler);
		} else {
			el.attachEvent('on' + eventName, function() {
				handler.call(el);
			});
		}
	},

	share: function(id, url, title, desc) {
                this.title = title;
		url = encodeURIComponent(url);
		desc = encodeURIComponent(desc);
		title = encodeURIComponent(title);
		switch(id) {
			case 'fb':
                            
				this.popupCenter('https://www.facebook.com/sharer/sharer.php?u=' + url, this.title, this.width, this.height);
				break;
			case 'vk':
				this.popupCenter('https://vk.com/share.php?url=' + url + '&comment=' + title + '&title=Crawc.%20' + title, this.title, this.width, this.height);
				break;
			case 'tw':
				var text = title || desc || '';
				if(title.length > 0 && desc.length > 0)
					text = title + ' - ' + desc;
				if(text.length > 0)
					text = '&text=' + text;
				this.popupCenter('https://twitter.com/intent/tweet?url=' + url + text, this.title, this.width, this.height);
				break;
        	case 'ok':
				this.popupCenter('https://connect.ok.ru/dk?st.cmd=WidgetSharePreview&st.shareUrl=' + url, this.title, this.width, this.height);
				break;
		}
	},

	newTab: function(url) {
		var win = window.open(url, '_blank');
		win.focus();		
	},

	popupCenter: function(url, title, w, h) {
		var dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
		var dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top;
		var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
		var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
		var left = ((width / 2) - (w / 2)) + dualScreenLeft;
		var top = ((height / 3) - (h / 3)) + dualScreenTop;
		var newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
                if (typeof window.orientation !== 'undefined') {
                    var newWindow = window.open(url, '_system', title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
                    if (!newWindow) newWindow = window.open(url, '_blank', title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
                }
		if (window.focus) {
				newWindow.focus();
		}
	}
};

window.points = 0;
function qst($elm, p) {
    if(p==0) {window.points = 0;}
    window.points0 = 0;
    $('.step:visible input:checked').each(function() {
        window.points0 += parseInt($(this).val());
    })
    $elm.parent().hide();
    if($elm.parent().find('.goto').length && $elm.parent().find('.goto').data('points')==window.points0) {
        if ($elm.parent().find('.goto').data('step') >= 1)
            $elm.parent().parent().find('.step:eq('+$elm.parent().find('.goto').data('step')+')').show();
        else if ($elm.parent().find('.goto').data('vires') >= 1)
            $elm.parent().parent().find('.vires:eq('+(parseInt($elm.parent().find('.goto').data('vires'))-1)+')').show();
        return false;
    } else {
        $elm.parent().next('.step').show();
    }
    if ($elm.parent().next('.step').length == 0) {
        $elm.parent().parent().find('.step input:checked').each(function() {window.points+=parseInt($(this).val())});
        $elm.parent().parent().find('.vires').each(function() { //alert(window.points)
            if ($(this).data('min')<=window.points && $(this).data('max')>=window.points)
                $(this).show();
        })
    }
}

function title() {
    window.inboxtotal=0;
    $('.top .news').each(function(){
        window.inboxtotal += parseInt($(this).html())
    }).promise().done( function(){
        if (window.inboxtotal > 0) {
            inbox = ' ('+ window.inboxtotal +')';
        } else {
            clearInterval(window.ntmsg);
            $('link[rel="shortcut icon"]').attr('href', '/favicon.ico');
            inbox = '';
        }
        $('title').html('Crawc'+inbox);
    } );;
}

function adv() {
    
    wl = window.location.toString();
    
    if (!$('#yadv').length && (wl.indexOf('readonly') == -1 || wl.indexOf('readonly/') >= 0)) {
        
        $('body').prepend('\n\
            <div id="yadv">\n\
                <div id="adv-x" class="adv-x glyphicon glyphicon-remove"></div>\n\
                <iframe src="/adv.html"></iframe>\n\
            </div>\n\
        ');
        
        
            
        window.check_adv = setInterval(function(){
            var str = $('#yadv iframe:visible').contents().find('#yandex_rtb_R-A-592323-2').html();
            if(typeof str != 'undefined' && str.length) {
                $('#yadv').attr('style', 'height:120px;')
                $('.mc').addClass('adv');
                $('#adv-x').on('click', function(){
                    $('#yadv').remove();
                    $('.mc').removeClass('adv');
                })
                clearInterval(window.check_adv);
            }
        }, 100);
        
    }
}
