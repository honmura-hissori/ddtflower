﻿/* 
 * ファイル名:adminPage.js
 * 概要  :管理者ページ用のjsファイル
 * 作成者:T.Yamamoto
 * 作成日:2015.08.04
 * パス :/js/page/adminPage.js
 */

/* 
 * 関数名:createAdminPermitLessonContent
 * 概要  :管理者ページの受講承認タブの内容を作る
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.20
 */
function createAdminPermitLessonContent () {
	//受講承認タブのコンテンツ
	//タブ
	creator.outputTag('lecturePermitTab', 'tabContainer', '#lecturePermit' );
	//受講承認タブ
	creator.outputTag('doLecturePermit','tabInContent', '.lecturePermitTab');
	//受講承認一覧タブ
	creator.outputTag('lecturePermitList','tabInContent', '.lecturePermitTab');
	// 受講承認テーブル用のJSON配列を取得する
	creator.getJsonFile('php/GetJSONArray.php', creator.json['doLecturePermitInfoTable'], 'doLecturePermitInfoTable');
	//データがあればテーブルを追加する
	if(creator.json.doLecturePermitInfoTable[TABLE_DATA_KEY]) {
		//受講承認タブのリストテーブル
		creator.outputTagTable('doLecturePermitInfoTable', 'doLecturePermitInfoTable', '#doLecturePermit');
		//受講承認のボタン
		creator.outputTag('doLecturePermitButton', 'normalButton', '#doLecturePermit');
		//アコーディオンのセレクトボックスにいれるため受講承認の備品名JSON配列を取得する
		creator.getJsonFile('php/GetJSONArray.php', creator.json['selectCommodityInf'], 'selectCommodityInf');
	}
	//タブを作る
	creator.createTab('.lecturePermitTab');

	//受講承認のテーブルにチェックボックスを追加する
	creator.addCheckbox('permitCheckboxArea', 'permitCheckbox');
	//受講承認のテーブルを置換する
	dbDataTableReplaceExecute(DOT + DO_LECTURE_PERMIT_INFO_TABLE, creator.json[DO_LECTURE_PERMIT_INFO_TABLE][TABLE_DATA_KEY], DO_LECTURE_PERMIT_INFO_TABLE_REPLACE_FUNC);

	//受講承認のアコーディオンの備品名にセレクトボックスの値をDBから取り出した値で追加する
	creator.setSelectboxText(creator.json.selectCommodityInf[TABLE_DATA_KEY], creator.json.accordionContent.contentCell.contentSelect.contentOption, 'commodity_name');
	//備品代の連想配列にDBから取り出した最初の値をデフォルトで入れる
	setDefaultSellingPrice();
	//受講承認テーブルでアコーディオン機能を実装するために可変テーブルの行にクラス属性を付ける
	setTableRecordClass('doLecturePermitInfoTable', 'lecturePermitAccordion');
	//受講承認テーブルのアコーディオン機能の中身の行をテーブルに挿入する
	creator.insertTableRecord('lecturePermitAccordion', 'accordionContent');
	//アコーディオンのコンテントの中に隠れテキストボックスとして備品idを入れる
	creator.outputTag('commodityKeyBox','commodityKeyBox', '.accordionContent');
	//受講承認テーブルのアコーディオン機能の概要の行をテーブルに挿入する
	creator.insertTableRecord('lecturePermitAccordion', 'accordionSummary');
	//受講承認テーブルがクリックされた時にアコーディオン機能を実装する
	creator.accordionSettingToTable('.lecturePermitAccordion', '.accordionSummary');
	creator.accordionSettingToTable('.lecturePermitAccordion', '.accordionContent');
	//受講承認テーブルのチェックボックスですべてのチェックボックスにチェックを入れる関数を実行する
	allCheckbox('.permitCheckbox:eq(0)', '.permitCheckbox');
	//受講承認の備品名セレクトボックスにvalueを入れる
	creator.setSelectboxValue('.contentSelect');
	//受講承認の備品名セレクトボックスが変化したときに備品代が変わるイベントを登録する
	setSellingPrice('.contentCell', '.accordionContent');
	//受講承認テーブルアコーディオンの会計のテキストボックスにデフォルト値を設定する
	setDefaultCommodityCostPrice();
	//受講承認テーブルの会計列を備品名が変化した時に自動でセットする
	setCommodityCostPrice('.contentSelect');
	//受講承認テーブルの会計列を個数が変化した時に自動でセットする
	setCommodityCostPrice('.sellNumberTextbox');
	//受講承認一覧タブをクリックしたときに受講承認一覧の内容を表示する
	creator.createContentTriggerClick('.tabLink[href="#lecturePermitList"]', createAdminPermitLessonListContent);
	//承認ボタンクリックでデータを更新する
	loopUpdatePermitLesson();
}

/* 
 * 関数名:createAdminPermitLessonListContent
 * 概要  :管理者ページの受講承認一覧タブの内容を作る
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.20
 */
