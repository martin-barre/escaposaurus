/////////////////////////////////////////////////////////////
/// Escapausorus v1 (2020)
///	A quick and dirty framework to create small adventure game (certified vanilla JS)
/// Author: Stéphanie Mader (http://smader.interaction-project.net)
/// GitHub: https://github.com/RedNaK/escaposaurus
///	Licence: MIT
////////////////////////////////////////////////////////////

/*
 * HERE IS THE CONFIGURATION OF THE GAME
 */

// either online with VOD server and JSON load of data either local
var isLocal = true;
var gameRoot = "./";
var gameDataRoot = gameRoot + "escaposaurus_gamedata/";
var videoRoot = gameDataRoot + "videos/";

// caller app
var contactVideoRoot = videoRoot + "contactVideo/";

// full path to intro / outro video
var introVideoPath = videoRoot + "introVideo/intro.mp4";
var missingVideoPath = videoRoot + "contactVideo/missing/final.mp4";
var epilogueVideoPath = videoRoot + "epilogueVideo/epiloguecredit.mp4";

// udisk JSON path
var udiskRoot = gameDataRoot + "udisk/";

// for online use only
// var udiskJSONPath = gameRoot+"escaposaurus_gamedata/udisk.json";
// var udiskJSONPath = "/helper_scripts/accessJSON_udisk.php";

var udiskData = {
  root: {
    folders: [
      {
        foldername: "Grange",
        files: [
          "cloture.png",
          "moutons.png",
          "paille.png",
          "sujet_test.png",
        ],
      },
      {
        foldername: "Hangar",
        password: "394297",
        sequence: 0,
        files: [
          "chien.mp4",
          "cuterie_charles.png",
          "kidnapping_mouton.png",
          "memo_fermier.png",
          "sifflet.mp4",
        ],
      },
      {
        foldername: "Chien",
        password: "01011",
        sequence: 1,
        files: [
          "code_morse.png",
          "lettre_cuterie_charles.png",
          "recette_bouzelouf.png"
        ],
      },
      {
        foldername: "Exterieur",
        password: "ragout",
        sequence: 2,
        files: [],
      },
    ],
    files: [],
  },
};

var gameTitle = "The promised moutonland";
var gameMissionCall =
  "Vous vivez paisiblement votre vie de mouton à la ferme, broutant de l’herbe et regardant les avions passer. Tout à coup, votre ami le rat arrive en courant vers vous, paniqué. Vous sentez dès lors que quelque chose se trame… Sortez votre journal et préparez-vous à prendre des notes, votre grande escapade commence !";
var gameMissionAccept = "&raquo;&raquo; JOUER &laquo;&laquo;";

var gameCredit = `<br/><strong>Un jeu conçu et réalisé par</strong><br/><br/>
                  Thos Jolan d'Artagnan - Conception sonore<br/>
                  Jammoul Ahmad - Conception visuelle<br/>
                  Decoux Nathan - Ergonomie / UX<br/>
                  Li John - Game design<br/>
                  Godéré Roxane - Management de projet<br/>
                  Barré Martin - Programmation`;
var gameThanks = `<strong>Remerciements</strong><br/> ;)`;

var OSName = "The promised moutonland";
var explorerName = "LIEUX";
var callerAppName = "CONTACTS";

// titles of video windows
var titleData = {};
titleData.introTitle = "INTRODUCTION";
titleData.epilogueTitle = "EPILOGUE";
titleData.callTitle = "Discussion";

// change of caller app prompt for each sequence
var promptDefault = "Rien à demander, ne pas les déranger";
var prompt = [];
prompt[0] = "Prendre contact";
prompt[1] = "Prendre contact";
prompt[2] = "Prendre contact";
prompt[3] = "";

// when the sequence number reach this, the player win, the missing contact is added and the player can call them
var sequenceWin = 3;

