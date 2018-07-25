var header_color = $('.navbar').css("background-color");
if (typeof sqs_objects == 'undefined') {
    var sqs_objects = new Array;
}
sqs_objects['EditView_parent_name'] = {
    "form": "EditView",
    "method": "query",
    "modules": ["Contacts"],
    "group": "or",
    "field_list": ["name", "id"],
    "populate_list": ["parent_name", "parent_id", "client_name"],
    "required_list": ["parent_id"],
    "conditions": [{"name": "name", "op": "like_custom", "end": "%", "value": ""}],
    "order": "name",
    "limit": "30",
    "no_match_text": "\u041d\u0435 \u0432\u044b\u0431\u0440\u0430\u043d\u043e"
};
var disabledModules = [];

$(document).ready(function () {

    // var str = getCallForm('89788274903', '1');
    // $('body').append(str);
    // $('.window').draggable({containment: "body", handle: ".title"});
    // var x = $('body').width() - 600;
    // $('#popup_call_form').offset({top: 75, right: 75});

    // if (SUGAR.themes.theme_name == "SuiteR")
    $('.desktop-bar').find('#toolbar').before('<div id="phoneLink" style="top:3px;" class="dropdown nav navbar-nav navbar-right"><button class="phone_link btn btn-primary" data-toggle="dropdown" aria-expanded="false" style="top:5px; right:440px; z-index:100;" onclick="select_asterisk();"><img src="modules/Asterisk/img/asterisk_number.png"></img></button></div>');

    $('#search').on('mousedown', function (e) {
        if ($('#popup_form').length) {
            e.preventDefault();
            var link = 'index.php?action=UnifiedSearch&module=Home&search_form=false&advanced=false';
            link += '&query_string=' + $('#query_string').val();
            link += '&query_phone_string=' + $('#query_phone_string').val();
            link += '&query_code_string=' + $('#query_code_string').val();
            window.open(link);
        }
    });

    init_actions();

    window.outboundCall = function outboundCall(phone) {
        phone = phone.split("^|^");
        phone = phone[0];
        phone = phone.match(/\d/g);
        phone = phone.join(phone);
        localStorage['softphone'] = 1;
        localStorage['softphone_number'] = phone;
        if ($('#softphone_form').length > 0) {
            $('#softphone_form').find('.field').val(phone);
            search_contacts(phone);
        } else {
            localStorage['softphone'] = phone; // для переоткрытия
            show_softphone(phone);
        }
        ;
        return false;
    }

    window.show_inbound = function show_inbound(phone, id) {
        show_popup(phone, id);
        return false;
    }

    // Открытие софтфона
    if (localStorage['softphone'] == 1 && $(location)[0].href.indexOf('action=Popup') == -1) {
        show_softphone();
        $('#softphone_form').find('.asterisk_number').val(localStorage['softphone_number']);
    }

    var last_parent_id = (typeof $('#parent_id').val() !== 'undefined') ? $('#parent_id').val() : '';
    setInterval(function () {
        // // покрасить заголовок если звонок активен
        // if (oSipSessionCall){
        // 	if (!$('.navbar').hasClass("importanto")) $('.navbar').addClass("importanto");
        // } else {
        // 	if ($('.navbar').hasClass("importanto")) $('.navbar').removeClass("importanto");
        // };
        // if ( // отключиться если нету звонка на странице и страница неактивна
        // 	$('#asterisk_active_tab').val() == 0
        // 	&& !oSipSessionCall
        // ){
        // 	//sipUnRegister();
        // };
        // if ( // принять звонок если стоит флаг
        // 	localStorage['popup_accept'] > 0
        // ){
        // 	if (oSipSessionCall) {
        // 		if (oSipSessionCall.getId() == localStorage['popup_accept']){
        // 			console.log("accepting id " + localStorage['popup_accept']);
        // 			oSipSessionCall.accept(oConfigCall);
        // 			localStorage['popup_accept'] = 0;
        // 			localStorage['popup_buttons'] = "inbound_pause";
        // 		}
        // 	};
        // };
        // if ( // завершить звонок если стоит флаг
        // 	localStorage['popup_decline'] > 0
        // ){
        // 	if (oSipSessionCall) {
        // 		sipHangUp();
        // 		set_buttons('standby');
        // 		set_buttons('inbound_ended');
        // 		localStorage['popup_decline'] = 0;
        // 	}
        // };
        // if ( // завершить звонок если стоит флаг
        // 	localStorage['softphone'] > 0 && localStorage['softphone_buttons'] == "standby"
        // ){
        // 	if (oSipSessionCall) {
        // 		sipHangUp();
        // 		set_buttons('standby');
        // 		set_buttons('inbound_ended');
        // 	}
        // };
        // if ( // закрыть попап если закрыли
        // 	$('#popup_form').length &&
        // 	localStorage['popup'] == 0
        // ){
        // 	localStorage['popup_number'] = "";
        // 	localStorage['popup_buttons'] = "";
        // 	$('#popup_form').remove();
        // 	$('div.window.window-phone-book').remove();
        // };
        // if ( // закрыть софтфон если закрыли
        // 	$('#softphone_form').length &&
        // 	localStorage['softphone'] == 0
        // ){
        // 	localStorage['softphone'] = 0;
        // 	localStorage['softphone_number'] = "";
        // 	localStorage['softphone_buttons'] = "";
        // 	$('#softphone_form').remove();
        // 	$('div.window.window-phone-book').remove();
        // };
        // if ( // нарисовать попап если его нет на странице
        // 	$('#popup_form #inbound_number').val() != localStorage['popup_number']
        // ){
        // 	if(localStorage['popup'] && localStorage['popup_number']) show_popup(localStorage['popup_number'], localStorage['popup_id']);
        // 	if(localStorage['popup_buttons']) set_buttons(localStorage['popup_buttons']);
        // };
        // if ( // нарисовать софтфон если его нет на странице
        // 	!$('#softphone_form').length && localStorage['softphone'] > 0
        // ){
        // 	if(localStorage['softphone']) show_softphone();
        // 	if(localStorage['softphone_buttons']) set_buttons(localStorage['softphone_buttons']);
        // };

        // console.log(ctxSip.callActiveID);
        // console.log($('#save_call_form').attr('disabled'));
        // if (ctxSip.callActiveID !== null /*&& $('#popup_call_form')*/){
        //     //форма карточки звонка
        //     var str = getCallForm(number, '1');
        //     $('body').append(str);
        //     $('.window').draggable({containment: "body", handle: ".title"});
        //     var x = $('body').width() - 600;
        //     $('#popup_call_form').offset({top: 75, right: 75});
        //     $('#save_call_form').attr('disabled','disabled');
        // }

        // $("a").attr('target','_blank');
        // $("a").removeAttr('target');

        //если активного звонка нет и кнопка "Сохранить" на форме заблокирована, то активируем ее
        if ((ctxSip.callActiveID === null) && $('#save_call_form').attr('disabled') == 'disabled') {
            setTimeout(function () {
                $('#save_call_form').removeAttr('disabled');
                $('#save_call_form').removeAttr('title');
            }, 1000);
            // $('#save_call_form').removeAttr('title');
            // $("a").removeAttr('target');
        }
        //если есть активный звонок и кнопка "Сохранить" на форме не заблокирована, то блокируем ее
        //выпадашку "Статус" устанавливаем в "Состоялся"
        if ((ctxSip.callActiveID !== null) && $('#save_call_form').attr('disabled') != 'disabled') {
            $('#save_call_form').attr('disabled', 'disabled');
            $('#save_call_form').attr('title', 'Сохранение будет доступно после окончания звонка');
            $("#call_status option[value='Held']").prop('selected', true);
            // $("a").attr('target', '_blank');
        }

        //если открыта карточка звонка, то меняем кнопку открытия карточки в окошке софтфона, всем линкам добавляем атрибут _blank
        if ($('#popup_call_form').length && $('#softphone_form').length && $('#add-call').attr('display') !== 'none') {
            $('#add-call').hide();
            $('#remove-call').show();
            $('a[href^="index.php?"]').attr('target', '_blank');
        }

        //если закрыта карточка звонка, то меняем кнопку открытия карточки в окошке софтфона, у всех линков убираем атрибут _blank
        if (!$('#popup_call_form').length && $('#softphone_form').length && $('#remove-call').attr('display') !== 'none') {
            $('#add-call').show();
            $('#remove-call').hide();
            $('a[href^="index.php?"]').removeAttr('target');
        }

        //слушатель изменения релейт поля (срабатывает на изменение скрытого input с id)
        if ((typeof $('#popup_call_form input#parent_id').val() !== 'undefined') && $('#popup_call_form input#parent_id').val() !== last_parent_id) {
            // console.log('id changed');
            last_parent_id = $('#popup_call_form input#parent_id').val();
            $('#popup_call_form input#client_name').val($('#popup_call_form input#parent_name').val());
            // get_contact($('#parent_id').val());
        }

        if ( // обновить кнопки по статусу если попап есть на странице
        $('#popup_form #inbound_number').val() == localStorage['popup_number']
        ) {
            if (localStorage['popup_buttons'])
                if (!$('#softphone_form .pause-call').hasClass('unpausing'))
                    set_buttons(localStorage['popup_buttons']);
        }
        ;
        if ( // обновить кнопки по статусу если софтфон есть на странице
            $('#softphone_form').length
        ) {
            set_buttons(localStorage['softphone_buttons']);
        }
        ;
        if ( // redirect
        localStorage['popup_redirect'] > 0
        ) {
            redirect(localStorage['popup_redirect']);
        }
        ;
    }, 1000);
});

