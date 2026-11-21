/*
	Toggle Section
*/
function toggle_section_button_click(e){
	let target = e.target;
	let label = target.parentElement;
	let container = label.parentElement;
	
	if (target.classList.contains("selected")){
		target.classList.add("not-selected")
		target.classList.remove("selected");
		
		container.classList.add("section-unselected");
		target.classList.add("toggle-exception");
		label.classList.add("toggle-exception");
	}
	else{
		target.classList.add("selected")
		target.classList.remove("not-selected");
		
		container.classList.remove("section-unselected");
		target.classList.remove("toggle-exception");
		label.classList.remove("toggle-exception");
	}
}

//Ajout des boutons toggles
var toggle_section = document.getElementsByClassName("toggle-section");
for(let i=0; i<toggle_section.length; ++i){
	toggle_section[i].innerHTML = "<span onclick='toggle_section_button_click(event)' class='toggle-section-button selected'></span>"+toggle_section[i].innerHTML;
}

/*
	Quizz 
*/
var parties = {}

function answer_click(event, party_id, answer_index){
	let party = parties[party_id];
	
	if(party.state!=0)
		return;
	
	party.selected_answer = answer_index;
	update_party(party);
}

function quiz_button_click(event, party_id){
	
	let party = parties[party_id];
	
	if(party.state == 0){
		if(party.selected_answer == "-1"){
			alert("Erreur, veuillez selectionner une réponse");
			return;
		}
		else{
			if(party.selected_answer==party.quiz[party.question_current-1].answer)
				party.score++;
			
			party.state = 1;
		}
	}
	else if(party.state == 1){
		party.selected_answer = -1;
		
		if(party.question_current < party.question_max){
			party.state = 0;
			party.question_current++;
		}
		else{
			party.state = 2;
		}
	}
	else{
		make_party(party.quiz, party_id);
		return;
	}
	
	update_party(party);
}

function init(party_id){
	let party = parties[party_id];
	
	for(let i=0; i<4; ++i)
		party.answers[i].setAttribute("onclick","answer_click(event, '"+party_id+"',"+i+")");
	
	party.quiz_button.setAttribute("onclick","quiz_button_click(event, '"+party_id+"')");
}

function update_party(party){
	let n = party.question_current-1;
	let answer_selected = party.answers[party.selected_answer];
	
	//clear old classes
	for(let i=0; i<4; ++i){
		party.answers_text[i].innerHTML = party.quiz[n].propositions[i];
		
		party.answers[i].classList.remove("quiz-answer-good");
		party.answers[i].classList.remove("quiz-answer-bad");
		party.answers[i].classList.remove("quiz-answer-selected");
	}
	
	party.quiz_container.classList.remove("quiz-last-question");
	party.quiz_container.classList.remove("quiz-state-question");
	party.quiz_container.classList.remove("quiz-state-answer");
	party.quiz_container.classList.remove("quiz-state-score");
	
	//Update question count
	party.counter_current.innerHTML = party.question_current;
	party.counter_max.innerHTML = party.question_max;
	
	//Update question
	party.question.innerHTML = party.quiz[n].question;
	
	//Update explication
	party.explication_text.innerHTML = party.quiz[n].explication;
	
	//Update contextual classes
	if(party.state==0){
		party.quiz_container.classList.add("quiz-state-question");
		
		if(answer_selected != undefined)
			answer_selected.classList.add("quiz-answer-selected");
	}
	else if(party.state==1){
		party.quiz_container.classList.add("quiz-state-answer");
		
		if(answer_selected != undefined){
			if(party.quiz[n].answer == party.selected_answer){
				answer_selected.classList.add("quiz-answer-good");
			}
			else{
				answer_selected.classList.add("quiz-answer-bad");
			}
		}

		if(party.question_current == party.question_max)
			party.quiz_container.classList.add("quiz-last-question");
	}
	else{
		party.quiz_container.classList.add("quiz-state-score");
		
		party.score_value.innerHTML = party.score;
		party.score_total.innerHTML = party.question_max;
	}
}

