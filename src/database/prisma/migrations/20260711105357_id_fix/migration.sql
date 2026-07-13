/*
  Warnings:

  - The primary key for the `admin_action_logs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `admin_action_logs` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `cart_items` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `cart_items` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `inventory_movements` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `inventory_movements` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `notifications` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `notifications` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `order_items` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `order_items` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `order_status_history` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `order_status_history` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `product_images` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `product_images` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `refresh_tokens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `refresh_tokens` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `review_images` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `review_images` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `order_item_id` column on the `reviews` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `wishlist_items` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `wishlist_items` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_order_item_id_fkey";

-- AlterTable
ALTER TABLE "admin_action_logs" DROP CONSTRAINT "admin_action_logs_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" BIGSERIAL NOT NULL,
ADD CONSTRAINT "admin_action_logs_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "cart_items" DROP CONSTRAINT "cart_items_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" BIGSERIAL NOT NULL,
ADD CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "inventory_movements" DROP CONSTRAINT "inventory_movements_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" BIGSERIAL NOT NULL,
ADD CONSTRAINT "inventory_movements_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" BIGSERIAL NOT NULL,
ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" BIGSERIAL NOT NULL,
ADD CONSTRAINT "order_items_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "order_status_history" DROP CONSTRAINT "order_status_history_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" BIGSERIAL NOT NULL,
ADD CONSTRAINT "order_status_history_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "product_images" DROP CONSTRAINT "product_images_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" BIGSERIAL NOT NULL,
ADD CONSTRAINT "product_images_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "refresh_tokens" DROP CONSTRAINT "refresh_tokens_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" BIGSERIAL NOT NULL,
ADD CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "review_images" DROP CONSTRAINT "review_images_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" BIGSERIAL NOT NULL,
ADD CONSTRAINT "review_images_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "order_item_id",
ADD COLUMN     "order_item_id" BIGINT;

-- AlterTable
ALTER TABLE "wishlist_items" DROP CONSTRAINT "wishlist_items_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" BIGSERIAL NOT NULL,
ADD CONSTRAINT "wishlist_items_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_user_id_order_item_id_key" ON "reviews"("user_id", "order_item_id");

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "order_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;