function createAdminPermitLessonListContent() {
	//受講承認一覧の検索領域を作る
	creator.outputTag('permitListSearch', 'permitListSearch', '#lecturePermitList');
	//受講承認一覧で今月の初日から末日を検索するのをデフォルトにする
	setPermitListFromToDate();
	//受講承認一覧テーブル外枠を作る
	creator.outputTag('lecturePermitListInfoTableOutsideArea', 'divArea', '#lecturePermitList');
	//受講承認一覧テーブルを作る
	creator.tableReload('lecturePermitListInfoTable')
	//受講承認一覧のリスト更新ボタン
	creator.outputTag('lecturePermitListUpdateButton', 'normalButton', '#lecturePermitList');
	//クリックでテキストボックスにカレンダーを表示する
	//clickCalendar('fromSearach');
	//クリックでテキストボックスにカレンダーを表示する
	//clickCalendar('toSearach');
	//受講承認一覧の検索機能を実装する
	searchPermitListInfoTable();
	//受講承認一覧の備品名にセレクトボックスの値をDBから取り出した値で追加する
	creator.setSelectboxText(creator.json.selectCommodityInf[TABLE_DATA_KEY], creator.json.contentSelect.contentOption, 'commodity_name');
	//受講承認の備品名セレクトボックスが変化したときに備品代が変わるイベントを登録する
	setSellingPrice('.lecturePermitListRecord', '.lecturePermitListRecord');
	//更新ボタンがクリックされたときにデータを更新するイベントを登録する
	loopUpdatePermitLessonList();
}

/* 
 * 関数名:createAdminUserListContent
 * 概要  :管理者ページのユーザ一覧タブの内容を作る
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.20
 */
function createAdminUserListContent() {
	// ユーザ検索テキストボックス
	creator.outputTag('searchUserList', 'searchUserList', '#userList');
	//ユーザ一覧ページングの一番外側となる領域を作る
	creator.outputTag('userListPagingArea', 'divArea', '#userList');
	//ページングのテーブルを作るためにテーブルの外側となるdivを作る
	creator.outputTag('userListTableOutside', 'divArea', '.userListPagingArea');
	// ナンバリング領域を作る
	creator.outputTag('numberingOuter','numberingOuter','.userListPagingArea');
	//会員一覧のデータを取り出す
	creator.getJsonFile('php/GetJSONArray.php', creator.json['userListInfoTable'], 'userListInfoTable');
	//ページング機能付きでユーザ情報一覧テーブルを作る
	creator.outputNumberingTag('userListInfoTable', 1, 4, 1, 15, '.userListTableOutside', 'afterReloadUserListInfoTable');
	//会員一覧タブのボタン群れ
	creator.outputTag('userListButtons', 'userListButtons', '#userList');
	//会員一覧の検索の中にあるテキストボックスにフォーカスしているときにエンターキー押下で検索ボタンを自動でクリックする
	enterKeyButtonClick('.adminUserSearch', '.searchUserButton');
	//会員一覧テーブルがクリックされた時にuserSelectクラスをがなければ追加しあるなら消去する
	toggleClassClickElement('.userListInfoTable tr', 'selectRecord');
	//検索ボタンをクリックしたときにテーブルの内容を更新する
	userListSearch();
	//詳細設定ボタンがクリックされたときになり代わりログインを行うかアラートを表示するかのイベントを登録する
	jumpToMemberPage();
	//通常メールボタンをクリックしたときに通常メール作成のためのダイアログを開く
	adminMessageCreate('.createMail', 'mail');
	//お知らせボタンをクリックしたときにお知らせのためのダイアログを開く
	adminMessageCreate('.announceButton', 'announce');
}

/* 
 * 関数名:createAdminLessonDetailContent
 * 概要  :管理者ページの授業詳細タブの内容を作る
 * 引数  :createTag create_tag:createTag、またはcreateTagのサブクラスのインスタンス
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.20
 */
function createAdminLessonDetailContent(create_tag) {
	//授業詳細タブ内にカレンダ-作る
	create_tag.outputTag('adminCalendar', 'adminCalendar', '#lessonDetail');
	// 講座のカレンダーを作り、クリックでダイアログ作成を作る
	var lessonCalendar = new adminCalendar('.adminCalendar', create_tag);
	lessonCalendar.create();	//カレンダーを実際に作成する
}

/* 
 * 関数名:createAdminMailMagaAnnounceContent
 * 概要  :管理者ページの授業詳細タブの内容を作る
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.20
 */
function createAdminMailMagaAnnounceContent() {
	var creator = new createLittleContents();

	// ユーザーページのパーツのテンプレートのJSONを取得する。
	creator.getJsonFile('source/commonUser.json');
	// 管理者ページ共通のパーツのJSONを取得する。
	creator.getJsonFile('source/adminCommon.json');
	//共通のjsonを取得する
	creator.getJsonFile('source/commonJson.json');

	// ユーザーページのパーツのテンプレートのDOMを取得する。
	creator.getDomFile('template/commonUser.html');
	// 管理者ページ共通のパーツのJSONを取得する。
	creator.getDomFile('template/adminCommon.html');
	// 共通パーツのDOMを取得する
	creator.getDomFile('template/common.html');
	
	//メルマガ＆アナウンスタブのコンテンツ
	//過去のメルマガを検索するための領域を作る
	creator.outputTag('mailMagaSearchArea', 'mailMagaSearchArea', '#mailMagaAndAnnounce');
	//メルマガページングの一番外側となる領域を作る
	creator.outputTag('mailMagaPagingArea', 'divArea', '#mailMagaAndAnnounce');
	//ページングのテーブルを作るためにテーブルの外側となるdivを作る
	creator.outputTag('mailMagaTableOutside', 'divArea', '.mailMagaPagingArea');
	// ナンバリング領域を作る
	creator.outputTag('numberingOuter','numberingOuter','.mailMagaPagingArea');
	//メルマガのデータを取り出す
	creator.getJsonFile(URL_GET_JSON_ARRAY_PHP, creator.json['mailMagaTable'], 'mailMagaTable');
	//ページング機能付きでメルマガテーブルを作る
	creator.outputNumberingTag('mailMagaTable', 1, 4, 1, 15, '.mailMagaTableOutside', 'afterReloadMailMagaTable');

	//メルマガ検索機能を実装する
	mailMagaSearch();
	//メルマガテーブルをクリックしたときにその内容をテキストボックスに反映させる
	setMailMagaSendContent();
	//メルマガ・アナウンス入力領域を作る
	creator.outputTag('mailMagaAndAnnounceArea', 'mailMagaAndAnnounceArea', '#mailMagaAndAnnounce');
	//メルマガ送信処理を行う、メルマガ送信確認ダイアログを作る
	mailMagaSendConfirm();
	//削除ボタンがクリックされたとき、テキストボックスの中身も空白にする
	resetMailMageSendContent();
	//メルマガ検索領域の内容テキストボックスでエンターキーを押すと検索のイベントを開始する
	enterKeyButtonClick('.mailMagaContentSearchTextbox', '.mailMagaSearchButton');
}