function init_actions() {
    // Действия кнопок

    // клавиатура
    $('body').on('click', '.keyboard-item', function () {
        var text = $('#softphone_form').find('.field').val();
        if ($(this).html() == "C") {
            text = text.substr(0, text.length - 1);
            $('#softphone_form').find('.field').val(text);
            return false;
        }
        ;
        if ($(this).html() == "+" && text.length > 0) {
            return false;
        }
        if (ctxSip.callActiveID) {
            var digit = $(this).html();
            if (!isNaN(digit)) ctxSip.sipSendDTMF(digit);
            var current_num = $('#softphone_form').find('.field').val();
            if (current_num.indexOf(" ") == -1) {
                $('#softphone_form').find('.field').val($('#softphone_form').find('.field').val() + " ");
            }
            ;
            $('#softphone_form').find('.field').val($('#softphone_form').find('.field').val() + $(this).html());
        } else {
            $('#softphone_form').find('.field').val($('#softphone_form').find('.field').val() + $(this).html());
            if ($('#softphone_form').find('.field').val().length > 9) search_contacts();
            localStorage['softphone_number'] = $('#softphone_form').find('.field').val();
        }
        ;
    });

    // redirect
    $('body').on('click', 'div.phone-list-item-code, div.phone-list-item-number', function () {
        var n = $(this).children().first().text();
        localStorage['popup_redirect'] = n;
        redirect(n);
    });

    // зеленая кнопка
    //$('#softphone_form li.actions-item .receive-call').live('click', function(){
    $('body').on('click', '#softphone_form li.actions-item .receive-call', function () {
        // var str = getCallForm('89788274903', '1');
        // $('body').append(str);
        // $('.window').draggable({containment: "body", handle: ".title"});
        // var x = $('body').width() - 600;
        // $('#popup_call_form').offset({top: 75, right: 75});

        // Если не было звонков, набрать номер из поля набора
        var number = $('#softphone_form').find('.field').val();
        if ((number !== null) && (number.length > 2)) {
            number = number.substr(-11);
            if (number.length == 11) number = number;
            if ($('#asterisk_role').length > 0) {
                ctxSip.sipCall($('#asterisk_role').val() + number);

                //форма карточки звонка
                var str = getCallForm(number);
                $('body').append(str);
                $('.window').draggable({containment: "body", handle: ".title"});
                var x = $('body').width() - 600;
                // $('#popup_call_form').offset({top: 75, right: 75});
                $('#popup_call_form').offset({
                    top: 100,
                    left: $('#softphone_form').position().left - $('#popup_call_form').width() - 20
                });
                // $('#save_call_form').attr('disabled','disabled');вернуть
                if ($('#popup_call_form').lenght > 0)
                    changeParentQS("parent_name");
            }
            else {
                ctxSip.sipCall(number);

                //форма карточки звонка
                // var str = getCallForm(number);
                // $('body').append(str);
                // $('.window').draggable({containment: "body", handle: ".title"});
                // var x = $('body').width() - 600;
                // // $('#popup_call_form').offset({top: 75, right: 75});
                // $('#popup_call_form').offset({top: 100, left: $('#softphone_form').position().left-$('#popup_call_form').width()-20});
                // // $('#save_call_form').attr('disabled','disabled');вернуть
            }
            localStorage['softphone'] = number;
            console.log("Call: " + number);
            set_buttons('outbound');
        } else yield_error(2);
    });

    //$('#popup_form li.actions-item .receive-call').live('click', function(){
    $('body').on('click', '#popup_form li.actions-item .receive-call', function () {
        if ($('.sip-logitem').data('sessionid')) {
            var s = ctxSip.Sessions[$('.sip-logitem').data('sessionid')];
            s.accept({
                media: {
                    stream: ctxSip.Stream,
                    constraints: {audio: true, video: false},
                    render: {
                        remote: document.getElementById('audioRemote')
                    },
                    RTCConstraints: {"optional": [{'DtlsSrtpKeyAgreement': 'true'}]}
                }
            });
            set_buttons('inbound_pause');
        } else {
            // Если не было звонков, ничего не делаем
            localStorage['popup_accept'] = localStorage['call_id'];
        }
    });

    // красная кнопка
    //$('#softphone_form li.actions-item .reset-call').live('click', function(){
    $('body').on('click', '#softphone_form li.actions-item .reset-call', function () {
        call_cancelled = true;
        stopTimer();
        ctxSip.sipHang();
        // if (ctxSip.callActiveID) ctxSip.sipHangUp(ctxSip.callActiveID);
        set_buttons('standby');
        localStorage['softphone_hold'] = "";
        // $('#save_call_form').removeAttr('disabled');
    });

    //$('#popup_form li.actions-item .reset-call').live('click', function(){
    $('body').on('click', '#popup_form li.actions-item .reset-call', function () {
        stopTimer();
        ctxSip.sipHang();
        // if (ctxSip.callActiveID) ctxSip.sipHangUp(ctxSip.callActiveID);
        set_buttons("inbound_ended");
        localStorage['popup_decline'] = localStorage['call_id'];
        // $('#save_call_form').removeAttr('disabled');
    });

    // синяя кнопка
    //$('li.actions-item .redirect-call').live('click', function(){
    $('body').on('click', 'li.actions-item .redirect-call', function () {
        set_buttons('redirect');
        localStorage['softphone_buttons'] = "redirect";
        show_redirect();
    });

    // желтая кнопка
    //$('#popup_form li.actions-item .pause-call').live('click', function(){
    $('body').on('click', '#popup_form li.actions-item .pause-call', function () {
        hold();
    });

    //$('#softphone_form li.actions-item .pause-call').live('click', function(){
    $('body').on('click', '#softphone_form li.actions-item .pause-call', function () {
        hold_outbound();
        localStorage['softphone_buttons'] = '';
    });

    // close
    //$('#softphone_form .close').live('click', function(){
    $('body').on('click', '#softphone_form .close', function () {
        if (ctxSip.callActiveID) ctxSip.sipHangUp(ctxSip.callActiveID);
        localStorage['softphone'] = 0;
        //localStorage['softphone_number'] = $('#softphone_form .field').val();
        localStorage['softphone_number'] = "";
        localStorage['softphone_buttons'] = "";
        $('#softphone_form').remove();
        $('div.window.window-phone-book').remove();
    });
    //$('#popup_form .close').live('click', function(){
    $('body').on('click', '#popup_form .close', function () {
        localStorage['popup'] = 0;
        localStorage['call_id'] = 0;
        localStorage['popup_number'] = "";
        localStorage['popup_buttons'] = "";
        if (ctxSip.callActiveID) ctxSip.sipHangUp(ctxSip.callActiveID);
        $('#popup_form').remove();
        $('div.window.window-phone-book').remove();
    });
    $('body').on('click', '#popup_call_form .close', function () {
        // localStorage['popup'] = 0;
        // localStorage['call_id'] = 0;
        // localStorage['popup_number'] = "";
        // localStorage['popup_buttons'] = "";
        // if (ctxSip.callActiveID) ctxSip.sipHangUp(ctxSip.callActiveID);
        $('#popup_call_form').remove();
        // $('div.window.window-phone-book').remove();
    });

    // minimize
    //$('#softphone_form .minimize').live('click', function () {
    $('body').on('click', '#softphone_form .minimize', function () {
        if ($('#softphone_form').hasClass('minzzz')) {
            $('#softphone_form').removeClass('minzzz');
            $('#softphone_form').position({
                my: "right top",
                at: "right bottom",
                of: "div.container-fluid:nth-child(1)"
            });
            $('#softphone_form .minimize').attr('title', 'Свернуть');
        } else {
            $('#softphone_form').addClass('minzzz');
            $('#softphone_form').removeAttr('style');
            $('#softphone_form .minimize').attr('title', 'Развернуть');
        }
    });
    //$('#popup_form .minimize').live('click', function () {
    $('body').on('click', '#popup_form .minimize', function () {
        if ($('#popup_form').hasClass('minzzz')) {
            $('#popup_form').removeClass('minzzz');
            $('#popup_form').position({my: "right top", at: "right bottom", of: "div.container-fluid:nth-child(1)"});
            $('#popup_form .minimize').attr('title', 'Свернуть');
        } else {
            $('#popup_form').addClass('minzzz');
            $('#popup_form').removeAttr('style');
            $('#popup_form .minimize').attr('title', 'Развернуть');
        }
    });
    //$('div.add-person').live('click', function() {
    $('body').on('click', '#popup_form div.add-person', function () {
        var number = $('#popup_form #inbound_number').text();
        var url = "index.php?module=" + $(this).attr('value') + "&action=EditView&phone_mobile=" + number;
        if ($(this).attr('value') == "Accounts") url = "index.php?module=" + $(this).attr('value') + "&action=EditView&phone_office=" + number;
        window.open(url, '_blank');
    });
    $('body').on('click', '#softphone_form div.add-person', function () {
        var number = $('#softphone_form .field').val();
        var url = "index.php?module=" + $(this).attr('value') + "&action=EditView&phone_mobile=" + number;
        if ($(this).attr('value') == "Accounts") url = "index.php?module=" + $(this).attr('value') + "&action=EditView&phone_office=" + number;
        window.open(url, '_blank');
    });
    // editview redirect
    $("body").on("keydown", ".field", function (event) {
        if (event.which == 13) {
            event.preventDefault();
        }
        ;
    });
    $("body").on("keypress", ".field", function (event) {
        if (event.which == 13) {
            event.preventDefault();
        }
        ;
    });
    $("body").on("keyup", ".field", function (event) {
        if (event.which == 13) {
            var number = $(".field").val();
            ctxSip.sipCall(number);
            localStorage['softphone'] = number;
            console.log("Call: " + number);
            if (number.length == 6) {
                // определять городской
                search_contacts();
            }
            ;
            set_buttons('outbound');
            event.preventDefault();
        }
        ;
    });

    //открытие формы звонка
    $('body').on('click', '#softphone_form div.add-call', function (event) {
        // getCallForm(localStorage['softphone_number']));
        var number = $('input[name=tel]').val();
        if (number != "") {
            var str = getCallForm(number);
            $('body').append(str);
            $('.window').draggable({containment: "body", handle: ".title"});
            var x = $('body').width() - 600;
            $('#popup_call_form').offset({
                top: 100,
                left: $('#softphone_form').position().left - $('#popup_call_form').width() - 20
            });
            if (location.href.indexOf('action=DetailView')) {
                get_call_history(number);
                get_contact(number);
            }
            if ($('#popup_call_form').lenght > 0)
                changeParentQS("parent_name");
        }
    });

    //скрыть форму звонка
    $('body').on('click', '#softphone_form div.remove-call', function (event) {
        // getCallForm(localStorage['softphone_number']));
        if ($('#popup_call_form').length) {
            $('#popup_call_form').remove();
        }
    });

    //октрыть форму звонка(входящий)
    $('body').on('click', '#popup_form div.add-call', function (event) {
        // getCallForm(localStorage['softphone_number']));
        // if ($('#inbound_number').val() != "") {
        var str = getCallForm($('#inbound_number').html());
        $('body').append(str);
        $('.window').draggable({containment: "body", handle: ".title"});
        var x = $('body').width() - 600;
        $('#popup_call_form').offset({
            top: 100,
            left: $('#popup_form').position().left - $('#popup_call_form').width() - 20
        });
        if ($('#popup_call_form').lenght > 0)
            changeParentQS("parent_name");
        // }
    });
    //скрыть форму звонка(входящий)
    $('body').on('click', '#popup_form div.remove-call', function (event) {
        // getCallForm(localStorage['softphone_number']));
        if ($('#popup_call_form').length) {
            $('#popup_call_form').remove();
        }
    });

    $('body').on('change', '#parent_type', function () {
        $('#popup_call_form #parent_name').val("");
        $('#popup_call_form #parent_id').val("");
        changeParentQS("parent_name");
        checkParentType($('#popup_call_form #parent_type').val(), $('#popup_call_form #btn_parent_name'));
    });

    $('body').on('click', '#btn_parent_name', function () {
        open_popup($('#popup_call_form #parent_type').val(), 600, 400, "", true, false, {
            "call_back_function": "set_return",
            "form_name": "call_form",
            "field_to_name_array": {"id": "parent_id", "name": "parent_name"}
        }, "single", true);
    });

    //кнопка "Сохранить" формы звонка
    $('body').on('submit', '#popup_call_form', function (e) {
        // alert('imhere');
        e.preventDefault();
        sendform();
        if ($('#popup_call_form').length) {
            $('#popup_call_form').remove();
        }
    });

    // $('body').on('click', '#btn_parent_name', function (event) {
    //     // getCallForm(localStorage['softphone_number']));
    //     open_popup(
    //         "Contacts",
    //         600,
    //         400,
    //         "",
    //         true,
    //         false,
    //         {
    //             "call_back_function": "set_return",
    //             "form_name": "EditView",
    //             "field_to_name_array": {
    //                 "id": "contact_id",
    //                 "name": "contact_name",
    //                 "billing_address_street": "primary_address_street",
    //                 "billing_address_city": "primary_address_city",
    //                 "billing_address_state": "primary_address_state",
    //                 "billing_address_postalcode": "primary_address_postalcode",
    //                 "billing_address_country": "primary_address_country",
    //                 "phone_office": "phone_work"
    //             }
    //         },
    //         "single",
    //         true
    //     );
    // });
}

