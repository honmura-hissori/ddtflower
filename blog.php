<!DOCTYPE html>
<?php
include 'article/inc/mslinfo.php';
$msl_infos = new MSLPageInfo('1197', '1984');
$msl_infos2 = new MSLPageInfo('1197', '1985');
?>
<html>
<head>
<meta charset="UTF-8">
<title>DDTFlowers/プリザーブドフラワー</title>
<link href="http://ddthink.com/article/css/top.css" rel="stylesheet" type="text/css">
</head>
<body>
	<div id="container">
		<div class="main">
			<!-- コース案内のCSSファイルを読み込む。 -->
			<link href="css/courseguide.css" rel="stylesheet" type="text/css">
			<!-- ブログのCSSファイルを読み込む。 -->
			<link href="css/blog.css" rel="stylesheet" type="text/css">
			<script>
				//createTagクラスインスタンスを生成する
				var creator = new createLittleContents();
				
				creator.getJsonFile('source/blog.json');			// ファイルのデータをjsonを用いて持ってくる
				creator.getJsonFile('source/commonJson.json');		// ファイルのデータをjsonを用いて持ってくる
				creator.getJsonFile('source/blogcontent.json');		// テスト用のブログJSONデータを取得する。
				creator.getDomFile('template/common.html');			// 共通パーツのDOMを取得する
				creator.getDomFile('template/blog.html');			// ブログページ用のDOMを取得する
			
				//会員ページから読み込まれる場合、会員のページのヘッダーを表示する。
				creator.createMemberPageHeader(creator);
				creator.outputTag('headImage', 'createImage');				// 天の画像を作る
				creator.outputTag('pageTitle');								// タイトル領域を作る
				
				creator.outputTag('blogRightContent');						// 右側領域を作る
				creator.outputTag('blog','blog','.blogRightContent');		// 右側領域にブログ領域を作る
				creator.outputTag('numberingOuter','numberingOuter','.blogRightContent');
				
				creator.outputNumberingTag('blogArticle', 1, 4, 1, BLOG_SHOW_PAGES, '.blog');	// ブログの記事を作る。
				
				creator.outputTag('blogLeftContent');						// 左側領域を作る
				creator.outputTag('calendar','calendar','.blogLeftContent');	// 左側領域にカレンダーを作る
				creator.outputTag('currentArticleList','currentArticleList','.blogLeftContent');
				
				creator.outputTag('footImage', 'createImage');		// 地の画像を作る
				creator.outputTag('footer');						// フッターを作る
				
				// メイン領域にヘッダーの高さ分のmarginを設定し、固定スクロール時に埋もれるのを阻止する。
				// fixYCoordinate('header', '.main');
				// position:fixed;を設定したヘッダーが横スクロールしない問題を解決する関数をコールする。
				fixXCoordinateOnScroll('header')
				
				//datepickerによるカレンダーのクラスを作成する。
				var bCalendar = new blogCalendar('.calendar', creator);
				bCalendar.create();	//カレンダーを実際に作成する

				creator.createNewArticleList();	//最新記事一覧を作る
				
				//ブログ記事の中にMSLのリストを配置する
				//$('.blogRightContent').prepend($('#mslongtail_1984').show());
			</script>
			<!-- MSLの記事を表示する -->
			<?php echo $msl_infos->get('html_article'); ?>
		</div>	
	</div>
</body>
</html>