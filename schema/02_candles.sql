CREATE TABLE candles (
                         id INT AUTO_INCREMENT PRIMARY KEY,
                         `key` VARCHAR(255) NOT NULL,
                         `period` VARCHAR(2) NOT NULL,
                         `time` INT NOT NULL,
                         low DOUBLE NOT NULL,
                         high DOUBLE NOT NULL,
                         `open` DOUBLE NOT NULL,
                         `close` DOUBLE NOT NULL,
                         UNIQUE KEY app_key_period_time (`key`, period, `time`)
);