function hold() {
    //if hasclass active removeclass active else addclass active
    if ($('#popup_form .pause-call').hasClass('active')) {
        localStorage['popup_buttons'] = "inbound_pause_unpausing";
        $('#popup_form .pause-call').removeClass('active');
        $('#popup_form .pause-call').addClass('unpausing');
        oSipSessionCall.resume();
    } else {
        oSipSessionCall.hold();
        localStorage['popup_buttons'] = "inbound_pause_active";
        $('li.actions-item .pause-call').addClass('active');
    }
}

function hold_outbound() {
    //if hasclass active removeclass active else addclass active
    if ($('#softphone_form .pause-call').hasClass('active')) {
        oSipSessionCall.resume();
        $('#softphone_form .pause-call').removeClass('active');
        $('#softphone_form .pause-call').addClass('unpausing');
        set_buttons('outbound_pause_unpausing');
        localStorage['softphone_buttons'] = 'outbound_pause_unpausing';
        $('#softphone_form .pause-call').removeClass('active');
        $('#softphone_form .pause-call').addClass('unpausing');
    } else {
        //hold
        oSipSessionCall.hold();
        $('#softphone_form .pause-call').addClass('active');
        set_buttons("outbound_pause_active");
    }
}

function close_popups(timeout = 500) {
    var func = function () {
        $('#softphone_form .close').click();
        $('#popup_form .close').click();
    };
    setTimeout(func, timeout);
}

