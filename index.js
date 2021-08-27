/**
 *
 *  @name imagine-a-bot
 *  @author 8bou3 <i8bou3@gmail.com>
 *  @license gpl-3.0
 *  @copyright (c) 2021 imagine-a-bot
 *
 */
require("dotenv").config({ path: "./.env" });
const config = require("./config");
const { ShardingManager } = require("discord.js");

const manager = new ShardingManager("./bot.js", {
  token: config.clientData.token,
});

manager.on("shardCreate", (shard) => console.log(`Launched shard ${shard.id}`));
manager.spawn();
