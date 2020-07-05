CREATE TABLE "farmer" (
  "id" int,
  "password" VARCHAR(32),
  "email" VARCHAR(100)
);

CREATE TABLE "farm" (
  "id" int,
  "farmer_id" int,
  "name" VARCHAR(100),
  "total_area" NUMERIC(100,2),
  "address_id" VARCHAR(32),
  "measure_system" smallint
);

CREATE TABLE "field" (
  "id" int,
  "farm_id" int,
  "total_area" decimal,
  "points" numeric (16,14) ARRAY,
  "name" VARCHAR(100)
);

ALTER TABLE "field" ADD FOREIGN KEY ("farm_id") REFERENCES "farm" ("id");

ALTER TABLE "farm" ADD FOREIGN KEY ("farmer_id") REFERENCES "farmer" ("id");