function yield_error(round) {
    var first_color = $('#softphone_form').find('.field').css('border-color');
    $('#softphone_form').find('.field').css('border-color', 'red');
    setTimeout(function () {
        $('#softphone_form').find('.field').css('border-color', first_color);
        if (round == 2) setTimeout(function () {
            yield_error(1)
        }, 350);
    }, 500);
}

function set_buttons(type) {
    if (type == "outbound") { //console.log("outbound");
        localStorage['softphone_buttons'] = "outbound";
        $('#softphone_form ul.actions').html('<li class="actions-item"><a class="actions-item-link reset-call" href="#" title="Сбросить вызов"></a></li><li class="actions-item"><a class="actions-item-link redirect-call" href="#" title="Переадресовать вызов"></a></li>');
        $('div.window.window-phone-book').remove();
    }
    ;
    if (type == "outbound_pause_active") { //console.log("pause");
        localStorage['softphone_buttons'] = "outbound_pause_active";
        $('#softphone_form ul.actions').html('<li class="actions-item"><a class="actions-item-link reset-call" href="#" title="Сбросить вызов"></a></li><li class="actions-item"><a class="actions-item-link redirect-call" href="#" title="Переадресовать вызов"></a></li>');
        //$('#softphone_form ul.actions').html('<li class="actions-item"><a class="actions-item-link reset-call" href="#" title="Сбросить вызов"></a></li><li class="actions-item"><a class="actions-item-link redirect-call" href="#" title="Переадресовать вызов"></a></li>');
        $('div.window.window-phone-book').remove();
    }
    ;
    if (type == "outbound_pause_unpausing") { //console.log("unpausing");
        localStorage['softphone_buttons'] = "outbound_pause_unpausing";
        $('#softphone_form ul.actions').html('<li class="actions-item"><a class="actions-item-link reset-call" href="#" title="Сбросить вызов"></a></li><li class="actions-item"><a class="actions-item-link redirect-call" href="#" title="Переадресовать вызов"></a></li>');
        //$('#softphone_form ul.actions').html('<li class="actions-item"><a class="actions-item-link reset-call" href="#" title="Сбросить вызов"></a></li><li class="actions-item"><a class="actions-item-link redirect-call" href="#" title="Переадресовать вызов"></a></li>');
        $('div.window.window-phone-book').remove();
    }
    ;
    if (type == "standby") { //console.log("standby");
        localStorage['softphone_buttons'] = "standby";
        $('#softphone_form ul.actions').html('<li class="actions-item"><a class="actions-item-link receive-call" href="#" title="Сделать вызов"></a></li>');
        $('div.window.window-phone-book').remove();
    }
    ;
    if (type == "redirect") {
        localStorage['softphone_buttons'] = "redirect";
        $('#softphone_form ul.actions').html('<li class="actions-item"><a class="actions-item-link reset-call" href="#" title="Сбросить вызов"></a></li><li class="actions-item"><a class="actions-item-link redirect-call active" href="#" title="Переадресовать вызов"></a></li>');
    }
    ;
    if (type == "inbound") {
        localStorage['popup_buttons'] = "inbound";
        $('#popup_form ul.actions').html('<li class="actions-item"><a class="actions-item-link receive-call" href="#" title="Принять вызов"></a></li> <li class="actions-item"><a class="actions-item-link reset-call" href="#" title="Сбросить вызов"></a></li> <li class="actions-item"><a class="actions-item-link redirect-call" href="#" title="Переадресовать вызов"></a></li>');
        //$('div.window.window-phone-book').remove();
    }
    if (type == "inbound_ended") {
        localStorage['popup_buttons'] = "inbound_ended";
        $('#popup_form ul.actions').html('<li class="actions-item"><a class="actions-item-link receive-call active" href="#" title="Принять вызов"></a></li> <li class="actions-item"><a class="actions-item-link reset-call" href="#" title="Сбросить вызов"></a></li> <li class="actions-item"><a class="actions-item-link redirect-call" href="#" title="Переадресовать вызов"></a></li>');
        //$('div.window.window-phone-book').remove();
    }
    if (type == "inbound_pause") {
        localStorage['popup_buttons'] = "inbound_pause";
        $('#popup_form ul.actions').html('<li class="actions-item"><a class="actions-item-link reset-call" href="#" title="Сбросить вызов"></a></li> <li class="actions-item"><a class="actions-item-link redirect-call" href="#" title="Переадресовать вызов"></a></li>');
        //$('div.window.window-phone-book').remove();
    }
    if (type == "inbound_pause_unpausing") {
        localStorage['popup_buttons'] = "inbound_pause_unpausing";
        $('#popup_form ul.actions').html('<li class="actions-item"><a class="actions-item-link reset-call" href="#" title="Сбросить вызов"></a></li> <li class="actions-item"><a class="actions-item-link redirect-call" href="#" title="Переадресовать вызов"></a></li>');
        //$('div.window.window-phone-book').remove();
    }
    if (type == "inbound_pause_active") {
        localStorage['popup_buttons'] = "inbound_pause_active";
        $('#popup_form ul.actions').html('<li class="actions-item"><a class="actions-item-link reset-call" href="#" title="Сбросить вызов"></a></li> <li class="actions-item"><a class="actions-item-link redirect-call" href="#" title="Переадресовать вызов"></a></li>');
        //$('div.window.window-phone-book').remove();
    }
    if (type == "inbound_redirect") {
        localStorage['popup_buttons'] = "inbound_redirect";
        $('#popup_form ul.actions').html('<li class="actions-item"><a class="actions-item-link receive-call" href="#" title="Принять вызов"></a></li> <li class="actions-item"><a class="actions-item-link reset-call" href="#" title="Сбросить вызов"></a></li> <li class="actions-item"><a class="actions-item-link redirect-call active" href="#" title="Переадресовать вызов"></a></li>');
    }

    if (type == "ended") {
        set_buttons("standby");
        set_buttons("inbound_ended");
    }
}

