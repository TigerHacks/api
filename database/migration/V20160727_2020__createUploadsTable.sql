CREATE TABLE `uploads` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `owner_id` INT UNSIGNED NOT NULL,
  `key` VARCHAR(255) NOT NULL,
  `bucket` VARCHAR(255) NOT NULL,
  `created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  PRIMARY KEY (`id`),
  INDEX `fk_uploads_owner_id_idx` (`owner_id` ASC),
  CONSTRAINT `fk_uploads_owner_id`
	FOREIGN KEY (`owner_id`)
	REFERENCES `users` (`id`)
	ON DELETE NO ACTION
	ON UPDATE NO ACTION);
