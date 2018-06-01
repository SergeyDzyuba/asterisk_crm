/*
 * Part of SugarTalk Asterisk module
 * © 2012 sugartalk.net | D1ma Z.
 */

$(document).ready(function()
{
	//элемент "first_call"
	$('body').append('<input hidden id="first_call"></input>');
	//$('body').append('HELLO ITS ME');
	var connected = false;
		
		///////////////////////////////////////////////////////////////////////////
			var url = location.hostname;
			// var url = location.host;

			if (location.protocol == 'https:') {
				url = 'wss://' + url + ':12345';
			} else {
				url = 'ws://' + url + ':12345';
			};

			Server = new FancyWebSocket(url);

			function reconnect(){
				console.log("Trying to reconnect");
				Server.connect();
			};

			//Let the user know we're connected
			Server.bind('open', function() {
				connected = true;
				Server.send('message', $('#user_asterisk_extension').val());
				console.log("wss connected");
			});

			//OH NOES! Disconnection occurred.
			Server.bind('close', function( data ) {
				connected = false;
				setTimeout(reconnect, 10000);
				console.log("Отключены от " + url + " " + location.hostname + ", переподключаемся через 3 секунды");
			});

			//Log any messages sent from server
			Server.bind('message', function( payload ) {
				console.log(payload);
				var arr = payload.split('^|^');
				// phone, status, saved_id, uid
				//var links = unescape(arr[0]);
				var links = decodeURIComponent(arr[0]);
				successGetForm(links, arr[1], arr[2], arr[3]);
			});

			Server.connect();
		//////////////////////////////////////////////////////////////////////////*/

	// Функция, которая выводит и наполняет данными окошко с событием:
	window.successGetForm = function successGetForm(response, status, saved_id, uid)
	{
		var kkk = uid.split('.');
		var key = kkk[0];
		var form_id = 'asterisk_form_' + key;
		$.ajax({
			//url: 'index.php?module=Asterisk&action=GetPopup&to_pdf=true',
			url: 'index.php?module=Asterisk&action=GetLinks&to_pdf=true',
			dataType: 'text',
			type: 'POST',
			data: {
				'id': $('#user_asterisk_extension').val()//,
				//'form_id': form_id
			},
			error: function (xhr, ajaxOptions, thrownError) {
		        console.info(xhr.status);
		        console.info(thrownError);
      		},
			success: function(data)
			{
				console.info(response);
				response = data;
				if (response.length < 30) return false;
				try
				{
					var form = $(getForm(form_id));
					
					if ((!$('#' + form_id).length > 0) && ($('#last_uid').val() != uid)) // Создаем и отображаем форму, если ранее этого сделано не было.
					{
						$('body').append(form);
						$('#replaceme' + form_id).html("");
						$('#replaceme' + form_id).html(response);
						$('#' + form_id).attr('status', status);
						$('#' + form_id).attr('uid', uid);
						$('#' + form_id).attr('saved_id', saved_id);
						$('#' + form_id).attr('title', 'Asterisk. ' + getStatus(status));
						$('[aria-describedby=' + form_id + ']').attr('title', 'Asterisk. ' + getStatus(status));
						$('[aria-describedby=' + form_id + ']').find('.ui-dialog-title').html('Asterisk. ' + getStatus(status));
						
						if($('#last_uid').length > 0) {//если уид не стоит, создаем
						} else {
							$('body').append('<input hidden id="last_uid"></input>');
						};
								
						//отображаем форму
						$('#' + form_id).dialog();
						$('#' + form_id).parent().position({my: "right top", at: "right top", of: "#content"});
						// $('#' + form_id).dialog({
						// 	closeOnEscape: true,
						// 	resizable: false,
						// 	position: {  
						// 	my: "right top",
  				// 			at: "right bottom",
  				// 			of: "body"},
						// 	show: {effect: 'drop', direction: 'down'},
						// 	open: function(event, ui) {
	     //    					//$(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
	     //    					// setInterval(check_operator_extension,2000);
	    	// 				},
	    	// 				close: function(event, ui)
						// 	{
						// 		var tmp_str = form_id.replace('_form','');
						// 		console.log(tmp_str + ' ' + status);
						// 		deleteCookie(tmp_str);
						// 		var dialogBlock = $('#' + form_id).parents('div.ui-dialog');		
						// 		$(dialogBlock).remove();
						// 		$('#' + form_id).remove();
						// 	},
						// 	width: auto,
						// });
						/////////
						$('#last_uid').val(uid);
						
						callRename(form_id, value['status'], value['call_id']); // Разрешаем переименовать звонок.
						saveCalls(form_id, key); // Сохранение звонка.
					}
					else {
						//$('#replaceme' + form_id).html("");
						//$('#replaceme' + form_id).html(response);
						$('#' + form_id).attr('status', status);
						$('[aria-describedby=' + form_id + ']').find('.ui-dialog-title').html('Asterisk. ' + getStatus(status));
						
						if(saved_id.length > 30){
							// $('#' + form_id).find('.asterisk_view_call').fadeIn('fast');
							// $('#' + form_id).find('.asterisk_view_call').attr('href', 'index.php?module=Calls&action=DetailView&record=' + saved_id);
							
							$('#' + form_id).find('.asterisk_call_id').val(saved_id);
							$('#' + form_id).find('#save_fio_button').removeAttr('disabled');
							
							// $('#' + form_id).find('.asterisk_name').attr('placeholder', '');
							// $('#' + form_id).find('.asterisk_name').attr('disabled', false);
							// $('#' + form_id).find('.asterisk_submit').attr('disabled', false);
							// callRename(form_id, status, saved_id); // Разрешаем переименовать звонок.
							// saveCalls(form_id, key); // Сохранение звонка.
						};
						callRename(form_id, value['status'], value['call_id']); // Разрешаем переименовать звонок.
					};
				/////////cookie
					var data = encodeURIComponent($('#replaceme' + form_id).html()) + '^|^' + status + '^|^' + saved_id + '^|^' + uid;
					setCookie(form_id.replace('_form', ''), lzw_encode(data), '');
				/////////
				}
				catch(err)
				{
				/////////cookie
					var data = encodeURIComponent($('#replaceme' + form_id).html()) + '^|^' + status + '^|^' + saved_id + '^|^' + uid;
					setCookie(form_id.replace('_form', ''), lzw_encode(data), '');
				/////////
				failGetForm(err);
		}

			}
		});
	}
	
	
	//load_cookie();
	//setInterval(function(){save_cookie();}, 2000);
	

	// Функция, которая срабатывает в случае ошибки:
	function failGetForm(err)
	{
		return true;
		//alert('Ошибка соединения с сервером');
	}

	// Функция, которая возвращает статус события:
	function getStatus(key)
	{
		var status = new Array();
		status.push({
			'0': '<span style="color: #FF4500;">ВХОДЯЩИЙ вызов.</span>',
			'1': '<span style="color: #22FF22;">Вызов ПРИНЯТ.</span>',
			'2': '<span style="color: #0000CD;">Разговор ЗАВЕРШЕН.</span>',
			'3': '<span style="color: #FF0000;">ПРОПУЩЕННЫЙ вызов.</span>',
			'4': '<span style="color: #8B7B8B;">Вызов ОТКЛОНЕН.</span>',
			'5': '<span style="color: #8B3A3A;">ИСХОДЯЩИЙ вызов.</span>'
		});

		return status[0][key];
	}

	// Обращаемся к БД каждые 3 секунды:
	//getAlert();
	//setInterval(getAlert, 5000);
	
	// Функция подвешивание события для сохранения звонка в БД при клике на кнопку Сохранить:
	function saveCalls(form_id, event_id)
	{
		$('#' + form_id).find('.asterisk_submit').click(function()
		{
			var name = $('#' + form_id).find('.asterisk_name').get(0);
			var call_id = $('#' + form_id).find('.asterisk_call_id').get(0);

			if ($(name).val() == '')
			{
				$(name).css('border', '1px solid red');
				$(name).attr('placeholder', 'Поле имени обязательно для заполнения.');
			}
			else {
				$.ajax({
					url: $('#' + form_id).attr('action'),
					dataType: 'json',
					type: $('#' + form_id).attr('method'),
					data: {
						'name': $(name).val(),
						'call_id': $(call_id).val(),
						'realty_id': $('#' + form_id).find('.asterisk_realty_id').val(),
						'event_id': event_id
					},
					success: function(data)
					{
						$('#' + form_id).find('.asterisk_data').css('display', 'none');
						
						$('#' + form_id).find('.asterisk_message a').attr('href', 'index.php?module=Calls&action=DetailView&record=' + data['call_id']);
						$('#' + form_id).find('.asterisk_message').css('display', 'block');
					}
				});
			}

			return false;
		});
	}
	
	// Собираем всплывающую форму:
	function getForm(form_id)
	{
		var form = '';
		var form_id_num = form_id.substr(14);
		
		form += '<form class="asterisk_form" id="' + form_id + '" title="" action="index.php?module=Asterisk&action=SaveInboundCalls&to_pdf=true" method="POST" style="display: none;" status="">';
		form += '<input hidden id="#saved_call_id"></input>';
		form += '<input class="asterisk_call_id" name="call_id" type="hidden" />';
		form += '	<table>';
		form += '		<tr>';
		form += '			<td>';
		form += '				<span id="replaceme' + form_id + '"></span>';
		form += '			</td>';
		form += '		</tr>';
		form += '	</table>';
		form += '</form>';
		
		return form;
	}
	
	// Функция переименования звонка:
	function callRename(form_id, status, call_id)
	{
		if ((status != 0 && status != 1) && call_id != '')
		{
			$('#' + form_id).find('.asterisk_view_call').fadeIn('fast');
			$('#' + form_id).find('.asterisk_view_call').attr('href', 'index.php?module=Calls&action=DetailView&record=' + call_id);
			$('#' + form_id).find('.asterisk_name').attr('placeholder', '');
			$('#' + form_id).find('.asterisk_name').attr('disabled', false);
			$('#' + form_id).find('.asterisk_submit').attr('disabled', false);
			$('#' + form_id).find('.asterisk_call_id').val(call_id);
			if($('#saved_call_id').length > 0) {$('#saved_call_id').val( call_id )} else {
			$('<input>').attr({type: 'hidden', id: 'saved_call_id', name: 'saved_call_id', value: call_id}).appendTo('#header')};   //сохраняем ид звонка для прикрепления к нему результатов опроса
			};
	}
});

