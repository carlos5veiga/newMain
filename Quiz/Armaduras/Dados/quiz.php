<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <style>
        html,
		body {
			margin: 0;
			padding: 0;
			width: 100%;
			height: auto;
			overflow: hidden;
		}

        body {
			margin: 0;
			padding: 0;

			background: linear-gradient(
				180deg,
				#dff4ff 0%,
				#cceeff 30%,
				#b8e7ff 60%,
				#a8dfff 100%
			);
		}

        #ccontainer {
			width: 100%;
			max-width: 550px;
			margin: 20px auto 0 auto;
			padding: 0 10px;
			box-sizing: border-box;
		}

        #myCanvas {
            width: 100%;
            max-width: 550px;
            height: auto;
            display: block;
        }

        @media (max-width: 480px) {
            #ccontainer {
                margin-top: 20px;
            }
        }
    </style>

    <script>
        window.onload = function () {

            var canvas = document.getElementById("myCanvas");
            var context = canvas.getContext("2d");

            var quizbg = new Image();
            var Question = "";
            var Option1 = "";
            var Option2 = "";
            var Option3 = "";
            var mx = 0;
            var my = 0;
            var CorrectAnswer = 0;
            var qnumber = 0;
            var rightanswers = 0;
            var wronganswers = 0;
            var lock = false;

            var textpos1 = 45;
            var textpos2 = 145;
            var textpos3 = 235;
            var textpos4 = 325;

            var Questions = new Array();
            var Options = new Array();

            <?php
                $datastr = "data" . strval($_GET["q"]) . ".xml";
                $xml = simplexml_load_file($datastr);

                $counter = count($xml);

                for ($i = 0; $i < $counter; $i++) {
                    echo "Questions[" . $i . "]='" . $xml->task[$i]->question . "';";
                    echo "\n";
                    echo "Options[" . $i . "]=['" . $xml->task[$i]->option[0] . "','";
                    echo $xml->task[$i]->option[1] . "','";
                    echo $xml->task[$i]->option[2] . "'];";
                    echo "\n";
                }
            ?>

            quizbg.onload = function () {
                context.drawImage(quizbg, 0, 0);
                SetQuestions();
            };

            quizbg.src = "quizbg.png";

            function SetQuestions() {
                Question = Questions[qnumber];
                CorrectAnswer = 1 + Math.floor(Math.random() * 3);

                if (CorrectAnswer == 1) {
                    Option1 = Options[qnumber][0];
                    Option2 = Options[qnumber][1];
                    Option3 = Options[qnumber][2];
                }

                if (CorrectAnswer == 2) {
                    Option1 = Options[qnumber][2];
                    Option2 = Options[qnumber][0];
                    Option3 = Options[qnumber][1];
                }

                if (CorrectAnswer == 3) {
                    Option1 = Options[qnumber][1];
                    Option2 = Options[qnumber][2];
                    Option3 = Options[qnumber][0];
                }

                context.textBaseline = "middle";
                context.font = "16pt Calibri, Arial";
                context.fillText(Question, 20, textpos1);

                context.font = "14pt Calibri, Arial";
                context.fillText(Option1, 20, textpos2);
                context.fillText(Option2, 20, textpos3);
                context.fillText(Option3, 20, textpos4);
            }

            canvas.addEventListener("click", ProcessClick, false);
            canvas.addEventListener("touchstart", ProcessTouch, false);

            function getCanvasPosition(event) {
                var rect = canvas.getBoundingClientRect();

                var scaleX = canvas.width / rect.width;
                var scaleY = canvas.height / rect.height;

                return {
                    x: (event.clientX - rect.left) * scaleX,
                    y: (event.clientY - rect.top) * scaleY
                };
            }

            function ProcessClick(ev) {
                var position = getCanvasPosition(ev);

                mx = position.x;
                my = position.y;

                HandleAnswer();
            }

            function ProcessTouch(ev) {
                ev.preventDefault();

                var touch = ev.touches[0];
                var position = getCanvasPosition(touch);

                mx = position.x;
                my = position.y;

                HandleAnswer();
            }

            function HandleAnswer() {
                if (lock) {
                    ResetQ();
                } else {
                    if (my > 110 && my < 180) {
                        GetFeedback(1);
                    }

                    if (my > 200 && my < 270) {
                        GetFeedback(2);
                    }

                    if (my > 290 && my < 360) {
                        GetFeedback(3);
                    }
                }
            }

            function GetFeedback(a) {
                if (a == CorrectAnswer) {
                    context.drawImage(quizbg, 0, 400, 75, 70, 480, 110 + (90 * (a - 1)), 75, 70);
                    rightanswers++;
                } else {
                    context.drawImage(quizbg, 75, 400, 75, 70, 480, 110 + (90 * (a - 1)), 75, 70);
                    wronganswers++;
                }

                lock = true;

                context.font = "14pt Calibri, Arial";
                context.fillText("Clique aqui para continuar", 20, 380);
            }

            function ResetQ() {
                lock = false;
                context.clearRect(0, 0, 550, 400);
                qnumber++;

                if (qnumber == Questions.length) {
                    EndQuiz();
                } else {
                    context.drawImage(quizbg, 0, 0);
                    SetQuestions();
                }
            }

            function EndQuiz() {
                canvas.removeEventListener("click", ProcessClick, false);
                canvas.removeEventListener("touchstart", ProcessTouch, false);

                context.drawImage(quizbg, 0, 0, 550, 90, 0, 0, 550, 400);

                context.font = "20pt Calibri, Arial";
                context.fillText("Você terminou o questionário", 20, 100);

                context.font = "16pt Calibri, Arial";
                context.fillText("Respostas certas: " + String(rightanswers), 20, 200);
                context.fillText("Respostas erradas: " + String(wronganswers), 20, 240);
            }
			
        };
    </script>
</head>

<body>

    <div id="ccontainer">
        <canvas id="myCanvas" width="550" height="400"></canvas>
    </div>

</body>
</html>