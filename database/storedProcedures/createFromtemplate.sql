USE `forms`;
DROP procedure IF EXISTS `createFromTemplate`;
DELIMITER $$ USE `forms` $$ CREATE DEFINER = `root` @`localhost` PROCEDURE `createFromTemplate`(
    IN tid varchar(255),
    IN uid varchar(255)
) BEGIN
SET @data := (
        SELECT template.data
        FROM template
        WHERE template.template_id = tid
    );
SET @description := (
        SELECT template.description
        FROM template
        WHERE template.template_id = tid
    );
SET @title := (
        SELECT template.title
        FROM template
        WHERE template.template_id = tid
    );
SET @theme := (
        SELECT template.theme
        FROM template
        WHERE template.template_id = tid
    );
INSERT INTO form (title, theme, description, data, user_id)
VALUES (@title, @theme, @description, @data, uid);
SELECT *
FROM form
WHERE user_id = uid
ORDER BY form_id DESC
LIMIT 0, 1;
END $$ DELIMITER;