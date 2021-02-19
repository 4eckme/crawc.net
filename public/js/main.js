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
                '<h3>Создать комнату</h3>'+
                '<div class="new-room-form">'+
                    '<input type="text" class="form-control" placeholder="Название комнаты">'+
                    '<textarea class="form-control" placeholder="Приветствие"></textarea>'+
                    '<button class="btn btn-primary">Создать</button>'+
                    '<div class="add-lock"><input id="showbroadcast" type="checkbox"><label for="showbroadcast">установить пароль</label></div>'+
                '</div>'+
            '</div>'
    );
}

function showRooms() {
    $('body').prepend(
            '<div class="blackout">'+
                '<div class="popup" style="width:50em">'+
                    '<div class="popup-x glyphicon glyphicon-remove" onclick="remove_popup()"></div>'+
                    '<h3>Комнаты</h3>'+
                    '<div class="rooms-search">'+
                            '<input type="text" class="form-control rooms-search-input">'+
                        '<span>поиск</span>'+
                    '</div>'+
                    '<div class="rooms-area">'+
                        '<center class="rooms-loading"><img src="img/spin.gif" style="width:36px;margin:12px 0 16px 0;"></center>'+
                        '<div class="rooms-list"></div>'+
                    '</div>'+
                    '<div class="rooms-pages"></div>'+
                    '<div class="newroom" onclick="createRoom()">создать комнату</div>'+
                '</div>'+
            '</div>'
    );
    
    setTimeout(function() {
        getRooms($('.rooms-search-input').val(), 0);
    }, 0);   
    
    $('.rooms-search-input').keyup(function() {
        getRooms($('.rooms-search-input').val(), 0);
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
                        'Не удается получить список комнат'+
                    '</div>'
                );
            } else if (!data.rooms.length) {
                $('.rooms-list').append(
                    '<div class="message">'+
                        'По Вашему запросу ничего не найдено'+
                    '</div>'
                );
            }
            
            for (var key in data.rooms) {
                var lock = '';
                if (data.rooms[key]['locked'])
                    lock = '<span class="glyphicon glyphicon-lock lock"></span>'
                    
                $('.rooms-list').append(
                        '<div class="room-item" data-roomid="'+data.rooms[key]['room_id']+'">'+
                            '<div class="right">'+data.rooms[key]['cnt']+'</div>'+
                            '<div class="left">'+data.rooms[key]['room_id']+'</div>'+
                            '<div class="center">'+lock+data.rooms[key]['room']+'</div>'+
                        '</div>'
                );
            };
                        
            $('.room-item').click(function() {
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

function addRoom(room) {

    remove_popup();
    addTab(room.info.room_id, room.info.room_name, 1, 1);
    addArea({area_type:'room', room_info:{room_id:room.info.room_id, room_admin:room.info.room_admin}}, 1);
    for (var i in room.messages) {
        addMessage('append', {to:'room', id:room.info.room_id}, room.messages[i], 1);
    }
    for (var i in room.users) {
        addUser(room.info.room_id, room.users[i], 0);
    }
    $( '#room'+room.info.room_id+' td.input .resize-y').resizable({handles: 'n'});
    $('#room'+room.info.room_id+' .msg-area').focus();
}

function addTab(id, tab_title, is_room, is_active) {
    
    var tab_id = is_room ? 'tabroom'+id : 'tabdialog'+id;    
    var tab_container = is_room ? '.rd.rooms' : '.rd.dialogs';
    var tab_type = is_room ? 'room' : 'dialog';
    var tab_content = is_room ? tab_title : 'Чат с <span class="nn">'+tab_title+'</span>'
    var tab_active = is_active ? 'active' : 'not-active';    
    if (is_active) $('.tabs .tab.active:not(#'+tab_id+')').removeClass('active').addClass('not-active');
    
    $(tab_container).append(
            '<div id="'+tab_id+'" class="tab '+tab_type+' '+tab_active+'" data-id="'+id+'">'+
                '<span class="tab-title">'+tab_content+'</span>'+
                '<span class="tab-title-alpha-bold">'+tab_content+'</span>'+
                '<span class="x glyphicon glyphicon-remove"></span>'+
            '</div>'
    );
    
    $('#'+tab_id).click(function() {
        // Переключаем вкладку
        $('.tabs .tab.active').not($(this)).removeClass('active').addClass('not-active');
        $(this).addClass('active').removeClass('not-active');
        // Переключаем рабочую область
        $('.mc .area:not(#'+tab_type+id+')').hide();
        $('#'+tab_type+id).show();
        $('#'+tab_type+id+' .msg-area').focus();
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
        var data_id = area_info.room_info.room_id;
        var area_id = 'room'+area_info.room_info.room_id;
        var area_class='area-room';
        var html_users = '<td class="users offset-right"></td>';
        var html_broadcast = '<div class="broadcast-area"><div class="broadcast"></div></div>';
        var offset_right = '<td class="offset-right"></td>';
    } else {
        var data_id = area_info.dialog_info.user_id;
        var area_id = 'dialog'+area_info.dialog_info.user_id;
        var area_class='area-dialog';
        var html_users = '';
        var html_broadcast = '<div class="broadcast-area"><div class="broadcast"></div></div>';
        var offset_right = ''
    }
    
    if (active) {
        var style_hide = '' 
        $('.mc .area').hide();
    } else {
        var style_hide = 'style="display:none;"';
    }
    $('.mc').append(
            '<tr id="'+area_id+'" class="area '+area_class+'" data-id="'+data_id+'" '+style_hide+'>'+
                '<td>'+
                    '<table class="chat">'+
                        '<tr>'+
                            '<td class="area2">'+
                                html_broadcast+
                                '<div class="messages-area"><div style="height:100%;right:20px;width:40%;position:absolute;"><div></div></div><div class="messages"></div></div>'+
                            '</td>'+
                        '</tr>'+
                        '<tr>'+
                            '<td class="input">'+
                                '<table>'+
                                    '<tr>'+
                                        '<td style="padding-left:1.429em;"><div class="resize-y" style="width:100%;">'+
                                            '<div style="height:100%;box-shadow:0 -0.6em 0 #fff;">'+
                                                '<div class="btn btn-default btn-smiles"><div>'+
                                                    '<span data-code="(:smile:)" class="smile"></span>'+
                                                    '<span data-code="(:wink:)" class="smile"></span>'+
                                                    '<span data-code="(:devil:)" class="smile"></span>'+
                                                    '<span data-code="(:coffe:)" class="smile"></span>'+
                                                    '<span data-code="(:happy:)" class="smile"></span>'+
                                                    '<span data-code="(:closed-eyes:)" class="smile"></span>'+
                                                    '<span data-code="(:surprise:)" class="smile"></span>'+
                                                    '<span data-code="(:cool:)" class="smile"></span>'+
                                                    '<span data-code="(:angry:)" class="smile"></span>'+
                                                    '<span data-code="(:shoot:)" class="smile"></span>'+
                                                    '<span data-code="(:sad:)" class="smile"></span>'+
                                                    '<span data-code="(:tongue:)" class="smile"></span>'+
                                                    '<span data-code="(:unclear:)" class="smile"></span>'+
                                                    '<span data-code="(:saint:)" class="smile"></span>'+
                                                    '<span data-code="(:nyasha:)" class="smile"></span>'+
                                                    '<span data-code="(:sleep:)" class="smile"></span>'+
                                                    '<span data-code="(:super:)" class="smile"></span>'+
                                                    '<span data-code="(:beer:)" class="smile"></span>'+
                                                    '<span data-code="(:cry:)" class="smile"></span>'+
                                                '</div></div>'+
                                                '<textarea class="form form-control msg-area"></textarea>'+
                                            '</div>'+
                                        '</td>'+
                                        '<td style="width:12em;padding-left:0.8em;padding-right:1.429em;">'+
                                            '<button type="button" class="btn btn-success send-btn">Отправить</button>'+
                                        '</td>'+
                                        offset_right+
                                    '</tr>'+
                                '</table>'+
                            '</td>'+
                        '</tr>'+
                    '</table>'+
                '</td>'+
                html_users+
            '</tr>'
    );
    
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

function addMessage(mode, to, message, scroll) {
    
    
    var my_message = (message.user_id == window.user_id) ? 'my-message' : '';
    
    if (to.to == 'room') {
        var message_id = 'r'+to.id+'m'+message.id;
        var area_id = 'room'+to.id;
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
    
    var caret_after = my_message ? '<span class="caret"></span>' : '';
    var caret_before = my_message ? '' : '<span class="caret after"></span>';
    $('#'+area_id+' .messages')[mode](
        '<div id="'+message_id+'" class="message '+my_message+'">'+
            '<div class="author-area">'+
                '<img class="avatar" src="'+message.user_avatar+'/img/1.jpg">'+
                '<button class="btn btn-user user'+message.user_id+' dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+caret_before+'<span class="user-name">'+message.user_name+'</span>'+caret_after+'</button>'+
            '</div>'+
            '<div class="separator"></div>'+
            '<div class="msg">'+message.message+'</div>'+
            '<div class="separator"></div>'+
        '</div>'
    );
    
    clickUser($('#'+message_id+' button'));
    
    if (scroll) {
        $messages.scrollTop($messages.prop("scrollHeight"));
    }
    
    if ($('#'+area_id).is(':hidden') || !scroll) {
         var $news = $('#tab'+area_id+' .news');
         if ($news.length) $news.html(parseInt($news.html())+1);
         else $('#tab'+area_id+' .x').before('<span class="news">1</span>');
    }
}

function addUser(room_id, user, sort) {
    
    $('#room'+room_id+' .users').append(
        '<button class="btn btn-user user'+user.user_id+' dropdown-toggle" data-user-id="'+user.user_id+'" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+
            '<span class="sex '+user.sex+'"></span>'+
            '<span class="user-name">'+user.user_name+'</span>'+
            '<span class="caret"></span>'+
        '</button>'
    );
    
    clickUser($('#room'+room_id+' .users .user'+user.user_id));
    
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
              '<li><a onclick="get_anketa('+user_id+')" href="#">Анкета</a></li>'+
              '<li><a href="#" onclick="addDialog({user_id:'+user_id+', user_name:\''+user_name+'\'}, 1)">Перейти в чат</a></li>'+
              '<li><a href="#">Игнорировать</a></li>'+
              '<li role="separator" class="divider"></li>'+
              '<li><a href="#">Пожаловаться</a></li>'+
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
}

function isScrolledToBottom($elm) {
    return $elm[0].scrollHeight - $elm.scrollTop() - $elm.outerHeight() < 1;
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
    $('.anketa'+data[0].user_id+' .contents .posts').prepend('<div class="walldate">'+posted+'</span>');
}

function get_anketa(user_id) {
    socket.send(JSON.stringify({
        act: 'anketa',
        user_id: user_id
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

function anketa(data) {
    window.wallarea_cnt = window.wallarea_cnt || 0;
    window.wallarea_cnt++;
    $('.broadcast:visible').prepend(
        '<div class="anketa anketa'+data.profile.id+'" data-uid="'+data.profile.id+'">'+
            '<div class="uname"><h1>'+data.profile.name+'</h1></div>'+
            '<div class="aa-icons m"><span class="glyphicon glyphicon-envelope"></span><span class="glyphicon glyphicon-plus"></span></div>'+
            '<div class="user-info">'+
            '<div class="avatar" style="background-image:url(/users/'+data.profile.id+'/avatar.gif)"></div><div class="profile-info"><span class="name">'+data.profile.fio+'</span><span class="val1">'+data.profile.datebirth+'</span><span class="val2">'+data.profile.city+'</span></div><div></div><div style="clear:both;"></div>'+
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