function make_party(quiz, quiz_container_id){
	if(document.getElementById(quiz_container_id) == undefined)
		return;
	
	let quiz_container = document.getElementById(quiz_container_id);
	let counter = quiz_container.querySelector('.quiz-question-counter');
	
	let counter_current = counter.querySelector('.quiz-question-counter-current');
	let counter_max = counter.querySelector('.quiz-question-counter-max');
	
	let question = quiz_container.querySelector(".quiz-question");
	let answers = quiz_container.querySelectorAll(".quiz-answer");
	let answers_text = quiz_container.querySelectorAll(".quiz-answer-text");
	
	let explication_text = quiz_container.querySelector(".quiz-explication-text");
	let quiz_button = quiz_container.querySelector(".quiz-button");
	
	let score_value = quiz_container.querySelector(".quiz-score-value");
	let score_total = quiz_container.querySelector(".quiz-score-total");
	
	let party = {
		"question_current":1,
		"question_max":quiz.length,
		"score": 0,
		"state":0, /*0: question | 1:answer | 2:score*/
		"quiz": quiz,
		"quiz_container" : quiz_container,
		"counter" : counter,
		"counter_current": counter_current,
		"counter_max" : counter_max,
		"question" : question,
		"answers" : answers,
		"answers_text" : answers_text,
		"selected_answer": -1,
		"explication_text": explication_text,
		"quiz_button" : quiz_button,
		"score_value": score_value,
		"score_total": score_total
	};
	
	parties[quiz_container_id] = party;
	
	init(quiz_container_id);
	update_party(party);
}

if(document.title == "Histoire"){
	let history_quiz = [
	{
		"question":"Quelle a été l'invention de Franz Reichelt ?",
		"propositions":["Une tenu parachute", "Un ballon maximisant le rebond", "Une soufflerie verticale", "Le stade en forme de pilule"],
		"answer":0,
		"explication":"En 1912, Franz Reichelt essaie sa tenu parachute en sautant du premier étage de la tour Eiffel."
	},
	{
		"question":"Où se pratiquait à l'origine le Wingball ?",
		"propositions":["Dans les Gorges du Verdon", "Dans le Canyon Sainte-Anne", "Dans le grand Canyon aux Etats-Unis", "Dans les Gorges de Gorropu"],
		"answer":2,
		"explication":"C'est dans le grand Canyon des Etats-Unis qu'est apparue la pratique du Wingball, le canyon était utilisé par des amateurs de Wing-suit qui profité de ses forts courants ascendants."
	},
	{
		"question":"Comment se nomme l'organisation à la tête du Wingball ?",
		"propositions":["Fédération Internationale du Wingball", "Organisation du Wingball Mondial", "Association Internationale du Wingball", "Union des Clubs de Wingball Mondiaux"],
		"answer":0,
		"explication":"La FIW-B (Fédération Internationale du Wingball) est fondée en 1975 afin de mettre en place des compétitions mais aussi clarifier le règlement du Wingball."
	},
	{
		"question":"Quelle était la forme du premier stade dédié à la pratique du Wingball ?",
		"propositions":["Un donut", "Un disque", "Une ellipse", "Une pilule"],
		"answer":2,
		"explication":"Bien qu'aujourd'hui les stades de Wingball aient tous une forme caractéristique de pilule, le premier stade construit à Dubaï avait une forme d'ellipse."
	},
	{
		"question":"Quels sont les premiers jeux olympiques où l'on a pu assister à une épreuve de Wingball ?",
		"propositions":["Les jeux olympiques d'Atlanta", "Les jeux olympiques de Sydney", "Les jeux olympiques d'Athène", "Les jeux olympiques de Pékin"],
		"answer":2,
		"explication":"C'est à Athène que l'on voit pour la première une épreuve de Wingball aux jeux olympiques, c'est cet évènement qui marque la naissance du Wingball moderne"
	},
	{
		"question":"Quand a eu lieu la première Compétition Internationale de Wingball ?",
		"propositions":["En 2004", "En 2008", "En 2009", "En 2010"],
		"answer":3,
		"explication":"La Compétition Internationale de Wingball est créée en 2009 mais ce ne sera qu'en 2010 en France qu'aura lieu la première édition."
	}];
	
	make_party(history_quiz, "quiz-history");
}