// Собираем всплывающую форму:
function getOutboundForm(phone = '') {
    var form = '';
    if (localStorage['softphone_number'] > 1) phone = localStorage['softphone_number'];
    // form += getCallForm('89788274903');
    form += '<div class="window" id="softphone_form" data-id="" style="display: table-row">';
    form += '	<div class="title">Исходящий вызов</div><div id="stopwatch" value="0">00:00</div>';
    form += '		<form class="form" action="#" method="post">';
    //form += ' <script>setTimeout(check_autodial, 500);</script>';
    form += '			<input class="field" type="tel" autocorrect="off" autocomplete="tel" name="tel" placeholder="Номер клиента" value="' + phone + '" />';
    //form += '			<div class="person-replacer"><div class="add-person">Создать физ. лицо</div></div>';
    form += '		<div class="add-call" id="add-call" value="Contacts">Открыть карточку звонка</div>';
    form += '		<div class="remove-call" id="remove-call" value="Contacts" style="display: none;">Скрыть карточку звонка</div>';
    // form += '		<div class="add-person" value="Contacts">Создать контакт</div>';
    //form += '		<div class="add-person" value="Accounts">Создать контрагент</div>';
    //form += '		<div class="add-person" value="Leads">Создать предв.контакт</div>';
    form += '				<ul class="keyboard">';
    form += '				<li class="keyboard-item">1</li>';
    form += '				<li class="keyboard-item">2</li>';
    form += '				<li class="keyboard-item">3</li>';
    form += '				<li class="keyboard-item">4</li>';
    form += '				<li class="keyboard-item">5</li>';
    form += '				<li class="keyboard-item">6</li>';
    form += '				<li class="keyboard-item">7</li>';
    form += '				<li class="keyboard-item">8</li>';
    form += '				<li class="keyboard-item">9</li>';
    form += '				<li class="keyboard-item">+</li>';
    form += '				<li class="keyboard-item">0</li>';
    form += '				<li class="keyboard-item">C</li>';
    form += '			</ul>';
    form += '			<ul class="actions">';
    form += '				<li class="actions-item">';
    form += '					<a class="actions-item-link receive-call" href="#" title="Сделать вызов"></a>';
    form += '				</li>';
    form += '			</ul>';
    form += '		</form>';
    form += '	<div class="close" title="Закрыть"></div>';
    form += '	<div class="minimize" title="Свернуть"></div>';
    form += '</div>';
    // $('body').append(str);
    // $('.window').draggable({containment: "body", handle: ".title"});
    // var x = $('body').width() - 600;
    // $('#popup_call_form').offset({top: 75, right: 75});
    return form;
}

//форма карточки звонка
function getCallForm(number) {
    var form = '';
    form += '<div class="window" id="popup_call_form" style="font-size: 11pt; height:525px; width:600px; position:fixed;right:20px;top:100px;"><!--заменить id-->';
    form += '    <div class="row" style="display: table-row"><div class="title cell">Звонок&nbsp;</div><!--Данные о звонящем, номер телефона?-->';
    form += '       <div id="inbound_number" class="cell" value="' + number + '"><b>' + number + '</b></div>';
    form += '    </div>    ';
    // form += '    <div class="person-replacer">';
    // form += '        <div class="add-person" value="Contacts">Создать контакт</div>';
    // form += '        <div class="add-person" value="Accounts">Создать контрагента</div>';
    // form += '    </div>';

    form += '	 <form name="call_form" class="call_form" action="" method="post">';
    form += '       <div class="row" style="display: table-row">';
    form += '           <div class="cell" style="display: table-cell">';
    form += '               Тема';
    form += '           </div>';
    form += '           <div class="cell" style="display: table-cell">';
    form += '               <input type="text" name="name" id="name" value="">';
    form += '           </div>';
    // form += '       </div>';
    // form += '       <div class="row" style="display: table-row">';
    form += '           <div class="cell" style="display: table-cell">';
    form += '               Статус';
    form += '           </div>';
    form += '           <div class="cell" style="display: table-cell">';
    form += '               <select  id="call_status" name="status">';
    // form += '                   <option  value="" disabled selected></option>';
    form += '                   <option  value="Planned">Запланирован</option>';
    form += '                   <option  value="Held">Состоялся</option>';
    form += '                   <option  value="Not Held">Не состоялся</option>';
    // form += '                   <option  value="call_status4">Статус4</option>';
    form += '               </select  id="call_status">';
    form += '           </div>';
    form += '       </div>';
    form += '       <div class="row" style="display: table-row">';
    form += '           <div class="cell" style="display: table-cell">';
    form += '               ФИО клиента';
    form += '           </div>';
    form += '           <div class="cell" style="display: table-cell">';
    form += '               <input type="text" name="client_name" id="client_name">';
    form += '           </div>';
    form += '           <div class="cell" style="display: table-cell">';
    form += '               Телефон клиента';
    form += '           </div>';
    form += '           <div class="cell" style="display: table-cell">';
    form += '               <input type="text" name="client_phone" id="client_phone" value="' + number + '">';
    form += '           </div>';
    form += '       </div>';
    form += '       <div class="row" style="display: table-row">';
    form += '           <div class="cell" style="display: table-cell">';
    form += '               Относится к';
    form += '           </div>';
    form += '           <div class="cell" style="display: table-cell">';
    // выпадающий список доступных модулей для связывания скрыт
    form += '           <div class="col-xs-12 col-sm-8 edit-view-field  yui-ac colspan" type="parent" field="parent_name">\n' +
        '               <select name="parent_type" tabindex="0" id="parent_type" title="" style="display:none;">\n' +
        '                   <option label="Контрагенты" value="Accounts">Контрагенты</option>\n' +
        '                   <option label="Контакты" value="Contacts" selected="selected">Контакты</option>\n' +
        '               </select>\n' +
        '               <input name="parent_name" id="parent_name" class="sqsEnabled yui-ac-input" tabindex="0" size="" value="" autocomplete="off" type="text"><div id="EditView_parent_name_results" class="yui-ac-container"><div class="yui-ac-content" style="display: none;"><div class="yui-ac-hd" style="display: none;"></div><div class="yui-ac-bd"><ul><li style="display: none;"></li><li style="display: none;"></li><li style="display: none;"></li><li style="display: none;"></li><li style="display: none;"></li><li style="display: none;"></li><li style="display: none;"></li><li style="display: none;"></li><li style="display: none;"></li><li style="display: none;"></li></ul></div><div class="yui-ac-ft" style="display: none;"></div></div></div><input name="parent_id" id="parent_id" value="" type="hidden">\n' +
        '               <span class="id-ff multiple">\n' +
        '                   <button type="button" name="btn_parent_name" id="btn_parent_name" tabindex="0" title="Выбрать" class="button firstChild" value="Выбрать" ><span class="suitepicon suitepicon-action-select"></span></button><button type="button" name="btn_clr_parent_name" id="btn_clr_parent_name" tabindex="0" title="" class="button lastChild" onclick="this.form.parent_name.value = \'\'; this.form.parent_id.value = \'\';" value=""><span class="suitepicon suitepicon-action-clear"></span></button>\n' +
        '               </span>\n' +
        '           </div>';
    form += '           </div>';
    // form += '           <div class="cell" style="display: table-cell">';
    // form += '               Описание';
    // form += '           </div>';
    // form += '           <div class="cell" style="display: table-cell">';
    // form += '              <textarea name="description" id="description" cols="30" rows="5"></textarea>';
    // form += '           </div>';
    form += '       </div>';
    form += '       <div class="row" style="display: table-row">';
    form += '           <div class="cell" style="display: table-cell">';
    form += '               Описание';
    form += '           </div>';
    form += '           <div class="cell" style="display: table-cell">';
    form += '              <textarea name="description" id="description" cols="30" rows="3" style="width: 200%;"></textarea>';
    form += '           </div>';
    form += '       </div>';
    form += '       <input id="save_call_form" type="submit" value="Сохранить">';
    form += '	 </form>';
    form += '    <br>';
    form += '    <b>История звонков</b>';
    // form += '    <table border="1" cellpadding="0" cellspacing="0" id="call_history" width="100%">';
    // form += '        <tr>';
    // form += '            <th>ФИО</th>';
    // form += '            <th>Статус</th>';
    // form += '            <th>Дата</th>';
    // form += '            <th>Входящий/Исходящий</th>';
    // // form += '            <th>Дополнительно</th>';
    // form += '        </tr>';
    form += '    <table border="1" cellpadding="0" cellspacing="0" id="call_history" width="100%">';
    if (typeof number !== 'undefined') {
        if (!location.href.indexOf('action=DetailView')) {
            get_call_history(number);
        }
        // if (calls.length > 0) {
        //     form += '    <table border="1" cellpadding="0" cellspacing="0" id="call_history" width="100%">';
        //     form += '        <tr>';
        //     form += '            <th>Относится к</th>';
        //     form += '            <th>Статус</th>';
        //     form += '            <th>Дата</th>';
        //     form += '            <th>Входящий/Исходящий</th>';
        //     // form += '            <th>Дополнительно</th>';
        //     form += '        </tr>';
        //     calls.forEach(function (elem) {
        //         var status = translateCallStatus(elem.status);
        //         var direction = (elem.direction == 'Outbound') ? 'Исходящий' : (elem.direction == 'Inbound') ? 'Входящий' : '-';
        //         form += '        <tr>';
        //         form += '            <td>' + ((typeof elem.parent_name === 'undefined') ? '<i>Нет данных</i>' : elem.parent_name) + '</td>';
        //         form += '            <td>' + status + '</td>';
        //         form += '            <td>' + elem.date_modified + '</td>';
        //         form += '            <td>' + direction + '</td>';
        //         // form += '            <td>' + description + '</td>';
        //         form += '        </tr>';
        //     });
        // }
        // else {
        //     // form += '        <tr>';
        //     // form += '            <td colspan="4" align="center"><i>Нет данных</i></td>';
        //     // form += '        </tr>';
        //     form += '<br><i>Нет данных</i>'
        // }
    }
    else {
        form += '        <tr>';
        form += '           <td cospan="4" style="text-align: center"><i>Нет данных</i></td>';
        form += '        </tr>';
    }
// console.log(calls[0]['id']);
    form += '    </table>';
    form += '	<div class="close" title="Закрыть"></div>';
// form += '	<div class="minimize_call_form" title="Свернуть"></div>';
    form += '</div>\n';

    if (!location.href.indexOf('action=DetailView')) {
        get_contact(number);
    }

    return form;
}

