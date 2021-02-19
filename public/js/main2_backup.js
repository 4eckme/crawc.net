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
 
 function back_to_rooms() {
    $('.blackout .popup:visible').remove();
    $('.blackout .popup:hidden').show();
 }
 
 function createRoom() {
    $('.blackout .popup').hide();
    $('.blackout').prepend(
            '<div class="popup" style="min-width:35.714em">'+
                '<div class="popup-x glyphicon glyphicon-remove" onclick="back_to_rooms()"></div>'+
                '<h3>create room</h3>'+
                '<div class="new-room-form">'+
                    '<input type="text" class="form-control" placeholder="Room name">'+
                    '<textarea class="form-control" placeholder="Welcome"></textarea>'+
                    '<button class="btn btn-primary">Создать</button>'+
                    '<div class="add-lock"><input id="showbroadcast" type="checkbox"><label for="showbroadcast">set password</label></div>'+
                '</div>'+
            '</div>'
    );
}

function save_settings() {
    
    socket.send(JSON.stringify({
        act: 'save_settings',
        enabled: $('#audionote').prop("checked")
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
                    '<div style="margin-left:10px"><input id="audionote" type="checkbox" '+checked+'><label for="showbroadcast">Audio notifications</label></div>'+
                    '<button class="btn btn-primary" style="margin-top: 12px;" onclick="save_settings(); $(\'.blackout\').remove();">Сохранить</button>'+
                '</div>'+
            '</div>'
    );
}

function showRooms() {
    $('body').prepend(
            '<div class="blackout">'+
                '<div class="popup" style="width:50em">'+
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
                    '<div class="newroom" onclick="createRoom()">create room</div>'+
                '</div>'+
            '</div>'
    );
    
    setTimeout(function() {
        getRooms($('.rooms-search-input').val(), 0);
    }, 0);   
    
    $('.rooms-search-input').keyup(function() {
        getRooms($(this).val(), 0);
    });
}

function getRooms(q, page){

    if(!page) page=0;
    
    $.ajax({
        
        url: '/act',
        type: 'POST',
        dataType: 'json',
        data: {act:'get_rooms', q:q, page:page},        
        success: function (data) {
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
                    
                $('.rooms-list').append(
                        '<div class="room-item-new" data-roomid="'+data.rooms[key]['room_id']+'">'+
                            '<div class="right-new">'+data.rooms[key]['cnt']+'</div>'+
                            '<div class="left-new">'+data.rooms[key]['room_id']+'</div>'+
                            '<div class="center-new">'+lock+data.rooms[key]['room']+'</div>'+
                        '</div>'
                );
            };
                        
            $('.room-item-new').click(function() {
                enterTheRoom($(this).data('roomid'));
            });
            
            if (data.page > data.pages_count-1) data.page = data.pages_count-1;
            
            $('.rooms-pages').html(pagination(data.page, data.pages_count));
            $('.rooms-pages .page:not(.selected)').click(function() {
                getRooms($('.rooms-search-input').val(), $(this).data('page'));
            });
            $('.rooms-pages .page-input').keydown(function(e) {                
                if (e.which >= 48 && e.which <= 57 || e.which >= 96 && e.which <= 105 || e.which == 8 || e.which == 37 || e.which == 39 || e.which == 13) {
                    if (e.which == 13) getRooms($('.rooms-search-input').val(), parseInt($(this).val())-1);
                    return true;
                }
                else return false;
            });
            
            var popup_offset_top = $('.popup').offset().top;
            $('.popup').css({'transform':'translateX(-50%) translateZ(0)', top:popup_offset_top+'px'});
        }
    });
}

function enterTheRoom(room_id) {
    
    if ($('#tabroom'+room_id).length) {
        $('#tabroom'+room_id).click();
        remove_popup();
    } else {
        socket.send(JSON.stringify({
            act: 'enter_the_room',
            room_id: room_id,
        }));
    }
}

function addDialog(user, active) {
    
    if (!$('#tabdialog'+user.user_id).length) {
        addTab(user.user_id, user.user_name, 0, active);
        addArea({area_type:'dialog', dialog_info:{user_id:user.user_id}}, active);
        $('#dialog'+user.user_id+' .msg-area').focus();
    } else {
        $('#tabdialog'+user.user_id).click();
    }
}

function expand_bc() {
    
    $(this).dblclick(function() {
        if ($(this).hasClass('expanded')) {
            $('.bc.expanded:visible').removeClass('expanded');
        }
    })
    
    if ($('.bc.expanded:visible').length == 0) {
        $(this).addClass('expanded');
    } else if ($(this).hasClass('expanded')) {
        //$('.bc.expanded:visible').removeClass('expanded');
    } else {
        $('.bc.expanded:visible').removeClass('expanded');
        $(this).addClass('expanded');
    }
}

function addRoom(room) {

    remove_popup();
    addTab(room.info.room_id, room.info.room_name, 1, 1);
    addArea({area_type:'room', room_info:{room_id:room.info.room_id, room_admin:room.info.room_admin}}, 1);
    for (var i in room.messages) {
        addMessage('append', {to:'room', id:room.info.room_id}, room.messages[i], 1);
    }
    for (var i in room.broadcast) {
        msgarr = splitMessage(room.broadcast[i].message);
        $('#broadcastarearoom'+room.broadcast[i].room_id).append('<div class="bc" id="bc'+room.broadcast[i].id+'" data-id="'+room.broadcast[i].id+'" style="background:'+room.broadcast[i].color+';color:'+room.broadcast[i].textcolor+'"><span class="visible">'+msgarr['min']+'</span><span class="hidden">'+msgarr['full']+'</span>'+'<div class="mydel glyphicon glyphicon-remove"></div></div>');
        $('#bc'+room.broadcast[i].id).click(expand_bc);
    }
    
    
    $('.mydel').click(function() {
        $(this).parent('.bc').click();
        socket.send(JSON.stringify({
            act: 'delbroadcast',
            room_id: room.info.room_id,
            message_id: $(this).parent('.bc').data('id'),
        }));
    })
    
    if (window.user_id ==room.info.creator_id) {
        $('#broadcastarearoom'+room.info.room_id+' .mydel').show();
        $('#broadcastarearoom'+room.info.room_id+'').append('<div class="broadcastbtn"><a>Add news</a></div>');
        $('.broadcastbtn a').click(function() {
            $('body').prepend(
                '<div class="blackout">'+
                    '<div class="popup" style="width:50em">'+
                        '<div class="popup-x glyphicon glyphicon-remove" onclick="remove_popup()"></div>'+
                        '<h3>Adding news</h3>'+
                        '<textarea id="newsmessage" class="form form-control" style="resize:vertical;margin-bottom:15px;background:#fafafa;color:#333333;"></textarea>'+
                        '<input id="newsbtn" class="btn btn-primary" style="float:right;" type="button" value="Broadcast">'+
                        '<input id="newscolor" class="form form-control formcolor" style="width:100px;" type="text" value="#fafafa"><input id="newstextcolor" class="form form-control formcolor" style="width:100px;" type="text" value="#333333">'+
                    '</div>'+
                '</div>'
            );
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
                    message: $('#newsmessage').val(),
                    color: $('#newscolor').val(),
                    textcolor: $('#newstextcolor').val(),
                }));
                $('.blackout').remove();
            })
        })
    }
    
    for (var i in room.users) {
        addUser(room.info.room_id, room.users[i], 0);
    }
    $( '#room'+room.info.room_id+' td.input .resize-y').resizable({handles: 'n'});
    $('#room'+room.info.room_id+' .msg-area').focus();
}