/* 
 * 関数名:clickEvent
 * 概要  :クリックイベントを登録する
 * 引数  :clickSelector:クリックされた要素のセレクター。
 		:clickFunc：クリックされたときにコールする関数
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.08.29
 */
function clickEvent(clickSelector, clickFunc) {
	$(clickSelector).click(function() {
		//コールバック関数の処理を開始する
		clickfunc(this);
	});
}

/* 
 * 関数名:toggleClassClickElement
 * 概要  :クリックした要素に対してクラス属性を付ける
 * 引数  :clickSelector:クリックされた要素のセレクター。
 		:clickFunc：クリックされたときにコールする関数
 * 返却値  :なし
 * 作成者:.Yamamoto
 * 作成日:2015.08.29
 */
function toggleClassClickElement (clickSelector, className) {
	//会員一覧テーブルがクリックされた時にuserSelectクラスをがなければ追加しあるなら消去する
	$(STR_BODY).on(CLICK, clickSelector, function(){
		//userSelectクラスを追加したり消したりする。このクラスがあればユーザが選択されているとみなしてボタン処理を行うことができる
		$(this).toggleClass(className);
	});
}

/* 
 * 関数名:dateMovement
 * 概要  :日付の進退を求めて返す。管理者日ごと授業者一覧の日付の進退の表示で使う
 * 引数  :clickSelector:クリックされた要素のセレクター。
 		:nowDateObject：進退の対象となる日付オブジェクトのデータ
 * 返却値  :nowDateString:進退した日付の結果
 * 作成者:T.Yamamoto
 * 作成日:2015.08.29
 */
function dateMovement(clickSelector, nowDateObject) {
	//クリックされたクラス名を取得する
	var className = $(clickSelector).attr('class');
	//取得したクラスの名前によって処理を分ける
	switch(className) {
		//クリックされたのが2日前の時、日付を2日前にする
		case 'twoDaysBefore':
		nowDateObject.setDate(nowDateObject.getDate() - 2);
		break;
		//クリックされたのが1日前の時、日付を1日前にする
		case 'oneDayBefore':
		nowDateObject.setDate(nowDateObject.getDate() - 1);
		break;
		//クリックされたのが1日後の時、日付を1日後にする
		case 'oneDayAfter':
		nowDateObject.setDate(nowDateObject.getDate() + 1);
		break;
		//クリックされたのが2日後の時、日付を2日後にする
		case 'twoDayAfter':
		nowDateObject.setDate(nowDateObject.getDate() + 2);
		break;
	}
	//日付が進退した結果を取り出す
	var nowDateString = creator.getDateFormatDB(nowDateObject);
	return nowDateString;
}

/* 
 * 関数名:updateDateMovement
 * 概要  :進退の領域をクリックしたときに日付を更新する
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.08.29
 */
var updateDateMovement = function(clickSelector) {
	//日付を更新する
	nowDateString = dateMovement(clickSelector, nowDateObject);
	//jsonに日付の値を入れる
	creator.json['eachDayReservedInfoTable']['lesson_date']['value'] = nowDateString;
	//テーブルをリロードする
	creator.tableReload('eachDayReservedInfoTable');
	//日付をタイトルに入れる
	$(DOT + clickSelectorParent + ' p').text(nowDateString);
}

/* 
 * 関数名:updateDateSearch
 * 概要  :日付検索をクリックした時の処理
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.08.29
 */
var updateDateSearch = function () {
	//表示されている日付を更新するために検索する日付のデータを取得する。
	var changeDate = $('.dateInput').val();
	//現在表示されている日付を入力された日付で更新する
	$(DOT + clickSelectorParent + ' p').text(changeDate)
	//日付オブジェクトを検索された値で更新し、ページングの基準となる値にする
	nowDateObject = new Date(changeDate);
	//日ごと授業者一覧テーブルをリロードする
	creator.eventTableReload('eachDayReservedInfoTable');
}

/* 
 * 関数名:nowDatePaging
 * 概要  :現在の日付からページング機能を実装する
 * 引数  :clickSelectorParent:クリックボタンのセレクター
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.06
 */
