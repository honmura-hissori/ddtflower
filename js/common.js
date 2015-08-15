/** ファイル名:common.js
 * 概要　　　:汎用関数クラス定義のファイル
 * 作成日　:2015.0813
 * 作成者　:T.Masuda
 * 場所　　:js/common.js
 */

/** クラス名:common
 * 概要　:汎用関数クラス
 * 引数	:なし
 * 設計者:H.Kaneko
 * 作成日:2015.0813
 * 作成者:T.Masuda
 */
function common(){
	
	/** クラス名:theFunc
	 * 概要　:コピペ用関数
	 * 引数	:なし
	 * 作成日:2015.0813
	 * 作成者:T.Masuda
	 */
	this.theFunc = function(){
		
	}

	/*
	 * 関数名:checkEmpty
	 * 引数  :var target:空白チェックを行う対象
	 * 戻り値:boolean:判定結果を返す
	 * 概要  :引数に指定された変数やオブジェクトが空でないかをチェックする
	 * 作成日:2015.08.13
	 * 作成者:T.M
	 */
	this.checkEmpty = function(target){
		//判定対象の中身がundefined、null、空文字のいずれかであればfalseを返す。
		return target === void(0) || target == null || target == EMPTY_STRING ? false: true;
	}

	/*
	 * 関数名:getScriptFile
	 * 引数  :String scriptUrl:JSファイルのパス
	 * 戻り値:boolean:JSファイル取得の成否を返す
	 * 概要  :JSファイルを取得してそのまま展開する
	 * 作成日:2015.08.14
	 * 作成者:T.M
	 */
	this.getScriptFile = function(scriptUrl){
		$.ajax({							//Ajax通信でJSファイルを読み込む
			//以下、errorまでAjax通信の設定
			url:scriptUrl,					//ファイルパス
			dataTYpe:"script",				//JSファイルを取得する設定
			async:false,					//同期通信
			success:function(sc){			//通信成功時
				console.log("got script");	//成功判定を変数に入れる
			},
			error:function(a,b,c){			//通信失敗時
				//失敗のログを出す
				console.log(GET_SCRIPT_FAIL_MESSAGE_FRONT + scriptUrl + PARENTHESES_REAR);
			}
		});
	}

	/* 関数名:callOpenDialog
	 * 概要　:ダイアログが開いたときのコールバック関数openDialogをコールする。
	 * 		:ダイアログのcloseイベントのコールバック関数には基本的にこれをセットする
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:2015.0813
	 * 作成者　:T.Masuda
	 */
	this.callOpenDialog = function(){
		//openDialog関数を実行する
		this.dialogBuilder.dispContents();
	}
	
	/* 関数名:moveNoticeWindows
	 * 概要　:お知らせウィンドウを開くボタン群を移動させる
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:2015.0813
	 * 作成者　:T.Masuda
	 */
	this.moveNoticeWindows = function(){
		$.when(
		//0ミリ秒後にキャンペーンお知らせ表示ボタンをスライド表示する。
			showRightOutOfDisplayButton('.topicShowCampaign', 0, 3000)
			).then(function(){
				$.when(
					//400ミリ秒後にギャラリーお知らせ表示ボタンをスライド表示する。
					showRightOutOfDisplayButton('.topicShowGallery', 300, 3000)
					).then(function(){
						//900ミリ秒後にブログお知らせ表示ボタンをスライド表示する。
						showRightOutOfDisplayButton('.topicShowBlog', 600, 3000);
				});
		});
	}
	/* 関数名:toggleNoticeWindows
	 * 概要　:お知らせウィンドウを開くボタン群を開閉するイベントを登録する
	 * 引数　:なし
	 * 返却値:なし
	 * 作成日　:2015.0813
	 * 作成者　:T.Masuda
	 */
	this.toggleNoticeWindows = function(){
		//3つのウィンドウとそれを表示・非表示にするボタンのイベントを登録する。順番にコールして順を整える。
		fadeToggleSet('div.topicShowCampaign', '.topicCampaign', '.topic', 500);
		fadeToggleSet('div.topicShowGallery', '.topicGallery', '.topic', 500);		
		fadeToggleSet('div.topicShowBlog', '.topicBlog', '.topic', 500);
	}
	
	/* 関数名:tableReplaceAndSetClass
	 * 概要　:テーブルを置換し、さらに行に対してクラス属性を付ける
	 * 引数　:string:tableName:テーブル名
	 		string :tableReplaceFunc:テーブル置換関数名
			bool:replaceBool:置換するときにレッスン合計人数がどうかの判定
			string:recordClassName:行につけるクラス属性名
	 * 返却値:なし
	 * 作成日　:2015.08.08
	 * 作成者　:T.Yamamoto
	 * 作成日　:2015.08.14
	 * 作成者　:T.Masuda
	 * 作成者　:dialogExからcommon.jsに移動しました
	 */
	this.tableReplaceAndSetClass = function(tableName, tableReplaceFunc, replaceBool, creator, recordClassName) {
		//予約可能授業一覧を置換する
		dbDataTableValueReplace(tableName, tableReplaceFunc, replaceBool, creator);
		//予約一覧テーブルのクリック対象レコードに対してクラス属性を付けて識別をしやすくする
		setTableRecordClass(tableName, recordClassName);
	}
	
}