[		// Global	{		name: 'monster2',		x: 19,		y: 21	},	// Pages	[			// Page 1		{						character_hue: "090-Monster04.png",			direction: 'bottom',			type: 'random',			trigger: 'event_touch',			speed: 13,			frequence: 0,			commands: [							],						action_battle: {				area: 4,				hp_max: 200,				animation_death: "Darkness 1",				actions: ['attack_ennemy'],				ennemyDead: [{					name: "coin", 					probability: 50, 					call: "drop_coin"				}],				detection: '_default',				nodetection: '_default',				attack: '_default',				affected: '_default',				offensive: '_default',				passive: '_default'			}		}			]]