function nowDatePaging(clickSelectorParent, creator) {
	//現在時刻のオブジェクトを作る
	var nowDateObject = new Date();
	//日付の文字列を取得する
	var nowDateString = creator.getDateFormatDB(nowDateObject);
	//日付をタイトルに入れる
	$(DOT + clickSelectorParent + ' p').text(nowDateString);
	//jsonに日付の値を入れる
	//creator.json['eachDayReservedInfoTable']['lesson_date']['value'] = nowDateString;
	//対象の要素がクリックされたときに日付を進退する
	clickEvent(DOT + clickSelectorParent + ' a', updateDateMovement);
	//検索ボタンがクリックされた時に日付を更新する
	clickEvent(DOT + 'dateSelect .searchButton', updateDateSearch);
}

/* 
 * 関数名:setPermitListFromToDate
 * 概要  :受講承認一覧の検索する日付の範囲をデフォルトでは月の初日から末日に設定する
 * 引数  :なし
 		:なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.14
 */
function setPermitListFromToDate() {
	//今日の日付を取得する
	var today = new Date();
	//今月の初日オブジェクトを取得する
	var monthStartday = new Date(today.getFullYear(), today.getMonth(), 1);
	//今月の初日の日付を取得して、受講承認一覧のfromの部分で使う
	monthStartday = creator.getDateFormatDB(monthStartday);
	//今月の末日オブジェクトを取得する
	var monthEndday = new Date(today.getFullYear(), today.getMonth() + 1, 0);
	//今月の末日の日付を取得して、受講承認一覧のtoの部分で使う
	monthEndday = creator.getDateFormatDB(monthEndday);
	//受講承認一覧に今月の初日を入れて一覧テーブルを検索するようにする
	creator.json.lecturePermitListInfoTable.FromDate.value = monthStartday;
	//受講承認一覧に今月の末日を入れて一覧テーブルを検索するようにする
	creator.json.lecturePermitListInfoTable.toDate.value = monthEndday;
	//デフォルトの検索値を分かりやすくするためにfromテキストボックスに月の初日の値を入れる
	$('[name=fromSearach]').val(monthStartday);
	//デフォルトの検索値を分かりやすくするためにtoテキストボックスに月の末日の値を入れる
	$('[name=toSearach]').val(monthEndday);
}

/* 
 * 関数名:searchPermitListInfoTable
 * 概要  :受講承認一覧の検索機能を実装する
 * 引数  :なし
 		:なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.14
 */
function searchPermitListInfoTable() {
	//受講承認の検索ボタンをクリックした時のイベント
	$('.permitListSearch .searchButton').click(function(){
		//検索初めの値を取得する
		var fromDate = $('[name=fromSearach]').val();
		//検索終わりの値を取得する
		var toDate = $('[name=toSearach]').val();
		//受講承認一覧の連想配列に検索初めの値を入れる
		creator.json.lecturePermitListInfoTable.FromDate.value = fromDate;
		//受講承認一覧の連想配列に検索終わりの値を入れる
		creator.json.lecturePermitListInfoTable.toDate.value = toDate;
		//テーブルを更新する
		creator.tableReload('lecturePermitListInfoTable');
	});
}

/* 
 * 関数名:getCommodityCostPrice
 * 概要  :受講承認テーブルで個数テキストボックスと備品代テキストボックスの値を掛け合わせた合計を返す
 		:会計テキストボックスの値を自動で変更するために値を取得するための関数
 * 引数  :rowNumber:行の何番目にあるテキストボックスが対象なのかを示す番号
 * 返却値  :commodityCostPrice:備品代の会計テキストボックスに入る値
 * 作成者:T.Yamamoto
 * 作成日:2015.07.17
 */
function getCommodityCostPrice(rowNumber) {
	//備品代の合計を求めるために購入した備品の価格を取得する
	var sellingPrice = $('.sellingPriceTextbox').eq(rowNumber).val();
	//備品代の合計を求めるために購入した個数を取得する
	var sellNumber = $('.sellNumberTextbox').eq(rowNumber).val();
	//取得した値から備品の合計金額を求める
	var commodityCostPrice = sellingPrice * sellNumber;
	//求めた金額を他でも使えるようにするため、返り値として返す
	return commodityCostPrice;
}

/* 
 * 関数名:setDefaultCommodityCostPrice
 * 概要  :ページの初期読み込み時に会計のデフォルト値を設定する
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.17
 */
function setDefaultCommodityCostPrice() {
	//会計のデフォルト値を設定するために会計の値を取得する
	var commodityCostPrice = getCommodityCostPrice(0);
	//会計の連想配列にデフォルト値を設定する
	$('.payCashTextbox').val(commodityCostPrice);
}

/* 
 * 関数名:setCommodityCostPrice
 * 概要  :受講承認テーブル会計の値を設定する
 * 引数  :changeSelector:changeイベントを当てるセレクター
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.17
 */
function setCommodityCostPrice(changeSelector) {
	//備品名、または個数が変化した時に会計の値をセットするイベントを登録する
	$(STR_BODY).on('change', changeSelector, function(){
		//他の行の備品代テキストボックスの値を変更しないために変更されたセレクトボックスが何番目のものなのかを取得する
		var contentSelectNumber = $(changeSelector).index(this);
		//会計のデフォルト値を設定するために会計の値を取得する
		var commodityCostPrice = getCommodityCostPrice(contentSelectNumber);
		//会計のテキストボックスの値を設定する
		$('.payCashTextbox').eq(contentSelectNumber).val(commodityCostPrice);
	});
}

/* 
 * 関数名:setSellingPrice
 * 概要  :受講承認テーブルの備品代を自動でセットする。
 		備品によって値段が異なるので備品名のセレクトボックスの値が変わったときに
 		備品名に対応した値段をテキストボックスに入れる
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.17
 */
