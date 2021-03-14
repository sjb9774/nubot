# Ironmon bot

For ease of use in ironmon runs

## Commands
* !bst `<pokemonName>` spits out the combined Base Stat Total of pokemonName.
  * Currently works with multi-word names (looking at you mr. mime)
  * Need to fix unicode support for the nidorans and flabebe (currently I've added entries with non unicode versions of the names aka nidoran male vs nidoran female. As the db fills out with more info, however, this will be made more robust with multiple accepted keys for a single entry)

* !terry mourns Terry :(
  * In NumotTheNummy's channel it's also the 3rd bot to respond to this command so lol.

* !types Returns a given pokemon's types
  * Uses a specified generation filter if given (`!types Clefable +omega-ruby`) or uses the value set by `!setgen` otherwise

* !setgen `<game>`
  * Sets the default generation for commands that rely on a specified generation to make sense
    * Sets the value on a per-channel basis
    * Currently restrcited to mods and broadcasters
  * List of valid `<game>` values are available in gen/genstate.js
  * Current gen-requiring commands
    * !moves
    * !types

* !getgen
  * Returns the default generation set by `!setgen` for the channel

* !moves Returns the levels at which a given pokemon learns moves for a given game
  * Uses a specified generation filter if given (`!moves Blaziken +omega-ruby`) or uses the value set by `!setgen` otherwise
  * Uses pokeapi.co for data

Testing

* You can use the test script to interact with the bot's logic as through the command line
  * Note that for bash you must use single quotes for strings using `!<text>` patterns otherwise it will be interpreted as a bash event
  * `$ npm test '!types Vileplume'`
  * `>> Vileplume is Grass and Poison`
  * Supports environment variables to mimic important data
    * `CLI_USER_TYPE` defaults to `"user"` but can be set to `"mod"` to execute mod-only commands
    * `CLU_USERNAME` defaults to `"CLI"` but can be set to any value; most often used to mimic broadcaster privileges by matching the channel name
    * `CLI_CHANNEL` defaults to an arbitrary value of `"#CLI"`, otherwise can be used to get channel-specific information to in combination with `CLI_USERNAME` to mimic broadcaster privileges
      * Note that with default values, this will give you broadcaster privileges for your commands

Planned additions

* !nextMove pokemonName lvl 
  * Gives next level for when a move will be learned by leveling up

* !info moveName\
  * If move: Gives basic move info, e.g. description, power, acc, Spe vs Phy
  * If poke: Gives basic poke info, types, BST, HP 
  * Should work similar to Pokemon Showdown /dt command

* !info 