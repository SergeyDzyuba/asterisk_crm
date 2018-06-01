{*
 * Part of SugarTalk Asterisk module
 * © 2012 sugartalk.net | D1ma Z.
 *}

<div class="moduleTitle">
	<h2>{$MOD.LBL_ASTERISK_TITLE}</h2>
</div>

<form name="asterisk" method="post">
	<table width="100%" cellpadding="0" cellspacing="0" border="0">
		<tr>
			<td style="padding-bottom: 2px;">
				<input title="{$APP.LBL_SAVE_BUTTON_TITLE}" accessKey="{$APP.LBL_SAVE_BUTTON_KEY}" class="button"  type="submit"  name="save" value="{$APP.LBL_SAVE_BUTTON_LABEL}" />
				&nbsp;
				<input title="{$APP.LBL_CANCEL_BUTTON_TITLE}" onclick="document.location.href='index.php?module=Administration&action=index'" class="button"  type="button" name="cancel" value="{$APP.LBL_CANCEL_BUTTON_LABEL}" />
			</td>
		</tr>
		<tr>
			<td>
				<table width="100%" border="0" cellspacing="0" cellpadding="0" class="tabForm">
					{foreach from=$vardefs key=key item=value}
						<tr>
							<td>
								<table width="100%" border="0" cellspacing="0" cellpadding="0">
									<tr>
										<td nowrap width="20%" class="dataLabel">{assign var=vname value=$value.vname}{$MOD.$vname}:</td>
										<td width="80%" class="dataField">
											<input type='{$type}' name='{$value.name}' size="45" value='{assign var=name value=$value.name}{if empty($sugar_config.$name) }{$value.default}{else}{$sugar_config.$name}{/if}' />
										</td>
									</tr>
								</table>
							</td>
						</tr>
					{/foreach}
				</table>
			</td>
		</tr>
		<tr>
			<td style="padding-bottom: 2px;">
				<input title="{$APP.LBL_SAVE_BUTTON_TITLE}" accessKey="{$APP.LBL_SAVE_BUTTON_KEY}" class="button"  type="submit"  name="save" value="{$APP.LBL_SAVE_BUTTON_LABEL}" />
				&nbsp;
				<input title="{$APP.LBL_CANCEL_BUTTON_TITLE}" onclick="document.location.href='index.php?module=Administration&action=index'" class="button" type="button" name="cancel" value="{$APP.LBL_CANCEL_BUTTON_LABEL}" />
			</td>
		</tr>
	</table>
</form>

{$JAVASCRIPT}