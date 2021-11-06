USE `forms`;
DROP procedure IF EXISTS `createFromTemplate`;

DELIMITER $$
USE `forms`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `createFromTemplate`(
		IN tid varchar(255),
        IN uid varchar(255)
)
BEGIN
-- selecting the data
SELECT template.data, template.description,template.title, template.theme, template.used_by 
INTO @data, @description, @title, @theme,@used_by  
FROM template 
WHERE template.template_id = tid;

-- increasing the count
SET @used_by := @used_by+1;

-- updating the database
INSERT INTO form (title,theme,description,data,user_id) VALUES (@title,@theme,@description,@data,uid);
UPDATE template SET template.used_by = @used_by WHERE template.template_id = tid;
-- fetching the results of the procedure
SELECT * FROM form WHERE user_id = uid ORDER BY form_id DESC LIMIT 0,1;
END$$

DELIMITER ;

