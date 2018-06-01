{*
 * Part of SugarTalk Asterisk module
 * © 2012 sugartalk.net | D1ma Z.
 *}

{if !empty({{sugarvar key='value' string=true}})}
{assign var="phone_value" value={{sugarvar key='value' string=true}} }

{sugar_phone value=$phone_value usa_format="{{if !empty($vardef.validate_usa_format)}}1{{else}}0{{/if}}"}

{{if !empty($displayParams.enableConnectors)}}
{{sugarvar_connector view='DetailView'}}
{{/if}}

{php}
global $current_user;
$this->assign('asterisk_dial_buttons', $current_user->asterisk_dial_buttons);
{/php}

{if ($asterisk_dial_buttons == 1)}
	{if (!empty($phone_value))}
		<a href="#" onclick="outboundCall('{$phone_value}')" class="outboundCall" title="Создать вызов" style="text-decoration: none;">
			<img src="modules/Asterisk/img/call_active.gif" />
		</a>
	{/if}
{/if}

{/if}