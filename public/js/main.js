'use strict'
window.onload = function()
{
	// let iframeTag = document.getElementById("result");
	
	const keys = {ctrl: false, s: false};
	let string = "";
	const editorHtml = ace.edit("html");
	editorHtml.setTheme("ace/theme/monokai");
	editorHtml.getSession().setMode("ace/mode/html");
	const editorCss = ace.edit("css");
	editorCss.setTheme("ace/theme/monokai");
	editorCss.getSession().setMode("ace/mode/css");
	const editorJs = ace.edit("js");
	editorJs.setTheme("ace/theme/monokai");
	editorJs.getSession().setMode("ace/mode/javascript");
	let iframe = document.getElementById("result");
	iframe = iframe.contentWindow || (iframe.contentDocument.document || iframe.contentDocument);
	let parametr = location.search.replace("?", "").match(/namespace=[a-z, A-Z]+/)[0].split("=")[1];
	// alert(parametr);
	// let isAlreadyConnected = false;
	//sockets
	let socket= io();
			

			// socket.on("prohibited", function(data)
			// {
			// 	alert(data.msg);
			// 	window.location.replace("/");
			// });


			socket.emit("myRoomName", {namespace: parametr});
			socket.on("newClientEvent", function(data)
			{
				let indicators = Array.from(document.querySelectorAll("header div"));
				for(let indicator of indicators)
				{
					indicator.style.background = "red";
				}
				for(let i = 0; i < data.Count; i++)
				{
					indicators[i].style.background = "green";
				}
			});
			socket.on("dataCreatedEvent", function(data)
			{
				updateData(data);
			});
	//end sockets

		function updateData(data)
		{
			iframe.document.open();
			iframe.document.write(createString(data.htmlVal, data.cssVal, data.jsVal));
				// iframe.setAttribute("onload", data.jsVal.toString());
				iframe.document.close();
				editorHtml.setValue(data.htmlVal);
				editorCss.setValue(data.cssVal);
				editorJs.setValue(data.jsVal);
		}

		socket.on("newDataEvent", function(data)
		{
			updateData(data);	
		});

	//Obrabotka ctrl s
		document.onkeydown = function(e)
		{
			if(e.keyCode === 17)
				keys.ctrl = true;
			if(e.keyCode === 81)
				keys.s = true;
			if(keys.s === true && keys.ctrl === true)
				sendData();
		}
		document.onkeyup = function(e)
		{
			if(e.keyCode === 17)
				keys.ctrl = false;
			if(e.keyCode === 81)
				keys.s = false;
		}

		$("#btnSave").click(function()
		{
			sendData();
		});

		function sendData()
		{
			iframe.document.open();
			const info = createString(editorHtml.getValue(), editorCss.getValue(), editorJs.getValue());
			iframe.document.write(info);
			iframe.document.close();
		
		// iframeTag.setAttribute("onload", editorJs.getValue());
		// iframeTag.contentWindow.location.reload();
			socket.emit("changeEmit", {
				htmlVal: editorHtml.getValue(),
				cssVal: editorCss.getValue(),
				jsVal: editorJs.getValue(),
				name: parametr
			});
		}

	

	if($(document).width() <= 750 )
	{
		$('.html-name span').css("background", "#666");
	}
	$(window).resize(function()
	{
		if($(document).width() <= 750 )
		{
			$('.html-name span').css("background", "#666");
			$("#result").css("height", "500px").css("z-index", "-1");
			$("#css, #js").css("z-index", "-1");
		}
		else
		{
			$("#result").css("height", "400px");
			$('.editor div').css("z-index", "1");
			$(".names div span").css("background", "#222");
		}
	});
	$(".names  div").click(function(){
		if($(document).width() <= 750 )
		{

			$(".editor div").css("z-index", "-1");
			$(".editor frame").css("z-index", "-1").css("visibility", "hidden");
			$(".names div span").css("background", "#222");
			$("#result").css("height", "0px");
			$("#" + this.dataset.id).css("z-index", "1");
			$(this).children().css("background", "#666");
			if(this.dataset.id === 'result')
			{
				$("#" + this.dataset.id).css("visibility", "visible").css("background", "white").css("height", "500px");
			}
		}
	});

}


function createString(editorHtml, editorCss, editorJs)
{
	const html = document.createElement('html');
	const head = document.createElement('head');
	const body = document.createElement('body');
	body.innerHTML = editorHtml;
	const style = document.createElement('style');
	style.innerHTML = editorCss;
	const script = document.createElement('script');
	script.innerHTML = editorJs;
	head.appendChild(style);
	// head.appendChild(script);
	html.appendChild(head);
	html.appendChild(body);
	return html.innerHTML;
}