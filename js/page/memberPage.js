
/* 
 * ファイル名:memberPage.js
 * 概要  :会員トップページ用のjsファイル
 * 作成者:T.Yamamoto
 * 作成日:2015.08.04
 * パス :/js/page/memberPage.js
 */

/* 
 * 関数名:createMemberFinishedLessonContent
 * 概要  :会員ページの受講済み授業タブの内容を作る
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.20
 */
function createMemberFinishedLessonContent() {
	//受講済み授業の絞り込み領域を作る
	create_tag.outputTag('selectTheme', 'selectTheme', '#finishedLesson');
	//受講済みテーブルページングの一番外側となる領域を作る
	create_tag.outputTag('finishedLessonPagingArea', 'divArea', '#finishedLesson');
	//ページングのテーブルを作るためにテーブルの外側となるdivを作る
	create_tag.outputTag('finishedLessonTableOutside', 'divArea', '.finishedLessonPagingArea');
	// ナンバリング領域を作る
	create_tag.outputTag('numberingOuter', 'numberingOuter', '.finishedLessonPagingArea');
	//受講済み授業一覧のデータを取り出す
	create_tag.getJsonFile(URL_GET_JSON_ARRAY_PHP, create_tag.json['finishedLessonTable'], 'finishedLessonTable');
	//ページング機能付きでメルマガテーブルを作る
	create_tag.outputNumberingTag('finishedLessonTable', NUMBERING_START, NUMBERING_PAGE, NUMBERING_DEFAULT, NUMBERING_DISPLAY, '.finishedLessonTableOutside', 'finshedLessonTableAfterPaging');
	//授業の絞り込み機能を実装する
	setConfigFinishedLesson()
}

/* 
 * 関数名:setConfigFinishedLesson
 * 概要  :受講済み授業タブの設定を行う。
 		設定内容は授業の絞り込み機能
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.08.29
 */
function setConfigFinishedLesson() {
	//セレクトボックスのvalueを画面に表示されている値にする
	create_tag.setSelectboxValue('.selectThemebox');
	//絞り込み機能を実装する
	finshedLessonTableThemeSelect();
}

/*
 * 関数名:finshedLessonTableAfterPaging
 * 概要  :会員トップ、受講済みテーブルでページングボタンがクリックされた時や
 		テーマでの絞り込み機能でテーブルをリロードした後にテーブルの値を置換する処理を行う
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.30
 */
function finshedLessonTableAfterPaging() {
	//受講済みテーブルを編集が終わるまで表示しなくする
	$('.finishedLessonTable').hide();
	//時間差で表現するためにsetTimeOutを使う
	setTimeout(function(){
		//ページングの処理を行う件数を取得するためにページングの現在のページを取得する
		var nowPageNumber = Number($('.select').text() - 1);
		//テーブルのデータを取得する
		var tableData = create_tag.json.finishedLessonTable[TABLE_DATA_KEY];
		//テーブルのレコード数を取得する
		var recordCount = Number(tableData.length);
		//今のページングの値が最大値なら行数の最大値、違うならページングの最後の行の値をループの終わり値とする
		var loopEndCount = loopEndCount >= recordCount ? recordCount-1 : nowPageNumber * 10 + 9;
		//テーブルのループのための行番号を取得する
		var rowNumber = 1;
		//ループで受講済みテーブルを編集する
		//ループの開始の値を算出する(loopStartCount)
		for(var loopStartCount = nowPageNumber * 10; loopStartCount <= loopEndCount; loopStartCount++) {
			//走査対象のデータがなければ
			if(tableData[loopStartCount] === void(0)){
				break;	//ループを抜ける
			}
			
			//テーブルの値を置換する
			callMemberLessonValue('.finishedLessonTable', tableData, loopStartCount, rowNumber);
			//行番号をインクリメントして次の行についてのループに備える
			rowNumber++;
		}
		//受講済みテーブルを表示する
		$('.finishedLessonTable').show();
	},1);
}

/*
 * 関数名:finshedLessonTableThemeSelect
 * 概要  :会員top、受講済み授業一覧のテーブルをテーマのセレクトボックスが変更されたときに変換するイベントを登録する
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.30
 */
function finshedLessonTableThemeSelect() {
	//ページングがクリックされた時のイベントを登録する
	$(STR_BODY).on(CHANGE, '#finishedLesson .selectThemebox', function() {
		//テーブルを作るためのクエリを置換する
		create_tag.replaceTableQuery('finishedLessonTable');
		//ページングに使うものを初期化し、ページングを作り直すために備える
		create_tag.pagingReset('finishedLessonTable');
		//クエリを発行してDBから対象のデータの受講済み授業一覧のデータを取り出す
		create_tag.getJsonFile(URL_GET_JSON_ARRAY_PHP, create_tag.json.finishedLessonTable, 'finishedLessonTable');
		//ページング機能付きで受講済みテーブルを作り直す
		create_tag.outputNumberingTag('finishedLessonTable', NUMBERING_START, NUMBERING_PAGE, NUMBERING_DEFAULT, NUMBERING_DISPLAY, '.finishedLessonTableOutside', 'finshedLessonTableAfterPaging');
	});
}

function setSuggestionBoxSendEvent(selector){
	//送信ボタンがクリックされた時、入力されているデータを取得してDBを更新し、メールを送信する
	$(selector).on(CLICK, function() {
		
		//ダイアログ用オブジェクトを作る
		var dialogObj = $.extend(true, {}, commonFuncs.getDefaultArgumentObject());
		dialogObj.config.title = '送信確認'; 
		dialogObj.data.message = '入力した内容を送信します。'; 
		//送信するデータをオブジェクトに統合する
		$.extend(true, dialogObj.data, {callback : commonFuncs.sendMemberMail, user_key : create_tag.getUserId()});
		
		//メール送信ダイアログを作る
		var mailSendDialog = new dialogEx('dialog/confirmDialog.html', dialogObj);
		mailSendDialog.setCallbackClose(dialogDestroy);	//閉じるときのイベントを登録
		mailSendDialog.run();	//主処理を走らせる
	});
}