function HtmlDecode(data) {
    //var div = document.createElement("div");
    //div.innerHTML = data;	
    //return div.childNodes[0].nodeValue;
	var div = document.createElement('div');
	div.innerHTML = data;
	if (div.hasOwnProperty('firstChild'))
	var decoded = div.firstChild.nodeValue;
	else
	var decoded = 0;
	return decoded;
}

function httpGet(theUrl)
{
    var xmlHttp = null;

    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function getCookie(name){
	return localStorage.getItem(name);
}
function setCookie(name,value,options){
	localStorage.setItem(name,value);
}
function deleteCookie(name){
	localStorage.clear();
}

// LZW-compress a string
function lzw_encode(s) {
    var dict = {};
    var data = (s + "").split("");
    var out = [];
    var currChar;
    var phrase = data[0];
    var code = 256;
    for (var i=1; i<data.length; i++) {
        currChar=data[i];
        if (dict[phrase + currChar] != null) {
            phrase += currChar;
        }
        else {
            out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
            dict[phrase + currChar] = code;
            code++;
            phrase=currChar;
        }
    }
    out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
    for (var i=0; i<out.length; i++) {
        out[i] = String.fromCharCode(out[i]);
    }
    return out.join("");
}

// Decompress an LZW-encoded string
function lzw_decode(s) {
    var dict = {};
    var data = (s + "").split("");
    var currChar = data[0];
    var oldPhrase = currChar;
    var out = [currChar];
    var code = 256;
    var phrase;
    for (var i=1; i<data.length; i++) {
        var currCode = data[i].charCodeAt(0);
        if (currCode < 256) {
            phrase = data[i];
        }
        else {
           phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
        }
        out.push(phrase);
        currChar = phrase.charAt(0);
        dict[code] = oldPhrase + currChar;
        code++;
        oldPhrase = phrase;
    }
    return out.join("");
}

	window.save_cookie = function save_cookie() {
		if (vis()) {
			//console.log('vis = true');
			$('[id^=asterisk_form_] [id^=replacemeasterisk_form_]').each(function(){
			var id = $(this).prop('id').substr(23);
		//обновляем значения в html
			$('#asterisk_form_' + id + ' #asterisk_contact').attr('value',$('#asterisk_form_' + id + ' #asterisk_contact').val());
			$('#asterisk_form_' + id + ' #asterisk_account').attr('value',$('#asterisk_form_' + id + ' #asterisk_account').val());
			var name = 'asterisk_' + id;
			var html = encodeURIComponent($(this).html());
			var status = $('#asterisk_form_' + $(this).prop('id').substr(23)).attr('status');
			var saved_id = $('#asterisk_form_' + $(this).prop('id').substr(23)).attr('saved_id');
			var uid = $('#asterisk_form_' + $(this).prop('id').substr(23)).attr('uid');
			var newcookie = html + '^|^' + status + '^|^' + saved_id + '^|^' + uid;
			newcookie = lzw_encode(newcookie);
			setCookie(name, newcookie);
			});
		}
		//else console.log('vis = false');
}

function load_cookie() {
	var s = localStorage;
	for (var i = 0; i < s.length; i++) { 
		key = s.key(i);
		//console.log(key + " = " + s.getItem(key));
		var arr = (lzw_decode(s.getItem(key))).split('^|^');
		var links = decodeURIComponent(arr[0]);

		$.ajax({
			url: 'index.php?module=Asterisk&action=Refresh&to_pdf=true&linked_id=' + arr[3],
			dataType: 'text',
			type: 'GET',
			success: function(data)
			{
				var ref = data.split("|");
				arr[1] = ref[0];
				arr[2] = ref[1];
				console.log("Refreshed popup: status = " + ref[0] + " and save_id = " + ref[1]);
				successGetForm(links, ref[0], ref[1], arr[3]);
			}
		});
		
		successGetForm(links, arr[1], arr[2], arr[3]);
	}
}

var vis = (function(){
    var stateKey, eventKey, keys = {
        hidden: "visibilitychange",
        webkitHidden: "webkitvisibilitychange",
        mozHidden: "mozvisibilitychange",
        msHidden: "msvisibilitychange"
    };
    for (stateKey in keys) {
        if (stateKey in document) {
            eventKey = keys[stateKey];
            break;
        }
    }
    return function(c) {
        if (c) document.addEventListener(eventKey, c);
        return !document[stateKey];
    }
})();