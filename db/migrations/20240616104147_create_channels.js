/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("channels", (table) => {
    table.increments("id").primary();
    table.string("title").notNullable();
    table.string("description", 20000).notNullable();
    table.string("yt_channel_id").notNullable();
    table.string("user_id").notNullable();
    table.string("url").notNullable().unique();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.uuid("uuid").defaultTo(knex.fn.uuid());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTable("channels");
};
