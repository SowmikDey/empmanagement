-- DropForeignKey
ALTER TABLE "AuditLog" DROP CONSTRAINT "AuditLog_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "AuditLog" DROP CONSTRAINT "AuditLog_performedBy_fkey";

-- AlterTable
ALTER TABLE "Employee" ALTER COLUMN "status" DROP NOT NULL;