function setSellingPrice(selectboxParentSelector, textboxParentSelector) {
	//備品名セレクトボックスの値が変更されたときに備品代を変えるイベントを開始する
	//イベントをonで登録しているのは違うページを読み込むときにイベントをoffにしやすくするため
	$(STR_BODY).on(CHANGE, selectboxParentSelector + ' .contentSelect', function(){
		//他の行の備品代テキストボックスの値を変更しないために変更されたセレクトボックスが何番目のものなのかを取得する
		var contentSelectNumber = $(selectboxParentSelector + ' .contentSelect').index(this);
		//選択されているテキストを取得し、備品名を取り出すための値を取り出すために使う
		var contentName = $(selectboxParentSelector + ' .contentSelect').eq(contentSelectNumber).val();
		//備品代の値を取得するための変数を作る
		var sellingPrice;
		//備品idを取り出すための変数を作る
		var commodityKey;
		//取り出した行のデータを数えるためにカウンターを変数を作る
		var counter = 0;
		//行データを変数に入れる
		var rowData = creator.json.selectCommodityInf[TABLE_DATA_KEY]
		//取り出したデータの数だけループし、価格を取り出す
		$.each(rowData, function(){
			//取得した備品名と比較するためにループしている備品名を取得する
			var commodityName = rowData[counter].commodity_name;
			//取得した備品名とセレクトボックスの中にあるタグの名前が同じときにその番号を取得する
			if (contentName == commodityName) {
				//備品代をテキストボックスに入れるための番号を取得する
				sellingPrice = creator.json.selectCommodityInf[TABLE_DATA_KEY][counter].selling_price;
				//備品idをテキストボックスに入れるための番号を取得する
				commodityKey = creator.json.selectCommodityInf[TABLE_DATA_KEY][counter].commodity_key;
			}
			counter++;
		});
		//備品代テキストボックスに備品名に対応した値段を入れる
		$('.sellingPriceTextbox').eq(contentSelectNumber).val(sellingPrice);
		//備品idテキストボックスに備品名に対応した値段を入れる
		$(textboxParentSelector + ' .commodityKeyBox').eq(contentSelectNumber).val(commodityKey);
	});
}

/* 
 * 関数名:setDefaultSellingPrice
 * 概要  :受講承認テーブルの備品代をページ読み込み時に自動でセットする。
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.17
 */
function setDefaultSellingPrice() {
	//備品代の連想配列にデフォルト値を設定する
	creator.json.accordionContent.sellingPrice.sellingPriceTextbox.value = creator.json.selectCommodityInf[TABLE_DATA_KEY][0].selling_price;
	//備品idの連想配列にデフォルト値を設定する
	creator.json.commodityKeyBox.value = creator.json.selectCommodityInf[TABLE_DATA_KEY][0].commodity_key;
}

/* 
 * 関数名:isBuyCommodity
 * 概要  :受講承認の承認ボタンがクリックされた時に備品を購入したかどうかを判定する
 * 引数  :sendReplaceArray
 * 返却値  :resultBool:判定結果
 * 作成者:T.Yamamoto
 * 作成日:2015.07.21
 */
function isBuyCommodity (sendReplaceArray) {
	//備品を購入していたらtrueにする
	var resultBool = true;
	//備品を購入していないときにfalseにする
	if(sendReplaceArray.pay_cash <= 1) {
		resultBool = false;
	}
	return resultBool;
}

/* 
 * 関数名:permitDataUpdate
 * 概要  :受講承認テーブルの承認ボタンが押された時に1行ずつ値を取得して1行ずつDBの値を更新してする
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.17
 */
function permitDataUpdate(sendReplaceArray, boolRule, trueQueryKey, falseQueryKey) {
	var sendQueryArray = creator.choiceSendQueryArray(boolRule, trueQueryKey, falseQueryKey);
	//クエリのデフォルトを取得してあとから元の戻せるようにする
	var defaultQuery = sendQueryArray.db_setQuery;
	//ユーザがポイントを使用したときにポイント使用のクエリを追加する
	sendQueryArray = creator.addUsePointQuery(sendQueryArray, sendReplaceArray);
	//クエリを実行してテーブルの値1行ずつ更新していく
	creator.setDBdata(sendQueryArray, sendReplaceArray, '');
	//ループで実行するので置換データ連想配列を初期化する
	sendQueryArray.db_setQuery = defaultQuery;
}

/* 
 * 関数名:loopUpdatePermitLesson
 * 概要  :受講承認テーブルの承認ボタンが押された時に1行ずつ値を取得して1行ずつDBの値を更新してする
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.17
 */
