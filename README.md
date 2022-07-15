# PRIMA
Abgaben und Übungen aus Prototyping interaktiver Medienapplikationen und Games im Sommersemester 2022 an der HFU 


Titel: Mario vs. Goomba
Autor: Alida Kohler
Sommersemester 2022
MKB 5
Kurs: PRIMA
Dozent: Prof. Jirka Dell'Oro-Friedl
Executable: https://kohleral.github.io/PRIMA/Super_Mario/index.html
Source-Code: https://github.com/KohlerAl/PRIMA/tree/main/Super_Mario
Design-Dokument: https://kohleral.github.io/PRIMA/Super_Mario/Documents/Prima_Designdokument.pdf
Anleitung: 
Laufen -> A und D oder Pfeiltasten 
Springen -> Leertaste
Das Ziel ist es, alle Goombas in der vorgegebenen Zeit von den Plattformen zu schubsen. 


Vorgaben (ausführliche Variante mit Links zu den einzelenen Code-Stellen im Design-Dokument)

|1. Units and Positions   	|0 ist in der unteren linken Ecke des Spielfelds, das ermöglicht einfaches Positionieren von Mario und den Goombas und vereinfacht die Überprüfung ob die Goombas oder Mario runtergefallen sind. 1 ist eine Item- oder Boden-Box, die jeweils 1 x 1 x 1 Meter groß sind.    	|
|2. Hierarchy	            |- Camera
                             - Environment  
                                    - Boxes
                                    - Background
                                    - Ground
                             - Opponents
                             - Avatar
                             - Light
                             - Sounds
                             -> Grundstruktur und "Andockstellen" für den Code werden im Editor erstellt, zudem das grundlegende Level, damit es etwas gibt womit gearbeitet werden kann.|
|3. Editor                 	|Im Editor wird die Grundstruktur des Spiels erstellt. Dazu gehören die Parent-Nodes für die Goombas, Mario und die Item-Boxen. Zudem werden die einzelnen Boden-Stücke und der Hintergrund platziert, das Licht und es gibt Nodes für die Sounds. Im Code werden die Item-Boxen und die Goombas erstellt, da diese Variabel eingestellt werden können, außerdem Mario und die Kamera bekommt ihre Komponenten. 	   	|
|4. Scriptcomponents       	|Die Positionsfindung der Boxen und der Goombas erfolgt über den ScriptComponent SetPosition, der eine Position aus den verfügbaren Positionen (also denen auf dem Boden) aussucht und dafür sorgt, dass nichts übereinander / ineinander spawnt.   	|
|5. Extend                 	|Die Klassen Mario, Item, Goomba und Coin extenden ƒ.Node, die Klasse SetPosition extendet ƒ.CustomComponentScript.    	|
|6. Sound                  	|Mario macht einen Sound beim Springen, die Coins machen einen Sound wenn sie gespawnt werden und es gibt verschiedenene Sounds je nach dem ob der Spieler gewinnt oder verliert.   	|
|7. VUI                   	|Das VUI zeigt die aktuelle Punktzahl und die verbleibende Zeit als Countdown an.  	|
|8. Event-System           	|Wenn irgendwo im Code festgestellt wird, dass das Spiel vorbei ist (Mario hat eine negative y-Position, alle Goombas sind heruntergefallen, die Zeit ist abgelaufen), triggert der jeweilige Part das gameEnd-Event und liefert entsprechende Informationen mit Hilfe der Event.Detail - Eigenschaft des CustomEvent-Objekts.   	|
|9. External Data          	|Über die Datei config.json können die Anzahl der Boxen, die Anzahl der Gegner und die zur Verfügung stehende Zeit verändert werden.  	|
|A. Light                  	|Da es in Supermario weder Licht und Schatten gibt, habe ich mich für ein einfaches Ambient-Light entschieden.   	|
|B. Physics                	|       Mario, die Goombas, die Item-Boxen und der Boden verwenden RigidBodys. Die Goombas und die Item-Boxen registrieren Kollisionen mit Mario und triggern entsprechendes Verhalten (Coins spawnen, Änderung des State-Machine States). 
       Mario springt durch die applyLinearImpulse Methode des RigidBody.    	|
|C. Net                    	|  / 	|
|D. State Machines         	|Das Verhalten der Goombas wird durch eine ComponentStateMachine gesteuert, mit den States Walk, Fight und Die.    	|
|E. Animation             	|Mario und die Goombas haben eine Sprite-Animation. Die Münzen werden durch eine normale Animation bewegt.    	|