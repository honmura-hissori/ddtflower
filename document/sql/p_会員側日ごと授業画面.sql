DELIMINATER $$
CREATE PROCEDURE p_user_classwork_a_day(
	IN in_date INT
	,IN user_key INT
	,
)

CREATE TEMPORARY TABLE tmp_time_table_day AS 
SELECT 
	user_classwork_cost
	,user_classwork_cost_aj
	,user_classwork.flower_cost AS flower_cost
	,flower_cost_aj
	,user_classwork.extension_cost AS extension_cost
	,uc_stage_inf.stage_no AS stage_no
	,uc_lesson_sub.level_no AS level_no
	,lesson_name
	,classwork.lesson_key AS lesson_key
	,pre_order_days
	,stop_order_date
	,school_name
	,start_time
	,end_time
	,time_table_day.lesson_date AS lesson_date
	,order_students
	,classwork.max_students AS max_students
	,classwork.min_students AS min_students
	,lesson_inf.min_students AS default_min_students
	,time_table_day.max_num AS max_num
	,time_table_day.min_num AS min_num
	,ul_lesson_sub.flower_cost AS default_flower_cost
	,ul_lesson_sub.level_price AS default_user_classwork_cost
	,ul_lesson_sub.level_no AS level_no_present
	,classwork_status
	,user_work_status
	,ul_stage_inf.stage_no AS stage_no_present
	,SUBSTRING(NOW(), 1,10) AS today
	,user_classwork.id AS id
	,classwork.id AS classwork_key
	,ul_lesson_sub.id AS level_key
	,ul_stage_inf.id AS stage_key 
FROM 
	time_table_day
INNER JOIN
	classwork
ON
	time_table_day.id = classwork.time_table_day_key
AND
	time_table_day.lesson_date = {{日付}}
LEFT JOIN
	user_classwork
ON
	classwork.id = user_classwork.classwork_key
AND	
	user_classwork.user_key = {{user_key}}
INNER JOIN 
	lesson_inf
ON
	lesson_inf.id = classwork.lesson_key
INNER JOIN
	school_inf
ON	
	school_inf.id = lesson_inf.school_key
INNER JOIN
	timetable_inf
ON
	timetable_inf.id = time_table_day.timetable_key
LEFT JOIN
	user_lesson
ON
	user_lesson.user_key = {{user_key}}
AND
	user_lesson.lesson_key = lesson_inf.id
LEFT JOIN
	lesson_sub AS ul_lesson_sub
ON
	ul_lesson_sub.id = user_lesson.level_key
LEFT JOIN
	stage_inf AS ul_stage_inf
ON
	ul_stage_inf.id = user_lesson.stage_key
LEFT JOIN
	lesson_sub AS uc_lesson_sub
ON
	uc_lesson_sub.id = user_classwork.level_key
LEFT JOIN
	stage_inf AS uc_stage_inf
ON
	uc_stage_inf.id = user_classwork.stage_key;

END$$
DELIMINATER ;