function loopUpdatePermitLesson() {
	//受講承認の承認ボタンをクリックされた時にDBのデータを更新するイベントを登録する
	$(STR_BODY).on(CLICK, '.doLecturePermit .normalButton', function(){
		//受講承認テーブルの行を1行ごとに更新するため、1行を特定するためにカウンタを作る
		var counter = 0;
		//受講承認一覧テーブルの対象となる行の数だけループしてデータを更新していく
		$('.lecturePermitAccordion').each(function() {
			//チェックボックスにチェックが入っているものだけを更新するように条件設定する
			if($('.permitCheckbox').eq(counter+1).prop('checked')) {
				//DBを更新するための値を取得するために置換する連想配列を取得する
				var sendReplaceArray = creator.getSendReplaceArray('doLecturePermitInfoTable', counter, 'accordionContent:eq(' + counter + ')');
				//加算ポイントレートを取得する
				var lessonPlusPointRate = creator.getUserPlusPointRate('lecturePermitPlusPointRate', sendReplaceArray.students, sendReplaceArray.lesson_key);
				//受講料から加算ポイントを求める
				sendReplaceArray['lessonPlusPoint'] = creator.getUserPlusPoint(sendReplaceArray['user_classwork_cost'], lessonPlusPointRate);
				//備品代から加算ポイントを求める
				sendReplaceArray['commodityPlusPoint'] = creator.getCommodityPlusPoint('commodityPlusPoint', sendReplaceArray)
				//受講承認データを更新する
				permitDataUpdate(sendReplaceArray, isBuyCommodity(sendReplaceArray), 'permitLessonContainCommodity', 'permitLessonUpdate');
			}
			//カウンターをインクリメントする
			counter++;
		});
	});
}

/* 
 * 関数名:loopUpdatePermitLessonList
 * 概要  :受講承認一覧テーブルの更新ボタンが押された時に1行ずつ値を取得して1行ずつDBの値を更新する
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.17
 */
function loopUpdatePermitLessonList() {
	var thisElem = this;
	//受講承認一覧の更新ボタンをクリックされた時にDBのデータを更新するイベントを登録する
	$(STR_BODY).on(CLICK, '#lecturePermitList .normalButton', function(){
		//受講承認一覧テーブルの行を1行ごとに更新するため、1行を特定するためにカウンタを作る
		var counter = 0;
		//受講承認一覧テーブルの対象となる行の数だけループしてデータを更新していく
		$('.lecturePermitListRecord').each(function() {
				//DBを更新するための値を取得するために置換する連想配列を取得する
				var sendReplaceArray = creator.getSendReplaceArray('lecturePermitListInfoTable', counter, 'lecturePermitListRecord:eq(' + counter + ')');
				//受講承認一覧データを更新する
				permitDataUpdate(sendReplaceArray, sendReplaceArray.lesson_name == "", 'updatePermitListCommoditySell', 'updatePermitListLesson');
			//カウンターをインクリメントする
			counter++;
		});
	});
}

/* 
 * 関数名:userListSearch
 * 概要  :管理者 会員一覧の検索機能を有効にする
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.08.29
 */
function userListSearch() {
//検索ボタンをクリックしたときにテーブルの内容を更新する
	$(STR_BODY).on(CLICK, '.searchUserButton', function() {
		//ユーザ一覧テーブルを削除する
		creator.pagingReset('userListInfoTable');
		//クエリのデフォルトを取得する
		var defaultQuery = creator.json.userListInfoTable.db_getQuery;
		//クエリを変数に入れてクエリ発行の準備をする
		var sendQuery = {db_getQuery:new adminUserSearcher().execute()}
		//会員一覧のデータを取り出す
		creator.getJsonFile(URL_GET_JSON_ARRAY_PHP, sendQuery, 'userListInfoTable');
		//クエリをデフォルトに戻す
		creator.json.userListInfoTable.db_getQuery = defaultQuery;
		//取得した値が0の時のテーブルを作らない
		if(creator.json.userListInfoTable[TABLE_DATA_KEY].length != 0) {
			//ページング機能付きでユーザ情報一覧テーブルを作る
			creator.outputNumberingTag('userListInfoTable', 1, 4, 1, 15, '.userListTableOutside', 'afterReloadUserListInfoTable');
		}
	});
}

/* 
 * 関数名:jumpToMemberPage
 * 概要  :管理者 会員一覧で選択されているユーザの会員ページに接続する
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.08.29
 */
function jumpToMemberPage() {
	//詳細設定ボタンがクリックされたときになり代わりログインを行うかアラートを表示するかのイベントを登録する
	$(STR_BODY).on(CLICK, '.userDetail', function(){
		//選択されているユーザの数を変数に入れ、なり代わりログインで選択されている人が1人であるかを判定するのに使う
		var selected = $('.selectRecord').length;
		//詳細設定ボタンがクリックされた時に選択されている会員の人数が一人の時だけなりかわりログイン処理を行うイベントを登録する
		if(selected == 0 || selected > 1) {
			//選択している
			alert('ユーザを1人だけ選択してください');
		} else {
			//クリックした人でログインするために会員番号を取得する
			var memberId = $('.selectRecord').children('.id').text();
			//クリックした人でなり代わりログインを行う
			loginInsteadOfMember(memberId);
		}
	});
}

/* 
 * 関数名:loginInsteadOfMember
 * 概要  :管理者ページから会員に為り変わって会員ページにログインする
 * 引数  :memberId: なり代わりを行うための会員番号
 		:clickSelector クリックしてなり代わりを行うセレクター
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.14
 */
function loginInsteadOfMember (memberId) {
	//会員のヘッダー連想配列に会員番号を入れてログインの準備をする
	creator.json.accountHeader.user_key.value = memberId;
	//会員ページを呼び出す
	callPage('memberPage.html');
}

/* 
 * 関数名:afterReloadPermitListInfoTable
 * 概要  :受講承認一覧がリロードした際にテーブルに対して処理をする関数をコールするための関数
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.23
 */
