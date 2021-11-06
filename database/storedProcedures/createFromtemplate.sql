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

SET @data := JSON_PRETTY(@data);
-- increasing the count
SET @used_by := @used_by+1;

-- updating the database
INSERT INTO akp_forms (title,theme,description,who,tid) VALUES (@title,@theme,@description,uid,tid);
UPDATE template SET template.used_by = @used_by WHERE template.template_id = tid;

-- fetching the results of the procedure
SELECT id INTO @id FROM akp_forms WHERE who = uid ORDER BY id DESC LIMIT 0,1;

SET @theme := JSON_PRETTY(@theme);
-- returning data
SELECT @data,@id,@theme,@title,@description;
END$$

DELIMITER ;

