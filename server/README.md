

==TODOs==

===High(-ish) priority===
!!Support websockets!!
Improve UX
	-indicate turns
	-status message
		"Waiting for {opponent} to make their move"
		"{opponent} played {move} for {points} points! Make your move."
Remove/resign from games
Better error alerts.
Make mobile friendly.
Add functionalities
	-challenge
	-swap
	-shuffle
	-reset
Redirect to player page if already logged in
	-middleware on static file?
	-avoid static file and render objects with Jade?
Make app configurable
	-mongodb connection string

===Future work===
Internationalize
Allow users to make board configurable
	-grabbag tiles
	-starting hand size
	-board dimensions
	-score modifier positions

====Ideas====
=====Mechanics=====
hidden modifiers
non-score tile modifiers

=====Effects=====
-player skips next turn (Time Walk)
-steal some percentage of points

Sockets
connect
clients[username]

on game move
update clients[players] (ifdef)