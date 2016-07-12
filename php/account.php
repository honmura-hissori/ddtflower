<?php

/*
 * ファイル名:account.php
 * 概要	:ログインのための関数を持ったクラスのファイル。
 * 設計者:H.Kaneko
 * 作成者:T.Masuda
 * 作成日:2015.0728
 * パス	:/php/account.php
 */

//返却用JSONの文字列 前後
define('ERROR_JSON_FRONT', '{"createTagState":"');	//返却用JSON文字列 前
define('ERROR_JSON_BACK', '"}');	//返却用JSON文字列 後

/*
 * クラス名:LoginCheckException
 * 概要  :ログインチェックエラー時の例外クラス
 * 設計者:H.Kaneko
 * 作成者:T.Masuda
 * 作成日:2015.0801
 */
class LoginCheckException extends  Exception{
	
	
	/*
	 * クラス名:checkLoginState
	 * 概要  :ログイン状態を調べて数値で返す。
	 * 作成者:T.Masuda
	 * 作成日:2015.0801
	 */
	function checkLoginState(){
		
		$retState = 0;	//返却値の変数に初回ログインの値0をセットする
		//cookieがあるかどうかをチェックする。
		if(isset($_COOKIE['user'])){
			$retState = 1;	//タイムアウトであれば1をセットする
		//タイムアウトしていなければ
		} else {
			//セッションIDを再発行してセッションを更新する
			session_regenerate_id(true);
		}
		
		return $retState;	//状態の整数値を返す
	}
}

//loginの親クラスのファイルを読み込む
require_once ('JSONDBManager.php');

/*
 * クラス名:account
 * 概要  :ログインのための関数を持ったクラス。JSONDBManagerクラスを継承する。
 * 設計者:H.Kaneko
 * 作成者:T.Masuda
 * 作成日:2015.0728
 */
class account extends JSONDBManager{
	
	/*
	 * 関数名：init
	 * 概要  :初期化処理を行う。初期化としてセッションの開始とDBへの接続を行う。
	 * 引数  :なし
	 * 戻り値:なし
	 * 設計者:H.Kaneko
	 * 作成者:T.Masuda
	 * 作成日:2015.0728
	 */
	function init(){
		
		//セッションを開始する
		session_start();
		//DBへの接続を開始する。
		$this->connect();
	}

	/*
	 * 関数名：login
	 * 概要  :ログイン処理を行う。
	 * 引数  :String $jsonString: JSON文字列。ログイン情報が入っている必要がある。
	 * 戻り値:なし
	 * 設計者:H.Kaneko
	 * 作成者:T.Masuda
	 * 作成日:2015.0728
	 */
	function login($jsonString){

		//クライアントから送信されたJSONのキーとJSON文字列を取得する。
		$key = $_POST['key'];
		$this->getJSONMap($jsonString);
		
		//SQLによる例外の対処のためtryブロックで囲む
		try {
			// jsonを出力する
			$this->createJSON($this->json, $key, null);
			//SQL例外のcatchブロック
		} catch (PDOException $e) {
			// エラーメッセージを表示する
			echo $e->getMessage();
		}
		
		// 連想配列をjsonに変換して変数に入れる
		$jsonOut = json_encode($this->json, JSON_UNESCAPED_UNICODE);
				
		//セッションIDを更新する。
		session_regenerate_id();
		
		//JSONから会員番号を取り出す。
		$userId = $this->json['id']['text'];
		$authority = $this->json['authority']['text'];
		
		//会員番号(ユーザID)をセッションに入れる
		$_SESSION['userId'] = $userId;
		//ユーザの権限をセッションに入れる
		$_SESSION['authority'] = $authority;
		
		//cookieにユーザIDをセットする
		setcookie("userId", $userId, time()+3600, '/');
		//cookieにユーザの権限をセットする
		setcookie("authority", $authority, time()+3600, '/');
				
		// 作成したJSON文字列を出力する。
		print($jsonOut);
	}
	
	/*
	 * 関数名：logout
	 * 概要  :ログアウト処理を行う。
	 * 引数  :なし
	 * 戻り値:なし
	 * 設計者:H.Kaneko
	 * 作成者:T.Masuda
	 * 作成日:2015.0728
	 */
	function logout(){
		//セッション変数をクリアする。
		$_SESSION = array();
		
		//セッションクッキーが存在するなら
		if (isset($_COOKIE[session_name()])) {
			//クッキーの有効期限を過去に設定して破棄する
    		setcookie(session_name(), '', time()-42000, '/');
		}
		
		//ユーザID、権限のcookieを削除する
		setcookie("userId", '', time()-42000, '/');
		setcookie("authority", '', time()-42000, '/');
		
		//セッションそのものを破棄する
		session_destroy();
	}
	
	/*
	 * 関数名：loginCheck
	 * 概要  :ログインチェックを行う。
	 * 引数  :なし
	 * 戻り値:boolean:ログインしているか否かの真理値を返す
	 * 設計者:H.Kaneko
	 * 作成者:T.Masuda
	 * 作成日:2015.0728
	 */
	function loginCheck(){
		$retBoo = false;	//返却値を格納する変数を宣言する
		//クラスにより例外でログインチェック時の失敗の処理を分岐させるため、try catch文を使う
		try{
			//セッション変数のユーザIDを参照し、値が存在するかどうかをチェックする。
			//また、セッションとCookieに保存されているユーザIDが一致するかを確かめる。
			if(isset($_SESSION['userId']) && isset($_COOKIE['userId']) 
					&& $_SESSION['userId'] == $_COOKIE['userId']){
				$retBoo = true;	//返却値の変数にtrueを格納する
			//セッションがない状態であれば
			} else {
				//ログインチェックエラーの例外を投げる
				throw new LoginCheckException();
			}
		//例外をキャッチした場合は以下のブロックに入る
		} catch (LoginCheckException $e){
			//エラーメッセージのJSONを返す。
			echo ERROR_JSON_FRONT.$e->checkLoginState().ERROR_JSON_BACK;
			exit;
		}

		//真理値を返す
		return $retBoo;
	}
}