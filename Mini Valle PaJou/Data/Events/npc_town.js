[	
	// Global
	{
		x: 27,
		y: 18
	},
	// Pages
	[	
		// Page 1
		{
			character_hue: '107-Civilian07.png',
			trigger: 'action_button',
			direction: 'right',
			frequence: 5,
			commands: [
				{show_text: '¿En que Guerra Mundial lanzaron una bomba nuclear?'},
				{self_switch_on: ['A']},
			]
		},
		// Page 2
		{
			conditions: {self_switch: 'A'}, 
			character_hue: '107-Civilian07.png',
			trigger: 'action_button',
			direction: 'right',
			frequence: 5,
			commands: [
				{show_text: 'Donde fue descubierta la polbora ?'},
				{self_switch_off: ['A']}
			]
		}
		
	]
]