<?xml version="1.0" encoding="UTF-8"?>
<tileset version="1.10" tiledversion="1.11.0" name="char-idle" tilewidth="50" tileheight="37" tilecount="9" columns="0">
 <editorsettings>
  <export target="player-running.json" format="json"/>
 </editorsettings>
 <grid orientation="orthogonal" width="1" height="1"/>
 <tile id="0" type="PlayerCharacter">
  <properties>
   <property name="tile-group" value="idle"/>
  </properties>
  <image source="Adventurer-1.5/Individual Sprites/adventurer-idle-02.png" width="50" height="37"/>
 </tile>
 <tile id="1" type="PlayerCharacter">
  <properties>
   <property name="tile-group" value="idle"/>
  </properties>
  <image source="Adventurer-1.5/Individual Sprites/adventurer-idle-00.png" width="50" height="37"/>
 </tile>
 <tile id="2" type="PlayerCharacter">
  <properties>
   <property name="tile-group" value="idle"/>
  </properties>
  <image source="Adventurer-1.5/Individual Sprites/adventurer-idle-01.png" width="50" height="37"/>
  <animation>
   <frame tileid="0" duration="150"/>
   <frame tileid="1" duration="150"/>
   <frame tileid="2" duration="150"/>
  </animation>
 </tile>
 <tile id="4" type="PlayerCharacter">
  <properties>
   <property name="tile-group" value="running"/>
  </properties>
  <image source="../public/assets/char/run/adventurer-run-00.png" width="50" height="37"/>
  <objectgroup draworder="index" id="2">
   <object id="5" x="17" y="8" width="20" height="28"/>
  </objectgroup>
 </tile>
 <tile id="5" type="PlayerCharacter">
  <properties>
   <property name="tile-group" value="running"/>
  </properties>
  <image source="../public/assets/char/run/adventurer-run-01.png" width="50" height="37"/>
  <objectgroup draworder="index" id="2">
   <object id="1" x="16" y="9" width="20" height="27"/>
  </objectgroup>
 </tile>
 <tile id="6" type="PlayerCharacter">
  <properties>
   <property name="tile-group" value="running"/>
  </properties>
  <image source="../public/assets/char/run/adventurer-run-02.png" width="50" height="37"/>
  <objectgroup draworder="index" id="2">
   <object id="1" x="16" y="11" width="20" height="25"/>
  </objectgroup>
 </tile>
 <tile id="7" type="PlayerCharacter">
  <properties>
   <property name="tile-group" value="running"/>
  </properties>
  <image source="../public/assets/char/run/adventurer-run-03.png" width="50" height="37"/>
  <objectgroup draworder="index" id="2">
   <object id="1" x="15.75" y="8.5" width="23" height="27.75"/>
   <object id="2" x="17" y="8" width="23" height="28"/>
  </objectgroup>
 </tile>
 <tile id="8" type="PlayerCharacter">
  <properties>
   <property name="tile-group" value="running"/>
  </properties>
  <image source="../public/assets/char/run/adventurer-run-04.png" width="50" height="37"/>
  <objectgroup draworder="index" id="2">
   <object id="1" x="16" y="9" width="20" height="27"/>
  </objectgroup>
 </tile>
 <tile id="9" type="PlayerCharacter">
  <properties>
   <property name="tile-group" value="running"/>
  </properties>
  <image source="../public/assets/char/run/adventurer-run-05.png" width="50" height="37"/>
  <objectgroup draworder="index" id="2">
   <object id="1" x="16" y="11" width="20" height="25"/>
  </objectgroup>
  <animation>
   <frame tileid="4" duration="150"/>
   <frame tileid="5" duration="150"/>
   <frame tileid="6" duration="150"/>
   <frame tileid="7" duration="150"/>
   <frame tileid="8" duration="150"/>
   <frame tileid="9" duration="150"/>
  </animation>
 </tile>
</tileset>
