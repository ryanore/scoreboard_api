var io = require('../../socket').io;
var events = require('../../base/events');
var Clock = require('./game-clock');
var Game = require('./game');

var Scoreboard = function(){
	this.games = {};

  events.on('room_empty', this.onEmptyRoom.bind(this));

  io.on('connection',  (connection) => {
		this.socket = connection;
		this.socket.on('join_game', this.onClientJoin.bind(this));
  });
};


Scoreboard.prototype = {
	/**
	 * Client Connected to socket,  create a new Client to handle its own business
	 * @param  {String} gameId Cooresponds to mongoDb id
	 */
	onClientJoin: function(gameId) {
		this.getGame(gameId, (game) => {
			game.addClient(this.socket);
		});
	},


	/**
	 * Client Disconnected, remove from list of active clients,
	 * If it was the last one in the room, remove the room
	 */
	onEmptyRoom: function(gameId) {
		var game = this.games[gameId];
		if( game ){
			delete this.games[gameId];
		}
	},


	/**
	 * Get Game Model -
	 * If it's already in memory use that, otherwise grab record from DB and add to active games
	 */
	getGame: function(id, next){
		if(this.games[id]){
			next(this.games[id]);
		}
		else {
			this.games[id] = new Game(id, (game) =>{
				next(game)
			});
		}
	}

};

module.exports = Scoreboard;