CREATE USER 'TicTacToe'@'localhost' IDENTIFIED BY 'ispitivac';

GRANT CREATE, ALTER, DROP,
INSERT,
UPDATE,
DELETE,
SELECT
,
    REFERENCES,
    RELOAD on *.* TO 'TicTacToe' @'localhost'
WITH
GRANT OPTION;

CREATE DATABASE TicTacToe;

USE TicTacToe;

CREATE TABLE
    friend_requests (
        id INT NOT NULL AUTO_INCREMENT,
        sender INT NOT NULL,
        receiver INT NOT NULL,
        status ENUM('pending', 'accepted') NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        CONSTRAINT fk_friend_request_sender FOREIGN KEY (sender) REFERENCES users (user_id),
        CONSTRAINT fk_friend_request_receiver FOREIGN KEY (receiver) REFERENCES users (user_id)
    );

CREATE TABLE
    `scoreboard` (
        `user_id` int NOT NULL,
        `score` int DEFAULT NULL,
        PRIMARY KEY (`user_id`),
        CONSTRAINT `scoreboard_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE
    `users` (
        `user_id` int NOT NULL AUTO_INCREMENT,
        `user_name` varchar(20) NOT NULL,
        `email` varchar(50) NOT NULL,
        `password` varchar(255) NOT NULL,
        `image` varchar(255) DEFAULT NULL,
        PRIMARY KEY (`user_id`)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;