/*Commentaire*/

var contenu = document.getElementById("receptioncommentaire");
var texte = document.getElementById("texte");

function ajouter(){
	if(texte.value == "")
		return;

	let image= new Image(100, 100);
	image.src="public/img/pdpvisiteur.jpg";

	let textecommentaire = document.createElement("div");
	textecommentaire.className="textecommentaire";
	textecommentaire.innerHTML+=("<b>Visiteur </b><em>Il y a 1 seconde</em></br>");
	textecommentaire.innerHTML+=texte.value ;
	let commentaire = document.createElement("div");
	commentaire.className="commentaire";
	let PDP=document.createElement("div");
	PDP.className="PDP";
	PDP.appendChild(image);
	receptioncommentaire.appendChild(commentaire);
	commentaire.appendChild(PDP);
	commentaire.appendChild(textecommentaire);
	texte.value="";
}

function capturer(event){
	if(event.key=="Enter"){
		ajouter();
		event.preventDefault();
	}
}

/*Chart */
if(document.title =="Les tournois"){

	const  backgroundColor_gold = [
		'#ddd',
		'#f33',
		'#33f'
	];

	const borderColor = [
		'white',
	];

	const dataJoGold = {
		labels: [ 'Corée du Sud', 'Japon', 'France'],
		datasets: [
			{
				data: [5, 3, 2],
				backgroundColor: backgroundColor_gold,
				borderColor: borderColor,
				borderWidth: 1
			}
		]
	};

	const configJoGold = {
		type: 'pie',
		data: dataJoGold,
		options: {
			responsive: true,
			plugins: {
				legend: {
					position: 'bottom',
					labels:{
						font: {
							size: 14,
							family: 'Oswald'
						}
					}
				}
			}
		},
	};

	const  backgroundColor_silver = [
		'#f82',
		'#33f',
		'#363',
		'#ddd',
		'#f33',
		'#333'
	];

	const dataJoSilver = {
		labels: ['Etats-Unis', 'France', 'Emirats Arabes Unis', 'Corée du Sud', 'Japon', 'Afrique du Sud'],
		datasets: [
			{
				data: [3, 2, 2, 1, 1, 1],
				backgroundColor: backgroundColor_silver,
				borderColor: borderColor,
				borderWidth: 1
			}
		]
	};
  
	const configJoSilver = {
		type: 'pie',
		data: dataJoSilver,
		options: {
		  	responsive: true,
			plugins: {
				legend: {
					position: 'bottom',
					labels:{
						font: {
							size: 14,
							family: 'Oswald'
						}
					}
				}
			}
		},
	};

	const  backgroundColor_bronze = [
		'#33f',
		'#f33',
		'#ddd',
		'#ee3',
		'#292',
		'#f55'
	];

	const dataJoBronze = {
		labels: ['France', 'Japon', 'Corée du Sud', 'Espagne', 'Brésil', 'Canada'],
		datasets: [
			{
				data: [4, 2, 1, 1, 1, 1],
				backgroundColor: backgroundColor_bronze,
				borderColor: borderColor,
				borderWidth: 1
			}
		]
	};
  
	const configJoBronze = {
		type: 'pie',
		data: dataJoBronze,
		options: {
		  	responsive: true,
			plugins: {
				legend: {
					position: 'bottom',
					labels:{
						font: {
							size: 14,
							family: 'Oswald'
						}
					}
				}
			}
		},
	};

	const  backgroundColor_total = [
		'#33f',
		'#ddd',
		'#f33',
		'#f82',
		'#363',
		'#ee3',
		'#292',
		'#333',
		'#f55'
	];

	const dataJoTotal = {
		labels: ['France', 'Corée du Sud', 'Japon', 'Etats-Unis', 'Emirats Arabes Unis', 'Espagne', 'Brésil', 'Afrique du Sud', 'Canada'],
		datasets: [
			{
				data: [8, 7, 6, 3, 2, 1, 1, 1, 1],
				backgroundColor: backgroundColor_total,
				borderColor: borderColor,
				borderWidth: 1
			}
		]
	};
  
	const configJoTotal = {
		type: 'bar',
		data: dataJoTotal,
		options: {
		  	responsive: true,
			plugins: {
				legend: {
					display: false
				}
			}
		},
	};

	const  backgroundColor_champ = [
		'#ddd',
		'#33f',
		'#f33',
	];

	const dataCmChamp = {
		labels: ['Corée du Sud', 'France', 'Japon'],
		datasets: [
			{
				data: [2, 1, 1],
				backgroundColor: backgroundColor_champ,
				borderColor: borderColor,
				borderWidth: 1
			}
		]
	};
  
	const configCmChamp = {
		type: 'pie',
		data: dataCmChamp,
		options: {
		  	responsive: true,
			plugins: {
				legend: {
					position: 'bottom',
					labels:{
						font: {
							size: 14,
							family: 'Oswald'
						}
					}
				}
			}
		},
	};

	const  backgroundColor_qualif = [
		'#ddd',
		'#33f',
		'#f33',
		'#f82',
		'#363',
		'#f55',
		'#3aF',
		'#272',
		'#fb1',
		'#239',
		'#f11',
		'#333',
		'#00a',
		'#292',
	];

	const dataCmQualif = {
		labels: ['Corée du Sud', 'France', 'Japon', 'Etats-Unis', 'Emirats Arabes Unis', 'Canada', 'Luxembourg', ' Arabie Saoudite', 'Allemagne', 'Royaume-Uni', 'Chine', 'Afrique du Sud', 'Russie', 'Brésil'],
		datasets: [
			{
				axis: 'y',
				data: [4, 4, 4, 4, 4, 3, 2, 1, 1, 1, 1, 1, 1, 1],
				backgroundColor: backgroundColor_qualif,
				borderColor: borderColor,
				borderWidth: 1,
			}
		]
	};
  
	const configCmQualif = {
		type: 'bar',
		data: dataCmQualif,
		options: {
			indexAxis: 'y',
		  	responsive: true,
			plugins: {
				legend: {
					display: false
				}
			}
		},
	};

	const  backgroundColor_bless = [
		'#c30000',
	];

	const dataCmBless = {
		labels: ['2010', '2014', '2018', '2022'],
		datasets: [
			{
				axis: 'y',
				data: [5, 9, 2, 3],
				backgroundColor: backgroundColor_bless,
				borderColor: borderColor,
				borderWidth: 1,
			}
		]
	};
  
	const configCmBless = {
		type: 'bar',
		data: dataCmBless,
		options: {
		  	responsive: true,
			plugins: {
				legend: {
					display: false
				}
			}
		},
	};

	let chartJoGold_canvas = document.getElementById('chart-jo-gold');
	if(chartJoGold_canvas != undefined)
		var a = new Chart(chartJoGold_canvas.getContext('2d'), configJoGold);

	let chartJoSilver_canvas = document.getElementById('chart-jo-silver');
	if(chartJoSilver_canvas != undefined)
		new Chart(chartJoSilver_canvas.getContext('2d'), configJoSilver);

	let chartJoBronze_canvas = document.getElementById('chart-jo-bronze');
	if(chartJoBronze_canvas != undefined)
		new Chart(chartJoBronze_canvas.getContext('2d'), configJoBronze);

	let chartJoTotal_canvas = document.getElementById('chart-jo-total');
	if(chartJoTotal_canvas != undefined)
		new Chart(chartJoTotal_canvas.getContext('2d'), configJoTotal);

	let chartCmChamp_canvas = document.getElementById('chart-cm-champ');
	if(chartJoTotal_canvas != undefined)
		new Chart(chartCmChamp_canvas.getContext('2d'), configCmChamp);

	let chartCmQualif_canvas = document.getElementById('chart-cm-qualif');
	if(chartJoTotal_canvas != undefined)
		new Chart(chartCmQualif_canvas.getContext('2d'), configCmQualif);

	let chartCmBless_canvas = document.getElementById('chart-cm-bless');
	if(chartJoTotal_canvas != undefined)
		new Chart(chartCmBless_canvas.getContext('2d'), configCmBless);
}