function getInboundForm(number, id) {
    var form = '';

    form += '<div class="window" id="popup_form" data-id="' + id + '">';
    //form += '<input type="hidden" id="inbound_number" value="' + number + '"></input>';
    form += '	<div class="title">Входящий вызов</div><div id="stopwatch" value="0">00:00</div>';
    //form += '<input id="inbound_number" value="' + number + '" disabled="true"></input>';
    form += '<div id="inbound_number" value="' + number + '">' + number + '</div>';
    form += '		<div class="add-call" id="add-call" value="Contacts">Открыть карточку звонка</div>';
    form += '		<div class="remove-call" id="remove-call" value="Contacts" style="display: none;">Скрыть карточку звонка</div>';
    // form += '	<div class="person-replacer">';
    // form += '		<div class="add-person" value="Contacts">Создать контакт</div>';
    //form += '		<div class="add-person" value="Accounts">Создать контрагент</div>';
    //form += '		<div class="add-person" value="Leads">Создать предв.контакт</div>';
    // form += '	</div>';
    form += '		<ul class="actions">';
    form += '			<li class="actions-item">';
    form += '				<a class="actions-item-link receive-call" href="#" title="Принять вызов"></a>';
    form += '			</li>';
    form += '			<li class="actions-item">';
    form += '				<a class="actions-item-link reset-call" href="#" title="Сбросить вызов"></a>';
    form += '			</li>';
    form += '			<li class="actions-item">';
    form += '				<a class="actions-item-link redirect-call" href="#" title="Переадресовать вызов"></a>';
    form += '			</li>';
    //form += '			<li class="actions-item">';
    //form += '				<a class="actions-item-link pause-call" href="#" title="Удерживать вызов"></a>';
    //form += '			</li>';
    form += '		</ul>';
    // form += '	<div class="lists">';
    // form += '		<div class="orders-list-wrapper">';
    // form += '			<div class="orders-count js-count">Кредиты</div>';
    // form += '				<ul class="orders-list js-scrollpane">';
    // // orders-list-item//
    // form += '				</ul>';
    // form += '			</div>';
    // form += '		<div hidden class="objects-list-wrapper">';
    // form += '		<div class="objects-count js-count">Обращения</div>';
    // form += '			<ul class="objects-list js-scrollpane">';
    // // objects-list-item//
    // form += '			</ul>';
    // form += '		</div>';
    // form += '	</div>';
    form += '	<div class="close" title="Закрыть"></div>';
    form += '	<div class="minimize" title="Свернуть"></div>';
    form += '</div>';

    return form;
}

function select_asterisk() {
    if ($('#softphone_form').length > 0) {
        localStorage['softphone'] = 0; // чтобы не открывалось
        localStorage['softphone_number'] = $('#softphone_form').find('.field').val();
        $('#softphone_form').remove();
    } else {
        localStorage['softphone'] = 1; // для переоткрытия
        show_softphone();
    }
    ;

}

function show_softphone(phone = '') {
    var str = getOutboundForm(phone);
    $('body').append(str);
    $('.window').draggable({containment: "body", handle: ".title"});
    //$('#softphone_form').position({my: "right top", at: "right top", of: "#contentTable"});
    var x = $('body').width() - 350;
    $('#softphone_form').offset({top: 100, left: x});
    // $('#popup_call_form').offset({top: 100, left: x-$('#popup_call_form').width()-20});
    if (localStorage['softphone_number'].length > 9) search_contacts(localStorage['softphone_number']);
}

function show_popup(number, id) {
    // проверяем если это возврат исходящего звонка из паузы
    if ($("#softphone_form").length && $('#softphone_form .pause-call').hasClass('unpausing')) {
        $('#softphone_form .pause-call').removeClass('unpausing');
        oSipSessionCall.accept(oConfigCall);
        // replace call id
        $('#softphone_form').attr("data-id", id);
        set_buttons("outbound");
        localStorage['softphone_buttons'] = "outbound";
        return false;
    }
    ;


    localStorage['popup'] = 1;
    localStorage['popup_number'] = number;
    // проверяем если это возврат входящего звонка из паузы
    if ($("#popup_form").length && $('#popup_form .pause-call').hasClass('unpausing')) {
        $('#popup_form .pause-call').removeClass('unpausing');
        //set_buttons("inbound_pause");
        if (oSipSessionCall.accept(oConfigCall)) {
            set_buttons("inbound_pause");
            // replace call id
            $('#popup_form').attr("data-id", id);
        }
    } else if ($("#softphone_form").length && $('#softphone_form .pause-call').hasClass('unpausing')) {
        $('#softphone_form .pause-call').removeClass('unpausing');
        set_buttons("outbound");
        oSipSessionCall.accept(oConfigCall);
        // replace call id
        $('#popup_form').attr("data-id", id);
    } else {
        //if ($('#popup_form').length) $('#popup_form').remove();
        if ($('#inbound_number').text() != number) {
            $('#inbound_number').val(number);
            $('#inbound_number').text(number);
            search_contacts(number);
        }
        if (!$('#popup_form').length) {
            var str = getInboundForm(number, id);
            $('body').append(str);
            $('.window').draggable({containment: "body", handle: ".title"});
            //$('#popup_form').position({my: "right top", at: "right bottom", of: "div.container-fluid:nth-child(1)"});
            var x = $('body').width() - 350;
            $('#popup_form').offset({top: 100, left: x});
            search_contacts(number);
        }
        //if ($('#asterisk_active_tab').val() == 0) alert("Входящий звонок");
        //search_filial(number);
    }
}

