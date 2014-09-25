/*
Visit http://rpgjs.com for documentation, updates and examples.

Copyright (C) 2011 by Samuel Ronce

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

/**
 * @class Player Add an event controllable: the player
 * @author Samuel Ronce
 * @extends Event
 * @constructor
 * @param {Object} prop See "addEvent" in Rpg.js
 * @param {Rpg} rpg Rpg class
 */

function Player(prop, rpg) {
    var speed = prop.speed ? prop.speed : 4;
	var prop_event = [{
		name: 'Player',
		x: prop.x,
		y: prop.y,
		regX: prop.regX,
		regY: prop.regY
	},
	
		[	
			{
				
				character_hue: prop.filename,
				direction: prop.direction ? prop.direction : 'bottom',
				trigger: 'player',
				no_animation: prop.no_animation,
				speed: speed,
				commands: [],

			}
		]
	];	
   rpg.speedScrolling = speed;
   
   this.keyBuffer = 0;
   this.moving = false;
   this.keypress = false;
   this.freeze = false;
   
   this.transfert = [];
   this.inTransfert = false;
   
   this.parent = Event;  
   this.parent(prop_event, rpg);
   
   this.actions = prop.actions;
   this.handleKeyPress();
   this.tickPlayer = this._tick;
   this.old_direction = this.direction;
	 
}

var p = Player.prototype = new Event();

// Private
p.handleKeyPress = function() {
	var self = this;
	
	function keytype(code) {
		
		switch (code) {
			case 97:
			case 65: return 'A'; break;
			case 122: return 'Z'; break;
			case 101: return 'E'; break;
			case 113: return 'Q'; break;
			
			
			case 13: return 'Enter'; break;
			case 16: return 'Shift'; break;
			case 17: return 'Ctrl'; break;
			case 18: return 'Alt'; break;
			case 19: return 'Pause'; break;
			case 32: return 'Space'; break;
		}
		
	}
	
	function keyaction(type, e) {
		var i, act;
		for (i = 0 ; i < self.actions.length ; i++) {
			act = self.rpg.actions[self.actions[i]];	
			if (act[type]) {
				if (self.rpg.valueExist(act[type], keytype(e.which))) {
					self.action(self.actions[i]);
				}
			}
		}
	}
	
	document.onkeydown = function(e) {
		var blockMovement = self.movementIsBlocked();

		if (!self.freeze && !blockMovement) {
			if (!blockMovement) {
				if (e.keyCode >= 37 && e.keyCode <= 40) {
					self.keyBuffer = e.keyCode;
				}
			}

			keyaction('keydown', e);
		}
		
	},
	

	document.onkeyup = function(e) {
		if (self.freeze) return false;
		if (self.keyBuffer == e.keyCode) {
			self.keyBuffer = 0;
		}
		
		keyaction('keyup', e);
	}
	
	document.onkeypress = function(e) {
	
		var blockMovement = self.movementIsBlocked();
		
		// Close Window
		var dialog_open = false;
		var dialog;

		for (var i=0 ; i < self.rpg.currentWindows.length ; i++) {
			dialog = self.rpg.currentWindows[i];
			if (dialog.isOpen) {
				dialog_open = true;
				if (dialog.keyclose != null && dialog.keyclose == keytype(e.keyCode)) {
					dialog.close();
				}
			}
		}
		
		if (self.freeze && !blockMovement) return false;
		
		if (e.keyCode == 32 || e.keyCode == 13) {
			if (!dialog_open) {
				self.interactionEventBeside('action_button');
			}
		}
		
		
		keyaction('keypress', e);
	}	
}

/**
 * Whether the player's movement is blocked. The movement is blocked when the player is in action or when a window is displayed and property "blockMovement" to true
 * @method movementIsBlocked
 * @return Boolean min Returns true if the player's movement is blocked
*/
p.movementIsBlocked = function() {
	var blockMovement = false;
	
	if (this.rpg.inAction) return false;

	for (var i=0 ; i < this.rpg.currentWindows.length ; i++) {
		if (this.rpg.currentWindows[i].blockMovement) {
			blockMovement = true;
			break;
		}
	}
	return blockMovement;
}

// Private
p._tick = function() {
	var self = this;
	 if (this.keyBuffer && !this.moving) {
		var key = this.keyBuffer;
		var direction = 0;
		switch(key) {
			case 37:
				if (this.rpg.isPassable(this.x - 1, this.y)) {
					direction = 4;
				}
				this.direction = 'left';
			break;
			case 38:
				if (this.rpg.isPassable(this.x, this.y - 1)) {
					direction = 2;
				}
				this.direction = 'up';
			break;
			case 39:	
				if (this.rpg.isPassable(this.x + 1, this.y)) {
					direction = 6;
				}
				this.direction = 'right';
			break;
			case 40:
				if (this.rpg.isPassable(this.x, this.y + 1)) {
					direction = 8;
				}
				this.direction = 'bottom';
			break;
		}
		
		if (direction == 0 && !this.moving && !this.inAction) {
			this.animation('stop');
		}
		
		if (!self.moving && direction != 0) {
			self.moving = true;
			self.move([direction], function() {
				self.moving = false;
				if (self.keyBuffer == 0 && !self.inAction) {
					
					self.animation('stop');
				}
			});
		}
		
		for (var i=0 ; i < this.transfert.length ; i++) {
			if (this.x == this.transfert[i].x && this.y == this.transfert[i].y && !this.inTransfert) {
				var map = this.rpg.getPreparedMap(this.transfert[i].map);
				if (map) {
					if (!map.propreties.player) map.propreties.player = {};
					map.propreties.player.x = this.transfert[i].x_final;
					map.propreties.player.y = this.transfert[i].y_final;
					this.inTransfert = true;
					this.rpg.callMap(map.name);
				}
			}
		
		}
		
		this.interactionEventBeside('contact');	
		
		
	}
}

/**
 * Raise an event next to the player and by his direction if the trigger fired
 * @method interactionEventBeside
 * @param {String} trigger Name of the trigger to make (action_button|contact)
*/
p.interactionEventBeside = function(trigger) {
	var self = this;
	var event = this.getEventAround();
	if (event.up != null) {
		var index = event.up.getIndex();
		if (this.getIndex() < index) {
			this.setIndexAfter(index);	
		}
	}
	else if (event.bottom != null) {
		var index = event.bottom.getIndex();
		if (this.getIndex() > index) {
			this.setIndexBefore(index);
		}
	}
	event = event[this.direction];
	if (event != null) {	
		if (event.trigger == trigger) {
			this.freeze = true;
			var ini_dir = event.direction;
			if (!event.direction_fix) {
				event.turnTowardPlayer();
			}
			event.bind('onFinishCommand', function() {
				event.setStopDirection(ini_dir);
				self.freeze = false;
			});
			event.onCommands();
		}
	}
	
}


p.setTransfert = function(prop) {
	 this.transfert = prop;
}
