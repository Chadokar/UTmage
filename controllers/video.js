/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
/*exports.up = async function (knex) {
    await knex.schema.createTable("videos", (table) => {
      table.increments("id").primary();
      table.string("title").notNullable();
      table.string("description", 20000).notNullable();
      table.string("url").notNullable().unique();
      table.integer("last_update_by").unsigned();
      table.foreign("last_update_by").references("users.id");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
      table.uuid("uuid").defaultTo(knex.fn.uuid());
    });
  };
  
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
/*
  exports.down = async function (knex) {
    await knex.schema.dropTable("videos");
  };*/

// create video controller

const db = require("../db");

const createVideo = async (req, res) => {
  try {
    const { title, description, url, last_update_by, yt_channel } = req.body;
    /**
     * title: string
     * description: string
     * url: string
     * last_update_by: number
     */
    // check if video exists
    const videoExists = await db("videos").where({ url }).first();
    if (videoExists) {
      res.status(400);
      throw new Error("This video already exists");
    }
    const video = await db("videos").insert({
      title,
      description,
      url,
      last_update_by,
      yt_channel,
    });

    res.status(201).json({ video, success: true });
  } catch (error) {
    if (res.statusCode < 400) res.status(500);
    res.send({
      error: error.message || "Internal server error",
      success: false,
    });
  }
};

module.exports = {
  createVideo,
};
