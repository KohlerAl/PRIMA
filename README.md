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
============================================

|                         |                                                                                                                                                                                                                                                                                                                                                                                          |
|-------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|  1. Units and Positions | 0 ist in der unteren linken Ecke des Spielfelds, das ermöglicht einfaches Positionieren von den einzelnen Komponenten und vereinfacht die Überprüfung ob Marion oder die Goombas heruntergefallen sind. 1 ist eine Item- oder Boden-Box mit der Größe 1 x 1 x 1 Meter.                                                                                                                   |
|  2. Hierarchy           | - Camera<br>- Environment<br>     - Boxes<br>     - Background<br>     - Ground<br>- Opponents<br>- Avatar<br>- Light<br>- Sounds<br><br>-> Grundstruktur und "Andockstellen" für den Code werden im Editor erstellt, zudem das grundlegende Level und das Licht, damit es etwas gibt womit gearbeitet werden kann.                                                                      |
| 3. Editor               | Im Editor wird die Grundstruktur des Spiels erstellt. Dazu gehören die Parent-Nodes für die Goombas, Mario und die Item-Boxen. Zudem werden die einzelnen Boden-Stücke und der Hintergrund platziert, das Licht und es gibt Nodes für die Sounds. Im Code werden die Item-Boxen und die Goombas erstellt, da die Anzahl Variabel ist, dasselbe gilt für Mario und die Kamera-Components. |
| 4. Scriptcomponents     | Die Positionsfindung der Boxen und der Goombas erfolgt über den ScriptComponent SetPosition, der eine Position aus den verfügbaren Positionen aussucht und dafür sorgt, das nichts ineinander spawnt.                                                                                                                                                                                    |
| 5. Extend               | Die Klassen Mario, Item, Goomba und Coin extenden ƒ.Node, die Klasse setPosition extendet ƒ.ComponentScript.                                                                                                                                                                                                                                                                             |
|  6. Sound               | Mario macht einen Sound wenn er springt, die Coins machen einen Sound wenn sie gespawnt werden und es gibt unterschiedliche Sounds wenn der Spieler gewinnt oder verliert.                                                                                                                                                                                                               |
| 7. VUI                  | Das VUI zeigt die aktuelle Punktzahl und die verbleibende Zeit als Countdown an.                                                                                                                                                                                                                                                                                                         |
| 8. Event-System         | Wenn irgendwo im Code festgestellt wird, dass das Spiel vorbei ist (Mario hat eine negative y-Position, alle Goombas sind heruntergefallen, die Zeit ist abgelaufen), triggert der jeweilige Part das gameEnd-Event und liefert mit Event.Detail weitere Informationen.                                                                                                                  |
| 9. External Data        | In Supermario gibt es kein Licht und Schatten, alles ist gleichmäßig beleuchtet. Daher habe ich mich bei der Beleuchtung für ein einfaches Ambient-Light entschieden.                                                                                                                                                                                                                    |
| A. Light                | In Supermario gibt es keine Schatten, daher habe ich mich für ein einfaches Ambient-Light entschieden.                                                                                                                                                                                                                                                                                   |
| B. Physics              | Mario, die Goombas, die Item-Boxen und der Boden verwenden RigidBodys. Die Goombas und die Item-Boxen registrieren Kollisionen mit Mario und triggern entsprechendes Verhalten                                                                                                                                                                                                           |
| D. StateMachines        | Das Verhalten der Goombas wird durch eine ComponentStateMachine gesteuert, mit den States Walk, Fight und Die.                                                                                                                                                                                                                                                                           |
| E. Animation            | Mario und die Goombas haben eine Sprite-Animation. Die Münzen werden durch eine normale Animation bewegt.                                                                                                                                                                                                                                                                                |
|                         |                                                                                                                                                                                                                                                                                                                                                                                          |