function show_redirect() {
    if (!$('div.window.window-phone-book').length) {
        $.ajax({
            url: 'index.php?module=Asterisk&action=getredirectlist&to_pdf=true',
            dataType: 'text',
            type: 'POST',
            data: {},
            success: function (data) {
                var form = '<div class="window window-phone-book window-without-logo"><div class="title">Телефонная книга</div><div class="phone-book-wrapper js-scrollpane">';
                form += data;
                //form += '</div><div class="close" title="Закрыть"></div></div>';
                form += '</div></div>';
                $('body').append(form);
                $('div.window.window-phone-book').draggable({containment: "body", handle: ".title"});
                if ($('#popup_call_form').length > 0) {
                    $('div.window.window-phone-book').position({my: "left bottom", at: "left bottom", of: ".window"});
                }
                else {
                    $('div.window.window-phone-book').position({my: "right up", at: "left up", of: ".window"});
                }
                ScrollPane();
                //set_buttons('inbound_redirect');
                $('li.actions-item .redirect-call').addClass('active');
            }
        });
    } else {
        set_buttons('outbound');
        //set_buttons('inbound');
        $('li.actions-item .redirect-call').removeClass('active');
        $('div.window.window-phone-book').remove();
    }
}

function redirect(number) {
    console.warn("trying to redirect to " + number);
    if (ctxSip.callActiveID) {
        if (localStorage['popup_redirect'] > 0) {
            var s_destination = number;
            //if (!tsk_string_is_null_or_empty(s_destination)) {
            ctxSip.sipTransfer(number, ctxSip.callActiveID);
            localStorage['popup_redirect'] = 0;
            console.info('<i>Transfering the call...</i>');
            //}
        } else {
            console.info('Popup redirect <= 0');
        }
    } else {
        console.info('No call');
        localStorage['popup_redirect'] = number;
    }
}

// mozRTCPeerConnection.prototype.removeStream = function(stream) {
//   this.getSenders().forEach(sender =>
//       stream.getTracks().includes(sender.track) && this.removeTrack(sender));
// }

function search_contacts(number) {
    var link = "index.php?module=Asterisk&action=search_contacts&to_pdf=true";
    var operator = $('#user_asterisk_extension').val();
    console.log("searching for number " + number + " for operator " + operator);
    $.ajax({
        url: link,
        dataType: 'text',
        type: 'POST',
        data: {
            'number': number,
            'operator': operator
        },
        success: function (data) {
            var contact = data.split("^");
            if (contact.length > 1 && data.length > 5) {
                // contacts or accounts
                if (contact[0] == "contacts") {
                    var temp = '<div class="person"><span>Контакт</span> <a class="person-link" target="_blank" href="';
                    temp += 'index.php?module=Contacts&action=DetailView&record=' + contact[1];
                    temp += '">';
                    temp += contact[2] + " " + contact[3];
                    temp += '</a>';
                    temp += '</div>';
                    $('div.window .person-replacer').html(temp);
                    get_item_list(contact[1]);
                }
                ;
                if (contact[0] == "accounts") {
                    // var temp = '<div class="person"><span>Контрагент</span> <a class="person-link" target="_blank" href="';
                    // temp += 'index.php?module=Accounts&action=DetailView&record=' + contact[1];
                    // temp += '">';
                    // temp += contact[2];
                    // temp += '</a></div>';
                    // $('div.window .person-replacer').html(temp);
                    //get_item_list(contact[1]);
                }
                ;
                if (contact[0] == "leads") {
                    var temp = '<div class="person"><span>Предв.контакт</span> <a class="person-link" target="_blank" href="';
                    temp += 'index.php?module=Leads&action=DetailView&record=' + contact[1];
                    temp += '">';
                    temp += contact[2];
                    temp += '</a>';
                    temp += '</div>';
                    $('div.window .person-replacer').html(temp);
                    //get_item_list(contact[1]);
                }
                ;
            }
            ;
            if (contact.length == 2) {
                var temp = '<div class="person"><div class="add-person" value="Leads">Создать контакт</div><br>';
                temp += '</div>';
                $('div.window .person-replacer').html(temp);
            }
            ;
        }
    });
}

function show_phones(id) {
    $.ajax({
        url: 'index.php?module=Contacts&action=pop_dropdown&to_pdf=true&id=' + id,
        dataType: 'html',
        type: 'post',
        success: function (data) {
            localStorage['softphone'] = 1;
            show_softphone();
            $('.field').replaceWith(data);
            //$('body').append(data);
            //$('#contact_'+id).dialog({
            //	resizable: false,
            //	//position: {of: '#contact_id'},
            //	show: {effect: 'fade', direction: 'down'},
            //	close: function(event, ui)
            //	{
            //		var dialogBlock = $('#contact_' + id).parents('div.ui-dialog');
            //		$(dialogBlock).remove();
            //		$('#contact_' + id).remove();
            //	}
            //});
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.status);
            alert(thrownError);
        }
    });
}

function get_item_list(id) {
    $.ajax({
        url: 'index.php?module=Asterisk&action=get_item_list&to_pdf=true&id=' + id,
        dataType: 'html',
        type: 'post',
        success: function (data) {
            var x = data.split("^|^");
            $('#popup_form .orders-list').html(x[0]);
            $('#popup_form .objects-list').html(x[1]);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.status);
            alert(thrownError);
        }
    });
}

function startTimer(time) {
    if (!$('#stopwatch').attr("data-stopwatch")) {
        // проверить активность таймера
        time = time || 0;
        $('#stopwatch').val(time);
        var r = setInterval(function () {
            var t = $('#stopwatch').val();
            t = parseInt(t) + 1;
            var s = ("0" + (t % 60)).slice(-2);
            var m = ("0" + (Math.floor(t / 60))).slice(-2);
            $('#stopwatch').text(m + ":" + s);
            $('#stopwatch').val(t);
        }, 1000);
        $('#stopwatch').attr("data-stopwatch", r);
    }
}

function stopTimer() {
    var r = $('#stopwatch').attr("data-stopwatch");
    clearInterval(r);
    $('#stopwatch').removeAttr("data-stopwatch");
}

function check_autodial() {
    if (autodial) {
        autodial = false;
        $('.actions-item-link').click();
    }
}

function onChangeEEParentType(element) {

    var value = element.value;

    clearParentField();

// if (value != 'Contacts') {
//
// clearRelatedAccount();
//
// }

}

function clearParentField() {

    $('#parent_id').val('');
    $('#parent_name').val('');

}

function clearRelatedAccount() {

    $('#parent_id').val('');
    $('#{$fieldname}_' + rowNumber + '_related_account_link').html('-');

}

function onChangeEEParentId(element) {

    var parentType = $('#parent_type').val();
    var id = element.value;

    if (parentType == 'Contacts') {

        makeAccountLink(id);

    }

}

