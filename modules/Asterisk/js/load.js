/*
 * Part of SugarTalk Asterisk module
 * © 2012 sugartalk.net | D1ma Z.
 */

$(document).ready(function()
{
	// Функция ображения к БД:
	function getAlert()
	{
		$.ajax({
			url: 'index.php?module=Asterisk&action=GetAlert&to_pdf=true',
			dataType: 'json',
			type: 'post',
			success: function(data)
			{
				successGetForm(data);
			},
			error: failGetForm()
		});
	}

	// Функция, которая выводит и наполняет данными окошко с событием:
	function successGetForm(response)
	{
		try
		{
			$.each(response, function(key, value)
			{
				var form_id = 'asterisk_form_' + key;
				var form = $(getForm(form_id));
				
				if (!$('form').is('#' + form_id)) // Создаем и отображаем форму, если ранее этого сделано не было.
				{
					$('body').append(form);
					$('#' + form_id).attr('status', value['status']);
					$('#' + form_id).attr('title', 'Asterisk. ' + getStatus(value['status']));
					$('#' + form_id).find('.asterisk_number').html(value['number']);
					$('#' + form_id).find('.asterisk_date').html(value['date']);
					$('#' + form_id).find('.asterisk_contact').attr('href', value['contact_link']);
					$('#' + form_id).find('.asterisk_contact').html(value['contact_name']);
					$('#' + form_id).find('.asterisk_lead').attr('href', value['lead_link']);
					$('#' + form_id).find('.asterisk_lead').html(value['lead_name']);
					$('#' + form_id).find('.asterisk_account').attr('href', value['account_link']);
					$('#' + form_id).find('.asterisk_account').html(value['account_name']);
					
					$('#' + form_id).dialog({
						resizable: false,
						position: ['right', 'bottom'],
						show: {effect: 'drop', direction: 'down'},
						close: function(event, ui)
						{
							$.ajax({
								url: 'index.php?module=Asterisk&action=GetAlert&to_pdf=true&cookie_event_remove=' + key,
								type: 'get',
								success: function()
								{
									var dialogBlock = $('#' + form_id).parents('div.ui-dialog');
									
									$(dialogBlock).remove();
									$('#' + form_id).remove();
								}
							});
						}
					});
					
					callRename(form_id, value['status'], value['call_id']); // Разрешаем переименовать звонок.
					saveCalls(form_id, key); // Сохранение звонка.
					dialButton(form_id, value['status'], value['dial_buttons'], value['number']); // Отображаем кнопочку для возможности перезвонить.
				}
				else {
					$('#' + form_id).attr('status', value['status']);
					$('#ui-dialog-title-' + form_id).html('Asterisk. ' + getStatus(value['status']));
					if ($('div[aria-labelledby="ui-dialog-title-' + form_id + '"]').css('display') == 'none')
					{
						$('#' + form_id).dialog();
					}
					
					if (value['status'] == 3) // Если вызов пропущен, то...
					{
						var trueForms = $('.asterisk_form[id!="' + form_id + '"][status="3"]');
						$.each(trueForms, function(tf_key, tf_form) // Пробегаемся по всем открытым формам с пропущенным вызовом.
						{
							if ($(tf_form).find('.asterisk_number').html() == value['number']) // Проверям, пропущен ли от от того же номера, что и сейчас.
							{
								var closeButton = $(tf_form).siblings('.ui-dialog-titlebar').find('.ui-icon-closethick');
								$(closeButton).click(); // Закрываем предыдущие ненужные карточки.
							}
						});
					}
					
					callRename(form_id, value['status'], value['call_id']); // Разрешаем переименовать звонок.
					dialButton(form_id, value['status'], value['dial_buttons'], value['number']); // Отображаем кнопочку для возможности перезвонить.
				}
			});
		}
		catch(err)
		{
			failGetForm(err);
		}
	}

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
			'1': '<span style="color: #228B22;">Вызов ПРИНЯТ.</span>',
			'2': '<span style="color: #0000CD;">Разговор ЗАВЕРШЕН.</span>',
			'3': '<span style="color: #FF0000;">ПРОПУЩЕННЫЙ вызов.</span>',
			'4': '<span style="color: #8B7B8B;">Вызов ОТКЛОНЕН.</span>',
			'5': '<span style="color: #8B3A3A;">ИСХОДЯЩИЙ вызов.</span>'
		});

		return status[0][key];
	}

	// Обращаемся к БД каждые 3 секунды:
	getAlert();
	setInterval(getAlert, 1000 * 3);
	
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
		
		form += '<form class="asterisk_form" id="' + form_id + '" title="" action="index.php?module=Asterisk&action=SaveInboundCalls&to_pdf=true" method="POST" style="display: none;" status="">';
		form += '	<table>';
		form += '		<tr>';
		form += '			<td>';
		form += '				<b>Номер:</b> <span class="asterisk_number"></span>';
		form += '				<a href="#" class="outboundCall" title="Создать вызов" target="_blank" style="text-decoration: none; opacity: 0; cursor: default;">';
		form += '					<img src="modules/Asterisk/img/call_active.gif" />';
		form += '				</a>';
		form += '				<br />';
		form += '				<b>Дата:</b> <span class="asterisk_date"></span>';
		form += '				<hr />';
		form += '				<b>Контрагент:</b> <a href="#" class="asterisk_account"></a>';
		form += '				<br />';
		form += '				<b>Контакт:</b> <a href="#" class="asterisk_contact"></a>';
		form += '				<br />';
		form += '				<b>Предв. контакт:</b> <a href="#" class="asterisk_lead"></a>';
		form += '			</td>';
		form += '		</tr>';
		form += '		<tr>';
		form += '			<td>';
		form += '				<hr />';
		form += '				<div class="asterisk_data">';
		form += '					<b><a class="asterisk_view_call" style="display: none;" href="#">Просмотреть звонок</a></b><br />';
		form += '					<input class="asterisk_call_id" name="call_id" type="hidden" />';
		form += '					<textarea class="asterisk_name" name="name" disabled="disabled" placeholder="Вы не можете изменять звонок, пока он имеет статус входящего или принятого." style="width: 265px; height: 50px;"></textarea><br />';
		form += '					<input type="submit" class="asterisk_submit" disabled="disabled" value="Сохранить" />';
		form += '				</div>';
		form += '				<div class="asterisk_message" style="width: 270px; color: red; display: none;"><a href="#">Звонок</a> был успешно сохранен.</div>';
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
		}
	}
});

// Функция для отображения кнопочки перезвона:
function dialButton(form_id, status, dial_buttons, number)
{
	if ((status != 0 && status != 1) && dial_buttons == 1)
	{
		$('#' + form_id).find('.outboundCall').attr('href', 'index.php?module=Asterisk&action=OutboundCall&phone=' + number);
		$('#' + form_id).find('.outboundCall').css({
			'opacity': '1',
			'cursor': 'pointer'
		});
	}
}