function addTab(id, tab_title, is_room, is_active) {
    
    var tab_id = is_room ? 'tabroom'+id : 'tabdialog'+id;    
    var tab_container = is_room ? '.tabsrooms' : '.tabsdialogs';
    var tab_type = is_room ? 'room' : 'dialog';
    var tab_content = is_room ? tab_title : 'Private <span class="nn">'+tab_title+'</span>'
    var tab_active = is_active ? 'active' : 'not-active';    
    if (is_active) $('.top .tab.active:not(#'+tab_id+')').removeClass('active').addClass('not-active');
    
    $(tab_container).append(
            '<div id="'+tab_id+'" class="tab '+tab_type+' '+tab_active+'" data-id="'+id+'">'+
                '<span class="tab-title">'+tab_content+'</span>'+
                '<span class="tab-title-alpha-bold">'+tab_content+'</span>'+
                '<span class="x glyphicon glyphicon-remove"></span>'+
            '</div>'
    );
    
    $('#'+tab_id).click(function() {
        if (is_room){
            $('.right').show();
            $('.users').hide();
            $('#usersroom'+id).show();
        } else {
            $('.right').hide();
            $('.users').hide();
        }
        // Переключаем вкладку
        $('.top .tab.active').not($(this)).removeClass('active').addClass('not-active');
        $(this).addClass('active').removeClass('not-active');
        // Переключаем рабочую область
        $('.mc .area:not(#'+tab_type+id+')').hide();
        $('#'+tab_type+id).show();
        $('#'+tab_type+id+' .msg-area').focus();
        
        if ($('#'+tab_id).hasClass('dialog')) {
            get_anketa($('#'+tab_id).data('id'), 1);
        }
        
        readNews();
    });
    
    $('#'+tab_id+' .x').click(function() {             
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
            '<div id="'+area_id+'" class="area '+area_class+'" data-id="'+data_id+'" '+style_hide+'><div class="messages"></div><div class="broadcast" id="broadcast'+area_id+'">'+
            
            '<div class="broadcastarea" id="broadcastarea'+area_id+'">'+
            '</div>'+
            
            '</div></div>'
    );
    
    
    $('.right .users').hide();
    if(is_room) {
        $('.right').show();
        $('.mc .right').append('<div class="users" id="users'+area_id+'"></div>');
    } else {
        $('.right').hide();
    }
    
    if (area_info.area_type != 'room') {
        if ($('#'+area_id+':visible').length) {
            get_anketa(data_id, 0);
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
        $('#'+area_id+' .msg-area').focus();
    });

    $('#'+area_id+' .btn-smiles .smile').click(function() {
        insertAtCursor($('#'+ara_id+' .msg-area')[0], ' '+$(this).attr('data-code')+' ')
        $('#'+area_id+' .btn-smiles').toggleClass('open');
        $('#'+area_id+' .msg-area').focus();
        return false;
    });
    
    $('#'+area_id+' .messages').scroll(function() {
        readNews();
    });
}

function splitMessage(message) {
    var arr = new Array();
    if (message.length > 32) {
        arr = message.split('<br>');
        if (arr[0].length > 32) {
            arr[0] = arr[0].substr(0, 32)+'...';
        }
        arr['min'] = arr[0];
        arr['full'] = message;
    } else if (message.split('<br>').length > 1) {
        arr = message.split('<br>');
        arr['min'] = arr[0];
        arr['full'] = message;
    } else {
        arr['min'] = message;
        arr['full'] = message;
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

function addMessage(mode, to, message, scroll) {
    
    
     
    
    
        
    var my_message = (message.user_id == window.user_id) ? 'my-message' : '';
    
    if (to.to == 'room') {
        var data_id="";
        var message_id = 'r'+to.id+'m'+message.id;
        var area_id = 'room'+to.id;
    }
    else if (to.to == 'dialog') {
        var data_id = 'data-id="'+message.id+'"';
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
    
    var caret = '<span class="caret"></span>';
    console.log(message);
    if (!message.isbroadcast) {
        
        console.log(to, message);
        if ($('#'+area_id+' .messages .message:last').data('uid')!=message.user_id) {
            $('#'+area_id+' .messages')[mode](
                '<div id="'+message_id+'" class="message '+my_message+'" data-uid="'+message.user_id+'">'+
                    '<div class="author-area">'+
                        '<div class="avatar" style="background:url(\'/img/user'+message.user_id+'/avatar.gif\');"></div>'+
                        '<button class="btn btn-user user'+message.user_id+' dropdown-toggle" data-user-id="'+message.user_id+'" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span class="user-name">'+message.user_name+'</span>'+caret+'</button>'+
                    '</div>'+
                    '<div class="separator"></div>'+
                    '<div class="msg-content" '+data_id+'>'+message.message+'</div>'+
                    '<div class="separator"></div>'+
                '</div>'
            );
            
            
        } else {
            $('#'+area_id+' .messages .message:last').append('<div class="update"><div id="'+message_id+'" class="msg-content" '+data_id+'>'+message.message+'</div><div class="separator"></div></div>')
        }
        
        if ($('#'+area_id).is(':hidden') || !scroll) {
            var $news = $('#tab'+area_id+' .news');
            if ($news.length) $news.html(parseInt($news.html())+1);
            else $('#tab'+area_id+' .x').before('<span class="news">1</span>');
        } else if (to.to == 'dialog' && $('#'+area_id).is(':visible') && scroll) {
            send_lrm($('#'+area_id+':visible').data('id'), message.id);
        }
        
        if(window.audio && !my_message) {
            window.myAudio = window.myAudio ? window.myAudio : new Audio;
            window.myAudio.src = "/msg.mp3";
            window.myAudio.play();
            setTimeout(function() {
                window.myAudio.pause();
                window.myAudio.currentTime = 0;
            }, 5000);
        }
        
    } else {
        msgarr = splitMessage(message.message);
        console.log('#broadcastarea'+area_id);
        if ($('#broadcastarea'+area_id+' .broadcastbtn').length)
            $('#broadcastarea'+area_id).find('.broadcastbtn').before('<div class="bc" id="bc'+message.id+'" data-id="'+message.id+'" style="background:'+message.color+';color:'+message.textcolor+'">'+'<span class="visible">'+msgarr['min']+'</span><span class="hidden">'+msgarr['full']+'</span>'+'<div class="mydel glyphicon glyphicon-remove"></div></div>');
       else
           $('#broadcastarea'+area_id).append('<div class="bc" id="bc'+message.id+'" data-id="'+message.id+'" style="background:'+message.color+';color:'+message.textcolor+'">'+message.message+'<div class="mydel glyphicon glyphicon-remove"></div></div>');
        $('#bc'+message.id).click(expand_bc);
        if (my_message) $('#bc'+message.id+' .mydel').show();
        $('.mydel').mouseup(function() {
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
            return false;
        })
    }
    
    clickUser($('#'+area_id+' .messages .message#'+message_id+' button'));
    
    if (scroll) {
        $messages.scrollTop($messages.prop("scrollHeight"));
    }
    
    $('#'+message_id+' a.img').bind('load', function() {
        $messages.scrollTop($messages.prop("scrollHeight"));
    });
    
    $('#'+message_id+' a.img').click(image_click);

    
}

function addUser(room_id, user, sort) {
    
    $('#usersroom'+room_id).append(
        '<button class="btn btn-user user'+user.user_id+' dropdown-toggle" data-user-id="'+user.user_id+'" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+
            '<span class="sex '+user.sex+'"></span>'+
            '<span class="user-name">'+user.user_name+'</span>'+
            '<span class="caret"></span>'+
        '</button>'
    );
    
    clickUser($('#usersroom'+room_id+' .user'+user.user_id));
    
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
}

function clickUser($elm) {
    $elm.click(function() {
        console.log('clickUser');
        var user_id = $(this).data('user-id');
        var user_name = $(this).children('.user-name').html();
        var new_btn =
        '<div class="btn-group btn-user-group open">'+
          $(this)[0].outerHTML +
            '<ul class="dropdown-menu">'+
              '<li><a onclick="get_anketa('+user_id+', 0)" href="#">Profile</a></li>'+
              '<li><a href="#" onclick="addDialog({user_id:'+user_id+', user_name:\''+user_name+'\'}, 1)">Open private dialog</a></li>'+
              '<li><a href="#">Ignore</a></li>'+
              '<li role="separator" class="divider"></li>'+
              '<li><a href="#">Abuse</a></li>'+
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
        }
        
    }
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

function get_anketa(user_id, visa) {
    socket.send(JSON.stringify({
        act: 'anketa',
        user_id: user_id,
        visa: visa
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

function anketa_new(data){
    
    console.log('visa', data.visa);
    
    if (!data.visa) {
        var broadcastarea = $('.broadcastarea:visible');
        if ($('.broadcastarea:visible .anketa-new').length) {
            $('.broadcastarea:visible .anketa-new').remove();
        }
    } else {
        var broadcastarea = $('#broadcastareadialog'+data.profile.id);
    }
    
    var sex = data.profile.sex == 1 ? 'm' : 'f';
    var load_photo_btn = "";    
    if(data.profile.id == window.user_id) {
        load_photo_btn = '<input type="button" class="uploadbtn btn btn-default" style="float: right;" value="Load photo">'
    }
    window['posts'+data.profile.id] = window['posts'+data.profile.id] ? ++window['posts'+data.profile.id] : 1;
    broadcastarea.prepend('<div class="anketa-new" data-userid="'+data.profile.id+'"><div class="anketa-body '+sex+'">'+
        '<div class="uname"><span class="closeanketa glyphicon glyphicon-remove"></span><h1>'+data.profile.name+'</h1></div>'+
            '<div class="aa-icons m"><span class="glyphicon glyphicon-envelope"></span><span class="glyphicon glyphicon-plus"></span></div>'+
            '<div class="user-info">'+
            '<div class="avatar" style="background-image:url(\'/img/user'+data.profile.id+'/avatar.gif\')"></div><div class="profile-info"><div class="actions"><a>Private</a><a>Add</a></div><span class="field name">'+data.profile.fio+'</span><span class="field val1">'+data.profile.datebirth+'</span><span class="field val2">'+data.profile.city+'</span></div><div></div><div style="clear:both;"></div>'+
            '</div>'+
            '<div class="links">'+
                '<a href="#" class="active tt t1" data-wall="wall2">Photo</a>'+
                '<a href="#" class="tt t2" data-wall="wall1">Wall</a>'+
            '</div>'+
            '<div class="contents wall wall1"  style="display:none;">'+
                '<div style="display:none;    margin-top: 16px;">'+
                    '<textarea id="wallarea'+window.wallarea_cnt+'" onkeyup="textAreaAdjust(this)" class="form-control wallarea"></textarea>'+
                    '<a class="a-send" href="javascript:void(0);" onclick="wallSend()">send →</a>'+
                '</div>'+
                '<div class="posts" id="posts'+data.profile.id+'_'+window['posts'+data.profile.id]+'">'+
                    '<div class="answer answer0" style="background-image: url(/img/user4/avatar.gif);"><span class="postdate">Yesterday</span>Creeping line<br>I have good news</div>'+
                    '<div class="post"><span class="postdate">Yesterday</span><div style="background:url(\'/img/user5/avatar.gif\')" class="avatarmin"></div><div class="username ">no name</div><div class="content male">some text for example</div><div class="answer" style="background-image: url(/img/user4/avatar.gif);">Thank you very much, write more later</div></div>'+
                    '<div class="post"><span class="postdate">Yesterday</span><div style="background:url(\'/img/user5/avatar.gif\')" class="avatarmin"></div><div class="username ">no name</div><div class="content male">You are beautifull. You are beautifull. You are beautifull. You are beautifull. You are beautifull. You are beautifull. </div>'+
                    '<div class="answer answerhide"><span class="avatarmin" style="background-image: url(/img/user4/avatar.gif);"></span>reply</div>'+
                    '</div>'+
                    '<div class="post postf"><span class="postdate">3th of November</span><div style="background:url(\'/img/user5/avatar.gif\')" class="avatarmin"></div><div class="username">no name</div><div class="content female">hello!</div>'+
                    '<div class="answer answerhide"><span class="avatarmin" style="background-image: url(/img/user4/avatar.gif);"></span>reply</div>'+
                    '</div>'+
                '</div>'+
                '<input type="button" class="postbtn btn btn-default" style="float: right;" value="Post"><div style="clear:both;margin:0;"></div>'+
            '</div>'+
            '<div class="wall wall2"><div class="photoscroller" style="overflow-y:auto;overflow-x:hidden;"><div class="contents photos"></div></div>'+
            load_photo_btn+'<div style="clear:both;margin-bottom: 16px;"></div></div>'+
            '<form action="/upload" id="frm" method="post" enctype="multipart/form-data" style="display:none;"><input type="hidden" name="text" value="1"><input id="frmi" type="file" name="photos" class="filesinput" multiple="multiple"></form>'+
            '</div>'+
    '</div></div>');
    
    elem = document.getElementById('posts'+data.profile.id+'_'+window['posts'+data.profile.id]);
    
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
            id: 'posts'+data.profile.id,
            draggable: true,
            wait: false
        });
    
    $('.anketa-new:visible .uploadbtn').click(function() {
        $('.anketa-new:visible .filesinput').click();
    });
    $('.anketa-new:visible .filesinput').change(function() {
        if ($('.anketa-new:visible .filesinput')[0].files.length > 10) {
            alert('Одновременно может быть загружено не больше 10 фотографий');
        } else {
            $('.uploadbtn').after('<div class="load" style="">идет загрузка на сервер</div>');
            $('.uploadbtn').hide();
            
            $('.anketa-new:visible #frm').ajaxSubmit(
                    {  
                        success: function(data) { 
                            $('.anketamsg').remove();
                            $('.anketa-new:visible .photos').prepend(data);
                            $('.anketa-new:visible .photos a, .anketa-new:visible .photos a img').attr('style', '');
                            maxphotos=20;
                            $('.anketa-new:visible .photos a').each(function() {
                                $(this).html($(this).find('img'));
                                maxphotos--;
                                if (maxphotos<0) $(this).remove(); 
                            })
                            $('.anketa-new:visible .photos').gpGallery('img');
                            
                            socket.send(JSON.stringify(
                                { act:'photos', user_id:$('.anketa-new:visible').data('userid'), page:0}
                            ));
                            
                            $('.load').remove();
                            $('.uploadbtn').show();
                        }
                    }
             );
        }
    });
    $('#frm').submit(function(e){
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
    
    $(".closeanketa").click(function() {
        $('.anketa-new:visible').remove();
    });
    
    console.log({ act:'photos', user_id: data.profile.id, page:0});
    socket.send(JSON.stringify(
            { act:'photos', user_id: data.profile.id, page:0}
    ));
}

function anketa(data) {
    
    window.wallarea_cnt = window.wallarea_cnt || 0;
    window.wallarea_cnt++;
    $('.broadcastarea:visible').prepend(
        '<div class="anketa anketa'+data.profile.id+'" data-uid="'+data.profile.id+'">'+
            '<div class="uname"><h1>'+data.profile.name+'</h1></div>'+
            '<div class="aa-icons m"><span class="glyphicon glyphicon-envelope"></span><span class="glyphicon glyphicon-plus"></span></div>'+
            '<div class="user-info">'+
            '<div class="avatar" style="background-image:url(/img/user'+data.profile.id+'/avatar.gif)"></div><div class="profile-info"><span class="name">'+data.profile.fio+'</span><span class="val1">'+data.profile.datebirth+'</span><span class="val2">'+data.profile.city+'</span></div><div></div><div style="clear:both;"></div>'+
            '</div>'+
            '<div class="links">'+
                '<a href="#" class="active">Стена</a>'+
                '<a href="#">Фото</a>'+
                '<a href="#">Друзья</a>'+
            '</div>'+
            '<div class="contents">'+
                '<a class="a-write" href="javascript:void(0);" onclick="$(this).hide(); $(this).next().show(); $(this).next().children(\'textarea\').focus();">написать →</a>'+
                '<div style="display:none;">'+
                    '<textarea id="wallarea'+window.wallarea_cnt+'" onkeyup="textAreaAdjust(this)" class="form-control"></textarea>'+
                    '<a class="a-send" href="javascript:void(0);" onclick="wallSend()">отправить →</a>'+
                '</div>'+
                '<div class="posts"></div>'+
            '</div>'+
        '</div>'
    );
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


$(document).ready(function() {
    
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
        }
    })
    
    $('.sendbtn').click(function() {
        var $input = $('.msg textarea');
        if ($('.area:visible').hasClass('area-room')) var to = {to: 'room', id: $('.area:visible').data('id')}
        else if ($('.area:visible').hasClass('area-dialog')) var to = {to: 'dialog', id: $('.area:visible').data('id')}
        
        socket.send(JSON.stringify(
            { act:'send_message', to:to, message:$input.val() }
        ));
        $input.val('');
        $input.focus();
    });
    
    $('.msg textarea').dblclick(function() {
        $('.msg').toggleClass('msgopen');
        $('.mc .broadcastarea').toggleClass('msgopen-fix');
    })
    
    $('.btn-smiles').click(function() {
        $(this).toggleClass('open');
        $('#'+area_id+' .msg-area').focus();
        return false;
    });

    $('.btn-smiles .smile').click(function() {
        insertAtCursor($('.msg textarea')[0], ' '+$(this).attr('data-code')+' ')
        $('#'+area_id+' .btn-smiles').toggleClass('open');
        $('#'+area_id+' .msg-area').focus();
        
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
})

function interval() {
    
    if ($(".broadcastarea:visible").length) {
        $(".broadcastarea:visible").css('height', $('.messages:visible').height()+'px');
        //$('.broadcastarea:visible').css('max-height', $('.messages:visible').height()-50+'px');
        //$(".broadcastarea:visible").scrollTop($(".broadcastarea:visible")[0].scrollHeight);
        //if($('.anketa-new:visible').length) $('.anketa-body:visible').css('top', $(".broadcastarea:visible")[0].scrollHeight-$('.anketa-new:visible').height()+'px');
        //$('.photoscroller:visible').css("max-height", $('.messages:visible').height()-50-305+'px');
    }
    
}