// before being able to call the contacts, the player has to open the main clue of the sequence as indicated in this array
// if you put in the string "noHint", player will be able to immediatly call the contact at the beginning of the sequence
// if you put "none" or anything that is not an existing filename, the player will NOT be able to call the contacts during this sequence
var seqMainHint = [];
seqMainHint[0] = "moutons.png";
seqMainHint[1] = "sifflet.mp4"; // if you put anything that is not an existing filename of the udisk, the player will never be able to call any contacts or get helps during this sequence
seqMainHint[2] = "code_morse.png";
seqMainHint[3] = "noHint";

// contact list, vid is the name of their folder in the videoContact folder,
// then the game autoload the video named seq%number of the current sequence%, e.g. seq0.MP4 for the first sequence (numbered 0 because computer science habits)
// their img need to be placed in their video folder, username is their displayed name
var normalContacts = [
  {
    vid: "Mouton 1",
    vod_folder: "",
    username: "Mouton camé",
    canal: "video",
    avatar: "mouton_came.png",
  },
  {
    vid: "Mouton 2",
    vod_folder: "",
    username: "Mouton intello",
    canal: "video",
    avatar: "mouton_intello.png",
  },
  {
    vid: "Mouton 3",
    vod_folder: "",
    username: "Mouton noir",
    canal: "video",
    avatar: "mouton_noir.png",
  },
  {
    vid: "Mouton 4",
    vod_folder: "",
    username: "Dinnerbone",
    canal: "video",
    avatar: "mouton_dinnerbone.png",
  },
  {
    vid: "Mouton 5",
    vod_folder: "",
    username: "Mouton rasé",
    canal: "video",
    avatar: "mouton_rase.png",
  },
  {
    vid: "Mouton 6",
    vod_folder: "",
    username: "Mouton paniqué",
    canal: "video",
    avatar: "mouton_panique.png",
  }
];

// second part of the list, contact that can help the player
var helperContacts = [
  {
    vid: "Rat",
    vod_folder: "",
    username: "Rat",
    canal: "video",
    avatar: "rat.png",
  }
];

// ce qui apparait quand on trouve le dernier élément du disque dur
finalStepAdded = "Évasion réussie.";

// the last call, it can be the person we find in the end or anyone else we call to end the quest, allows the game to know it is the final contact that is called and to proceed with the ending
var missingContact = {
  vid: "missing",
  vod_folder: "",
  username: "Rat",
  canal: "video",
  avatar: "rat.png",
};

/*Lou only send text message, they are stored here*/
var tips = {};
tips["Albert"] = [];
tips["Albert"][0] =
  "Je peux pas répondre à votre appel. Mais je peux vous répondre par écrit. Donc vous cherchez le surnom d'un guide ? Je crois que les contacts sont des guides justement, essayez peut-être de les appeler.";
tips["Albert"][1] = "";
tips["Albert"][2] = "";
tips["Albert"][3] =
  "Ah zut, un dossier verouillé sans infos dans scan mémo ? Y'a forcément un truc mnémotechnique facile à retenir ou retrouver. Les guides en disent quoi ?";

/*text for the instruction / solution windows*/
var instructionText = {};
instructionText.winState = "Vous avez réussi à quitter l'enclos et vous pouvez maintenant discuter avec le rat.";
instructionText.lackMainHint = "";
instructionText.password =
  "Vous devez trouver et entrer le mot de passe d'un des dossiers de la boite de droite.<br/>Vous pouvez trouver le mot de passe en appelant les contacts de la boite de gauche.<br/>Pour entrer un mot de passe, cliquez sur le nom d'un dossier et une fenêtre s'affichera <br/>pour que vous puissiez donner le mot de passe.";

/*please note the %s into the text that allow to automatically replace them with the right content according to which sequence the player is in*/
var solutionText = {};
solutionText.winState = "Si vous êtes sorti de l'enclos, le jeu est fini bravo.";
solutionText.lackMainHint = "Vous devez ouvrir le fichier <b>%s</b><br/>";
solutionText.password =
  "Vous devez déverouiller le lieu <b>%s1</b><br/>avec le mot de passe : <b>%s2</b><br/>";