function afterReloadPermitListInfoTable() {
	//受講承認一覧テーブルの取り出した行にクラス名を付ける
	setTableRecordClass('lecturePermitListInfoTable', 'lecturePermitListRecord');
	//受講承認一覧テーブルの列内を編集する
	dbDataTableReplaceExecute(DOT + LECTURE_PERMIT_LIST_INFO_TABLE, creator.json[LECTURE_PERMIT_LIST_INFO_TABLE][TABLE_DATA_KEY], LECTURE_PERMIT_LIST_INFO_TABLE_REPLACE_FUNC);
	//受講承認一覧テーブルの料金列をテキストボックスにする
	creator.insertTextboxToTable('lecturePermitListInfoTable', 'replaceTextboxCost', 'replaceTextboxCostCell');
	//受講承認一覧テーブルの使用pt列をテキストボックスにする
	creator.insertTextboxToTable('lecturePermitListInfoTable', 'replaceTextboxUsePoint', 'replaceTextboxUsePointCell');
	//セレクトボックスを列にアウトプットする
	creator.outputTag('contentSelect', 'contentSelect', '.appendSelectbox');
	//セレクトボックスのvalueを画面に表示されている値にする
	creator.setSelectboxValue('.contentSelect');
	//アコーディオンのコンテントの中に隠れテキストボックスとして備品idを入れる
	creator.outputTag('commodityKeyBox','commodityKeyBox', '.appendSelectbox');
	//受講承認一覧テーブルのテキストボックスにDBから読込んだ値をデフォルトで入れる
	creator.setTableTextboxValuefromDB(creator.json['lecturePermitListInfoTable'][TABLE_DATA_KEY], creator.setInputValueToLecturePermitListInfoTable);
}

/* 
 * 関数名:afterReloadMailMagaTable
 * 概要  :メルマガテーブルがリロードした際にテーブルに対して処理をする関数をコールするための関数
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.07.22
 */
function afterReloadMailMagaTable() {
	//メルマガの内容列に対して150文字以上の内容は画面には表示しないようにする。テキストボックスにはすべての値が反映される
	cutString('.mailMagaContent', '150');
	//メルマガテーブルのクリック対象レコードに対してクラス属性を付けて識別をしやすくする
	setTableRecordClass('mailMagaTable', 'targetMailMagazine');
}

/* 
 * 関数名:afterReloadUserListInfoTable
 * 概要  :管理者ユーザ一覧テーブルに対してdom作成後の処理を行う
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.08.06
 */
function afterReloadUserListInfoTable() {
	//会員一覧テーブルのクリック対象レコードに対してクラス属性を付けて識別をしやすくする
	setTableRecordClass('userListInfoTable', 'targetUser');
}

/* 
 * 関数名:getSendPersonInfo
 * 概要  :管理者ユーザ一覧で通常メールボタン、またはお知らせボタンでメッセージを送る人の情報を取得する
 * 引数  :selector:buttonSelector:クリックしたときにダイアログを開くためのボタンのセレクター
		string:sendType:お知らせとして送信するか、メールとして送信するかを識別するための文字列
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.08.06
 */
function getSendPersonInfo() {
	//メールに送信するためのデータ配列を作る
	var sendToPersonList = [],	//送信先宛先人一覧
	sendToList = [],			//送信先宛先一覧
	userNumberList = [];		//送信先会員番号一覧
	//選択されているレコードの数だけループする
	$(SEL_SELECT_USER).each(function() {
		//選択されたユーザの情報を配列に入れていく
		commonFuncs.textPushArray(this, sendToPersonList, SEL_USER_NAME);	//名前
		commonFuncs.textPushArray(this, sendToList, SEL_MAIL_ADDRESS);		//メールアドレス
		commonFuncs.textPushArray(this, userNumberList, SEL_USER_NUMBER);	//会員番号
	});
	//取得した結果を返すために連想配列に入れる
	var sendPersonInfo = {
		name:sendToPersonList,			//送信先宛先人一覧
		mail:sendToList,				//送信先アドレス一覧
		memberNumber:userNumberList		//会員番号
	};
	return sendPersonInfo;
}

/* 
 * 関数名:adminMessageCreate
 * 概要  :管理者ユーザ一覧で通常メールボタン、またはお知らせボタンでメッセージを作るためのダイアログを表示する
 * 引数  :selector:buttonSelector:クリックしたときにダイアログを開くためのボタンのセレクター
		string:sendType:お知らせとして送信するか、メールとして送信するかを識別するための文字列
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.08.06
 */
function adminMessageCreate(buttonSelector, sendType) {
	//お知らせボタンをクリックでメール送信ダイアログを作る
	$(STR_BODY).on(CLICK, buttonSelector, function() {
		//選択されているユーザの数を変数に入れ、ユーザが選択されていればメール送信処理を開始する
		var selected = $(SEL_SELECT_USER).length;
		//会員一覧から送信するメールの対象となる人が1人以上選択されているなら送信ダイアログを開く
		if(selected <= UNSELECTED_USER) {
			//アラートメッセージをだしてメール送信対象が1人以上選択することを警告する
			alert(TEXT_ERROR_SELECT_USER);
		} else {
			//メッセージを送信するための情報を取得する
			var sendMailData = getSendPersonInfo();
			// ダイアログを開くための情報とメール情報を結合する
			$.extend(true, sendMailData, {sendType:sendType});
			//ダイアログ用オブジェクトを作る
			var dialogObj = $.extend(true, {}, dialogExOption[ADMIN_MAIL_SEND_DIALOG]);
			//送信するデータをオブジェクトに統合する
			$.extend(true, dialogObj.argumentObj.data, sendMailData);
			//メール送信ダイアログを作る
			var mailSendDialog = new dialogEx('dialog/adminMailDialog.html', dialogObj.argumentObj, dialogObj.returnObj);
			mailSendDialog.setCallbackClose(dialogDestroy);	//閉じるときのイベントを登録
			mailSendDialog.run();	//主処理を走らせる
		}
	});
}

