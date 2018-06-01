/*
 * Part of SugarTalk Asterisk module
 * © 2012 sugartalk.net | D1ma Z.
 */

$(document).ready(function()
{
	window.outboundCall = function outboundCall(phone){
		$.ajax({
			url: 'index.php?module=Asterisk&action=OutboundCall&phone=' + phone,
			type: 'get',
			error: function()
			{
				alert('При попытке создания вызова произошла ошибка!');
			}
		});
	}
	// Совершаем звонок при клике на изображение:
	/*$('.outboundCall').on('click', function()
	{
		var link = $(this).attr('href');
		
		$.ajax({
			url: link,
			type: 'get',
			error: function()
			{
				alert('При попытке создания вызова произошла ошибка!');
			}
		});
		
		return false;
	});*/
});