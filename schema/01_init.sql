-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Хост: sof-chat-mysql-1
-- Время создания: Окт 03 2026 г., 09:44
-- Версия сервера: 5.7.44
-- Версия PHP: 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `chat`
--

-- --------------------------------------------------------

--
-- Структура таблицы `candles`
--

CREATE TABLE `candles` (
                           `key` varchar(255) COLLATE utf8_bin NOT NULL,
                           `period` varchar(2) COLLATE utf8_bin NOT NULL,
                           `time` int(11) NOT NULL,
                           `low` double NOT NULL,
                           `high` double NOT NULL,
                           `open` double NOT NULL,
                           `close` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Структура таблицы `dialogs`
--

CREATE TABLE `dialogs` (
                           `dialog_id` int(11) NOT NULL,
                           `user_id` int(11) NOT NULL,
                           `dialog_title` varchar(64) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
                           `dialog_message` varchar(256) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL,
                           `dialog_rate` int(11) NOT NULL DEFAULT '0',
                           `dialog_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Структура таблицы `fixes`
--

CREATE TABLE `fixes` (
                         `word` varchar(64) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
                         `fix` varchar(64) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
                         `fix_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Структура таблицы `messages`
--

CREATE TABLE `messages` (
                            `message_id` int(11) NOT NULL,
                            `dialog_id` int(11) NOT NULL,
                            `user_id` int(11) NOT NULL,
                            `message_text` varchar(1000) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
                            `message_result` varchar(1000) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
                            `message_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                            `message_likes` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Структура таблицы `sentences`
--

CREATE TABLE `sentences` (
                             `sentence_id` int(11) NOT NULL,
                             `sentence` varchar(256) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
                             `sentence_style` varchar(64) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Структура таблицы `stats`
--

CREATE TABLE `stats` (
                         `user_id` int(11) NOT NULL,
                         `word` varchar(64) COLLATE utf8_bin NOT NULL,
                         `amount` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Структура таблицы `subs`
--

CREATE TABLE `subs` (
                        `user_id` int(11) NOT NULL,
                        `dialog_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
                         `user_id` int(11) NOT NULL,
                         `user_name` varchar(64) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
                         `user_image` varchar(256) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
                         `user_balance` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Структура таблицы `words`
--

CREATE TABLE `words` (
                         `word` varchar(64) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
                         `fix` varchar(64) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
                         `word_type` varchar(64) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
                         `user_id` int(11) NOT NULL,
                         `word_rate` float NOT NULL DEFAULT '0',
                         `word_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `dialogs`
--
ALTER TABLE `dialogs`
    ADD PRIMARY KEY (`dialog_id`);

--
-- Индексы таблицы `messages`
--
ALTER TABLE `messages`
    ADD PRIMARY KEY (`message_id`);

--
-- Индексы таблицы `sentences`
--
ALTER TABLE `sentences`
    ADD PRIMARY KEY (`sentence_id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `dialogs`
--
ALTER TABLE `dialogs`
    MODIFY `dialog_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `messages`
--
ALTER TABLE `messages`
    MODIFY `message_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `sentences`
--
ALTER TABLE `sentences`
    MODIFY `sentence_id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