function makeContactLink() {

    var id = $('#parent_id').val();
    var name = $('#parent_name').val();

    return '<a href="index.php?module=Contacts&action=DetailView&record=' + id + '">' + name + '</a>';

}

/**
 * Not returns anything
 * @param contactId
 * @param rowNumber
 */
function makeAccountLink(contactId) {

    get_related_account(contactId).success(function (resp) {
        setAccountLink(resp.id, resp.name);
    });

}

function setAccountLink(accountId, accountName, rowNumber) {

    var link = '<a href="index.php?module=Accounts&action=DetailView&record=' + accountId + '">' + accountName + '</a>';

    if ((accountId === '') || (typeof(accountId) == "undefined")) {
        link = '-';
    }

    $('#{$fieldname}_' + rowNumber + '_related_account_id').val(accountId);
    $('#{$fieldname}_' + rowNumber + '_related_account_id').attr('style', 'white-space:pre-wrap;');
    $('#{$fieldname}_' + rowNumber + '_related_account_link').html(link);

}

function get_related_account(id) {
    return $.ajax({
        type: "POST",
        url: "index.php?entryPoint=get_related_account",
        dataType: 'json',
        data: {
            id: id
        }
    });
}

function sendform() {
    var data_string = $('form[name="call_form"]').serialize();

    $('#save_call_form').attr('disabled', 'disabled');
    /* меняем надпись на кнопке */
    $('#save_call_form').val("Сохранение...");
    setTimeout(
        $.ajax(
            {
                type: 'post',
                url: 'index.php?entryPoint=saveCallFromPopup',
                data: data_string,
                // async: false,
                success:
                    function (result) {
                        $('#save_call_form').removeAttr('disabled');
                        /* меняем надпись на кнопке */
                        $('#save_call_form').val("Сохранить");
                    },
                // beforeSend:function()
                // {
                //     launchpreloader();
                // },
                // complete:function()
                // {
                //     stopPreloader();
                // },
                error: function (result) {
                    // alert('oops');
                    console.log(result);
                }
            }), 2000
    );
}

function get_call_history(phone_number) {
    var response;
    var form;
    $.ajax(
        {
            type: 'post',
            url: 'index.php?entryPoint=getCallHistory',
            data: {phone_number: phone_number},//{phone_number:phone_number}
            dataType: 'json',
            // async: false,
            success:
                function (result) {
                    response = result;
                    if (response.length > 0) {
                        // var  form = '    <table border="1" cellpadding="0" cellspacing="0" id="call_history" width="100%">';
                        form = '        <tr>';
                        form += '            <th>Относится к</th>';
                        form += '            <th>Статус</th>';
                        form += '            <th>Дата</th>';
                        form += '            <th>Входящий/Исходящий</th>';
                        // form += '            <th>Дополнительно</th>';
                        form += '        </tr>';
                        response.forEach(function (elem) {
                            var status = translateCallStatus(elem.status);
                            var direction = (elem.direction == 'Outbound') ? 'Исходящий' : (elem.direction == 'Inbound') ? 'Входящий' : '-';
                            form += '        <tr>';
                            form += '            <td>' + ((typeof elem.parent_name === 'undefined') ? '<i>Нет данных</i>' : elem.parent_name) + '</td>';
                            form += '            <td>' + status + '</td>';
                            form += '            <td>' + elem.date_modified + '</td>';
                            form += '            <td>' + direction + '</td>';
                            // form += '            <td>' + description + '</td>';
                            form += '        </tr>';
                        });
                    }
                    else {
                        form = '        <tr>';
                        form += '            <td colspan="4" align="center"><i>Нет данных</i></td>';
                        form += '        </tr>';
                        form += '<br><i>Нет данных</i>'
                    }
                    // $('#call_history').append(form);$('#popup_call_form table#call_history')
                    $('#popup_call_form table#call_history').append(form);
                },
            error: function (result) {
                // alert('oops');
                console.log(result);
            }
        });
    return response;
}

function translateCallStatus(status) {
    switch (status) {
        case 'Held':
            return 'Состоялся'
            break;
        case 'Planned':
            return 'Запланирован';
            break;
        case 'Not Held':
            return 'Не состоялся';
            break;
        default:
            return '';
    }
}

function changeParentQS(field) {
    if (typeof sqs_objects == 'undefined') {
        return;
    }
    field = YAHOO.util.Dom.get(field);
    var form = field.form;
    var sqsId = form.id + "_" + field.id;
    var typeField = form.elements.parent_type;
    var new_module = typeField.value;
    //Update the SQS globals to reflect the new module choice
    if (typeof(QSFieldsArray[sqsId]) != 'undefined') {
        QSFieldsArray[sqsId].sqs.modules = new Array(new_module);
    }
    if (typeof QSProcessedFieldsArray != 'undefined') {
        QSProcessedFieldsArray[sqsId] = false;
    }
    if (sqs_objects[sqsId] == undefined) {
        return;
    }
    sqs_objects[sqsId]["modules"] = new Array(new_module);
    if (typeof(disabledModules) != 'undefined' && typeof(disabledModules[new_module]) != 'undefined') {
        sqs_objects[sqsId]["disable"] = true;
        field.readOnly = true;
    } else {
        sqs_objects[sqsId]["disable"] = false;
        field.readOnly = false;
    }
    enableQS(false);
}

function set_return(popup_reply_data) {
    from_popup_return = true;
    var form_name = popup_reply_data.form_name;
    var name_to_value_array = popup_reply_data.name_to_value_array;

    for (var the_key in name_to_value_array) {
        if (the_key == 'toJSON') {
            /* just ignore */
        }
        else {
            var displayValue = name_to_value_array[the_key].replace(/&amp;/gi, '&').replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/&#039;/gi, '\'').replace(/&quot;/gi, '"');
            ;
            if (window.document.forms[form_name] && window.document.forms[form_name].elements[the_key]) {
                window.document.forms[form_name].elements[the_key].value = displayValue;
                SUGAR.util.callOnChangeListers(window.document.forms[form_name].elements[the_key]);
                $('#' + the_key).trigger('change');
            }
        }
    }
}

function get_contact(phone_number) {
    var response = new Object();
    $.ajax(
        {
            type: 'post',
            url: 'index.php?entryPoint=getContact',
            data: {phone_number: phone_number},//{phone_number:phone_number}
            dataType: 'json',
            // async: false,
            success:
                function (result) {
                    response = result;
                    if ($('#popup_call_form').length && result != '-1') {
                        // $('#client_name').val(result);
                        // $('#parent_name').val(result.full_name);
                        // $('#parent_id').val(result.id);
                        $('#popup_call_form input#parent_name').val(result.full_name);
                        $('#popup_call_form input#parent_id').val(result.id);
                    }
                },
            error: function (result) {
                // alert('oops');
                console.log(result);
            }
        });
}

// function popupEditCallReady(){
//     $('#main_executor_contact_id').change(function(){
//
//         get_related_account($('#main_executor_contact_id').val()).success(function (resp) {
//             //не пришлось парсить Json, возможно где-то это вызовет ошибку.
//             $('#main_executor_id').val(resp.id);
//             $('#main_executor_name').val(resp.name);
//         });
//
//     });
//
//     $('#main_executor_name').change(function () {
//
//         if($('#main_executor_name').val().length > 0) {
//             $('#main_executor_filter').val("&account_name_advanced=" + $('#main_executor_name').val());
//         }
//         else{
//             $('#main_executor_filter').val('');
//         }
//
//     }).trigger('change');
//
//     $('#btn_clr_main_executor_name').click(function () {
//
//         $('#main_executor_filter').val('');
//
//     });
// }