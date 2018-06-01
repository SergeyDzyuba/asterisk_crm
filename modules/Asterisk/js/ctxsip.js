var header_color = $('.navbar').css("background-color");

$(document).ready(function()
{

	// if (SUGAR.themes.theme_name == "SuiteR")
		$('.desktop-bar').find('#toolbar').before('<div id="phoneLink" style="top:1px;" class="dropdown nav navbar-nav navbar-right"><button class="phone_link btn btn-primary" data-toggle="dropdown" aria-expanded="false" style="top:5px; right:440px; z-index:100;" onclick="select_asterisk();"><img src="modules/Asterisk/img/asterisk_number.png"></img></button></div>');

	$('#search').on('mousedown', function(e){
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

	window.outboundCall = function outboundCall(phone){
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
			show_softphone();
		};		
		return false;
	}

	window.show_inbound = function show_inbound(phone, id){
		show_popup(phone, id);
		return false;
	}
	
	// Открытие софтфона
	if (localStorage['softphone'] == 1) {
		show_softphone();
		$('#softphone_form').find('.asterisk_number').val(localStorage['softphone_number']);
	}

	setInterval(function(){
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
		if ( // обновить кнопки по статусу если попап есть на странице
			$('#popup_form #inbound_number').val() == localStorage['popup_number']
		){
			if(localStorage['popup_buttons'])
				if (!$('#softphone_form .pause-call').hasClass('unpausing'))
					set_buttons(localStorage['popup_buttons']);
		};
		if ( // обновить кнопки по статусу если софтфон есть на странице
			$('#softphone_form').length
		){
			set_buttons(localStorage['softphone_buttons']);
		};
		if ( // redirect
			localStorage['popup_redirect'] > 0
		){
			redirect(localStorage['popup_redirect']);
		};
	}, 1000);
});

function init_actions(){
	// Действия кнопок

	// клавиатура
	$('body').on('click', '.keyboard-item', function(){
		var text = $('#softphone_form').find('.field').val();
		if ($(this).html() == "C") {
			text = text.substr(0,text.length - 1);
			$('#softphone_form').find('.field').val(text);
			return false;
		};
		if ($(this).html() == "+" && text.length > 0) {
			return false;
		}
		if (ctxSip.callActiveID){
			var digit = $(this).html();
			if (!isNaN(digit)) ctxSip.sipSendDTMF(digit);
			var current_num = $('#softphone_form').find('.field').val();
			if (current_num.indexOf(" ") == -1) {
				$('#softphone_form').find('.field').val($('#softphone_form').find('.field').val() + " ");
			};
			$('#softphone_form').find('.field').val($('#softphone_form').find('.field').val() + $(this).html());
		} else {
			$('#softphone_form').find('.field').val($('#softphone_form').find('.field').val() + $(this).html());
			if ($('#softphone_form').find('.field').val().length > 9) search_contacts();
			localStorage['softphone_number'] = $('#softphone_form').find('.field').val();
		};
	});

	// redirect
	$('body').on('click', 'div.phone-list-item-code, div.phone-list-item-number', function(){
		var n = $(this).children().first().text();
		localStorage['popup_redirect'] = n;
		redirect(n);
	});

	// зеленая кнопка
	//$('#softphone_form li.actions-item .receive-call').live('click', function(){
	$('body').on('click', '#softphone_form li.actions-item .receive-call', function(){

			// Если не было звонков, набрать номер из поля набора
			var number = $('#softphone_form').find('.field').val();
			if((number !== null) && (number.length > 2)) {
				number = number.substr(-11);
				if (number.length == 11) number = number;
				if ($('#asterisk_role').length > 0)
					ctxSip.sipCall($('#asterisk_role').val() + number);
				else
                    ctxSip.sipCall(number);
				localStorage['softphone'] = number;
				console.log("Call: " + number);
				set_buttons('outbound');
			} else yield_error(2);
	});

	//$('#popup_form li.actions-item .receive-call').live('click', function(){
	$('body').on('click', '#popup_form li.actions-item .receive-call', function(){
		if ($('.sip-logitem').data('sessionid')) {
            var s = ctxSip.Sessions[$('.sip-logitem').data('sessionid')];
            s.accept({
                media : {
                    stream      : ctxSip.Stream,
                    constraints : { audio : true, video : false },
                    render      : {
                        remote : document.getElementById('audioRemote')
                    },
                    RTCConstraints : { "optional": [{ 'DtlsSrtpKeyAgreement': 'true'} ]}
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
	$('body').on('click', '#softphone_form li.actions-item .reset-call', function(){
		call_cancelled = true;
		stopTimer();
		ctxSip.sipHang();
        // if (ctxSip.callActiveID) ctxSip.sipHangUp(ctxSip.callActiveID);
		set_buttons('standby');
		localStorage['softphone_hold'] = "";
	});

	//$('#popup_form li.actions-item .reset-call').live('click', function(){
	$('body').on('click', '#popup_form li.actions-item .reset-call', function(){
		stopTimer();
		ctxSip.sipHang();
        // if (ctxSip.callActiveID) ctxSip.sipHangUp(ctxSip.callActiveID);
		set_buttons("inbound_ended");
		localStorage['popup_decline'] = localStorage['call_id'];
	});

	// синяя кнопка
	//$('li.actions-item .redirect-call').live('click', function(){
	$('body').on('click', 'li.actions-item .redirect-call', function(){
		set_buttons('redirect');
		localStorage['softphone_buttons'] = "redirect";
		show_redirect();
	});

	// жолтая кнопка
	//$('#popup_form li.actions-item .pause-call').live('click', function(){
	$('body').on('click', '#popup_form li.actions-item .pause-call', function(){
		hold();		
	});

	//$('#softphone_form li.actions-item .pause-call').live('click', function(){
	$('body').on('click', '#softphone_form li.actions-item .pause-call', function(){
		hold_outbound();
		localStorage['softphone_buttons'] = '';
	});
	
	// close
	//$('#softphone_form .close').live('click', function(){
	$('body').on('click', '#softphone_form .close', function(){
        if (ctxSip.callActiveID) ctxSip.sipHangUp(ctxSip.callActiveID);
		localStorage['softphone'] = 0;
		//localStorage['softphone_number'] = $('#softphone_form .field').val();
		localStorage['softphone_number'] = "";
		localStorage['softphone_buttons'] = "";
		$('#softphone_form').remove();
		$('div.window.window-phone-book').remove();
	});
	//$('#popup_form .close').live('click', function(){
	$('body').on('click', '#popup_form .close', function(){
		localStorage['popup'] = 0;
		localStorage['call_id'] = 0;
		localStorage['popup_number'] = "";
		localStorage['popup_buttons'] = "";
        if (ctxSip.callActiveID) ctxSip.sipHangUp(ctxSip.callActiveID);
		$('#popup_form').remove();
		$('div.window.window-phone-book').remove();
	});

	// minimize
	//$('#softphone_form .minimize').live('click', function () {
	$('body').on('click', '#softphone_form .minimize', function () {
        if ($('#softphone_form').hasClass('minzzz')) {
            $('#softphone_form').removeClass('minzzz');
            $('#softphone_form').position({my: "right top", at: "right bottom", of: "div.container-fluid:nth-child(1)"});
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
    $('body').on('click', '#popup_form div.add-person', function() {
    	var number = $('#popup_form #inbound_number').text();
    	var url = "index.php?module=" + $(this).attr('value') + "&action=EditView&phone_mobile=" + number;
    	if ($(this).attr('value') == "Accounts") url = "index.php?module=" + $(this).attr('value') + "&action=EditView&phone_office=" + number;
    	window.open(url,'_blank');
    });
    $('body').on('click', '#softphone_form div.add-person', function() {
    	var number = $('#softphone_form .field').val();
    	var url = "index.php?module=" + $(this).attr('value') + "&action=EditView&phone_mobile=" + number;
    	if ($(this).attr('value') == "Accounts") url = "index.php?module=" + $(this).attr('value') + "&action=EditView&phone_office=" + number;
    	window.open(url,'_blank');
    });
    // editview redirect
	$("body").on("keydown", ".field", function(event) {
	 	if(event.which == 13){
			event.preventDefault();
		};
	});
	$("body").on("keypress", ".field", function(event) {
		if(event.which == 13){
			event.preventDefault();
		};
	});
	$("body").on("keyup", ".field", function(event) {
		if(event.which == 13){
			var number = $(".field").val();
			ctxSip.sipCall(number);
			localStorage['softphone'] = number;
			console.log("Call: " + number);
			if (number.length == 6){
				// определять городской
				search_contacts();
			};
			set_buttons('outbound');
			event.preventDefault();
		};
	});
}

function hold()
{
	//if hasclass active removeclass active else addclass active
	if ($('#popup_form .pause-call').hasClass('active')){
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

function hold_outbound()
{
	//if hasclass active removeclass active else addclass active
	if ($('#softphone_form .pause-call').hasClass('active')){
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

function close_popups(timeout = 500){
	var func = function(){
		$('#softphone_form .close').click();
		$('#popup_form .close').click();
	};
	setTimeout(func, timeout);
}

function yield_error(round){
	var first_color = $('#softphone_form').find('.field').css('border-color');
	$('#softphone_form').find('.field').css('border-color', 'red');
	setTimeout(function(){
		$('#softphone_form').find('.field').css('border-color', first_color);
		if (round == 2) setTimeout(function(){yield_error(1)},350);
	}, 500);
}

function set_buttons(type){
	if (type == "outbound"){ //console.log("outbound");
		localStorage['softphone_buttons'] = "outbound";
		$('#softphone_form ul.actions').html('<li class="actions-item"><a class="actions-item-link reset-call" href="#" title="Сбросить вызов"></a></li><li class="actions-item"><a class="actions-item-link redirect-call" href="#" title="Переадресовать вызов"></a></li>');
		$('div.window.window-phone-book').remove();
	};
	if (type == "outbound_pause_active"){ //console.log("pause");
		localStorage['softphone_buttons'] = "outbound_pause_active";
		$('#softphone_form ul.actions').html('<li class="actions-item"><a class="actions-item-link reset-call" href="#" title="Сбросить вызов"></a></li><li class="actions-item"><a class="actions-item-link redirect-call" href="#" title="Переадресовать вызов"></a></li>');
		//$('#softphone_form ul.actions').html('<li class="actions-item"><a class="actions-item-link reset-call" href="#" title="Сбросить вызов"></a></li><li class="actions-item"><a class="actions-item-link redirect-call" href="#" title="Переадресовать вызов"></a></li>');
		$('div.window.window-phone-book').remove();
	};
	if (type == "outbound_pause_unpausing"){ //console.log("unpausing");
		localStorage['softphone_buttons'] = "outbound_pause_unpausing";
		$('#softphone_form ul.actions').html('<li class="actions-item"><a class="actions-item-link reset-call" href="#" title="Сбросить вызов"></a></li><li class="actions-item"><a class="actions-item-link redirect-call" href="#" title="Переадресовать вызов"></a></li>');
		//$('#softphone_form ul.actions').html('<li class="actions-item"><a class="actions-item-link reset-call" href="#" title="Сбросить вызов"></a></li><li class="actions-item"><a class="actions-item-link redirect-call" href="#" title="Переадресовать вызов"></a></li>');
		$('div.window.window-phone-book').remove();
	};
	if (type == "standby"){ //console.log("standby");
		localStorage['softphone_buttons'] = "standby";
		$('#softphone_form ul.actions').html('<li class="actions-item"><a class="actions-item-link receive-call" href="#" title="Сделать вызов"></a></li>');
		$('div.window.window-phone-book').remove();
	};
	if (type == "redirect"){
		localStorage['softphone_buttons'] = "redirect";
		$('#softphone_form ul.actions').html('<li class="actions-item"><a class="actions-item-link reset-call" href="#" title="Сбросить вызов"></a></li><li class="actions-item"><a class="actions-item-link redirect-call active" href="#" title="Переадресовать вызов"></a></li>');
	};
	if (type == "inbound"){
		localStorage['popup_buttons'] = "inbound";
		$('#popup_form ul.actions').html('<li class="actions-item"><a class="actions-item-link receive-call" href="#" title="Принять вызов"></a></li> <li class="actions-item"><a class="actions-item-link reset-call" href="#" title="Сбросить вызов"></a></li> <li class="actions-item"><a class="actions-item-link redirect-call" href="#" title="Переадресовать вызов"></a></li>');
		//$('div.window.window-phone-book').remove();
	}
	if (type == "inbound_ended"){
		localStorage['popup_buttons'] = "inbound_ended";
		$('#popup_form ul.actions').html('<li class="actions-item"><a class="actions-item-link receive-call active" href="#" title="Принять вызов"></a></li> <li class="actions-item"><a class="actions-item-link reset-call" href="#" title="Сбросить вызов"></a></li> <li class="actions-item"><a class="actions-item-link redirect-call" href="#" title="Переадресовать вызов"></a></li>');
		//$('div.window.window-phone-book').remove();
	}
	if (type == "inbound_pause"){
		localStorage['popup_buttons'] = "inbound_pause";
		$('#popup_form ul.actions').html('<li class="actions-item"><a class="actions-item-link reset-call" href="#" title="Сбросить вызов"></a></li> <li class="actions-item"><a class="actions-item-link redirect-call" href="#" title="Переадресовать вызов"></a></li>');
		//$('div.window.window-phone-book').remove();
	}
	if (type == "inbound_pause_unpausing"){
		localStorage['popup_buttons'] = "inbound_pause_unpausing";
		$('#popup_form ul.actions').html('<li class="actions-item"><a class="actions-item-link reset-call" href="#" title="Сбросить вызов"></a></li> <li class="actions-item"><a class="actions-item-link redirect-call" href="#" title="Переадресовать вызов"></a></li>');
		//$('div.window.window-phone-book').remove();
	}
	if (type == "inbound_pause_active"){
		localStorage['popup_buttons'] = "inbound_pause_active";
		$('#popup_form ul.actions').html('<li class="actions-item"><a class="actions-item-link reset-call" href="#" title="Сбросить вызов"></a></li> <li class="actions-item"><a class="actions-item-link redirect-call" href="#" title="Переадресовать вызов"></a></li>');
		//$('div.window.window-phone-book').remove();
	}
	if (type == "inbound_redirect"){
		localStorage['popup_buttons'] = "inbound_redirect";
		$('#popup_form ul.actions').html('<li class="actions-item"><a class="actions-item-link receive-call" href="#" title="Принять вызов"></a></li> <li class="actions-item"><a class="actions-item-link reset-call" href="#" title="Сбросить вызов"></a></li> <li class="actions-item"><a class="actions-item-link redirect-call active" href="#" title="Переадресовать вызов"></a></li>');
	}

	if (type == "ended") {
		set_buttons("standby");
		set_buttons("inbound_ended");
	}
}

// Собираем всплывающую форму:
function getOutboundForm()
{
		var form = '';
		var phone = "";
		if (localStorage['softphone_number'] > 1) phone = localStorage['softphone_number'];
		
		form += '<div class="window" id="softphone_form" data-id="">';
		form += '	<div class="title">Исходящий вызов</div><div id="stopwatch" value="0">00:00</div>';
		form += '		<form class="form" action="#" method="post">';
		//form += ' <script>setTimeout(check_autodial, 500);</script>';
		form += '			<input class="field" type="tel" autocorrect="off" autocomplete="tel" name="tel" placeholder="Номер клиента" value="' + phone + '" />';
		//form += '			<div class="person-replacer"><div class="add-person">Создать физ. лицо</div></div>';
		form += '		<div class="add-person" value="Contacts">Создать контакт</div>';
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
		
		return form;
}

function getInboundForm(number, id){
	var form = '';
		
	form += '<div class="window" id="popup_form" data-id="'+ id + '">';
	//form += '<input type="hidden" id="inbound_number" value="' + number + '"></input>';
	form += '	<div class="title">Входящий вызов</div><div id="stopwatch" value="0">00:00</div>';
	//form += '<input id="inbound_number" value="' + number + '" disabled="true"></input>';
	form += '<div id="inbound_number" value="' + number + '">' + number + '</div>';
	form += '	<div class="person-replacer">';
	form += '		<div class="add-person" value="Contacts">Создать контакт</div>';
	//form += '		<div class="add-person" value="Accounts">Создать контрагент</div>';
	//form += '		<div class="add-person" value="Leads">Создать предв.контакт</div>';
	form += '	</div>';
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

function select_asterisk(){
	if ($('#softphone_form').length > 0) {
		localStorage['softphone'] = 0; // чтобы не открывалось
		localStorage['softphone_number'] = $('#softphone_form').find('.field').val();
		$('#softphone_form').remove();
	} else {
		localStorage['softphone'] = 1; // для переоткрытия
		show_softphone();
	};
	
}

function show_softphone(){
	var str = getOutboundForm();
		$('body').append(str);
		$('.window').draggable({ containment:"body", handle:".title" });
		//$('#softphone_form').position({my: "right top", at: "right top", of: "#contentTable"});
		var x = $('body').width() - 350;
		$('#softphone_form').offset({top:100,left:x});
		if (localStorage['softphone_number'].length > 9) search_contacts(localStorage['softphone_number']);
}

function show_popup(number, id){
	// проверяем если это возврат исходящего звонка из паузы
	if ($("#softphone_form").length && $('#softphone_form .pause-call').hasClass('unpausing'))
	{
		$('#softphone_form .pause-call').removeClass('unpausing');
		oSipSessionCall.accept(oConfigCall);
		// replace call id
		$('#softphone_form').attr("data-id", id);
		set_buttons("outbound");
		localStorage['softphone_buttons'] = "outbound";
		return false;
	};


	localStorage['popup'] = 1;
	localStorage['popup_number'] = number;
	// проверяем если это возврат входящего звонка из паузы
	if ($("#popup_form").length && $('#popup_form .pause-call').hasClass('unpausing'))
	{
		$('#popup_form .pause-call').removeClass('unpausing');
		//set_buttons("inbound_pause");
		if (oSipSessionCall.accept(oConfigCall)){
			set_buttons("inbound_pause");
			// replace call id
			$('#popup_form').attr("data-id", id);
		}
	} else 
	if ($("#softphone_form").length && $('#softphone_form .pause-call').hasClass('unpausing'))
	{
		$('#softphone_form .pause-call').removeClass('unpausing');
		set_buttons("outbound");
		oSipSessionCall.accept(oConfigCall);
		// replace call id
		$('#popup_form').attr("data-id", id);
	} else {
		//if ($('#popup_form').length) $('#popup_form').remove();
		if ($('#inbound_number').text() != number){
			$('#inbound_number').val(number);
			$('#inbound_number').text(number);
			search_contacts(number);
		}
		if (!$('#popup_form').length){
			var str = getInboundForm(number, id);
			$('body').append(str);
			$('.window').draggable({ containment:"body", handle:".title" });
			//$('#popup_form').position({my: "right top", at: "right bottom", of: "div.container-fluid:nth-child(1)"});
			var x = $('body').width() - 350;
			$('#popup_form').offset({top:100,left:x});
			search_contacts(number);
		}
		//if ($('#asterisk_active_tab').val() == 0) alert("Входящий звонок");
		//search_filial(number);
	}
}

function show_redirect()
{
	if (!$('div.window.window-phone-book').length){
		$.ajax({
			url: 'index.php?module=Asterisk&action=getredirectlist&to_pdf=true',
			dataType: 'text',
			type: 'POST',
			data: {},
			success: function(data)
			{
				var form = '<div class="window window-phone-book window-without-logo"><div class="title">Телефонная книга</div><div class="phone-book-wrapper js-scrollpane">';
				form += data;
				//form += '</div><div class="close" title="Закрыть"></div></div>';
				form += '</div></div>';
				$('body').append(form);
				$('div.window.window-phone-book').draggable({ containment:"body", handle:".title" });
				$('div.window.window-phone-book').position({my: "right top", at: "left top", of: ".window"});
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
		if (ctxSip.callActiveID){
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

function search_contacts(number){
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
		success: function(data)
		{
			var contact = data.split("^");
			if (contact.length > 1 && data.length > 5){
				// contacts or accounts
				if (contact[0] == "contacts"){
					var temp = '<div class="person"><span>Контакт</span> <a class="person-link" target="_blank" href="';
					temp += 'index.php?module=Contacts&action=DetailView&record=' + contact[1];
					temp += '">';
					temp += contact[2] + " " + contact[3];
					temp += '</a>';
					temp += '</div>';
					$('div.window .person-replacer').html(temp);
					get_item_list(contact[1]);
				};
				if (contact[0] == "accounts"){
					// var temp = '<div class="person"><span>Контрагент</span> <a class="person-link" target="_blank" href="';
					// temp += 'index.php?module=Accounts&action=DetailView&record=' + contact[1];
					// temp += '">';
					// temp += contact[2];
					// temp += '</a></div>';
					// $('div.window .person-replacer').html(temp);
					//get_item_list(contact[1]);
				};
				if (contact[0] == "leads"){
					var temp = '<div class="person"><span>Предв.контакт</span> <a class="person-link" target="_blank" href="';
					temp += 'index.php?module=Leads&action=DetailView&record=' + contact[1];
					temp += '">';
					temp += contact[2];
					temp += '</a>';
					temp += '</div>';
					$('div.window .person-replacer').html(temp);
					//get_item_list(contact[1]);
				};
			};
			if (contact.length == 2){
				var temp = '<div class="person"><div class="add-person" value="Leads">Создать контакт</div><br>';
					temp += '</div>';
					$('div.window .person-replacer').html(temp);
			};
		}
	});
}

function show_phones(id){
	$.ajax({
		url: 'index.php?module=Contacts&action=pop_dropdown&to_pdf=true&id='+id,
		dataType: 'html',
		type: 'post',
		success: function(data)
		{
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

function get_item_list(id){
	$.ajax({
		url: 'index.php?module=Asterisk&action=get_item_list&to_pdf=true&id='+id,
		dataType: 'html',
		type: 'post',
		success: function(data)
		{
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

function startTimer(time){
	if (!$('#stopwatch').attr("data-stopwatch")){
		// проверить активность таймера
		time = time || 0;
		$('#stopwatch').val(time);
		var r = setInterval(function(){
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

function stopTimer(){
	var r = $('#stopwatch').attr("data-stopwatch");
	clearInterval(r);
	$('#stopwatch').removeAttr("data-stopwatch");
}

function check_autodial(){
	if (autodial){
		autodial = false;
		$('.actions-item-link').click();
	}
}