/* 
 * 関数名:mailMagaSearch
 * 概要  :管理者、メルマガタブの検索機能
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.09.12
 */
function mailMagaSearch() {
	//メルマガ検索ボタンがクリックされた時に検索機能を行うイベントを開始する
	$(STR_BODY).on(CLICK, '.mailMagaSearchButton', function() {
		//ページングの設定を初期化し、作り直しに備える
		creator.pagingReset('mailMagaTable');
		//クエリのデフォルトを取得し、編集した後でも戻せるようにする
		var queryDefault = creator.json.mailMagaTable.db_getQuery;
		//クエリの文字列の長さを取得してORDER以降の文字列の取得に使う
		var queryStringLength = creator.json.mailMagaTable.db_getQuery.length;
		//ORDER BY以降の文字列を取得するため、ORDER 以降の文字列を取得する
		var cutString = creator.json.mailMagaTable.db_getQuery.substring(creator.json.mailMagaTable.db_getQuery.indexOf("ORDER"),queryStringLength);
		//現在のクエリからORDER BYを取り除き、検索の条件を入れることができるようにする
		creator.json.mailMagaTable.db_getQuery = creator.json.mailMagaTable.db_getQuery.substring(0,creator.json.mailMagaTable.db_getQuery.indexOf("ORDER"));
		//検索の条件をクエリに入れる
		creator.addQueryExtractionCondition('mailMagaSearchArea', 'mailMagaTable');
		//クエリに切り取ったORDER BYを付け足す
		creator.json.mailMagaTable.db_getQuery += cutString;
		//メルマガのデータを取り出す
		creator.getJsonFile(URL_GET_JSON_ARRAY_PHP, creator.json['mailMagaTable'], 'mailMagaTable');
		//ページング機能付きでメルマガテーブルを作る
		creator.outputNumberingTag('mailMagaTable', 1, 4, 1, 15, '.mailMagaTableOutside', 'afterReloadMailMagaTable');
		//クエリをデフォルトに戻す
		creator.json.mailMagaTable.db_getQuery = queryDefault;
	});
}

/* 
 * 関数名:setMailMagaSendContent
 * 概要  :メルマガのテーブルをクリックしたときにクリックされた行の内容を
 		メルマガ送信のテキストボックスに入れる
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.09.12
 */
function setMailMagaSendContent() {
	//クリック対象となっているメルマガテーブルの行をクリックしたときにタイトルや内容を自動でセットするイベントを登録する
	$('.mailMagaAndAnnounce').on(CLICK, '.targetMailMagazine', function() {
		//クリックされたのが何番目の行であるかを取得し、メルマガのタイトルや内容を取り出すのに使う
		var targetNumber = $('.targetMailMagazine').index(this);
		//取得した番号をもとにメルマガのタイトルや内容などの情報を取得し、連想配列に入れる
		var targetInf = creator.json.mailMagaTable[TABLE_DATA_KEY][targetNumber];
		//取得した連想配列をテキストボックスにセットする
		setValueDBdata(targetInf, '.mailMagaAndAnnounceArea', 'keyTable');
	});
}

/* 
 * 関数名:mailMagaSendConfirm
 * 概要  :メルマガ送信の内容を取得して、メルマガ送信ダイアログを作る
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.09.12
 */
function mailMagaSendConfirm() {
	//送信ボタンがクリックされたときにメール送信イベントを開始する
	$(STR_BODY).on(CLICK, '.messageButtonArea .sendButton', function() {
		//メルマガ送信にチェックが入っていたらメルマガを送信する
		if($('[name="messegeType"]').val() == "0") {
			//メルマガを送信するための値をテキストボックスから取得する
			var sendData = getInputData('mailMagaAndAnnounceArea');
			//ダイアログ用オブジェクトを作る
			var dialogObj = $.extend(true, {}, dialogExOption[MAIL_MAGAZINE_CONFIRM_DIALOG]);
			//送信するデータをオブジェクトに統合する
			$.extend(true, dialogObj.argumentObj.data, sendData, {'creator':creator});
			//メルマガ送信ダイアログを作る
			var mailmagazineSendDialog = new dialogEx('dialog/mailMagazineSendConfirmDialog.html', dialogObj.argumentObj, dialogObj.returnObj);
			mailmagazineSendDialog.setCallbackClose(mailmagazineSendDialog.sendMailmagazine);	//閉じるときのイベントを登録
			mailmagazineSendDialog.run();	//主処理を走らせる
		}
	});
}

/* 
 * 関数名:resetMailMageSendContent
 * 概要  :削除ボタンがクリックされた時にメルマガの送信内容のテキストボックスの中身を削除する
 * 引数  :なし
 * 返却値  :なし
 * 作成者:T.Yamamoto
 * 作成日:2015.09.12
 */
function resetMailMageSendContent() {
//削除ボタンがクリックされたとき、テキストボックスの中身も空白にする
	$(STR_BODY).on(CLICK, ".messageButtonArea .deleteButton", function(){
		//メッセージ内容テキストエリアの中身を空にする
		$('.mailMagaAndAnnounceArea textarea').text('');
	});
}