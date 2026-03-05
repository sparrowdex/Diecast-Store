-- This migration accounts for the ARCHIVED status already present in the DB
ALTER TYPE "CollectionStatus" ADD VALUE 'ARCHIVED';
