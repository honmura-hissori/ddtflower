﻿/* ファイル名:adminLessonListDialog.js
 * 概要　　　:管理者ページ 授業一覧ダイアログ
 * 作成者　:T.Yamamoto
 * 場所　　:dialog/js/adminLessonListDialog.js
 */

/* クラス名:adminLessonListDialog.js
 * 概要　　:URLからダイアログのHTMLファイルを取得して表示する。
 * 親クラス:baseDialog
 * 引数	 :Element dialog:ダイアログのDOM
 * 作成者　:T.Yamamoto
 * 場所　　:dialog/js/adminLessonListDialog.js
 */
function adminLessonListDialog(dialog){
	baseDialog.call(this, dialog);	//親クラスのコンストラクタをコールする

	/* 関数名:getJson
	 * 概要　:必要なjsonデータをクリエイトタグのインスタンスに格納する
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:2015.0816
	 * 作成者　:T.Yamamoto
	 * 修正日　:2015.0822
	 * 修正者　:T.Masuda
	 * 内容	　:テーブルのデータを共通関数クラスの関数で取得するようにしました
	 */
	this.getJson = function() {
		//管理者ページ 授業一覧ダイアログのjsonデータを取得する
		this[VAR_CREATE_TAG].getJsonFile(ADMIN_LESSON_LIST_DIALOG_JSON);
		//授業データをJSONにセットする
		commonFuncs.setLessonDataToJSON(this[DIALOG_CLASS], this[VAR_CREATE_TAG]);
		//予約できる授業のデータ一覧をDBから取得してテーブルを作る準備をする
		this[VAR_CREATE_TAG].getJsonFile(URL_GET_JSON_ARRAY_PHP, this[VAR_CREATE_TAG].json[LESSON_TABLE], LESSON_TABLE);
	}

	/* 関数名:getDom
	 * 概要　:createTag用テンプレートHTMLを取得する(オーバーライドして内容を定義してください)
	 * 引数　:なし
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0822
	 * 作成者　:T.Masuda
	 */
	this.getDom = function(){
		//DOMをクリアする
		this[VAR_CREATE_TAG].dom = EMPTY_STRING;
		//授業データ一覧ダイアログのテンプレートを取得する
		this[VAR_CREATE_TAG].getDomFile("template/lessonTable.html");
		this[VAR_CREATE_TAG].getDomFile(TMP＿TABLE_AREA);
		this[VAR_CREATE_TAG].getDomFile(TMP_LESSON_STATUS);
	};

	/* 関数名:customizeJson
	 * 概要　:constructionContentで取得したJSONの加工を行う。オーバーライドして定義されたし
			この中で使っている関数はjs/customizeTableData.js で定義されているものを使う
	 * 引数　:なし
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0816
	 * 作成者　:T.Yamamoto
	 */
	this.customizeJson = function(){
		// //テーブルのデータを連想配列に入れる
		// var tableData = this[VAR_CREATE_TAG].json[LESSON_TABLE][TABLE_DATA_KEY];
		// //時限ごとの人数を取り出す
		// var timeTableStudents = commonFuncs.getTotalStudentsOfTimeTable(tableData);
		// //jsonに加工した値を入れる(customizeAdminLessonTableは関数名、レコードの加工データをjsonに追加する。);
		// commonFuncs.customizeTableData(tableData, this.customizeAdminLessonTable, timeTableStudents);
		
		//テーブル置換用の時限データを取得する
		// this.getReplacedTableData(LESSON_TABLE);
		// var tableData = this.create_tag.json.lessonTable.tableData;
		// var tableDataLength = tableData.length;
		// for(var i = 0; i < tableDataLength; i++){
		// 	this.customizeAdminLessonTable(this.create_tag.json.lessonTable.tableData, i, this.timeStudentsCount);
		// }
	};

	/* 関数名:getReplacedTableData
	 * 概要　:存在する時限情報を取得する
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:2015.0815
	 * 作成者　:T.Masuda
	 */
	this.getReplacedTableData = function(tableName){
		//授業のデータを取得する
		var tableData = this[VAR_CREATE_TAG].json[tableName][TABLE_DATA_KEY];
		//授業のデータから、その日の存在する時限一覧を取得する。
		this.timeStudentsCount = commonFuncs.getTotalStudentsOfTimeTable(tableData);
	}
	
	
	
	/* 関数名:dispContentsMain
	 * 概要　:画面パーツ設定用関数のメイン部分作成担当関数
	 * 引数　:createLittleContents creator:createLittleContentsクラスインスタンス
	 * 		:dialogEx dialogClass:このダイアログのdialogExクラスのインスタンス
	 * 返却値:なし
	 * 設計者　:H.Kaneko
	 * 作成日　:2015.0814
	 * 作成者　:T.Masuda
	 */
	this.dispContentsMain = function(){
		//授業一覧のテーブルを作る
		this.createTable();
		//レッスンのステータス領域を作る
		this[VAR_CREATE_TAG].outputTag(LESSON_STATUS, LESSON_STATUS, $(this.dialog));
	}

	/* 関数名:createTable
	 * 概要　:授業一覧のテーブルを作る
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:2015.0815
	 * 作成者　:T.Yamamoto
	 * 修正日　:2015.0822
	 * 修正者　:T.Masuda
	 * 内容	　:テーブルの行数を取得するコードを関数化しました。
	 */
	this.createTable = function() {
		//データがなければテーブルは作らない
		if(commonFuncs.getTableJsonLength(this[VAR_CREATE_TAG], LESSON_TABLE) != 0) {
			//授業一覧テーブルの外側の領域を作る
			this[VAR_CREATE_TAG].outputTag(TABLE_OUTER, TABLE_OUTER, $(this.dialog));
			//授業のデータ一覧テーブルを作る
			this[VAR_CREATE_TAG].outputTagTable(LESSON_TABLE, LESSON_TABLE, $(DOT+TABLE_OUTER, this.dialog));
			//テーブルの値をクライアント側で編集して画面に表示する
			commonFuncs.tableReplaceAndSetClass(LESSON_TABLE, "callAdminReservedLessonValue", true, this.create_tag, LESSON_TABLE_RECORD);
		}
	}

	/* 関数名:setConfig
	 * 概要　:ダイアログの設定を行う
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:2015.0822
	 * 作成者　:T.Masuda
	 */
	this.setConfig = function(){
		//新規に授業を作成するためのボタンを作る
		this.setDialogButtons(this.createNew);
		//ダイアログの位置を修正する
		this.setDialogPosition(POSITION_CENTER_TOP);
	}


	/* 関数名:setCallback
	 * 概要　:ダイアログのイベントコールバックを設定する
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:2015.0822
	 * 作成者　:T.Masuda
	 */
	this.setCallback = function(){
		//テーブルの行をクリックイベントに対し授業詳細ダイアログを開くコールバック関数を登録する
		this.setCallbackRowClick();
	}

	/* 関数名:callbackCreateNew
	 * 概要　:新規作成ボタンのコールバック関数
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:2015.0822
	 * 作成者　:T.Masuda
	 */
	this.callbackCreateNew = function(){
		//ボタンが押されたときの状態の値を設定する。
		this[DIALOG_CLASS].setPushedButtonState(CREATE_NEW);
		this.openDialog(URL_ADMIN_LESSON_CREATE_DIALOG);	//授業新規作成ダイアログを開く
	}

	/* 関数名:setCallbackRowClick
	 * 概要　:テーブルの行をクリックした時のイベントのコールバック関数を設定する
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:015.08.22
	 * 作成者　:T.Masuda
	 */
	this.setCallbackRowClick = function() {
		//当クラスインスタンスをイベントコールバック内で使える用に変数に格納する
		var thisElem = this;	
		//ダイアログの内のテーブルの行をクリックしたときのコールバック関数をセットする
		$(STR_TR, this.dialog).on(CLICK, function(){
			//行番号を引数にコールバック関数を呼び出す
			thisElem.callbackRowClick($(this).parent().children().index(this));
		});
	};

	/* 関数名:callbackRowClick
	 * 概要　:テーブルの行をクリックした時のイベントのコールバック関数
	 * 引数　:int rowIndex:行番号
	 * 返却値:なし
	 * 作成日　:015.08.22
	 * 作成者　:T.Masuda
	 */
	this.callbackRowClick = function(rowIndex) {
		//ダイアログの状態を表すオブジェクトを取得する
		var returnStatusObj = this[DIALOG_CLASS].getReturnStatusObject();
		//取得したオブジェクトにクリックした行の番号をセットする
		returnStatusObj[CLICKED_ROW] = rowIndex;
		//ボタンが押されたときの状態の値を設定する。
		this[DIALOG_CLASS].setPushedButtonState(EDIT_LESSON);
		
		this.openDialog(URL_ADMIN_LESSON_DETAIL_DIALOG);	//授業詳細ダイアログを開く
	};


	/* 関数名:setArgumentObj
	 * 概要　:ダイアログに渡すオブジェクトを生成する
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:015.08.14
	 * 作成者　:T.Masuda
	 */
	this.setArgumentObj = function() {
		//当該ダイアログが生成されたときに渡されたインプット用データオブジェクトを取得する
		var argumentObj = commonFuncs.createCloneObject(this[DIALOG_CLASS].getArgumentObject());
		//returnObjに格納された押されたボタンの値を取得する
		var pushedButtonState = this[DIALOG_CLASS].getPushedButtonState();
		
		//イベントコールバックの起点となったものを判別する
		switch(pushedButtonState){
			//新規作成ボタンが押された
			case CREATE_NEW:
				//新規作成用のデータを取得してまとめる。また、close時のコールバック関数のポインタを渡す
				$.extend(true, 
						argumentObj.data, //このダイアログに渡されたインプット用データ
						{tableData:this.create_tag.json.lessonTable.tableData}, //授業一覧テーブルの全行データ
						//当クラスインスタンスと新規作成ダイアログのclose時コールバック関数
						{parentDialogBuilder:this, callback:this.newLessonEntry}
				);
				break;	//switchを抜ける
			//授業一覧テーブルの行がクリックされた
			default:
				//クリックした行番号を取得するため、returnObjのreturnStatusObjを取得する
				var returnStatusObj = this[DIALOG_CLASS].getReturnStatusObject();
				//既存の授業のデータを取得してまとめる
				$.extend(true, 
							argumentObj.data, //このダイアログに渡されたインプット用データ
							//行データ
							this.create_tag.json.lessonTable.tableData[returnStatusObj[CLICKED_ROW] - 1], 
							{parentDialogBuilder:this}	//当クラスインスタンス
				);
				break;	//switchを抜ける
		}

		return argumentObj;	//生成したオブジェクトを返す
	}

	/* 
	 * 関数名:customizeAdminLessonTable
	 * 概要  :管理者、授業一覧テーブルの値必要な値をクライアント側で設定してjsonに入れる
	 * 引数  :tableName:値を加工する対象となるテーブルのjsonデータ
	 		 counter:カウンタ変数。加工する行を識別するのに使う
	 		 timeTableStudents:時限ごとに予約している生徒の数
	 * 返却値  :なし
	 * 作成者:T.Yamamoto
	 * 作成日:2015.08.16
	 */
	this.customizeAdminLessonTable = function(tableData, counter, timeTableStudents) {
		// テーブルの値に入る連想配列(テーブルの値一覧)を変数に入れる
		var recordData = tableData[counter];
		//レッスンテーマ名または店舗名が空であるならばその行を飛ばす
		if(recordData[COLUMN_NAME_LESSON_NAME] && recordData[COLUMN_NAME_SCHOOL_NAME]) {
			// 開始日時と終了時刻を組み合わせた値を入れる
			var timeSchedule = commonFuncs.buildHourFromTo(recordData);
			//状況を入れる
			var lessonStatus = commonFuncs.getClassworkStatus(recordData, timeTableStudents);
			//残席を記号にする
			var rest = commonFuncs.getRestMark(recordData, timeTableStudents);
			//取得したデータをjsonに入れていく
			tableData[counter][START_END_TIME]	= timeSchedule;	//時間割開始と終了時刻
			tableData[counter][LESSON_STATUS]	= lessonStatus;	//レッスンの開講状況ステータス
			tableData[counter][LESSON_REST]		= rest;			//レッスン残席記号
		}

		return tableData;
	};

}

//継承の記述
adminLessonListDialog.prototype = new baseDialog();
//サブクラスのコンストラクタを有効にする
adminLessonListDialog.prototype.constructor = baseDialog;
