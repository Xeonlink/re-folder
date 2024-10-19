CREATE TABLE `log` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`message` text NOT NULL,
	`level` text NOT NULL,
	`watcherId` text NOT NULL,
	FOREIGN KEY (`watcherId`) REFERENCES `watcher`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `rule` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`color` text NOT NULL,
	`enabled` integer NOT NULL,
	`prefix` text NOT NULL,
	`suffix` text NOT NULL,
	`extensions` text NOT NULL,
	`path` text NOT NULL,
	`order` integer NOT NULL,
	`watcherId` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `watcher` (
	`id` text PRIMARY KEY NOT NULL,
	`test` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`path` text NOT NULL,
	`color` text NOT NULL,
	`enabled` integer DEFAULT false NOT NULL,
	`extras` text NOT NULL
);
