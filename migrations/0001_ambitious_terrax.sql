ALTER TABLE `users` RENAME COLUMN "onboarding" TO "study_active";--> statement-breakpoint
ALTER TABLE `users` ALTER COLUMN "study_active" TO "study_active" integer DEFAULT 0;